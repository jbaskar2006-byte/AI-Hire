"""
Seed Script for HireAI Database
Populates initial demo accounts for Recruiter, Candidate, and Admin roles.
"""
import logging
from app.database import engine, SessionLocal, Base
from app.models import User
from app.security import get_password_hash

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("hireai.seed")

def seed_database():
    logger.info("Creating database tables if not present...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        demo_users = [
            {
                "full_name": "Sarah Connor (HR Lead)",
                "email": "recruiter@hireai.com",
                "hashed_password": get_password_hash("password123"),
                "role": "recruiter",
                "company": "Apex Global Tech",
                "headline": "Senior Talent Acquisition Manager",
                "phone": "+1 (555) 234-5678",
                "avatar_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
            },
            {
                "full_name": "David Miller (Software Engineer)",
                "email": "candidate@hireai.com",
                "hashed_password": get_password_hash("password123"),
                "role": "candidate",
                "company": "Tech Talent Network",
                "headline": "Full Stack Developer | AI Enthusiast",
                "phone": "+1 (555) 876-5432",
                "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            },
            {
                "full_name": "System Administrator",
                "email": "admin@hireai.com",
                "hashed_password": get_password_hash("admin123"),
                "role": "admin",
                "company": "HireAI Platform",
                "headline": "System Operations & Security Admin",
                "phone": "+1 (555) 000-1111",
                "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
            }
        ]
        
        seeded_count = 0
        for u_data in demo_users:
            existing = db.query(User).filter(User.email == u_data["email"]).first()
            if not existing:
                user = User(**u_data)
                db.add(user)
                seeded_count += 1
                logger.info(f"Seeded user: {u_data['email']} ({u_data['role']})")
            else:
                logger.info(f"User already exists: {u_data['email']}")
                
        db.commit()
        logger.info(f"Seeding completed successfully! Added {seeded_count} demo user(s).")
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
