from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import auth, courses, execution, evaluation, test_sessions, gamification, instructor
from db.database import engine
from models import user

user.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="LMCST Learn API",
    description="Backend API for Lachoo Memorial College of Science and Technology platform",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(execution.router)
app.include_router(evaluation.router)
app.include_router(test_sessions.router)
app.include_router(gamification.router)
app.include_router(instructor.router)

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "LMCST Learn API is running"}
