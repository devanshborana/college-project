from pydantic import BaseModel
from typing import Optional

class ExecutionRequest(BaseModel):
    language: str
    code: str
    stdin: Optional[str] = ""

class ExecutionResponse(BaseModel):
    stdout: str
    stderr: str
    time_ms: int
    exit_code: int
