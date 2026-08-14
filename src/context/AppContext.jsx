import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

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
  // ── Auth state ──────────────────────────────────────────────────────────────
  // User object: { name, id, dbId } where dbId is the UUID from Supabase profiles table
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('lmcst-user') || 'null') }
    catch { return null }
  })

  // quizHistory: { [subjectId]: { score, total, completedAt, subjectName } }
  const [quizHistory, setQuizHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('lmcst-quiz-history') || '{}') }
    catch { return {} }
  })

  // Persist quiz history to localStorage as fallback
  useEffect(() => {
    localStorage.setItem('lmcst-quiz-history', JSON.stringify(quizHistory))
  }, [quizHistory])

  // Persist user to localStorage (lightweight session)
  useEffect(() => {
    if (user) localStorage.setItem('lmcst-user', JSON.stringify(user))
    else localStorage.removeItem('lmcst-user')
  }, [user])

  // ── Load quiz history from Supabase on login ─────────────────────────────
  useEffect(() => {
    if (!user?.dbId || !supabase) return

    const loadQuizHistory = async () => {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('subject_id, score, total, completed_at')
        .eq('user_id', user.dbId)
        .order('completed_at', { ascending: false })

      if (error) {
        console.error('Error loading quiz history:', error.message)
        return
      }

      // Build history map — keep only the best score per subject
      const historyMap = {}
      for (const row of data) {
        const existing = historyMap[row.subject_id]
        if (!existing || row.score > existing.score) {
          historyMap[row.subject_id] = {
            score: row.score,
            total: row.total,
            completedAt: row.completed_at,
          }
        }
      }
      setQuizHistory(historyMap)
    }

    loadQuizHistory()
  }, [user?.dbId])

  // ── Login: look up or create a profile in Supabase ──────────────────────
  const login = async (name, studentId) => {
    // If Supabase is not available, fall back to local-only mode
    if (!supabase) {
      setUser({ name, id: studentId })
      return { error: null }
    }

    // 1. Check if this student_id already exists
    let { data: existing, error: fetchError } = await supabase
      .from('profiles')
      .select('id, full_name, student_id, base_points')
      .eq('student_id', studentId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 = "no rows found" — that's fine, we'll create one
      console.error('Login fetch error:', fetchError.message)
      return { error: 'Could not connect to the database. Please try again.' }
    }

    let profile = existing

    // 2. If no existing profile, create one
    if (!profile) {
      const { data: created, error: insertError } = await supabase
        .from('profiles')
        .insert({ student_id: studentId, full_name: name })
        .select()
        .single()

      if (insertError) {
        console.error('Login insert error:', insertError.message)
        return { error: 'Could not create your profile. Please try again.' }
      }
      profile = created
    }

    // 3. Set the user in state
    setUser({ name: profile.full_name, id: profile.student_id, dbId: profile.id })
    return { error: null }
  }

  const logout = () => {
    setUser(null)
    setQuizHistory({})
  }

  // ── Quiz points ──────────────────────────────────────────────────────────
  const quizPoints = Object.values(quizHistory).reduce((sum, h) => sum + h.score, 0)
  const currentUserBasePoints = user?.basePoints ?? 2180
  const currentUserTotalPoints = currentUserBasePoints + quizPoints
  const quizzesCompleted = Object.keys(quizHistory).length

  // ── Save quiz result to Supabase ────────────────────────────────────────
  const saveQuizResult = async (subjectId, score, total, subjectName) => {
    // Optimistic local update first
    setQuizHistory(prev => {
      const existing = prev[subjectId]
      if (existing && existing.score >= score) return prev
      return {
        ...prev,
        [subjectId]: { score, total, subjectName, completedAt: new Date().toISOString() }
      }
    })

    // Persist to Supabase if user has a dbId and supabase is available
    if (user?.dbId && supabase) {
      const { error } = await supabase
        .from('quiz_results')
        .insert({
          user_id: user.dbId,
          subject_id: subjectId,
          score,
          total,
        })

      if (error) {
        console.error('Error saving quiz result:', error.message)
      }
    }
  }

  // ── Build sorted leaderboard ─────────────────────────────────────────────
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
