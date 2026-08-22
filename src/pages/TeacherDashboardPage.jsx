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
    const apiKey = import.meta.env.VITE_GROQ_API_KEY
    if (!apiKey) {
      throw new Error("Groq API key is missing. Add VITE_GROQ_API_KEY to your .env file.")
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

    const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "qwen/qwen3.6-27b",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      })
    })

    if (!response.ok) {
      const errData = await response.json()
      throw new Error(errData?.error?.message || 'Failed to connect to Groq API')
    }

    const data = await response.json()
    
    // With response_format: { type: "json_object" }, the API guarantees valid JSON output.
    // The Qwen reasoning is safely separated into data.choices[0].message.reasoning
    const parsed = JSON.parse(data.choices[0].message.content)
    
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
      const questionsToInsert = quizQuestions.map(q => ({
        quiz_id: quizData.id,
        question_text: q.q,
        options: q.opts,
        correct_answer_index: q.ans
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
    } catch (err) {
      setError('Failed to schedule quiz: ' + err.message)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setSavingQuiz(false)
      loadScheduledQuizzes()
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
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1e1b4b', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Target size={28} color="#6c47ff" /> Teacher Portal
        </h1>
        <p style={{ fontSize: 14, color: '#6b7280', marginTop: 6 }}>
          Manage your curriculum by scheduling live quizzes and adding coding problems.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 20, borderBottom: '2px solid #e8e4ff', marginBottom: 24 }}>
        <button onClick={() => setActiveTab('coding')} style={{
          background: 'none', border: 'none', padding: '12px 16px', fontSize: 15, fontWeight: 700,
          color: activeTab === 'coding' ? '#6c47ff' : '#9ca3af',
          borderBottom: activeTab === 'coding' ? '3px solid #6c47ff' : '3px solid transparent',
          cursor: 'pointer', marginBottom: -2, display: 'flex', alignItems: 'center', gap: 8
        }}>
          <Code2 size={18} /> Question Bank Generator
        </button>
        <button onClick={() => setActiveTab('quiz')} style={{
          background: 'none', border: 'none', padding: '12px 16px', fontSize: 15, fontWeight: 700,
          color: activeTab === 'quiz' ? '#6c47ff' : '#9ca3af',
          borderBottom: activeTab === 'quiz' ? '3px solid #6c47ff' : '3px solid transparent',
          cursor: 'pointer', marginBottom: -2, display: 'flex', alignItems: 'center', gap: 8
        }}>
          <Calendar size={18} /> Live Quiz Scheduler
        </button>
      </div>

      {/* Messages */}
      {error && <div style={{ padding: 16, background: '#fef2f2', color: '#dc2626', borderRadius: 12, border: '1px solid #fecaca', marginBottom: 20 }}>{error}</div>}
      {success && <div style={{ padding: 16, background: '#ecfdf5', color: '#059669', borderRadius: 12, border: '1px solid #a7f3d0', marginBottom: 20 }}>{success}</div>}

      {/* ── CODING PROBLEM TAB ── */}
      {activeTab === 'coding' && (
        <div style={{ display: 'flex', gap: 24, flexDirection: 'column' }}>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e1b4b', marginBottom: 16 }}>Generate Coding Problem</h3>
            
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4b5563', marginBottom: 6 }}>Subject</label>
                <select value={subjectId} onChange={e => setSubjectId(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e5e7eb', outline: 'none' }}>
                  <option value="dsa">Data Structures (C)</option>
                  <option value="oop">Object Oriented (C++)</option>
                  <option value="web-tech">Web Technologies (HTML/JS)</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4b5563', marginBottom: 6 }}>Difficulty</label>
                <select value={difficulty} onChange={e => setDifficulty(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e5e7eb', outline: 'none' }}>
                  <option value="Easy">Easy (10 pts)</option>
                  <option value="Medium">Medium (25 pts)</option>
                  <option value="Hard">Hard (50 pts)</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4b5563', marginBottom: 6 }}>Problem Topic / Prompt</label>
              <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Write a program to reverse a linked list..." style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e5e7eb', outline: 'none', fontSize: 15 }} />
            </div>

            <button onClick={handleGenerateCode} disabled={loadingCode || !topic.trim()} style={{
              background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: (loadingCode || !topic.trim()) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, opacity: (loadingCode || !topic.trim()) ? 0.7 : 1
            }}>
              {loadingCode ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={16} />} 
              {loadingCode ? 'Generating with AI...' : 'Generate Problem'}
            </button>
          </div>

          {generatedProblem && (
            <div className="card" style={{ padding: 24, border: '2px solid #6c47ff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#6c47ff', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>AI Generated Preview</div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: '#1e1b4b' }}>{generatedProblem.title}</h3>
                </div>
                <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: '#f5f3ff', color: '#6c47ff' }}>
                  {generatedProblem.difficulty} ({generatedProblem.points} pts)
                </span>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#4b5563', marginBottom: 4 }}>Objective</div>
                <div style={{ fontSize: 14, color: '#374151', background: '#f9fafb', padding: 12, borderRadius: 8 }}>{generatedProblem.objective}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#4b5563', marginBottom: 4 }}>Requirements</div>
                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: '#374151', background: '#f9fafb', padding: 12, borderRadius: 8 }}>
                  {generatedProblem.requirements.map((r, i) => <li key={i} style={{ marginLeft: 16 }}>{r}</li>)}
                </ul>
              </div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#4b5563', marginBottom: 4 }}>Starter Code</div>
                <pre style={{ background: '#1e1e2e', color: '#cdd6f4', padding: 12, borderRadius: 8, fontSize: 13, overflowX: 'auto', margin: 0 }}>
                  {generatedProblem.starter_code}
                </pre>
              </div>
              <button onClick={handleSaveCode} disabled={savingCode} style={{
                background: 'linear-gradient(135deg, #6c47ff, #a855f7)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: savingCode ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, width: '100%', justifyContent: 'center'
              }}>
                {savingCode ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />} 
                {savingCode ? 'Saving to Database...' : 'Approve & Publish to Question Bank'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── LIVE QUIZ TAB ── */}
      {activeTab === 'quiz' && (
        <div style={{ display: 'flex', gap: 24, flexDirection: 'column' }}>
          
          {/* List of Scheduled Quizzes */}
          <div className="card" style={{ padding: 24, background: '#f5f3ff', border: '2px dashed #c4b5fd' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e1b4b', marginBottom: 16 }}>My Scheduled Quizzes</h3>
            {loadingQuizzes ? (
              <div style={{ color: '#6b7280', fontSize: 14 }}>Loading...</div>
            ) : scheduledQuizzes.length === 0 ? (
              <div style={{ color: '#6b7280', fontSize: 14 }}>You haven't scheduled any quizzes yet. Create one below!</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {scheduledQuizzes.map(sq => (
                  <div key={sq.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '12px 16px', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#1e1b4b', fontSize: 15 }}>{sq.title}</div>
                      <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                        {new Date(sq.scheduled_for).toLocaleString()} • Status: <span style={{ color: sq.status === 'Completed' ? '#059669' : '#f59e0b', fontWeight: 600 }}>{sq.status}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleDeleteQuiz(sq.id)} style={{
                        background: 'transparent', color: '#ef4444', border: '1px solid #fca5a5', padding: '8px 12px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s'
                      }} onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <Trash2 size={14} /> Delete
                      </button>
                      {sq.status !== 'Completed' && (
                        <button onClick={() => navigate(`/teacher/host/${sq.id}`)} style={{
                          background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                        }}>
                          <Play size={14} fill="white" /> Host
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quiz Details Form */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e1b4b', marginBottom: 16 }}>Quiz Details</h3>
            
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <div style={{ flex: 2 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4b5563', marginBottom: 6 }}>Quiz Title</label>
                <input type="text" value={quizTitle} onChange={e => setQuizTitle(e.target.value)} placeholder="e.g. Midterm Prep Quiz" style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e5e7eb', outline: 'none', fontSize: 14 }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4b5563', marginBottom: 6 }}>Subject</label>
                <select value={quizSubject} onChange={e => setQuizSubject(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e5e7eb', outline: 'none' }}>
                  <option value="dsa">Data Structures</option>
                  <option value="oop">Object Oriented</option>
                  <option value="discrete-math">Discrete Math</option>
                  <option value="web-tech">Web Technologies</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4b5563', marginBottom: 6 }}>Date</label>
                <input type="date" value={quizDate} onChange={e => setQuizDate(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e5e7eb', outline: 'none', fontSize: 14 }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4b5563', marginBottom: 6 }}>Time</label>
                <input type="time" value={quizTime} onChange={e => setQuizTime(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e5e7eb', outline: 'none', fontSize: 14 }} />
              </div>
            </div>
          </div>

          {/* Manual Questions Editor */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e1b4b' }}>Questions ({quizQuestions.length})</h3>
              <button onClick={handleAddManualQuestion} style={{
                background: '#ecfdf5', color: '#059669', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
              }}>
                <Plus size={14} /> Add Question
              </button>
            </div>

            {quizQuestions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af', border: '2px dashed #e5e7eb', borderRadius: 12 }}>
                No questions yet. Click "Add Question" to begin.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {quizQuestions.map((q, qIndex) => (
                  <div key={qIndex} style={{ padding: 20, border: '1px solid #e5e7eb', borderRadius: 12, background: '#f9fafb', position: 'relative' }}>
                    <button onClick={() => handleRemoveQuestion(qIndex)} style={{
                      position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 4
                    }}>
                      <Trash2 size={16} />
                    </button>
                    
                    <div style={{ marginBottom: 16, paddingRight: 32 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <label style={{ fontSize: 13, fontWeight: 700, color: '#1e1b4b' }}>Question {qIndex + 1}</label>
                        <button 
                          onClick={() => handleGenerateOptions(qIndex, q.q)}
                          disabled={generatingOptionsIdx === qIndex || !q.q.trim()}
                          style={{
                            background: '#f5f3ff', color: '#6c47ff', border: '1px solid #e8e4ff', padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: (generatingOptionsIdx === qIndex || !q.q.trim()) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 4, opacity: (generatingOptionsIdx === qIndex || !q.q.trim()) ? 0.6 : 1
                          }}
                        >
                          {generatingOptionsIdx === qIndex ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={12} />}
                          {generatingOptionsIdx === qIndex ? 'Generating...' : 'AI Generate Options'}
                        </button>
                      </div>
                      <textarea value={q.q} onChange={e => handleUpdateQuestion(qIndex, 'q', e.target.value)} placeholder="Type the question here..." style={{
                        width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', outline: 'none', fontSize: 14, minHeight: 60, resize: 'vertical'
                      }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      {q.opts.map((opt, optIndex) => (
                        <div key={optIndex} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <input type="radio" name={`ans-${qIndex}`} checked={q.ans === optIndex} onChange={() => handleUpdateQuestion(qIndex, 'ans', optIndex)} style={{ cursor: 'pointer' }} />
                          <input type="text" value={opt} onChange={e => handleUpdateQuestion(qIndex, 'opts', e.target.value, optIndex)} placeholder={`Option ${optIndex + 1}`} style={{
                            flex: 1, padding: '8px 12px', borderRadius: 6, border: q.ans === optIndex ? '2px solid #10b981' : '1px solid #d1d5db', outline: 'none', fontSize: 13, background: 'white'
                          }} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button onClick={handleScheduleQuiz} disabled={savingQuiz || quizQuestions.length === 0} style={{
            background: 'linear-gradient(135deg, #6c47ff, #a855f7)', color: 'white', border: 'none', padding: '14px 24px', borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: (savingQuiz || quizQuestions.length === 0) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, width: '100%', justifyContent: 'center', opacity: (savingQuiz || quizQuestions.length === 0) ? 0.7 : 1
          }}>
            {savingQuiz ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Calendar size={18} />} 
            {savingQuiz ? 'Scheduling...' : `Schedule Live Quiz (${quizQuestions.length} Questions)`}
          </button>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
