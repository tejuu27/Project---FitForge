export default function ExerciseSelector({ exercises, selected, onSelect }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {exercises.map(ex => (
        <div
          key={ex.name}
          className={`ex-row${selected === ex.name ? ' selected' : ''}`}
          onClick={() => onSelect(ex.name)}
        >
          <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{ex.name}</span>
          <span className="ex-tag">{ex.category}</span>
        </div>
      ))}
    </div>
  )
}