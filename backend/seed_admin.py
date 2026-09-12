import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models.user import User
from app.utils.security import hash_password

def seed_admin_user():
    print("--- Seeding Admin User for HireAI ---")
    db = SessionLocal()
    try:
        admin_email = "admin@hireai.com"
        admin_user = db.query(User).filter(User.email == admin_email).first()

        if not admin_user:
            print(f"Creating default admin account: {admin_email}")
            admin_user = User(
                name="System Administrator",
                email=admin_email,
                password_hash=hash_password("admin123"),
                role="admin",
                company="HireAI Platform",
                is_active=True
            )
            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)
            print(f"Admin user created successfully! ID: {admin_user.id}, Role: {admin_user.role}")
        else:
            print(f"Admin account found (ID: {admin_user.id}). Updating role and active status...")
            admin_user.role = "admin"
            admin_user.is_active = True
            admin_user.password_hash = hash_password("admin123")
            db.commit()
            print(f"Admin account updated successfully! Role: {admin_user.role}, Is Active: {admin_user.is_active}")

    except Exception as e:
        print(f"Error seeding admin user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_admin_user()
