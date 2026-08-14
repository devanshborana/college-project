import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, ChevronLeft, ChevronRight, AlertCircle, CheckCircle, MapPin, User, ExternalLink, ArrowRight, BookOpen } from 'lucide-react'
import { programs } from '../data/syllabus'
import { quizData } from '../data/quizData'
import { useApp } from '../context/AppContext'

const weekSchedule = {
  1: [ // Monday
    { id: 1, type: 'Lecture', title: 'Database Management Systems (DMS)', time: '8:00 AM - 9:00 AM', faculty: 'GSS', room: 'GF-2', resources: [{ label: 'View Syllabus', link: '/curriculum' }], expanded: true, dotColor: '#3b82f6' },
    { id: 2, type: 'Lecture', title: 'Web Technology (WT)', time: '9:00 AM - 10:00 AM', faculty: 'RM', room: 'GF-2', resources: [{ label: 'Module Quiz', link: '/quiz/web-tech' }], expanded: false, dotColor: '#94a3b8' },
    { id: 3, type: 'Assessment', title: 'DSA Lab / OOP Lab', time: '10:00 AM - 12:00 PM', faculty: 'AB / SM', room: 'EL-4 / CC-2', resources: [{ label: 'Open Compiler (C)', link: '/playground?lang=c&locked=true' }, { label: 'Coding Questions', link: '/curriculum' }], expanded: false, dotColor: '#f59e0b' },
    { id: 4, type: 'Lecture', title: 'Digital Electronics (DE)', time: '12:00 PM - 1:00 PM', faculty: 'SM', room: 'GF-1', expanded: false, dotColor: '#94a3b8' }
  ],
  2: [ // Tuesday
    { id: 1, type: 'Lecture', title: 'Database Management Systems (DMS)', time: '8:00 AM - 9:00 AM', faculty: 'GSS', room: 'GF-2', expanded: true, dotColor: '#3b82f6' },
    { id: 2, type: 'Lecture', title: 'Web Technology (WT)', time: '9:00 AM - 10:00 AM', faculty: 'RM', room: 'GF-2', expanded: false, dotColor: '#94a3b8' },
    { id: 3, type: 'Assessment', title: 'WT Lab / DSA Lab', time: '10:00 AM - 12:00 PM', faculty: 'RM / SM', room: 'CC-2 / EL-4', expanded: false, dotColor: '#f59e0b' },
    { id: 4, type: 'Lecture', title: 'Digital Electronics (DE)', time: '12:00 PM - 1:00 PM', faculty: 'SM', room: 'GF-1', expanded: false, dotColor: '#94a3b8' }
  ],
  3: [ // Wednesday
    { id: 1, type: 'Lecture', title: 'Database Management Systems (DMS)', time: '8:00 AM - 9:00 AM', faculty: 'GSS', room: 'GF-2', expanded: true, dotColor: '#3b82f6' },
    { id: 2, type: 'Lecture', title: 'Web Technology (WT)', time: '9:00 AM - 10:00 AM', faculty: 'RM', room: 'GF-2', expanded: false, dotColor: '#94a3b8' },
    { id: 3, type: 'Assessment', title: 'DSA Lab / WT Lab', time: '10:00 AM - 12:00 PM', faculty: 'AB / RM', room: 'EL-4 / CC-2', expanded: false, dotColor: '#f59e0b' },
    { id: 4, type: 'Lecture', title: 'Object Oriented Programming (OOP)', time: '12:00 PM - 1:00 PM', faculty: 'SM', room: 'GF-2', expanded: false, dotColor: '#6c47ff' }
  ],
  4: [ // Thursday
    { id: 1, type: 'Lecture', title: 'Data Structures & Algorithms (DSA)', time: '8:00 AM - 9:00 AM', faculty: 'AB', room: 'GF-2', expanded: true, dotColor: '#6c47ff' },
    { id: 2, type: 'Lecture', title: 'Object Oriented Programming (OOP)', time: '9:00 AM - 10:00 AM', faculty: 'SM', room: 'GF-2', expanded: false, dotColor: '#6c47ff' },
    { id: 3, type: 'Assessment', title: 'FDS Lab / DSA Lab', time: '10:00 AM - 12:00 PM', faculty: 'AB / SM', room: 'CC-2 / EL-4', expanded: false, dotColor: '#f59e0b' },
    { id: 4, type: 'Lecture', title: 'PPCE', time: '12:00 PM - 1:00 PM', faculty: 'RM', room: 'GF-2', expanded: false, dotColor: '#94a3b8' }
  ],
  5: [ // Friday
    { id: 1, type: 'Lecture', title: 'Database Management Systems (DMS)', time: '8:00 AM - 9:00 AM', faculty: 'GSS', room: 'GF-2', expanded: true, dotColor: '#3b82f6' },
    { id: 2, type: 'Lecture', title: 'PPCE', time: '9:00 AM - 10:00 AM', faculty: 'RM', room: 'GF-2', expanded: false, dotColor: '#94a3b8' },
    { id: 3, type: 'Assessment', title: 'DE Lab / OOP Lab', time: '10:00 AM - 12:00 PM', faculty: 'RM / SM', room: 'EL-4 / CC-2', expanded: false, dotColor: '#f59e0b' },
    { id: 4, type: 'Lecture', title: 'Digital Electronics (DE)', time: '12:00 PM - 1:00 PM', faculty: 'SM', room: 'GF-1', expanded: false, dotColor: '#94a3b8' }
  ],
  6: [ // Saturday
    { id: 1, type: 'Lecture', title: 'Data Structures & Algorithms (DSA)', time: '8:00 AM - 9:00 AM', faculty: 'AB', room: 'GF-2', expanded: true, dotColor: '#6c47ff' },
    { id: 2, type: 'Lecture', title: 'Object Oriented Programming (OOP)', time: '9:00 AM - 10:00 AM', faculty: 'SM', room: 'GF-2', expanded: false, dotColor: '#6c47ff' },
    { id: 3, type: 'Lecture', title: 'PPCE', time: '10:00 AM - 12:00 PM', faculty: 'RM', room: 'GF-2', expanded: false, dotColor: '#94a3b8' },
    { id: 4, type: 'Lecture', title: 'Foundations of Data Science (FDS)', time: '12:00 PM - 1:00 PM', faculty: 'AB', room: 'GF-1', expanded: false, dotColor: '#94a3b8' }
  ],
  0: [] // Sunday
}

const recentCourses = [
  { id: 1, title: 'Node JS', sub: 'Introduction to Express JS', type: 'Assessment', progress: 4, color: '#22c55e' },
  { id: 2, title: 'Applied Communicative English', sub: 'Designing Clear Prompts', type: 'Exam', progress: 25, color: '#ef4444' },
  { id: 3, title: 'Database Management', sub: 'SQL Joins & Indexing', type: 'Lecture', progress: 60, color: '#3b82f6' },
]


function TypeLabel({ type }) {
  const map = {
    Exam: 'label-exam',
    Assessment: 'label-assessment',
    Lecture: 'label-lecture',
  }
  return (
    <span className={`course-card-label ${map[type] || 'label-lecture'}`}>
      {'<>'} {type}
    </span>
  )
}

export default function HomePage() {
  const { user } = useApp()
  const [expandedItem, setExpandedItem] = useState(1)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const navigate = useNavigate()

  const formattedDate = selectedDate.toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
  
  const isToday = new Date().toDateString() === selectedDate.toDateString()

  const handlePrevDay = () => {
    const prev = new Date(selectedDate)
    prev.setDate(prev.getDate() - 1)
    setSelectedDate(prev)
    setExpandedItem(1) // reset expanded item on day change
  }

  const handleNextDay = () => {
    const next = new Date(selectedDate)
    next.setDate(next.getDate() + 1)
    setSelectedDate(next)
    setExpandedItem(1)
  }

  const PROGRAM_KEYS = Object.keys(programs)
  const todaysSchedule = weekSchedule[selectedDate.getDay()] || []

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    if (hour < 21) return 'Good Evening'
    return 'Good Night'
  }

  return (
    <div className="page-content">
      <h1 className="welcome-heading">{getGreeting()}, {user?.name.split(' ')[0]} 👋</h1>

      <div className="home-grid">
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Explore Curriculum */}
          <div className="card fade-in-up">
            <div className="card-header" style={{ paddingBottom: 16 }}>
              <h2 className="card-title" style={{ fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <BookOpen size={18} color="#6c47ff" /> Explore Curriculum
              </h2>
            </div>
            <div style={{ padding: '0 20px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {PROGRAM_KEYS.map(progKey => {
                const p = programs[progKey]
                const allSubjects = Object.values(p.semesters).flatMap(s => s.subjects)
                const quizCount = allSubjects.filter(s => quizData[s.id]).length
                return (
                  <button key={progKey} onClick={() => navigate('/curriculum')} style={{
                    padding: 24, borderRadius: 16, border: '2px solid #e8e4ff',
                    background: 'white', cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.25s', boxShadow: '0 4px 15px rgba(108,71,255,0.04)',
                    display: 'flex', flexDirection: 'column'
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = p.color
                      e.currentTarget.style.boxShadow = `0 6px 20px ${p.color}20`
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#e8e4ff'
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(108,71,255,0.04)'
                      e.currentTarget.style.transform = 'none'
                    }}
                  >
                    <div style={{
                      width: 48, height: 48, borderRadius: 14, marginBottom: 16,
                      background: `linear-gradient(135deg, ${p.color}, ${p.color}99)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 24, boxShadow: `0 4px 12px ${p.color}35`,
                    }}>{p.icon}</div>
                    
                    <div style={{ fontSize: 10, fontWeight: 700, color: p.color, letterSpacing: 0.5,
                      textTransform: 'uppercase', marginBottom: 6 }}>{progKey}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#1e1b4b', marginBottom: 6, lineHeight: 1.3 }}>
                      {p.fullName}
                    </div>
                    <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 14 }}>
                      Semesters 3 & 4 · {allSubjects.length} subjects
                    </div>
                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 4,
                      fontSize: 12, fontWeight: 600, color: p.color }}>
                      View Syllabus <ChevronRight size={14} />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Schedule */}
          <div className="card fade-in-up">
            <div className="card-header">
              <h2 className="card-title" style={{ fontSize: 15 }}>Your Schedule</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6c47ff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                <Calendar size={15} /> Calendar
              </div>
            </div>

            {/* Date nav */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px 16px', borderBottom: '1px solid #f0ecff' }}>
              <button className="icon-btn" onClick={handlePrevDay} style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0 }}><ChevronLeft size={14} /></button>
              <span style={{ flex: 1, textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#374151' }}>{formattedDate}</span>
              {isToday && <span style={{ padding: '3px 10px', background: '#f5f3ff', color: '#6c47ff', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>Today</span>}
              <button className="icon-btn" onClick={handleNextDay} style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0 }}><ChevronRight size={14} /></button>
            </div>

            {/* Timeline */}
            <div style={{ padding: '20px 20px 20px' }}>
              {todaysSchedule.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1e1b4b' }}>No classes today!</div>
                  <div style={{ fontSize: 13, marginTop: 4 }}>Enjoy your day off or practice some coding.</div>
                </div>
              ) : (
                <div className="schedule-timeline">
                  {todaysSchedule.map((item, idx) => (
                    <div key={item.id} className="schedule-item" style={{ position: 'relative' }}>
                      {/* Connector line */}
                      {idx < todaysSchedule.length - 1 && (
                        <div className="timeline-line" />
                      )}
                    {/* Dot */}
                    <div className="timeline-dot" style={{ background: item.dotColor }}>
                      {idx + 1}
                    </div>
                    {/* Card */}
                    <div className="schedule-card" style={{ borderLeft: `3px solid ${item.dotColor}` }}
                      onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}>
                      <div className="schedule-card-header">
                        <TypeLabel type={item.type} />
                        <span style={{ fontSize: 12, color: '#6b7280' }}>{item.time}</span>
                      </div>
                      <div className="schedule-card-body">
                        <div className="schedule-card-title">{item.title}</div>
                        {expandedItem === item.id && (
                          <div style={{ marginTop: 8 }}>
                            <div className="schedule-meta">
                              <User size={12} /> {item.faculty}
                            </div>
                            <div className="schedule-meta">
                              <MapPin size={12} /> {item.room}
                            </div>
                            {item.resources && (
                              <div className="schedule-resources">
                                {item.resources.map((r, i) => (
                                  <button key={i} className="resource-btn" onClick={(e) => {
                                    e.stopPropagation()
                                    navigate(r.link)
                                  }}>
                                    {r.label} <ExternalLink size={11} />
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        {expandedItem !== item.id && (
                          <div style={{ marginTop: 4, fontSize: 12, color: '#6c47ff', fontWeight: 600, cursor: 'pointer' }}>
                            Show Details
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Attendance Marker */}
          <div className="card attendance-card fade-in-up">
            <div style={{ padding: '20px 24px' }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1e1b4b', marginBottom: 16 }}>
                Your Attendance Marker
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: '#6b7280' }}>Overall Semester Attendance</span>
                <span className="attendance-percentage">53.6%</span>
              </div>
              <div className="attendance-bar-track">
                <div className="attendance-bar-fill" style={{ width: '53.6%', background: 'linear-gradient(90deg, #ef4444, #f97316)' }} />
              </div>
              <div className="attendance-warning">
                <AlertCircle size={14} color="#d97706" />
                <span>Your attendance can be better.</span>
              </div>

              {/* Per-subject breakdown */}
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { subj: 'Node.js', pct: 70, color: '#22c55e' },
                  { subj: 'DBMS', pct: 45, color: '#ef4444' },
                  { subj: 'OS', pct: 60, color: '#f59e0b' },
                  { subj: 'English', pct: 80, color: '#22c55e' },
                ].map(s => (
                  <div key={s.subj}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: '#374151' }}>{s.subj}</span>
                      <span style={{ fontWeight: 600, color: s.color }}>{s.pct}%</span>
                    </div>
                    <div style={{ height: 5, background: '#f0ecff', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${s.pct}%`, background: s.color, borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
