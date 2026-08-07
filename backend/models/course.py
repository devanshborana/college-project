from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from db.database import Base

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    code = Column(String, unique=True, index=True)
    description = Column(Text, nullable=True)

    syllabus_items = relationship("SyllabusItem", back_populates="subject", cascade="all, delete")
    problems = relationship("Problem", back_populates="subject", cascade="all, delete")

class SyllabusItem(Base):
    __tablename__ = "syllabus_items"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    title = Column(String)
    content = Column(Text)
    order = Column(Integer, default=0)

    subject = relationship("Subject", back_populates="syllabus_items")

class Problem(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    title = Column(String)
    description = Column(Text)
    difficulty = Column(String, default="easy")
    points = Column(Integer, default=10)
    language_options = Column(JSON, default=list)  # e.g. ["python", "c++"]
    hidden_test_cases = Column(JSON, default=list) # [{"input": "...", "expected": "..."}]
    required_structures = Column(JSON, default=list) # e.g. ["for_loop"]
    
    starter_html = Column(Text, nullable=True)
    starter_css = Column(Text, nullable=True)
    starter_js = Column(Text, nullable=True)

    subject = relationship("Subject", back_populates="problems")
