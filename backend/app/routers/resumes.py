from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Body
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.candidate import CandidateProfile
from app.routers.auth import get_current_user
from app.services.resume_service import (
    process_resume_upload,
    get_latest_candidate_resume,
    get_candidate_resume_history,
    format_resume_analysis_response
)
from app.ai.ai_resume_analyzer import analyze_resume

router = APIRouter(prefix="", tags=["Resumes & AI Analysis"])


@router.post("/candidate/resume")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Upload a resume file (PDF/DOCX, max 10MB).
    Parses text, extracts skills & sections using local AI, persists resume & skills.
    Only candidates can access this endpoint.
    """
    if current_user.role != "candidate":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can upload resumes"
        )

    resume = await process_resume_upload(db, current_user, file)
    formatted = format_resume_analysis_response(resume)

    return {
        "message": "Resume uploaded and analyzed successfully",
        "resume": formatted
    }


@router.get("/candidate/resume/latest")
def get_latest_resume(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve the candidate's most recently uploaded resume and AI analysis details.
    """
    if current_user.role != "candidate":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can access resume endpoints"
        )

    candidate = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate profile not found"
        )

    resume = get_latest_candidate_resume(db, candidate.id)
    if not resume:
        return {
            "message": "No resume uploaded yet",
            "resume": None
        }

    formatted = format_resume_analysis_response(resume)
    return {
        "message": "Latest resume retrieved successfully",
        "resume": formatted
    }


@router.get("/candidate/resume/history")
def get_resume_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List all uploaded resumes and analysis summaries for the candidate.
    """
    if current_user.role != "candidate":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can access resume endpoints"
        )

    candidate = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate profile not found"
        )

    resumes = get_candidate_resume_history(db, candidate.id)
    results = []
    for r in resumes:
        results.append({
            "id": r.id,
            "original_filename": r.original_filename,
            "stored_filename": r.stored_filename,
            "file_type": r.file_type,
            "file_size": r.file_size,
            "analysis_status": r.analysis_status,
            "uploaded_at": r.uploaded_at,
            "extracted_skills_count": len(r.extracted_skills)
        })

    return {
        "count": len(results),
        "resumes": results
    }


@router.post("/ai/analyze-resume")
def analyze_resume_text(
    payload: dict = Body(...),
    current_user: User = Depends(get_current_user)
):
    """
    Directly analyze plain text content of a resume using local AI engine.
    Input payload: { "text": "Resume text..." }
    """
    text = payload.get("text", "").strip()
    if not text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payload must include non-empty 'text' field"
        )

    analysis_result = analyze_resume(text)

    return {
        "message": "Resume text analyzed successfully",
        "analysis": analysis_result
    }
