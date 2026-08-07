from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from db.database import get_db
from models.user import User
from models.evaluation import Point, Submission
from api.auth import get_current_user
from pydantic import BaseModel
from typing import List

router = APIRouter(
    prefix="/gamification",
    tags=["Gamification"]
)

class LeaderboardUser(BaseModel):
    user_id: int
    full_name: str
    total_points: int

@router.get("/leaderboard", response_model=List[LeaderboardUser])
def get_leaderboard(db: Session = Depends(get_db)):
    results = db.query(User, Point).join(Point, User.id == Point.user_id).order_by(Point.total_points.desc()).limit(50).all()
    
    leaderboard = []
    for user, point in results:
        leaderboard.append(LeaderboardUser(
            user_id=user.id,
            full_name=user.full_name,
            total_points=point.total_points
        ))
    return leaderboard

class ChartDataPoint(BaseModel):
    date: str
    points: int

@router.get("/profile/chart-data", response_model=List[ChartDataPoint])
def get_chart_data(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    results = db.query(
        func.date(Submission.submitted_at).label('date'),
        func.sum(Submission.points_awarded).label('points')
    ).filter(
        Submission.user_id == current_user.id
    ).group_by(
        func.date(Submission.submitted_at)
    ).order_by('date').all()
    
    data = []
    for r in results:
        data.append(ChartDataPoint(date=r.date, points=r.points or 0))
    return data
