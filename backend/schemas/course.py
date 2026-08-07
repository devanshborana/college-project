from pydantic import BaseModel
from typing import List, Optional, Any

# Syllabus Schemas
class SyllabusItemBase(BaseModel):
    title: str
    content: str
    order: Optional[int] = 0

class SyllabusItemCreate(SyllabusItemBase):
    subject_id: int

class SyllabusItemResponse(SyllabusItemBase):
    id: int
    subject_id: int

    class Config:
        from_attributes = True

# Problem Schemas
class ProblemBase(BaseModel):
    title: str
    description: str
    difficulty: str = "easy"
    points: int = 10
    language_options: List[str] = []
    hidden_test_cases: List[Any] = []
    required_structures: List[str] = []

class ProblemCreate(ProblemBase):
    subject_id: int

class ProblemResponse(ProblemBase):
    id: int
    subject_id: int

    class Config:
        from_attributes = True

# Subject Schemas
class SubjectBase(BaseModel):
    name: str
    code: str
    description: Optional[str] = None

class SubjectCreate(SubjectBase):
    pass

class SubjectResponse(SubjectBase):
    id: int
    syllabus_items: List[SyllabusItemResponse] = []
    problems: List[ProblemResponse] = []

    class Config:
        from_attributes = True
