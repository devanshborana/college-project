import { useState, useEffect, useCallback, Component } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Clock, CheckCircle, XCircle, ArrowLeft, ArrowRight, Trophy, Award, RotateCcw, BookOpen, Loader, Users, Play, Hourglass, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useApp } from '../context/AppContext'
import { quizData as staticQuizData } from '../data/quizData'

const POINTS_PER_QUESTION = 10

class QuizErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error("QuizErrorBoundary caught an error", error, errorInfo); this.setState({ errorInfo }); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, background: '#fef2f2', color: '#dc2626', margin: 40, borderRadius: 12, border: '1px solid #fecaca' }}>
          <h2>Something went wrong in the Quiz Page.</h2>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: 20 }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

function QuizPageContent() {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const { user } = useApp()

  const [quiz, setQuiz] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loadingQuiz, setLoadingQuiz] = useState(true)
  const [participants, setParticipants] = useState([])
  const [myAnswers, setMyAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem(`quiz_answers_${subjectId}`)
      return saved ? JSON.parse(saved) : {}
    } catch { return {} }
  })
  const [myScore, setMyScore] = useState(0)

  // Fetch and sync quiz state
  useEffect(() => {
    let quizChannel = null
    let partChannel = null

    const initQuiz = async () => {
      setLoadingQuiz(true)
      if (!supabase) { setLoadingQuiz(false); return }

      // 1. Fetch Quiz
      const { data: quizDataDB } = await supabase
        .from('live_quizzes')
        .select('*')
        .eq('id', subjectId)
        .maybeSingle()

      if (quizDataDB) {
        setQuiz(quizDataDB)
        
        // 2. Fetch Questions
        const { data: questionsData } = await supabase
          .from('live_quiz_questions')
          .select('*')
          .eq('quiz_id', quizDataDB.id)
          .order('order_index', { ascending: true })
          
        setQuestions(questionsData || [])

        if (user?.dbId) {
          // 3. Join Participants Table (ignore if already joined via unique constraint)
          await supabase
            .from('live_quiz_participants')
            .insert({ quiz_id: quizDataDB.id, student_id: user.dbId })
            .select()
            .maybeSingle()
        }

        // 4. Fetch existing participants
        const { data: pData } = await supabase
          .from('live_quiz_participants')
          .select(`*, profiles(full_name)`)
          .eq('quiz_id', quizDataDB.id)
        setParticipants(pData || [])
        
        const myRecord = pData?.find(p => p.student_id === user?.dbId)
        if (myRecord) {
          setMyScore(myRecord.score || 0)
        }

        // 5. Subscribe to Quiz status updates
        quizChannel = supabase.channel(`student_quiz_${quizDataDB.id}`)
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'live_quizzes', filter: `id=eq.${quizDataDB.id}` }, (payload) => {
            setQuiz(payload.new)
          }).subscribe()

        // 6. Subscribe to Participants leaderboard updates
        partChannel = supabase.channel(`student_parts_${quizDataDB.id}`)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'live_quiz_participants', filter: `quiz_id=eq.${quizDataDB.id}` }, async (payload) => {
            if (payload.eventType === 'INSERT') {
              const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', payload.new.student_id).single()
              setParticipants(prev => [...prev, { ...payload.new, profiles: profile }])
            } else if (payload.eventType === 'UPDATE') {
              setParticipants(prev => prev.map(p => p.id === payload.new.id ? { ...p, ...payload.new } : p))
            }
          }).subscribe()

      } else {
        // Fallback for static asynchronous quizzes
        setQuiz(staticQuizData[subjectId] || null)
      }
      setLoadingQuiz(false)
    }

    initQuiz()

    return () => {
      if (quizChannel) supabase.removeChannel(quizChannel)
      if (partChannel) supabase.removeChannel(partChannel)
    }
  }, [subjectId, user])

  const handleAnswer = async (optIndex) => {
    if (!quiz || quiz.current_question_index === -1) return
    const qIndex = quiz.current_question_index
    const oldAnswer = myAnswers[qIndex]
    
    // If they clicked the exact same option again, do nothing
    if (oldAnswer === optIndex) return

    const newAnswers = { ...myAnswers, [qIndex]: optIndex }
    setMyAnswers(newAnswers)
    localStorage.setItem(`quiz_answers_${quiz.id}`, JSON.stringify(newAnswers))

    const q = questions[qIndex]
    let newScore = myScore

    // If they previously had a correct answer, deduct the points
    if (oldAnswer === q.correct_answer_index) {
      newScore -= POINTS_PER_QUESTION
    }

    // If the new answer is correct, add the points
    if (optIndex === q.correct_answer_index) {
      newScore += POINTS_PER_QUESTION
    }

    setMyScore(newScore)
    
    if (user?.dbId && newScore !== myScore) {
      await supabase.from('live_quiz_participants')
        .update({ score: newScore })
        .eq('quiz_id', quiz.id)
        .eq('student_id', user.dbId)
    }
  }

  if (loadingQuiz) {
    return (
      <div className="page-content" style={{ textAlign: 'center', padding: 60 }}>
        <Loader size={40} color="#6c47ff" style={{ margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#6b7280' }}>Loading session...</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="page-content" style={{ textAlign: 'center', padding: 60 }}>
        <BookOpen size={60} color="#c4b5fd" style={{ margin: '0 auto 16px' }} />
        <h2 style={{ color: '#1e1b4b' }}>Quiz Not Found</h2>
        <button onClick={() => navigate('/curriculum')} style={{ marginTop: 20, padding: '10px 24px', background: '#6c47ff', color: 'white', border: 'none', borderRadius: 50, fontWeight: 600, cursor: 'pointer' }}>
          ← Back to Curriculum
        </button>
      </div>
    )
  }

  // Determine state
  const isScheduled = quiz.status === 'Scheduled'
  const isWaitingRoom = quiz.status === 'WaitingRoom'
  const isActive = quiz.status === 'Active'
  const isCompleted = quiz.status === 'Completed'

  // WAITING ROOM PHASE
  if (isScheduled || isWaitingRoom) {
    const myRecord = participants.find(p => p.student_id === user?.dbId)
    const status = myRecord?.approval_status || 'joining'

    if (status === 'blocked') {
      return (
        <div className="page-content" style={{ maxWidth: 800 }}>
          <button onClick={() => navigate('/live-quiz')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#A3A3A3', fontSize: 13, cursor: 'pointer', marginBottom: 20, fontWeight: 500, fontFamily: 'inherit', transition: 'color 150ms' }} onMouseEnter={e => e.currentTarget.style.color = '#1A1A1A'} onMouseLeave={e => e.currentTarget.style.color = '#A3A3A3'}>
            <ArrowLeft size={16} /> Leave Waiting Room
          </button>
          <div className="card" style={{ padding: 40, textAlign: 'center', background: '#FAFAFA', border: '1px solid #E7E5E4' }}>
            <XCircle size={48} color="#525252" style={{ margin: '0 auto 16px' }} />
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1A1A1A', marginBottom: 8 }}>Access Permanently Denied</h1>
            <p style={{ fontSize: 14, color: '#525252' }}>The teacher has blocked you from joining this quiz.</p>
          </div>
        </div>
      )
    }

    if (status === 'denied') {
      return (
        <div className="page-content" style={{ maxWidth: 800 }}>
          <button onClick={() => navigate('/live-quiz')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#A3A3A3', fontSize: 13, cursor: 'pointer', marginBottom: 20, fontWeight: 500, fontFamily: 'inherit', transition: 'color 150ms' }} onMouseEnter={e => e.currentTarget.style.color = '#1A1A1A'} onMouseLeave={e => e.currentTarget.style.color = '#A3A3A3'}>
            <ArrowLeft size={16} /> Leave Waiting Room
          </button>
          <div className="card" style={{ padding: 40, textAlign: 'center', background: '#FAFAFA', border: '1px solid #E7E5E4' }}>
            <XCircle size={48} color="#525252" style={{ margin: '0 auto 16px' }} />
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1A1A1A', marginBottom: 8 }}>Access Denied</h1>
            <p style={{ fontSize: 14, color: '#525252', marginBottom: 24 }}>The teacher did not allow you to join. You have 1 attempt left.</p>
            <button onClick={async () => {
              await supabase.from('live_quiz_participants').update({ approval_status: 'pending' }).eq('id', myRecord.id)
            }} style={{ padding: '10px 20px', background: '#111111', color: 'white', border: 'none', borderRadius: 8, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 150ms' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.85'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              Request Access Again
            </button>
          </div>
        </div>
      )
    }

    if (status === 'pending' || status === 'joining') {
      return (
        <div className="page-content" style={{ maxWidth: 800 }}>
          <button onClick={() => navigate('/live-quiz')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#A3A3A3', fontSize: 13, cursor: 'pointer', marginBottom: 20, fontWeight: 500, fontFamily: 'inherit', transition: 'color 150ms' }} onMouseEnter={e => e.currentTarget.style.color = '#1A1A1A'} onMouseLeave={e => e.currentTarget.style.color = '#A3A3A3'}>
            <ArrowLeft size={16} /> Leave Waiting Room
          </button>
          <div className="card" style={{ padding: 40, textAlign: 'center', background: '#FAFAFA', border: '1px solid #E7E5E4' }}>
            <Hourglass size={48} color="#A3A3A3" style={{ margin: '0 auto 16px', animation: 'pulse 2s infinite' }} />
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1A1A1A', marginBottom: 8 }}>{quiz.title}</h1>
            <p style={{ fontSize: 14, color: '#525252' }}>
              Waiting for teacher approval...
            </p>
          </div>
          <style>{`@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }`}</style>
        </div>
      )
    }

    // Allowed State
    const allowedParticipants = participants.filter(p => p.approval_status === 'allowed')
    return (
      <div className="page-content" style={{ maxWidth: 800 }}>
        <button onClick={() => navigate('/live-quiz')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#A3A3A3', fontSize: 13, cursor: 'pointer', marginBottom: 20, fontWeight: 500, fontFamily: 'inherit', transition: 'color 150ms' }} onMouseEnter={e => e.currentTarget.style.color = '#1A1A1A'} onMouseLeave={e => e.currentTarget.style.color = '#A3A3A3'}>
          <ArrowLeft size={16} /> Leave Waiting Room
        </button>

        <div className="card" style={{ padding: 40, textAlign: 'center', background: '#FFFFFF', border: '1px solid #E7E5E4' }}>
          <Hourglass size={48} color="#A3A3A3" style={{ margin: '0 auto 16px', animation: 'pulse 2s infinite' }} />
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1A1A1A', marginBottom: 8 }}>{quiz.title}</h1>
          <p style={{ fontSize: 14, color: '#525252', marginBottom: 32 }}>
            {isScheduled ? "The teacher has not opened the room yet." : "Waiting for the teacher to start the quiz..."}
          </p>

          <div style={{ padding: 20, background: '#FAFAFA', borderRadius: 8, border: '1px solid #E7E5E4' }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, color: '#A3A3A3', marginBottom: 16 }}>
              {allowedParticipants.length} Students Joined
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {allowedParticipants.map(p => (
                <div key={p.id} style={{ padding: '4px 10px', background: p.student_id === user?.dbId ? '#111111' : '#FFFFFF', border: '1px solid #E7E5E4', color: p.student_id === user?.dbId ? '#FFFFFF' : '#525252', borderRadius: 6, fontSize: 12, fontWeight: 500 }}>
                  {p.student_id === user?.dbId ? 'You' : p.profiles?.full_name || 'Student'}
                </div>
              ))}
            </div>
          </div>
        </div>
        <style>{`@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }`}</style>
      </div>
    )
  }

  // ACTIVE QUIZ PHASE
  if (isActive) {
    const qIndex = quiz.current_question_index
    const q = questions[qIndex]
    const selected = myAnswers[qIndex]
    const hasAnswered = selected !== undefined

    return (
      <div className="page-content max-w-3xl mx-auto flex flex-col gap-6">
        
        {/* Main Question Area */}
        <div className="w-full">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontWeight: 600, color: '#1A1A1A', fontSize: 15 }}>{quiz.title}</div>
            <div style={{ padding: '4px 12px', background: '#F5F5F4', color: '#525252', borderRadius: 6, fontWeight: 500, fontSize: 12, border: '1px solid #E7E5E4' }}>
              {qIndex + 1} / {questions.length}
            </div>
          </div>

          {/* Progress bar — monochrome */}
          <div style={{ height: 3, background: '#E7E5E4', borderRadius: 99, marginBottom: 20, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${((qIndex + 1) / questions.length) * 100}%`, background: '#1A1A1A', borderRadius: 99, transition: 'width 0.4s ease' }} />
          </div>

          <div className="card" style={{ padding: 28, marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#A3A3A3', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12 }}>Question {qIndex + 1}</div>
            <div style={{ fontSize: 17, fontWeight: 500, color: '#1A1A1A', lineHeight: 1.6, marginBottom: 24 }}>
              {q?.question_text}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {q?.options?.map((opt, i) => {
                const isSelected = selected === i
                return (
                  <button key={i} onClick={() => handleAnswer(i)}
                    style={{
                      padding: '14px 18px', borderRadius: 8, border: `2px solid ${isSelected ? '#1A1A1A' : '#E7E5E4'}`,
                      background: isSelected ? '#1A1A1A' : '#FAFAFA', cursor: 'pointer', textAlign: 'left',
                      fontSize: 14, fontWeight: isSelected ? 500 : 400, color: isSelected ? 'white' : '#525252',
                      transition: 'all 150ms', display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'inherit'
                    }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                      background: isSelected ? 'rgba(255,255,255,0.15)' : '#E7E5E4', color: isSelected ? 'white' : '#525252',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 11 }}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // RESULT PHASE (Completed)
  if (isCompleted) {
    const sortedParts = [...participants.filter(p => p.approval_status === 'allowed')].sort((a,b) => b.score - a.score)
    const myRank = sortedParts.findIndex(p => p.student_id === user?.dbId) + 1

    return (
      <div className="page-content" style={{ maxWidth: 780 }}>
        {/* Flat near-black hero — identical to LeaderboardPage hero */}
        <div className="leaderboard-header" style={{ textAlign: 'center', padding: '32px 28px' }}>
          <Award size={28} color="rgba(255,255,255,0.5)" style={{ margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: 24, fontWeight: 600, color: 'white', marginBottom: 6, letterSpacing: '-0.3px' }}>Quiz Completed</h2>
          <div style={{ fontSize: 52, fontWeight: 700, color: 'white', margin: '12px 0 4px', letterSpacing: '-2px' }}>
            {myScore} <span style={{ fontSize: 20, fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>pts</span>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
            You placed <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>#{myRank}</span> out of {sortedParts.length} students
          </div>
        </div>

        <div className="card" style={{ padding: 20, marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', marginBottom: 14 }}>Final Leaderboard</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {sortedParts.map((student, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', padding: '10px 14px',
                background: student.student_id === user?.dbId ? '#F5F5F4' : '#FAFAFA',
                border: `1px solid ${student.student_id === user?.dbId ? '#D4D4D4' : '#E7E5E4'}`,
                borderLeft: student.student_id === user?.dbId ? '2px solid #111111' : '1px solid #E7E5E4',
                borderRadius: 8, gap: 12
              }}>
                {/* Rank badge — same component as main leaderboard */}
                <div className={`rank-badge ${i === 0 ? 'rank-gold' : i === 1 ? 'rank-silver' : i === 2 ? 'rank-bronze' : 'rank-default'}`}>
                  #{i + 1}
                </div>
                <div style={{ flex: 1, fontWeight: student.student_id === user?.dbId ? 600 : 400, color: '#1A1A1A', fontSize: 13 }}>
                  {student.profiles?.full_name || 'Student'}
                  {student.student_id === user?.dbId && (
                    <span style={{ fontSize: 9, background: '#F5F5F4', color: '#525252', padding: '1px 5px', borderRadius: 3, marginLeft: 7, fontWeight: 500, border: '1px solid #E7E5E4', textTransform: 'uppercase', letterSpacing: 0.3 }}>You</span>
                  )}
                </div>
                <div style={{ fontWeight: 600, color: '#1A1A1A', fontSize: 14 }}>
                  {student.score} <span style={{ fontSize: 11, color: '#A3A3A3', fontWeight: 400 }}>pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <button onClick={() => navigate('/curriculum')} style={{
            display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 20px',
            background: 'transparent', border: '1px solid #E7E5E4', color: '#525252',
            borderRadius: 8, fontWeight: 500, fontSize: 13, cursor: 'pointer', transition: 'background 150ms', fontFamily: 'inherit'
          }} onMouseEnter={e => e.currentTarget.style.background = '#F5F5F4'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <ArrowLeft size={14} /> Return to Curriculum
          </button>
        </div>
      </div>
    )
  }

  return null
}

export default function QuizPage() {
  const [isObscured, setIsObscured] = useState(false)

  // Anti-Cheat: Prevent Screenshots & Copying during Quiz
  useEffect(() => {
    const handleBlur = () => setIsObscured(true)
    const handleFocus = () => setIsObscured(false)

    const handleContextMenu = (e) => {
      e.preventDefault()
      alert("Right-click is disabled during the quiz.")
    }

    const handleKeyDown = async (e) => {
      if (e.key === 'PrintScreen' || (e.metaKey && e.shiftKey && (e.key === 's' || e.key === 'S' || e.key === '3' || e.key === '4'))) {
        e.preventDefault()
        try {
          await navigator.clipboard.writeText("Nice try! Screenshots are disabled in this quiz.")
        } catch(err) {}
        alert("Screenshots are disabled in the Quiz to ensure academic integrity.")
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault()
        alert("Copying is disabled.")
      }
    }

    window.addEventListener('blur', handleBlur)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('contextmenu', handleContextMenu)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('contextmenu', handleContextMenu)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <>
      {isObscured && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100000, background: 'rgba(0,0,0,0.9)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10, backdropFilter: 'blur(10px)' }}>
          <AlertCircle size={48} color="#ef4444" />
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>Quiz Screen Obscured</h2>
          <p style={{ color: '#a1a1aa' }}>Please focus on the window to continue the quiz.</p>
        </div>
      )}
      <QuizErrorBoundary>
        <QuizPageContent />
      </QuizErrorBoundary>
    </>
  )
}
