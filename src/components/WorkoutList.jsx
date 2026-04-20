export default function WorkoutList({ exercises, onRemove }) {
  if (!exercises.length) return null
  return (
    <div style={{ marginBottom: 16 }}>
      <div className="section-label">Added exercises</div>
      {exercises.map((e, i) => (
        <div key={i} className="added-row">
          <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{e.name}</span>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--ff-orange)' }}>
            {e.sets}×{e.reps} @ {e.weight}kg
          </span>
          <span
            onClick={() => onRemove(i)}
            style={{ fontSize: 18, color: 'var(--ff-muted)', cursor: 'pointer', lineHeight: 1 }}
            onMouseEnter={e => e.target.style.color = '#e24b4a'}
            onMouseLeave={e => e.target.style.color = 'var(--ff-muted)'}
          >×</span>
        </div>
      ))}
    </div>
  )
}