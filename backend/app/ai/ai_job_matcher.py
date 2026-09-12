import re
from typing import List, Dict, Any, Tuple, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def compute_skill_match(candidate_skills: List[str], job_skills: List[Dict[str, str]], job_description: str) -> Tuple[float, List[str], List[str]]:
    """
    Computes Skill Match Score (0 - 100), Matched Skills list, and Missing Skills list.
    Required job skills carry weight 1.0.
    Preferred job skills carry weight 0.5 (contribute less than required skills).
    """
    cand_skills_lower = {s.lower().strip() for s in candidate_skills if s and s.strip()}
    
    required_skills = [s["skill_name"].strip() for s in job_skills if s.get("skill_type") == "required"]
    preferred_skills = [s["skill_name"].strip() for s in job_skills if s.get("skill_type") == "preferred"]
    
    # If no structured job skills exist, fallback to regex extraction against known keywords in job description
    if not required_skills and not preferred_skills:
        # Extract potential technical terms from description
        desc_words = set(re.findall(r'\b[A-Za-z0-9+#.-]{2,}\b', job_description))
        matched = [s for s in candidate_skills if s.lower() in {w.lower() for w in desc_words}]
        score = min(100.0, max(60.0, (len(matched) / max(1, len(candidate_skills))) * 100.0))
        return round(score, 1), matched, []

    total_weight = (len(required_skills) * 1.0) + (len(preferred_skills) * 0.5)
    earned_weight = 0.0

    matched_skills = []
    missing_skills = []

    # Check Required Skills (Weight = 1.0 each)
    for r_skill in required_skills:
        r_lower = r_skill.lower()
        if r_lower in cand_skills_lower or any(r_lower in cs for cs in cand_skills_lower):
            earned_weight += 1.0
            matched_skills.append(r_skill)
        else:
            missing_skills.append(f"{r_skill} (Required)")

    # Check Preferred Skills (Weight = 0.5 each)
    for p_skill in preferred_skills:
        p_lower = p_skill.lower()
        if p_lower in cand_skills_lower or any(p_lower in cs for cs in cand_skills_lower):
            earned_weight += 0.5
            matched_skills.append(f"{p_skill} (Preferred)")
        else:
            missing_skills.append(f"{p_skill} (Preferred)")

    if total_weight > 0:
        skill_score = (earned_weight / total_weight) * 100.0
    else:
        skill_score = 75.0

    return round(min(100.0, max(0.0, skill_score)), 1), matched_skills, missing_skills


def compute_experience_match(candidate_exp_years: int, job_min_experience: int) -> float:
    """
    Computes Experience Match Score (0 - 100).
    Transparent scoring method without harsh automatic disqualification:
    - Candidate Exp >= Job Min Exp -> 100.0%
    - Candidate Exp < Job Min Exp -> Proportional score (minimum floor 50.0%)
    """
    cand_exp = max(0, candidate_exp_years or 0)
    job_min = max(0, job_min_experience or 0)

    if job_min == 0 or cand_exp >= job_min:
        return 100.0

    # Proportional score for lower experience (floor at 50%)
    score = (cand_exp / job_min) * 100.0
    return round(min(100.0, max(50.0, score)), 1)


def compute_education_match(candidate_education: str, resume_text: str, job_description: str) -> float:
    """
    Computes Education Match Score (0 - 100).
    Spec Rule: If job education requirement is not specified, use a neutral score (100.0).
    If specified, evaluates candidate education level against job requirements.
    """
    combined_cand_text = f"{candidate_education or ''} {resume_text or ''}".lower()
    job_desc_lower = (job_description or "").lower()

    # Degree levels hierarchy
    degree_keywords = {
        "phd": 4,
        "doctorate": 4,
        "master": 3,
        "m.s": 3,
        "m.tech": 3,
        "m.e": 3,
        "bachelor": 2,
        "b.s": 2,
        "b.tech": 2,
        "b.e": 2,
        "degree": 1,
        "diploma": 1
    }

    # Check if job description specifies education requirements
    job_degree_level = 0
    for kw, lvl in degree_keywords.items():
        if re.search(rf'\b{re.escape(kw)}\b', job_desc_lower):
            if lvl > job_degree_level:
                job_degree_level = lvl

    # If job does NOT specify explicit education requirement -> Neutral Score (100.0)
    if job_degree_level == 0:
        return 100.0

    # Determine candidate highest degree level
    cand_degree_level = 0
    for kw, lvl in degree_keywords.items():
        if re.search(rf'\b{re.escape(kw)}\b', combined_cand_text):
            if lvl > cand_degree_level:
                cand_degree_level = lvl

    if cand_degree_level >= job_degree_level:
        return 100.0
    elif cand_degree_level > 0:
        return 80.0
    else:
        return 65.0


def compute_resume_similarity(resume_text: str, candidate_skills: List[str], job_title: str, job_description: str, required_skills: List[str]) -> float:
    """
    Computes Resume Similarity Score (0 - 100) using TF-IDF Vectorizer and Cosine Similarity.
    """
    cand_text_content = f"{resume_text or ''} {' '.join(candidate_skills)}".strip()
    job_text_content = f"{job_title or ''} {job_description or ''} {' '.join(required_skills)}".strip()

    if not cand_text_content or not job_text_content:
        return 50.0

    try:
        vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
        tfidf_matrix = vectorizer.fit_transform([cand_text_content, job_text_content])
        similarity_val = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        
        # Scale similarity score (cosine sim usually 0.1 to 0.7 for document matching)
        # Apply gentle boost scaling so relevant resumes score accurately between 50-100%
        scaled_score = min(100.0, max(0.0, float(similarity_val) * 150.0))
        return round(scaled_score, 1)
    except Exception:
        return 60.0


def calculate_ai_job_match(
    candidate_profile: Any,
    candidate_skills_list: List[str],
    latest_resume_text: str,
    job: Any,
    job_skills_list: List[Dict[str, str]]
) -> Dict[str, Any]:
    """
    Unified AI Matching Engine:
    Skill Match (40%) + Experience Match (20%) + Education Match (10%) + Resume Similarity (30%)
    Returns Final Score (0-100), component breakdowns, matched skills, missing skills, and disclaimer.
    """
    # 1. Skill Match (40%)
    skill_score, matched_skills, missing_skills = compute_skill_match(
        candidate_skills=candidate_skills_list,
        job_skills=job_skills_list,
        job_description=job.description
    )

    # 2. Experience Match (20%)
    experience_score = compute_experience_match(
        candidate_exp_years=candidate_profile.experience_years,
        job_min_experience=job.min_experience
    )

    # 3. Education Match (10%)
    education_score = compute_education_match(
        candidate_education=candidate_profile.education,
        resume_text=latest_resume_text,
        job_description=job.description
    )

    # 4. Resume Similarity (30%)
    req_skills = [s["skill_name"] for s in job_skills_list if s.get("skill_type") == "required"]
    similarity_score = compute_resume_similarity(
        resume_text=latest_resume_text,
        candidate_skills=candidate_skills_list,
        job_title=job.title,
        job_description=job.description,
        required_skills=req_skills
    )

    # 5. Calculate Final Score (0 - 100)
    final_score = (
        (skill_score * 0.40) +
        (experience_score * 0.20) +
        (education_score * 0.10) +
        (similarity_score * 0.30)
    )
    final_score = round(min(100.0, max(0.0, final_score)), 1)

    return {
        "candidate_id": candidate_profile.id,
        "job_id": job.id,
        "skill_score": skill_score,
        "experience_score": experience_score,
        "education_score": education_score,
        "similarity_score": similarity_score,
        "final_score": final_score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "explanation": "Your score is based on skills, experience, education and resume relevance.",
        "ai_disclaimer": "AI Recommendation – Final hiring decision remains with the recruiter."
    }
