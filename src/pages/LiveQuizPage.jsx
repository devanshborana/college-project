import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Clock, Users, Play, Calendar } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { quizData } from '../data/quizData'

export default function LiveQuizPage() {
  const navigate = useNavigate()
  const [scheduledQuizzes, setScheduledQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!supabase) {
        setLoading(false)
        return
      }
      try {
        const { data, error } = await supabase
          .from('live_quizzes')
          .select(`
            id, title, subject_id, status, scheduled_for, created_at,
            profiles:teacher_id ( full_name )
          `)
          .order('scheduled_for', { ascending: true })

        if (data) {
          setScheduledQuizzes(data)
        }
      } catch (err) {
        console.error("Failed to fetch live quizzes", err)
      } finally {
        setLoading(false)
      }
    }
    fetchQuizzes()
  }, [])

  return (
    <div className="page-content" style={{ maxWidth: 860 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1e1b4b', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Zap size={28} color="#f59e0b" /> Scheduled Live Quizzes
        </h1>
        <p style={{ fontSize: 14, color: '#6b7280', marginTop: 6 }}>
          Join live sessions scheduled by your teachers, race against the clock, and compete!
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>Loading scheduled quizzes...</div>
      ) : scheduledQuizzes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: 'white', borderRadius: 20, border: '2px dashed #e5e7eb' }}>
          <Calendar size={48} color="#9ca3af" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#4b5563', marginBottom: 8 }}>No Live Quizzes Scheduled</h3>
          <p style={{ fontSize: 14, color: '#6b7280' }}>Your teachers haven't scheduled any live quizzes yet. Check back later!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {scheduledQuizzes.map((quiz) => {
            const staticInfo = quizData[quiz.subject_id] || { icon: '📘', title: 'Subject' }
            const isLive = quiz.status === 'Active'
            const scheduledDate = new Date(quiz.scheduled_for)

            return (
              <div key={quiz.id} style={{
                background: 'white', borderRadius: 20, border: '2px solid #e8e4ff',
                padding: 24, display: 'flex', flexDirection: 'column',
                boxShadow: '0 10px 25px rgba(108,71,255,0.05)', transition: 'all 0.25s',
                position: 'relative', overflow: 'hidden'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#c4b5fd'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(108,71,255,0.1)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#e8e4ff'
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(108,71,255,0.05)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{
                    width: 50, height: 50, borderRadius: 14, background: '#f5f3ff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24
                  }}>
                    {staticInfo.icon}
                  </div>
                  {isLive ? (
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', background: '#fef2f2', padding: '4px 10px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', animation: 'pulse-red 2s infinite' }}></span> LIVE NOW
                    </span>
                  ) : (
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#6c47ff', background: '#f5f3ff', padding: '4px 10px', borderRadius: 20 }}>
                      Scheduled
                    </span>
                  )}
                </div>

                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1e1b4b', marginBottom: 6, lineHeight: 1.3 }}>
                  {quiz.title}
                </h2>
                
                <div style={{ fontSize: 13, color: '#6c47ff', fontWeight: 600, marginBottom: 16 }}>
                  By Prof. {quiz.profiles?.full_name || 'Teacher'}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, marginTop: 'auto', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6b7280', fontSize: 13 }}>
                    <Calendar size={16} /> {scheduledDate.toLocaleDateString()} {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6b7280', fontSize: 13 }}>
                    <Clock size={16} /> 20s/Q
                  </div>
                </div>

                <button onClick={() => navigate(`/quiz/${quiz.id}`)} style={{
                  width: '100%', padding: '12px', borderRadius: 12, border: 'none',
                  background: 'linear-gradient(135deg, #6c47ff, #a855f7)', color: 'white',
                  fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: '0 4px 12px rgba(108,71,255,0.2)'
                }}>
                  <Play size={16} fill="white" /> Enter Session
                </button>
              </div>
            )
          })}
        </div>
      )}
      <style>{`
        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
          70% { box-shadow: 0 0 0 6px rgba(239,68,68,0); }
          100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
        }
      `}</style>
    </div>
  )
}
