import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'
import { auth, googleProvider } from '../services/firebase'

export default function Login() {
  const navigate = useNavigate()
  const [isSignup, setIsSignup] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(friendlyError(err.code))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    try {
      await signInWithPopup(auth, googleProvider)
      navigate('/dashboard')
    } catch (err) {
      setError(friendlyError(err.code))
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--ff-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        background: 'var(--ff-surface)',
        border: '1px solid var(--ff-border)',
        borderRadius: 20,
        padding: '40px 36px',
        width: '100%',
        maxWidth: 420,
      }}>
        {/* Logo */}
        <div style={{
          fontFamily: 'Bebas Neue, cursive',
          fontSize: 36,
          letterSpacing: 2,
          color: 'var(--ff-orange)',
          marginBottom: 4,
        }}>
          FitForge
        </div>
        <div style={{ fontSize: 14, color: 'var(--ff-muted)', marginBottom: 32 }}>
          {isSignup ? 'Create your account to get started' : 'Welcome back — let\'s get moving'}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fef2f2',
            color: '#b91c1c',
            fontSize: 13,
            padding: '10px 14px',
            borderRadius: 8,
            marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--ff-muted)', marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="ff-input"
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: 22 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--ff-muted)', marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="ff-input"
              style={{ width: '100%' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-save"
            style={{ marginBottom: 12, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--ff-border)' }} />
          <span style={{ fontSize: 12, color: 'var(--ff-muted)' }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--ff-border)' }} />
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: '11px 16px',
            background: 'var(--ff-surface)',
            border: '1px solid var(--ff-border-s)',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif',
            color: 'var(--ff-text)',
            marginBottom: 24,
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--ff-card)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--ff-surface)'}
        >
          <GoogleIcon />
          Continue with Google
        </button>

        {/* Toggle */}
        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--ff-muted)' }}>
          {isSignup ? 'Already have an account? ' : "Don't have an account? "}
          <span
            onClick={() => { setIsSignup(p => !p); setError('') }}
            style={{ color: 'var(--ff-orange)', fontWeight: 600, cursor: 'pointer' }}
          >
            {isSignup ? 'Sign In' : 'Sign Up'}
          </span>
        </div>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.6 29.3 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6-6C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.3-.2-2.7-.4-4z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6-6C34.5 5.1 29.5 3 24 3 16.3 3 9.7 7.9 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 45c5.2 0 10-1.9 13.7-5.1l-6.3-5.2C29.4 36.5 26.8 37 24 37c-5.2 0-9.7-3.4-11.3-8.1l-6.6 5.1C9.5 40.7 16.3 45 24 45z"/>
      <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.3 5.2C41.1 35.5 44 30.2 44 24c0-1.3-.2-2.7-.4-4z"/>
    </svg>
  )
}

function friendlyError(code) {
  switch (code) {
    case 'auth/invalid-email': return 'Invalid email address.'
    case 'auth/user-not-found': return 'No account found with this email.'
    case 'auth/wrong-password': return 'Incorrect password.'
    case 'auth/email-already-in-use': return 'An account with this email already exists.'
    case 'auth/weak-password': return 'Password must be at least 6 characters.'
    case 'auth/popup-closed-by-user': return 'Google sign-in was cancelled.'
    default: return 'Something went wrong. Please try again.'
  }
}