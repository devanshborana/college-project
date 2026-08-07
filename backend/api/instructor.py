from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from db.database import get_db
from models.user import User
from models.evaluation import TestSession, ViolationLog, Submission
from models.course import Problem
from api.auth import get_current_user
from pydantic import BaseModel
from typing import List

router = APIRouter(
    prefix="/instructor",
    tags=["Instructor"]
)

class FlaggedSession(BaseModel):
    session_id: int
    user_name: str
    subject_id: int
    violation_count: int

@router.get("/flagged-sessions", response_model=List[FlaggedSession])
def get_flagged_sessions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != 'instructor':
        raise HTTPException(status_code=403, detail="Not authorized")
        
    sessions = db.query(
        TestSession.id, 
        User.full_name,
        TestSession.subject_id,
        func.count(ViolationLog.id).label('v_count')
    ).join(User, TestSession.user_id == User.id)\
     .outerjoin(ViolationLog, TestSession.id == ViolationLog.test_session_id)\
     .group_by(TestSession.id, User.full_name, TestSession.subject_id)\
     .having(func.count(ViolationLog.id) > 0)\
     .order_by(func.count(ViolationLog.id).desc()).all()
     
    return [FlaggedSession(
        session_id=s.id,
        user_name=s.full_name,
        subject_id=s.subject_id,
        violation_count=s.v_count
    ) for s in sessions]

class ProblemStat(BaseModel):
    problem_title: str
    total_submissions: int
    fail_rate: float

@router.get("/stats", response_model=List[ProblemStat])
def get_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != 'instructor':
        raise HTTPException(status_code=403, detail="Not authorized")
        
    stats = []
    problems = db.query(Problem).all()
    for p in problems:
        total = db.query(Submission).filter(Submission.problem_id == p.id).count()
        failed = db.query(Submission).filter(Submission.problem_id == p.id, Submission.status != 'passed').count()
        if total > 0:
            stats.append(ProblemStat(
                problem_title=p.title,
                total_submissions=total,
                fail_rate=round(failed / total * 100, 2)
            ))
            
    stats.sort(key=lambda x: x.fail_rate, reverse=True)
    return stats
