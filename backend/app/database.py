import logging
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError, SQLAlchemyError
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

# Initialize database logger
logger = logging.getLogger("hireai.database")
logging.basicConfig(level=logging.INFO)

DATABASE_URL = settings.DATABASE_URL

# SQLAlchemy Base for ORM Models
Base = declarative_base()

def create_db_engine():
    """
    Creates and initializes the SQLAlchemy database engine.
    Connects FastAPI to MySQL specified by settings.DATABASE_URL.
    Includes pool_pre_ping and pool_recycle for connection reliability.
    """
    try:
        engine_kwargs = {
            "pool_pre_ping": True,     # Tests connection before handing from pool
            "pool_recycle": 3600,     # Recycles connection after 1 hour to prevent stale MySQL timeouts
            "echo": False,
        }
        
        if "sqlite" in DATABASE_URL:
            engine_kwargs["connect_args"] = {"check_same_thread": False}

        engine = create_engine(DATABASE_URL, **engine_kwargs)
        
        # Test database connectivity
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            
        logger.info("Successfully established connection to MySQL database engine.")
        return engine
        
    except (OperationalError, SQLAlchemyError) as e:
        logger.error(f"Error connecting to primary MySQL database engine ({e}).")
        logger.warning("Initializing local SQLite fallback database for uninterrupted execution.")
        db_file = "/tmp/hireai.db" if os.name != 'nt' else "./hireai.db"
        fallback_url = f"sqlite:///{db_file}"
        engine = create_engine(
            fallback_url,
            connect_args={"check_same_thread": False},
            echo=False
        )
        return engine
    except Exception as e:
        logger.critical(f"Unexpected critical error initializing database engine: {e}", exc_info=True)
        raise e

# Create Engine & Session Factory
engine = create_db_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """
    FastAPI Dependency yielding a database session per HTTP request.
    Ensures the session is cleanly closed upon request completion.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
