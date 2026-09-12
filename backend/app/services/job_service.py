import math
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from app.models.job import Job, JobSkill, Application, JobStatusEnum, JobTypeEnum, SkillTypeEnum
from app.models.company import Company
from app.schemas.job import JobCreate, JobUpdate, JobResponse, JobListResponse, JobSkillResponse, CompanySummaryResponse

def create_job(db: Session, recruiter_id: int, company_id: int, job_in: JobCreate) -> Job:
    job = Job(
        recruiter_id=recruiter_id,
        company_id=company_id,
        title=job_in.title,
        description=job_in.description,
        location=job_in.location,
        job_type=job_in.job_type,
        min_experience=job_in.min_experience,
        salary_min=job_in.salary_min,
        salary_max=job_in.salary_max,
        deadline=job_in.deadline,
        status=job_in.status
    )
    db.add(job)
    db.flush()

    for skill_data in job_in.skills:
        skill = JobSkill(
            job_id=job.id,
            skill_name=skill_data.skill_name.strip(),
            skill_type=skill_data.skill_type
        )
        db.add(skill)

    db.commit()
    db.refresh(job)
    return job

def update_job(db: Session, job: Job, job_in: JobUpdate) -> Job:
    update_data = job_in.model_dump(exclude_unset=True)
    skills_data = update_data.pop("skills", None)

    for field, value in update_data.items():
        setattr(job, field, value)

    if skills_data is not None:
        # Delete existing skills and recreate
        db.query(JobSkill).filter(JobSkill.job_id == job.id).delete()
        for skill_data in skills_data:
            skill_name = skill_data.get("skill_name") if isinstance(skill_data, dict) else skill_data.skill_name
            skill_type = skill_data.get("skill_type", SkillTypeEnum.REQUIRED) if isinstance(skill_data, dict) else skill_data.skill_type
            if skill_name:
                skill = JobSkill(
                    job_id=job.id,
                    skill_name=skill_name.strip(),
                    skill_type=skill_type
                )
                db.add(skill)

    db.commit()
    db.refresh(job)
    return job

def delete_job(db: Session, job: Job) -> None:
    db.delete(job)
    db.commit()

def format_job_response(db: Session, job: Job, current_candidate_id: Optional[int] = None) -> JobResponse:
    company_data = None
    if job.company:
        company_data = CompanySummaryResponse(
            id=job.company.id,
            name=job.company.name,
            industry=job.company.industry,
            location=job.company.location,
            website=job.company.website,
            logo_url=getattr(job.company, "logo_url", None)
        )

    skills_data = [
        JobSkillResponse(
            id=s.id,
            job_id=s.job_id,
            skill_name=s.skill_name,
            skill_type=s.skill_type,
            created_at=s.created_at
        )
        for s in job.skills
    ]

    apps_count = db.query(func.count(Application.id)).filter(Application.job_id == job.id).scalar() or 0

    has_applied = False
    if current_candidate_id:
        existing_app = db.query(Application).filter(
            Application.job_id == job.id,
            Application.candidate_id == current_candidate_id
        ).first()
        if existing_app:
            has_applied = True

    return JobResponse(
        id=job.id,
        recruiter_id=job.recruiter_id,
        company_id=job.company_id,
        title=job.title,
        description=job.description,
        location=job.location,
        job_type=job.job_type,
        min_experience=job.min_experience,
        salary_min=float(job.salary_min) if job.salary_min is not None else None,
        salary_max=float(job.salary_max) if job.salary_max is not None else None,
        deadline=job.deadline,
        status=job.status,
        created_at=job.created_at,
        updated_at=job.updated_at,
        company=company_data,
        skills=skills_data,
        applications_count=apps_count,
        has_applied=has_applied
    )

def get_job_by_id(db: Session, job_id: int) -> Optional[Job]:
    return db.query(Job).filter(Job.id == job_id).first()

def list_jobs(
    db: Session,
    search: Optional[str] = None,
    location: Optional[str] = None,
    job_type: Optional[str] = None,
    skill: Optional[str] = None,
    min_experience: Optional[int] = None,
    recruiter_id: Optional[int] = None,
    status: Optional[str] = None,
    page: int = 1,
    size: int = 10,
    current_candidate_id: Optional[int] = None
) -> JobListResponse:
    query = db.query(Job)

    if recruiter_id is not None:
        query = query.filter(Job.recruiter_id == recruiter_id)
        if status:
            query = query.filter(Job.status == status)
    else:
        # Public search - only show active jobs unless status explicitly specified
        if status:
            query = query.filter(Job.status == status)
        else:
            query = query.filter(Job.status == JobStatusEnum.ACTIVE)

    if search:
        search_term = f"%{search.strip()}%"
        query = query.outerjoin(Company).filter(
            or_(
                Job.title.ilike(search_term),
                Job.description.ilike(search_term),
                Company.name.ilike(search_term)
            )
        )

    if location:
        query = query.filter(Job.location.ilike(f"%{location.strip()}%"))

    if job_type:
        query = query.filter(Job.job_type == job_type)

    if min_experience is not None:
        query = query.filter(Job.min_experience <= min_experience)

    if skill:
        skill_term = f"%{skill.strip()}%"
        query = query.join(JobSkill).filter(JobSkill.skill_name.ilike(skill_term))

    total = query.distinct().count()
    pages = math.ceil(total / size) if total > 0 else 1
    page = max(1, min(page, pages))

    offset = (page - 1) * size
    jobs = query.distinct().order_by(Job.created_at.desc()).offset(offset).limit(size).all()

    items = [format_job_response(db, job, current_candidate_id) for job in jobs]

    return JobListResponse(
        items=items,
        total=total,
        page=page,
        size=size,
        pages=pages
    )
