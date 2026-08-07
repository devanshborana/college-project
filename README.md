# LMCST Learn Platform

A full-stack academic platform for Lachoo Memorial College of Science and Technology.

## Project Structure

- `/frontend`: React + Vite + Tailwind CSS + TypeScript
- `/backend`: Python + FastAPI + SQLite (SQLAlchemy)

## Running Locally

### Backend
1. Open a terminal and navigate to the project root.
2. Activate the virtual environment:
   - Windows: `.\backend\venv\Scripts\activate`
   - Mac/Linux: `source backend/venv/bin/activate`
3. Start the FastAPI server:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```
4. Access the API at http://localhost:8000 and docs at http://localhost:8000/docs.

### Frontend
1. Open a new terminal and navigate to the project root.
2. Go to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
4. Start the Vite dev server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to the local URL provided by Vite (usually http://localhost:5173).
