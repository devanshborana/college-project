import { useState, useRef, useEffect } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import {
  Home, BookOpen, FileText, Code2, Trophy,
  GraduationCap, Bell, Search, ChevronDown, MonitorPlay, HelpCircle, Zap
} from 'lucide-react'
import { AppProvider } from './context/AppContext'
import HomePage from './pages/HomePage'
import CurriculumPage from './pages/CurriculumPage'
import CoursesPage from './pages/CoursesPage'
import PlaygroundPage from './pages/PlaygroundPage'
import ProblemSetPage from './pages/ProblemSetPage'
import LeaderboardPage from './pages/LeaderboardPage'
import QuizPage from './pages/QuizPage'
import LiveQuizPage from './pages/LiveQuizPage'
import TeacherDashboardPage from './pages/TeacherDashboardPage'
import TeacherHostQuizPage from './pages/TeacherHostQuizPage'
import LoginPage from './pages/LoginPage'
import { useApp } from './context/AppContext'

function Sidebar() {
  const { user } = useApp()
  return (
    <aside className="sidebar">
      <div className="flex flex-col items-center mb-6">
        <img src="/lachoo-logo.jpg" alt="LMCST Logo" style={{
          width: 46, height: 46, borderRadius: 12, objectFit: 'cover',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }} />
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
        <NavLink to="/problems" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <HelpCircle size={20} /><span className="nav-item-label">Question Bank</span>
        </NavLink>
        <NavLink to="/live-quiz" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Zap size={20} /><span className="nav-item-label">Live Quiz</span>
        </NavLink>
        <NavLink to="/playground" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Code2 size={20} /><span className="nav-item-label">Playground</span>
        </NavLink>
        <NavLink to="/leaderboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Trophy size={20} /><span className="nav-item-label">Leaderboard</span>
        </NavLink>
        {user?.role === 'teacher' && (
          <NavLink to="/teacher" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} style={{ marginTop: 'auto', background: '#f5f3ff', color: '#6c47ff' }}>
            <FileText size={20} /><span className="nav-item-label">Teacher Portal</span>
          </NavLink>
        )}
      </nav>
    </aside>
  )
}

function Header() {
  const { user, logout } = useApp()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])
  
  if (!user) return null
  
  const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

  return (
    <header className="header">
      <div className="header-left">
        <img src="/lachoo-logo.jpg" alt="LMCST Logo" style={{
          width: 28, height: 28, borderRadius: 6, objectFit: 'cover', border: '1px solid #E7E5E4'
        }} />
        <div>
          <div className="college-name">LMCST</div>
          <div className="college-tagline">Jodhpur</div>
        </div>
      </div>

      <div className="header-search">
        <Search className="search-icon" />
        <input type="text" placeholder="Search courses, subjects..." />
      </div>

      <div className="header-right">
        <button className="icon-btn" title="Notifications"><Bell size={15} /></button>
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <div onClick={() => setShowDropdown(!showDropdown)} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <div className="avatar" title={user.name}>{initials}</div>
            <div className="header-user-info" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#1A1A1A', lineHeight: 1.2 }}>{user.name.split(' ')[0]}</div>
              <div style={{ fontSize: 10, color: '#A3A3A3', lineHeight: 1.2 }}>{user.id}</div>
            </div>
            <ChevronDown size={12} color="#A3A3A3" />
          </div>
          {showDropdown && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 6,
              background: '#fff', border: '1px solid #E7E5E4', borderRadius: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)', minWidth: 140, zIndex: 50
            }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid #E7E5E4' }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#1A1A1A' }}>{user.name}</div>
                <div style={{ fontSize: 10, color: '#A3A3A3', marginTop: 1 }}>{user.id}</div>
              </div>
              <button onClick={logout} style={{
                width: '100%', padding: '8px 14px', background: 'transparent',
                border: 'none', textAlign: 'left', color: '#525252', fontSize: 12,
                fontWeight: 400, cursor: 'pointer', fontFamily: 'inherit'
              }}>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function MainApp() {
  const { user } = useApp()
  
  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    )
  }

  return (
    <>
      <Sidebar />
      <div className="main-layout">
        <Header />
        <Routes>
          <Route path="/"            element={<HomePage />} />
          <Route path="/curriculum"  element={<CurriculumPage />} />
          <Route path="/other-courses" element={<CoursesPage />} />
          <Route path="/problems"    element={<ProblemSetPage />} />
          <Route path="/live-quiz"   element={<LiveQuizPage />} />
          <Route path="/playground"  element={<PlaygroundPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/teacher"     element={<TeacherDashboardPage />} />
          <Route path="/teacher/host/:quizId" element={<TeacherHostQuizPage />} />
          <Route path="/quiz/:subjectId" element={<QuizPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <MainApp />
      </BrowserRouter>
    </AppProvider>
  )
}
