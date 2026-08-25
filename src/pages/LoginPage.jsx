import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { LogIn, User, ShieldCheck, Loader } from 'lucide-react'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

export default function LoginPage() {
  const { login, loginWithGoogle } = useApp()
  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return
    if (isSignUp && !name.trim()) return

    setLoading(true)
    setError(null)

    const result = await login(email, password, isSignUp, name)

    if (result?.error) {
      setError(result.error)
    }

    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setError(null)

    const result = await loginWithGoogle()

    if (result?.error) {
      setError(result.error)
      setGoogleLoading(false)
    }
    // Don't set loading false on success — the page will redirect to Google
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#FAFAFA',
      padding: 20
    }}>
      <div style={{
        background: '#FFFFFF',
        padding: 40,
        borderRadius: 24,
        border: '1px solid #E7E5E4',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        width: '100%',
        maxWidth: 400,
        textAlign: 'center'
      }}>
        <img src="/lachoo-logo.jpg" alt="LMCST Logo" style={{
          width: 80, height: 80, borderRadius: '50%', objectFit: 'cover',
          border: '1px solid #E7E5E4',
          margin: '0 auto 24px', display: 'block'
        }} />
        
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1A1A1A', marginBottom: 8, letterSpacing: '-0.5px' }}>
          {isSignUp ? 'Create an account' : 'Welcome back'}
        </h1>
        <p style={{ color: '#525252', fontSize: 14, marginBottom: 28 }}>
          {isSignUp ? 'Join the Student Learning Portal' : 'Sign in to the Student Learning Portal'}
        </p>

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: 12,
            border: '1px solid #E7E5E4',
            background: '#FFFFFF',
            cursor: googleLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            fontSize: 14,
            fontWeight: 500,
            color: '#1A1A1A',
            transition: 'all 0.15s',
            fontFamily: 'inherit'
          }}
          onMouseEnter={e => { e.target.style.background = '#FAFAFA' }}
          onMouseLeave={e => { e.target.style.background = '#FFFFFF' }}
        >
          {googleLoading ? (
            <>
              <Loader size={18} color="#A3A3A3" style={{ animation: 'spin 1s linear infinite' }} />
              Redirecting...
            </>
          ) : (
            <>
              <GoogleIcon /> Continue with Google
            </>
          )}
        </button>

        {/* Divider */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          margin: '24px 0', color: '#A3A3A3', fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px'
        }}>
          <div style={{ flex: 1, height: 1, background: '#E7E5E4' }} />
          or
          <div style={{ flex: 1, height: 1, background: '#E7E5E4' }} />
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {isSignUp && (
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#1A1A1A', marginBottom: 6 }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#A3A3A3" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter your name" 
                  required={isSignUp}
                  disabled={loading || googleLoading}
                  style={{
                    width: '100%', padding: '10px 16px 10px 40px', borderRadius: 8,
                    border: '1px solid #E7E5E4', outline: 'none', fontSize: 14,
                    transition: 'border-color 0.15s', background: '#FAFAFA', color: '#1A1A1A', fontFamily: 'inherit'
                  }}
                  onFocus={e => e.target.style.borderColor = '#1A1A1A'}
                  onBlur={e => e.target.style.borderColor = '#E7E5E4'}
                />
              </div>
            </div>
          )}

          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#1A1A1A', marginBottom: 6 }}>Email</label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="#A3A3A3" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" 
                required
                disabled={loading || googleLoading}
                style={{
                  width: '100%', padding: '10px 16px 10px 40px', borderRadius: 8,
                  border: '1px solid #E7E5E4', outline: 'none', fontSize: 14,
                  transition: 'border-color 0.15s', background: '#FAFAFA', color: '#1A1A1A', fontFamily: 'inherit'
                }}
                onFocus={e => e.target.style.borderColor = '#1A1A1A'}
                onBlur={e => e.target.style.borderColor = '#E7E5E4'}
              />
            </div>
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#1A1A1A', marginBottom: 6 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <ShieldCheck size={16} color="#A3A3A3" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" 
                required
                disabled={loading || googleLoading}
                style={{
                  width: '100%', padding: '10px 16px 10px 40px', borderRadius: 8,
                  border: '1px solid #E7E5E4', outline: 'none', fontSize: 14,
                  transition: 'border-color 0.15s', background: '#FAFAFA', color: '#1A1A1A', fontFamily: 'inherit'
                }}
                onFocus={e => e.target.style.borderColor = '#1A1A1A'}
                onBlur={e => e.target.style.borderColor = '#E7E5E4'}
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div style={{
              background: '#FAFAFA', border: '1px solid #E7E5E4', borderRadius: 8,
              padding: '10px 14px', color: '#1A1A1A', fontSize: 13, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 6
            }}>
              <span style={{color: '#A3A3A3'}}>⚠️</span> {error}
            </div>
          )}

          <button type="submit" disabled={loading || googleLoading} style={{
            background: loading ? '#A3A3A3' : '#1A1A1A',
            color: '#FFFFFF', border: 'none', padding: '12px', borderRadius: 8,
            fontSize: 14, fontWeight: 500, marginTop: 4, cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'background 0.15s', fontFamily: 'inherit'
          }}
          onMouseEnter={e => { if(!loading) e.target.style.background = '#000000' }}
          onMouseLeave={e => { if(!loading) e.target.style.background = '#1A1A1A' }}>
            {loading ? (
              <>
                <Loader size={16} color="#FFFFFF" style={{ animation: 'spin 1s linear infinite' }} />
                {isSignUp ? 'Creating account...' : 'Signing in...'}
              </>
            ) : (
              <>
                {isSignUp ? 'Create account' : 'Sign in'}
              </>
            )}
          </button>
        </form>

        <p style={{ color: '#525252', fontSize: 13, marginTop: 20 }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button 
            onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
            style={{ 
              background: 'none', border: 'none', color: '#1A1A1A', 
              fontWeight: 500, cursor: 'pointer', padding: 0, textDecoration: 'underline'
            }}
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
