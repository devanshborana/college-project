import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

const BASE_LEADERBOARD = [
  { rank: 1, name: 'Priya Sharma',   id: 'LMCST-2024-042', basePoints: 2840, solved: 68, badges: 12, color: '#f59e0b' },
  { rank: 2, name: 'Rahul Verma',    id: 'LMCST-2024-017', basePoints: 2610, solved: 61, badges: 9,  color: '#6c47ff' },
  { rank: 3, name: 'Ananya Singh',   id: 'LMCST-2024-031', basePoints: 2430, solved: 57, badges: 8,  color: '#a855f7' },
  { rank: 4, name: 'Kartik Bhatt',   id: 'LMCST-2024-059', basePoints: 1950, solved: 47, badges: 6,  color: '#22c55e' },
  { rank: 5, name: 'Sneha Patel',    id: 'LMCST-2024-023', basePoints: 1780, solved: 43, badges: 5,  color: '#ec4899' },
  { rank: 6, name: 'Vivek Joshi',    id: 'LMCST-2024-088', basePoints: 1640, solved: 39, badges: 5,  color: '#f97316' },
  { rank: 7, name: 'Meera Gupta',    id: 'LMCST-2024-014', basePoints: 1520, solved: 36, badges: 4,  color: '#14b8a6' },
  { rank: 8, name: 'Arjun Rathore',  id: 'LMCST-2024-065', basePoints: 1380, solved: 32, badges: 3,  color: '#6c47ff' },
  { rank: 9, name: 'Kavita Pareek',  id: 'LMCST-2024-038', basePoints: 1240, solved: 29, badges: 3,  color: '#ef4444' },
]

export function AppProvider({ children }) {
  // auth state
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('lmcst-user') || 'null') }
    catch { return null }
  })

  // quizHistory: { [subjectId]: { score: number, total: number, completedAt: string, subjectName: string } }
  const [quizHistory, setQuizHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('lmcst-quiz-history') || '{}') }
    catch { return {} }
  })

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem('lmcst-quiz-history', JSON.stringify(quizHistory))
    if (user) localStorage.setItem('lmcst-user', JSON.stringify(user))
    else localStorage.removeItem('lmcst-user')
  }, [quizHistory, user])

  const login = (name, id) => setUser({ name, id })
  const logout = () => setUser(null)

  // User's total quiz points
  const quizPoints = Object.values(quizHistory).reduce((sum, h) => sum + h.score, 0)
  const currentUserBasePoints = 2180
  const currentUserTotalPoints = currentUserBasePoints + quizPoints
  const quizzesCompleted = Object.keys(quizHistory).length

  // Save or update a quiz result (keeps best score)
  const saveQuizResult = (subjectId, score, total, subjectName) => {
    setQuizHistory(prev => {
      const existing = prev[subjectId]
      // Only update if new score is better
      if (existing && existing.score >= score) return prev
      return {
        ...prev,
        [subjectId]: { score, total, subjectName, completedAt: new Date().toISOString() }
      }
    })
  }

  // Compute sorted leaderboard with updated current user points
  const leaderboard = [...BASE_LEADERBOARD]
  
  if (user) {
    leaderboard.push({
      name: user.name,
      id: user.id,
      basePoints: currentUserBasePoints,
      solved: 52,
      badges: 7,
      color: '#3b82f6',
      isCurrentUser: true
    })
  }

  const sortedLeaderboard = leaderboard
    .map(s => ({
      ...s,
      points: s.isCurrentUser ? currentUserTotalPoints : s.basePoints,
    }))
    .sort((a, b) => b.points - a.points)
    .map((s, i) => ({ ...s, rank: i + 1 }))

  return (
    <AppContext.Provider value={{
      user,
      login,
      logout,
      quizHistory,
      quizPoints,
      quizzesCompleted,
      currentUserTotalPoints,
      saveQuizResult,
      leaderboard: sortedLeaderboard,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
