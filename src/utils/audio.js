let audioContext = null

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext
}

// Note frequencies for octave 4 (middle octave)
const NOTE_FREQUENCIES = {
  C: 261.63,
  'C#': 277.18,
  Db: 277.18,
  D: 293.66,
  'D#': 311.13,
  Eb: 311.13,
  E: 329.63,
  F: 349.23,
  'F#': 369.99,
  Gb: 369.99,
  G: 392.0,
  'G#': 415.3,
  Ab: 415.3,
  A: 440.0,
  'A#': 466.16,
  Bb: 466.16,
  B: 493.88,
}

function parseChord(chordName) {
  // Extract root note and quality from chord name (e.g., "Am", "F#m", "Bdim")
  const match = chordName.match(/^([A-G][#b]?)(m|dim)?$/)
  if (!match) return null

  const root = match[1]
  const quality = match[2] || '' // '', 'm', or 'dim'

  return { root, quality }
}

function getChordFrequencies(chordName) {
  const parsed = parseChord(chordName)
  if (!parsed) return []

  const rootFreq = NOTE_FREQUENCIES[parsed.root]
  if (!rootFreq) return []

  // Intervals in semitones from root
  let intervals
  if (parsed.quality === 'm') {
    intervals = [0, 3, 7] // Minor: root, minor 3rd, perfect 5th
  } else if (parsed.quality === 'dim') {
    intervals = [0, 3, 6] // Diminished: root, minor 3rd, diminished 5th
  } else {
    intervals = [0, 4, 7] // Major: root, major 3rd, perfect 5th
  }

  // Calculate frequencies (using equal temperament)
  return intervals.map((semitones) => rootFreq * Math.pow(2, semitones / 12))
}

export function playChord(chordName, duration = 0.8) {
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    const frequencies = getChordFrequencies(chordName)
    if (frequencies.length === 0) return

    const now = ctx.currentTime

    frequencies.forEach((freq) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.type = 'triangle'
      oscillator.frequency.setValueAtTime(freq, now)

      // Soft attack and release
      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(0.15, now + 0.05)
      gainNode.gain.setValueAtTime(0.15, now + duration - 0.1)
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration)

      oscillator.start(now)
      oscillator.stop(now + duration)
    })
  } catch (error) {
    console.log('Audio not available:', error.message)
  }
}

export function playProgression(chords, tempo = 100) {
  const beatDuration = 60 / tempo // seconds per beat
  const chordDuration = beatDuration * 2 // 2 beats per chord

  chords.forEach((chord, index) => {
    setTimeout(() => {
      playChord(chord, chordDuration * 0.9)
    }, index * chordDuration * 1000)
  })

  // Return total duration in ms for UI feedback
  return chords.length * chordDuration * 1000
}

export function playChime() {
  try {
    const ctx = getAudioContext()

    // Resume audio context if suspended (required for mobile)
    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    const now = ctx.currentTime

    // Create a pleasant chime with two tones
    const frequencies = [523.25, 659.25] // C5 and E5

    frequencies.forEach((freq, index) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(freq, now)

      // Envelope: quick attack, gentle decay
      const startTime = now + index * 0.1
      gainNode.gain.setValueAtTime(0, startTime)
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.02)
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 1.5)

      oscillator.start(startTime)
      oscillator.stop(startTime + 1.5)
    })
  } catch (error) {
    // Graceful fallback - audio not available
    console.log('Audio not available:', error.message)
  }
}
