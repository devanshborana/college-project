from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import ast
import re
import datetime
import subprocess
import time
import os
import tempfile
import sys
from playwright.sync_api import sync_playwright

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from db.database import get_db
from models.user import User
from models.course import Problem
from models.evaluation import Submission, HintUsed, Point
from schemas.evaluation import EvaluationRequest, EvaluationResponse, TestCaseResult, HintRequest, HintResponse
from api.auth import get_current_user

router = APIRouter(
    prefix="/evaluation",
    tags=["Evaluation"]
)

LANGUAGE_CONFIG = {
    "python": {"image": "lmcst-sandbox-python", "filename": "main.py"},
    "cpp": {"image": "lmcst-sandbox-cpp", "filename": "main.cpp"},
    "c": {"image": "lmcst-sandbox-c", "filename": "main.c"},
    "java": {"image": "lmcst-sandbox-java", "filename": "Main.java"},
    "javascript": {"image": "lmcst-sandbox-javascript", "filename": "main.js"},
}

def run_in_sandbox(language: str, code: str, stdin: str) -> dict:
    if language not in LANGUAGE_CONFIG:
        return {"stdout": "", "stderr": f"Unsupported language: {language}", "exit_code": -1, "time_ms": 0}
        
    config = LANGUAGE_CONFIG[language]
    temp_dir = tempfile.mkdtemp()
    file_path = os.path.join(temp_dir, config["filename"])
    
    with open(file_path, 'w') as f:
        f.write(code)
        
    abs_temp_dir = os.path.abspath(temp_dir)
    memory_limit = "256m" if language == "java" else "128m"
    timeout = 10 if language == "java" else 5
    
    start = time.time()
    try:
        docker_cmd = [
            "docker", "run", "--rm", "--network", "none",
            "--memory", memory_limit, "--cpus", "0.5",
            "-v", f"{abs_temp_dir}:/app", "-i", config["image"]
        ]
        process = subprocess.Popen(docker_cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        stdout, stderr = process.communicate(input=stdin, timeout=timeout)
        exit_code = process.returncode
    except subprocess.TimeoutExpired:
        process.kill()
        stdout, stderr = process.communicate()
        exit_code = -1
        stderr += f"\nExecution timed out ({timeout}s limit)."
    except Exception as e:
        stdout = ""
        stderr = str(e)
        exit_code = -1
    finally:
        for extra_file in os.listdir(temp_dir):
            try: os.remove(os.path.join(temp_dir, extra_file))
            except: pass
        try: os.rmdir(temp_dir)
        except: pass
        
    time_ms = int((time.time() - start) * 1000)
    return {"stdout": stdout, "stderr": stderr, "exit_code": exit_code, "time_ms": time_ms}

def check_structures(code: str, language: str, required_structures: list) -> bool:
    if not required_structures:
        return True
    
    met = True
    if language == "python":
        try:
            tree = ast.parse(code)
            for req in required_structures:
                if req == "for_loop":
                    if not any(isinstance(node, ast.For) for node in ast.walk(tree)): met = False
                elif req == "recursion":
                    if not re.search(r'def\s+(\w+)\b.*:\s*(?:.|\n)*\b\1\s*\(', code): met = False
        except:
            met = False
    else:
        for req in required_structures:
            if req == "for_loop":
                if not re.search(r'\bfor\s*\(', code): met = False
                
    return met

@router.post("/evaluate", response_model=EvaluationResponse)
def evaluate_code(request: EvaluationRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    problem = db.query(Problem).filter(Problem.id == request.problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
        
    test_cases = problem.hidden_test_cases or []
    req_structures = problem.required_structures or []
    
    results = []
    all_passed = True
    total_time = 0
    structures_met = True
    
    if request.language == "web":
        combined_html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>{request.css or ''}</style>
        </head>
        <body>
            {request.html or ''}
            <script>{request.js or ''}</script>
        </body>
        </html>
        """
        
        start = time.time()
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch()
                page = browser.new_page()
                page.set_content(combined_html)
                
                for tc in test_cases:
                    js_assert = tc.get("input", "return true;")
                    try:
                        passed_val = page.evaluate(f"() => {{ {js_assert} }}")
                        expected = tc.get("expected", "true").strip()
                        actual = str(passed_val)
                        
                        passed = actual.lower() == expected.lower()
                        if not passed: all_passed = False
                        
                        results.append(TestCaseResult(
                            passed=passed,
                            actual_output=actual,
                            expected_output=expected,
                            error=None if passed else "DOM Assertion failed"
                        ))
                    except Exception as e:
                        all_passed = False
                        results.append(TestCaseResult(
                            passed=False,
                            actual_output="",
                            expected_output=tc.get("expected", ""),
                            error=str(e)
                        ))
                browser.close()
        except Exception as e:
            all_passed = False
            results.append(TestCaseResult(passed=False, actual_output="", expected_output="", error=str(e)))
            
        total_time = int((time.time() - start) * 1000)
        structures_met = check_structures(request.js or "", "javascript", req_structures)
        
    else:
        for tc in test_cases:
            res = run_in_sandbox(request.language, request.code or "", tc.get("input", ""))
            actual = res["stdout"].strip()
            expected = tc.get("expected", "").strip()
            
            passed = (actual == expected) and res["exit_code"] == 0
            if not passed: all_passed = False
                
            results.append(TestCaseResult(
                passed=passed,
                actual_output=actual,
                expected_output=expected,
                error=res["stderr"] if res["exit_code"] != 0 else None
            ))
            total_time += res["time_ms"]
            
        structures_met = check_structures(request.code or "", request.language, req_structures)
    
    points_awarded = 0
    status = "failed"
    if all_passed and structures_met:
        points_awarded = problem.points
        status = "passed"
    elif all_passed and not structures_met:
        status = "passed_missing_structures"
        
    submission = Submission(
        user_id=current_user.id,
        problem_id=problem.id,
        language=request.language,
        code=request.code,
        status=status,
        points_awarded=points_awarded
    )
    db.add(submission)
    
    if points_awarded > 0:
        point_record = db.query(Point).filter(Point.user_id == current_user.id).first()
        if not point_record:
            point_record = Point(user_id=current_user.id, total_points=points_awarded)
            db.add(point_record)
        else:
            point_record.total_points += points_awarded
            
    db.commit()
    
    msg = "Success!" if status == "passed" else "Failed test cases or missing required structures."
    return EvaluationResponse(
        status=status,
        points_awarded=points_awarded,
        test_results=results,
        structural_requirements_met=structures_met,
        message=msg
    )

@router.post("/hints/request", response_model=HintResponse)
def request_hint(req: HintRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    today = datetime.date.today().isoformat()
    hints_used = db.query(HintUsed).filter(HintUsed.user_id == current_user.id, HintUsed.date == today).all()
    total_hints_today = sum(h.count for h in hints_used)
    
    MAX_HINTS = 5
    if total_hints_today >= MAX_HINTS:
        raise HTTPException(status_code=429, detail="Daily hint limit exceeded (max 5/day).")
        
    hint_text = "Review the problem description carefully."
    if req.error_message:
        if "SyntaxError" in req.error_message or "unexpected EOF" in req.error_message:
            hint_text = "You might be missing a closing bracket, quote, or parenthesis. Check your syntax."
        elif "IndentationError" in req.error_message:
            hint_text = "Python relies on strict indentation (spaces/tabs). Make sure your blocks line up."
    elif req.failing_test_input:
        hint_text = f"Your code fails for this input: {req.failing_test_input}. Try tracing your logic step by step with this input."

    hint_record = db.query(HintUsed).filter(HintUsed.user_id == current_user.id, HintUsed.problem_id == req.problem_id, HintUsed.date == today).first()
    if hint_record:
        hint_record.count += 1
    else:
        db.add(HintUsed(user_id=current_user.id, problem_id=req.problem_id, date=today, count=1))
    db.commit()
    
    return HintResponse(hint=hint_text, hints_remaining_today=MAX_HINTS - total_hints_today - 1)
