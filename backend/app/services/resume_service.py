import os
import uuid
from typing import List, Optional
from fastapi import HTTPException, status, UploadFile
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.candidate import CandidateProfile, CandidateSkill
from app.models.resume import Resume, ResumeExtractedSkill, AnalysisStatusEnum
from app.services.resume_parser import extract_resume_text
from app.ai.ai_resume_analyzer import analyze_resume
from app.services.candidate_service import CandidateService

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
ALLOWED_EXTENSIONS = {".pdf", ".docx"}
ALLOWED_MIME_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/x-pdf",
    "application/octet-stream"  # Browser fallback sometimes
}

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "uploads", "resumes")


def ensure_upload_dir():
    os.makedirs(UPLOAD_DIR, exist_ok=True)


async def process_resume_upload(db: Session, current_user: User, file: UploadFile) -> Resume:
    if current_user.role != "candidate":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can upload resumes"
        )

    candidate = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate profile not found. Please initialize candidate profile first."
        )

    # Security check: Extension
    original_filename = file.filename or "resume"
    ext = os.path.splitext(original_filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type '{ext}'. Only PDF and DOCX files are allowed."
        )

    # Security check: Read file content & size
    file_bytes = await file.read()
    file_size = len(file_bytes)

    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size exceeds 10MB limit. Uploaded size: {file_size / (1024*1024):.2f}MB"
        )

    if file_size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty."
        )

    # Content type check
    content_type = file.content_type
    if content_type and content_type not in ALLOWED_MIME_TYPES:
        # Fallback check extension if MIME is vague
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid content type '{content_type}'."
            )

    # Generate unique stored filename
    ensure_upload_dir()
    unique_name = f"{uuid.uuid4().hex}{ext}"
    stored_path = os.path.join(UPLOAD_DIR, unique_name)

    # Save to disk
    with open(stored_path, "wb") as f:
        f.write(file_bytes)

    file_type = ext.lstrip(".").lower()

    # Extract text using parser
    try:
        extracted_text = extract_resume_text(stored_path, file_type)
    except Exception as e:
        # Cleanup uploaded file if parsing fails critically
        if os.path.exists(stored_path):
            os.remove(stored_path)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Failed to parse resume text: {str(e)}"
        )

    # AI Analysis
    analysis = analyze_resume(extracted_text)

    # Create Resume DB record
    resume = Resume(
        candidate_id=candidate.id,
        original_filename=original_filename,
        stored_filename=unique_name,
        file_path=stored_path,
        file_type=file_type,
        file_size=file_size,
        extracted_text=extracted_text,
        analysis_status=AnalysisStatusEnum.COMPLETED
    )
    db.add(resume)
    db.flush()  # get resume.id

    # Store Extracted Skills
    all_extracted_skills = analysis.get("all_extracted_skills", [])
    for skill_name in all_extracted_skills:
        db_skill = ResumeExtractedSkill(
            resume_id=resume.id,
            skill_name=skill_name,
            confidence=0.90
        )
        db.add(db_skill)

    # Automatically sync extracted skills into candidate's skill profile if not already present
    from app.models.candidate import SkillLevelEnum
    existing_skills = {s.skill_name.lower() for s in candidate.skills}
    for skill_name in all_extracted_skills:
        if skill_name.lower() not in existing_skills:
            cand_skill = CandidateSkill(
                candidate_id=candidate.id,
                skill_name=skill_name,
                skill_level=SkillLevelEnum.INTERMEDIATE
            )
            db.add(cand_skill)
            existing_skills.add(skill_name.lower())

    db.commit()
    db.refresh(resume)

    # Sync extracted phone and education to candidate profile if blank
    extracted_phone = analysis.get("personal_info", {}).get("phone")
    extracted_edu = analysis.get("education", [])
    if extracted_phone and not candidate.phone:
        candidate.phone = extracted_phone
    if extracted_edu and not candidate.education:
        candidate.education = extracted_edu[0] if isinstance(extracted_edu, list) and extracted_edu else str(extracted_edu)

    # Update candidate profile completion score
    skills_count = db.query(CandidateSkill).filter(CandidateSkill.candidate_id == candidate.id).count()
    completion_score = CandidateService.calculate_profile_completion(candidate, skills_count)
    candidate.profile_completion = completion_score
    db.commit()

    return resume


def get_latest_candidate_resume(db: Session, candidate_id: int) -> Optional[Resume]:
    return db.query(Resume).filter(
        Resume.candidate_id == candidate_id
    ).order_by(Resume.uploaded_at.desc()).first()


def get_candidate_resume_history(db: Session, candidate_id: int) -> List[Resume]:
    return db.query(Resume).filter(
        Resume.candidate_id == candidate_id
    ).order_by(Resume.uploaded_at.desc()).all()


def format_resume_analysis_response(resume: Resume) -> dict:
    analysis = analyze_resume(resume.extracted_text)
    
    # Enrich with stored skills if available
    db_skills = resume.extracted_skills
    skill_list = [s.skill_name for s in db_skills] if db_skills else analysis.get("all_extracted_skills", [])
    
    return {
        "id": resume.id,
        "candidate_id": resume.candidate_id,
        "original_filename": resume.original_filename,
        "stored_filename": resume.stored_filename,
        "file_type": resume.file_type,
        "file_size": resume.file_size,
        "analysis_status": resume.analysis_status,
        "uploaded_at": resume.uploaded_at,
        "extracted_text_preview": resume.extracted_text[:300] if resume.extracted_text else "",
        "personal_info": analysis.get("personal_info", {}),
        "skills_by_category": analysis.get("skills_by_category", []),
        "all_extracted_skills": skill_list,
        "education": analysis.get("education", []),
        "experience": analysis.get("experience", []),
        "projects": analysis.get("projects", []),
        "certifications": analysis.get("certifications", []),
        "total_skills_count": len(skill_list)
    }
