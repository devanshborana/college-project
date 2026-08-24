import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Play, Calendar, BookOpen } from 'lucide-react'
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
      {/* Page heading — no lightning emoji */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: '#1A1A1A', letterSpacing: '-0.3px' }}>
          Scheduled Live Quizzes
        </h1>
        <p style={{ fontSize: 12, color: '#A3A3A3', marginTop: 3 }}>
          Join live sessions scheduled by your teachers and compete on the leaderboard.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#A3A3A3', fontSize: 13 }}>Loading quizzes...</div>
      ) : scheduledQuizzes.length === 0 ? (
        /* Empty state — solid border, no dashed */
        <div style={{ textAlign: 'center', padding: 60, background: '#FAFAFA', borderRadius: 10, border: '1px solid #E7E5E4' }}>
          <Calendar size={32} color="#D4D4D4" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#525252', marginBottom: 6 }}>No Live Quizzes Scheduled</h3>
          <p style={{ fontSize: 13, color: '#A3A3A3' }}>Your teachers haven't scheduled any live quizzes yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {scheduledQuizzes.map((quiz) => {
            const isLive = quiz.status === 'Active'
            const scheduledDate = new Date(quiz.scheduled_for)

            return (
              <div
                key={quiz.id}
                style={{
                  background: '#FFFFFF', borderRadius: 10, border: '1px solid #E7E5E4',
                  padding: 20, display: 'flex', flexDirection: 'column',
                  transition: 'border-color 150ms, box-shadow 150ms',
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
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  {/* Neutral subject icon — gray square, not colored sticker */}
                  <div style={{
                    width: 40, height: 40, borderRadius: 8, background: '#F5F5F4',
                    border: '1px solid #E7E5E4',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <BookOpen size={18} color="#A3A3A3" />
                  </div>

                  {/* Status chip — monochrome, no lavender fill */}
                  {isLive ? (
                    <span style={{
                      fontSize: 10, fontWeight: 600, color: '#1A1A1A', background: '#111111',
                      color: 'white', padding: '3px 8px', borderRadius: 4,
                      display: 'flex', alignItems: 'center', gap: 5,
                      textTransform: 'uppercase', letterSpacing: 0.5
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'white', flexShrink: 0 }} />
                      Live
                    </span>
                  ) : (
                    <span style={{
                      fontSize: 10, fontWeight: 500, color: '#525252',
                      border: '1px solid #E7E5E4', padding: '3px 8px', borderRadius: 4,
                      textTransform: 'uppercase', letterSpacing: 0.4
                    }}>
                      Scheduled
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 style={{ fontSize: 15, fontWeight: 600, color: '#1A1A1A', marginBottom: 4, lineHeight: 1.3 }}>
                  {quiz.title}
                </h2>

                {/* Byline — near-black medium weight, not purple */}
                <div style={{ fontSize: 12, color: '#525252', fontWeight: 500, marginBottom: 14 }}>
                  By {quiz.profiles?.full_name || 'Teacher'}
                </div>

                {/* Metadata row — muted gray, matching app standard */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16, marginTop: 'auto', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#A3A3A3', fontSize: 11 }}>
                    <Calendar size={13} />
                    {scheduledDate.toLocaleDateString()} {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#A3A3A3', fontSize: 11 }}>
                    <Clock size={13} /> 20s/Q
                  </div>
                </div>

                {/* Enter Session — primary solid black, no purple gradient */}
                <button
                  onClick={() => navigate(`/quiz/${quiz.id}`)}
                  style={{
                    width: '100%', padding: '10px', borderRadius: 8, border: 'none',
                    background: '#111111', color: 'white',
                    fontSize: 13, fontWeight: 500, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    fontFamily: 'inherit', transition: 'opacity 150ms',
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  <Play size={14} /> Enter Session
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
