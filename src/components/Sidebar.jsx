import { NavLink } from 'react-router-dom'

const NAV = [
  { to: '/dashboard', icon: '▦', label: 'Dashboard' },
  { to: '/planner', icon: '✎', label: 'Planner' },
  { to: '/streaks', icon: '🔥', label: 'Streaks' },
  { to: '/history', icon: '◷', label: 'History' },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">FitForge</div>
      <nav style={{ flex: 1 }}>
        {NAV.map(n => (
          <NavLink
            key={n.to}
            to={n.to}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span style={{ width: 20, textAlign: 'center' }}>{n.icon}</span>
            <span>{n.label}</span>
          </NavLink>
        ))}
      </nav>
      <div style={{ padding: '0 24px', fontSize: 11, color: 'var(--ff-muted)' }}>v1.0.0</div>
    </aside>
  )
}