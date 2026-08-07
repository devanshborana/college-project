from fastapi import APIRouter, HTTPException
import subprocess
import time
import os
import tempfile
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from schemas.execution import ExecutionRequest, ExecutionResponse

router = APIRouter(
    prefix="/execute",
    tags=["Execution"]
)

# Language config for Docker
LANGUAGE_CONFIG = {
    "python": {"image": "lmcst-sandbox-python", "filename": "main.py"},
    "cpp": {"image": "lmcst-sandbox-cpp", "filename": "main.cpp"},
    "c": {"image": "lmcst-sandbox-c", "filename": "main.c"},
    "java": {"image": "lmcst-sandbox-java", "filename": "Main.java"},
    "javascript": {"image": "lmcst-sandbox-javascript", "filename": "main.js"},
}

@router.post("/", response_model=ExecutionResponse)
def execute_code(request: ExecutionRequest):
    if request.language not in LANGUAGE_CONFIG:
        raise HTTPException(status_code=400, detail=f"Language {request.language} not supported.")
    
    config = LANGUAGE_CONFIG[request.language]
    image_name = config["image"]
    filename = config["filename"]
    
    start_time = time.time()
    
    # Create a temporary directory to mount into the container
    temp_dir = tempfile.mkdtemp()
    file_path = os.path.join(temp_dir, filename)
    
    with open(file_path, 'w') as f:
        f.write(request.code)
        
    try:
        # Build docker run command
        # --rm: remove container when done
        # --network none: no internet access
        # --memory 128m (256m for java): limit RAM
        # --cpus 0.5: limit CPU
        # -v temp_dir:/app: mount code directory
        memory_limit = "256m" if request.language == "java" else "128m"
        
        abs_temp_dir = os.path.abspath(temp_dir)
        
        docker_cmd = [
            "docker", "run", "--rm",
            "--network", "none",
            "--memory", memory_limit,
            "--cpus", "0.5",
            "-v", f"{abs_temp_dir}:/app",
            "-i", # Keep STDIN open even if not attached
            image_name
        ]
        
        process = subprocess.Popen(
            docker_cmd,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # 5 second timeout for most, 10s for Java (compilation + JVM startup)
        timeout = 10 if request.language == "java" else 5
        stdout, stderr = process.communicate(input=request.stdin, timeout=timeout)
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
        # Clean up temp files
        if os.path.exists(file_path):
            os.remove(file_path)
            
        # Clean up compiled files left in temp_dir by C/C++/Java if needed
        for extra_file in os.listdir(temp_dir):
            extra_file_path = os.path.join(temp_dir, extra_file)
            if os.path.exists(extra_file_path):
                try:
                    os.remove(extra_file_path)
                except Exception:
                    pass
                    
        if os.path.exists(temp_dir):
            try:
                os.rmdir(temp_dir)
            except Exception:
                pass
        
    end_time = time.time()
    time_ms = int((end_time - start_time) * 1000)
    
    # Check if docker image was not found
    if exit_code == 125 and "Unable to find image" in stderr:
        stderr = "Error: Language sandbox image not found on host. Please build the docker images."
    
    return ExecutionResponse(
        stdout=stdout,
        stderr=stderr,
        time_ms=time_ms,
        exit_code=exit_code
    )
