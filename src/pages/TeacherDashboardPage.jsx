import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Sparkles, Save, Code2, Loader2, Target, Key, Plus, Trash2, Calendar, Play } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function TeacherDashboardPage() {
  const { user } = useApp()
  const [activeTab, setActiveTab] = useState('coding') // 'coding' or 'quiz'
  
  // Coding Problem State
  const [topic, setTopic] = useState('')
  const [subjectId, setSubjectId] = useState('dsa')
  const [difficulty, setDifficulty] = useState('Medium')
  const [loadingCode, setLoadingCode] = useState(false)
  const [savingCode, setSavingCode] = useState(false)
  const [generatedProblem, setGeneratedProblem] = useState(null)
  
  // Live Quiz State
  const [quizTitle, setQuizTitle] = useState('')
  const [quizSubject, setQuizSubject] = useState('dsa')
  const [quizDate, setQuizDate] = useState('')
  const [quizTime, setQuizTime] = useState('')
  const [generatingOptionsIdx, setGeneratingOptionsIdx] = useState(null)
  const [savingQuiz, setSavingQuiz] = useState(false)
  const [quizQuestions, setQuizQuestions] = useState([]) // Array of { q, opts, ans }
  
  const [scheduledQuizzes, setScheduledQuizzes] = useState([])
  const [loadingQuizzes, setLoadingQuizzes] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (activeTab === 'quiz' && user?.dbId) {
      loadScheduledQuizzes()
    }
  }, [activeTab, user])

  const loadScheduledQuizzes = async () => {
    setLoadingQuizzes(true)
    const { data } = await supabase
      .from('live_quizzes')
      .select('*')
      .eq('teacher_id', user.dbId)
      .order('scheduled_for', { ascending: false })
    
    if (data) setScheduledQuizzes(data)
    setLoadingQuizzes(false)
  }

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return
    
    const { error } = await supabase.from('live_quizzes').delete().eq('id', id)
    if (!error) {
      setScheduledQuizzes(prev => prev.filter(q => q.id !== id))
    } else {
      alert('Failed to delete quiz: ' + error.message)
    }
  }

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // -------------------------
  // REAL AI GENERATORS
  // -------------------------
  const generateWithAI = async (promptText, isQuiz = false, count = 5, subj = '', diff = '') => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) {
      throw new Error("Gemini API key is missing. Add VITE_GEMINI_API_KEY to your .env file.")
    }
    
    let prompt = ''
    if (isQuiz) {
      prompt = `Given the following multiple choice question: "${promptText}"
      The context/subject of this question is: ${subj || 'Computer Science/Programming'}.
      Generate 4 plausible options for this question within this context.
      IMPORTANT: Randomize the position of the correct answer (it should NOT always be the first option).
      Return ONLY a JSON object with a "data" key containing exactly 1 object. The JSON must look exactly like this:
      {
        "data": [
          {
            "opts": ["Option A", "Option B", "Option C", "Option D"],
            "ans": 2
          }
        ]
      }
      "ans" must be the integer index (0-3) of the correct answer in the "opts" array. Ensure the options are accurate and challenging.`
    } else {
      prompt = `Generate a programming problem about the topic: "${promptText}". Subject context: ${subj}. Difficulty: ${diff}.
      Return ONLY a JSON object, with NO markdown formatting, NO backticks. The object must look exactly like this:
      {
        "title": "A short, catchy title",
        "description": "Detailed problem description",
        "objective": "A one-sentence objective",
        "requirements": ["Requirement 1", "Requirement 2", "Requirement 3"],
        "expected_output": "Example output",
        "starter_code": "Basic starter code template"
      }`
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    })

    if (!response.ok) {
      const errData = await response.json()
      throw new Error(errData?.error?.message || 'Failed to connect to Gemini API')
    }

    const data = await response.json()
    const textOutput = data.candidates[0].content.parts[0].text
    const parsed = JSON.parse(textOutput)
    
    if (isQuiz) {
      return parsed.data
    } else {
      return parsed
    }
  }

  // -------------------------
  // HANDLERS
  // -------------------------
  const handleGenerateCode = async () => {
    if (!topic.trim()) return
    setLoadingCode(true)
    setError(null)
    setSuccess(null)
    try {
      const problemData = await generateWithAI(topic, false, 0, subjectId, difficulty)
      setGeneratedProblem({
        ...problemData,
        difficulty: difficulty,
        subject_id: subjectId,
        points: difficulty === 'Easy' ? 10 : difficulty === 'Medium' ? 25 : 50
      })
    } catch (err) {
      setError('Failed to generate problem: ' + err.message)
    } finally {
      setLoadingCode(false)
    }
  }

  const handleSaveCode = async () => {
    if (!generatedProblem || !supabase) return
    setSavingCode(true)
    setError(null)
    setSuccess(null)

    const { error: dbError } = await supabase
      .from('coding_problems')
      .insert({
        ...generatedProblem,
        teacher_id: user?.dbId
      })

    setSavingCode(false)
    if (dbError) {
      setError('Failed to save to database: ' + dbError.message)
    } else {
      setSuccess('Problem successfully saved to the Question Bank!')
      setGeneratedProblem(null)
      setTopic('')
    }
  }

  const handleGenerateOptions = async (index, questionText) => {
    if (!questionText.trim()) {
      setError('Please type a question first before generating options.')
      return
    }
    setGeneratingOptionsIdx(index)
    setError(null)
    setSuccess(null)
    try {
      const result = await generateWithAI(questionText, true, 1, quizSubject)
      if (result && result.length > 0) {
        const generated = result[0]
        const updated = [...quizQuestions]
        updated[index].opts = generated.opts
        updated[index].ans = generated.ans
        setQuizQuestions(updated)
        setSuccess(`Options generated for Question ${index + 1}!`)
      }
    } catch (err) {
      setError('Failed to generate options: ' + err.message)
    } finally {
      setGeneratingOptionsIdx(null)
    }
  }

  const handleAddManualQuestion = () => {
    setQuizQuestions([...quizQuestions, { q: '', opts: ['', '', '', ''], ans: 0 }])
  }

  const handleUpdateQuestion = (index, field, value, optIndex = null) => {
    const updated = [...quizQuestions]
    if (field === 'opts') {
      updated[index].opts[optIndex] = value
    } else {
      updated[index][field] = value
    }
    setQuizQuestions(updated)
  }

  const handleRemoveQuestion = (index) => {
    const updated = quizQuestions.filter((_, i) => i !== index)
    setQuizQuestions(updated)
  }

  const handleScheduleQuiz = async () => {
    if (!quizTitle.trim() || !quizDate || !quizTime || quizQuestions.length === 0) {
      setError('Please fill in all quiz details and add at least one question.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    
    const hasEmptyFields = quizQuestions.some(q => !q.q.trim() || q.opts.some(opt => !opt.trim()))
    if (hasEmptyFields) {
      setError('Please make sure all questions and their 4 options are filled out completely.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (!supabase) return

    setSavingQuiz(true)
    setError(null)
    setSuccess(null)

    try {
      const scheduledDateTime = new Date(`${quizDate}T${quizTime}`).toISOString()

      // 1. Create the quiz
      const { data: quizData, error: quizError } = await supabase
        .from('live_quizzes')
        .insert({
          title: quizTitle,
          subject_id: quizSubject,
          scheduled_for: scheduledDateTime,
          status: 'Scheduled',
          teacher_id: user?.dbId
        })
        .select()
        .single()

      if (quizError) throw quizError

      // 2. Insert questions
      const questionsToInsert = quizQuestions.map((q, index) => ({
        quiz_id: quizData.id,
        question_text: q.q,
        options: q.opts,
        correct_answer_index: q.ans,
        order_index: index
      }))

      const { error: qError } = await supabase
        .from('live_quiz_questions')
        .insert(questionsToInsert)

      if (qError) throw qError

      setSuccess('Live Quiz successfully scheduled!')
      setQuizTitle('')
      setQuizDate('')
      setQuizTime('')
      setQuizQuestions([])
      loadScheduledQuizzes()
    } catch (err) {
      setError('Failed to schedule quiz: ' + err.message)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSavingQuiz(false)
    }
  }

  // -------------------------
  // RENDER
  // -------------------------
  if (user?.role !== 'teacher') {
    return (
      <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          <Key size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <h2 style={{ fontSize: 20, color: '#1e1b4b', fontWeight: 700 }}>Access Denied</h2>
          <p>You must be a registered teacher to access this portal.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-content" style={{ maxWidth: 860 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: '#1A1A1A', letterSpacing: '-0.3px' }}>Teacher Portal</h1>
        <p style={{ fontSize: 12, color: '#A3A3A3', marginTop: 3 }}>Manage curriculum by scheduling live quizzes and adding coding problems.</p>
      </div>

      {/* Tabs — near-black underline, no purple */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #E7E5E4', marginBottom: 24 }}>
        <button onClick={() => setActiveTab('coding')} style={{
          background: 'none', border: 'none', padding: '10px 16px', fontSize: 13, fontWeight: 500,
          color: activeTab === 'coding' ? '#1A1A1A' : '#A3A3A3',
          borderBottom: activeTab === 'coding' ? '2px solid #1A1A1A' : '2px solid transparent',
          cursor: 'pointer', marginBottom: -1, display: 'flex', alignItems: 'center', gap: 7,
          transition: 'color 150ms', fontFamily: 'inherit'
        }}>
          <Code2 size={15} /> Question Bank Generator
        </button>
        <button onClick={() => setActiveTab('quiz')} style={{
          background: 'none', border: 'none', padding: '10px 16px', fontSize: 13, fontWeight: 500,
          color: activeTab === 'quiz' ? '#1A1A1A' : '#A3A3A3',
          borderBottom: activeTab === 'quiz' ? '2px solid #1A1A1A' : '2px solid transparent',
          cursor: 'pointer', marginBottom: -1, display: 'flex', alignItems: 'center', gap: 7,
          transition: 'color 150ms', fontFamily: 'inherit'
        }}>
          <Calendar size={15} /> Live Quiz Scheduler
        </button>
      </div>

      {/* Messages — no color, monochrome */}
      {error && <div style={{ padding: 12, background: '#FAFAFA', color: '#1A1A1A', borderRadius: 8, border: '1px solid #E7E5E4', marginBottom: 16, fontSize: 13 }}>{error}</div>}
      {success && <div style={{ padding: 12, background: '#FAFAFA', color: '#525252', borderRadius: 8, border: '1px solid #E7E5E4', marginBottom: 16, fontSize: 13 }}>{success}</div>}

      {/* ── CODING PROBLEM TAB ── */}
      {activeTab === 'coding' && (
        <div style={{ display: 'flex', gap: 24, flexDirection: 'column' }}>
          <div className="card" style={{ padding: 24 }}>
            {/* Form fields — light gray borders, near-black focus */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#A3A3A3', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.6 }}>Subject</label>
                <select value={subjectId} onChange={e => setSubjectId(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #E7E5E4', outline: 'none', fontSize: 13, fontFamily: 'inherit', color: '#1A1A1A', background: '#FAFAFA' }}>
                  <option value="dsa">Data Structures (C)</option>
                  <option value="oop">Object Oriented (C++)</option>
                  <option value="web-tech">Web Technologies (HTML/JS)</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#A3A3A3', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.6 }}>Difficulty</label>
                <select value={difficulty} onChange={e => setDifficulty(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #E7E5E4', outline: 'none', fontSize: 13, fontFamily: 'inherit', color: '#1A1A1A', background: '#FAFAFA' }}>
                  <option value="Easy">Easy (10 pts)</option>
                  <option value="Medium">Medium (25 pts)</option>
                  <option value="Hard">Hard (50 pts)</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#A3A3A3', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.6 }}>Problem Topic / Prompt</label>
              <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Write a program to reverse a linked list..." style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #E7E5E4', outline: 'none', fontSize: 13, fontFamily: 'inherit', color: '#1A1A1A' }} />
            </div>

            {/* Primary button — solid black, no green gradient */}
            <button onClick={handleGenerateCode} disabled={loadingCode || !topic.trim()} style={{
              background: (loadingCode || !topic.trim()) ? '#D4D4D4' : '#111111', color: 'white', border: 'none', padding: '9px 18px',
              borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: (loadingCode || !topic.trim()) ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'inherit', transition: 'background 150ms'
            }}>
              {loadingCode ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={14} />}
              {loadingCode ? 'Generating...' : 'Generate Problem'}
            </button>
          </div>

          {generatedProblem && (
            <div className="card" style={{ padding: 24, border: '1px solid #D4D4D4' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#A3A3A3', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 }}>AI Generated Preview</div>
                  <h3 style={{ fontSize: 17, fontWeight: 600, color: '#1A1A1A' }}>{generatedProblem.title}</h3>
                </div>
                <span style={{ padding: '3px 10px', borderRadius: 4, fontSize: 11, fontWeight: 500, background: '#F5F5F4', color: '#525252', border: '1px solid #E7E5E4' }}>
                  {generatedProblem.difficulty} · {generatedProblem.points} pts
                </span>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 600, fontSize: 11, color: '#A3A3A3', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 }}>Objective</div>
                <div style={{ fontSize: 13, color: '#525252', background: '#FAFAFA', padding: 10, borderRadius: 6, border: '1px solid #E7E5E4' }}>{generatedProblem.objective}</div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 600, fontSize: 11, color: '#A3A3A3', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 }}>Requirements</div>
                <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, color: '#525252', background: '#FAFAFA', padding: '10px 10px 10px 28px', borderRadius: 6, border: '1px solid #E7E5E4' }}>
                  {generatedProblem.requirements.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, fontSize: 11, color: '#A3A3A3', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 }}>Starter Code</div>
                <pre style={{ background: '#161618', color: '#D4D4D4', padding: 12, borderRadius: 8, fontSize: 12, overflowX: 'auto', margin: 0, fontFamily: "'Fira Code', monospace" }}>
                  {generatedProblem.starter_code}
                </pre>
              </div>
              {/* Primary button — solid black */}
              <button onClick={handleSaveCode} disabled={savingCode} style={{
                background: savingCode ? '#D4D4D4' : '#111111', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                cursor: savingCode ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 7, width: '100%', justifyContent: 'center', fontFamily: 'inherit'
              }}>
                {savingCode ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />}
                {savingCode ? 'Saving...' : 'Approve & Publish to Question Bank'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── LIVE QUIZ TAB ── */}
      {activeTab === 'quiz' && (
        <div style={{ display: 'flex', gap: 24, flexDirection: 'column' }}>
          
          {/* My Scheduled Quizzes — solid hairline border, no dashed lavender */}
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', marginBottom: 14 }}>My Scheduled Quizzes</h3>
            {loadingQuizzes ? (
              <div style={{ color: '#A3A3A3', fontSize: 13 }}>Loading...</div>
            ) : scheduledQuizzes.length === 0 ? (
              <div style={{ color: '#A3A3A3', fontSize: 13 }}>No quizzes scheduled yet. Create one below.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {scheduledQuizzes.map(sq => (
                  <div key={sq.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FAFAFA', padding: '10px 14px', borderRadius: 8, border: '1px solid #E7E5E4' }}>
                    <div>
                      <div style={{ fontWeight: 500, color: '#1A1A1A', fontSize: 13 }}>{sq.title}</div>
                      <div style={{ fontSize: 11, color: '#A3A3A3', marginTop: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {new Date(sq.scheduled_for).toLocaleString()}
                        {/* Status via icon, not color */}
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontWeight: 500, color: '#525252' }}>
                          · {sq.status === 'Completed' ? '✓' : '◦'} {sq.status}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {/* Delete — secondary/outlined, no red */}
                      <button onClick={() => handleDeleteQuiz(sq.id)} style={{
                        background: 'transparent', color: '#525252', border: '1px solid #E7E5E4', padding: '6px 10px', borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'inherit', transition: 'background 150ms'
                      }} onMouseEnter={e => { e.currentTarget.style.background = '#F5F5F4'; e.currentTarget.style.borderColor = '#D4D4D4' }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#E7E5E4' }}>
                        <Trash2 size={13} /> Delete
                      </button>
                      {sq.status !== 'Completed' && (
                        /* Host — primary, solid black */
                        <button onClick={() => navigate(`/teacher/host/${sq.id}`)} style={{
                          background: '#111111', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'inherit'
                        }}>
                          <Play size={12} /> Host
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quiz Details Form */}
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', marginBottom: 14 }}>Quiz Details</h3>

            {/* Quiz form — gray borders, no purple */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <div style={{ flex: 2 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#A3A3A3', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.6 }}>Quiz Title</label>
                <input type="text" value={quizTitle} onChange={e => setQuizTitle(e.target.value)} placeholder="e.g. Midterm Prep Quiz" style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #E7E5E4', outline: 'none', fontSize: 13, fontFamily: 'inherit' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#A3A3A3', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.6 }}>Subject</label>
                <select value={quizSubject} onChange={e => setQuizSubject(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #E7E5E4', outline: 'none', fontFamily: 'inherit', fontSize: 13, background: '#FAFAFA' }}>
                  <option value="dsa">Data Structures</option>
                  <option value="oop">Object Oriented</option>
                  <option value="discrete-math">Discrete Math</option>
                  <option value="web-tech">Web Technologies</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#A3A3A3', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.6 }}>Date</label>
                <input type="date" value={quizDate} onChange={e => setQuizDate(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #E7E5E4', outline: 'none', fontSize: 13, fontFamily: 'inherit' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#A3A3A3', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.6 }}>Time</label>
                <input type="time" value={quizTime} onChange={e => setQuizTime(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #E7E5E4', outline: 'none', fontSize: 13, fontFamily: 'inherit' }} />
              </div>
            </div>
          </div>

          {/* Manual Questions Editor */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>Questions ({quizQuestions.length})</h3>
              {/* Add Question — secondary outlined, no green */}
              <button onClick={handleAddManualQuestion} style={{
                background: 'transparent', color: '#525252', border: '1px solid #E7E5E4', padding: '6px 12px', borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'inherit', transition: 'background 150ms'
              }} onMouseEnter={e => e.currentTarget.style.background = '#F5F5F4'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <Plus size={13} /> Add Question
              </button>
            </div>

            {quizQuestions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 20px', color: '#A3A3A3', border: '1px solid #E7E5E4', borderRadius: 8, fontSize: 12 }}>
                No questions yet. Click "Add Question" to begin.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {quizQuestions.map((q, qIndex) => (
                  <div key={qIndex} style={{ padding: 16, border: '1px solid #E7E5E4', borderRadius: 8, background: '#FAFAFA', position: 'relative' }}>
                    {/* Remove — plain icon button, no red */}
                    <button onClick={() => handleRemoveQuestion(qIndex)} style={{
                      position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: '#A3A3A3', cursor: 'pointer', padding: 4, transition: 'color 150ms'
                    }} onMouseEnter={e => e.currentTarget.style.color = '#1A1A1A'} onMouseLeave={e => e.currentTarget.style.color = '#A3A3A3'}>
                      <Trash2 size={15} />
                    </button>
                    
                    <div style={{ marginBottom: 16, paddingRight: 32 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#525252' }}>Question {qIndex + 1}</label>
                        {/* AI Options — outlined secondary */}
                        <button 
                          onClick={() => handleGenerateOptions(qIndex, q.q)}
                          disabled={generatingOptionsIdx === qIndex || !q.q.trim()}
                          style={{
                            background: 'transparent', color: '#525252', border: '1px solid #E7E5E4', padding: '3px 9px', borderRadius: 6, fontSize: 11, fontWeight: 500, cursor: (generatingOptionsIdx === qIndex || !q.q.trim()) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 4, opacity: (generatingOptionsIdx === qIndex || !q.q.trim()) ? 0.5 : 1, fontFamily: 'inherit'
                          }}
                        >
                          {generatingOptionsIdx === qIndex ? <Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={11} />}
                          {generatingOptionsIdx === qIndex ? 'Generating...' : 'AI Options'}
                        </button>
                      </div>
                      <textarea value={q.q} onChange={e => handleUpdateQuestion(qIndex, 'q', e.target.value)} placeholder="Type the question here..." style={{
                        width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', outline: 'none', fontSize: 14, minHeight: 60, resize: 'vertical'
                      }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      {q.opts.map((opt, optIndex) => (
                        <div key={optIndex} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <input type="radio" name={`ans-${qIndex}`} checked={q.ans === optIndex} onChange={() => handleUpdateQuestion(qIndex, 'ans', optIndex)} style={{ cursor: 'pointer' }} />
                          <input type="text" value={opt} onChange={e => handleUpdateQuestion(qIndex, 'opts', e.target.value, optIndex)} placeholder={`Option ${optIndex + 1}`} style={{
                            flex: 1, padding: '7px 10px', borderRadius: 6, border: q.ans === optIndex ? '2px solid #1A1A1A' : '1px solid #E7E5E4', outline: 'none', fontSize: 12, background: 'white', fontFamily: 'inherit'
                          }} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Schedule Quiz — primary solid black */}
          <button onClick={handleScheduleQuiz} disabled={savingQuiz || quizQuestions.length === 0} style={{
            background: (savingQuiz || quizQuestions.length === 0) ? '#D4D4D4' : '#111111',
            color: 'white', border: 'none', padding: '12px 20px', borderRadius: 8, fontSize: 14, fontWeight: 500,
            cursor: (savingQuiz || quizQuestions.length === 0) ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 7, width: '100%', justifyContent: 'center', fontFamily: 'inherit'
          }}>
            {savingQuiz ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Calendar size={16} />}
            {savingQuiz ? 'Scheduling...' : `Schedule Live Quiz (${quizQuestions.length} Questions)`}
          </button>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
