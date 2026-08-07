# LMCST Learn - Deployment Guide

This document outlines how to deploy the full-stack application (React frontend, FastAPI backend, PostgreSQL database, and Dockerized code execution sandboxes) to a production environment.

## 1. Prerequisites

- **Host Server**: Linux server (Ubuntu recommended) with root or sudo access.
- **Software**: 
  - Node.js (v18+)
  - Python (3.10+)
  - Docker & Docker Compose
  - PostgreSQL (v14+)
  - Nginx (for reverse proxy)

## 2. Environment Variables

Copy `.env.example` to `.env` in both the `frontend` and `backend` directories and update them appropriately.

**Backend (`backend/.env`):**
```env
DATABASE_URL=postgresql://user:securepassword@localhost/lmcst_learn
SECRET_KEY=generate-a-secure-random-string
ENVIRONMENT=production
```

**Frontend (`frontend/.env`):**
```env
VITE_API_BASE_URL=https://api.yourdomain.edu
```

## 3. Database Setup (PostgreSQL)

For production, SQLite is replaced with PostgreSQL.
1. Install PostgreSQL on your host.
2. Create the database and user.
3. Run Alembic migrations:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   alembic upgrade head
   ```
4. Optionally, seed the database with initial courses:
   ```bash
   python seed_db.py
   ```

## 4. Sandbox Setup (Docker)

The code execution engine relies on isolated Docker containers for security. You must build the language images on the host machine.

```bash
cd backend/sandboxes

# Build all environments
cd python && docker build -t lmcst-sandbox-python . && cd ..
cd cpp && docker build -t lmcst-sandbox-cpp . && cd ..
cd c && docker build -t lmcst-sandbox-c . && cd ..
cd java && docker build -t lmcst-sandbox-java . && cd ..
cd javascript && docker build -t lmcst-sandbox-javascript . && cd ..
```

*Note: Ensure the backend process user is added to the `docker` group so it can spawn containers.*

## 5. Running the Backend (Gunicorn + Uvicorn)

For production, run FastAPI using Gunicorn with Uvicorn workers.

```bash
cd backend
source venv/bin/activate
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 127.0.0.1:8000
```
*Tip: Use Systemd or Supervisor to run this command as a background service that auto-restarts.*

## 6. Building the Frontend

Build the React application into static files.

```bash
cd frontend
npm ci
npm run build
```
The output will be generated in the `frontend/dist` directory.

## 7. Nginx Configuration

Configure Nginx to serve the static frontend and reverse proxy API requests to the FastAPI backend.

```nginx
server {
    listen 80;
    server_name yourdomain.edu;

    # Serve React Frontend
    location / {
        root /path/to/project/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Reverse Proxy to FastAPI Backend
    location /api/ {
        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable the configuration and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/lmcst /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```
