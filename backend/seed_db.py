import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from db.database import engine, SessionLocal
from models.course import Subject, SyllabusItem, Problem
import json

def seed():
    db = SessionLocal()
    
    # Check if already seeded
    if db.query(Subject).count() > 0:
        print("Database already seeded.")
        return
        
    subjects_data = [
        {"name": "PPCE", "code": "PPCE101", "description": "Principles of Programming & C/C++"},
        {"name": "Math", "code": "MATH101", "description": "Applied Mathematics"},
        {"name": "C++", "code": "CPP201", "description": "Object Oriented Programming in C++"},
        {"name": "C", "code": "C101", "description": "Advanced C Programming"},
        {"name": "Python", "code": "PY301", "description": "Python for Data Science"},
        {"name": "Web Technology", "code": "WT401", "description": "Full Stack Web Development"}
    ]
    
    print("Seeding subjects...")
    db_subjects = []
    for s_data in subjects_data:
        subject = Subject(**s_data)
        db.add(subject)
        db_subjects.append(subject)
    db.commit()
    
    # Refresh to get IDs
    for subject in db_subjects:
        db.refresh(subject)
        
    print("Seeding syllabus and problems...")
    for subject in db_subjects:
        # 2 sample syllabus items
        for i in range(1, 3):
            s_item = SyllabusItem(
                subject_id=subject.id,
                title=f"Topic {i} for {subject.name}",
                content=f"This is the detailed content for Topic {i} of {subject.name}.",
                order=i
            )
            db.add(s_item)
            
        # 2 practice problems
        for i in range(1, 3):
            prob = Problem(
                subject_id=subject.id,
                title=f"{subject.name} Practice Problem {i}",
                description=f"Solve the basic algorithmic challenge related to {subject.name} concepts.",
                difficulty="easy" if i == 1 else "medium",
                points=10 * i,
                language_options=["python", "c++", "c"],
                hidden_test_cases=[{"input": "1 2\n", "expected": "3\n"}],
                required_structures=["for_loop"] if i == 2 else []
            )
            db.add(prob)
            
    db.commit()
    db.close()
    print("Seed complete!")

if __name__ == "__main__":
    seed()
