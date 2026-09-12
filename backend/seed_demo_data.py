import sys
import os
import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import (
    User, CandidateProfile, RecruiterProfile, Company, Job, JobSkill, 
    Application, CandidateSkill, Resume, ResumeExtractedSkill, CandidateScore
)
from app.utils.security import hash_password
from app.services.match_service import calculate_and_store_match

def seed_demo_data():
    print("--- Starting HireAI Realistic Demo Data Seeding ---")
    db = SessionLocal()
    try:
        # 1. Admin User
        admin_email = "admin@hireai.com"
        admin = db.query(User).filter(User.email == admin_email).first()
        if not admin:
            admin = User(
                name="System Administrator",
                email=admin_email,
                password_hash=hash_password("admin123"),
                role="admin",
                company="HireAI Platform",
                is_active=True
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)

        # 2. Companies & Recruiters
        company1 = db.query(Company).filter(Company.name == "TechCorp Solutions").first()
        if not company1:
            company1 = Company(
                name="TechCorp Solutions",
                description="Leading enterprise software solutions provider.",
                industry="Software Engineering",
                location="San Francisco, CA",
                website="https://techcorp.example.com"
            )
            db.add(company1)
            db.commit()
            db.refresh(company1)

        company2 = db.query(Company).filter(Company.name == "DataVision Analytics").first()
        if not company2:
            company2 = Company(
                name="DataVision Analytics",
                description="Next-generation data science and AI research lab.",
                industry="Artificial Intelligence & Data Science",
                location="New York, NY",
                website="https://datavision.example.com"
            )
            db.add(company2)
            db.commit()
            db.refresh(company2)

        # Recruiter 1
        rec1_user = db.query(User).filter(User.email == "recruiter1@hireai.com").first()
        if not rec1_user:
            rec1_user = User(
                name="Sarah Connor",
                email="recruiter1@hireai.com",
                password_hash=hash_password("password123"),
                role="recruiter",
                company="TechCorp Solutions",
                is_active=True
            )
            db.add(rec1_user)
            db.commit()
            db.refresh(rec1_user)

        rec1_profile = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == rec1_user.id).first()
        if not rec1_profile:
            rec1_profile = RecruiterProfile(
                user_id=rec1_user.id,
                company_id=company1.id,
                designation="Lead Technical Recruiter",
                phone="+1 555-0101"
            )
            db.add(rec1_profile)
            db.commit()
            db.refresh(rec1_profile)

        # Recruiter 2
        rec2_user = db.query(User).filter(User.email == "recruiter2@hireai.com").first()
        if not rec2_user:
            rec2_user = User(
                name="David Miller",
                email="recruiter2@hireai.com",
                password_hash=hash_password("password123"),
                role="recruiter",
                company="DataVision Analytics",
                is_active=True
            )
            db.add(rec2_user)
            db.commit()
            db.refresh(rec2_user)

        rec2_profile = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == rec2_user.id).first()
        if not rec2_profile:
            rec2_profile = RecruiterProfile(
                user_id=rec2_user.id,
                company_id=company2.id,
                designation="Head of Talent Sourcing",
                phone="+1 555-0102"
            )
            db.add(rec2_profile)
            db.commit()
            db.refresh(rec2_profile)

        # 3. Jobs (5 Key Roles)
        jobs_data = [
            {
                "title": "Frontend Developer",
                "company_id": company1.id,
                "recruiter_id": rec1_profile.id,
                "description": "Building modern, responsive user interfaces using React, JavaScript, Redux, HTML, and CSS.",
                "requirements": "3+ years experience with React, JavaScript, HTML5, CSS3, and state management.",
                "location": "San Francisco, CA (Hybrid)",
                "job_type": "Full Time",
                "status": "active",
                "min_experience": 3,
                "salary_min": 90000,
                "salary_max": 120000,
                "skills": [
                    {"skill_name": "React", "skill_type": "required"},
                    {"skill_name": "JavaScript", "skill_type": "required"},
                    {"skill_name": "HTML", "skill_type": "required"},
                    {"skill_name": "CSS", "skill_type": "required"},
                    {"skill_name": "Redux", "skill_type": "preferred"}
                ]
            },
            {
                "title": "Python Developer",
                "company_id": company1.id,
                "recruiter_id": rec1_profile.id,
                "description": "Developing scalable backend RESTful APIs using Python, FastAPI, MySQL, and Docker containerization.",
                "requirements": "4+ years of backend development using Python, FastAPI, database optimization, and Docker.",
                "location": "Remote",
                "job_type": "Remote",
                "status": "active",
                "min_experience": 4,
                "salary_min": 105000,
                "salary_max": 140000,
                "skills": [
                    {"skill_name": "Python", "skill_type": "required"},
                    {"skill_name": "FastAPI", "skill_type": "required"},
                    {"skill_name": "MySQL", "skill_type": "required"},
                    {"skill_name": "Docker", "skill_type": "required"},
                    {"skill_name": "REST API", "skill_type": "preferred"}
                ]
            },
            {
                "title": "Full Stack Developer",
                "company_id": company1.id,
                "recruiter_id": rec1_profile.id,
                "description": "End-to-end full stack web architecture combining React frontend with Python / Node.js microservices.",
                "requirements": "5+ years full stack experience with React, Node.js, Python, PostgreSQL, and TypeScript.",
                "location": "San Francisco, CA",
                "job_type": "Full Time",
                "status": "active",
                "min_experience": 5,
                "salary_min": 120000,
                "salary_max": 160000,
                "skills": [
                    {"skill_name": "React", "skill_type": "required"},
                    {"skill_name": "Node.js", "skill_type": "required"},
                    {"skill_name": "Python", "skill_type": "required"},
                    {"skill_name": "PostgreSQL", "skill_type": "required"},
                    {"skill_name": "TypeScript", "skill_type": "preferred"}
                ]
            },
            {
                "title": "Data Analyst",
                "company_id": company2.id,
                "recruiter_id": rec2_profile.id,
                "description": "Analyzing enterprise datasets, building SQL pipelines, data visualizations, and reporting dashboards.",
                "requirements": "3+ years experience with Python, SQL, Tableau, Pandas, and statistical analysis.",
                "location": "New York, NY",
                "job_type": "Full Time",
                "status": "active",
                "min_experience": 3,
                "salary_min": 85000,
                "salary_max": 115000,
                "skills": [
                    {"skill_name": "Python", "skill_type": "required"},
                    {"skill_name": "SQL", "skill_type": "required"},
                    {"skill_name": "Tableau", "skill_type": "required"},
                    {"skill_name": "Pandas", "skill_type": "required"},
                    {"skill_name": "Statistics", "skill_type": "preferred"}
                ]
            },
            {
                "title": "Machine Learning Engineer",
                "company_id": company2.id,
                "recruiter_id": rec2_profile.id,
                "description": "Designing and deploying production Machine Learning models using PyTorch, TensorFlow, and MLOps.",
                "requirements": "4+ years ML experience, strong proficiency in Python, Scikit-learn, PyTorch, and cloud MLOps.",
                "location": "Remote",
                "job_type": "Remote",
                "status": "active",
                "min_experience": 4,
                "salary_min": 130000,
                "salary_max": 175000,
                "skills": [
                    {"skill_name": "Python", "skill_type": "required"},
                    {"skill_name": "Machine Learning", "skill_type": "required"},
                    {"skill_name": "TensorFlow", "skill_type": "required"},
                    {"skill_name": "PyTorch", "skill_type": "required"},
                    {"skill_name": "Scikit-learn", "skill_type": "preferred"}
                ]
            }
        ]

        seeded_jobs = []
        for jd in jobs_data:
            job_obj = db.query(Job).filter(Job.title == jd["title"], Job.company_id == jd["company_id"]).first()
            if not job_obj:
                job_obj = Job(
                    title=jd["title"],
                    company_id=jd["company_id"],
                    recruiter_id=jd["recruiter_id"],
                    description=jd["description"],
                    location=jd["location"],
                    job_type=jd["job_type"],
                    status=jd["status"],
                    min_experience=jd["min_experience"],
                    salary_min=jd["salary_min"],
                    salary_max=jd["salary_max"]
                )
                db.add(job_obj)
                db.commit()
                db.refresh(job_obj)

                for sk in jd["skills"]:
                    js = JobSkill(job_id=job_obj.id, skill_name=sk["skill_name"], skill_type=sk["skill_type"])
                    db.add(js)
                db.commit()
            seeded_jobs.append(job_obj)

        # 4. Candidates (10 Candidates)
        candidates_data = [
            {
                "name": "Alice Johnson",
                "email": "alice@example.com",
                "title": "Senior Frontend Developer",
                "experience": 4,
                "education": "B.S. in Computer Science",
                "skills": ["React", "JavaScript", "HTML", "CSS", "Redux", "TypeScript"],
                "resume_text": "Experienced Frontend Developer with 4 years building reactive user interfaces in React, JavaScript, HTML5, CSS3, and Redux. Expertise in modern web apps and responsive design."
            },
            {
                "name": "Bob Smith",
                "email": "bob@example.com",
                "title": "Senior Python Backend Engineer",
                "experience": 5,
                "education": "M.S. in Software Engineering",
                "skills": ["Python", "FastAPI", "MySQL", "Docker", "REST API", "Git"],
                "resume_text": "Backend Engineer with 5 years experience specializing in Python, FastAPI, MySQL database optimization, Docker containerization, and high throughput REST API design."
            },
            {
                "name": "Charlie Davis",
                "email": "charlie@example.com",
                "title": "Full Stack Software Engineer",
                "experience": 6,
                "education": "B.S. in Computer Science",
                "skills": ["React", "Node.js", "Python", "PostgreSQL", "TypeScript", "Docker"],
                "resume_text": "Full Stack Software Engineer with 6 years experience building scalable end-to-end applications with React, Node.js, Python, PostgreSQL, and TypeScript microservices."
            },
            {
                "name": "Diana Prince",
                "email": "diana@example.com",
                "title": "Data Analyst",
                "experience": 3,
                "education": "B.S. in Statistics",
                "skills": ["Python", "SQL", "Tableau", "Pandas", "Statistics", "Excel"],
                "resume_text": "Data Analyst with 3 years experience building automated SQL analytics pipelines, data visualization dashboards in Tableau, and statistical reporting with Python and Pandas."
            },
            {
                "name": "Ethan Hunt",
                "email": "ethan@example.com",
                "title": "Machine Learning Engineer",
                "experience": 5,
                "education": "M.S. in Data Science",
                "skills": ["Python", "Machine Learning", "TensorFlow", "PyTorch", "Scikit-learn", "MLOps"],
                "resume_text": "Machine Learning Engineer with 5 years experience developing and deploying deep learning models using Python, TensorFlow, PyTorch, Scikit-learn, and cloud MLOps pipelines."
            },
            {
                "name": "Fiona Gallagher",
                "email": "fiona@example.com",
                "title": "Junior Web Developer",
                "experience": 2,
                "education": "B.A. in Web Design",
                "skills": ["HTML", "CSS", "JavaScript", "React", "Bootstrap"],
                "resume_text": "Junior Developer with 2 years building clean HTML, CSS, JavaScript, and React client interfaces."
            },
            {
                "name": "George Clark",
                "email": "george@example.com",
                "title": "Senior Systems Developer",
                "experience": 7,
                "education": "B.S. in Electrical Engineering",
                "skills": ["Python", "Django", "MySQL", "PostgreSQL", "Docker", "AWS"],
                "resume_text": "Senior Systems Developer with 7 years architecting enterprise applications in Python, Django, MySQL, PostgreSQL, Docker, and AWS cloud infrastructure."
            },
            {
                "name": "Hannah Abbott",
                "email": "hannah@example.com",
                "title": "Data Scientist",
                "experience": 4,
                "education": "M.S. in Computer Science",
                "skills": ["Python", "Machine Learning", "Scikit-learn", "SQL", "Pandas"],
                "resume_text": "Data Scientist with 4 years experience building predictive Machine Learning models using Python, Scikit-learn, SQL, and data analysis pipelines."
            },
            {
                "name": "Ian Malcolm",
                "email": "ian@example.com",
                "title": "AI Research Scientist",
                "experience": 6,
                "education": "Ph.D. in Applied Mathematics",
                "skills": ["Python", "Machine Learning", "Statistics", "PyTorch", "R"],
                "resume_text": "AI Researcher with 6 years experience conducting machine learning research, mathematical modeling in Python, PyTorch, and advanced statistical analysis."
            },
            {
                "name": "Julia Roberts",
                "email": "julia@example.com",
                "title": "Full Stack Developer",
                "experience": 3,
                "education": "B.S. in Information Technology",
                "skills": ["JavaScript", "React", "Node.js", "Express", "MongoDB"],
                "resume_text": "Full Stack Developer with 3 years building web apps using JavaScript, React, Node.js, Express, and MongoDB."
            }
        ]

        seeded_candidates = []
        for cd in candidates_data:
            u_obj = db.query(User).filter(User.email == cd["email"]).first()
            if not u_obj:
                u_obj = User(
                    name=cd["name"],
                    email=cd["email"],
                    password_hash=hash_password("password123"),
                    role="candidate",
                    headline=cd["title"],
                    is_active=True
                )
                db.add(u_obj)
                db.commit()
                db.refresh(u_obj)

            cp_obj = db.query(CandidateProfile).filter(CandidateProfile.user_id == u_obj.id).first()
            if not cp_obj:
                cp_obj = CandidateProfile(
                    user_id=u_obj.id,
                    experience_years=cd["experience"],
                    education=cd["education"],
                    profile_completion=100
                )
                db.add(cp_obj)
                db.commit()
                db.refresh(cp_obj)

                for sk in cd["skills"]:
                    c_sk = CandidateSkill(candidate_id=cp_obj.id, skill_name=sk, skill_level="expert")
                    db.add(c_sk)
                db.commit()

                # Add Resume Record
                res_obj = Resume(
                    candidate_id=cp_obj.id,
                    original_filename=f"{cd['name'].lower().replace(' ', '_')}_resume.pdf",
                    stored_filename=f"{cd['name'].lower().replace(' ', '_')}_resume.pdf",
                    file_path=f"/uploads/resumes/{cd['name'].lower().replace(' ', '_')}_resume.pdf",
                    file_type="application/pdf",
                    file_size=1024,
                    extracted_text=cd["resume_text"],
                    analysis_status="completed"
                )
                db.add(res_obj)
                db.commit()
                db.refresh(res_obj)

                for sk in cd["skills"]:
                    re_sk = ResumeExtractedSkill(resume_id=res_obj.id, skill_name=sk, confidence=0.95)
                    db.add(re_sk)
                db.commit()

            seeded_candidates.append(cp_obj)

        # 5. Create Applications & Generate Genuine AI Match Scores
        print("Calculating and storing genuine multi-factor AI match scores for demo candidates...")
        for job in seeded_jobs:
            for candidate in seeded_candidates:
                # Check application
                app_obj = db.query(Application).filter(
                    Application.job_id == job.id,
                    Application.candidate_id == candidate.id
                ).first()

                if not app_obj:
                    app_obj = Application(
                        job_id=job.id,
                        candidate_id=candidate.id,
                        status="applied"
                    )
                    db.add(app_obj)
                    db.commit()

                # Calculate real AI match score using Scikit-learn TF-IDF & Cosine Similarity
                calculate_and_store_match(db, job_id=job.id, candidate_id=candidate.id)

        print("\n>>> DEMO DATA SEEDED SUCCESSFULLY WITH 10 CANDIDATES, 2 RECRUITERS, 5 JOBS & AI SCORES! <<<")

    except Exception as e:
        print(f"Error seeding demo data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_demo_data()
