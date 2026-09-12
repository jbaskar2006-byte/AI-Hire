# HireAI – Intelligent AI Recruitment and Resume Screening System

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/Database-MySQL_8.0-4479A1?style=for-the-badge&logo=mysql)](https://www.mysql.com/)
[![Scikit-Learn](https://img.shields.io/badge/AI Engine-Scikit--Learn-F7931E?style=for-the-badge&logo=scikit-learn)](https://scikit-learn.org/)

---

## 📌 Project Overview

**HireAI** is an enterprise-grade, end-to-end **AI Recruitment and Resume Screening Platform** designed to streamline talent acquisition, automate resume parsing, perform multi-factor candidate scoring, analyze skill gaps, generate tailored interview questions, and offer visual analytics for hiring teams.

Built with a high-performance **FastAPI** backend, **MySQL** database engine, and a modern **React 19** frontend styled with **Tailwind CSS**, HireAI employs zero-cost, local Scikit-Learn TF-IDF vector models and Cosine Similarity to compute objective, job-relevant candidate match scores.

---

## ✨ Key Features & Modules

### 👤 Candidate Portal
- **Profile & Skill Management**: Comprehensive candidate profile editing, experience tracking, and skill matrix.
- **AI Resume Parser**: Local PDF resume extraction pulling text, raw content, and key technical skills.
- **Job Discovery & Vector Matching**: Browse active job requisitions with instant AI match percentages.
- **One-Click Job Applications**: Streamlined job application process.
- **Skill Gap Analysis**: Direct candidate-job skill comparison identifying satisfied vs. missing skills, skill coverage %, and local learning recommendations.
- **Personalized Job Recommendations**: Multi-factor AI recommendation engine ranking jobs for candidate profiles.
- **AI Interview Prep Assistant**: Dynamic interview question bank generation across 4 domains (*Technical*, *HR*, *Project*, and *Skill-Based*) with interactive practice checkboxes and answer strategy guides.

### 🏢 Recruiter Portal
- **Company Management**: Employer branding, company creation, and team designation management.
- **Job Requisition Controls**: Create, edit, publish, and close job postings with custom required vs. preferred skill requirements.
- **Applicant Pipeline Tracking**: Status workflow (*Applied*, *Under Review*, *Shortlisted*, *Interview*, *Rejected*, *Selected*).
- **Candidate Ranking Leaderboard**: Multi-factor AI score ranking (*Skill Match 40%*, *Experience Score 20%*, *Education Score 10%*, *Resume TF-IDF Similarity 30%*) with factor breakdown modals.

### 🛡️ Admin Console & Business Intelligence
- **System Overview Dashboard**: 7 KPI summary cards (*Total Users*, *Candidates*, *Recruiters*, *Companies*, *Active Jobs*, *Applications*, *Resumes Processed*).
- **Recharts Analytics Portal**: 6 interactive charts (*Applications Per Month*, *Users by Role*, *Jobs by Employment Type*, *Application Pipeline*, *Match Score Distribution*, *Top Technical Skills*).
- **User Governance**: Account search, role filters, and safe account deactivation (`is_active = False`) preserving database foreign key integrity.
- **Job Governance**: Search, filter, inspect details, and close inappropriate/expired job postings.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, Tailwind CSS v4, Lucide React Icons, Axios, Recharts |
| **Backend** | Python 3.13, FastAPI, Uvicorn, PyPDF2, Pydantic v2, PyJWT, Bcrypt |
| **Database** | MySQL 8.0+, SQLAlchemy 2.0 ORM, PyMySQL, Raw SQL Migrations |
| **AI / NLP Engine** | Scikit-Learn (TF-IDF Vectorizer), Cosine Similarity, Custom Rule Engine |

---

## 🏗️ System Architecture

```
                               ┌─────────────────────────┐
                               │     React 19 Frontend    │
                               │   Vite + Tailwind CSS   │
                               └────────────┬────────────┘
                                            │ HTTP / REST APIs
                                            ▼
                               ┌─────────────────────────┐
                               │   FastAPI Backend API   │
                               │   Bearer JWT Auth & RBAC│
                               └────────────┬────────────┘
                                            │
                      ┌─────────────────────┼─────────────────────┐
                      ▼                     ▼                     ▼
            ┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐
            │ Scikit-Learn TF-IDF│ │  Rule-Based AI    │ │  PyPDF2 Resume    │
            │ Cosine Similarity │ │  Interview Engine │ │  Parser Service   │
            └───────────────────┘ └───────────────────┘ └───────────────────┘
                      │                     │                     │
                      └─────────────────────┼─────────────────────┘
                                            │ SQLAlchemy ORM
                                            ▼
                               ┌─────────────────────────┐
                               │   MySQL Database        │
                               │   hireai_db Schema      │
                               └─────────────────────────┘
```

---

## 📂 Project Directory Structure

```
hireai/
 ├── database/
 │    ├── phase1_schema.sql
 │    ├── phase5_migration.sql
 │    ├── phase7_migration.sql
 │    └── seed_demo_data.py
 ├── backend/
 │    ├── app/
 │    │    ├── ai/
 │    │    │    ├── job_matcher.py
 │    │    │    ├── skill_recommender.py
 │    │    │    └── interview_generator.py
 │    │    ├── models/
 │    │    │    ├── user.py
 │    │    │    ├── candidate.py
 │    │    │    ├── recruiter.py
 │    │    │    ├── job.py
 │    │    │    ├── resume.py
 │    │    │    ├── candidate_score.py
 │    │    │    └── interview_question.py
 │    │    ├── routers/
 │    │    │    ├── auth.py
 │    │    │    ├── candidate.py
 │    │    │    ├── recruiter.py
 │    │    │    ├── jobs.py
 │    │    │    ├── applications.py
 │    │    │    ├── resumes.py
 │    │    │    ├── ai_matching.py
 │    │    │    ├── ai_recommendations.py
 │    │    │    ├── ai_interview.py
 │    │    │    └── admin.py
 │    │    ├── services/
 │    │    └── schemas/
 │    ├── seed_admin.py
 │    ├── seed_demo_data.py
 │    ├── requirements.txt
 │    └── .env.example
 └── frontend/
      ├── src/
      │    ├── components/
      │    │    └── AdminSidebar.jsx
      │    ├── pages/
      │    │    ├── candidate/
      │    │    ├── recruiter/
      │    │    └── admin/
      │    ├── services/
      │    ├── context/
      │    └── App.jsx
      ├── package.json
      └── .env.example
```

---

## 💻 Installation & Local Setup Instructions

### Prerequisites
- Windows 10/11
- Python 3.10+
- Node.js v18+ & npm
- MySQL Server 8.0+ running on `localhost:3306`

---

### 1. Database Setup (MySQL)

Open MySQL Command Line or Workbench:

```sql
CREATE DATABASE IF NOT EXISTS hireai_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Execute SQL migrations:
```powershell
# Navigate to database directory
cd "e:\AI hire\database"

# Import schemas (or let SQLAlchemy auto-create tables on FastAPI startup)
mysql -u root -p hireai_db < phase1_schema.sql
mysql -u root -p hireai_db < phase5_migration.sql
mysql -u root -p hireai_db < phase7_migration.sql
```

---

### 2. Backend Setup (FastAPI)

```powershell
# Navigate to backend directory
cd "e:\AI hire\backend"

# Create Python Virtual Environment
python -m venv venv

# Activate Virtual Environment
.\venv\Scripts\activate

# Install Dependencies
pip install -r requirements.txt

# Configure Environment (.env)
Copy-Item .env.example .env

# Seed Admin User & Demo Data
python seed_admin.py
python seed_demo_data.py

# Start FastAPI Uvicorn Server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

---

### 3. Frontend Setup (React + Vite)

```powershell
# Navigate to frontend directory
cd "e:\AI hire\frontend"

# Install Dependencies
npm install

# Configure Environment (.env)
Copy-Item .env.example .env

# Start Vite Development Server
npm run dev
```

Frontend UI will open at: **`http://localhost:5173`**  
Interactive API Docs (Swagger UI): **`http://localhost:8000/docs`**

---

## 🔑 Demo Credentials (Local Development)

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@hireai.com` | `admin123` | Full System Access & Recharts Analytics |
| **Recruiter 1** | `recruiter1@hireai.com` | `password123` | TechCorp Solutions (Senior Tech Roles) |
| **Recruiter 2** | `recruiter2@hireai.com` | `password123` | DataVision Analytics (AI & Data Science) |
| **Candidate 1** | `alice@example.com` | `password123` | Frontend Engineer (React, Redux, TS) |
| **Candidate 2** | `bob@example.com` | `password123` | Python Backend Developer (FastAPI, Docker) |
| **Candidate 3** | `ethan@example.com` | `password123` | Machine Learning Engineer (PyTorch, MLOps) |

---

## 🤖 AI Matching Methodology

HireAI calculates an objective candidate match score (0 to 100%) using a weighted formula:

$$\text{Final Score} = (\text{Skill Match} \times 0.40) + (\text{Experience Match} \times 0.20) + (\text{Education Match} \times 0.10) + (\text{Resume Similarity} \times 0.30)$$

1. **Skill Match (40%)**: Compares required vs preferred skills extracted from candidate profiles and job descriptions. Required skills carry higher weight than preferred skills.
2. **Experience Match (20%)**: Compares candidate's total years of experience against the job's minimum experience threshold.
3. **Education Match (10%)**: Evaluates degree level alignment (Doctorate > Master's > Bachelor's).
4. **Resume Similarity (30%)**: Converts job requirements and extracted resume text into TF-IDF vector representations via Scikit-Learn and computes **Cosine Similarity**:

$$\text{Cosine Similarity}(A, B) = \frac{A \cdot B}{\|A\| \|B\|}$$

---

## ⚖️ Responsible AI Commitment

> [!IMPORTANT]
> **HireAI is designed as a Human-in-the-Loop decision support tool.**
> - **No Automatic Hiring/Rejection**: Final hiring decisions remain strictly with human recruiters.
> - **Demographic Protection**: Candidate match scoring relies strictly on job-relevant skills, experience, education, and resume text. Demographic traits (gender, race, age, religion, photo) are strictly excluded from score formulas.

---

## 🔮 Future Enhancements

- Automated Email Notifications (SendGrid / SMTP integration)
- Calendar Scheduling for Candidate Interviews (Google Calendar / Outlook API)
- LLM Integration (Optional local Ollama / OpenAI adapter for resume summarization)
- Asynchronous Video Interview Sentiment & Audio Analysis

---

## 📄 License
Developed for HireAI Recruitment Systems. All rights reserved.
