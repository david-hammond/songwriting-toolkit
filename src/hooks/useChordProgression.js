import { useState, useCallback, useMemo } from 'react'

// Circle of fifths - clockwise
const CIRCLE_OF_FIFTHS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F']

// Enharmonic equivalents
const ENHARMONIC = {
  'F#': 'Gb',
  'Gb': 'F#',
  'Db': 'C#',
  'C#': 'Db',
}

// Scale degrees for major keys (chord qualities)
const MAJOR_SCALE_CHORDS = [
  { degree: 'I', quality: '', quality7: 'maj7', name: 'Tonic' },
  { degree: 'ii', quality: 'm', quality7: 'm7', name: 'Supertonic' },
  { degree: 'iii', quality: 'm', quality7: 'm7', name: 'Mediant' },
  { degree: 'IV', quality: '', quality7: 'maj7', name: 'Subdominant' },
  { degree: 'V', quality: '', quality7: '7', name: 'Dominant' },
  { degree: 'vi', quality: 'm', quality7: 'm7', name: 'Submediant' },
  { degree: 'vii°', quality: 'dim', quality7: 'm7b5', name: 'Leading Tone' },
]

// Semitones from root for major scale
const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11]

// All notes in chromatic order
const CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const CHROMATIC_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']

// Common progressions with descriptions
const COMMON_PROGRESSIONS = [
  // Major key progressions
  { numerals: ['I', 'V', 'vi', 'IV'], name: 'Four Chords', description: "Pop's most famous progression" },
  { numerals: ['I', 'IV', 'V', 'I'], name: 'Classic', description: 'Traditional resolution' },
  { numerals: ['I', 'vi', 'IV', 'V'], name: '50s', description: 'Doo-wop progression' },
  { numerals: ['vi', 'IV', 'I', 'V'], name: 'Axis', description: 'Sensitive/emotional rotation' },
  { numerals: ['I', 'V', 'IV', 'I'], name: 'Rock', description: 'Simple rock progression' },
  { numerals: ['I', 'bVII', 'IV', 'I'], name: 'Mixolydian', description: 'Rock/folk borrowed chord' },
  { numerals: ['ii', 'V', 'I'], name: 'Jazz ii-V-I', description: 'Jazz standard cadence' },
  // Minor key progressions (using parallel minor)
  { numerals: ['i', 'bVI', 'bIII', 'bVII'], name: 'Minor Pop', description: 'Minor equivalent of Four Chords' },
  { numerals: ['i', 'bVII', 'bVI', 'V'], name: 'Andalusian', description: 'Spanish/flamenco descent' },
  { numerals: ['i', 'bVII', 'bVI', 'bVII'], name: 'Minor Rock', description: 'Minor key rock feel' },
  { numerals: ['i', 'iv', 'bVII', 'i'], name: 'Minor Blues', description: 'Minor blues feel' },
]

function getNoteIndex(note) {
  const normalized = note.replace('b', 'b').replace('#', '#')
  let idx = CHROMATIC.indexOf(normalized)
  if (idx === -1) idx = CHROMATIC_FLAT.indexOf(normalized)
  return idx
}

function getNote(index, useFlats = false) {
  const normalized = ((index % 12) + 12) % 12
  return useFlats ? CHROMATIC_FLAT[normalized] : CHROMATIC[normalized]
}

function shouldUseFlats(key) {
  return ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'].includes(key)
}

function getChordsInKey(key, use7ths = false) {
  const rootIndex = getNoteIndex(key)
  const useFlats = shouldUseFlats(key)

  return MAJOR_SCALE_CHORDS.map((chord, i) => {
    const noteIndex = rootIndex + MAJOR_INTERVALS[i]
    const root = getNote(noteIndex, useFlats)
    const quality = use7ths ? chord.quality7 : chord.quality
    return {
      ...chord,
      root,
      chord: root + quality,
      triad: root + chord.quality,
      seventh: root + chord.quality7,
    }
  })
}

function getCirclePosition(key) {
  const normalized = key.replace('Gb', 'F#').replace('C#', 'Db')
  return CIRCLE_OF_FIFTHS.indexOf(normalized)
}

function getRelatedKeys(key) {
  const pos = getCirclePosition(key)
  if (pos === -1) return []

  const len = CIRCLE_OF_FIFTHS.length
  return {
    dominant: CIRCLE_OF_FIFTHS[(pos + 1) % len], // Fifth above
    subdominant: CIRCLE_OF_FIFTHS[(pos - 1 + len) % len], // Fifth below
    relativeMinor: getNote(getNoteIndex(key) + 9, shouldUseFlats(key)) + 'm',
    parallelMinor: key + 'm',
  }
}

function getSuggestedNextChords(currentChord, key) {
  const chordsInKey = getChordsInKey(key)
  const suggestions = []

  // Find current chord's degree
  const currentDegree = chordsInKey.find(
    (c) => c.chord === currentChord || c.root === currentChord.replace('m', '').replace('dim', '')
  )

  if (!currentDegree) return chordsInKey.map((c) => c.chord)

  // Common chord movements based on music theory
  const movements = {
    I: ['IV', 'V', 'vi', 'ii'],
    ii: ['V', 'vii°', 'IV'],
    iii: ['vi', 'IV', 'ii'],
    IV: ['V', 'I', 'ii', 'vii°'],
    V: ['I', 'vi', 'IV'],
    vi: ['ii', 'IV', 'V', 'iii'],
    'vii°': ['I', 'iii'],
  }

  const nextDegrees = movements[currentDegree.degree] || ['I', 'IV', 'V']

  nextDegrees.forEach((degree) => {
    const found = chordsInKey.find((c) => c.degree === degree)
    if (found) suggestions.push(found.chord)
  })

  return suggestions
}

export function useChordProgression() {
  const [key, setKey] = useState('C')
  const [progression, setProgression] = useState([])
  const [use7ths, setUse7ths] = useState(false)

  const chordsInKey = useMemo(() => getChordsInKey(key, use7ths), [key, use7ths])
  const relatedKeys = useMemo(() => getRelatedKeys(key), [key])

  const suggestedNext = useMemo(() => {
    if (progression.length === 0) {
      return chordsInKey.slice(0, 4).map((c) => c.chord) // I, ii, iii, IV
    }
    const lastChord = progression[progression.length - 1]
    return getSuggestedNextChords(lastChord, key)
  }, [progression, key, chordsInKey])

  const addChord = useCallback((chord) => {
    setProgression((prev) => [...prev, chord])
  }, [])

  const removeLastChord = useCallback(() => {
    setProgression((prev) => prev.slice(0, -1))
  }, [])

  const clearProgression = useCallback(() => {
    setProgression([])
  }, [])

  const applyCommonProgression = useCallback(
    (numerals) => {
      const chords = numerals.map((numeral) => {
        const useFlats = shouldUseFlats(key)
        const rootIndex = getNoteIndex(key)

        // Handle minor tonic 'i' - parallel minor
        if (numeral === 'i') {
          return key + 'm'
        }

        // Handle minor subdominant 'iv' - parallel minor
        if (numeral === 'iv') {
          const noteIndex = rootIndex + 5 // 4th scale degree
          return getNote(noteIndex, useFlats) + 'm'
        }

        // Handle borrowed/modal chords like bVII, bVI, bIII
        if (numeral.startsWith('b')) {
          const degree = numeral.slice(1)
          const degreeIndex = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'].indexOf(degree.toUpperCase())
          if (degreeIndex !== -1) {
            const noteIndex = rootIndex + MAJOR_INTERVALS[degreeIndex] - 1
            return getNote(noteIndex, useFlats)
          }
        }

        // Handle major V in minor context (harmonic minor dominant)
        if (numeral === 'V' && numerals.includes('i')) {
          const noteIndex = rootIndex + 7 // 5th scale degree
          return getNote(noteIndex, useFlats)
        }

        const found = chordsInKey.find((c) => c.degree.toLowerCase() === numeral.toLowerCase())
        return found ? found.chord : numeral
      })
      setProgression(chords)
    },
    [key, chordsInKey]
  )

  return {
    key,
    setKey,
    progression,
    chordsInKey,
    relatedKeys,
    suggestedNext,
    commonProgressions: COMMON_PROGRESSIONS,
    circleOfFifths: CIRCLE_OF_FIFTHS,
    use7ths,
    setUse7ths,
    addChord,
    removeLastChord,
    clearProgression,
    applyCommonProgression,
  }
}
