from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TestSessionCreate(BaseModel):
    subject_id: int

class TestSessionResponse(BaseModel):
    id: int
    user_id: int
    subject_id: int
    started_at: datetime
    status: str

    class Config:
        from_attributes = True

class ViolationCreate(BaseModel):
    type: str
    details: Optional[str] = None

class ViolationResponse(BaseModel):
    id: int
    test_session_id: int
    type: str
    timestamp: datetime
    details: Optional[str] = None

    class Config:
        from_attributes = True
