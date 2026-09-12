import random
from typing import List, Dict, Any, Optional

# Pre-defined Skill Question Banks
SKILL_QUESTION_BANK = {
    "python": [
        "Explain Python's GIL (Global Interpreter Lock) and how it impacts multithreading vs multiprocessing.",
        "How do Python decorators work under the hood? Provide a practical code example.",
        "What is the difference between shallow copy and deep copy in Python (`copy.copy` vs `copy.deepcopy`)?",
        "How do list comprehensions, generators, and iterators differ in terms of memory consumption?"
    ],
    "java": [
        "Explain the JVM memory model (Heap, Stack, Metaspace) and how Garbage Collection works.",
        "What is the difference between interfaces and abstract classes in Java 8 and newer versions?",
        "How does HashMap work internally in Java, and how are hash collisions handled?",
        "Explain multithreading in Java, including the synchronized keyword and volatile variables."
    ],
    "react": [
        "Explain how React's Virtual DOM diffing algorithm works and why `key` props are essential.",
        "Compare `useEffect`, `useCallback`, and `useMemo` hooks. When should each be used?",
        "How do you handle complex global state management in React (Context API vs Redux Toolkit)?",
        "What strategies do you use to optimize render performance in a large-scale React application?"
    ],
    "javascript": [
        "Explain the Event Loop, Microtasks (Promises), and Macrotasks (`setTimeout`) in JavaScript.",
        "What are Closures in JavaScript? Give a scenario where closures are useful or cause memory leaks.",
        "Explain prototypal inheritance in JavaScript and how ES6 classes build upon it.",
        "What is the difference between `var`, `let`, and `const` regarding scoping and hoisting?"
    ],
    "mysql": [
        "How do database indexes (B-Trees) work, and how do you analyze query performance using `EXPLAIN`?",
        "Explain ACID properties and transaction isolation levels in the MySQL InnoDB storage engine.",
        "What is the difference between `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, and subqueries?",
        "How do you handle database normalization vs denormalization in high-throughput applications?"
    ],
    "machine learning": [
        "Explain the Bias-Variance tradeoff and techniques to prevent overfitting in ML models.",
        "Compare Precision, Recall, and F1-Score. When would you prioritize Recall over Precision?",
        "How do Gradient Boosting algorithms (XGBoost, LightGBM) differ from Random Forests?",
        "Explain feature scaling, normalization, and handling missing or imbalanced data in ML pipelines."
    ],
    "fastapi": [
        "How does FastAPI leverage Pydantic, Starlette, and Python's `asyncio` for high-performance APIs?",
        "Explain Dependency Injection in FastAPI and how to manage asynchronous database sessions.",
        "How do you implement OAuth2 with JWT authentication and role-based authorization in FastAPI?",
        "What is the difference between synchronous def and async def path operation functions in FastAPI?"
    ],
    "docker": [
        "What is the difference between a Docker image and a container, and how do multi-stage builds reduce image size?",
        "How do Docker volumes and custom bridge networks facilitate local microservice deployment?",
        "Explain how Docker Compose orchestrates multi-container applications."
    ],
    "aws": [
        "Compare serverless architecture (AWS Lambda + API Gateway) vs container deployment on ECS/EKS.",
        "How do IAM policies, roles, and VPC security groups work together to secure cloud resources?",
        "What strategies would you use for automated backups and zero-downtime deployments on AWS?"
    ],
    "sql": [
        "Explain window functions in SQL (`ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`) with a practical use case.",
        "How do you optimize slow-performing SQL queries involving large table joins?",
        "What are database transactions and how do savepoints work in complex batch operations?"
    ],
    "html": [
        "What is semantic HTML and why is it crucial for accessibility (a11y) and SEO?",
        "Explain the HTML5 box model and responsive meta viewport tags."
    ],
    "css": [
        "Compare CSS Flexbox and CSS Grid layout systems. When should you choose one over the other?",
        "Explain CSS specificity rules, cascade, and utility-first vs modular styling approaches."
    ],
    "node.js": [
        "Explain the non-blocking I/O event-driven architecture of Node.js.",
        "How does Node.js handle heavy CPU-intensive tasks without blocking the main event loop?"
    ],
    "git": [
        "Explain the difference between `git merge` and `git rebase`, and when to use each.",
        "How do you resolve complex merge conflicts in git repository branches?"
    ]
}

# Generic HR Question Templates
HR_QUESTIONS = [
    "Tell me about a challenging technical project you worked on recently. What was your role and how did you overcome obstacles?",
    "How do you prioritize competing deadlines and stay organized when managing multiple feature requests?",
    "Describe a situation where you had a disagreement with a team member or technical lead. How did you resolve it?",
    "Where do you see your career progressing over the next 2 to 3 years, and how does this position align with your goals?",
    "How do you stay updated with emerging technologies and continuous learning in software engineering?",
    "Describe a situation where a production issue occurred. What steps did you take to troubleshoot and prevent recurrence?",
    "What work environment allows you to perform at your best, and how do you handle feedback or code reviews?"
]

# Project Question Templates
PROJECT_QUESTIONS = [
    "Walk me through the architecture of a key project you built. What major design decisions did you make?",
    "What was the most complex feature in your previous projects, and how did you implement it step-by-step?",
    "How did you test, benchmark, or validate your project's performance and data integrity?",
    "If you were to rewrite or redesign your previous project today, what would you do differently and why?",
    "Describe how you handled security, data validation, and error management in your past project implementations."
]

class InterviewQuestionGenerator:
    """
    Intelligent Rule-Based Interview Question Generator.
    Categorizes questions into:
    - Technical Questions (matched skills & job role)
    - HR Questions (workplace, teamwork, career goals)
    - Project Questions (past experience & system design)
    - Skill-Based Questions (missing skills & gap bridging)
    """

    def generate_questions(
        self,
        job_title: str,
        required_skills: List[str],
        candidate_skills: List[str],
        missing_skills: List[str],
        experience_years: float = 0,
        projects_info: Optional[str] = None,
        num_questions: int = 10
    ) -> List[Dict[str, str]]:
        """
        Generate a list of categorized interview questions.
        Returns a list of dicts: [{"category": "Technical"|"HR"|"Project"|"Skill-Based", "question": str}]
        """
        req_norm = [s.strip().lower() for s in required_skills if s.strip()]
        cand_norm = [s.strip().lower() for s in candidate_skills if s.strip()]
        miss_norm = [s.strip().lower() for s in missing_skills if s.strip()]

        matched_skills = [s for s in req_norm if s in cand_norm]
        if not matched_skills and cand_norm:
            matched_skills = cand_norm

        questions: List[Dict[str, str]] = []
        used_questions_set = set()

        def add_q(category: str, q_text: str):
            if q_text not in used_questions_set:
                used_questions_set.add(q_text)
                questions.append({"category": category, "question": q_text})

        # 1. Technical Questions (Targeting matched & required skills + Job Role)
        # Job role question
        add_q(
            "Technical",
            f"As a {job_title}, how do you approach software architecture design, clean code standards, and maintainability?"
        )

        # Skill specific technical questions
        for skill in matched_skills + req_norm:
            skill_key = skill.lower()
            if skill_key in SKILL_QUESTION_BANK:
                for q in SKILL_QUESTION_BANK[skill_key]:
                    add_q("Technical", q)

        # General technical questions if needed
        if len([q for q in questions if q["category"] == "Technical"]) < 3:
            add_q("Technical", f"What software patterns or frameworks do you prefer when delivering features for a {job_title} role?")
            add_q("Technical", "How do you ensure application security and input validation in your REST API endpoints?")

        # 2. Skill-Based Questions (Targeting missing skills or gap bridging)
        for skill in miss_norm:
            skill_key = skill.lower()
            if skill_key in SKILL_QUESTION_BANK:
                q_text = f"The {job_title} role requires {skill.title()}. While this isn't prominent in your profile, how would you approach mastering {skill.title()} for this role?"
                add_q("Skill-Based", q_text)
                # Also include a fundamental question for missing skill
                add_q("Skill-Based", SKILL_QUESTION_BANK[skill_key][0])
            else:
                add_q("Skill-Based", f"This position requires proficiency in {skill.title()}. What experience do you have with {skill.title()} or similar technologies?")

        if not miss_norm:
            add_q("Skill-Based", f"You possess the core skills required for {job_title}. How do you continuously deepen your domain expertise?")

        # 3. Project Questions (Tailored to experience level & project summary)
        if projects_info:
            add_q("Project", f"Regarding your experience with {projects_info}: What was the most technical challenge you faced and how did you resolve it?")

        for p_q in PROJECT_QUESTIONS:
            add_q("Project", p_q)

        # Experience level tuning for Senior/Junior
        if experience_years >= 5:
            add_q("Project", f"Given your {experience_years}+ years of experience, how do you mentor junior developers and drive technical decision-making?")
        elif experience_years > 0:
            add_q("Project", f"With {experience_years} years of experience, how do you manage code reviews and collaboration with senior team members?")

        # 4. HR Questions
        for hr_q in HR_QUESTIONS:
            add_q("HR", hr_q)

        # Ensure representation across all 4 categories
        categories = ["Technical", "HR", "Project", "Skill-Based"]
        selected_questions: List[Dict[str, str]] = []

        # Target ratio: ~40% Technical, ~20% Skill-Based, ~20% Project, ~20% HR
        # Ensure at least 1 from each category if available
        by_cat: Dict[str, List[Dict[str, str]]] = {c: [] for c in categories}
        for q in questions:
            by_cat[q["category"]].append(q)

        # Step A: Take at least 1-2 questions from each category
        for cat in categories:
            count = 2 if cat == "Technical" else 1
            available = by_cat[cat]
            take = available[:count]
            selected_questions.extend(take)
            by_cat[cat] = available[count:]

        # Step B: Fill the rest until num_questions reached
        remaining_needed = num_questions - len(selected_questions)
        if remaining_needed > 0:
            all_remaining = []
            for cat in ["Technical", "Skill-Based", "Project", "HR"]:
                all_remaining.extend(by_cat[cat])
            selected_questions.extend(all_remaining[:remaining_needed])

        # Truncate if over num_questions
        final_list = selected_questions[:num_questions]
        return final_list

interview_generator = InterviewQuestionGenerator()
