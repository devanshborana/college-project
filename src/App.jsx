import { useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import {
  Home, BookOpen, FileText, Code2, Trophy,
  GraduationCap, Bell, Search, ChevronDown, MonitorPlay, HelpCircle
} from 'lucide-react'
import { AppProvider } from './context/AppContext'
import HomePage from './pages/HomePage'
import CurriculumPage from './pages/CurriculumPage'
import CoursesPage from './pages/CoursesPage'
import PlaygroundPage from './pages/PlaygroundPage'
import ProblemSetPage from './pages/ProblemSetPage'
import LeaderboardPage from './pages/LeaderboardPage'
import QuizPage from './pages/QuizPage'
import LoginPage from './pages/LoginPage'
import { useApp } from './context/AppContext'

function Sidebar() {
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
  const { user, logout } = useApp()
  const [showDropdown, setShowDropdown] = useState(false)
  
  if (!user) return null
  
  const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

  return (
    <header className="header">
      <div className="header-left">
        <img src="/lachoo-logo.jpg" alt="LMCST Logo" style={{
          width: 40, height: 40, borderRadius: 10, objectFit: 'cover'
        }} />
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
        <div className="avatar">{initials}</div>
        <div style={{ position: 'relative' }}>
          <div onClick={() => setShowDropdown(!showDropdown)} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1e1b4b' }}>{user.name}</div>
              <div style={{ fontSize: 10, color: '#6b7280' }}>ID: {user.id}</div>
            </div>
            <ChevronDown size={14} color="#6b7280" />
          </div>
          {showDropdown && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 8,
              background: 'white', border: '1px solid #e5e7eb', borderRadius: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)', minWidth: 150, zIndex: 50
            }}>
              <button onClick={logout} style={{
                width: '100%', padding: '10px 16px', background: 'transparent',
                border: 'none', textAlign: 'left', color: '#ef4444', fontSize: 13,
                fontWeight: 600, cursor: 'pointer'
              }}>
                Log out
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
          <Route path="/playground"  element={<PlaygroundPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
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
