import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronDown, ChevronUp, ArrowLeft, X, BookOpen,
  Code2, HelpCircle, Zap, CheckCircle, ChevronRight
} from 'lucide-react'
import { programs, CATEGORY_COLORS, COMPILER_LABELS } from '../data/syllabus'
import { subjectDetails } from '../data/subjectDetails'
import { quizData } from '../data/quizData'
import { useApp } from '../context/AppContext'

// ─── Difficulty badge ─────────────────────────────────────────────────────────
function DiffBadge({ diff }) {
  const styles = {
    Easy:   { background: '#ecfdf5', color: '#059669' },
    Medium: { background: '#fff7ed', color: '#d97706' },
    Hard:   { background: '#fef2f2', color: '#dc2626' },
  }
  return (
    <span style={{ ...styles[diff], fontSize: 10, fontWeight: 700,
      padding: '2px 8px', borderRadius: 20 }}>{diff}</span>
  )
}

// ─── Modal: Subject detail with 4 options ────────────────────────────────────
function SubjectModal({ subject, onClose, navigate, solvedQuestions = [], setSolvedQuestions }) {
  const [view, setView] = useState('menu') // 'menu' | 'syllabus' | 'questions' | 'coding'
  const [activeQuestion, setActiveQuestion] = useState(null)
  const { quizHistory } = useApp()

  const details = subjectDetails[subject.id]
  const quiz = quizData[subject.id]
  const quizResult = quizHistory[subject.id]
  const compilerInfo = subject.compiler ? COMPILER_LABELS[subject.compiler] : null

  const handlePractice = () => {
    onClose()
    navigate(`/playground?lang=${subject.compiler}&locked=true`)
  }
  const handleQuiz = () => {
    onClose()
    navigate(`/quiz/${subject.id}`)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(30,27,74,0.5)',
      backdropFilter: 'blur(4px)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>

      <div style={{
        background: 'white', borderRadius: 20, width: '100%', maxWidth: 720,
        maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(108,71,255,0.25)',
      }}>
        {/* Modal header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid #f0ecff',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #f5f3ff, #faf9ff)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {view !== 'menu' && (
              <button onClick={() => { setView('menu'); setActiveQuestion(null) }} style={{
                background: 'none', border: 'none', cursor: 'pointer', color: '#6c47ff',
                display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600,
              }}>
                <ArrowLeft size={15} /> Back
              </button>
            )}
            <div style={{ fontSize: 28 }}>
              {details ? (quiz?.icon ?? '📘') : '📘'}
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#1e1b4b' }}>{subject.name}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'monospace' }}>{subject.code}</span>
                <span style={{ fontSize: 11, fontWeight: 600,
                  ...CATEGORY_COLORS[subject.category],
                  padding: '1px 7px', borderRadius: 20 }}>{subject.category}</span>
                <span style={{ fontSize: 11, color: '#6b7280' }}>{subject.credits} Credits</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: '50%', border: 'none',
            background: '#f5f3ff', cursor: 'pointer', color: '#6b7280',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
          }}>
            <X size={16} />
          </button>
        </div>

        {/* Modal body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>

          {/* ── MENU VIEW ── */}
          {view === 'menu' && (
            <div>
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>
                What would you like to do with this subject?
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

                {/* Syllabus */}
                {details?.topics && (
                  <button onClick={() => setView('syllabus')} style={{
                    padding: 20, borderRadius: 16, border: '2px solid #e8e4ff',
                    background: 'white', cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#6c47ff'; e.currentTarget.style.background = '#f5f3ff' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8e4ff'; e.currentTarget.style.background = 'white' }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 10 }}>📖</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1e1b4b', marginBottom: 4 }}>View Syllabus</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{details.topics.length} topics covered</div>
                  </button>
                )}

                {/* Practice Compiler */}
                {subject.compiler && (
                  <button onClick={handlePractice} style={{
                    padding: 20, borderRadius: 16, border: '2px solid #e8e4ff',
                    background: 'white', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = compilerInfo?.color || '#6c47ff'; e.currentTarget.style.background = '#faf9ff' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8e4ff'; e.currentTarget.style.background = 'white' }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 10 }}>{compilerInfo?.icon || '💻'}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1e1b4b', marginBottom: 4 }}>Practice Coding</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: compilerInfo?.color || '#6c47ff' }}>
                      Opens {compilerInfo?.label} Compiler
                    </div>
                  </button>
                )}

                {/* Coding Questions */}
                {details?.codingProblems && (
                  <button onClick={() => setView('coding')} style={{
                    padding: 20, borderRadius: 16, border: '2px solid #e8e4ff',
                    background: 'white', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.background = '#fffbeb' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8e4ff'; e.currentTarget.style.background = 'white' }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 10 }}>❓</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1e1b4b', marginBottom: 4 }}>Coding Questions</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{details.codingProblems.length} programming challenges</div>
                  </button>
                )}

                {/* Quiz */}
                {quiz && (
                  <button onClick={handleQuiz} style={{
                    padding: 20, borderRadius: 16, border: '2px solid #e8e4ff',
                    background: 'white', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#6c47ff'; e.currentTarget.style.background = '#f5f3ff' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8e4ff'; e.currentTarget.style.background = 'white' }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 10 }}>🎯</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1e1b4b', marginBottom: 4 }}>Take Quiz</div>
                    {quizResult ? (
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#059669', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle size={11} /> Best: {quizResult.score}/{quizResult.total * 10} pts
                      </div>
                    ) : (
                      <div style={{ fontSize: 12, color: '#6b7280' }}>10 questions · 10 min</div>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── SYLLABUS VIEW ── */}
          {view === 'syllabus' && details?.topics && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e1b4b', marginBottom: 16 }}>
                📖 Topics Covered
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {details.topics.map((topic, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '12px 16px', borderRadius: 12,
                    background: i % 2 === 0 ? '#faf9ff' : 'white',
                    border: '1px solid #f0ecff',
                  }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg, #6c47ff, #a855f7)',
                      color: 'white', fontSize: 11, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {i + 1}
                    </div>
                    <span style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CODING QUESTIONS LIST ── */}
          {view === 'coding' && !activeQuestion && details?.codingProblems && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e1b4b', marginBottom: 8 }}>
                ❓ Coding Challenges
              </h3>
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
                Solve these problems in the Playground. Click any problem to see the details and starter code.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {details.codingProblems.map((prob, i) => (
                  <button key={prob.id} onClick={() => setActiveQuestion(prob)} style={{
                    padding: '14px 18px', borderRadius: 12, border: '1.5px solid #e8e4ff',
                    background: 'white', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', gap: 14,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#6c47ff'; e.currentTarget.style.background = '#faf9ff' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8e4ff'; e.currentTarget.style.background = 'white' }}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                      background: '#f5f3ff', color: '#6c47ff', fontWeight: 800, fontSize: 14,
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1e1b4b', display: 'flex', alignItems: 'center', gap: 8 }}>
                        {prob.title}
                        {solvedQuestions.includes(prob.id) && <CheckCircle size={14} color="#059669" />}
                      </div>
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 3, lineHeight: 1.4 }}>
                        {(prob.objective || prob.description).slice(0, 80)}…
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <DiffBadge diff={prob.difficulty} />
                      {compilerInfo && (
                        <span style={{ fontSize: 10, fontWeight: 600, color: compilerInfo.color,
                          background: `${compilerInfo.color}15`, padding: '2px 8px', borderRadius: 20 }}>
                          {compilerInfo.icon} {compilerInfo.label}
                        </span>
                      )}
                      <ChevronRight size={16} color="#9ca3af" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── SINGLE CODING QUESTION ── */}
          {view === 'coding' && activeQuestion && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <button onClick={() => setActiveQuestion(null)} style={{
                  background: 'none', border: 'none', cursor: 'pointer', color: '#6c47ff',
                  display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600,
                }}>
                  <ArrowLeft size={15} /> All Questions
                </button>
                <DiffBadge diff={activeQuestion.difficulty} />
                {compilerInfo && (
                  <span style={{ fontSize: 11, fontWeight: 600, color: compilerInfo.color,
                    background: `${compilerInfo.color}15`, padding: '2px 10px', borderRadius: 20 }}>
                    {compilerInfo.icon} {compilerInfo.label}
                  </span>
                )}
              </div>

              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1e1b4b', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                {activeQuestion.title}
                {solvedQuestions.includes(activeQuestion.id) && <CheckCircle size={20} color="#059669" />}
              </h2>
              {activeQuestion.objective ? (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ padding: '14px 18px', background: '#f5f3ff', borderRadius: 12, marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#6c47ff', textTransform: 'uppercase', marginBottom: 6 }}>Objective</div>
                    <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.6 }}>{activeQuestion.objective}</div>
                  </div>
                  
                  {activeQuestion.requirements && (
                    <div style={{ padding: '14px 18px', border: '1px solid #e8e4ff', borderRadius: 12, marginBottom: 16 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#1e1b4b', textTransform: 'uppercase', marginBottom: 10 }}>Requirements</div>
                      <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: '#4b5563', lineHeight: 1.6 }}>
                        {activeQuestion.requirements.map((req, idx) => (
                          <li key={idx} style={{ marginBottom: 4 }}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeQuestion.expectedOutput && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#1e1b4b', marginBottom: 10 }}>Example 1:</div>
                      
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>Output:</div>
                      <pre style={{
                        background: '#f1f5f9', color: '#1e1b4b', padding: 16, borderRadius: 10,
                        border: 'none', fontFamily: "'Fira Code', monospace", fontSize: 13,
                        margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6
                      }}>
                        {activeQuestion.expectedOutput}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, marginBottom: 20,
                  padding: '14px 18px', background: '#f5f3ff', borderRadius: 12 }}>
                  {activeQuestion.description}
                </p>
              )}

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: 0.5,
                  textTransform: 'uppercase', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Code2 size={13} /> Starter Code
                </div>
                <pre style={{
                  background: '#1e1e2e', color: '#cdd6f4', padding: 18, borderRadius: 14,
                  fontFamily: "'Fira Code', monospace", fontSize: 12, lineHeight: 1.7,
                  overflowX: 'auto', whiteSpace: 'pre', margin: 0,
                }}>
                  {activeQuestion.starterCode}
                </pre>
              </div>

              {subject.compiler && (
                <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                  <button onClick={() => {
                    onClose()
                    navigate(`/playground?lang=${subject.compiler}&locked=true`)
                  }} style={{
                    flex: 1, padding: '12px', borderRadius: 12, border: '2px solid #e8e4ff',
                    background: 'white', color: '#1e1b4b',
                    fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}>
                    <Code2 size={16} color="#6c47ff" /> Attempt Question
                  </button>
                  <button onClick={() => {
                    if (!solvedQuestions.includes(activeQuestion.id)) {
                      setSolvedQuestions && setSolvedQuestions([...solvedQuestions, activeQuestion.id])
                    }
                  }} style={{
                    flex: 1, padding: '12px', borderRadius: 12, border: 'none',
                    background: solvedQuestions.includes(activeQuestion.id) ? '#ecfdf5' : 'linear-gradient(135deg, #6c47ff, #a855f7)',
                    color: solvedQuestions.includes(activeQuestion.id) ? '#059669' : 'white',
                    fontSize: 14, fontWeight: 700, cursor: solvedQuestions.includes(activeQuestion.id) ? 'default' : 'pointer', transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    boxShadow: solvedQuestions.includes(activeQuestion.id) ? 'none' : '0 4px 16px rgba(108,71,255,0.3)',
                  }}>
                    {solvedQuestions.includes(activeQuestion.id) ? <CheckCircle size={16} /> : <Zap size={16} />}
                    {solvedQuestions.includes(activeQuestion.id) ? 'Solved' : 'Mark as Solved'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Clean subject row ────────────────────────────────────────────────────────
function SubjectRow({ subject, onClick, quizHistory }) {
  const catStyle = CATEGORY_COLORS[subject.category] || CATEGORY_COLORS.PCC
  const quizResult = quizHistory[subject.id]
  const emoji = subjectDetails[subject.id] ? (quizData[subject.id]?.icon ?? '📘') : (subject.isLab ? '🧪' : '📘')

  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px',
      borderRadius: 12, background: 'white', border: '1.5px solid #e8e4ff',
      cursor: 'pointer', transition: 'all 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#6c47ff'; e.currentTarget.style.background = '#faf9ff'; e.currentTarget.style.transform = 'translateX(4px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8e4ff'; e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'none' }}
    >
      <div style={{ fontSize: 20, width: 36, textAlign: 'center', flexShrink: 0 }}>{emoji}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#1e1b4b', lineHeight: 1.3 }}>
          {subject.name}
          {subject.isLab && <span style={{ marginLeft: 6, fontSize: 10, background: '#ecfdf5', color: '#059669', padding: '1px 6px', borderRadius: 20, fontWeight: 700 }}>LAB</span>}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: '#9ca3af', fontFamily: 'monospace' }}>{subject.code}</span>
          <span style={{ fontSize: 10, fontWeight: 600, ...catStyle, padding: '1px 7px', borderRadius: 20 }}>{subject.category}</span>
          <span style={{ fontSize: 10, color: '#6b7280' }}>{subject.credits} Cr</span>
        </div>
      </div>
      {quizResult && (
        <span style={{ fontSize: 11, fontWeight: 700, color: '#059669', background: '#ecfdf5',
          padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: 4 }}>
          <CheckCircle size={11} /> {quizResult.score} pts
        </span>
      )}
      <ChevronRight size={16} color="#c4b5fd" style={{ flexShrink: 0 }} />
    </div>
  )
}

// ─── Semester accordion ───────────────────────────────────────────────────────
function SemesterSection({ semNum, semData, onSubjectClick, quizHistory }) {
  const [open, setOpen] = useState(false)
  const theory = semData.subjects.filter(s => !s.isLab && !s.id.startsWith('ncc'))
  const labs   = semData.subjects.filter(s => s.isLab)

  return (
    <div className="accordion-item">
      <div className="accordion-header" onClick={() => setOpen(!open)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="accordion-title">{semData.label}</span>
          <span className="subject-badge">{semData.subjects.length} subjects</span>
        </div>
        {open ? <ChevronUp size={18} color="#6c47ff" /> : <ChevronDown size={18} color="#9ca3af" />}
      </div>

      {open && (
        <div style={{ padding: '4px 20px 20px', borderTop: '1px solid #f0ecff' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: 0.5,
            textTransform: 'uppercase', margin: '16px 0 10px' }}>Theory</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {theory.map(s => (
              <SubjectRow key={s.id} subject={s} quizHistory={quizHistory} onClick={() => onSubjectClick(s)} />
            ))}
          </div>
          {labs.length > 0 && (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: 0.5,
                textTransform: 'uppercase', margin: '16px 0 10px' }}>Practicals / Labs</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {labs.map(s => (
                  <SubjectRow key={s.id} subject={s} quizHistory={quizHistory} onClick={() => onSubjectClick(s)} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CurriculumPage() {
  const [selectedProgram, setSelectedProgram] = useState(null)
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [solvedQuestions, setSolvedQuestions] = useState([])
  const { quizHistory } = useApp()
  const navigate = useNavigate()

  const PROGRAM_KEYS = Object.keys(programs)

  // ── Level 1: Program cards ────────────────────────────────────────────────
  if (!selectedProgram) return (
    <div className="page-content" style={{ maxWidth: 860 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1e1b4b' }}>📚 Curriculum</h1>
        <p style={{ fontSize: 14, color: '#6b7280', marginTop: 6 }}>
          Select your program to explore the semester-wise syllabus
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {PROGRAM_KEYS.map(progKey => {
          const p = programs[progKey]
          const allSubjects = Object.values(p.semesters).flatMap(s => s.subjects)
          const quizCount = allSubjects.filter(s => quizData[s.id]).length
          return (
            <button key={progKey} onClick={() => setSelectedProgram(progKey)} style={{
              padding: 32, borderRadius: 20, border: '2px solid #e8e4ff',
              background: 'white', cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.25s', boxShadow: '0 4px 20px rgba(108,71,255,0.06)',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = p.color
                e.currentTarget.style.boxShadow = `0 8px 30px ${p.color}25`
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#e8e4ff'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(108,71,255,0.06)'
                e.currentTarget.style.transform = 'none'
              }}
            >
              {/* Icon */}
              <div style={{
                width: 64, height: 64, borderRadius: 18, marginBottom: 20,
                background: `linear-gradient(135deg, ${p.color}, ${p.color}99)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 30, boxShadow: `0 6px 20px ${p.color}35`,
              }}>{p.icon}</div>

              <div style={{ fontSize: 11, fontWeight: 700, color: p.color, letterSpacing: 0.5,
                textTransform: 'uppercase', marginBottom: 8 }}>{progKey}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#1e1b4b', marginBottom: 8, lineHeight: 1.3 }}>
                {p.fullName}
              </div>
              <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5, marginBottom: 20 }}>
                Semesters 3 & 4 · {allSubjects.length} subjects · {quizCount} quizzes
              </div>

              {/* Semester pills */}
              <div style={{ display: 'flex', gap: 8 }}>
                {Object.values(p.semesters).map(s => (
                  <span key={s.label} style={{
                    fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 20,
                    background: `${p.color}15`, color: p.color,
                  }}>{s.subjects.length} subjects</span>
                ))}
              </div>

              <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 13, fontWeight: 600, color: p.color }}>
                Explore Curriculum <ChevronRight size={16} />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )

  // ── Level 2: Subjects list ────────────────────────────────────────────────
  const prog = programs[selectedProgram]
  return (
    <div className="page-content" style={{ maxWidth: 860 }}>
      {/* Back button */}
      <button onClick={() => setSelectedProgram(null)} style={{
        display: 'flex', alignItems: 'center', gap: 6, background: 'none',
        border: 'none', color: '#6b7280', fontSize: 13, cursor: 'pointer',
        marginBottom: 20, fontWeight: 600, padding: '6px 12px', borderRadius: 20,
        transition: 'all 0.2s',
      }}
        onMouseEnter={e => { e.currentTarget.style.background = '#f5f3ff'; e.currentTarget.style.color = '#6c47ff' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#6b7280' }}
      >
        <ArrowLeft size={16} /> All Programs
      </button>

      {/* Program header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <div style={{
          width: 54, height: 54, borderRadius: 16, fontSize: 26,
          background: `linear-gradient(135deg, ${prog.color}, ${prog.color}99)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 4px 16px ${prog.color}35`,
        }}>{prog.icon}</div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: prog.color, letterSpacing: 0.5,
            textTransform: 'uppercase' }}>{selectedProgram}</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1e1b4b', margin: '2px 0' }}>
            {prog.fullName}
          </h1>
          <div style={{ fontSize: 13, color: '#9ca3af' }}>Click on any subject to explore</div>
        </div>
      </div>

      {/* Accordions */}
      {Object.entries(prog.semesters).map(([semNum, semData]) => (
        <SemesterSection
          key={semNum}
          semNum={Number(semNum)}
          semData={semData}
          quizHistory={quizHistory}
          onSubjectClick={setSelectedSubject}
        />
      ))}

      {/* Subject modal */}
      {selectedSubject && (
        <SubjectModal
          subject={selectedSubject}
          onClose={() => setSelectedSubject(null)}
          navigate={navigate}
          solvedQuestions={solvedQuestions}
          setSolvedQuestions={setSolvedQuestions}
        />
      )}
    </div>
  )
}
