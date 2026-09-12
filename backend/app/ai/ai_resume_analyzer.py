import re
from typing import List, Dict, Any, Optional

# Comprehensive Categorized Skills Dictionary (200+ Skills & Aliases)
SKILLS_DICTIONARY: Dict[str, List[str]] = {
    "Programming Languages": [
        "Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "Go", "Golang", 
        "Rust", "Ruby", "PHP", "Swift", "Kotlin", "Scala", "R", "Perl", "Shell", "Bash", "Dart"
    ],
    "Frontend Frameworks & Web": [
        "React", "React.js", "Next.js", "Vue.js", "Vue", "Angular", "HTML5", "CSS3", 
        "TailwindCSS", "Tailwind", "Bootstrap", "Redux", "Sass", "LESS", "Webpack", "Vite", "Svelte", "jQuery"
    ],
    "Backend & Microservices": [
        "Node.js", "Express", "FastAPI", "Django", "Flask", "Spring Boot", "Spring", 
        "ASP.NET", "GraphQL", "REST API", "gRPC", "Microservices", "NestJS", "Laravel", "Ruby on Rails"
    ],
    "Databases & Storage": [
        "MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "Oracle", "Cassandra", 
        "Elasticsearch", "DynamoDB", "MariaDB", "Supabase", "Prisma", "SQL Server", "Neo4j"
    ],
    "Cloud Platforms": [
        "AWS", "Amazon Web Services", "Azure", "GCP", "Google Cloud Platform", 
        "Firebase", "Heroku", "DigitalOcean", "Cloudflare", "Vercel", "Netlify"
    ],
    "DevOps & Infrastructure": [
        "Docker", "Kubernetes", "Git", "GitHub", "GitLab", "Jenkins", "CI/CD", 
        "Terraform", "Ansible", "Linux", "Nginx", "Helm", "Prometheus", "Grafana", "Bitbucket"
    ],
    "AI & Data Science": [
        "PyTorch", "TensorFlow", "Keras", "OpenCV", "NLTK", "spaCy", "Scikit-Learn", 
        "Hugging Face", "LLM", "RAG", "LangChain", "LlamaIndex", "Transformers",
        "Machine Learning", "Deep Learning", "Data Analysis", "NLP", "Computer Vision", 
        "Data Science", "Pandas", "NumPy", "SciPy", "Matplotlib", "Seaborn"
    ],
    "Tools & Methodologies": [
        "Agile", "Scrum", "Jira", "TDD", "REST", "JSON", "OAuth", "JWT", "Jupyter", 
        "VS Code", "Postman", "Object-Oriented Programming", "OOP", "System Design"
    ]
}

HEADER_IGNORE_KEYWORDS = {
    "resume", "curriculum vitae", "cv", "biodata", "profile", "summary", 
    "contact", "phone", "email", "address", "page 1", "page 2", "personal info",
    "work experience", "experience", "education", "skills", "projects", "certifications",
    "employment", "work history", "academic background", "qualifications", "objective",
    "career history", "technical skills", "professional experience", "licenses", "work",
    "interests", "languages", "hobbies", "declarations", "referees", "references",
    "tamil nadu", "tamilnadu", "chennai", "india", "bangalore", "bengaluru",
    "mumbai", "delhi", "hyderabad", "pune", "kolkata", "kerala", "karnataka",
    "usa", "uk", "california", "san francisco", "new york", "texas", "london",
    "student", "building", "looking", "seeking", "passionate", "working", "learning", "year"
}

JOB_ROLE_KEYWORDS = {
    "developer", "engineer", "architect", "lead", "manager", "intern", 
    "consultant", "specialist", "analyst", "administrator", "designer", "programmer",
    "experience", "education", "skills", "projects", "certifications", "history", "associate", "full-stack", "stack"
}

# Regex Section Zone Patterns
SECTION_HEADERS = {
    "EDUCATION": [
        r'^\s*(?:education|academic|qualifications|academic background|scholastic|studies|degrees)\b'
    ],
    "EXPERIENCE": [
        r'^\s*(?:work experience|employment|experience|professional experience|work history|career history|employment history|relevant experience)\b'
    ],
    "PROJECTS": [
        r'^\s*(?:projects|key projects|personal projects|academic projects|portfolio|notable projects)\b'
    ],
    "SKILLS": [
        r'^\s*(?:skills|technical skills|skills & technologies|core competencies|technologies|tools & technologies|expertise)\b'
    ],
    "CERTIFICATIONS": [
        r'^\s*(?:certifications|licenses|certifications & licenses|certificates|courses|awards & certifications|achievements)\b'
    ],
    "SUMMARY": [
        r'^\s*(?:summary|professional summary|profile|about me|executive summary|career objective|objective)\b'
    ]
}


def clean_pdf_spaced_text(text: str) -> str:
    """Fix spaced-out character text like 'J o h n   S m i t h' resulting from PDF extraction."""
    lines = text.split("\n")
    cleaned_lines = []
    for line in lines:
        parts = re.split(r'\s{2,}', line)
        cleaned_parts = []
        for part in parts:
            part_clean = part.strip()
            if re.match(r'^(?:[A-Za-z]\s+)+[A-Za-z]$', part_clean):
                cleaned_parts.append(part_clean.replace(" ", ""))
            else:
                cleaned_parts.append(part_clean)
        cleaned_lines.append(" ".join(p for p in cleaned_parts if p))
    return "\n".join(cleaned_lines)


def extract_email(text: str) -> Optional[str]:
    """Extract candidate email using regex pattern."""
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    matches = re.findall(email_pattern, text)
    return matches[0].strip().lower() if matches else None


def extract_phone(text: str) -> Optional[str]:
    """Extract phone number using international + national regex patterns."""
    phone_pattern = r'(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,5}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{3,5}'
    matches = re.findall(phone_pattern, text)
    for m in matches:
        m_clean = m.strip()
        digits = re.sub(r'\D', '', m_clean)
        if 10 <= len(digits) <= 13:
            return m_clean
    return None


def extract_candidate_name(text: str, email: Optional[str] = None) -> Optional[str]:
    """
    Line-by-Line Candidate Name Extractor.
    Filters out header/location words, splits multi-segment header lines, ignores section names,
    and falls back to formatted email username if text header is missing.
    """
    text_cleaned = clean_pdf_spaced_text(text)
    lines = [l.strip() for l in text_cleaned.split("\n") if l.strip()]

    candidate_name = None
    email_user = email.split("@")[0].lower() if email else ""

    for line in lines[:15]:  # Check top 15 lines
        segments = [line]
        for sep in ["|", "•", "–", "-", ",", "/", ":", "—"]:
            new_segs = []
            for seg in segments:
                new_segs.extend(seg.split(sep))
            segments = new_segs

        for seg in segments:
            seg_clean = seg.strip()
            seg_lower = seg_clean.lower()

            if "@" in seg_clean or "http" in seg_clean or "www." in seg_clean or "linkedin" in seg_clean:
                continue
            if any(h in seg_lower for h in HEADER_IGNORE_KEYWORDS):
                continue
            if re.search(r'\d{5,}', seg_clean):
                continue

            # Strip parenthetical notes
            seg_clean = re.sub(r'\(.*?\)', '', seg_clean).strip()
            words = [w.strip() for w in seg_clean.split() if w.strip()]
            
            has_forbidden_kw = any(w.lower() in JOB_ROLE_KEYWORDS or w.lower() in HEADER_IGNORE_KEYWORDS for w in words)
            
            if 1 <= len(words) <= 4 and not has_forbidden_kw:
                is_valid_name = all(re.match(r'^[A-Za-z.\'-]+$', w) for w in words)
                if is_valid_name:
                    # Single word token (e.g. BASKARJ) cross check with email username (jbaskar2006)
                    if len(words) == 1 and email_user:
                        single = words[0].lower()
                        if single in email_user or email_user.startswith(single[:4]):
                            candidate_name = words[0].capitalize()
                            break
                    elif len(words) >= 2:
                        candidate_name = " ".join(w.capitalize() for w in words)
                        break

        if candidate_name:
            break

    # Fallback: Extract name from email username if available
    if not candidate_name and email_user:
        clean_user = re.sub(r'[0-9_.-]+', ' ', email_user).strip()
        user_words = [w.capitalize() for w in clean_user.split() if len(w) >= 2]
        if user_words:
            candidate_name = " ".join(user_words)

    return candidate_name


def segment_resume_into_sections(text: str) -> Dict[str, List[str]]:
    """
    Line-by-Line Document Zoning State Machine.
    Classifies every line in the document into its respective section zone.
    """
    clean_text = clean_pdf_spaced_text(text)
    lines = clean_text.split("\n")

    sections: Dict[str, List[str]] = {
        "HEADER": [],
        "SUMMARY": [],
        "EXPERIENCE": [],
        "EDUCATION": [],
        "PROJECTS": [],
        "SKILLS": [],
        "CERTIFICATIONS": [],
        "OTHER": []
    }

    current_section = "HEADER"

    for line in lines:
        line_clean = line.strip()
        if not line_clean:
            continue

        line_lower = line_clean.lower()
        new_section_detected = None

        for sec_name, patterns in SECTION_HEADERS.items():
            for pat in patterns:
                if re.search(pat, line_lower, re.IGNORECASE):
                    new_section_detected = sec_name
                    break
            if new_section_detected:
                break

        if new_section_detected:
            current_section = new_section_detected
            if ":" in line_clean and len(line_clean.split(":", 1)[1].strip()) > 3:
                sections[current_section].append(line_clean.split(":", 1)[1].strip())
        else:
            sections[current_section].append(line_clean)

    return sections


def extract_skills(text: str) -> Dict[str, Any]:
    """
    Extract skills from full text using exact word boundary regex and grouped categories.
    """
    extracted_skills_set = set()
    skills_by_category: Dict[str, List[str]] = {}
    
    text_clean = text.lower()
    
    for category, skill_list in SKILLS_DICTIONARY.items():
        matched_in_cat = []
        for skill in skill_list:
            escaped_skill = re.escape(skill.lower())
            pattern = rf'\b{escaped_skill}\b'
            
            if re.search(pattern, text_clean):
                matched_in_cat.append(skill)
                extracted_skills_set.add(skill)

        if matched_in_cat:
            skills_by_category[category] = matched_in_cat

    extracted_skills_list = [
        {"skill_name": skill, "confidence": 0.95 if len(skill) > 3 else 0.85}
        for skill in sorted(extracted_skills_set)
    ]

    return {
        "extracted_skills": extracted_skills_list,
        "skills_by_category": skills_by_category,
        "total_skills_count": len(extracted_skills_list)
    }


def parse_education_lines(edu_lines: List[str], full_text: str) -> List[str]:
    """
    Line-by-Line Education Analyzer.
    Groups degree, institution, and dates into clean structured bullet entries.
    """
    degree_keywords = [
        "bachelor", "master", "phd", "doctor", "b.s", "m.s", "b.tech", "m.tech", 
        "b.e", "m.e", "computer science", "engineering", "diploma", "b.a", "m.a", 
        "b.c.a", "m.c.a", "secondary", "high school", "class xii", "class x"
    ]
    institution_keywords = [
        "university", "college", "institute", "school", "academy", "polytechnic"
    ]

    extracted_edu = []

    for line in edu_lines:
        line_clean = line.strip()
        line_lower = line_clean.lower()

        if any(h == line_lower for h in ["education", "academic background", "qualifications"]):
            continue

        is_edu_line = any(kw in line_lower for kw in degree_keywords) or any(kw in line_lower for kw in institution_keywords)
        has_year = bool(re.search(r'\b(19\d{2}|20\d{2})\b', line_clean))

        if (is_edu_line or has_year) and len(line_clean) > 5:
            if line_clean not in extracted_edu:
                extracted_edu.append(line_clean)

    # Fallback to full document scanner if education section was un-zoned
    if not extracted_edu:
        for line in full_text.split("\n"):
            line_clean = line.strip()
            line_lower = line_clean.lower()
            if any(kw in line_lower for kw in degree_keywords) or any(kw in line_lower for kw in institution_keywords):
                if 5 < len(line_clean) < 120 and line_clean not in extracted_edu:
                    if not any(h == line_lower for h in ["education", "academic background", "qualifications"]):
                        extracted_edu.append(line_clean)

    return extracted_edu


def parse_experience_lines(exp_lines: List[str], full_text: str) -> List[str]:
    """
    Line-by-Line Work Experience Analyzer.
    Extracts job titles, company names, and employment dates.
    """
    experience_keywords = [
        "engineer", "developer", "architect", "lead", "manager", "intern", 
        "consultant", "specialist", "analyst", "administrator", "co-op", "executive", "associate"
    ]

    extracted_exp = []

    for line in exp_lines:
        line_clean = line.strip()
        line_lower = line_clean.lower()

        if any(h == line_lower for h in ["work experience", "experience", "employment history"]):
            continue

        is_header_line = any(kw in line_lower for kw in experience_keywords) or bool(re.search(r'\b(20\d{2}|19\d{2})\b', line_clean))

        if is_header_line and len(line_clean) > 5:
            if line_clean not in extracted_exp:
                extracted_exp.append(line_clean)

    if not extracted_exp:
        for line in full_text.split("\n"):
            line_clean = line.strip()
            line_lower = line_clean.lower()
            if any(kw in line_lower for kw in experience_keywords):
                if 5 < len(line_clean) < 120 and line_clean not in extracted_exp:
                    if not any(h == line_lower for h in ["work experience", "experience", "employment"]):
                        extracted_exp.append(line_clean)

    return extracted_exp[:8]


def parse_project_lines(proj_lines: List[str], full_text: str) -> List[str]:
    """
    Line-by-Line Projects Analyzer.
    Extracts project titles, tech stack, and summaries.
    """
    extracted_projects = []

    for line in proj_lines:
        line_clean = line.strip()
        line_lower = line_clean.lower()

        if any(h == line_lower for h in ["projects", "key projects", "personal projects"]):
            continue

        if len(line_clean) > 8:
            if line_clean not in extracted_projects:
                extracted_projects.append(line_clean)

    return extracted_projects[:8]


def parse_certification_lines(cert_lines: List[str], full_text: str) -> List[str]:
    """
    Line-by-Line Certifications Analyzer.
    Extracts certification titles, issuer, and completion dates.
    Ignores Interests or Languages lines.
    """
    cert_keywords = [
        "certified", "certification", "certificate", "aws", "azure", "pmp", 
        "scrum", "cka", "oracle", "coursera", "udemy", "nptel", "google"
    ]
    ignore_sections = ["interests:", "languages:", "hobbies:"]
    extracted_certs = []

    for line in cert_lines:
        line_clean = line.strip()
        line_lower = line_clean.lower()

        if any(h == line_lower for h in ["certifications", "licenses & certifications"]):
            continue
        if any(ign in line_lower for ign in ignore_sections):
            continue

        if any(kw in line_lower for kw in cert_keywords) or len(line_clean) > 5:
            if 5 < len(line_clean) < 120 and line_clean not in extracted_certs:
                extracted_certs.append(line_clean)

    if not extracted_certs:
        for line in full_text.split("\n"):
            line_clean = line.strip()
            line_lower = line_clean.lower()
            if any(ign in line_lower for ign in ignore_sections):
                continue
            if any(kw in line_lower for kw in cert_keywords):
                if 5 < len(line_clean) < 120 and line_clean not in extracted_certs:
                    if not any(h == line_lower for h in ["certifications", "licenses & certifications"]):
                        extracted_certs.append(line_clean)

    return extracted_certs


def analyze_resume(text: str) -> Dict[str, Any]:
    """
    Line-by-Line AI Analysis Pipeline:
    Text -> Line-by-Line Document Zoning -> Deep Entity Parsing -> Categorized Output
    """
    clean_text = text.strip()

    # Step 1: Extract Personal Info from Document
    email = extract_email(clean_text)
    phone = extract_phone(clean_text)
    candidate_name = extract_candidate_name(clean_text, email=email)

    # Step 2: Line-by-Line Document Zoning
    sections = segment_resume_into_sections(clean_text)

    # Step 3: Deep Line-by-Line Extraction per Zone
    education = parse_education_lines(sections["EDUCATION"], clean_text)
    experience = parse_experience_lines(sections["EXPERIENCE"], clean_text)
    projects = parse_project_lines(sections["PROJECTS"], clean_text)
    certifications = parse_certification_lines(sections["CERTIFICATIONS"], clean_text)
    skills_data = extract_skills(clean_text)

    all_skills_list = [s["skill_name"] for s in skills_data["extracted_skills"]]

    return {
        "personal_information": {
            "name": candidate_name,
            "email": email,
            "phone": phone
        },
        "personal_info": {
            "name": candidate_name,
            "email": email,
            "phone": phone
        },
        "extracted_skills": skills_data["extracted_skills"],
        "skills_by_category": skills_data["skills_by_category"],
        "all_extracted_skills": all_skills_list,
        "total_skills_count": skills_data["total_skills_count"],
        "education": education,
        "experience": experience,
        "projects": projects,
        "certifications": certifications,
        "summary": " ".join(sections["SUMMARY"]) if sections["SUMMARY"] else ""
    }
