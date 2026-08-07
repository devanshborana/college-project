from pydantic import BaseModel
from typing import List, Optional

class TestCaseResult(BaseModel):
    passed: bool
    actual_output: str
    expected_output: str
    error: Optional[str] = None

class EvaluationRequest(BaseModel):
    problem_id: int
    language: str
    code: Optional[str] = None
    html: Optional[str] = None
    css: Optional[str] = None
    js: Optional[str] = None

class EvaluationResponse(BaseModel):
    status: str
    points_awarded: int
    test_results: List[TestCaseResult]
    structural_requirements_met: bool
    message: str

class HintRequest(BaseModel):
    problem_id: int
    error_message: Optional[str] = None
    failing_test_input: Optional[str] = None
    language: str

class HintResponse(BaseModel):
    hint: str
    hints_remaining_today: int
