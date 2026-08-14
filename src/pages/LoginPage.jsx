import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { LogIn, User, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  const { login } = useApp()
  const [name, setName] = useState('')
  const [studentId, setStudentId] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    if (name.trim() && studentId.trim()) {
      login(name, studentId)
    }
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
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: 'linear-gradient(135deg, #6c47ff, #a855f7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 900, fontSize: 20,
          boxShadow: '0 8px 16px rgba(108,71,255,0.25)',
          margin: '0 auto 24px'
        }}>
          LMCST
        </div>
        
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

          <button type="submit" style={{
            background: 'linear-gradient(135deg, #6c47ff, #a855f7)',
            color: 'white', border: 'none', padding: '14px', borderRadius: 12,
            fontSize: 15, fontWeight: 700, marginTop: 12, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 4px 12px rgba(108,71,255,0.2)'
          }}>
            <LogIn size={18} /> Access Portal
          </button>
        </form>
      </div>
    </div>
  )
}
