import { useState } from 'react'
import { Trophy, Zap, Check, Star } from 'lucide-react'
import { useApp } from '../context/AppContext'

function getRankStyle(rank) {
  if (rank === 1) return 'rank-gold'
  if (rank === 2) return 'rank-silver'
  if (rank === 3) return 'rank-bronze'
  return 'rank-default'
}

export default function LeaderboardPage() {
  const [filter, setFilter] = useState('all')
  const { leaderboard, currentUserTotalPoints, quizzesCompleted } = useApp()

  const top3 = leaderboard.slice(0, 3)
  // Order: 2nd, 1st, 3rd (classic podium order)
  const podiumOrder = [top3[1], top3[0], top3[2]]
  // No height gimmick — equal cards, rank communicated through weight/size
  const rankLabels = ['#2', '#1', '#3']
  const rankBarClasses = ['rank-2-bar', 'rank-1-bar', 'rank-3-bar']

  const currentUserEntry = leaderboard.find(s => s.isCurrentUser)

  return (
    <div className="page-content" style={{ maxWidth: 900 }}>
      {/* Page title */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: '#1A1A1A', letterSpacing: '-0.3px' }}>Leaderboard</h1>
        <p style={{ fontSize: 12, color: '#A3A3A3', marginTop: 3 }}>Rankings based on coding challenges & quiz scores</p>
      </div>

      {/* Flat dark hero panel — no gradient */}
      <div className="leaderboard-header">
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>
            LMCST Rankings
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: 'white' }}>August 2026</div>
        </div>

        {/* Three equal cards — no podium height trick */}
        <div className="podium">
          {podiumOrder.map((student, i) => student && (
            <div key={student.id} className="podium-item">
              {/* Neutral avatar chip, all same treatment */}
              <div className="podium-avatar">
                {student.name.charAt(0)}
              </div>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.8)', maxWidth: 76, textAlign: 'center', lineHeight: 1.2 }}>
                {student.name.split(' ')[0]}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>
                {student.points.toLocaleString()} pts
              </div>
              {/* Rank label in bar — #1 gets larger text */}
              <div className={`podium-bar ${rankBarClasses[i]}`}>
                {rankLabels[i]}
              </div>
            </div>
          ))}
        </div>

        {/* Current user rank — clean stat row */}
        {currentUserEntry && (
          <div style={{
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 8,
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Your rank</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: 'white' }}>#{currentUserEntry?.rank}</span>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'flex', gap: 12 }}>
                <span>{currentUserTotalPoints.toLocaleString()} pts</span>
                <span>·</span>
                <span>{quizzesCompleted} quizzes</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter tabs — segmented control */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 14, padding: '3px', background: '#F5F5F4', borderRadius: 8, width: 'fit-content', border: '1px solid #E7E5E4' }}>
        {[{ key: 'all', label: 'All Time' }, { key: 'month', label: 'This Month' }, { key: 'week', label: 'This Week' }].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '5px 14px',
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 500,
              transition: 'all 150ms',
              background: filter === f.key ? '#FFFFFF' : 'transparent',
              color: filter === f.key ? '#1A1A1A' : '#A3A3A3',
              boxShadow: filter === f.key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              fontFamily: 'inherit',
            }}
          >{f.label}</button>
        ))}
      </div>

      {/* Table */}
      <div className="leaderboard-table">
        <div className="lb-header" style={{ gridTemplateColumns: '60px 2fr 1fr 1fr 1fr 1fr 1fr' }}>
          <div>Rank</div>
          <div>Student</div>
          <div style={{ textAlign: 'right' }}>Points</div>
          <div style={{ textAlign: 'right' }}>Live Score</div>
          <div style={{ textAlign: 'right' }}>Live Quizzes</div>
          <div style={{ textAlign: 'right' }}>Solved</div>
          <div style={{ textAlign: 'right' }}>Stars</div>
        </div>

        {leaderboard.map(student => {
          const rankCls = getRankStyle(student.rank)
          return (
            <div key={student.id} className={`lb-row ${student.isCurrentUser ? 'current-user' : ''} fade-in-up`} style={{ gridTemplateColumns: '60px 2fr 1fr 1fr 1fr 1fr 1fr' }}>
              <div>
                <div className={`rank-badge ${rankCls}`}>
                  {student.rank <= 3 ? `#${student.rank}` : `#${student.rank}`}
                </div>
              </div>

              <div className="lb-student-info">
                {/* All avatars same neutral chip */}
                <div className="lb-avatar">{student.name.charAt(0)}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1A1A1A', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {student.name}
                    {student.isCurrentUser && (
                      <span style={{ fontSize: 9, background: '#F5F5F4', color: '#525252', padding: '1px 5px', borderRadius: 3, fontWeight: 500, border: '1px solid #E7E5E4', textTransform: 'uppercase', letterSpacing: 0.3 }}>You</span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: '#A3A3A3', marginTop: 1 }}>{student.id}</div>
                </div>
              </div>

              {/* Points — right aligned, no chip */}
              <div style={{ textAlign: 'right' }}>
                <span className="points-chip">{student.points.toLocaleString()}</span>
              </div>

              {/* Live Score */}
              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, fontSize: 13, color: '#525252' }}>
                <Zap size={13} color="#f59e0b" /> {student.liveScore || 0}
              </div>

              {/* Live Quizzes Attempted */}
              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, fontSize: 13, color: '#525252' }}>
                {student.liveAttempted || 0}
              </div>

              {/* Solved — Lucide icon, not emoji */}
              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, fontSize: 13, color: '#525252' }}>
                <Check size={13} color="#A3A3A3" /> {student.solved}
              </div>

              {/* Stars — Lucide icon, not emoji */}
              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
                {Array.from({ length: Math.min(student.badges, 3) }).map((_, i) => (
                  <Star key={i} size={12} color="#A3A3A3" />
                ))}
                {student.badges > 3 && <span style={{ fontSize: 10, color: '#A3A3A3', marginLeft: 2 }}>+{student.badges - 3}</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
