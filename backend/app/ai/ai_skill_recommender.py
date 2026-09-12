import re
from typing import List, Dict, Any

# Local Learning Recommendations Knowledge Base (Zero paid APIs required)
SKILL_RECOMMENDATIONS_KB: Dict[str, str] = {
    "docker": "Learn Docker fundamentals, containers and image management, Dockerfiles, and multi-container orchestration with Docker Compose.",
    "kubernetes": "Study Kubernetes pod scheduling, deployments, services, ingress controllers, and cluster management.",
    "aws": "Gain hands-on experience with AWS EC2, S3, IAM, Lambda serverless functions, and CloudWatch monitoring.",
    "azure": "Learn Azure App Services, Azure Functions, Blob Storage, and Azure DevOps CI/CD deployment pipelines.",
    "gcp": "Study Google Cloud Platform Compute Engine, Cloud Run, BigQuery, and IAM permission management.",
    "react": "Master React hooks (useState, useEffect, useMemo), state management (Redux/Context), component lifecycle, and Next.js SSR.",
    "react.js": "Master React hooks (useState, useEffect, useMemo), state management (Redux/Context), component lifecycle, and Next.js SSR.",
    "fastapi": "Practice asynchronous Python async/await routes, Pydantic data validation, OpenAPI documentation, and Dependency Injection.",
    "python": "Focus on Python data structures, object-oriented programming, list comprehensions, decorators, and virtual environment isolation.",
    "javascript": "Master modern ES6+ JavaScript, Promises, Async/Await, DOM manipulation, closures, and event loop mechanics.",
    "typescript": "Study TypeScript static type annotations, interfaces, generics, union types, and compiler configuration.",
    "mysql": "Master relational database schema design, indexing strategies, complex JOIN queries, transactions, and ORM query optimization.",
    "postgresql": "Learn PostgreSQL advanced data types (JSONB), indexing, schema migrations, and concurrency control.",
    "mongodb": "Study NoSQL document data modeling, aggregation pipelines, indexing, and PyMongo/Mongoose integration.",
    "redis": "Learn Redis key-value caching patterns, pub/sub messaging, session storage, and API rate limiting.",
    "node.js": "Master Node.js event loop, asynchronous I/O, Streams, Express.js middleware, and REST API design.",
    "express": "Practice Express.js routing, custom middleware development, authentication tokens, and API error handling.",
    "django": "Learn Django MVT architecture, ORM queries, administrative panel, authentication, and Django REST Framework.",
    "flask": "Study Flask microframework routes, Jinja2 templates, SQLAlchemy ORM integration, and blueprint modularization.",
    "tailwind": "Learn utility-first responsive layout design, flexbox/grid containers, dark mode configuration, and custom design tokens.",
    "tailwindcss": "Learn utility-first responsive layout design, flexbox/grid containers, dark mode configuration, and custom design tokens.",
    "graphql": "Study GraphQL schema definition language, query resolvers, mutations, and Apollo Client integration.",
    "git": "Master Git branching workflows, rebase vs merge, commit history management, and GitHub pull request reviews.",
    "github": "Learn GitHub Actions CI/CD workflows, repository management, issue tracking, and code review practices.",
    "ci/cd": "Study automated build pipelines, GitHub Actions workflows, unit test automation, and continuous deployment.",
    "terraform": "Learn Infrastructure as Code (IaC), Terraform state management, cloud modules, and automated resource provisioning.",
    "pytorch": "Study deep learning neural network architectures, tensor manipulations, model training loops, and autograd.",
    "tensorflow": "Learn TensorFlow Keras models, data input pipelines, GPU acceleration, and model deployment.",
    "scikit-learn": "Practice supervised/unsupervised machine learning algorithms, model evaluation metrics, and feature scaling.",
    "nlp": "Learn text tokenization, TF-IDF vectorization, named entity recognition, and Transformer language models.",
    "microservices": "Study distributed system architecture, service discovery, API gateways, event-driven messaging, and fault tolerance.",
    "java": "Focus on Java Object-Oriented principles, multi-threading, Stream API, JVM memory tuning, and Maven/Gradle builds.",
    "spring boot": "Learn Spring Boot dependency injection, REST controllers, Spring Data JPA, and Spring Security.",
    "next.js": "Study Next.js App Router, Server Side Rendering (SSR), Static Site Generation (SSG), and Server Actions.",
    "vue.js": "Learn Vue 3 Composition API, reactive state management with Pinia, Vue Router, and component directives.",
    "angular": "Study Angular TypeScript components, RxJS Observables, dependency injection, and Angular CLI tooling.",
    "go": "Learn Go concurrency patterns (goroutines, channels), interfaces, package organization, and high-performance microservices.",
    "golang": "Learn Go concurrency patterns (goroutines, channels), interfaces, package organization, and high-performance microservices."
}


def get_skill_learning_recommendation(skill_name: str) -> str:
    """
    Returns tailored learning advice for a missing skill.
    Uses local knowledge base without external paid API calls.
    """
    clean_skill = skill_name.strip().lower()
    
    # Strip suffixes if skill string contains "(Required)" or "(Preferred)"
    clean_skill_core = re.sub(r'\s*\((required|preferred)\)', '', clean_skill).strip()

    if clean_skill_core in SKILL_RECOMMENDATIONS_KB:
        return SKILL_RECOMMENDATIONS_KB[clean_skill_core]

    # Partial match check
    for key, advice in SKILL_RECOMMENDATIONS_KB.items():
        if key in clean_skill_core or clean_skill_core in key:
            return advice

    return f"Learn {skill_name.strip()} core fundamentals, containers and image management, practice hands-on projects, and review official documentation."


def analyze_skill_gap(
    candidate_skills: List[str],
    job_skills: List[Dict[str, str]],
    job_description: str
) -> Dict[str, Any]:
    """
    Analyzes skill gap between candidate and job requirements.
    Calculates Skill Coverage percentage and provides missing skill learning recommendations.
    """
    cand_skills_lower = {s.lower().strip() for s in candidate_skills if s and s.strip()}

    required_job_skills = [s["skill_name"].strip() for s in job_skills if s.get("skill_type") == "required"]
    preferred_job_skills = [s["skill_name"].strip() for s in job_skills if s.get("skill_type") == "preferred"]

    # If no structured skills, fallback to scanning description
    if not required_job_skills and not preferred_job_skills:
        desc_words = set(re.findall(r'\b[A-Za-z0-9+#.-]{2,}\b', job_description))
        matched = [s for s in candidate_skills if s.lower() in {w.lower() for w in desc_words}]
        coverage = min(100.0, max(75.0, (len(matched) / max(1, len(candidate_skills))) * 100.0))
        return {
            "matched_skills": matched,
            "missing_skills": [],
            "preferred_skills": [],
            "skill_coverage": round(coverage, 1),
            "learning_recommendations": []
        }

    matched_skills = []
    missing_required = []
    missing_preferred = []
    learning_recommendations = []

    # Check Required Skills
    for r_skill in required_job_skills:
        r_lower = r_skill.lower()
        if r_lower in cand_skills_lower or any(r_lower in cs for cs in cand_skills_lower):
            matched_skills.append(r_skill)
        else:
            missing_required.append(r_skill)
            learning_recommendations.append({
                "skill_name": r_skill,
                "skill_type": "Required",
                "recommendation": get_skill_learning_recommendation(r_skill)
            })

    # Check Preferred Skills
    for p_skill in preferred_job_skills:
        p_lower = p_skill.lower()
        if p_lower in cand_skills_lower or any(p_lower in cs for cs in cand_skills_lower):
            matched_skills.append(f"{p_skill} (Preferred)")
        else:
            missing_preferred.append(p_skill)
            learning_recommendations.append({
                "skill_name": p_skill,
                "skill_type": "Preferred",
                "recommendation": get_skill_learning_recommendation(p_skill)
            })

    # Calculate Skill Coverage % based on required skills satisfied
    if required_job_skills:
        matched_req_count = len(required_job_skills) - len(missing_required)
        skill_coverage = (matched_req_count / len(required_job_skills)) * 100.0
    else:
        skill_coverage = 80.0

    skill_coverage = round(min(100.0, max(0.0, skill_coverage)), 1)
    all_missing = missing_required + [f"{ps} (Preferred)" for ps in missing_preferred]

    return {
        "matched_skills": matched_skills,
        "missing_skills": all_missing,
        "preferred_skills": preferred_job_skills,
        "skill_coverage": skill_coverage,
        "learning_recommendations": learning_recommendations
    }
