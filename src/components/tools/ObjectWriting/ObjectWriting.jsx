import { useState, useEffect } from 'react'
import { useObjectWriting } from '../../../hooks/useObjectWriting'
import { playChime } from '../../../utils/audio'
import './ObjectWriting.css'

const DURATION_OPTIONS = [
  { label: '1 min', seconds: 60 },
  { label: '3 min', seconds: 180 },
  { label: '5 min', seconds: 300 },
  { label: '10 min', seconds: 600 },
]

export default function ObjectWriting({ onBack }) {
  const [prompts, setPrompts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [duration, setDuration] = useState(600)

  const {
    currentPrompt,
    formattedTime,
    isRunning,
    isComplete,
    startExercise,
    getNewPrompt,
    restartTimer,
    reset,
  } = useObjectWriting(prompts, duration)

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'data/prompts.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load prompts')
        return res.json()
      })
      .then((data) => {
        setPrompts(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (isComplete) {
      playChime()
    }
  }, [isComplete])

  const handleBack = () => {
    reset()
    onBack()
  }

  if (loading) {
    return (
      <div className="object-writing">
        <p className="loading">Loading prompts...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="object-writing">
        <p className="error">Error: {error}</p>
        <button onClick={onBack} className="btn btn-secondary">
          Back
        </button>
      </div>
    )
  }

  // Initial state - not started
  if (!currentPrompt && !isComplete) {
    return (
      <div className="object-writing">
        <button onClick={handleBack} className="btn-back" aria-label="Back to home">
          &larr;
        </button>
        <div className="content">
          <h1>Object Writing</h1>
          <p className="description">
            Write freely using all your senses. Focus on the prompt and let your mind wander.
          </p>
          <div className="duration-selector">
            {DURATION_OPTIONS.map((option) => (
              <button
                key={option.seconds}
                onClick={() => setDuration(option.seconds)}
                className={`duration-btn ${duration === option.seconds ? 'selected' : ''}`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button onClick={startExercise} className="btn btn-primary btn-large">
            Start Exercise
          </button>
        </div>
      </div>
    )
  }

  // Timer complete
  if (isComplete) {
    return (
      <div className="object-writing">
        <button onClick={handleBack} className="btn-back" aria-label="Back to home">
          &larr;
        </button>
        <div className="content">
          <h2 className="complete-message">Time's up!</h2>
          <p className="prompt">{currentPrompt}</p>
          <div className="button-group">
            <button onClick={startExercise} className="btn btn-primary btn-large">
              Start Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Exercise running
  return (
    <div className="object-writing">
      <button onClick={handleBack} className="btn-back" aria-label="Back to home">
        &larr;
      </button>
      <div className="content">
        <p className="prompt">{currentPrompt}</p>
        <p className="timer">{formattedTime}</p>
        <div className="button-group">
          <button onClick={getNewPrompt} className="btn btn-secondary">
            New Prompt
          </button>
          <button onClick={restartTimer} className="btn btn-secondary">
            Restart Timer
          </button>
        </div>
      </div>
    </div>
  )
}
