from typing import List, Dict, Any, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.job import Job, JobSkill, Application
from app.models.candidate import CandidateProfile, CandidateSkill
from app.models.resume import Resume
from app.models.candidate_score import CandidateScore
from app.ai.ai_job_matcher import calculate_ai_job_match


def get_candidate_skills_matrix(db: Session, candidate: CandidateProfile) -> List[str]:
    """Retrieves all candidate skills from candidate_skills table + latest resume extracted skills."""
    skills_set = {s.skill_name for s in candidate.skills if s.skill_name}

    latest_resume = db.query(Resume).filter(
        Resume.candidate_id == candidate.id
    ).order_by(Resume.uploaded_at.desc()).first()

    if latest_resume and latest_resume.extracted_skills:
        for r_skill in latest_resume.extracted_skills:
            if r_skill.skill_name:
                skills_set.add(r_skill.skill_name)

    return list(skills_set)


def get_latest_resume_text(db: Session, candidate_id: int) -> str:
    """Retrieves candidate's latest resume extracted text."""
    latest_resume = db.query(Resume).filter(
        Resume.candidate_id == candidate_id
    ).order_by(Resume.uploaded_at.desc()).first()

    return latest_resume.extracted_text if latest_resume and latest_resume.extracted_text else ""


def calculate_and_store_match(db: Session, job_id: int, candidate_id: int) -> Dict[str, Any]:
    """
    Calculates AI match score breakdown for a specific candidate and job.
    Upserts the score in candidate_scores table.
    """
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job with ID {job_id} not found."
        )

    candidate = db.query(CandidateProfile).filter(CandidateProfile.id == candidate_id).first()
    if not candidate:
        # Fallback query by user_id if candidate_id was passed as user_id
        candidate = db.query(CandidateProfile).filter(CandidateProfile.user_id == candidate_id).first()

    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Candidate profile for ID {candidate_id} not found."
        )

    # Prepare input data
    cand_skills = get_candidate_skills_matrix(db, candidate)
    resume_text = get_latest_resume_text(db, candidate.id)
    job_skills = [
        {"skill_name": js.skill_name, "skill_type": js.skill_type}
        for js in job.skills
    ]

    # Calculate match
    match_result = calculate_ai_job_match(
        candidate_profile=candidate,
        candidate_skills_list=cand_skills,
        latest_resume_text=resume_text,
        job=job,
        job_skills_list=job_skills
    )

    # Upsert DB Record in candidate_scores
    score_record = db.query(CandidateScore).filter(
        CandidateScore.candidate_id == candidate.id,
        CandidateScore.job_id == job.id
    ).first()

    if score_record:
        score_record.skill_score = match_result["skill_score"]
        score_record.experience_score = match_result["experience_score"]
        score_record.education_score = match_result["education_score"]
        score_record.similarity_score = match_result["similarity_score"]
        score_record.final_score = match_result["final_score"]
    else:
        score_record = CandidateScore(
            candidate_id=candidate.id,
            job_id=job.id,
            skill_score=match_result["skill_score"],
            experience_score=match_result["experience_score"],
            education_score=match_result["education_score"],
            similarity_score=match_result["similarity_score"],
            final_score=match_result["final_score"]
        )
        db.add(score_record)

    db.commit()
    db.refresh(score_record)

    match_result["id"] = score_record.id
    match_result["created_at"] = score_record.created_at
    match_result["updated_at"] = score_record.updated_at
    return match_result


def get_match_score(db: Session, job_id: int, candidate_id: int) -> Dict[str, Any]:
    """Retrieves match score breakdown, computing it if not yet stored."""
    candidate = db.query(CandidateProfile).filter(CandidateProfile.id == candidate_id).first()
    if not candidate:
        candidate = db.query(CandidateProfile).filter(CandidateProfile.user_id == candidate_id).first()

    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate profile not found."
        )

    score_record = db.query(CandidateScore).filter(
        CandidateScore.candidate_id == candidate.id,
        CandidateScore.job_id == job_id
    ).first()

    if not score_record:
        return calculate_and_store_match(db, job_id, candidate.id)

    # Re-evaluate detailed matched/missing skills
    job = db.query(Job).filter(Job.id == job_id).first()
    cand_skills = get_candidate_skills_matrix(db, candidate)
    resume_text = get_latest_resume_text(db, candidate.id)
    job_skills = [{"skill_name": js.skill_name, "skill_type": js.skill_type} for js in job.skills] if job else []

    full_calc = calculate_ai_job_match(candidate, cand_skills, resume_text, job, job_skills) if job else {}

    return {
        "id": score_record.id,
        "candidate_id": candidate.id,
        "job_id": job_id,
        "skill_score": score_record.skill_score,
        "experience_score": score_record.experience_score,
        "education_score": score_record.education_score,
        "similarity_score": score_record.similarity_score,
        "final_score": score_record.final_score,
        "matched_skills": full_calc.get("matched_skills", []),
        "missing_skills": full_calc.get("missing_skills", []),
        "created_at": score_record.created_at,
        "updated_at": score_record.updated_at,
        "explanation": "Your score is based on skills, experience, education and resume relevance.",
        "ai_disclaimer": "AI Recommendation – Final hiring decision remains with the recruiter."
    }


def get_candidate_rankings_for_job(db: Session, job_id: int) -> Dict[str, Any]:
    """
    Ranks candidates for a job:
    1. Identifies applicants or registered candidates.
    2. Calculates/updates scores.
    3. Sorts descending by final_score.
    4. Assigns ranks (1, 2, 3...) and medals (🥇, 🥈, 🥉) for top 3.
    """
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job with ID {job_id} not found."
        )

    # Fetch applicants for the job
    applications = db.query(Application).filter(Application.job_id == job.id).all()
    candidate_ids = [app.candidate_id for app in applications]

    # If no explicit applicants, rank all candidates in system for recruiter preview
    if not candidate_ids:
        all_candidates = db.query(CandidateProfile).all()
        candidate_ids = [c.id for c in all_candidates]

    rankings_list = []
    for c_id in candidate_ids:
        c_profile = db.query(CandidateProfile).filter(CandidateProfile.id == c_id).first()
        if not c_profile or not c_profile.user:
            continue

        match_data = calculate_and_store_match(db, job.id, c_id)

        # Get application status if present
        app_record = db.query(Application).filter(
            Application.job_id == job.id,
            Application.candidate_id == c_id
        ).first()

        rankings_list.append({
            "candidate_id": c_profile.id,
            "candidate_name": c_profile.user.name,
            "email": c_profile.user.email,
            "phone": c_profile.phone or c_profile.user.phone,
            "location": c_profile.location,
            "experience_years": c_profile.experience_years or 0,
            "application_status": app_record.status if app_record else "Not Applied",
            "skill_score": match_data["skill_score"],
            "experience_score": match_data["experience_score"],
            "education_score": match_data["education_score"],
            "similarity_score": match_data["similarity_score"],
            "final_score": match_data["final_score"],
            "matched_skills": match_data["matched_skills"],
            "missing_skills": match_data["missing_skills"]
        })

    # Sort candidates descending by final_score
    rankings_list.sort(key=lambda x: x["final_score"], reverse=True)

    # Assign ranks and medals
    medals = {1: "🥇", 2: "🥈", 3: "🥉"}
    for idx, item in enumerate(rankings_list, start=1):
        item["rank"] = idx
        item["medal"] = medals.get(idx, None)

    return {
        "job_id": job.id,
        "job_title": job.title,
        "total_candidates": len(rankings_list),
        "rankings": rankings_list,
        "ai_disclaimer": "AI Recommendation – Final hiring decision remains with the recruiter."
    }
