from typing import List, Dict, Any, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.job import Job
from app.models.candidate import CandidateProfile
from app.models.interview_question import InterviewQuestion, QuestionCategoryEnum
from app.ai.ai_interview_generator import interview_generator
from app.services.recommendation_service import get_skill_gap_analysis
from app.services.match_service import get_candidate_skills_matrix

def generate_and_save_interview_questions(
    db: Session,
    job_id: int,
    candidate_id: int,
    num_questions: int = 10
) -> Dict[str, Any]:
    """
    Generates tailored interview questions for candidate & job,
    persists them in interview_questions table, and returns categorized output.
    """
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job with ID {job_id} not found."
        )

    candidate = db.query(CandidateProfile).filter(CandidateProfile.id == candidate_id).first()
    if not candidate:
        candidate = db.query(CandidateProfile).filter(CandidateProfile.user_id == candidate_id).first()

    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Candidate with ID {candidate_id} not found."
        )

    # 1. Fetch skill gap analysis & skills matrix
    gap_data = get_skill_gap_analysis(db, job_id=job.id, candidate_id=candidate.id)
    cand_skills = get_candidate_skills_matrix(db, candidate)
    req_skills = [js.skill_name for js in job.skills if js.skill_type == "required"]
    if not req_skills:
        req_skills = [js.skill_name for js in job.skills]

    # Projects / Resume summary
    projects_info = None
    if candidate.resumes:
        latest_resume = candidate.resumes[0]
        if latest_resume.extracted_text:
            projects_info = latest_resume.extracted_text[:200]

    # 2. Call AI interview generator
    raw_questions = interview_generator.generate_questions(
        job_title=job.title,
        required_skills=req_skills,
        candidate_skills=cand_skills,
        missing_skills=gap_data.get("missing_skills", []),
        experience_years=candidate.experience_years or 0,
        projects_info=projects_info,
        num_questions=num_questions
    )

    # 3. Clean up previous generated questions for this (job_id, candidate_id)
    db.query(InterviewQuestion).filter(
        InterviewQuestion.candidate_id == candidate.id,
        InterviewQuestion.job_id == job.id
    ).delete(synchronize_session=False)

    # 4. Insert into interview_questions table
    db_questions = []
    for item in raw_questions:
        iq = InterviewQuestion(
            candidate_id=candidate.id,
            job_id=job.id,
            category=item["category"],
            question=item["question"]
        )
        db.add(iq)
        db_questions.append(iq)

    db.commit()

    for iq in db_questions:
        db.refresh(iq)

    return get_candidate_job_questions(db, job_id=job.id, candidate_id=candidate.id)


def get_candidate_job_questions(
    db: Session,
    job_id: int,
    candidate_id: int
) -> Dict[str, Any]:
    """
    Retrieves interview questions for (candidate_id, job_id).
    Auto-generates if no questions exist yet.
    """
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job with ID {job_id} not found."
        )

    candidate = db.query(CandidateProfile).filter(CandidateProfile.id == candidate_id).first()
    if not candidate:
        candidate = db.query(CandidateProfile).filter(CandidateProfile.user_id == candidate_id).first()

    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Candidate with ID {candidate_id} not found."
        )

    db_questions = db.query(InterviewQuestion).filter(
        InterviewQuestion.candidate_id == candidate.id,
        InterviewQuestion.job_id == job.id
    ).order_by(InterviewQuestion.id.asc()).all()

    if not db_questions:
        return generate_and_save_interview_questions(db, job_id=job.id, candidate_id=candidate.id, num_questions=10)

    by_cat = {
        "Technical": [],
        "HR": [],
        "Project": [],
        "Skill-Based": []
    }
    all_q_list = []

    for q in db_questions:
        cat_str = str(q.category)
        if hasattr(q.category, 'value'):
            cat_str = q.category.value
        
        q_dict = {
            "id": q.id,
            "candidate_id": q.candidate_id,
            "job_id": q.job_id,
            "category": cat_str,
            "question": q.question,
            "created_at": q.created_at
        }
        all_q_list.append(q_dict)
        if cat_str in by_cat:
            by_cat[cat_str].append(q_dict)
        else:
            by_cat[cat_str] = [q_dict]

    return {
        "candidate_id": candidate.id,
        "job_id": job.id,
        "job_title": job.title,
        "total_questions": len(all_q_list),
        "questions_by_category": by_cat,
        "questions": all_q_list
    }
