import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const TITLES = {
  '/dashboard': 'Dashboard',
  '/planner': 'Workout Planner',
  '/streaks': 'Streaks',
  '/history': 'History',
}

export default function Navbar() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const initials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || 'FF'

  return (
    <header className="topbar">
      <div className="topbar-title">{TITLES[pathname] || 'FitForge'}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 13, color: 'var(--ff-muted)' }}>
          {user?.displayName || user?.email}
        </span>
        <div className="topbar-avatar">{initials}</div>
        <button
          onClick={handleLogout}
          style={{
            fontSize: 12,
            fontWeight: 500,
            padding: '6px 14px',
            borderRadius: 8,
            border: '1px solid var(--ff-border)',
            background: 'transparent',
            color: 'var(--ff-muted)',
            cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#e24b4a'; e.currentTarget.style.color = '#e24b4a' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--ff-border)'; e.currentTarget.style.color = 'var(--ff-muted)' }}
        >
          Logout
        </button>
      </div>
    </header>
  )
}