-- HireAI Database Migration - Phase 5: AI Job Matching and Candidate Ranking

USE hireai_db;

-- 1. Candidate Scores Table
CREATE TABLE IF NOT EXISTS candidate_scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    job_id INT NOT NULL,
    skill_score FLOAT NOT NULL DEFAULT 0.0,
    experience_score FLOAT NOT NULL DEFAULT 0.0,
    education_score FLOAT NOT NULL DEFAULT 0.0,
    similarity_score FLOAT NOT NULL DEFAULT 0.0,
    final_score FLOAT NOT NULL DEFAULT 0.0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (candidate_id) REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    CONSTRAINT uq_candidate_job_score UNIQUE (candidate_id, job_id),
    INDEX idx_candidate_job (candidate_id, job_id),
    INDEX idx_job_final_score (job_id, final_score DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
