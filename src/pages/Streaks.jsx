import { useFitForge } from '../context/FitForgeContext'

const LABELS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7']

export default function Streaks() {
  const { currentStreak, bestStreak, weekDays, weeklyChartData } = useFitForge()
  const MAX = Math.max(...weeklyChartData, 1)

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 24 }}>
        {[{ value: currentStreak, label: 'Current Streak' }, { value: bestStreak, label: 'Best Streak' }].map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ fontFamily: 'Bebas Neue, cursive', fontSize: 52, color: 'var(--ff-orange)', lineHeight: 1 }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="section-label">This week</div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
        {weekDays.map((d, i) => (
          <div key={i} className={`streak-day${d.done ? ' done' : d.today ? ' today' : ''}`}>
            {d.label}
          </div>
        ))}
      </div>

      <div className="section-label">Weekly workout count</div>
      <div className="chart-card">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 120 }}>
          {weeklyChartData.map((v, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 4, height: '100%' }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--ff-orange)', minHeight: 16 }}>{v || ''}</span>
              <div style={{
                width: '100%',
                height: `${Math.round((v / MAX) * 88) + 4}px`,
                borderRadius: '4px 4px 0 0',
                background: v === 0 ? 'var(--ff-card)' : 'var(--ff-orange)',
                transition: 'height 0.4s'
              }} />
              <span style={{ fontSize: 10, color: 'var(--ff-muted)' }}>{LABELS[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="section-label">Streak calendar</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10,1fr)', gap: 6 }}>
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className={`cal-dot${i < currentStreak ? ' done' : i === currentStreak ? ' today' : ''}`} />
        ))}
      </div>
    </div>
  )
}