export default function WorkoutCard({ name, date, exercises, sets }) {
  return (
    <div className="workout-card">
      <div className="workout-dot" />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{name}</div>
        <div style={{ fontSize: 12, color: 'var(--ff-muted)', marginTop: 2 }}>
          {exercises} exercises · {sets} sets total
        </div>
      </div>
      <span className="workout-badge">{date}</span>
    </div>
  )
}