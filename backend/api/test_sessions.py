from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from db.database import get_db
from models.user import User
from models.evaluation import TestSession, ViolationLog
from schemas.test_session import TestSessionCreate, TestSessionResponse, ViolationCreate, ViolationResponse
from api.auth import get_current_user

router = APIRouter(
    prefix="/test-sessions",
    tags=["TestSessions"]
)

@router.post("/start", response_model=TestSessionResponse)
def start_session(req: TestSessionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    session = TestSession(
        user_id=current_user.id,
        subject_id=req.subject_id,
        started_at=datetime.utcnow(),
        status="active"
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

@router.post("/{session_id}/violation", response_model=ViolationResponse)
def log_violation(session_id: int, req: ViolationCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    session = db.query(TestSession).filter(TestSession.id == session_id, TestSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    violation = ViolationLog(
        test_session_id=session.id,
        type=req.type,
        timestamp=datetime.utcnow(),
        details=req.details
    )
    db.add(violation)
    db.commit()
    db.refresh(violation)
    return violation

@router.post("/{session_id}/end", response_model=TestSessionResponse)
def end_session(session_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    session = db.query(TestSession).filter(TestSession.id == session_id, TestSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    session.ended_at = datetime.utcnow()
    session.status = "completed"
    db.commit()
    db.refresh(session)
    return session

# Instructor endpoint
@router.get("/logs", response_model=list[ViolationResponse])
def get_all_logs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "instructor":
        raise HTTPException(status_code=403, detail="Not authorized")
    return db.query(ViolationLog).order_by(ViolationLog.timestamp.desc()).all()
