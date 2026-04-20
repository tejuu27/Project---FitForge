export default function WorkoutForm({ sets, reps, weight, onChange, onAdd }) {
  const fields = [
    { label: 'Sets', key: 'sets', value: sets, max: 10 },
    { label: 'Reps', key: 'reps', value: reps, max: 50 },
    { label: 'Weight (kg)', key: 'weight', value: weight, max: 300 },
  ]

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, margin: '14px 0' }}>
        {fields.map(f => (
          <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--ff-muted)' }}>
              {f.label}
            </label>
            <input
              type="number"
              value={f.value}
              min={0} max={f.max}
              onChange={e => onChange(f.key, e.target.value)}
              className="ff-input"
            />
          </div>
        ))}
      </div>
      <button className="btn-add" onClick={onAdd}>+ Add Exercise</button>
    </div>
  )
}