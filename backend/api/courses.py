from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from db.database import get_db
from models.course import Subject, SyllabusItem, Problem
from schemas.course import (
    SubjectCreate, SubjectResponse,
    SyllabusItemCreate, SyllabusItemResponse,
    ProblemCreate, ProblemResponse
)

router = APIRouter(
    prefix="/courses",
    tags=["Courses"]
)

# --- Subjects ---
@router.get("/subjects", response_model=List[SubjectResponse])
def get_subjects(db: Session = Depends(get_db)):
    return db.query(Subject).all()

@router.post("/subjects", response_model=SubjectResponse)
def create_subject(subject: SubjectCreate, db: Session = Depends(get_db)):
    # Note: In a real app, protect this route with instructor role check
    db_subject = Subject(**subject.model_dump())
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject

@router.get("/subjects/{subject_id}", response_model=SubjectResponse)
def get_subject(subject_id: int, db: Session = Depends(get_db)):
    db_subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return db_subject

# --- Syllabus ---
@router.post("/syllabus", response_model=SyllabusItemResponse)
def create_syllabus_item(item: SyllabusItemCreate, db: Session = Depends(get_db)):
    db_item = SyllabusItem(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/subjects/{subject_id}/syllabus", response_model=List[SyllabusItemResponse])
def get_syllabus(subject_id: int, db: Session = Depends(get_db)):
    return db.query(SyllabusItem).filter(SyllabusItem.subject_id == subject_id).order_by(SyllabusItem.order).all()

# --- Problems ---
@router.post("/problems", response_model=ProblemResponse)
def create_problem(problem: ProblemCreate, db: Session = Depends(get_db)):
    db_problem = Problem(**problem.model_dump())
    db.add(db_problem)
    db.commit()
    db.refresh(db_problem)
    return db_problem

@router.get("/subjects/{subject_id}/problems", response_model=List[ProblemResponse])
def get_problems(subject_id: int, db: Session = Depends(get_db)):
    return db.query(Problem).filter(Problem.subject_id == subject_id).all()
