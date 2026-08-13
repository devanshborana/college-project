import { useState } from 'react'
import { Search, CheckCircle, Clock, Circle, Filter, ArrowLeft, Code2, Play, Loader2 } from 'lucide-react'

import { subjectDetails } from '../data/subjectDetails'

const allProblems = Object.entries(subjectDetails).flatMap(([subjId, data]) => {
  if (!data.codingProblems) return []
  return data.codingProblems.map(p => ({
    ...p,
    course: subjId === 'dsa' ? 'Data Structures (C)' : subjId === 'oop' ? 'Object Oriented (C++)' : subjId === 'web-tech' ? 'Web Technologies' : subjId.toUpperCase(),
    lang: subjId === 'oop' ? 'c++' : subjId === 'web-tech' ? 'html' : 'c',
    points: p.difficulty === 'Easy' ? 10 : p.difficulty === 'Medium' ? 25 : 50,
  }))
})

const courses = ['Data Structures (C)', 'Object Oriented (C++)', 'Web Technologies']

function DiffBadge({ diff }) {
  const cls = { Easy: 'diff-easy', Medium: 'diff-medium', Hard: 'diff-hard' }
  return <span className={`difficulty-badge ${cls[diff]}`}>{diff}</span>
}

function StatusBadge({ status }) {
  const map = {
    Solved: { cls: 'status-solved', icon: <CheckCircle size={11} /> },
    'In Progress': { cls: 'status-progress', icon: <Clock size={11} /> },
    'Not Attempted': { cls: 'status-not', icon: <Circle size={11} /> },
  }
  const { cls, icon } = map[status] || map['Not Attempted']
  return <span className={`status-badge ${cls}`}>{icon} {status}</span>
}

const getSkeleton = (lang) => {
  if (lang === 'c++') return '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ code here\n    \n    return 0;\n}'
  if (lang === 'html') return '<!-- Write your HTML/CSS/JS code here -->\n\n'
  return '#include <stdio.h>\n\nint main() {\n    // Write your C code here\n    \n    return 0;\n}'
}

export default function ProblemSetPage() {
  const [solvedIds, setSolvedIds] = useState([])
  const [inProgressIds, setInProgressIds] = useState([])
  const [submissions, setSubmissions] = useState([]) // array of { id, probId, status, timestamp }
  const [activeProblem, setActiveProblem] = useState(null)
  const [activeTab, setActiveTab] = useState('description')
  
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState([])
  const [diffFilter, setDiffFilter] = useState([])
  const [courseFilter, setCourseFilter] = useState([])
  
  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)

  const problems = allProblems.map(p => ({
    ...p,
    status: solvedIds.includes(p.id) ? 'Solved' : inProgressIds.includes(p.id) ? 'In Progress' : 'Not Attempted'
  }))

  const toggle = (arr, val, setter) => {
    setter(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
  }

  const filtered = problems.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter.length === 0 || statusFilter.includes(p.status)
    const matchDiff = diffFilter.length === 0 || diffFilter.includes(p.difficulty)
    const matchCourse = courseFilter.length === 0 || courseFilter.includes(p.course)
    return matchSearch && matchStatus && matchDiff && matchCourse
  })

  const solved = problems.filter(p => p.status === 'Solved').length

  const handleRunCode = async () => {
    if (!code || code.trim() === '' || code.trim() === getSkeleton(activeProblem.lang).trim()) {
      setOutput('Please write your code first before running.')
      return
    }

    if (!solvedIds.includes(activeProblem.id) && !inProgressIds.includes(activeProblem.id)) {
      setInProgressIds([...inProgressIds, activeProblem.id])
    }

    if (activeProblem.lang === 'html') {
      setIsRunning(true)
      setTimeout(() => {
        setOutput('Code rendered in browser preview.')
        // Mark as solved since it's subjective for HTML
        if (!solvedIds.includes(activeProblem.id)) {
          setSolvedIds([...solvedIds, activeProblem.id])
          setSubmissions([{ id: Date.now(), probId: activeProblem.id, status: 'Accepted', time: new Date().toLocaleTimeString() }, ...submissions])
        }
        setIsRunning(false)
      }, 500)
      return
    }

    setIsRunning(true)
    setOutput('Running...')
    try {
      const compilerMap = {
        'c++': 'gcc-13.2.0',
        'c': 'gcc-13.2.0-c',
      }
      const res = await fetch('https://wandbox.org/api/compile.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          compiler: compilerMap[activeProblem.lang] || 'gcc-13.2.0',
          code: code,
          save: false
        })
      })
      const data = await res.json()
      const result = data.program_output || data.compiler_error || data.program_error || ''
      
      let outText = result
      let isSuccess = false
      
      if (data.status !== '0' || data.compiler_error || data.program_error) {
        outText = `[Compilation/Runtime Error]\n${result}`
      } else {
        // Validation: check if output matches expected
        const userOut = result.trim()
        const expected = activeProblem.expectedOutput ? activeProblem.expectedOutput.trim() : ''
        
        if (expected && !userOut.includes(expected)) {
          outText = `[Wrong Answer]\n\nYour Output:\n${userOut}\n\nExpected Output to contain:\n${expected}`
        } else {
          outText = `[Accepted]\n\n${userOut}`
          isSuccess = true
        }
      }
      
      setOutput(outText)
      setSubmissions([{ id: Date.now(), probId: activeProblem.id, status: isSuccess ? 'Accepted' : 'Wrong Answer', time: new Date().toLocaleTimeString() }, ...submissions])
      
      if (isSuccess && !solvedIds.includes(activeProblem.id)) {
        setSolvedIds([...solvedIds, activeProblem.id])
      }

    } catch (err) {
      setOutput('Error running code: ' + err.message)
    } finally {
      setIsRunning(false)
    }
  }

  if (activeProblem) {
    return (
      <div style={{ padding: '24px', height: '100%' }}>
        <button onClick={() => setActiveProblem(null)} style={{
          display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
          color: '#6b7280', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 20
        }}>
          <ArrowLeft size={16} /> Back
        </button>

        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1e1b4b', marginBottom: 20 }}>Question Bank</h1>

        <div style={{ display: 'flex', gap: 20, height: 'calc(100vh - 200px)' }}>
          {/* Left Pane - Description */}
          <div style={{ flex: 1, background: 'white', borderRadius: 12, border: '1px solid #e8e4ff', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #e8e4ff', background: '#f5f3ff', overflowX: 'auto' }}>
              {['description', 'solution', 'submissions', 'discussions'].map(t => (
                <div key={t} onClick={() => setActiveTab(t)} style={{
                  padding: '14px 20px', cursor: 'pointer', textTransform: 'capitalize', whiteSpace: 'nowrap',
                  borderBottom: activeTab === t ? '2px solid #6c47ff' : '2px solid transparent',
                  color: activeTab === t ? '#6c47ff' : '#9ca3af',
                  fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8,
                  transition: 'all 0.2s'
                }}>
                  {t === 'description' && <Code2 size={16} />}
                  {t === 'solution' && '</> '}
                  {t}
                </div>
              ))}
            </div>
            
            <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
              {activeTab === 'description' && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1e1b4b', margin: 0 }}>{activeProblem.title}</h2>
                    <DiffBadge diff={activeProblem.difficulty} />
                    {solvedIds.includes(activeProblem.id) && <CheckCircle size={18} color="#059669" />}
                  </div>
                  
                  <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.6, marginBottom: 24 }}>
                    <div style={{ fontWeight: 700, marginBottom: 8, color: '#1e1b4b' }}>Objective</div>
                    {activeProblem.objective || activeProblem.desc || 'Complete the function to solve this problem.'}
                  </div>

                  {activeProblem.requirements && (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ fontWeight: 700, marginBottom: 8, color: '#1e1b4b' }}>Requirements</div>
                      <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: '#4b5563', lineHeight: 1.6 }}>
                        {activeProblem.requirements.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1e1b4b', marginBottom: 12 }}>Expected Output:</div>
                    <pre style={{
                      background: '#f1f5f9', color: '#1e1b4b', padding: 16, borderRadius: 10,
                      border: 'none', fontFamily: "'Fira Code', monospace", fontSize: 13,
                      margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6
                    }}>
                      {activeProblem.expectedOutput || activeProblem.output || 'No output specified.'}
                    </pre>
                  </div>
                </>
              )}

              {activeTab === 'solution' && (
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e1b4b', marginBottom: 12 }}>How to solve this</h3>
                  <div style={{ padding: 16, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, color: '#92400e', fontSize: 14, lineHeight: 1.6 }}>
                    <strong>Hint:</strong> Look closely at the requirements for {activeProblem.title}. <br/><br/>
                    {activeProblem.requirements ? activeProblem.requirements.join(' ') : 'Break the problem down into smaller steps. First, define the main function. Then implement the core logic iterating through the inputs. Make sure to test your code frequently.'}
                  </div>
                </div>
              )}

              {activeTab === 'submissions' && (
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e1b4b', marginBottom: 16 }}>Your Submissions</h3>
                  {submissions.filter(s => s.probId === activeProblem.id).length === 0 ? (
                    <p style={{ color: '#6b7280', fontSize: 14 }}>No submissions yet for this problem.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {submissions.filter(s => s.probId === activeProblem.id).map(s => (
                        <div key={s.id} style={{ padding: 12, borderRadius: 8, border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 700, fontSize: 14, color: s.status === 'Accepted' ? '#059669' : '#dc2626' }}>{s.status}</span>
                          <span style={{ color: '#9ca3af', fontSize: 12 }}>{s.time}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'discussions' && (
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e1b4b', marginBottom: 16 }}>Class Discussion</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 }}>JS</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>John Smith <span style={{ color: '#9ca3af', fontWeight: 400, marginLeft: 8 }}>2 hours ago</span></div>
                        <p style={{ fontSize: 14, color: '#4b5563', margin: '4px 0 0 0' }}>I am getting a segmentation fault on Example 1, anyone know why?</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#fce7f3', color: '#be185d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 }}>AS</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>Alice Sharma <span style={{ color: '#9ca3af', fontWeight: 400, marginLeft: 8 }}>1 hour ago</span></div>
                        <p style={{ fontSize: 14, color: '#4b5563', margin: '4px 0 0 0' }}>Check your array bounds in the loop. It usually happens if you iterate to <code>i &lt;= n</code> instead of <code>i &lt; n</code>.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Pane - Actual Editor */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#1e1e2e', borderRadius: 12, border: '1px solid #e8e4ff', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', background: '#181825', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#cdd6f4', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Code2 size={16} color="#89b4fa" /> Code Editor ({activeProblem.lang === 'c++' ? 'C++' : activeProblem.lang === 'html' ? 'HTML/JS' : 'C'})
              </div>
              <button onClick={handleRunCode} disabled={isRunning} style={{
                background: '#a6e3a1', border: 'none', padding: '6px 14px', borderRadius: 8,
                fontSize: 12, fontWeight: 800, color: '#11111b', cursor: isRunning ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s',
                opacity: isRunning ? 0.7 : 1
              }}>
                {isRunning ? <Loader2 size={14} className="spin" /> : <Play size={14} />} 
                {isRunning ? 'Running...' : 'Run Code'}
              </button>
            </div>
            
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              spellCheck="false"
              placeholder={`// Write your ${activeProblem.lang === 'c++' ? 'C++' : activeProblem.lang === 'html' ? 'HTML/CSS/JS' : 'C'} solution here...`}
              style={{
                flex: 1, width: '100%', background: 'transparent', border: 'none', color: '#cdd6f4',
                padding: 20, fontSize: 14, fontFamily: "'Fira Code', monospace", lineHeight: 1.6,
                resize: 'none', outline: 'none'
              }}
            />

            {/* Output terminal / Browser preview */}
            <div style={{ height: activeProblem.lang === 'html' ? '50%' : 200, background: '#11111b', borderTop: '1px solid #313244', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '8px 16px', fontSize: 11, fontWeight: 700, color: '#a6adc8', textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #313244' }}>
                {activeProblem.lang === 'html' ? 'Browser Preview' : 'Console Output'}
              </div>
              {activeProblem.lang === 'html' ? (
                <iframe
                  title="preview"
                  srcDoc={code}
                  style={{ width: '100%', height: '100%', border: 'none', background: 'white' }}
                  sandbox="allow-scripts"
                />
              ) : (
                <pre style={{
                  margin: 0, padding: 16, fontSize: 13, fontFamily: "'Fira Code', monospace", color: '#a6e3a1',
                  flex: 1, overflowY: 'auto', whiteSpace: 'pre-wrap'
                }}>
                  {output}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px 24px' }}>
      {/* Page title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#1e1b4b', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Coding Problem Set
        </h1>
        <div style={{
          width: 22, height: 22, borderRadius: '50%', background: '#e8e4ff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, color: '#6c47ff', fontWeight: 700, cursor: 'pointer'
        }}>?</div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: `${solved} Solved`, color: '#22c55e', bg: '#ecfdf5' },
          { label: `${problems.filter(p => p.status === 'In Progress').length} In Progress`, color: '#3b82f6', bg: '#eff6ff' },
          { label: `${problems.filter(p => p.status === 'Not Attempted').length} Not Attempted`, color: '#6b7280', bg: '#f9fafb' },
          { label: `${problems.length} Total`, color: '#6c47ff', bg: '#f5f3ff' },
        ].map(s => (
          <div key={s.label} style={{
            padding: '6px 16px', borderRadius: 20, background: s.bg,
            fontSize: 12, fontWeight: 600, color: s.color
          }}>{s.label}</div>
        ))}
      </div>

      <div className="problem-set-layout">
        {/* Table */}
        <div>
          {/* Search */}
          <div className="search-bar">
            <Search size={15} color="#9ca3af" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by question name..."
            />
          </div>

          <div className="problems-table">
            <div className="problems-table-header">
              <div>Problem</div>
              <div>Difficulty</div>
              <div>Status</div>
              <div style={{ textAlign: 'right' }}>Points</div>
            </div>
            {filtered.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>
                No problems match your filters.
              </div>
            ) : (
              filtered.map(p => (
                <div key={p.id} onClick={() => { 
                  setActiveProblem(p); 
                  setActiveTab('description'); 
                  setCode(getSkeleton(p.lang)); 
                  setOutput('');
                }} className="problem-row fade-in-up" style={{ cursor: 'pointer' }}>
                  <div>
                    <div className="problem-name">{p.title}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{p.course}</div>
                  </div>
                  <DiffBadge diff={p.difficulty} />
                  <StatusBadge status={p.status} />
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#6c47ff' }}>+{p.points} pts</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Filter Sidebar */}
        <div className="filter-sidebar">
          <div className="filter-section">
            <div className="filter-title">
              Status
              <button className="clear-all-btn" onClick={() => setStatusFilter([])}>Clear All</button>
            </div>
            {['Solved', 'In Progress', 'Not Attempted'].map(s => (
              <label key={s} className="filter-option">
                <input type="checkbox" checked={statusFilter.includes(s)} onChange={() => toggle(statusFilter, s, setStatusFilter)} />
                {s}
              </label>
            ))}
          </div>

          <div className="filter-section">
            <div className="filter-title">
              Difficulty Level
              <button className="clear-all-btn" onClick={() => setDiffFilter([])}>Clear</button>
            </div>
            {['Easy', 'Medium', 'Hard'].map(d => (
              <label key={d} className="filter-option">
                <input type="checkbox" checked={diffFilter.includes(d)} onChange={() => toggle(diffFilter, d, setDiffFilter)} />
                {d}
              </label>
            ))}
          </div>

          <div className="filter-section">
            <div className="filter-title">
              Course
              <button className="clear-all-btn" onClick={() => setCourseFilter([])}>Clear</button>
            </div>
            {courses.map(c => (
              <label key={c} className="filter-option">
                <input type="checkbox" checked={courseFilter.includes(c)} onChange={() => toggle(courseFilter, c, setCourseFilter)} />
                {c}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
