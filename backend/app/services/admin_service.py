from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from fastapi import HTTPException, status

from app.models.user import User
from app.models.candidate import CandidateProfile, CandidateSkill
from app.models.recruiter import RecruiterProfile
from app.models.company import Company
from app.models.job import Job, JobSkill, Application
from app.models.resume import Resume
from app.models.candidate_score import CandidateScore

def get_admin_dashboard_stats(db: Session) -> Dict[str, int]:
    """Retrieve system overview counts for admin dashboard cards."""
    total_users = db.query(User).count()
    total_candidates = db.query(User).filter(User.role == "candidate").count()
    total_recruiters = db.query(User).filter(User.role == "recruiter").count()
    total_companies = db.query(Company).count()
    active_jobs = db.query(Job).filter(Job.status == "active").count()
    total_applications = db.query(Application).count()
    resumes_processed = db.query(Resume).count()

    return {
        "total_users": total_users,
        "total_candidates": total_candidates,
        "total_recruiters": total_recruiters,
        "total_companies": total_companies,
        "active_jobs": active_jobs,
        "total_applications": total_applications,
        "resumes_processed": resumes_processed
    }

def get_admin_analytics_data(db: Session) -> Dict[str, Any]:
    """Aggregate platform analytics for Recharts visualizations."""
    
    # 1. Applications Per Month
    monthly_apps_raw = db.query(
        func.date_format(Application.applied_at, '%Y-%m').label('month'),
        func.count(Application.id).label('count')
    ).group_by('month').order_by('month').all()

    monthly_apps = [{"month": row.month or "Unknown", "count": row.count} for row in monthly_apps_raw]
    if not monthly_apps:
        monthly_apps = [{"month": "2026-09", "count": db.query(Application).count()}]

    # 2. Users by Role
    role_counts_raw = db.query(
        User.role,
        func.count(User.id).label('count')
    ).group_by(User.role).all()
    
    users_by_role = [{"role": (r[0] or "candidate").title(), "count": r[1]} for r in role_counts_raw]

    # 3. Jobs by Type
    job_type_raw = db.query(
        Job.job_type,
        func.count(Job.id).label('count')
    ).group_by(Job.job_type).all()

    jobs_by_type = []
    for r in job_type_raw:
        jt_str = str(r[0].value) if hasattr(r[0], 'value') else str(r[0])
        formatted_jt = jt_str.replace('_', ' ').title()
        jobs_by_type.append({"job_type": formatted_jt, "count": r[1]})

    # 4. Application Status Breakdown
    app_status_raw = db.query(
        Application.status,
        func.count(Application.id).label('count')
    ).group_by(Application.status).all()

    app_status_list = []
    for r in app_status_raw:
        st_str = str(r[0].value) if hasattr(r[0], 'value') else str(r[0])
        app_status_list.append({"status": st_str.title(), "count": r[1]})

    # 5. Candidate Score Distribution
    scores = db.query(CandidateScore.final_score).all()
    distribution = {
        "0 - 20%": 0,
        "21 - 40%": 0,
        "41 - 60%": 0,
        "61 - 80%": 0,
        "81 - 100%": 0
    }
    for (sc,) in scores:
        if sc is not None:
            val = float(sc)
            if val <= 20: distribution["0 - 20%"] += 1
            elif val <= 40: distribution["21 - 40%"] += 1
            elif val <= 60: distribution["41 - 60%"] += 1
            elif val <= 80: distribution["61 - 80%"] += 1
            else: distribution["81 - 100%"] += 1

    score_dist_list = [{"range": k, "count": v} for k, v in distribution.items()]

    # 6. Top Skills Aggregation
    cand_skills_raw = db.query(
        CandidateSkill.skill_name,
        func.count(CandidateSkill.id).label('count')
    ).group_by(CandidateSkill.skill_name).order_by(func.count(CandidateSkill.id).desc()).limit(10).all()

    top_skills_list = [{"skill": r[0].title(), "count": r[1]} for r in cand_skills_raw]

    if not top_skills_list:
        # Fallback to job skills if candidate skills list empty
        job_skills_raw = db.query(
            JobSkill.skill_name,
            func.count(JobSkill.id).label('count')
        ).group_by(JobSkill.skill_name).order_by(func.count(JobSkill.id).desc()).limit(10).all()
        top_skills_list = [{"skill": r[0].title(), "count": r[1]} for r in job_skills_raw]

    return {
        "applications_per_month": monthly_apps,
        "users_by_role": users_by_role,
        "jobs_by_type": jobs_by_type,
        "application_status": app_status_list,
        "candidate_score_distribution": score_dist_list,
        "top_skills": top_skills_list
    }

def get_admin_users(
    db: Session,
    search: Optional[str] = None,
    role: Optional[str] = None
) -> List[Dict[str, Any]]:
    """Retrieve all system users with optional search and role filtering."""
    query = db.query(User)

    if role and role.lower() != 'all':
        query = query.filter(User.role == role.lower())

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (User.name.ilike(search_pattern)) | 
            (User.email.ilike(search_pattern)) |
            (User.company.ilike(search_pattern))
        )

    users = query.order_by(User.id.desc()).all()
    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "company": u.company,
            "is_active": u.is_active,
            "created_at": u.created_at
        }
        for u in users
    ]

def toggle_user_status(db: Session, user_id: int, is_active: bool) -> Dict[str, Any]:
    """Toggle user active state (Deactivate/Activate) safely without breaking FKs."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"User with ID {user_id} not found.")

    user.is_active = is_active
    db.commit()
    db.refresh(user)

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "company": user.company,
        "is_active": user.is_active,
        "created_at": user.created_at
    }

def get_admin_jobs(
    db: Session,
    search: Optional[str] = None,
    status_filter: Optional[str] = None
) -> List[Dict[str, Any]]:
    """Retrieve all system jobs with optional title search and status filtering."""
    query = db.query(Job)

    if status_filter and status_filter.lower() != 'all':
        query = query.filter(Job.status == status_filter.lower())

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Job.title.ilike(search_pattern)) | 
            (Job.description.ilike(search_pattern)) |
            (Job.location.ilike(search_pattern))
        )

    jobs = query.order_by(Job.id.desc()).all()
    res = []
    for j in jobs:
        st_str = str(j.status.value) if hasattr(j.status, 'value') else str(j.status)
        jt_str = str(j.job_type.value) if hasattr(j.job_type, 'value') else str(j.job_type)
        res.append({
            "id": j.id,
            "title": j.title,
            "company_name": j.company.name if j.company else "Company",
            "status": st_str,
            "job_type": jt_str,
            "location": j.location,
            "created_at": j.created_at
        })
    return res

def update_admin_job_status(db: Session, job_id: int, new_status: str) -> Dict[str, Any]:
    """Update status of a job (e.g. close inappropriate or expired jobs)."""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail=f"Job with ID {job_id} not found.")

    job.status = new_status.lower()
    db.commit()
    db.refresh(job)

    st_str = str(job.status.value) if hasattr(job.status, 'value') else str(job.status)
    jt_str = str(job.job_type.value) if hasattr(job.job_type, 'value') else str(job.job_type)

    return {
        "id": job.id,
        "title": job.title,
        "company_name": job.company.name if job.company else "Company",
        "status": st_str,
        "job_type": jt_str,
        "location": job.location,
        "created_at": job.created_at
    }

def get_admin_applications(
    db: Session,
    search: Optional[str] = None,
    status_filter: Optional[str] = None
) -> List[Dict[str, Any]]:
    """Retrieve all platform job applications with candidate details and match scores."""
    query = db.query(Application)

    if status_filter and status_filter.lower() != 'all':
        query = query.filter(Application.status == status_filter.lower())

    apps = query.order_by(Application.id.desc()).all()
    res = []

    for a in apps:
        cand_name = "Candidate"
        if a.candidate and a.candidate.user:
            cand_name = a.candidate.user.name

        job_title = a.job.title if a.job else "Job"
        app_st = str(a.status.value) if hasattr(a.status, 'value') else str(a.status)

        # Retrieve match score if calculated
        score_rec = db.query(CandidateScore).filter(
            CandidateScore.job_id == a.job_id,
            CandidateScore.candidate_id == a.candidate_id
        ).first()

        match_score = score_rec.final_score if score_rec else None

        if search:
            s_lower = search.lower()
            if s_lower not in cand_name.lower() and s_lower not in job_title.lower():
                continue

        res.append({
            "id": a.id,
            "job_id": a.job_id,
            "job_title": job_title,
            "candidate_id": a.candidate_id,
            "candidate_name": cand_name,
            "status": app_st,
            "match_score": match_score,
            "applied_at": a.applied_at
        })

    return res
