import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { exercisesByCategory } from '../data/exercises'
import { useFitForge } from '../context/FitForgeContext'

const CATEGORIES = ['Upper Body', 'Lower Body', 'Core', 'Custom']

const CATEGORY_META = {
  'Upper Body': { emoji: '💪', desc: 'Chest · Back · Shoulders · Arms' },
  'Lower Body': { emoji: '🦵', desc: 'Quads · Hamstrings · Glutes · Calves' },
  'Core':       { emoji: '🔥', desc: 'Abs · Obliques · Core Stability' },
  'Custom':     { emoji: '⚡', desc: 'Mix exercises from any muscle group' },
}

export default function Planner() {
  const location = useLocation()
  const navigate = useNavigate()
  const { addWorkout } = useFitForge()

  const [step, setStep] = useState(1) // 1 = pick category, 2 = build workout
  const [category, setCategory] = useState(null)
  const [selectedEx, setSelectedEx] = useState(null)
  const [sets, setSets] = useState([{ reps: 10, weight: 20 }])
  const [addedExercises, setAddedExercises] = useState([])
  const [saved, setSaved] = useState(false)
  const [muscleFilter, setMuscleFilter] = useState('All')

  useEffect(() => {
    if (location.state?.type) {
      const map = {
        Push: 'Upper Body', Pull: 'Upper Body',
        Legs: 'Lower Body', Custom: 'Custom'
      }
      setCategory(map[location.state.type] || location.state.type)
      setStep(2)
    }
  }, [location.state])

  const exercises = category ? exercisesByCategory[category] : []
  const muscles = category ? ['All', ...new Set(exercises.map(e => e.muscle))] : []
  const filteredExercises = muscleFilter === 'All'
    ? exercises
    : exercises.filter(e => e.muscle === muscleFilter)

  const addSet = () => setSets(prev => [...prev, { reps: 10, weight: 20 }])
  const removeSet = (i) => setSets(prev => prev.filter((_, idx) => idx !== i))
  const updateSet = (i, field, val) => setSets(prev =>
    prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s)
  )

  const handleAddExercise = () => {
    if (!selectedEx) return
    setAddedExercises(prev => [...prev, {
      name: selectedEx.name,
      muscle: selectedEx.muscle,
      sets: sets.map(s => ({ ...s })),
    }])
    setSelectedEx(null)
    setSets([{ reps: 10, weight: 20 }])
    setMuscleFilter('All')
  }

  const removeExercise = (i) => setAddedExercises(prev => prev.filter((_, idx) => idx !== i))

  const totalSets = addedExercises.reduce((sum, e) => sum + e.sets.length, 0)

  const handleSave = () => {
    if (!addedExercises.length) return
    addWorkout({
      name: `${category} Workout`,
      exercises: addedExercises.length,
      sets: totalSets,
      type: category,
      exerciseDetails: addedExercises,
    })
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      navigate('/dashboard')
    }, 1500)
  }

  // Step 1 — pick category
  if (step === 1) {
    return (
      <div>
        <div style={{ fontSize: 13, color: 'var(--ff-muted)', marginBottom: 24 }}>
          What are you training today?
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
          {CATEGORIES.map(cat => (
            <div
              key={cat}
              onClick={() => { setCategory(cat); setStep(2); setMuscleFilter('All') }}
              style={{
                background: 'var(--ff-surface)',
                border: '1px solid var(--ff-border)',
                borderRadius: 16,
                padding: '24px 20px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--ff-orange)'
                e.currentTarget.style.background = 'var(--ff-orange-light)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--ff-border)'
                e.currentTarget.style.background = 'var(--ff-surface)'
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 10 }}>{CATEGORY_META[cat].emoji}</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{cat}</div>
              <div style={{ fontSize: 12, color: 'var(--ff-muted)' }}>{CATEGORY_META[cat].desc}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Step 2 — build workout
  return (
    <div>
      {saved && (
        <div style={{ background: '#eaf3de', color: '#3b6d11', fontSize: 13, fontWeight: 500, padding: '11px 16px', borderRadius: 8, marginBottom: 16 }}>
          Workout saved! Redirecting...
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => { setStep(1); setSelectedEx(null); setAddedExercises([]); setSets([{ reps: 10, weight: 20 }]) }}
          style={{ background: 'var(--ff-card)', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 13, color: 'var(--ff-muted)', fontFamily: 'DM Sans, sans-serif' }}
        >
          ← Back
        </button>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>
            {CATEGORY_META[category].emoji} {category} Workout
          </div>
          <div style={{ fontSize: 12, color: 'var(--ff-muted)' }}>
            {addedExercises.length} exercises · {totalSets} sets
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* LEFT — Exercise picker */}
        <div>
          <div className="section-label">Pick exercise</div>

          {/* Muscle filter */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            {muscles.map(m => (
              <button
                key={m}
                onClick={() => setMuscleFilter(m)}
                style={{
                  fontSize: 11, fontWeight: 500,
                  padding: '4px 12px', borderRadius: 20,
                  border: '1px solid',
                  borderColor: muscleFilter === m ? 'var(--ff-orange)' : 'var(--ff-border-s)',
                  background: muscleFilter === m ? 'var(--ff-orange)' : 'transparent',
                  color: muscleFilter === m ? '#fff' : 'var(--ff-muted)',
                  cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'all 0.15s',
                }}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Exercise list */}
          <div style={{ maxHeight: 280, overflowY: 'auto', marginBottom: 16 }}>
            {filteredExercises.map(ex => (
              <div
                key={ex.name}
                className={`ex-row${selectedEx?.name === ex.name ? ' selected' : ''}`}
                onClick={() => setSelectedEx(ex)}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{ex.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--ff-muted)', marginTop: 1 }}>{ex.muscle}</div>
                </div>
                {selectedEx?.name === ex.name && (
                  <span style={{ fontSize: 16, color: 'var(--ff-orange)' }}>✓</span>
                )}
              </div>
            ))}
          </div>

          {/* Sets builder — only shows when exercise selected */}
          {selectedEx && (
            <div style={{ background: 'var(--ff-card)', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: 'var(--ff-orange)' }}>
                {selectedEx.name}
              </div>

              {/* Set rows */}
              <div style={{ display: 'grid', gridTemplateColumns: '24px 1fr 1fr 20px', gap: '6px 10px', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: 'var(--ff-muted)', fontWeight: 600 }}>SET</div>
                <div style={{ fontSize: 10, color: 'var(--ff-muted)', fontWeight: 600 }}>REPS</div>
                <div style={{ fontSize: 10, color: 'var(--ff-muted)', fontWeight: 600 }}>KG</div>
                <div />

                {sets.map((s, i) => (
                  <>
                    <div key={`n${i}`} style={{ fontSize: 12, fontWeight: 600, color: 'var(--ff-muted)' }}>{i + 1}</div>
                    <input
                      key={`r${i}`}
                      type="number" value={s.reps} min={1} max={100}
                      onChange={e => updateSet(i, 'reps', e.target.value)}
                      className="ff-input"
                      style={{ padding: '6px 8px', fontSize: 13 }}
                    />
                    <input
                      key={`w${i}`}
                      type="number" value={s.weight} min={0} max={500}
                      onChange={e => updateSet(i, 'weight', e.target.value)}
                      className="ff-input"
                      style={{ padding: '6px 8px', fontSize: 13 }}
                    />
                    <span
                      key={`x${i}`}
                      onClick={() => sets.length > 1 && removeSet(i)}
                      style={{ fontSize: 16, color: sets.length > 1 ? 'var(--ff-muted)' : 'transparent', cursor: sets.length > 1 ? 'pointer' : 'default' }}
                    >×</span>
                  </>
                ))}
              </div>

              <button
                onClick={addSet}
                style={{ fontSize: 12, fontWeight: 500, color: 'var(--ff-orange)', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', marginBottom: 12 }}
              >
                + Add set
              </button>

              <button className="btn-save" onClick={handleAddExercise}>
                Add to Workout
              </button>
            </div>
          )}
        </div>

        {/* RIGHT — Added exercises */}
        <div>
          <div className="section-label">Your workout</div>

          {addedExercises.length === 0 && (
            <div style={{
              background: 'var(--ff-card)', borderRadius: 12,
              padding: '32px 20px', textAlign: 'center',
              fontSize: 13, color: 'var(--ff-muted)',
            }}>
              Pick an exercise on the left and add sets to build your workout
            </div>
          )}

          {addedExercises.map((ex, i) => (
            <div key={i} style={{
              background: 'var(--ff-surface)',
              border: '1px solid var(--ff-border)',
              borderRadius: 12, padding: 14, marginBottom: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{ex.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--ff-muted)', marginTop: 2 }}>{ex.muscle} · {ex.sets.length} sets</div>
                </div>
                <span
                  onClick={() => removeExercise(i)}
                  style={{ fontSize: 18, color: 'var(--ff-muted)', cursor: 'pointer' }}
                  onMouseEnter={e => e.target.style.color = '#e24b4a'}
                  onMouseLeave={e => e.target.style.color = 'var(--ff-muted)'}
                >×</span>
              </div>

              {/* Sets summary */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {ex.sets.map((s, si) => (
                  <span key={si} style={{
                    fontSize: 11, fontWeight: 500,
                    background: 'var(--ff-orange-light)',
                    color: 'var(--ff-orange)',
                    padding: '3px 8px', borderRadius: 20,
                  }}>
                    {s.reps} reps @ {s.weight}kg
                  </span>
                ))}
              </div>
            </div>
          ))}

          {addedExercises.length > 0 && (
            <button
              className="btn-save"
              onClick={handleSave}
              style={{ marginTop: 8 }}
            >
              Save Workout ({addedExercises.length} exercises · {totalSets} sets)
            </button>
          )}
        </div>
      </div>
    </div>
  )
}