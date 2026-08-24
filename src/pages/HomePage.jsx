import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, ChevronLeft, ChevronRight, AlertTriangle, MapPin, User, ExternalLink, ArrowRight, BookOpen, Layers } from 'lucide-react'
import { programs } from '../data/syllabus'
import { quizData } from '../data/quizData'
import { useApp } from '../context/AppContext'

const weekSchedule = {
  1: [
    { id: 1, type: 'Lecture', title: 'Database Management Systems', abbr: 'DMS', time: '8:00 – 9:00 AM', faculty: 'GSS', room: 'GF-2', resources: [{ label: 'View Syllabus', link: '/curriculum' }] },
    { id: 2, type: 'Lecture', title: 'Web Technology', abbr: 'WT', time: '9:00 – 10:00 AM', faculty: 'RM', room: 'GF-2', resources: [{ label: 'Module Quiz', link: '/quiz/web-tech' }] },
    { id: 3, type: 'Lab', title: 'DSA Lab / OOP Lab', abbr: 'LAB', time: '10:00 AM – 12:00 PM', faculty: 'AB / SM', room: 'EL-4 / CC-2', resources: [{ label: 'Open Compiler', link: '/playground?lang=c&locked=true' }, { label: 'Coding Questions', link: '/curriculum' }] },
    { id: 4, type: 'Lecture', title: 'Digital Electronics', abbr: 'DE', time: '12:00 – 1:00 PM', faculty: 'SM', room: 'GF-1' }
  ],
  2: [
    { id: 1, type: 'Lecture', title: 'Database Management Systems', abbr: 'DMS', time: '8:00 – 9:00 AM', faculty: 'GSS', room: 'GF-2' },
    { id: 2, type: 'Lecture', title: 'Web Technology', abbr: 'WT', time: '9:00 – 10:00 AM', faculty: 'RM', room: 'GF-2' },
    { id: 3, type: 'Lab', title: 'WT Lab / DSA Lab', abbr: 'LAB', time: '10:00 AM – 12:00 PM', faculty: 'RM / SM', room: 'CC-2 / EL-4' },
    { id: 4, type: 'Lecture', title: 'Digital Electronics', abbr: 'DE', time: '12:00 – 1:00 PM', faculty: 'SM', room: 'GF-1' }
  ],
  3: [
    { id: 1, type: 'Lecture', title: 'Database Management Systems', abbr: 'DMS', time: '8:00 – 9:00 AM', faculty: 'GSS', room: 'GF-2' },
    { id: 2, type: 'Lecture', title: 'Web Technology', abbr: 'WT', time: '9:00 – 10:00 AM', faculty: 'RM', room: 'GF-2' },
    { id: 3, type: 'Lab', title: 'DSA Lab / WT Lab', abbr: 'LAB', time: '10:00 AM – 12:00 PM', faculty: 'AB / RM', room: 'EL-4 / CC-2' },
    { id: 4, type: 'Lecture', title: 'Object Oriented Programming', abbr: 'OOP', time: '12:00 – 1:00 PM', faculty: 'SM', room: 'GF-2' }
  ],
  4: [
    { id: 1, type: 'Lecture', title: 'Data Structures & Algorithms', abbr: 'DSA', time: '8:00 – 9:00 AM', faculty: 'AB', room: 'GF-2' },
    { id: 2, type: 'Lecture', title: 'Object Oriented Programming', abbr: 'OOP', time: '9:00 – 10:00 AM', faculty: 'SM', room: 'GF-2' },
    { id: 3, type: 'Lab', title: 'FDS Lab / DSA Lab', abbr: 'LAB', time: '10:00 AM – 12:00 PM', faculty: 'AB / SM', room: 'CC-2 / EL-4' },
    { id: 4, type: 'Lecture', title: 'PPCE', abbr: 'PPCE', time: '12:00 – 1:00 PM', faculty: 'RM', room: 'GF-2' }
  ],
  5: [
    { id: 1, type: 'Lecture', title: 'Database Management Systems', abbr: 'DMS', time: '8:00 – 9:00 AM', faculty: 'GSS', room: 'GF-2' },
    { id: 2, type: 'Lecture', title: 'PPCE', abbr: 'PPCE', time: '9:00 – 10:00 AM', faculty: 'RM', room: 'GF-2' },
    { id: 3, type: 'Lab', title: 'DE Lab / OOP Lab', abbr: 'LAB', time: '10:00 AM – 12:00 PM', faculty: 'RM / SM', room: 'EL-4 / CC-2' },
    { id: 4, type: 'Lecture', title: 'Digital Electronics', abbr: 'DE', time: '12:00 – 1:00 PM', faculty: 'SM', room: 'GF-1' }
  ],
  6: [
    { id: 1, type: 'Lecture', title: 'Data Structures & Algorithms', abbr: 'DSA', time: '8:00 – 9:00 AM', faculty: 'AB', room: 'GF-2' },
    { id: 2, type: 'Lecture', title: 'Object Oriented Programming', abbr: 'OOP', time: '9:00 – 10:00 AM', faculty: 'SM', room: 'GF-2' },
    { id: 3, type: 'Lecture', title: 'PPCE', abbr: 'PPCE', time: '10:00 AM – 12:00 PM', faculty: 'RM', room: 'GF-2' },
    { id: 4, type: 'Lecture', title: 'Foundations of Data Science', abbr: 'FDS', time: '12:00 – 1:00 PM', faculty: 'AB', room: 'GF-1' }
  ],
  0: []
}

const attendanceData = [
  { subj: 'Node.js', pct: 70 },
  { subj: 'DBMS', pct: 45 },
  { subj: 'OS', pct: 60 },
  { subj: 'English', pct: 80 },
]

function TypeLabel({ type }) {
  const styles = {
    Lab: { text: 'LAB', cls: 'label-assessment' },
    Lecture: { text: 'LEC', cls: 'label-lecture' },
    Assessment: { text: 'EXAM', cls: 'label-exam' },
  }
  const s = styles[type] || styles.Lecture
  return <span className={`course-card-label ${s.cls}`}>{s.text}</span>
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
    setExpandedItem(1)
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
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    if (hour < 21) return 'Good evening'
    return 'Good night'
  }

  const overallAttendance = 53.6

  return (
    <div className="page-content">
      {/* Greeting — clean typographic, no emoji */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: '#A3A3A3', fontWeight: 400, marginBottom: 2 }}>{getGreeting()}</div>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: '#1A1A1A', letterSpacing: '-0.3px' }}>
          {user?.name.split(' ')[0]}
        </h1>
      </div>

      <div className="home-grid">
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Explore Curriculum */}
          <div className="card fade-in-up">
            <div className="card-header">
              <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <BookOpen size={15} color="#A3A3A3" /> Explore Curriculum
              </h2>
            </div>
            <div style={{ padding: '0 16px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {PROGRAM_KEYS.map(progKey => {
                const p = programs[progKey]
                const allSubjects = Object.values(p.semesters).flatMap(s => s.subjects)
                return (
                  <button
                    key={progKey}
                    onClick={() => navigate('/curriculum')}
                    style={{
                      padding: '16px', borderRadius: 8, border: '1px solid #E7E5E4',
                      background: '#FAFAFA', cursor: 'pointer', textAlign: 'left',
                      transition: 'border-color 150ms, background 150ms',
                      display: 'flex', flexDirection: 'column', gap: 0
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#D4D4D4'
                      e.currentTarget.style.background = '#FFFFFF'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#E7E5E4'
                      e.currentTarget.style.background = '#FAFAFA'
                    }}
                  >
                    {/* Small line icon instead of cartoon */}
                    <div style={{ marginBottom: 12, color: '#A3A3A3' }}>
                      <Layers size={18} />
                    </div>
                    <div style={{ fontSize: 9, fontWeight: 600, color: '#A3A3A3', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 }}>{progKey}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', marginBottom: 4, lineHeight: 1.3 }}>
                      {p.fullName}
                    </div>
                    <div style={{ fontSize: 11, color: '#A3A3A3', marginBottom: 12 }}>
                      Semesters 3 & 4 · {allSubjects.length} subjects
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#525252', fontWeight: 500 }}>
                      View Syllabus <ChevronRight size={12} />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Schedule */}
          <div className="card fade-in-up">
            <div className="card-header">
              <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={15} color="#A3A3A3" /> Schedule
              </h2>
            </div>

            {/* Date nav */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px 12px', borderBottom: '1px solid #E7E5E4' }}>
              <button className="icon-btn" onClick={handlePrevDay} style={{ width: 26, height: 26, borderRadius: 6 }}>
                <ChevronLeft size={13} />
              </button>
              <span style={{ flex: 1, textAlign: 'center', fontSize: 12, fontWeight: 500, color: '#525252' }}>{formattedDate}</span>
              {isToday && <span style={{ padding: '2px 8px', background: '#F5F5F4', color: '#525252', borderRadius: 4, fontSize: 10, fontWeight: 500, border: '1px solid #E7E5E4' }}>Today</span>}
              <button className="icon-btn" onClick={handleNextDay} style={{ width: 26, height: 26, borderRadius: 6 }}>
                <ChevronRight size={13} />
              </button>
            </div>

            {/* Timeline */}
            <div style={{ padding: '16px' }}>
              {todaysSchedule.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: '#A3A3A3' }}>
                  <Calendar size={28} style={{ margin: '0 auto 10px', opacity: 0.3 }} />
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#525252' }}>No classes today</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>Enjoy your day off</div>
                </div>
              ) : (
                <div className="schedule-timeline">
                  {todaysSchedule.map((item, idx) => (
                    <div key={item.id} className="schedule-item" style={{ position: 'relative' }}>
                      {idx < todaysSchedule.length - 1 && <div className="timeline-line" />}
                      <div className="timeline-dot">{idx + 1}</div>
                      <div
                        className="schedule-card"
                        style={{ borderLeft: expandedItem === item.id ? '2px solid #1A1A1A' : '2px solid transparent' }}
                        onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                      >
                        <div className="schedule-card-header">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <TypeLabel type={item.type} />
                            <span style={{ fontSize: 11, color: '#A3A3A3' }}>{item.time}</span>
                          </div>
                        </div>
                        <div className="schedule-card-body">
                          <div className="schedule-card-title">{item.title}</div>
                          {expandedItem === item.id && (
                            <div style={{ marginTop: 8 }}>
                              <div className="schedule-meta"><User size={11} /> {item.faculty}</div>
                              <div className="schedule-meta"><MapPin size={11} /> {item.room}</div>
                              {item.resources && (
                                <div className="schedule-resources">
                                  {item.resources.map((r, i) => (
                                    <button key={i} className="resource-btn" onClick={(e) => { e.stopPropagation(); navigate(r.link) }}>
                                      {r.label} <ExternalLink size={10} />
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                          {expandedItem !== item.id && (
                            <div style={{ marginTop: 3, fontSize: 11, color: '#A3A3A3', cursor: 'pointer' }}>
                              Tap to expand
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Attendance */}
          <div className="card attendance-card fade-in-up">
            <div style={{ padding: '16px 20px' }}>
              <h2 style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 16 }}>Attendance</h2>

              {/* Overall stat */}
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 2 }}>
                <span style={{ fontSize: 11, color: '#A3A3A3' }}>Overall semester</span>
                <span className="attendance-percentage">{overallAttendance}%</span>
              </div>
              <div className="attendance-bar-track">
                <div className="attendance-bar-fill" style={{ width: `${overallAttendance}%` }} />
              </div>

              {/* Inline note — no colored box */}
              {overallAttendance < 75 && (
                <div className="attendance-warning">
                  <AlertTriangle size={12} />
                  <span>Below 75% threshold</span>
                </div>
              )}

              {/* Per-subject — all black bars, no color coding */}
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {attendanceData.map(s => (
                  <div key={s.subj}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                      <span style={{ color: '#525252' }}>{s.subj}</span>
                      <span style={{ fontWeight: 500, color: '#525252' }}>{s.pct}%</span>
                    </div>
                    <div style={{ height: 4, background: '#E7E5E4', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${s.pct}%`, background: '#1A1A1A', borderRadius: 99 }} />
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
