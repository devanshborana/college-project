import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { LogIn, User, ShieldCheck, Loader } from 'lucide-react'

export default function LoginPage() {
  const { login } = useApp()
  const [name, setName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!name.trim() || !studentId.trim()) return

    setLoading(true)
    setError(null)

    const result = await login(name, studentId)

    if (result?.error) {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
      padding: 20
    }}>
      <div style={{
        background: 'white',
        padding: 40,
        borderRadius: 24,
        boxShadow: '0 20px 40px rgba(108, 71, 255, 0.1)',
        width: '100%',
        maxWidth: 400,
        textAlign: 'center'
      }}>
        <img src="/lachoo-logo.jpg" alt="LMCST Logo" style={{
          width: 80, height: 80, borderRadius: 16, objectFit: 'contain',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          margin: '0 auto 24px', display: 'block'
        }} />
        
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1e1b4b', marginBottom: 8 }}>
          Welcome Back
        </h1>
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 32 }}>
          Sign in to access the Student Learning Portal
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4b5563', marginBottom: 6 }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="#9ca3af" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name" 
                required
                disabled={loading}
                style={{
                  width: '100%', padding: '12px 16px 12px 42px', borderRadius: 12,
                  border: '1px solid #e5e7eb', outline: 'none', fontSize: 15,
                  transition: 'all 0.2s', background: '#f9fafb'
                }}
                onFocus={e => e.target.style.borderColor = '#6c47ff'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#4b5563', marginBottom: 6 }}>Student ID</label>
            <div style={{ position: 'relative' }}>
              <ShieldCheck size={18} color="#9ca3af" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                placeholder="e.g. LMCST-2024-001" 
                required
                disabled={loading}
                style={{
                  width: '100%', padding: '12px 16px 12px 42px', borderRadius: 12,
                  border: '1px solid #e5e7eb', outline: 'none', fontSize: 15,
                  transition: 'all 0.2s', background: '#f9fafb'
                }}
                onFocus={e => e.target.style.borderColor = '#6c47ff'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10,
              padding: '10px 14px', color: '#dc2626', fontSize: 13, textAlign: 'left'
            }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            background: loading ? '#c4b5fd' : 'linear-gradient(135deg, #6c47ff, #a855f7)',
            color: 'white', border: 'none', padding: '14px', borderRadius: 12,
            fontSize: 15, fontWeight: 700, marginTop: 12, cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 4px 12px rgba(108,71,255,0.2)',
            transition: 'all 0.2s'
          }}>
            {loading ? (
              <>
                <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Signing in...
              </>
            ) : (
              <>
                <LogIn size={18} /> Access Portal
              </>
            )}
          </button>
        </form>

        <p style={{ color: '#9ca3af', fontSize: 12, marginTop: 20 }}>
          First time? Just enter your name and ID to register automatically.
        </p>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
