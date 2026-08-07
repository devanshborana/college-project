import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Send, Moon, Sun, Terminal, Lightbulb, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface OutputResponse {
  stdout: string;
  stderr: string;
  time_ms: number;
  exit_code: number;
}

export default function CodingEnvironment() {
  const { token } = useAuth();
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('# Write your code here...\nprint("Hello from Python!")');
  const [stdin, setStdin] = useState('');

  // Web Playground State
  const [htmlCode, setHtmlCode] = useState('<h1>Hello Web</h1>');
  const [cssCode, setCssCode] = useState('h1 { color: #319795; font-family: sans-serif; }');
  const [jsCode, setJsCode] = useState('console.log("Ready!");');
  const [activeWebTab, setActiveWebTab] = useState<'html' | 'css' | 'js'>('html');
  const [srcDoc, setSrcDoc] = useState('');

  const [theme, setTheme] = useState<'light' | 'vs-dark'>('light');
  const [output, setOutput] = useState<OutputResponse | null>(null);

  // Evaluation state
  const [evalResult, setEvalResult] = useState<any>(null);
  const [hint, setHint] = useState<{ text: string; remaining: number } | null>(null);
  const [showHintPanel, setShowHintPanel] = useState(false);

  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hardcoded problem id — will be wired in via props in a later step
  const PROBLEM_ID = 1;

  // Debounced live preview for web playground
  React.useEffect(() => {
    if (language !== 'web') return;
    const timeout = setTimeout(() => {
      setSrcDoc(`<!DOCTYPE html>
<html>
<head><style>${cssCode}</style></head>
<body>${htmlCode}<script>${jsCode}<\/script></body>
</html>`);
    }, 500);
    return () => clearTimeout(timeout);
  }, [htmlCode, cssCode, jsCode, language]);

  const buildSrcDoc = () =>
    `<!DOCTYPE html>
<html>
<head><style>${cssCode}</style></head>
<body>${htmlCode}<script>${jsCode}<\/script></body>
</html>`;

  const handleRun = async () => {
    if (language === 'web') {
      setSrcDoc(buildSrcDoc());
      setOutput({ stdout: 'Live preview refreshed!', stderr: '', time_ms: 0, exit_code: 0 });
      return;
    }
    setIsRunning(true);
    setOutput(null);
    try {
      const response = await fetch('http://localhost:8000/execute/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code, stdin }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Execution failed');
      setOutput(data);
    } catch (err: any) {
      setOutput({ stdout: '', stderr: err.message, time_ms: 0, exit_code: -1 });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!token) return alert('Please login to submit code.');
    setIsSubmitting(true);
    setEvalResult(null);
    try {
      const response = await fetch('http://localhost:8000/evaluation/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          problem_id: PROBLEM_ID,
          language,
          code,
          html: htmlCode,
          css: cssCode,
          js: jsCode,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Evaluation failed');
      setEvalResult(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestHint = async () => {
    if (!token) return;
    try {
      const failTest = evalResult?.test_results?.find((r: any) => !r.passed);
      const response = await fetch('http://localhost:8000/evaluation/hints/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          problem_id: PROBLEM_ID,
          language,
          error_message: output?.stderr || failTest?.error,
          failing_test_input: failTest ? 'Hidden test input' : undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Hint failed');
      setHint({ text: data.hint, remaining: data.hints_remaining_today });
      setShowHintPanel(true);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const editorLanguage =
    language === 'web'
      ? activeWebTab
      : language === 'c' || language === 'cpp'
      ? 'cpp'
      : language;

  const editorValue =
    language === 'web'
      ? activeWebTab === 'html'
        ? htmlCode
        : activeWebTab === 'css'
        ? cssCode
        : jsCode
      : code;

  const handleEditorChange = (val: string | undefined) => {
    if (language === 'web') {
      if (activeWebTab === 'html') setHtmlCode(val || '');
      else if (activeWebTab === 'css') setCssCode(val || '');
      else setJsCode(val || '');
    } else {
      setCode(val || '');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
            <option value="web">Web Playground (HTML/CSS/JS)</option>
          </select>

          <button
            onClick={() => setTheme(theme === 'light' ? 'vs-dark' : 'light')}
            className="p-1.5 text-gray-500 hover:text-text rounded-md transition-colors"
            title="Toggle Editor Theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRun}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-2 px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-text rounded-md font-medium text-sm transition-colors disabled:opacity-50"
          >
            <Play size={16} />
            {isRunning ? 'Running...' : language === 'web' ? 'Refresh Preview' : 'Run Code'}
          </button>

          <button
            onClick={handleSubmit}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-2 px-4 py-1.5 bg-accent hover:bg-opacity-90 text-white rounded-md font-medium text-sm transition-colors disabled:opacity-50"
          >
            <Send size={16} />
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>

      {/* Editor & Right Panel Split */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

        {/* Left: Editor Panel */}
        <div className="flex-1 flex flex-col border-r border-gray-200 overflow-hidden">
          {/* Web file tabs */}
          {language === 'web' && (
            <div className="flex bg-gray-50 border-b border-gray-200 shrink-0">
              {(['html', 'css', 'js'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveWebTab(tab)}
                  className={`flex-1 py-1.5 text-xs font-bold uppercase transition-colors ${
                    activeWebTab === tab
                      ? 'text-accent border-b-2 border-accent bg-white'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
              <button
                onClick={() => {
                  setHtmlCode('<h1>Hello Web</h1>');
                  setCssCode('h1 { color: #319795; font-family: sans-serif; }');
                  setJsCode('console.log("Ready!");');
                }}
                className="px-4 text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors"
                title="Reset all files to starter code"
              >
                RESET
              </button>
            </div>
          )}

          <div className="flex-1">
            <Editor
              height="100%"
              language={editorLanguage}
              theme={theme}
              value={editorValue}
              onChange={handleEditorChange}
              options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16 } }}
            />
          </div>
        </div>

        {/* Right: Preview / Output Panel */}
        <div className="w-full md:w-[360px] lg:w-[420px] flex flex-col bg-gray-50 border-t md:border-t-0 border-gray-200 overflow-hidden">

          {/* Web Playground: show live iframe preview */}
          {language === 'web' && !evalResult && !showHintPanel ? (
            <div className="flex-1 flex flex-col">
              <div className="px-3 py-2 border-b border-gray-200 bg-gray-50 text-xs font-bold text-gray-500 uppercase shrink-0">
                Live Preview
              </div>
              <iframe
                srcDoc={srcDoc}
                title="Live Preview"
                sandbox="allow-scripts"
                className="w-full flex-1 border-none bg-white"
              />
            </div>
          ) : (
            /* Standard Output / Evaluation panel */
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Tab bar */}
              <div className="flex border-b border-gray-200 shrink-0">
                <button
                  className={`flex-1 py-2 text-xs font-bold uppercase transition-colors ${
                    !evalResult && !showHintPanel
                      ? 'text-accent border-b-2 border-accent'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => { setEvalResult(null); setShowHintPanel(false); }}
                >
                  Output
                </button>
                <button
                  className={`flex-1 py-2 text-xs font-bold uppercase transition-colors ${
                    evalResult && !showHintPanel
                      ? 'text-accent border-b-2 border-accent'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => { if (evalResult) setShowHintPanel(false); }}
                >
                  Evaluation
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col p-4 overflow-auto">
                {showHintPanel ? (
                  <div>
                    <h3 className="font-bold text-sm text-accent mb-4 flex items-center gap-2">
                      <Lightbulb size={16} /> Hint Provided
                    </h3>
                    <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm text-sm text-text mb-4">
                      {hint?.text}
                    </div>
                    <div className="text-xs text-gray-500">
                      You have {hint?.remaining} hints remaining today.
                    </div>
                    <button
                      onClick={() => setShowHintPanel(false)}
                      className="mt-4 text-xs text-accent hover:underline"
                    >
                      &larr; Back to results
                    </button>
                  </div>
                ) : evalResult ? (
                  <div className="space-y-4">
                    <div
                      className={`p-3 rounded-md border text-sm font-semibold ${
                        evalResult.status === 'passed'
                          ? 'bg-green-50 border-green-200 text-green-700'
                          : 'bg-red-50 border-red-200 text-red-700'
                      }`}
                    >
                      {evalResult.message}
                    </div>

                    <div className="text-sm">
                      <div className="font-semibold text-gray-700 mb-2">Test Cases:</div>
                      <div className="space-y-2">
                        {evalResult.test_results.map((tr: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-white p-2 border border-gray-200 rounded-md"
                          >
                            <span className="text-xs font-medium">Test Case {idx + 1}</span>
                            {tr.passed ? (
                              <CheckCircle size={16} className="text-green-500" />
                            ) : (
                              <XCircle size={16} className="text-red-500" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <span className="text-sm font-semibold">Points Awarded:</span>
                      <span className="text-lg font-bold text-accent">+{evalResult.points_awarded}</span>
                    </div>

                    {evalResult.status !== 'passed' && (
                      <button
                        onClick={requestHint}
                        className="w-full mt-2 flex items-center justify-center gap-2 py-2 border border-accent text-accent rounded-md hover:bg-accent/5 transition-colors text-sm font-medium"
                      >
                        <Lightbulb size={16} /> Request Hint
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    <h3 className="font-bold text-sm text-gray-500 mb-3 uppercase flex items-center gap-2">
                      <Terminal size={14} /> Output
                    </h3>

                    {output ? (
                      <div className="space-y-4">
                        {output.stderr && (
                          <div>
                            <div className="text-xs font-semibold text-red-500 mb-1">
                              Standard Error / Compilation:
                            </div>
                            <pre className="text-xs bg-red-50 text-red-800 p-3 rounded-md overflow-x-auto border border-red-100 whitespace-pre-wrap">
                              {output.stderr}
                            </pre>
                          </div>
                        )}

                        {output.stdout && (
                          <div>
                            <div className="text-xs font-semibold text-gray-600 mb-1">
                              Standard Output:
                            </div>
                            <pre className="text-xs bg-white text-text p-3 rounded-md overflow-x-auto border border-gray-200 whitespace-pre-wrap">
                              {output.stdout}
                            </pre>
                          </div>
                        )}

                        {output.exit_code === 0 && !output.stderr && !output.stdout && (
                          <div className="text-xs italic text-gray-500 p-2">
                            Program finished successfully with no output.
                          </div>
                        )}

                        <div className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-200 flex justify-between">
                          <span>Exit Code: {output.exit_code}</span>
                          <span>Execution Time: {output.time_ms}ms</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-32 text-gray-400 text-sm italic">
                        Click "Run Code" to see output here.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Custom stdin input — only for non-web languages */}
              {!evalResult && !showHintPanel && language !== 'web' && (
                <div className="p-4 border-t border-gray-200 bg-white shrink-0">
                  <h3 className="font-bold text-xs text-gray-500 mb-2 uppercase">
                    Custom Input (stdin)
                  </h3>
                  <textarea
                    value={stdin}
                    onChange={(e) => setStdin(e.target.value)}
                    className="w-full text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                    rows={3}
                    placeholder="Enter custom input here..."
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
