import { useState, useEffect, useRef, useCallback } from 'react'
import { enableNoSleep, disableNoSleep } from '../utils/nosleep'

export function useObjectWriting(prompts, durationSeconds = 600) {
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [timeLeft, setTimeLeft] = useState(durationSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const previousPromptRef = useRef('')
  const timerRef = useRef(null)
  const durationRef = useRef(durationSeconds)
  const endTimeRef = useRef(null) // Store end timestamp

  // Update duration ref when it changes
  useEffect(() => {
    durationRef.current = durationSeconds
    if (!isRunning && !isComplete) {
      setTimeLeft(durationSeconds)
    }
  }, [durationSeconds, isRunning, isComplete])

  const getRandomPrompt = useCallback(() => {
    if (!prompts || prompts.length === 0) return ''
    if (prompts.length === 1) return prompts[0]

    let newPrompt
    do {
      newPrompt = prompts[Math.floor(Math.random() * prompts.length)]
    } while (newPrompt === previousPromptRef.current)

    previousPromptRef.current = newPrompt
    return newPrompt
  }, [prompts])

  const startExercise = useCallback(async () => {
    // Enable NoSleep IMMEDIATELY during user gesture (button click)
    await enableNoSleep()

    setCurrentPrompt(getRandomPrompt())
    setTimeLeft(durationRef.current)
    setIsRunning(true)
    setIsComplete(false)
    // Set end time as timestamp
    endTimeRef.current = Date.now() + (durationRef.current * 1000)
  }, [getRandomPrompt])

  const getNewPrompt = useCallback(() => {
    setCurrentPrompt(getRandomPrompt())
  }, [getRandomPrompt])

  const restartTimer = useCallback(() => {
    setTimeLeft(durationRef.current)
    setIsComplete(false)
    setIsRunning(true)
    endTimeRef.current = Date.now() + (durationRef.current * 1000)
  }, [])

  const reset = useCallback(async () => {
    setCurrentPrompt('')
    setTimeLeft(durationRef.current)
    setIsRunning(false)
    setIsComplete(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    // Disable NoSleep when timer is reset
    await disableNoSleep()
  }, [])

  // Timer based on timestamps - survives screen lock
  useEffect(() => {
    if (isRunning && endTimeRef.current) {
      timerRef.current = setInterval(() => {
        const now = Date.now()
        const remaining = Math.ceil((endTimeRef.current - now) / 1000)

        if (remaining <= 0) {
          setTimeLeft(0)
          setIsRunning(false)
          setIsComplete(true)
          if (timerRef.current) {
            clearInterval(timerRef.current)
          }
          // Disable NoSleep when timer completes
          disableNoSleep()
        } else {
          setTimeLeft(remaining)
        }
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isRunning])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return {
    currentPrompt,
    timeLeft,
    formattedTime: formatTime(timeLeft),
    isRunning,
    isComplete,
    startExercise,
    getNewPrompt,
    restartTimer,
    reset,
  }
}
