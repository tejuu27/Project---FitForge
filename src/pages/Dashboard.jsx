import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFitForge } from '../context/FitForgeContext'
import { quotes } from '../data/exercises'
import WorkoutCard from '../components/WorkoutCard'

export default function Dashboard() {
  const navigate = useNavigate()
  const { workouts, currentStreak, bestStreak, weekDays, thisWeekCount } = useFitForge()
  const quote = useMemo(() => quotes[Math.floor(Math.random() * quotes.length)], [])

  return (
    <div>
      {/* Motivation */}
      <div className="motivation-card">
        <div style={{ position: 'relative', fontSize: 15, fontWeight: 600, color: '#fff', lineHeight: 1.5 }}>
          {quote.text}
        </div>
        <div style={{ position: 'relative', fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 6 }}>
          {quote.sub}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 24 }}>
        {[
          { value: currentStreak, label: 'Current Streak' },
          { value: bestStreak, label: 'Best Streak' },
          { value: thisWeekCount, label: 'This Week' },
          { value: workouts.length, label: 'Total Workouts' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-num">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Week streak */}
      <div className="section-label">This week</div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
        {weekDays.map((d, i) => (
          <div key={i} className={`streak-day${d.done ? ' done' : d.today ? ' today' : ''}`}>
            {d.label}
          </div>
        ))}
      </div>

      {/* Quick start */}
      <div className="section-label">Quick start</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'Upper Body', emoji: '💪', type: 'Upper Body' },
          { label: 'Lower Body', emoji: '🦵', type: 'Lower Body' },
          { label: 'Core', emoji: '🔥', type: 'Core' },
        ].map(q => (
          <div key={q.type} className="quick-btn"
            onClick={() => navigate('/planner', { state: { type: q.type } })}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{q.emoji}</div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{q.label}</div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="section-label">Recent activity</div>
      {workouts.length === 0 && (
        <div style={{ fontSize: 13, color: 'var(--ff-muted)', padding: '20px 0' }}>
          No workouts yet — go to Planner to add one!
        </div>
      )}
      {workouts.slice(0, 3).map(w => <WorkoutCard key={w.id} {...w} />)}
    </div>
  )
}