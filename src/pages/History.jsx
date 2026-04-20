import { useFitForge } from '../context/FitForgeContext'
import WorkoutCard from '../components/WorkoutCard'

const LABELS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7']

export default function History() {
  const { workouts, weeklyChartData } = useFitForge()
  const MAX = Math.max(...weeklyChartData, 1)

  return (
    <div>
      <div className="section-label">Weekly activity</div>
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

      <div className="section-label">All workouts ({workouts.length})</div>
      {workouts.length === 0 && (
        <div style={{ fontSize: 13, color: 'var(--ff-muted)', padding: '20px 0' }}>
          No workouts yet — go add one in the Planner!
        </div>
      )}
      {workouts.map(w => <WorkoutCard key={w.id} {...w} />)}
    </div>
  )
}