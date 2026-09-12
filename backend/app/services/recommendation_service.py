from typing import List, Dict, Any, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.job import Job, Application
from app.models.candidate import CandidateProfile
from app.services.match_service import (
    get_candidate_skills_matrix,
    get_latest_resume_text,
    calculate_and_store_match
)
from app.ai.ai_skill_recommender import analyze_skill_gap


def get_skill_gap_analysis(db: Session, job_id: int, candidate_id: int) -> Dict[str, Any]:
    """
    Generates Skill Gap Analysis between candidate and job:
    Matched Skills, Missing Skills, Skill Coverage %, and Local Learning Recommendations.
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
            detail=f"Candidate profile for ID {candidate_id} not found."
        )

    cand_skills = get_candidate_skills_matrix(db, candidate)
    job_skills = [{"skill_name": js.skill_name, "skill_type": js.skill_type} for js in job.skills]

    gap_data = analyze_skill_gap(
        candidate_skills=cand_skills,
        job_skills=job_skills,
        job_description=job.description
    )

    return {
        "job_id": job.id,
        "job_title": job.title,
        "candidate_id": candidate.id,
        "matched_skills": gap_data["matched_skills"],
        "missing_skills": gap_data["missing_skills"],
        "preferred_skills": gap_data["preferred_skills"],
        "skill_coverage": gap_data["skill_coverage"],
        "learning_recommendations": gap_data["learning_recommendations"]
    }


def get_recommended_jobs_for_candidate(db: Session, current_user: User) -> Dict[str, Any]:
    """
    Analyzes candidate profile against all active jobs in system.
    Calculates multi-factor AI match scores and returns top recommendations sorted descending.
    """
    candidate = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate profile not found. Please initialize candidate profile."
        )

    active_jobs = db.query(Job).filter(Job.status == "active").all()
    if not active_jobs:
        return {
            "total_recommendations": 0,
            "candidate_id": candidate.id,
            "candidate_name": current_user.name,
            "recommendations": []
        }

    recommendations_list = []
    for job in active_jobs:
        # Calculate/retrieve match score
        match_data = calculate_and_store_match(db, job_id=job.id, candidate_id=candidate.id)
        gap_data = get_skill_gap_analysis(db, job_id=job.id, candidate_id=candidate.id)

        # Check if candidate has applied
        app_record = db.query(Application).filter(
            Application.job_id == job.id,
            Application.candidate_id == candidate.id
        ).first()

        recommendations_list.append({
            "job_id": job.id,
            "title": job.title,
            "company_name": job.company.name if job.company else "Company",
            "company_location": job.company.location if job.company else job.location,
            "location": job.location,
            "job_type": job.job_type,
            "min_experience": job.min_experience,
            "salary_min": job.salary_min,
            "salary_max": job.salary_max,
            "match_score": match_data["final_score"],
            "skill_score": match_data["skill_score"],
            "experience_score": match_data["experience_score"],
            "education_score": match_data["education_score"],
            "similarity_score": match_data["similarity_score"],
            "skill_coverage": gap_data["skill_coverage"],
            "matched_skills": gap_data["matched_skills"],
            "missing_skills": gap_data["missing_skills"],
            "has_applied": bool(app_record),
            "application_status": app_record.status if app_record else None
        })

    # Sort descending by match score
    recommendations_list.sort(key=lambda x: x["match_score"], reverse=True)

    return {
        "total_recommendations": len(recommendations_list),
        "candidate_id": candidate.id,
        "candidate_name": current_user.name,
        "recommendations": recommendations_list
    }
