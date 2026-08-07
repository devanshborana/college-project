# Goal Description

Set up the project skeleton for "LMCST Learn", a full-stack academic platform for Lachoo Memorial College of Science and Technology. The goal is to build a solid foundation with a React/TypeScript/Tailwind frontend (using a specific academic design system) and a Python FastAPI backend with JWT authentication, a comprehensive database schema (via SQLAlchemy and Alembic), interactive coding environments, and necessary API endpoints.

## Proposed Changes

### Frontend (React + Vite + Tailwind CSS)

#### 1. Setup & Design System
- Initialize a Vite project with React and TypeScript in `/frontend`.
- Install and configure Tailwind CSS and React Router (`react-router-dom`).
- Configure theme colors in `tailwind.config.js`: background, text, and accent colors as specified.

#### 2. Authentication & State
- **State Management**: Create an `AuthContext` to manage the user state and store JWT in memory (not `localStorage`).
- **Pages**:
  - `/login` and `/signup`: Centered card layouts with subtle borders, basic validation, loading states, and inline errors. Successful login redirects to Home.

#### 3. Layout & Routing Structure
- **Authenticated Shell**: A main Layout component wrapping all authenticated routes.
  - **Navigation**: A navigation bar/sidebar containing Home, Subject List, and Auth links.
- **Dashboard (Home)**:
  - Displays a grid of subject cards: PPCE, Math, C++, C, Python, W.7 (Web Technology).
- **Subject Workspace (`/subject/:subjectId`)**:
  - Navigating here displays the subject details.
  - **Nested Tabs Layout**: Includes pill-style navigation buttons for: Test / Test Series, Notes, Assignment, Practice, Syllabus.
  - **Pill Styles**: Rounded, bordered buttons. Active tab is highlighted with the accent color; inactive tabs are muted gray.
  - Render placeholder content for each tab for now.

#### 4. Interactive Coding Environment
- **Monaco Editor**: Integrate `@monaco-editor/react` on the Practice and Test pages.
- **Language Selection**: Add a language dropdown (C++, C, Java, Python, JavaScript) that updates the editor's syntax mode dynamically.
- **Theming**: Editor uses a light theme matching our faded off-white palette by default, with a toggle for a dark theme (affecting the editor only).
- **Execution UI**: Add "Run Code" and "Submit" buttons, alongside an output panel below the editor that displays `stdout`, `stderr`, and execution time.
- **Evaluation & Hint UI**: 
  - Display test case pass/fail status per hidden test case upon submission.
  - Show the remaining number of hints for today.
  - Implement a side panel to display the generated hint text when requested.

#### Phase 11: Web Playground

# Goal
Add a dedicated "Web Playground" to the IDE that supports HTML, CSS, and JS with a live preview iframe, bypassing the Docker sandbox entirely.

## User Review Required
> [!IMPORTANT]
> To evaluate web submissions server-side on Submit, I will install `playwright` via pip on the backend. This requires downloading browser binaries (`playwright install chromium`). This will slightly increase backend footprint. Is this acceptable?

## Open Questions
> [!WARNING]
> How should web problem hidden test cases be formatted? I will assume they provide JS snippets to run against the headless DOM (e.g. `document.querySelector('h1')?.textContent === 'Hello World'`).

## Proposed Changes

### Database & Backend
#### [MODIFY] `backend/models/course.py`
Add `starter_html`, `starter_css`, and `starter_js` columns (type `Text`, nullable) to the `Problem` model. Generate and run an Alembic migration for this.

#### [MODIFY] `backend/api/evaluation.py`
Add branching logic in the `/evaluate` endpoint. If `language == 'web'`, use Playwright in a headless Chromium context to load the combined HTML/CSS/JS and execute the hidden test cases (which will be JS assertions) against the page object.

### Frontend
#### [MODIFY] `frontend/src/components/CodingEnvironment.tsx`
- Add "web" to the language options dropdown.
- If `language === 'web'`, switch layout from the standard split to a Tri-file layout + Iframe.
- Add three state variables: `htmlCode`, `cssCode`, `jsCode`.
- Create a debounced `useEffect` that combines the three into a single HTML string and sets it as `srcDoc` on a `sandbox="allow-scripts"` iframe.
- Add sub-tabs to switch the active Monaco editor view between HTML, CSS, and JS.
- Add "Reset" buttons to restore starter code.

## Verification Plan
### Automated Tests
- The backend evaluation logic will run hidden assertions via Playwright.
### Manual Verification
- Select "Web" in the IDE.
- Type HTML, CSS, and JS, verifying the preview updates automatically and securely.
- Submit the code and verify Playwright correctly evaluates the DOM server-side.

#### Phase 9: Gamification & Instructor Tools

# Goal
Build the gamification layer for students (Leaderboard and Profile charts) and the instructor dashboard for analytics and content management.

## User Review Required
> [!IMPORTANT]
> To render the simple daily/weekly points chart, I will install `recharts` on the frontend. It's a lightweight, React-friendly charting library that fits perfectly with our design system. Is this acceptable?

## Open Questions
> [!WARNING]
> Should the Instructor Dashboard be an entirely separate layout shell, or just an added route within the main dashboard that is hidden from students? I will integrate it into the main dashboard navigation (role-gated) for simplicity unless you prefer a separate shell.

## Proposed Changes

### Frontend
#### [MODIFY] [task.md](file:///C:/Users/DEVANSH%20BORANA/.gemini/antigravity-ide/brain/d4ba4447-b136-40f4-b11c-fcc21fc0563c/task.md)
Add Phase 9 checklist.

#### [NEW] `frontend/src/pages/Leaderboard.tsx`
A clean table showing the top students ordered by points, highlighting the current user's row.

#### [NEW] `frontend/src/pages/StudentProfile.tsx`
Displays the user's total points and uses `recharts` to render a daily/weekly points progression chart.

#### [NEW] `frontend/src/pages/InstructorDashboard.tsx`
Role-gated page showing:
- Stats on which problems are failed most often.
- List of flagged test sessions (from Phase 8).
- Simple forms to add new Syllabus Items and Practice Problems via our existing CRUD API.

#### [MODIFY] `frontend/src/pages/Dashboard.tsx`
Add navigation links to Leaderboard, Profile, and Instructor Dashboard (if role === 'instructor').

### Backend
#### [NEW] `backend/api/gamification.py`
Endpoints:
- `GET /leaderboard`
- `GET /profile/chart-data`

#### [NEW] `backend/api/instructor.py`
Endpoints:
- `GET /instructor/stats` (problem failure rates, submission stats)
- `GET /instructor/flagged-sessions` (list of test sessions with high violation counts)

#### [MODIFY] [main.py](file:///e:/college%20project/backend/main.py)
Include the new routers.

## Verification Plan
### Automated Tests
- N/A
### Manual Verification
- Login as a student and view the leaderboard and profile charts.
- Login as an instructor and view the analytics dashboard.
- As an instructor, add a new practice problem and verify it appears in the Subject Workspace. UI

#### 5. Test Mode Proctoring UI
- **Consent & Setup**: Display a clear, upfront consent notice informing the student that webcam monitoring is active before starting a test. Request webcam permissions.
- **Client-Side Monitoring**:
  - Run a lightweight face-detection check periodically using a client-side library (e.g., `face-api.js` or MediaPipe).
  - Flag violations if no face is detected or if multiple faces are detected.
  - Detect tab-switching (via `visibilitychange` events) and window blur, logging a violation for each occurrence.
  - Disable copy-paste and right-click functionality within the test editor.
- **Enforcement UI**: Show a warning modal to the student after 3 violations. Upon reaching a configurable maximum number of violations, automatically submit the test and flag the session.

#### 6. Gamification & Student Profile
- **Leaderboard**: Add a Leaderboard page (overall and per-subject) ranking students by total points, with the current user's rank clearly highlighted.
- **Points Chart**: On the student's profile/dashboard, include a daily/weekly points chart (visualizing points earned over time).

#### 7. Instructor Tools (Role-Gated)
- **Instructor Dashboard**: Create a specialized view for users with the `instructor` role showing analytics, submission statistics, and flagged test sessions.
- **Content Management**: Provide intuitive forms to upload/edit syllabus items and practice problems.
- **Student Progress**: Allow instructors to view individual student profiles and their points/submission history.

#### 8. Polish, UX & Accessibility
- **Branding**: Consistently apply "Lachoo Memorial College of Science and Technology" branding (header wordmark, favicon, page titles, and a footer with placeholder contact info).
- **Responsiveness**: Ensure the subject cards, tab navigation, and IDE layout are fully functional on tablet widths.
- **States & Fallbacks**: Implement loading skeletons for data fetches, friendly empty states ("No problems yet in this subject"), React Error Boundaries, and a themed 404 Not Found page.
- **Accessibility**: Verify color contrast ratios against the faded off-white background and ensure keyboard navigation works seamlessly for tab bars and forms.

### Backend (Python FastAPI)

#### 1. Setup & Structure
- Create a `/backend` directory.
- Define a scalable project structure: `api/`, `core/`, `db/`, `models/`, `schemas/`.
- Set up SQLite connection in `db/database.py` (switchable to Postgres via `DATABASE_URL`).
- **Alembic**: Initialize Alembic for database migrations.

#### 2. Authentication Flow
- **Models**: Create a `User` model (`id`, `full_name`, `email`, `password_hash`, `role`, `created_at`).
- **Security**: Configure password hashing (bcrypt) and JWT generation/validation.
- **Endpoints**: `POST /auth/signup`, `POST /auth/login`, `GET /health`.

#### 3. Database Schema & Models
Design and implement the full database schema (SQLAlchemy models + Alembic migration):
- `subjects` (id, name, code, description)
- `syllabus_items` (id, subject_id, title, content, order)
- `problems` (id, subject_id, title, description, difficulty, points, language_options, hidden_test_cases JSON, required_structures JSON e.g. ["for_loop"])
- `submissions` (id, user_id, problem_id, language, code, status, points_awarded, submitted_at)
- `hints_used` (id, user_id, problem_id, date, count) -- enforce max 5/day per user
- `test_sessions` (id, user_id, subject_id, started_at, ended_at, status)
- `violation_logs` (id, test_session_id, type, timestamp, details)
- `points` (id, user_id, total_points, updated_at)

#### 4. CRUD Endpoints & Seed Data
- **Seed Data**: Add seed data for the subjects: PPCE, Math, C++, C, Python, Web Technology, each with a couple of sample syllabus items and 2-3 sample practice problems.
- **API Endpoints**: Expose CRUD endpoints for subjects, syllabus, and problems (read for students, write for instructors).

#### 5. Secure Sandboxed Code Execution
- **Docker-based Execution Service**: Replace stub execution with isolated, resource-limited Docker containers (CPU limit, memory limit, no network access, strict 5-10 second timeouts) for each supported language (Python, C++, C, Java, JavaScript).
- **Backend Orchestration**: 
  - The `/execute` endpoint receives the code, writes it to a temporary file/volume, and spins up the matching language container.
  - Captures `stdout`, `stderr`, exit code, and execution time, then destroys the container.
- **Error Handling**: Gracefully handle infinite loops and crashes (e.g., kill the container on timeout and return a clear "Time Limit Exceeded" or "Runtime Error" to the user).
- **Dockerfiles**: Create individual `Dockerfile`s for each language environment under `/backend/sandboxes/` and document how to build these runner images locally. This component prioritizes security and isolation over pure execution speed.

#### 6. Evaluation & Hint Engine
- **Evaluation Flow (On Submit)**:
  1. **Execution**: Run code in the sandbox against each hidden test case and compare actual vs. expected output.
  2. **AST Parsing**: Parse the submitted code with an AST parser (e.g., Python's `ast` module, or lightweight regex fallback for others) to verify structural requirements defined in `problem.required_structures` (e.g., `for_loop`, recursion).
  3. **Scoring**: Award points based on the correctness of all hidden tests, meeting structural requirements, and code efficiency (execution time vs. threshold).
  4. **Persistence**: Store the result in the `submissions` table and update the user's `points` total.
- **Hint Engine**:
  - Implement a `GET /hints/request(problem_id)` endpoint.
  - Enforce a strict limit of max 5 hints per user per day (using `hints_used` table), returning `429 Too Many Requests` if exceeded.
  - On failure, analyze the failing test case and any syntax/runtime errors to generate a short, specific theoretical explanation (e.g., "You're missing a closing bracket...").
  - Start with a rule-based explanation generator keyed off common error types, structured with a clear extension point to plug in an LLM later for more nuanced hints.

#### 7. Test Mode Proctoring API
- **Session Management**: Implement endpoints to handle test sessions:
  - `POST /test-sessions/start`: Initializes a secure session and logs the start time.
  - `POST /test-sessions/:id/violation`: Accepts client-side violation reports (face missing, tab switch) and records them in the `violation_logs` table.
  - `POST /test-sessions/:id/end`: Closes the session and records the end time and final status.

#### 8. Gamification & Instructor APIs
- **Leaderboards**: `GET /leaderboard` (overall) and `GET /leaderboard/:subjectId` to aggregate points.
- **Student Stats**: Endpoint to fetch daily/weekly points data for the performance chart.
- **Instructor Analytics**: `GET /instructor/insights` to fetch failure rates, submission stats, and flagged sessions.
- **Content Mutation**: Secure POST/PUT endpoints for syllabus items and practice problems (verifying instructor role).

### Documentation & Deployment
- **Environment Variables**: Provide clear `.env.example` files for both frontend and backend.
- **Local Dev README**: Instructions for running Vite (`npm run dev`) and FastAPI (`uvicorn`).
- **Deployment README**: Step-by-step instructions for:
  - Building the frontend for production.
  - Running FastAPI with a production WSGI/ASGI server (e.g., `uvicorn` with `gunicorn`).
  - Running PostgreSQL migrations via Alembic.
  - Building and managing the isolated Docker sandbox containers on the host machine.

---

## Final Project Structure Tree

```text
/
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── .env.example
│   └── src/
│       ├── components/ (Header, Footer, Layout, LoadingSkeletons, ErrorBoundary)
│       ├── context/    (AuthContext)
│       ├── pages/      (Login, Dashboard, SubjectWorkspace, Leaderboard, AdminDash)
│       └── utils/      (API fetchers)
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── alembic.ini
│   ├── .env.example
│   ├── api/            (routers: auth, subjects, problems, execution, hints, test-sessions)
│   ├── core/           (config, security, evaluation logic)
│   ├── db/             (database session, models)
│   ├── schemas/        (pydantic validators)
│   └── sandboxes/      (Dockerfiles for C++, Python, Java, JS, C)
│
└── README.md (Deployment & Setup)
```

## What's Next? (Future Roadmap)
- **Real LLM-Powered Hints**: Replace the rule-based hint engine with an integrated LLM provider for highly nuanced and conversational code debugging.
- **Mobile App**: A React Native companion app for students to check syllabus items and leaderboards on the go.
- **Plagiarism Detection**: Integrate structural diffing algorithms to detect similarity between student submissions.
- **More Languages**: Expand sandbox support to Go, Rust, and C#.
