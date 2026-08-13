import { useState } from 'react'
import { Trophy, Zap, CheckCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'

function getRankStyle(rank) {
  if (rank === 1) return { cls: 'rank-gold', emoji: '🥇' }
  if (rank === 2) return { cls: 'rank-silver', emoji: '🥈' }
  if (rank === 3) return { cls: 'rank-bronze', emoji: '🥉' }
  return { cls: 'rank-default', emoji: `#${rank}` }
}

export default function LeaderboardPage() {
  const [filter, setFilter] = useState('all')
  const { leaderboard, currentUserTotalPoints, quizzesCompleted } = useApp()

  const top3 = leaderboard.slice(0, 3)
  const podiumOrder = [top3[1], top3[0], top3[2]]
  const podiumHeights = [72, 100, 52]
  const podiumLabels = ['🥈', '🥇', '🥉']

  const currentUserEntry = leaderboard.find(s => s.isCurrentUser)

  return (
    <div className="page-content" style={{ maxWidth: 960 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1e1b4b' }}>🏆 Leaderboard</h1>
        <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>Rankings based on coding challenges & quiz scores</p>
      </div>

      {/* Live score update banner */}
      {quizzesCompleted > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
          border: '1.5px solid #a7f3d0', borderRadius: 14, padding: '14px 20px',
          marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <CheckCircle size={20} color="#059669" />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#065f46' }}>
              Your score is live! You've completed {quizzesCompleted} quiz{quizzesCompleted > 1 ? 'zes' : ''}.
            </div>
            <div style={{ fontSize: 12, color: '#047857', marginTop: 2 }}>
              Total points: {currentUserTotalPoints.toLocaleString()} — Rank #{currentUserEntry?.rank}
            </div>
          </div>
        </div>
      )}

      {/* Podium header */}
      <div className="leaderboard-header">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 6 }}>LMCST Coding Champions</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>August 2026 Rankings</div>
          </div>

          {/* Podium */}
          <div className="podium">
            {podiumOrder.map((student, i) => student && (
              <div key={student.id} className="podium-item">
                <div style={{
                  width: 52, height: 52, borderRadius: '50%', background: student.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 800, color: 'white',
                  border: '3px solid rgba(255,255,255,0.6)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                }}>
                  {student.name.charAt(0)}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'white', maxWidth: 80, textAlign: 'center' }}>
                  {student.name.split(' ')[0]}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: -4 }}>
                  {student.points.toLocaleString()} pts
                </div>
                <div style={{
                  width: 80, height: podiumHeights[i],
                  background: 'rgba(255,255,255,0.15)', borderRadius: '10px 10px 0 0',
                  display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                  paddingTop: 10, fontSize: 24,
                }}>
                  {podiumLabels[i]}
                </div>
              </div>
            ))}
          </div>

          {/* Current user rank bar */}
          <div style={{
            background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '10px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            backdropFilter: 'blur(10px)',
          }}>
            <span style={{ fontSize: 13, opacity: 0.9 }}>Your Current Rank</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 24, fontWeight: 900 }}>#{currentUserEntry?.rank}</span>
              <div style={{ fontSize: 12, opacity: 0.8, display: 'flex', gap: 8 }}>
                <span>⚡ {currentUserTotalPoints.toLocaleString()} pts</span>
                <span>·</span>
                <span>📝 {quizzesCompleted} quizzes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        {[{ key: 'all', label: 'All Time' }, { key: 'month', label: 'This Month' }, { key: 'week', label: 'This Week' }].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding: '7px 18px', borderRadius: 20, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
            background: filter === f.key ? '#6c47ff' : 'white',
            color: filter === f.key ? 'white' : '#6b7280',
            outline: filter === f.key ? 'none' : '1.5px solid #e8e4ff',
            boxShadow: filter === f.key ? '0 4px 12px rgba(108,71,255,0.3)' : 'none',
          }}>{f.label}</button>
        ))}
      </div>

      {/* Table */}
      <div className="leaderboard-table">
        <div className="lb-header">
          <div>Rank</div>
          <div>Student</div>
          <div>Points</div>
          <div>Solved</div>
          <div>Badges</div>
        </div>

        {leaderboard.map(student => {
          const { cls, emoji } = getRankStyle(student.rank)
          return (
            <div key={student.id} className={`lb-row ${student.isCurrentUser ? 'current-user' : ''} fade-in-up`}>
              <div>
                <div className={`rank-badge ${cls}`}>
                  {student.rank <= 3 ? emoji : `#${student.rank}`}
                </div>
              </div>

              <div className="lb-student-info">
                <div className="lb-avatar" style={{ background: student.color }}>
                  {student.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1e1b4b', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {student.name}
                    {student.isCurrentUser && (
                      <span style={{ fontSize: 10, background: '#f5f3ff', color: '#6c47ff',
                        padding: '1px 6px', borderRadius: 20, fontWeight: 600 }}>You</span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>{student.id}</div>
                </div>
              </div>

              <div className="points-chip">
                <Zap size={11} fill="#6c47ff" /> {student.points.toLocaleString()}
              </div>

              <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>
                ✅ {student.solved}
              </div>

              <div style={{ display: 'flex', gap: 2 }}>
                {Array.from({ length: Math.min(student.badges, 5) }).map((_, i) => (
                  <span key={i} style={{ fontSize: 14 }}>⭐</span>
                ))}
                {student.badges > 5 && <span style={{ fontSize: 11, color: '#6b7280' }}>+{student.badges - 5}</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
