import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AppContext = createContext()

// BASE_LEADERBOARD removed, using database instead

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

  // solvedQuestions: array of solved question IDs
  const [solvedQuestions, setSolvedQuestions] = useState(() => {
    try { return JSON.parse(localStorage.getItem('lmcst-solved-questions') || '[]') }
    catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('lmcst-solved-questions', JSON.stringify(solvedQuestions))
  }, [solvedQuestions])

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

  // ── Load Real Leaderboard from Supabase ─────────────────────────────────
  const [dbLeaderboard, setDbLeaderboard] = useState([])
  useEffect(() => {
    if (!supabase) return
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, student_id, base_points')
      
      if (data && !error) {
        const colors = ['#f59e0b', '#6c47ff', '#a855f7', '#22c55e', '#ec4899', '#f97316', '#14b8a6', '#ef4444']
        setDbLeaderboard(data.map((p, i) => ({
          name: p.full_name || p.student_id,
          id: p.student_id, // student_id acts as the email/id
          dbId: p.id,
          basePoints: p.base_points || 0,
          solved: 0,
          badges: 0,
          color: colors[i % colors.length]
        })))
      }
    }
    fetchLeaderboard()
  }, [])

  // ── Google OAuth: listen for auth state changes ─────────────────────────
  useEffect(() => {
    if (!supabase) return

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const authUser = session.user
        const googleName = authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Student'
        const googleEmail = authUser.email

        // Look up existing profile by email as student_id
        let { data: profile } = await supabase
          .from('profiles')
          .select('id, full_name, student_id, base_points, role')
          .eq('student_id', googleEmail)
          .maybeSingle()

        // If no profile exists, create one
        if (!profile) {
          const { data: created } = await supabase
            .from('profiles')
            .insert({ student_id: googleEmail, full_name: googleName })
            .select()
            .single()
          profile = created
        }

        if (profile) {
          setUser({ name: profile.full_name, id: profile.student_id, dbId: profile.id, role: profile.role || 'student', basePoints: profile.base_points || 0 })
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // ── Login with Google OAuth ─────────────────────────────────────────────
  const loginWithGoogle = async () => {
    if (!supabase) return { error: 'Supabase is not configured.' }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      }
    })

    if (error) return { error: error.message }
    return { error: null }
  }

  // ── Manual Login: Supabase Email & Password Auth ────────────────────────
  const login = async (email, password, isSignUp = false, name = '') => {
    if (!supabase) {
      setUser({ name: name || email, id: email })
      return { error: null }
    }

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name }
        }
      })
      if (error) return { error: error.message }
      // onAuthStateChange handles creating the profile and setting user state
      return { error: null }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) return { error: error.message }
      return { error: null }
    }
  }

  // ── Logout ──────────────────────────────────────────────────────────────
  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    setUser(null)
    setQuizHistory({})
    setSolvedQuestions([])
  }

  // ── Points System ────────────────────────────────────────────────────────
  const addPoints = async (amount) => {
    if (!amount || amount <= 0 || !user?.dbId || !supabase) return

    // Update local state immediately for snappy UI
    const newPoints = (user.basePoints || 0) + amount
    setUser(prev => ({ ...prev, basePoints: newPoints }))

    // Update DB securely
    const { data: profile } = await supabase
      .from('profiles')
      .select('base_points')
      .eq('id', user.dbId)
      .single()

    if (profile) {
      const updatedPoints = (profile.base_points || 0) + amount
      await supabase
        .from('profiles')
        .update({ base_points: updatedPoints })
        .eq('id', user.dbId)

      setUser(prev => ({ ...prev, basePoints: updatedPoints }))
    }
  }

  // ── Daily Login Points ───────────────────────────────────────────────────
  useEffect(() => {
    if (!user?.dbId) return
    const today = new Date().toDateString()
    const lastLoginKey = `lmcst-last-login-${user.dbId}`
    const lastLogin = localStorage.getItem(lastLoginKey)
    
    if (lastLogin !== today) {
      localStorage.setItem(lastLoginKey, today)
      addPoints(1) // +1 point for logging in today
    }
  }, [user?.dbId])

  // ── Question Bank Points ─────────────────────────────────────────────────
  const markQuestionSolved = (questionId) => {
    if (!solvedQuestions.includes(questionId)) {
      setSolvedQuestions(prev => [...prev, questionId])
      addPoints(5) // +5 points for solving a coding challenge
    }
  }

  // ── Quiz points ──────────────────────────────────────────────────────────
  const quizPoints = Object.values(quizHistory).reduce((sum, h) => sum + h.score, 0)
  const currentUserBasePoints = user?.basePoints ?? 0
  const currentUserTotalPoints = currentUserBasePoints
  const quizzesCompleted = Object.keys(quizHistory).length

  // ── Save quiz result to Supabase ────────────────────────────────────────
  const saveQuizResult = async (subjectId, score, total, subjectName) => {
    // Calculate points to award
    const existing = quizHistory[subjectId]
    let pointsToAward = 0
    if (!existing) {
      pointsToAward = score
    } else if (score > existing.score) {
      pointsToAward = score - existing.score
    }

    // Optimistic local update first
    setQuizHistory(prev => {
      if (existing && existing.score >= score) return prev
      return {
        ...prev,
        [subjectId]: { score, total, subjectName, completedAt: new Date().toISOString() }
      }
    })

    if (pointsToAward > 0) {
      addPoints(pointsToAward)
    }

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
  const leaderboard = dbLeaderboard.map(p => {
    if (user && p.id === user.id) {
      return {
        ...p,
        isCurrentUser: true,
        points: currentUserTotalPoints
      }
    }
    return {
      ...p,
      isCurrentUser: false,
      points: p.basePoints
    }
  })

  // If user just signed up and is not yet in the fetched dbLeaderboard
  if (user && !leaderboard.find(p => p.id === user.id)) {
    leaderboard.push({
      name: user.name,
      id: user.id,
      basePoints: currentUserBasePoints,
      solved: 0,
      badges: 0,
      color: '#3b82f6',
      isCurrentUser: true,
      points: currentUserTotalPoints
    })
  }

  const sortedLeaderboard = leaderboard
    .sort((a, b) => b.points - a.points)
    .map((s, i) => ({ ...s, rank: i + 1 }))

  return (
    <AppContext.Provider value={{
      user,
      login,
      loginWithGoogle,
      logout,
      quizHistory,
      quizPoints,
      quizzesCompleted,
      currentUserTotalPoints,
      saveQuizResult,
      solvedQuestions,
      markQuestionSolved,
      leaderboard: sortedLeaderboard,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
