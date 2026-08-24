import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronDown, ChevronUp, ArrowLeft, X, BookOpen,
  Code2, HelpCircle, Layers, CheckCircle, ChevronRight,
  Terminal, FileCode
} from 'lucide-react'
import { programs, CATEGORY_COLORS, COMPILER_LABELS } from '../data/syllabus'
import { subjectDetails } from '../data/subjectDetails'
import { quizData } from '../data/quizData'
import { useApp } from '../context/AppContext'

// ─── Difficulty badge — fill-weight only, no color ─────────────────────────
function DiffBadge({ diff }) {
  const styles = {
    Easy:   { background: '#FAFAFA', color: '#A3A3A3', border: '1px solid #E7E5E4' },
    Medium: { background: '#F5F5F4', color: '#525252', border: '1px solid #D4D4D4' },
    Hard:   { background: '#1A1A1A', color: '#FFFFFF', border: '1px solid #111111' },
  }
  return (
    <span style={{ ...styles[diff], fontSize: 10, fontWeight: 500,
      padding: '2px 8px', borderRadius: 4, fontFamily: 'inherit' }}>{diff}</span>
  )
}

// ─── Modal: Subject detail ────────────────────────────────────────────────────
function SubjectModal({ subject, onClose, navigate, solvedQuestions = [], setSolvedQuestions }) {
  const [view, setView] = useState('menu')
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
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
      backdropFilter: 'blur(4px)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>

      <div style={{
        background: 'white', borderRadius: 12, width: '100%', maxWidth: 680,
        maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        border: '1px solid #E7E5E4',
      }}>
        {/* Modal header — flat white, no gradient */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid #E7E5E4',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#FAFAFA',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {view !== 'menu' && (
              <button onClick={() => { setView('menu'); setActiveQuestion(null) }} style={{
                background: 'none', border: 'none', cursor: 'pointer', color: '#525252',
                display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500,
                fontFamily: 'inherit',
              }}>
                <ArrowLeft size={13} /> Back
              </button>
            )}
            {/* Neutral icon square — no emoji */}
            <div style={{
              width: 36, height: 36, borderRadius: 8, background: '#F5F5F4',
              border: '1px solid #E7E5E4',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BookOpen size={17} color="#A3A3A3" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#1A1A1A' }}>{subject.name}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: '#A3A3A3', fontFamily: 'monospace' }}>{subject.code}</span>
                {/* Category tag — text weight, no color fill */}
                <span style={{ fontSize: 10, fontWeight: 500, color: '#525252',
                  background: '#F5F5F4', border: '1px solid #E7E5E4',
                  padding: '1px 6px', borderRadius: 3 }}>{subject.category}</span>
                <span style={{ fontSize: 10, color: '#A3A3A3' }}>{subject.credits} Credits</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: '50%', border: '1px solid #E7E5E4',
            background: '#FAFAFA', cursor: 'pointer', color: '#A3A3A3',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <X size={14} />
          </button>
        </div>

        {/* Modal body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>

          {/* ── MENU VIEW ── */}
          {view === 'menu' && (
            <div>
              <p style={{ fontSize: 12, color: '#A3A3A3', marginBottom: 16 }}>
                What would you like to do with this subject?
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>

                {/* Syllabus */}
                {details?.topics && (
                  <button onClick={() => setView('syllabus')} style={{
                    padding: 16, borderRadius: 8, border: '1px solid #E7E5E4',
                    background: '#FAFAFA', cursor: 'pointer', textAlign: 'left',
                    transition: 'border-color 150ms, background 150ms', fontFamily: 'inherit',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#D4D4D4'; e.currentTarget.style.background = '#FFFFFF' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E7E5E4'; e.currentTarget.style.background = '#FAFAFA' }}
                  >
                    <BookOpen size={18} color="#A3A3A3" style={{ marginBottom: 8 }} />
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 3 }}>View Syllabus</div>
                    <div style={{ fontSize: 11, color: '#A3A3A3' }}>{details.topics.length} topics covered</div>
                  </button>
                )}

                {/* Practice Compiler */}
                {subject.compiler && (
                  <button onClick={handlePractice} style={{
                    padding: 16, borderRadius: 8, border: '1px solid #E7E5E4',
                    background: '#FAFAFA', cursor: 'pointer', textAlign: 'left',
                    transition: 'border-color 150ms, background 150ms', fontFamily: 'inherit',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#D4D4D4'; e.currentTarget.style.background = '#FFFFFF' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E7E5E4'; e.currentTarget.style.background = '#FAFAFA' }}
                  >
                    <Terminal size={18} color="#A3A3A3" style={{ marginBottom: 8 }} />
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 3 }}>Practice Coding</div>
                    <div style={{ fontSize: 11, color: '#A3A3A3' }}>Opens {compilerInfo?.label || 'Compiler'}</div>
                  </button>
                )}

                {/* Coding Questions */}
                {details?.codingProblems && (
                  <button onClick={() => setView('coding')} style={{
                    padding: 16, borderRadius: 8, border: '1px solid #E7E5E4',
                    background: '#FAFAFA', cursor: 'pointer', textAlign: 'left',
                    transition: 'border-color 150ms, background 150ms', fontFamily: 'inherit',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#D4D4D4'; e.currentTarget.style.background = '#FFFFFF' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E7E5E4'; e.currentTarget.style.background = '#FAFAFA' }}
                  >
                    <HelpCircle size={18} color="#A3A3A3" style={{ marginBottom: 8 }} />
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 3 }}>Coding Questions</div>
                    <div style={{ fontSize: 11, color: '#A3A3A3' }}>{details.codingProblems.length} programming challenges</div>
                  </button>
                )}

                {/* Quiz */}
                {quiz && (
                  <button onClick={handleQuiz} style={{
                    padding: 16, borderRadius: 8, border: '1px solid #E7E5E4',
                    background: '#FAFAFA', cursor: 'pointer', textAlign: 'left',
                    transition: 'border-color 150ms, background 150ms', fontFamily: 'inherit',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#D4D4D4'; e.currentTarget.style.background = '#FFFFFF' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E7E5E4'; e.currentTarget.style.background = '#FAFAFA' }}
                  >
                    <Layers size={18} color="#A3A3A3" style={{ marginBottom: 8 }} />
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 3 }}>Take Quiz</div>
                    {quizResult ? (
                      <div style={{ fontSize: 11, color: '#525252', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle size={11} color="#A3A3A3" /> Best: {quizResult.score}/{quizResult.total * 10} pts
                      </div>
                    ) : (
                      <div style={{ fontSize: 11, color: '#A3A3A3' }}>10 questions · 10 min</div>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── SYLLABUS VIEW ── */}
          {view === 'syllabus' && details?.topics && (
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 12 }}>
                Topics Covered
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {details.topics.map((topic, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 14px', borderRadius: 8,
                    background: '#FAFAFA',
                    border: '1px solid #E7E5E4',
                  }}>
                    {/* Numbered circle — neutral gray, no purple gradient */}
                    <div style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                      background: '#E7E5E4', color: '#525252', fontSize: 10, fontWeight: 600,
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {i + 1}
                    </div>
                    <span style={{ fontSize: 13, color: '#525252', fontWeight: 400 }}>{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CODING QUESTIONS LIST ── */}
          {view === 'coding' && !activeQuestion && details?.codingProblems && (
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 4 }}>
                Coding Challenges
              </h3>
              <p style={{ fontSize: 12, color: '#A3A3A3', marginBottom: 14 }}>
                Solve these problems in the Playground. Click any problem to see details and starter code.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {details.codingProblems.map((prob, i) => (
                  <button key={prob.id} onClick={() => setActiveQuestion(prob)} style={{
                    padding: '12px 14px', borderRadius: 8, border: '1px solid #E7E5E4',
                    background: '#FAFAFA', cursor: 'pointer', textAlign: 'left',
                    transition: 'border-color 150ms, background 150ms',
                    display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'inherit',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#D4D4D4'; e.currentTarget.style.background = '#FFFFFF' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E7E5E4'; e.currentTarget.style.background = '#FAFAFA' }}
                  >
                    {/* Problem number chip — neutral */}
                    <div style={{ width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                      background: '#E7E5E4', color: '#525252', fontWeight: 600, fontSize: 12,
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#1A1A1A', display: 'flex', alignItems: 'center', gap: 7 }}>
                        {prob.title}
                        {solvedQuestions.includes(prob.id) && <CheckCircle size={13} color="#A3A3A3" />}
                      </div>
                      <div style={{ fontSize: 11, color: '#A3A3A3', marginTop: 2, lineHeight: 1.4 }}>
                        {(prob.objective || prob.description).slice(0, 80)}…
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
                      <DiffBadge diff={prob.difficulty} />
                      {compilerInfo && (
                        <span style={{ fontSize: 10, fontWeight: 500, color: '#525252',
                          background: '#F5F5F4', border: '1px solid #E7E5E4',
                          padding: '2px 7px', borderRadius: 4 }}>
                          {compilerInfo.label}
                        </span>
                      )}
                      <ChevronRight size={14} color="#D4D4D4" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── SINGLE CODING QUESTION ── */}
          {view === 'coding' && activeQuestion && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <button onClick={() => setActiveQuestion(null)} style={{
                  background: 'none', border: 'none', cursor: 'pointer', color: '#525252',
                  display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500,
                  fontFamily: 'inherit',
                }}>
                  <ArrowLeft size={13} /> All Questions
                </button>
                <DiffBadge diff={activeQuestion.difficulty} />
                {compilerInfo && (
                  <span style={{ fontSize: 10, fontWeight: 500, color: '#525252',
                    background: '#F5F5F4', border: '1px solid #E7E5E4',
                    padding: '2px 8px', borderRadius: 4 }}>
                    {compilerInfo.label}
                  </span>
                )}
              </div>

              <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1A1A1A', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                {activeQuestion.title}
                {solvedQuestions.includes(activeQuestion.id) && <CheckCircle size={16} color="#A3A3A3" />}
              </h2>

              {activeQuestion.objective ? (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ padding: '12px 14px', background: '#FAFAFA', borderRadius: 8, marginBottom: 10, border: '1px solid #E7E5E4' }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: '#A3A3A3', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 5 }}>Objective</div>
                    <div style={{ fontSize: 13, color: '#525252', lineHeight: 1.6 }}>{activeQuestion.objective}</div>
                  </div>
                  
                  {activeQuestion.requirements && (
                    <div style={{ padding: '12px 14px', border: '1px solid #E7E5E4', borderRadius: 8, marginBottom: 10 }}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: '#A3A3A3', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>Requirements</div>
                      <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: '#525252', lineHeight: 1.7 }}>
                        {activeQuestion.requirements.map((req, idx) => (
                          <li key={idx} style={{ marginBottom: 3 }}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeQuestion.expectedOutput && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#525252', marginBottom: 6 }}>Example Output:</div>
                      <pre style={{
                        background: '#FAFAFA', color: '#1A1A1A', padding: 14, borderRadius: 8,
                        border: '1px solid #E7E5E4', fontFamily: "'Fira Code', monospace", fontSize: 12,
                        margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6
                      }}>
                        {activeQuestion.expectedOutput}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <p style={{ fontSize: 13, color: '#525252', lineHeight: 1.7, marginBottom: 16,
                  padding: '12px 14px', background: '#FAFAFA', borderRadius: 8, border: '1px solid #E7E5E4' }}>
                  {activeQuestion.description}
                </p>
              )}

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#A3A3A3', letterSpacing: 0.6,
                  textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Code2 size={12} /> Starter Code
                </div>
                <pre style={{
                  background: '#161618', color: '#D4D4D4', padding: 16, borderRadius: 8,
                  fontFamily: "'Fira Code', monospace", fontSize: 12, lineHeight: 1.7,
                  overflowX: 'auto', whiteSpace: 'pre', margin: 0,
                }}>
                  {activeQuestion.starterCode}
                </pre>
              </div>

              {subject.compiler && (
                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  {/* Secondary outlined button */}
                  <button onClick={() => {
                    onClose()
                    navigate(`/playground?lang=${subject.compiler}&locked=true`)
                  }} style={{
                    flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #E7E5E4',
                    background: '#FAFAFA', color: '#525252',
                    fontSize: 13, fontWeight: 500, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    fontFamily: 'inherit', transition: 'background 150ms',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F0F0F0'}
                    onMouseLeave={e => e.currentTarget.style.background = '#FAFAFA'}
                  >
                    <Code2 size={14} /> Attempt Question
                  </button>
                  {/* Primary solid black button */}
                  <button onClick={() => {
                    if (!solvedQuestions.includes(activeQuestion.id)) {
                      setSolvedQuestions && setSolvedQuestions([...solvedQuestions, activeQuestion.id])
                    }
                  }} style={{
                    flex: 1, padding: '10px', borderRadius: 8, border: 'none',
                    background: solvedQuestions.includes(activeQuestion.id) ? '#F5F5F4' : '#111111',
                    color: solvedQuestions.includes(activeQuestion.id) ? '#A3A3A3' : 'white',
                    fontSize: 13, fontWeight: 500, cursor: solvedQuestions.includes(activeQuestion.id) ? 'default' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    fontFamily: 'inherit', border: solvedQuestions.includes(activeQuestion.id) ? '1px solid #E7E5E4' : 'none',
                  }}>
                    {solvedQuestions.includes(activeQuestion.id) ? <CheckCircle size={14} /> : <CheckCircle size={14} />}
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

// ─── Subject row ─────────────────────────────────────────────────────────────
function SubjectRow({ subject, onClick, quizHistory }) {
  const quizResult = quizHistory[subject.id]

  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
      borderRadius: 8, background: '#FAFAFA', border: '1px solid #E7E5E4',
      cursor: 'pointer', transition: 'border-color 150ms, background 150ms',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#D4D4D4'; e.currentTarget.style.background = '#FFFFFF' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#E7E5E4'; e.currentTarget.style.background = '#FAFAFA' }}
    >
      {/* Plain neutral icon — no emoji */}
      <div style={{
        width: 32, height: 32, borderRadius: 6, background: '#F5F5F4',
        border: '1px solid #E7E5E4',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}>
        {subject.isLab
          ? <FileCode size={15} color="#A3A3A3" />
          : <BookOpen size={15} color="#A3A3A3" />
        }
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#1A1A1A', lineHeight: 1.3, display: 'flex', alignItems: 'center', gap: 6 }}>
          {subject.name}
          {subject.isLab && (
            <span style={{ fontSize: 9, background: '#F5F5F4', color: '#525252',
              padding: '1px 5px', borderRadius: 3, fontWeight: 500,
              border: '1px solid #E7E5E4', textTransform: 'uppercase', letterSpacing: 0.3 }}>LAB</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 3, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: '#A3A3A3', fontFamily: 'monospace' }}>{subject.code}</span>
          {/* Category — text chip, no color fill */}
          <span style={{ fontSize: 10, fontWeight: 500, color: '#525252',
            background: '#F5F5F4', border: '1px solid #E7E5E4',
            padding: '1px 5px', borderRadius: 3 }}>{subject.category}</span>
          <span style={{ fontSize: 10, color: '#A3A3A3' }}>{subject.credits} Cr</span>
        </div>
      </div>
      {quizResult && (
        <span style={{ fontSize: 10, fontWeight: 500, color: '#525252', background: '#F5F5F4',
          border: '1px solid #E7E5E4', padding: '2px 8px', borderRadius: 4,
          whiteSpace: 'nowrap', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
          <CheckCircle size={11} color="#A3A3A3" /> {quizResult.score} pts
        </span>
      )}
      <ChevronRight size={14} color="#D4D4D4" style={{ flexShrink: 0 }} />
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="accordion-title">{semData.label}</span>
          <span className="subject-badge">{semData.subjects.length} subjects</span>
        </div>
        {/* Chevron — near-black when open, gray when closed */}
        {open
          ? <ChevronUp size={16} color="#525252" />
          : <ChevronDown size={16} color="#A3A3A3" />
        }
      </div>

      {open && (
        <div style={{ padding: '4px 16px 16px', borderTop: '1px solid #E7E5E4' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#A3A3A3', letterSpacing: 0.6,
            textTransform: 'uppercase', margin: '14px 0 8px' }}>Theory</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {theory.map(s => (
              <SubjectRow key={s.id} subject={s} quizHistory={quizHistory} onClick={() => onSubjectClick(s)} />
            ))}
          </div>
          {labs.length > 0 && (
            <>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#A3A3A3', letterSpacing: 0.6,
                textTransform: 'uppercase', margin: '14px 0 8px' }}>Practicals / Labs</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
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

  // ── Level 1: Program cards ─────────────────────────────────────────────────
  if (!selectedProgram) return (
    <div className="page-content" style={{ maxWidth: 860 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: '#1A1A1A', letterSpacing: '-0.3px' }}>Curriculum</h1>
        <p style={{ fontSize: 12, color: '#A3A3A3', marginTop: 3 }}>
          Select your program to explore the semester-wise syllabus
        </p>
      </div>

      {/* Program cards — 2-col grid, flat white cards, no colored borders/shadows */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {PROGRAM_KEYS.map(progKey => {
          const p = programs[progKey]
          const allSubjects = Object.values(p.semesters).flatMap(s => s.subjects)
          const quizCount = allSubjects.filter(s => quizData[s.id]).length
          return (
            <button key={progKey} onClick={() => setSelectedProgram(progKey)} style={{
              padding: 24, borderRadius: 10, border: '1px solid #E7E5E4',
              background: '#FFFFFF', cursor: 'pointer', textAlign: 'left',
              transition: 'border-color 150ms, box-shadow 150ms',
              boxShadow: 'none',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#D4D4D4'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#E7E5E4'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Neutral icon square — no colored gradient, no emoji */}
              <div style={{
                width: 40, height: 40, borderRadius: 8, marginBottom: 16,
                background: '#F5F5F4', border: '1px solid #E7E5E4',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Layers size={18} color="#A3A3A3" />
              </div>

              {/* Program key label */}
              <div style={{ fontSize: 9, fontWeight: 600, color: '#A3A3A3', letterSpacing: 0.8,
                textTransform: 'uppercase', marginBottom: 6 }}>{progKey}</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#1A1A1A', marginBottom: 6, lineHeight: 1.3 }}>
                {p.fullName}
              </div>
              <div style={{ fontSize: 11, color: '#A3A3A3', lineHeight: 1.5, marginBottom: 16 }}>
                Semesters 3 & 4 · {allSubjects.length} subjects · {quizCount} quizzes
              </div>

              {/* Semester subject count chips — neutral gray */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                {Object.values(p.semesters).map(s => (
                  <span key={s.label} style={{
                    fontSize: 10, fontWeight: 500, padding: '3px 10px', borderRadius: 4,
                    background: '#F5F5F4', color: '#525252', border: '1px solid #E7E5E4',
                  }}>{s.subjects.length} subjects</span>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 12, fontWeight: 500, color: '#525252' }}>
                View Syllabus <ChevronRight size={13} />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )

  // ── Level 2: Subjects list ──────────────────────────────────────────────────
  const prog = programs[selectedProgram]
  return (
    <div className="page-content" style={{ maxWidth: 860 }}>
      {/* Back button — secondary text */}
      <button onClick={() => setSelectedProgram(null)} style={{
        display: 'flex', alignItems: 'center', gap: 6, background: 'none',
        border: 'none', color: '#A3A3A3', fontSize: 12, cursor: 'pointer',
        marginBottom: 18, fontWeight: 500, padding: 0,
        transition: 'color 150ms', fontFamily: 'inherit',
      }}
        onMouseEnter={e => e.currentTarget.style.color = '#1A1A1A'}
        onMouseLeave={e => e.currentTarget.style.color = '#A3A3A3'}
      >
        <ArrowLeft size={14} /> All Programs
      </button>

      {/* Program header — neutral icon, no gradient */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: '#F5F5F4', border: '1px solid #E7E5E4',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Layers size={20} color="#A3A3A3" />
        </div>
        <div>
          <div style={{ fontSize: 9, fontWeight: 600, color: '#A3A3A3', letterSpacing: 0.8,
            textTransform: 'uppercase' }}>{selectedProgram}</div>
          <h1 style={{ fontSize: 19, fontWeight: 600, color: '#1A1A1A', margin: '2px 0', letterSpacing: '-0.3px' }}>
            {prog.fullName}
          </h1>
          <div style={{ fontSize: 11, color: '#A3A3A3' }}>Click on any subject to explore</div>
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
