import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import {
  Home, BookOpen, FileText, Code2, Trophy,
  GraduationCap, Bell, Search, ChevronDown, MonitorPlay, HelpCircle
} from 'lucide-react'
import { AppProvider } from './context/AppContext'
import HomePage from './pages/HomePage'
import CurriculumPage from './pages/CurriculumPage'
import ExamsPage from './pages/ExamsPage'
import PlaygroundPage from './pages/PlaygroundPage'
import ProblemSetPage from './pages/ProblemSetPage'
import LeaderboardPage from './pages/LeaderboardPage'
import QuizPage from './pages/QuizPage'

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="flex flex-col items-center mb-6">
        <div style={{
          width: 46, height: 46, borderRadius: 12,
          background: 'linear-gradient(135deg, #6c47ff, #a855f7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 900, fontSize: 14, letterSpacing: -0.5,
          boxShadow: '0 4px 12px rgba(108,71,255,0.35)',
        }}>LM</div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Home size={20} /><span className="nav-item-label">Home</span>
        </NavLink>
        <NavLink to="/curriculum" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <BookOpen size={20} /><span className="nav-item-label">Curriculum</span>
        </NavLink>
        <NavLink to="/other-courses" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <MonitorPlay size={20} /><span className="nav-item-label">Courses</span>
        </NavLink>
        <NavLink to="/exams" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FileText size={20} /><span className="nav-item-label">Exams</span>
        </NavLink>
        <NavLink to="/problems" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <HelpCircle size={20} /><span className="nav-item-label">Question Bank</span>
        </NavLink>
        <NavLink to="/playground" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Code2 size={20} /><span className="nav-item-label">Playground</span>
        </NavLink>
        <NavLink to="/leaderboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Trophy size={20} /><span className="nav-item-label">Leaderboard</span>
        </NavLink>
      </nav>
    </aside>
  )
}

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: 'linear-gradient(135deg, #6c47ff, #a855f7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 900, fontSize: 12,
        }}>LMCST</div>
        <div>
          <div className="college-name">Lachoo Memorial College</div>
          <div className="college-tagline">of Science & Technology, Jodhpur</div>
        </div>
      </div>

      <div className="header-search">
        <Search className="search-icon" />
        <input type="text" placeholder="Search courses, subjects..." />
      </div>

      <div className="header-right">
        <button className="icon-btn"><Bell size={17} /></button>
        <button className="icon-btn"><GraduationCap size={17} /></button>
        <div className="avatar">DB</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1e1b4b' }}>Devansh B.</div>
            <div style={{ fontSize: 10, color: '#6b7280' }}>ID: LMCST-2024-001</div>
          </div>
          <ChevronDown size={14} color="#6b7280" />
        </div>
      </div>
    </header>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Sidebar />
        <div className="main-layout">
          <Header />
          <Routes>
            <Route path="/"            element={<HomePage />} />
            <Route path="/curriculum"  element={<CurriculumPage />} />
            <Route path="/other-courses" element={<ExamsPage />} />
            <Route path="/exams"       element={<ExamsPage />} />
            <Route path="/problems"    element={<ProblemSetPage />} />
            <Route path="/playground"  element={<PlaygroundPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/quiz/:subjectId" element={<QuizPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}
