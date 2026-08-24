import React, { useState, useEffect, useCallback, Component } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ArrowLeft, Play, ArrowRight, Flag, Users, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useApp } from '../context/AppContext'

class HostErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error("HostErrorBoundary caught an error", error, errorInfo); this.setState({ errorInfo }); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, background: '#FAFAFA', color: '#1A1A1A', margin: 40, borderRadius: 12, border: '1px solid #E7E5E4' }}>
          <h2>Something went wrong in the Host Dashboard.</h2>
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

export default function TeacherHostQuizPage() {
  return (
    <HostErrorBoundary>
      <TeacherHostQuizPageContent />
    </HostErrorBoundary>
  )
}

function TeacherHostQuizPageContent() {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const { user } = useApp()

  const [quiz, setQuiz] = useState(null)
  const [questions, setQuestions] = useState([])
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch initial data
  useEffect(() => {
    if (!user || user.role !== 'teacher') {
      navigate('/')
      return
    }

    const loadData = async () => {
      setLoading(true)
      // Load quiz
      const { data: qData } = await supabase
        .from('live_quizzes')
        .select('*')
        .eq('id', quizId)
        .single()
      
      if (qData) {
        setQuiz(qData)
        // Load questions
        const { data: questionsData } = await supabase
          .from('live_quiz_questions')
          .select('*')
          .eq('quiz_id', quizId)
          .order('id', { ascending: true })
        setQuestions(questionsData || [])
        
        // Load existing participants
        const { data: partData } = await supabase
          .from('live_quiz_participants')
          .select(`*, profiles(full_name)`)
          .eq('quiz_id', quizId)
        
        setParticipants(partData || [])
      }
      setLoading(false)
    }
    loadData()
  }, [quizId, user, navigate])

  // Real-time subscription for participants joining/updating
  useEffect(() => {
    if (!quizId) return
    
    const channel = supabase.channel(`quiz_host_${quizId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'live_quiz_participants',
        filter: `quiz_id=eq.${quizId}` 
      }, async (payload) => {
        // Fetch the user's name when they join
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', payload.new.student_id)
          .single()

        setParticipants(prev => {
          const exists = prev.find(p => p.id === payload.new.id)
          if (exists) {
            return prev.map(p => p.id === payload.new.id ? { ...p, ...payload.new } : p)
          } else {
            return [...prev, { ...payload.new, profiles: profile }]
          }
        })
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [quizId])

  const updateQuizState = async (status, index) => {
    const { data } = await supabase
      .from('live_quizzes')
      .update({ status, current_question_index: index })
      .eq('id', quizId)
      .select()
      .single()
    if (data) setQuiz(data)
  }

  const handleStartWaitingRoom = () => updateQuizState('WaitingRoom', -1)
  const handleStartQuiz = () => updateQuizState('Active', 0)
  const handleNextQuestion = () => {
    if (quiz.current_question_index < questions.length - 1) {
      updateQuizState('Active', quiz.current_question_index + 1)
    } else {
      updateQuizState('Completed', quiz.current_question_index)
    }
  }
  const handleEndQuiz = () => updateQuizState('Completed', quiz.current_question_index)

  const handleApprove = async (participantId) => {
    const { error } = await supabase.from('live_quiz_participants').update({ approval_status: 'allowed' }).eq('id', participantId)
    if (error) alert('Failed to approve: ' + error.message)
  }

  const handleDeny = async (participant) => {
    const newCount = (participant.denial_count || 0) + 1
    const newStatus = newCount >= 2 ? 'blocked' : 'denied'
    const { error } = await supabase.from('live_quiz_participants')
      .update({ approval_status: newStatus, denial_count: newCount })
      .eq('id', participant.id)
    if (error) alert('Failed to deny: ' + error.message)
  }

  if (loading) return <div className="page-content" style={{ textAlign: 'center', padding: 60, color: '#A3A3A3' }}>Loading Host Dashboard...</div>
  if (!quiz) return <div className="page-content" style={{ color: '#1A1A1A' }}>Quiz not found.</div>

  const isScheduled = quiz.status === 'Scheduled'
  const isWaitingRoom = quiz.status === 'WaitingRoom'
  const isActive = quiz.status === 'Active'
  const isCompleted = quiz.status === 'Completed'

  return (
    <div className="page-content" style={{ maxWidth: 900 }}>
      <button onClick={() => navigate('/teacher')} style={{ background: 'none', border: 'none', color: '#A3A3A3', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', marginBottom: 20, fontFamily: 'inherit', fontWeight: 500, transition: 'color 150ms' }} onMouseEnter={e => e.currentTarget.style.color = '#1A1A1A'} onMouseLeave={e => e.currentTarget.style.color = '#A3A3A3'}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      {/* Header Card — Monochrome */}
      <div style={{ padding: '24px 32px', background: '#FFFFFF', borderRadius: 12, border: '1px solid #E7E5E4', marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1A1A1A', marginBottom: 8, letterSpacing: '-0.3px' }}>{quiz.title}</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 13, fontWeight: 500, color: '#525252' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={16} color="#A3A3A3" /> {new Date(quiz.scheduled_for).toLocaleString()}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Users size={16} color="#A3A3A3" /> {participants.length} Students</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {isScheduled && (
              <button onClick={handleStartWaitingRoom} style={{ padding: '10px 20px', background: '#111111', color: 'white', fontWeight: 600, borderRadius: 8, border: 'none', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 150ms' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.85'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                <Users size={16} /> Open Waiting Room
              </button>
            )}
            {isWaitingRoom && (
              <button onClick={handleStartQuiz} style={{ padding: '10px 20px', background: '#111111', color: 'white', fontWeight: 600, borderRadius: 8, border: 'none', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 150ms' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.85'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                <Play size={16} fill="white" /> Start Quiz Now
              </button>
            )}
            {isActive && (
              <>
                <button onClick={handleNextQuestion} style={{ padding: '10px 20px', background: '#111111', color: 'white', fontWeight: 600, borderRadius: 8, border: 'none', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 150ms' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.85'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                  {quiz.current_question_index < questions.length - 1 ? (
                    <><ArrowRight size={16} /> Next Question</>
                  ) : (
                    <><Flag size={16} /> Finish Quiz</>
                  )}
                </button>
                <button onClick={handleEndQuiz} style={{ padding: '10px 20px', background: '#FAFAFA', color: '#1A1A1A', border: '1px solid #E7E5E4', fontWeight: 600, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 150ms' }} onMouseEnter={e => e.currentTarget.style.background = '#F5F5F4'} onMouseLeave={e => e.currentTarget.style.background = '#FAFAFA'}>
                  End Early
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, '@media(min-width: 1024px)': { flexDirection: 'row' } }} className="lg:flex-row">
        {/* Left Col: Current Question */}
        <div style={{ flex: '1 1 0%', minWidth: 0 }}>
          <div className="card" style={{ padding: 32, height: '100%', background: '#FFFFFF', border: '1px solid #E7E5E4', borderRadius: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A1A1A', marginBottom: 24 }}>Live Broadcast</h3>
            
            {isScheduled || isWaitingRoom ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <Users size={40} color="#D4D4D4" style={{ margin: '0 auto 16px' }} />
                <div style={{ fontSize: 16, fontWeight: 600, color: '#1A1A1A' }}>Waiting for you to start the quiz...</div>
                <div style={{ fontSize: 13, marginTop: 8, color: '#A3A3A3' }}>Students are currently seeing the Waiting Room screen.</div>
              </div>
            ) : isCompleted ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <Flag size={40} color="#1A1A1A" style={{ margin: '0 auto 16px' }} />
                <div style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A' }}>Quiz Completed!</div>
                <div style={{ fontSize: 13, marginTop: 8, color: '#A3A3A3' }}>Students are now seeing the final leaderboard.</div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#A3A3A3', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>
                  Question {quiz.current_question_index + 1} of {questions.length}
                </div>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#1A1A1A', marginBottom: 24, lineHeight: 1.5 }}>
                  {questions[quiz.current_question_index]?.question_text}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                  {questions[quiz.current_question_index]?.options.map((opt, i) => {
                    const isCorrect = questions[quiz.current_question_index].correct_answer_index === i;
                    return (
                      <div key={i} style={{ 
                        padding: '16px', borderRadius: 8, 
                        background: isCorrect ? '#F5F5F4' : '#FAFAFA',
                        border: `1px solid ${isCorrect ? '#111111' : '#E7E5E4'}`,
                        fontSize: 14, color: '#1A1A1A', display: 'flex', alignItems: 'center', gap: 12
                      }}>
                        <div style={{ 
                          width: 24, height: 24, borderRadius: '50%', 
                          background: isCorrect ? '#111111' : '#E7E5E4', 
                          color: isCorrect ? '#FFFFFF' : '#525252', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', 
                          fontSize: 11, fontWeight: 600, flexShrink: 0 
                        }}>
                          {String.fromCharCode(65 + i)}
                        </div>
                        {opt}
                        {isCorrect && <CheckCircle size={14} color="#111111" style={{ marginLeft: 'auto' }} />}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Leaderboard & Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', maxWidth: '340px' }} className="lg:w-1/3">
          
          {/* Pending Requests */}
          {(isScheduled || isWaitingRoom) && participants.some(p => p.approval_status === 'pending') && (
            <div className="card" style={{ padding: 24, background: '#FFFFFF', border: '1px solid #E7E5E4', borderRadius: 12 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Pending Requests</span>
                <span style={{ background: '#F5F5F4', color: '#525252', padding: '2px 8px', borderRadius: 6, fontSize: 11, border: '1px solid #E7E5E4' }}>
                  {participants.filter(p => p.approval_status === 'pending').length}
                </span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
                {participants.filter(p => p.approval_status === 'pending').map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#FAFAFA', borderRadius: 8, border: '1px solid #E7E5E4' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#1A1A1A' }}>{p.profiles?.full_name || 'Student'}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => handleApprove(p.id)} style={{ background: '#111111', color: 'white', border: 'none', width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'opacity 150ms' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.8'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                        <CheckCircle size={14} />
                      </button>
                      <button onClick={() => handleDeny(p)} style={{ background: '#FAFAFA', color: '#525252', border: '1px solid #E7E5E4', width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 150ms' }} onMouseEnter={e => e.currentTarget.style.background = '#F5F5F4'} onMouseLeave={e => e.currentTarget.style.background = '#FAFAFA'}>
                        <XCircle size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Allowed Participants */}
          <div className="card" style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column', background: '#FFFFFF', border: '1px solid #E7E5E4', borderRadius: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Participants</span>
              <span style={{ background: '#F5F5F4', color: '#525252', padding: '2px 8px', borderRadius: 6, fontSize: 11, border: '1px solid #E7E5E4' }}>
                {participants.filter(p => p.approval_status === 'allowed').length}
              </span>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', flex: 1 }}>
              {participants.filter(p => p.approval_status === 'allowed').length === 0 ? (
                <div style={{ color: '#A3A3A3', fontSize: 12, textAlign: 'center', padding: '20px 0' }}>No allowed students yet.</div>
              ) : (
                [...participants.filter(p => p.approval_status === 'allowed')]
                  .sort((a,b) => isCompleted ? b.score - a.score : (a.profiles?.full_name || '').localeCompare(b.profiles?.full_name || ''))
                  .map((p) => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#FAFAFA', borderRadius: 8, border: '1px solid #E7E5E4' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#F5F5F4', color: '#525252', border: '1px solid #E7E5E4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600 }}>
                        {p.profiles?.full_name?.charAt(0) || '?'}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#1A1A1A' }}>{p.profiles?.full_name || 'Student'}</span>
                    </div>
                    {isCompleted && (
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#111111' }}>{p.score} pts</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
