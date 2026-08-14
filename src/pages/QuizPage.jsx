import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Clock, CheckCircle, XCircle, ArrowLeft, ArrowRight, Trophy, RotateCcw, BookOpen, Loader } from 'lucide-react'
import { quizData as staticQuizData } from '../data/quizData'
import { supabase } from '../lib/supabase'
import { useApp } from '../context/AppContext'

const QUIZ_DURATION = 600 // 10 minutes in seconds
const POINTS_PER_QUESTION = 10

function formatTime(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function QuizPage() {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const { saveQuizResult, quizHistory } = useApp()

  // Try to load questions from Supabase; fall back to static data
  const [quiz, setQuiz] = useState(null)
  const [loadingQuiz, setLoadingQuiz] = useState(true)

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoadingQuiz(true)

      const { data: subjectData } = await supabase
        .from('subjects')
        .select('id, title, icon')
        .eq('id', subjectId)
        .single()

      const { data: questionsData } = await supabase
        .from('questions')
        .select('question_text, options, correct_answer_index')
        .eq('subject_id', subjectId)

      if (subjectData && questionsData && questionsData.length > 0) {
        // Loaded from Supabase
        setQuiz({
          title: subjectData.title,
          icon: subjectData.icon,
          questions: questionsData.map(q => ({
            q: q.question_text,
            opts: q.options,
            ans: q.correct_answer_index
          }))
        })
      } else {
        // Fall back to static data
        setQuiz(staticQuizData[subjectId] || null)
      }

      setLoadingQuiz(false)
    }

    fetchQuiz()
  }, [subjectId])

  const [phase, setPhase] = useState('intro') // 'intro' | 'quiz' | 'result'
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({}) // { questionIndex: selectedOptionIndex }
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION)
  const [startTime, setStartTime] = useState(null)
  const [timeTaken, setTimeTaken] = useState(0)
  const timerRef = useRef(null)

  const prevResult = quizHistory[subjectId]

  // Cleanup timer on unmount
  useEffect(() => () => clearInterval(timerRef.current), [])

  const startQuiz = () => {
    setPhase('quiz')
    setCurrent(0)
    setAnswers({})
    setTimeLeft(QUIZ_DURATION)
    setStartTime(Date.now())
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { submitQuiz(); return 0 }
        return t - 1
      })
    }, 1000)
  }

  const submitQuiz = useCallback(() => {
    clearInterval(timerRef.current)
    const elapsed = Math.round((Date.now() - (startTime || Date.now())) / 1000)
    setTimeTaken(elapsed)
    setPhase('result')
  }, [startTime])

  useEffect(() => {
    if (phase === 'quiz' && timeLeft === 0) submitQuiz()
  }, [phase, timeLeft, submitQuiz])

  if (loadingQuiz) {
    return (
      <div className="page-content" style={{ textAlign: 'center', padding: 60 }}>
        <Loader size={40} color="#6c47ff" style={{ margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#6b7280' }}>Loading quiz questions...</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="page-content" style={{ textAlign: 'center', padding: 60 }}>
        <BookOpen size={60} color="#c4b5fd" style={{ margin: '0 auto 16px' }} />
        <h2 style={{ color: '#1e1b4b' }}>Quiz Not Found</h2>
        <p style={{ color: '#6b7280' }}>No quiz available for this subject yet.</p>
        <button onClick={() => navigate('/curriculum')} style={{
          marginTop: 20, padding: '10px 24px', background: '#6c47ff', color: 'white',
          border: 'none', borderRadius: 50, fontWeight: 600, cursor: 'pointer' }}>
          ← Back to Curriculum
        </button>
      </div>
    )
  }

  const { questions, title, icon } = quiz
  const totalQ = questions.length

  // ── Score calculation ──
  const correctCount = questions.reduce((cnt, q, i) => cnt + (answers[i] === q.ans ? 1 : 0), 0)
  const score = correctCount * POINTS_PER_QUESTION

  // Save result when entering result phase
  useEffect(() => {
    if (phase === 'result') {
      saveQuizResult(subjectId, score, totalQ, title)
    }
  }, [phase]) // eslint-disable-line

  const pct = Math.round((correctCount / totalQ) * 100)
  const grade = pct >= 90 ? { g: 'A+', color: '#059669' }
    : pct >= 75 ? { g: 'A', color: '#6c47ff' }
    : pct >= 60 ? { g: 'B', color: '#f59e0b' }
    : pct >= 40 ? { g: 'C', color: '#f97316' }
    : { g: 'F', color: '#dc2626' }

  const timerColor = timeLeft <= 60 ? '#dc2626' : timeLeft <= 120 ? '#f59e0b' : '#6c47ff'

  // ── INTRO PHASE ──────────────────────────────────────────────────────────
  if (phase === 'intro') return (
    <div className="page-content" style={{ maxWidth: 700 }}>
      <button onClick={() => navigate('/curriculum')} style={{
        display: 'flex', alignItems: 'center', gap: 6, background: 'none',
        border: 'none', color: '#6b7280', fontSize: 13, cursor: 'pointer',
        marginBottom: 20, fontWeight: 500 }}>
        <ArrowLeft size={16} /> Back to Curriculum
      </button>

      <div className="card" style={{ padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>{icon}</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1e1b4b', marginBottom: 8 }}>{title}</h1>
        <p style={{ color: '#6b7280', marginBottom: 28, fontSize: 14 }}>Test your knowledge with {totalQ} multiple choice questions</p>

        {/* Quiz info cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'Questions', value: totalQ, icon: '📝' },
            { label: 'Time Limit', value: '10 min', icon: '⏱' },
            { label: 'Per Question', value: `${POINTS_PER_QUESTION} pts`, icon: '⭐' },
          ].map(i => (
            <div key={i.label} style={{
              padding: 16, background: '#f5f3ff', borderRadius: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{i.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#6c47ff' }}>{i.value}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{i.label}</div>
            </div>
          ))}
        </div>

        {/* Previous result */}
        {prevResult && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 12,
            padding: '12px 16px', marginBottom: 24, display: 'flex', alignItems: 'center',
            gap: 10, justifyContent: 'center', fontSize: 13 }}>
            <CheckCircle size={16} color="#059669" />
            <span style={{ color: '#065f46', fontWeight: 600 }}>
              Previous best: {prevResult.score}/{prevResult.total * POINTS_PER_QUESTION} pts
            </span>
          </div>
        )}

        <button onClick={startQuiz} style={{
          padding: '14px 40px', background: 'linear-gradient(135deg, #6c47ff, #a855f7)',
          color: 'white', border: 'none', borderRadius: 50, fontSize: 16, fontWeight: 700,
          cursor: 'pointer', boxShadow: '0 6px 20px rgba(108,71,255,0.4)',
          transition: 'all 0.2s' }}>
          🚀 Start Quiz
        </button>
      </div>
    </div>
  )

  // ── QUIZ PHASE ───────────────────────────────────────────────────────────
  if (phase === 'quiz') {
    const q = questions[current]
    const selected = answers[current]
    const progress = ((current + 1) / totalQ) * 100

    return (
      <div className="page-content" style={{ maxWidth: 780 }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>{icon}</span>
            <span style={{ fontWeight: 700, color: '#1e1b4b', fontSize: 15 }}>{title}</span>
          </div>
          {/* Timer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px',
            background: `${timerColor}15`, borderRadius: 50, border: `2px solid ${timerColor}` }}>
            <Clock size={15} color={timerColor} />
            <span style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 800, color: timerColor }}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 6, background: '#f0ecff', borderRadius: 3, marginBottom: 6, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #6c47ff, #a855f7)',
            borderRadius: 3, transition: 'width 0.4s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#9ca3af', marginBottom: 24 }}>
          <span>Question {current + 1} of {totalQ}</span>
          <span>{Object.keys(answers).length} answered</span>
        </div>

        {/* Question card */}
        <div className="card" style={{ padding: 28, marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#6c47ff', letterSpacing: 0.5,
            textTransform: 'uppercase', marginBottom: 12 }}>Question {current + 1}</div>
          <div style={{ fontSize: 17, fontWeight: 600, color: '#1e1b4b', lineHeight: 1.6, marginBottom: 24 }}>
            {q.q}
          </div>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {q.opts.map((opt, i) => {
              const isSelected = selected === i
              return (
                <button key={i} onClick={() => setAnswers({ ...answers, [current]: i })}
                  style={{
                    padding: '14px 18px', borderRadius: 12, border: `2px solid ${isSelected ? '#6c47ff' : '#e8e4ff'}`,
                    background: isSelected ? '#f5f3ff' : 'white', cursor: 'pointer', textAlign: 'left',
                    fontSize: 14, fontWeight: isSelected ? 600 : 400, color: isSelected ? '#6c47ff' : '#374151',
                    transition: 'all 0.18s', display: 'flex', alignItems: 'center', gap: 12,
                  }}
                  onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.borderColor = '#c4b5fd'; e.currentTarget.style.background = '#faf9ff' } }}
                  onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = '#e8e4ff'; e.currentTarget.style.background = 'white' } }}
                >
                  <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: isSelected ? '#6c47ff' : '#f5f3ff',
                    color: isSelected ? 'white' : '#6b7280',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 12 }}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  {opt}
                </button>
              )
            })}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px',
              borderRadius: 50, border: '1.5px solid #e8e4ff', background: 'white', cursor: current === 0 ? 'not-allowed' : 'pointer',
              opacity: current === 0 ? 0.4 : 1, fontWeight: 600, fontSize: 13, color: '#374151', transition: 'all 0.2s' }}>
            <ArrowLeft size={15} /> Previous
          </button>

          {/* Question dots */}
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 300 }}>
            {questions.map((_, i) => (
              <div key={i} onClick={() => setCurrent(i)} style={{
                width: 24, height: 24, borderRadius: '50%', cursor: 'pointer', fontSize: 10,
                fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: i === current ? '#6c47ff' : answers[i] !== undefined ? '#c4b5fd' : '#f0ecff',
                color: i === current || answers[i] !== undefined ? 'white' : '#9ca3af',
                transition: 'all 0.15s', border: i === current ? '2px solid #4c2fff' : '2px solid transparent',
              }}>{i + 1}</div>
            ))}
          </div>

          {current < totalQ - 1 ? (
            <button onClick={() => setCurrent(current + 1)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px',
                borderRadius: 50, border: 'none', background: '#6c47ff', color: 'white',
                cursor: 'pointer', fontWeight: 700, fontSize: 13,
                boxShadow: '0 3px 10px rgba(108,71,255,0.35)', transition: 'all 0.2s' }}>
              Next <ArrowRight size={15} />
            </button>
          ) : (
            <button onClick={submitQuiz}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 22px',
                borderRadius: 50, border: 'none',
                background: 'linear-gradient(135deg, #22c55e, #059669)', color: 'white',
                cursor: 'pointer', fontWeight: 700, fontSize: 13,
                boxShadow: '0 3px 10px rgba(34,197,94,0.4)', transition: 'all 0.2s' }}>
              Submit Quiz ✓
            </button>
          )}
        </div>
      </div>
    )
  }

  // ── RESULT PHASE ─────────────────────────────────────────────────────────
  return (
    <div className="page-content" style={{ maxWidth: 780 }}>
      {/* Score hero */}
      <div style={{
        background: 'linear-gradient(135deg, #6c47ff 0%, #a855f7 100%)',
        borderRadius: 20, padding: 36, color: 'white', textAlign: 'center',
        marginBottom: 24, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ fontSize: 56, marginBottom: 8 }}>{grade.g === 'F' ? '😔' : grade.g === 'A+' ? '🏆' : '🎯'}</div>
        <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 4 }}>{title} Quiz</h2>
        <div style={{ fontSize: 54, fontWeight: 900, margin: '12px 0' }}>{score}</div>
        <div style={{ fontSize: 14, opacity: 0.85 }}>out of {totalQ * POINTS_PER_QUESTION} points</div>

        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
          {[
            { label: 'Correct', value: `${correctCount}/${totalQ}` },
            { label: 'Accuracy', value: `${pct}%` },
            { label: 'Time Taken', value: formatTime(timeTaken) },
            { label: 'Grade', value: grade.g },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12,
              padding: '10px 20px', backdropFilter: 'blur(10px)' }}>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{s.value}</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Points earned banner */}
        <div style={{ marginTop: 20, background: 'rgba(255,255,255,0.2)', borderRadius: 12,
          padding: '10px 20px', display: 'inline-block', backdropFilter: 'blur(10px)' }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>
            ⚡ +{score} points added to your Leaderboard score!
          </span>
        </div>
      </div>

      {/* Per-question breakdown */}
      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e1b4b', marginBottom: 16 }}>
          📋 Question Review
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {questions.map((q, i) => {
            const userAns = answers[i]
            const isCorrect = userAns === q.ans
            return (
              <div key={i} style={{
                padding: 16, borderRadius: 12,
                background: isCorrect ? '#f0fdf4' : '#fef2f2',
                border: `1.5px solid ${isCorrect ? '#bbf7d0' : '#fecaca'}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                  {isCorrect ? <CheckCircle size={18} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} />
                              : <XCircle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />}
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1e1b4b', lineHeight: 1.5 }}>
                    Q{i + 1}: {q.q}
                  </span>
                </div>
                <div style={{ fontSize: 12, marginLeft: 28 }}>
                  {userAns !== undefined ? (
                    <span style={{ color: isCorrect ? '#059669' : '#dc2626', fontWeight: 600 }}>
                      Your answer: {q.opts[userAns]}
                    </span>
                  ) : (
                    <span style={{ color: '#9ca3af', fontWeight: 500 }}>Not answered</span>
                  )}
                  {!isCorrect && (
                    <div style={{ color: '#059669', fontWeight: 600, marginTop: 4 }}>
                      ✓ Correct: {q.opts[q.ans]}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={startQuiz} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px',
          background: 'white', border: '1.5px solid #6c47ff', color: '#6c47ff',
          borderRadius: 50, fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' }}>
          <RotateCcw size={15} /> Retry Quiz
        </button>
        <button onClick={() => navigate('/leaderboard')} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px',
          background: 'linear-gradient(135deg, #6c47ff, #a855f7)', color: 'white',
          border: 'none', borderRadius: 50, fontWeight: 700, fontSize: 14, cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(108,71,255,0.4)', transition: 'all 0.2s' }}>
          <Trophy size={15} /> View Leaderboard
        </button>
        <button onClick={() => navigate('/curriculum')} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px',
          background: 'white', border: '1.5px solid #e8e4ff', color: '#6b7280',
          borderRadius: 50, fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' }}>
          <BookOpen size={15} /> Back to Curriculum
        </button>
      </div>
    </div>
  )
}
