import { useState, useRef, useEffect } from 'react'
import { BrowserRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom'
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
import { programs } from './data/syllabus'

function Sidebar() {
  const { user } = useApp()
  return (
    <aside className="sidebar">
      <div className="flex flex-col items-center mb-6">
        <img src="/lachoo-logo.jpg" alt="LMCST Logo" style={{
          width: 46, height: 46, borderRadius: '50%', objectFit: 'cover',
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
          <NavLink to="/teacher" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} style={{ marginTop: 'auto' }}>
            <FileText size={20} /><span className="nav-item-label">Teacher Portal</span>
          </NavLink>
        )}
      </nav>
    </aside>
  )
}

function Header() {
  const { user, logout } = useApp()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef(null)
  const searchInputRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)

    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  // Build a static search index on mount
  const searchIndex = useRef([])
  useEffect(() => {
    const index = []
    // Add pages
    index.push({ id: 'nav-home', type: 'page', title: 'Home', subtitle: 'Dashboard', path: '/' })
    index.push({ id: 'nav-curr', type: 'page', title: 'Curriculum', subtitle: 'View all programs and subjects', path: '/curriculum' })
    index.push({ id: 'nav-prob', type: 'page', title: 'Question Bank', subtitle: 'Practice coding challenges', path: '/problems' })
    index.push({ id: 'nav-quiz', type: 'page', title: 'Live Quiz', subtitle: 'Join live quiz sessions', path: '/live-quiz' })
    index.push({ id: 'nav-play', type: 'page', title: 'Playground', subtitle: 'Code editor', path: '/playground' })
    index.push({ id: 'nav-lead', type: 'page', title: 'Leaderboard', subtitle: 'Global student rankings', path: '/leaderboard' })
    if (user?.role === 'teacher') {
      index.push({ id: 'nav-teach', type: 'page', title: 'Teacher Portal', subtitle: 'Manage curriculum and quizzes', path: '/teacher' })
    }

    // Add programs and subjects
    Object.entries(programs).forEach(([progKey, prog]) => {
      index.push({ id: `prog-${progKey}`, type: 'program', title: prog.fullName, subtitle: `Program • ${progKey}`, path: '/curriculum' })
      Object.values(prog.semesters).forEach(sem => {
        sem.subjects.forEach(sub => {
          if (!index.find(i => i.id === `sub-${sub.id}`)) {
            index.push({ id: `sub-${sub.id}`, type: 'subject', title: sub.name, subtitle: `${sub.code} • ${progKey}`, path: '/curriculum' })
          }
        })
      })
    })
    searchIndex.current = index
  }, [user?.role])

  const filteredSuggestions = searchQuery.trim() === '' 
    ? searchIndex.current 
    : searchIndex.current.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
  
  if (!user) return null
  
  const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

  return (
    <header className="header">
      <div className="header-left">
        <img src="/lachoo-logo.jpg" alt="LMCST Logo" style={{
          width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '1px solid #E7E5E4'
        }} />
        <div>
          <div className="college-name">LMCST</div>
          <div className="college-tagline">Jodhpur</div>
        </div>
      </div>

      <div className="header-search" ref={searchRef} style={{ position: 'relative' }}>
        <Search className="search-icon" size={16} color="#A3A3A3" />
        <input 
          ref={searchInputRef}
          type="text" 
          placeholder="Search courses, subjects, pages..." 
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
          style={{
            width: '100%', padding: '8px 36px 8px 36px', borderRadius: 8, border: '1px solid #E7E5E4',
            outline: 'none', fontSize: 13, color: '#1A1A1A', background: '#FAFAFA', fontFamily: 'inherit'
          }}
        />
        <div style={{
          position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
          display: 'flex', alignItems: 'center', gap: 4, pointerEvents: 'none'
        }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: '#A3A3A3', background: '#FFFFFF', border: '1px solid #E7E5E4', borderRadius: 4, padding: '2px 4px' }}>⌘</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: '#A3A3A3', background: '#FFFFFF', border: '1px solid #E7E5E4', borderRadius: 4, padding: '2px 4px' }}>K</span>
        </div>
        {showSuggestions && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 6,
            background: '#FFFFFF', border: '1px solid #E7E5E4', borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)', zIndex: 100, overflow: 'hidden'
          }}>
            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {filteredSuggestions.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {filteredSuggestions.map((item, idx) => (
                    <button key={item.id} onClick={() => {
                      navigate(item.path)
                      setSearchQuery('')
                      setShowSuggestions(false)
                    }} style={{
                      padding: '10px 14px', background: 'transparent', border: 'none', borderBottom: idx < filteredSuggestions.length - 1 ? '1px solid #F5F5F4' : 'none',
                      textAlign: 'left', cursor: 'pointer', transition: 'background 150ms', display: 'flex', flexDirection: 'column', gap: 2, fontFamily: 'inherit'
                    }} onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#1A1A1A' }}>{item.title}</div>
                      <div style={{ fontSize: 11, color: '#A3A3A3' }}>{item.subtitle}</div>
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '14px', textAlign: 'center', color: '#A3A3A3', fontSize: 12 }}>
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        )}
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
  
  // Global anti-copy mechanism
  useEffect(() => {
    const handleCopy = (e) => {
      const tagName = e.target.tagName.toLowerCase()
      // Allow copying only if they are actively copying from inside a text input (like their own code)
      if (tagName !== 'textarea' && tagName !== 'input') {
        e.preventDefault()
        alert("Copying text from this website is disabled.")
      }
    }
    
    document.addEventListener('copy', handleCopy)
    return () => document.removeEventListener('copy', handleCopy)
  }, [])

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
