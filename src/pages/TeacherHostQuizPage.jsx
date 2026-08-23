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
        <div style={{ padding: 40, background: '#fef2f2', color: '#dc2626', margin: 40, borderRadius: 12, border: '1px solid #fecaca' }}>
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

  if (loading) return <div className="page-content" style={{ textAlign: 'center', padding: 60 }}>Loading Host Dashboard...</div>
  if (!quiz) return <div className="page-content">Quiz not found.</div>

  const isScheduled = quiz.status === 'Scheduled'
  const isWaitingRoom = quiz.status === 'WaitingRoom'
  const isActive = quiz.status === 'Active'
  const isCompleted = quiz.status === 'Completed'

  return (
    <div className="page-content" style={{ maxWidth: 900 }}>
      <button onClick={() => navigate('/teacher')} style={{ background: 'none', border: 'none', color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', marginBottom: 20 }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="p-6 md:p-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-lg shadow-indigo-500/20">
        <div className="text-white">
          <h1 className="text-2xl font-extrabold mb-2">{quiz.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm font-medium opacity-90">
            <span className="flex items-center gap-1.5"><Clock size={16} /> {new Date(quiz.scheduled_for).toLocaleString()}</span>
            <span className="flex items-center gap-1.5"><Users size={16} /> {participants.length} Students</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {isScheduled && (
            <button onClick={handleStartWaitingRoom} className="flex-1 md:flex-none px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors">
              <Users size={18} /> Open Waiting Room
            </button>
          )}
          {isWaitingRoom && (
            <button onClick={handleStartQuiz} className="flex-1 md:flex-none px-6 py-3 bg-green-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-green-600 transition-colors">
              <Play size={18} fill="white" /> Start Quiz Now
            </button>
          )}
          {isActive && (
            <>
              <button onClick={handleNextQuestion} className="flex-1 md:flex-none px-6 py-3 bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-400 transition-colors">
                {quiz.current_question_index < questions.length - 1 ? (
                  <><ArrowRight size={18} /> Next Question</>
                ) : (
                  <><Flag size={18} /> Finish Quiz</>
                )}
              </button>
              <button onClick={handleEndQuiz} className="flex-1 md:flex-none px-6 py-3 bg-white/10 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-white/20 transition-colors">
                End Early
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Col: Current Question */}
        <div className="flex-1 w-full lg:w-2/3">
          <div className="card" style={{ padding: 24, height: '100%' }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1e1b4b', marginBottom: 20 }}>Live Broadcast</h3>
            
            {isScheduled || isWaitingRoom ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
                <Users size={48} style={{ opacity: 0.3, margin: '0 auto 16px' }} />
                <div style={{ fontSize: 16, fontWeight: 600, color: '#4b5563' }}>Waiting for you to start the quiz...</div>
                <div style={{ fontSize: 14, marginTop: 8 }}>Students are currently seeing the Waiting Room screen.</div>
              </div>
            ) : isCompleted ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#059669' }}>
                <Flag size={48} style={{ margin: '0 auto 16px' }} />
                <div style={{ fontSize: 20, fontWeight: 800 }}>Quiz Completed!</div>
                <div style={{ fontSize: 14, marginTop: 8, color: '#4b5563' }}>Students are now seeing the final leaderboard.</div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#6c47ff', textTransform: 'uppercase', marginBottom: 8 }}>
                  Question {quiz.current_question_index + 1} of {questions.length}
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#1e1b4b', marginBottom: 24, lineHeight: 1.5 }}>
                  {questions[quiz.current_question_index]?.question_text}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {questions[quiz.current_question_index]?.options.map((opt, i) => (
                    <div key={i} style={{ 
                      padding: '12px 16px', borderRadius: 8, 
                      background: questions[quiz.current_question_index].correct_answer_index === i ? '#ecfdf5' : '#f9fafb',
                      border: `2px solid ${questions[quiz.current_question_index].correct_answer_index === i ? '#10b981' : '#e5e7eb'}`,
                      fontSize: 14, color: '#374151', display: 'flex', alignItems: 'center', gap: 10
                    }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: questions[quiz.current_question_index].correct_answer_index === i ? '#10b981' : '#e5e7eb', color: questions[quiz.current_question_index].correct_answer_index === i ? 'white' : '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Leaderboard & Controls */}
        <div className="flex-1 w-full lg:w-1/3 flex flex-col gap-6">
          
          {/* Pending Requests */}
          {(isScheduled || isWaitingRoom) && participants.some(p => p.approval_status === 'pending') && (
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e1b4b', marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <span>Pending Requests</span>
                <span style={{ background: '#fef3c7', color: '#d97706', padding: '2px 10px', borderRadius: 20, fontSize: 12 }}>
                  {participants.filter(p => p.approval_status === 'pending').length}
                </span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
                {participants.filter(p => p.approval_status === 'pending').map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#fffbeb', borderRadius: 8, border: '1px solid #fde68a' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#92400e' }}>{p.profiles?.full_name || 'Student'}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => handleApprove(p.id)} style={{ background: '#10b981', color: 'white', border: 'none', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <CheckCircle size={16} />
                      </button>
                      <button onClick={() => handleDeny(p)} style={{ background: '#ef4444', color: 'white', border: 'none', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <XCircle size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Allowed Participants */}
          <div className="card" style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e1b4b', marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
              <span>Participants</span>
              <span style={{ background: '#f5f3ff', color: '#6c47ff', padding: '2px 10px', borderRadius: 20, fontSize: 12 }}>
                {participants.filter(p => p.approval_status === 'allowed').length}
              </span>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', flex: 1 }}>
              {participants.filter(p => p.approval_status === 'allowed').length === 0 ? (
                <div style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No allowed students yet.</div>
              ) : (
                [...participants.filter(p => p.approval_status === 'allowed')].sort((a,b) => b.score - a.score).map((p) => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f9fafb', borderRadius: 8, border: '1px solid #f3f4f6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                        {p.profiles?.full_name?.charAt(0) || '?'}
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{p.profiles?.full_name || 'Student'}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#6c47ff' }}>{p.score} pts</span>
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
