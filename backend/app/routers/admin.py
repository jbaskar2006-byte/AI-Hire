from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import require_admin
from app.models.user import User
from app.schemas.admin import (
    AdminStatsResponse,
    AdminAnalyticsResponse,
    UserAdminResponse,
    UserStatusUpdate,
    JobAdminResponse,
    JobStatusUpdate,
    ApplicationAdminResponse
)
from app.services.admin_service import (
    get_admin_dashboard_stats,
    get_admin_analytics_data,
    get_admin_users,
    toggle_user_status,
    get_admin_jobs,
    update_admin_job_status,
    get_admin_applications
)

router = APIRouter(prefix="/admin", tags=["Admin Dashboard & Analytics"])


@router.get("/stats", response_model=AdminStatsResponse)
def get_dashboard_stats_endpoint(
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin)
):
    """
    Protected Admin Route: Get system overview counters.
    Returns: total users, candidates, recruiters, companies, active jobs, applications, resumes.
    """
    return get_admin_dashboard_stats(db)


@router.get("/analytics", response_model=AdminAnalyticsResponse)
def get_analytics_endpoint(
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin)
):
    """
    Protected Admin Route: Get aggregated platform analytics for charts.
    Returns: Applications per month, users by role, jobs by type, application status, score distribution, top skills.
    """
    return get_admin_analytics_data(db)


@router.get("/users", response_model=List[UserAdminResponse])
def get_users_endpoint(
    search: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin)
):
    """
    Protected Admin Route: List all system users with search and role filtering.
    """
    return get_admin_users(db, search=search, role=role)


@router.put("/users/{user_id}/status", response_model=UserAdminResponse)
def update_user_status_endpoint(
    user_id: int,
    status_update: UserStatusUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin)
):
    """
    Protected Admin Route: Deactivate or Activate user account safely without breaking foreign key relationships.
    """
    if admin_user.id == user_id and not status_update.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin cannot deactivate their own active session account."
        )

    return toggle_user_status(db, user_id=user_id, is_active=status_update.is_active)


@router.get("/jobs", response_model=List[JobAdminResponse])
def get_jobs_endpoint(
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin)
):
    """
    Protected Admin Route: List system jobs with search and status filtering.
    """
    return get_admin_jobs(db, search=search, status_filter=status)


@router.put("/jobs/{job_id}/status", response_model=JobAdminResponse)
def update_job_status_endpoint(
    job_id: int,
    status_update: JobStatusUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin)
):
    """
    Protected Admin Route: Change job status (e.g. close inappropriate or expired jobs).
    """
    return update_admin_job_status(db, job_id=job_id, new_status=status_update.status)


@router.get("/applications", response_model=List[ApplicationAdminResponse])
def get_applications_endpoint(
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_admin)
):
    """
    Protected Admin Route: Overview of system job applications with candidate scores.
    """
    return get_admin_applications(db, search=search, status_filter=status)
