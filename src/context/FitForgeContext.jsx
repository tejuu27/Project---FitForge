import { createContext, useContext, useState, useEffect } from 'react'

const FitForgeContext = createContext()

const loadFromStorage = (key, fallback) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

export function FitForgeProvider({ children }) {
  const [workouts, setWorkouts] = useState(() => loadFromStorage('ff_workouts', []))

  // Save to localStorage whenever workouts change
  useEffect(() => {
    localStorage.setItem('ff_workouts', JSON.stringify(workouts))
  }, [workouts])

  const addWorkout = (workout) => {
    const newWorkout = {
      ...workout,
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      timestamp: new Date().toDateString(),
    }
    setWorkouts(prev => [newWorkout, ...prev])
  }

  const deleteWorkout = (id) => {
    setWorkouts(prev => prev.filter(w => w.id !== id))
  }

  // --- Streak calculation ---
  const workedDays = [...new Set(workouts.map(w => w.timestamp).filter(Boolean))]

  const calcCurrentStreak = () => {
    if (workedDays.length === 0) return 0
    let streak = 0
    const checkDate = new Date()
    while (true) {
      const dateStr = checkDate.toDateString()
      if (workedDays.includes(dateStr)) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }
    return streak
  }

  const calcBestStreak = () => {
    if (workedDays.length === 0) return 0
    const sorted = workedDays
      .map(d => new Date(d))
      .sort((a, b) => a - b)
    let best = 1
    let current = 1
    for (let i = 1; i < sorted.length; i++) {
      const diff = (sorted[i] - sorted[i - 1]) / (1000 * 60 * 60 * 24)
      if (Math.round(diff) === 1) {
        current++
        best = Math.max(best, current)
      } else if (diff > 1) {
        current = 1
      }
    }
    return best
  }

  const currentStreak = calcCurrentStreak()
  const bestStreak = calcBestStreak()

  // --- Week days ---
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label, i) => {
    const now = new Date()
    const dayOfWeek = now.getDay()
    const adjustedToday = dayOfWeek === 0 ? 6 : dayOfWeek - 1

    const diff = i - adjustedToday
    const slotDate = new Date(now)
    slotDate.setDate(now.getDate() + diff)
    const slotStr = slotDate.toDateString()

    return {
      label,
      done: i < adjustedToday && workedDays.includes(slotStr),
      today: i === adjustedToday,
      worked: workedDays.includes(slotStr),
    }
  })

  const thisWeekCount = weekDays.filter(d => d.worked).length

  // --- Weekly chart ---
  const weeklyChartData = Array.from({ length: 7 }, (_, i) => {
    const weekStart = new Date()
    weekStart.setHours(0, 0, 0, 0)
    weekStart.setDate(weekStart.getDate() - (6 - i) * 7)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 7)
    return workouts.filter(w => {
      if (!w.timestamp) return false
      const d = new Date(w.timestamp)
      return d >= weekStart && d < weekEnd
    }).length
  })

  return (
    <FitForgeContext.Provider value={{
      workouts,
      addWorkout,
      deleteWorkout,
      currentStreak,
      bestStreak,
      weekDays,
      thisWeekCount,
      weeklyChartData,
    }}>
      {children}
    </FitForgeContext.Provider>
  )
}

export function useFitForge() {
  return useContext(FitForgeContext)
}