@echo off
echo Starting LMCST Learn Servers...

echo Starting Backend API (FastAPI) on port 8000...
start "Backend Server" cmd /k "cd backend && call venv\Scripts\activate && uvicorn main:app --reload --host 127.0.0.1 --port 8000"

echo Starting Frontend App (Vite React) on port 5173...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo Both servers are spinning up in separate windows!
echo - Frontend: http://localhost:5173
echo - Backend: http://localhost:8000
