import sys
import os

# Add backend directory to sys.path
backend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

try:
    from app.main import app
    try:
        from mangum import Mangum
        handler = Mangum(app)
    except ImportError:
        handler = app
except Exception as e:
    from fastapi import FastAPI
    app = FastAPI()
    @app.api_route("/api/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"])
    def error_fallback(path: str):
        return {"status": "error", "message": "Backend initialization error", "detail": str(e)}
    handler = app
