import { useState, useRef, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Play, Settings, Save, RotateCcw, Maximize2, Minimize2, Loader, Terminal, AlertCircle, CheckCircle, Copy, Check } from 'lucide-react'

// ── Language configs ─────────────────────────────────────────────────────────
const LANGUAGES = [
  {
    id: 'html',
    label: 'HTML / CSS / JS',
    pistonLang: null, // runs in browser iframe
    icon: '🌐',
    defaultCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Page</title>
  <style>
    body {
      font-family: 'Inter', sans-serif;
      background: linear-gradient(135deg, #f5f3ff, #ede9fe);
      display: flex; align-items: center;
      justify-content: center; min-height: 100vh;
      margin: 0;
    }
    h1 { color: #6c47ff; font-size: 2rem; }
    p  { color: #6b7280; }
  </style>
</head>
<body>
  <div>
    <h1>Hello, LMCST! 👋</h1>
    <p>Edit this code and click <b>Run</b>.</p>
  </div>
  <script>
    console.log('Hello from LMCST!');
  </script>
</body>
</html>`,
  },
  {
    id: 'python',
    label: 'Python',
    pistonLang: 'python',
    pistonVersion: '3.10.0',
    icon: '🐍',
    defaultCode: `# Python — runs on Piston API
def greet(name):
    return f"Hello, {name}! Welcome to LMCST 🎓"

students = ["Alice", "Bob", "Devansh", "Priya"]

for student in students:
    print(greet(student))

# Fibonacci series
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        print(a, end=" ")
        a, b = b, a + b

print("\\nFibonacci(10):")
fibonacci(10)
`,
  },
  {
    id: 'cpp',
    label: 'C++',
    pistonLang: 'c++',
    pistonVersion: '10.2.0',
    icon: '⚙️',
    defaultCode: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

// Bubble Sort Demo
void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - i - 1; j++)
            if (arr[j] > arr[j + 1])
                swap(arr[j], arr[j + 1]);
}

int main() {
    cout << "LMCST C++ Playground" << endl;

    vector<int> nums = {64, 25, 12, 22, 11};
    cout << "Before sort: ";
    for (int x : nums) cout << x << " ";

    bubbleSort(nums);
    cout << "\\nAfter sort:  ";
    for (int x : nums) cout << x << " ";
    cout << endl;

    return 0;
}
`,
  },
  {
    id: 'c',
    label: 'C',
    pistonLang: 'c',
    pistonVersion: '10.2.0',
    icon: '🔧',
    defaultCode: `#include <stdio.h>

// Factorial using recursion
long long factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

// Check prime
int isPrime(int n) {
    if (n < 2) return 0;
    for (int i = 2; i * i <= n; i++)
        if (n % i == 0) return 0;
    return 1;
}

int main() {
    printf("LMCST C Playground\\n\\n");

    printf("Factorials:\\n");
    for (int i = 1; i <= 10; i++)
        printf("  %2d! = %lld\\n", i, factorial(i));

    printf("\\nPrime numbers up to 50: ");
    for (int i = 2; i <= 50; i++)
        if (isPrime(i)) printf("%d ", i);
    printf("\\n");

    return 0;
}
`,
  },

]

// ── Piston API call ──────────────────────────────────────────────────────────
async function runOnPiston(lang, code) {
  const res = await fetch('https://emkc.org/api/v2/piston/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language: lang.pistonLang,
      version: lang.pistonVersion,
      files: [{ content: code }]
    })
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return await res.json()
}

// ── Component ────────────────────────────────────────────────────────────────
export default function PlaygroundPage() {
  const [searchParams] = useSearchParams()
  const isLocked = searchParams.get('locked') === 'true'
  const initLang = LANGUAGES.find(l => l.id === searchParams.get('lang')) || LANGUAGES[0]
  const visibleLanguages = isLocked ? [initLang] : LANGUAGES
  const [activeLang, setActiveLang] = useState(initLang)
  const [code, setCode] = useState(initLang.id === 'html' ? '' : initLang.defaultCode)
  const [htmlCode, setHtmlCode] = useState('<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>LMCST Playground</title>\n</head>\n<body>\n  <h1>Hello, LMCST! 👋</h1>\n  <p>Edit this code and click <b>Run</b>.</p>\n</body>\n</html>')
  const [cssCode, setCssCode] = useState('')
  const [jsCode, setJsCode] = useState('')
  const [webTab, setWebTab] = useState('html')
  
  const [htmlOutput, setHtmlOutput] = useState('')
  const [consoleOutput, setConsoleOutput] = useState(null) // { stdout, stderr, time }
  const [running, setRunning] = useState(false)
  const [runStatus, setRunStatus] = useState(null) // 'ok' | 'error' | null
  const [isFullscreen, setIsFullscreen] = useState(false)
  const textareaRef = useRef(null)
  const [isObscured, setIsObscured] = useState(false)

  // Anti-Cheat: Prevent Screenshots & Copying
  useEffect(() => {
    // 1. Obscure screen when window loses focus (Snipping tool, etc)
    const handleBlur = () => setIsObscured(true)
    const handleFocus = () => setIsObscured(false)

    // 2. Prevent right click
    const handleContextMenu = (e) => {
      e.preventDefault()
      alert("Right-click is disabled to prevent copying.")
    }

    // 3. Detect Print Screen & common screenshot shortcuts
    const handleKeyDown = async (e) => {
      if (e.key === 'PrintScreen' || (e.metaKey && e.shiftKey && (e.key === 's' || e.key === 'S' || e.key === '3' || e.key === '4'))) {
        e.preventDefault()
        try {
          await navigator.clipboard.writeText("Nice try! Screenshots are disabled in this coding assessment.")
        } catch(err) {}
        alert("Screenshots are disabled in the Playground to ensure academic integrity.")
      }
      
      // Also prevent Ctrl+C / Cmd+C for good measure if they select text
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault()
        alert("Copying code is disabled.")
      }
    }

    window.addEventListener('blur', handleBlur)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('contextmenu', handleContextMenu)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('contextmenu', handleContextMenu)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
  // Switch language
  const switchLang = (lang) => {
    setActiveLang(lang)
    if (lang.id !== 'html') {
      setCode(lang.defaultCode)
    }
    setConsoleOutput(null)
    setHtmlOutput('')
    setRunStatus(null)
  }

  // Tab key support
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const s = e.target.selectionStart
      const newCode = code.substring(0, s) + '  ' + code.substring(e.target.selectionEnd)
      setCode(newCode)
      setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = s + 2 }, 0)
    }
  }

  // Run code
  const runCode = useCallback(async () => {
    setRunning(true)
    setRunStatus(null)

    // HTML/CSS/JS — browser iframe
    if (activeLang.id === 'html') {
      let combinedHTML = htmlCode || '';
      
      if (cssCode) {
        if (combinedHTML.includes('</head>')) {
          combinedHTML = combinedHTML.replace('</head>', `<style>\n${cssCode}\n</style>\n</head>`);
        } else {
          combinedHTML = `<style>\n${cssCode}\n</style>\n` + combinedHTML;
        }
      }
      
      if (jsCode) {
        if (combinedHTML.includes('</body>')) {
          combinedHTML = combinedHTML.replace('</body>', `<script>\n${jsCode}\n</script>\n</body>`);
        } else {
          combinedHTML = combinedHTML + `\n<script>\n${jsCode}\n</script>`;
        }
      }

      setHtmlOutput(combinedHTML)
      setConsoleOutput(null)
      setRunning(false)
      setRunStatus('ok')
      return
    }

    // All other languages — Piston API
    const t0 = Date.now()
    try {
      const result = await runOnPiston(activeLang, code)
      const elapsed = ((Date.now() - t0) / 1000).toFixed(2)
      const { stdout = '', stderr = '' } = result.run
      setConsoleOutput({ stdout, stderr, elapsed })
      setRunStatus(stderr && !stdout ? 'error' : 'ok')
    } catch (err) {
      setConsoleOutput({ stdout: '', stderr: `Network error: ${err.message}`, elapsed: '—' })
      setRunStatus('error')
    } finally {
      setRunning(false)
    }
  }, [activeLang, code])

  const handleReset = () => {
    if (window.confirm("Are you sure? All your code will be permanently removed.")) {
      if (activeLang.id === 'html') {
        if (webTab === 'html') setHtmlCode('')
        else if (webTab === 'css') setCssCode('')
        else setJsCode('')
      } else {
        setCode('')
      }
      setConsoleOutput(null)
      setHtmlOutput('')
      setRunStatus(null)
    }
  }

  const lineCount = code.split('\n').length

  const wrapperStyle = isFullscreen 
    ? { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: '#faf9ff', padding: '16px' }
    : { padding: '12px 16px', height: 'calc(100vh - 110px)' }

  return (
    <div style={{ ...wrapperStyle, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {isObscured && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100000, background: 'rgba(0,0,0,0.9)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10, backdropFilter: 'blur(10px)' }}>
          <AlertCircle size={48} color="#ef4444" />
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>Screenshots & Recording Disabled</h2>
          <p style={{ color: '#a1a1aa' }}>Please focus on the window to continue coding.</p>
        </div>
      )}

      {/* ── Top bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 14px', background: 'white', borderRadius: 12,
        border: '1px solid #E7E5E4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}>
        {/* Language pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          {visibleLanguages.map(lang => (
            <button key={lang.id}
              onClick={() => switchLang(lang)}
              style={{
                padding: '5px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: 500, transition: 'all 0.15s',
                userSelect: 'none', fontFamily: 'inherit',
                background: activeLang.id === lang.id ? '#1A1A1A' : '#FAFAFA',
                color: activeLang.id === lang.id ? '#FFFFFF' : '#525252',
                boxShadow: activeLang.id === lang.id ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              }}>
              {lang.icon} {lang.label}
            </button>
          ))}
          {isLocked && (
            <span style={{ fontSize: 11, fontWeight: 600, color: '#f59e0b',
              background: '#fffbeb', border: '1px solid #fde68a',
              userSelect: 'none',
              padding: '3px 10px', borderRadius: 20, marginLeft: 4 }}>
              🔒 Locked to {initLang.label}
            </span>
          )}
        </div>

        {/* Tool icons */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="icon-btn" title="Clear code" onClick={handleReset}><RotateCcw size={15} /></button>
          <button className="icon-btn" title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"} onClick={() => setIsFullscreen(!isFullscreen)}>
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {/* ── Main split pane ── */}
      <div style={{
        flex: 1, display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 10, minHeight: 0
      }}>

        {/* ── EDITOR ── */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          background: '#1e1e2e', borderRadius: 14, overflow: 'hidden',
          border: '1px solid #2d2b45'
        }}>
          {/* Editor header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 14px', background: '#181825', borderBottom: '1px solid #2d2b45'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>{activeLang.icon}</span>
              
              {activeLang.id === 'html' ? (
                <div style={{ display: 'flex', gap: 4 }}>
                  {['html', 'css', 'js'].map(t => (
                    <button key={t} onClick={() => setWebTab(t)} style={{
                      background: webTab === t ? '#313244' : 'transparent',
                      color: webTab === t ? '#89b4fa' : '#6c7086',
                      border: 'none', padding: '4px 10px', borderRadius: 6,
                      fontSize: 12, fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase',
                      transition: 'all 0.15s'
                    }}>
                      {t}
                    </button>
                  ))}
                </div>
              ) : (
                <span style={{ fontSize: 13, fontWeight: 600, color: '#cdd6f4' }}>{activeLang.label}</span>
              )}

              <span style={{ fontSize: 11, color: '#4a4a6a', background: '#252338', padding: '2px 8px', borderRadius: 20 }}>
                {activeLang.id === 'html' ? (webTab === 'html' ? htmlCode : webTab === 'css' ? cssCode : jsCode).split('\n').length : lineCount} lines
              </span>
            </div>
            {/* Coloured dots */}
            <div style={{ display: 'flex', gap: 5 }}>
              {['#ff5f57','#febc2e','#28c840'].map(c => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
              ))}
            </div>
          </div>

          {/* Code area */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {/* Line numbers */}
            <div style={{
              padding: '14px 8px', background: '#181825', color: '#3d3b5a',
              fontFamily: "'Fira Code', monospace", fontSize: 13, lineHeight: '1.7',
              textAlign: 'right', minWidth: 42, userSelect: 'none',
              borderRight: '1px solid #2d2b45', overflowY: 'hidden'
            }}>
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={activeLang.id === 'html' ? (webTab === 'html' ? htmlCode : webTab === 'css' ? cssCode : jsCode) : code}
              onChange={e => {
                if (activeLang.id === 'html') {
                  if (webTab === 'html') setHtmlCode(e.target.value)
                  else if (webTab === 'css') setCssCode(e.target.value)
                  else setJsCode(e.target.value)
                } else {
                  setCode(e.target.value)
                }
              }}
              onKeyDown={handleKeyDown}
              onPaste={e => {
                e.preventDefault()
                alert("Pasting code is disabled in the Playground to encourage typing and practice.")
              }}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              style={{
                flex: 1, background: '#1e1e2e', color: '#cdd6f4',
                border: 'none', outline: 'none',
                fontFamily: "'Fira Code', 'Courier New', monospace",
                fontSize: 13, lineHeight: '1.7', padding: '14px',
                resize: 'none', tabSize: 2, overflowY: 'auto'
              }}
            />
          </div>

          {/* Run button bar */}
          <div style={{
            padding: '10px 14px', background: '#181825',
            borderTop: '1px solid #2d2b45',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ fontSize: 11, color: '#A3A3A3' }}>
              {activeLang.pistonLang
                ? `Powered by Piston API · ${activeLang.pistonLang} ${activeLang.pistonVersion}`
                : 'Runs in browser sandbox'}
            </div>
            <button
              onClick={runCode}
              disabled={running}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '9px 22px',
                background: running ? '#525252' : '#FFFFFF',
                color: running ? '#FFFFFF' : '#1A1A1A', border: 'none', borderRadius: 50,
                fontSize: 13, fontWeight: 600, cursor: running ? 'not-allowed' : 'pointer',
                boxShadow: running ? 'none' : '0 2px 10px rgba(0,0,0,0.1)',
                transition: 'background 0.15s', fontFamily: 'inherit'
              }}
              onMouseEnter={e => { if(!running) e.target.style.background = '#F5F5F4' }}
              onMouseLeave={e => { if(!running) e.target.style.background = '#FFFFFF' }}
            >
              {running
                ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Running…</>
                : <><Play size={14} fill={running ? "white" : "#1A1A1A"} color={running ? "white" : "#1A1A1A"} /> Run Code</>}
            </button>
          </div>
        </div>

        {/* ── OUTPUT ── */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          background: '#FFFFFF', borderRadius: 14, overflow: 'hidden',
          border: '1px solid #E7E5E4'
        }}>
          {/* Output header */}
          <div style={{
            padding: '10px 16px', borderBottom: '1px solid #E7E5E4',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: '#FAFAFA'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Terminal size={15} color="#1A1A1A" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>
                {activeLang.id === 'html' ? 'Preview' : 'Console Output'}
              </span>
            </div>
            {runStatus && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600,
                color: runStatus === 'ok' ? '#059669' : '#dc2626' }}>
                {runStatus === 'ok'
                  ? <><CheckCircle size={13} /> Success</>
                  : <><AlertCircle size={13} /> Error</>}
              </div>
            )}
          </div>

          {/* Output body */}
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>

            {/* HTML iframe */}
            {activeLang.id === 'html' && htmlOutput && (
              <iframe
                srcDoc={htmlOutput}
                sandbox="allow-scripts allow-modals"
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="HTML Preview"
              />
            )}

            {/* Console output for other languages */}
            {activeLang.id !== 'html' && (
              <div style={{
                height: '100%', overflowY: 'auto', padding: 16,
                fontFamily: "'Fira Code', monospace", fontSize: 13,
                background: consoleOutput?.stderr && !consoleOutput?.stdout ? '#fff5f5' : '#FAFAFA'
              }}>
                {running && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#525252', padding: '20px 0' }}>
                    <Loader size={18} style={{ animation: 'spin 1s linear infinite', color: '#1A1A1A' }} />
                    <span>Compiling and running on Piston API…</span>
                  </div>
                )}

                {!running && !consoleOutput && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', height: '100%', gap: 12, color: '#A3A3A3' }}>
                    <Play size={40} color="#E7E5E4" />
                    <span style={{ fontSize: 14 }}>Click "Run Code" to execute</span>
                    <span style={{ fontSize: 12 }}>Language: {activeLang.label}</span>
                  </div>
                )}

                {!running && consoleOutput && (
                  <div>
                    {/* Time badge */}
                    <div style={{ marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ padding: '2px 10px', background: '#E7E5E4', color: '#1A1A1A',
                        borderRadius: 20, fontSize: 11, fontWeight: 500 }}>
                        ⏱ {consoleOutput.elapsed}s
                      </span>
                      <span style={{ padding: '2px 10px', background: '#E7E5E4', color: '#1A1A1A',
                        borderRadius: 20, fontSize: 11, fontWeight: 500 }}>
                        {activeLang.label}
                      </span>
                    </div>

                    {/* stdout */}
                    {consoleOutput.stdout && (
                      <div>
                        <div style={{ fontSize: 11, color: '#A3A3A3', marginBottom: 6, fontFamily: 'Inter, sans-serif' }}>
                          STDOUT
                        </div>
                        <pre style={{
                          whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                          color: '#1A1A1A', lineHeight: 1.7, margin: 0,
                          padding: 12, background: '#FFFFFF', borderRadius: 8,
                          border: '1px solid #E7E5E4'
                        }}>
                          {consoleOutput.stdout}
                        </pre>
                      </div>
                    )}

                    {/* stderr */}
                    {consoleOutput.stderr && (
                      <div style={{ marginTop: consoleOutput.stdout ? 12 : 0 }}>
                        <div style={{ fontSize: 11, color: '#dc2626', marginBottom: 6, fontFamily: 'Inter, sans-serif' }}>
                          STDERR / ERROR
                        </div>
                        <pre style={{
                          whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                          color: '#dc2626', lineHeight: 1.7, margin: 0,
                          padding: 12, background: '#fff5f5', borderRadius: 8,
                          border: '1px solid #fecaca'
                        }}>
                          {consoleOutput.stderr}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* HTML empty state */}
            {activeLang.id === 'html' && !htmlOutput && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', height: '100%', gap: 12, color: '#A3A3A3' }}>
                <Play size={40} color="#E7E5E4" />
                <span style={{ fontSize: 14 }}>Click "Run Code" to preview HTML</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spinner keyframe */}
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  )
}
