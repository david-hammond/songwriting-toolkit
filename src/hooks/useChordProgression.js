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

// Key relationships for educational content
const KEY_RELATIONSHIPS = {
  dominant: {
    label: 'Dominant (V)',
    shortLabel: 'V',
    explanation: 'One step clockwise on the circle. Creates tension that wants to resolve back home.',
    usage: 'Use the V chord to build anticipation before returning to I.',
  },
  subdominant: {
    label: 'Subdominant (IV)',
    shortLabel: 'IV',
    explanation: 'One step counter-clockwise. Feels like gently moving away from home.',
    usage: 'The IV chord provides departure without strong tension.',
  },
  relativeMinor: {
    label: 'Relative Minor',
    shortLabel: 'vi',
    explanation: 'Shares all the same notes but starts from the 6th degree. Same key signature.',
    usage: 'Switch to relative minor for a sadder feel using familiar chords.',
  },
  parallelMinor: {
    label: 'Parallel Minor',
    shortLabel: 'i',
    explanation: 'Same root note but minor scale. Different key signature.',
    usage: 'Borrow chords from parallel minor for darker colors (bVI, bVII, bIII).',
  },
}

// Common progressions with enhanced educational data
const COMMON_PROGRESSIONS = [
  // Major key progressions
  {
    numerals: ['I', 'V', 'vi', 'IV'],
    name: 'Four Chords',
    description: "Pop's most famous progression",
    genre: ['pop', 'rock'],
    mood: 'anthemic',
    songs: [
      { title: 'Let It Be', artist: 'The Beatles' },
      { title: 'No Woman No Cry', artist: 'Bob Marley' },
      { title: 'Someone Like You', artist: 'Adele' },
      { title: 'With or Without You', artist: 'U2' },
    ],
    theory: 'The vi chord adds emotional depth to the bright I-V. Starting on I establishes home before exploring.',
  },
  {
    numerals: ['I', 'IV', 'V', 'I'],
    name: 'Classic',
    description: 'Traditional resolution',
    genre: ['folk', 'country', 'rock'],
    mood: 'resolved',
    songs: [
      { title: 'Twist and Shout', artist: 'The Beatles' },
      { title: 'La Bamba', artist: 'Ritchie Valens' },
      { title: 'Wild Thing', artist: 'The Troggs' },
    ],
    theory: 'The oldest progression in Western music. IV-V-I is the "authentic cadence" - maximum resolution.',
  },
  {
    numerals: ['I', 'vi', 'IV', 'V'],
    name: '50s',
    description: 'Doo-wop progression',
    genre: ['pop', 'doo-wop'],
    mood: 'nostalgic',
    songs: [
      { title: 'Stand By Me', artist: 'Ben E. King' },
      { title: 'Every Breath You Take', artist: 'The Police' },
      { title: 'Earth Angel', artist: 'The Penguins' },
    ],
    theory: 'The vi after I creates instant emotional pull. Classic sound of 1950s pop and doo-wop.',
  },
  {
    numerals: ['vi', 'IV', 'I', 'V'],
    name: 'Axis',
    description: 'Sensitive/emotional rotation',
    genre: ['pop'],
    mood: 'emotional',
    songs: [
      { title: 'Despacito', artist: 'Luis Fonsi' },
      { title: 'Grenade', artist: 'Bruno Mars' },
      { title: 'Save Tonight', artist: 'Eagle-Eye Cherry' },
    ],
    theory: 'Same chords as Four Chords but starting on vi. Creates a more vulnerable, emotional feel.',
  },
  {
    numerals: ['I', 'V', 'IV', 'I'],
    name: 'Rock',
    description: 'Simple rock progression',
    genre: ['rock'],
    mood: 'driving',
    songs: [
      { title: 'Born This Way', artist: 'Lady Gaga' },
      { title: 'Louie Louie', artist: 'The Kingsmen' },
    ],
    theory: 'V before IV creates a "retrogression" - feels like confident swagger rather than resolution.',
  },
  {
    numerals: ['I', 'bVII', 'IV', 'I'],
    name: 'Mixolydian',
    description: 'Rock/folk borrowed chord',
    genre: ['rock', 'folk'],
    mood: 'earthy',
    songs: [
      { title: 'Sweet Child O\' Mine', artist: 'Guns N\' Roses' },
      { title: 'Sympathy for the Devil', artist: 'Rolling Stones' },
      { title: 'Hey Jude (coda)', artist: 'The Beatles' },
    ],
    theory: 'The bVII is borrowed from the parallel minor/Mixolydian mode. Adds a bluesy, earthy flavor.',
  },
  {
    numerals: ['ii', 'V', 'I'],
    name: 'Jazz ii-V-I',
    description: 'Jazz standard cadence',
    genre: ['jazz'],
    mood: 'sophisticated',
    songs: [
      { title: 'Fly Me to the Moon', artist: 'Frank Sinatra' },
      { title: 'Autumn Leaves', artist: 'Jazz Standard' },
      { title: 'All The Things You Are', artist: 'Jazz Standard' },
    ],
    theory: 'The foundation of jazz harmony. ii-V creates smooth voice leading into I. Often extended with 7ths.',
  },
  // Minor key progressions
  {
    numerals: ['i', 'bVI', 'bIII', 'bVII'],
    name: 'Minor Pop',
    description: 'Minor equivalent of Four Chords',
    genre: ['pop', 'rock'],
    mood: 'dark',
    songs: [
      { title: 'What\'s Up', artist: '4 Non Blondes' },
      { title: 'Zombie', artist: 'The Cranberries' },
    ],
    theory: 'The minor key version of the Four Chords. All chords from natural minor scale - no leading tone tension.',
  },
  {
    numerals: ['i', 'bVII', 'bVI', 'V'],
    name: 'Andalusian',
    description: 'Spanish/flamenco descent',
    genre: ['flamenco', 'rock'],
    mood: 'dramatic',
    songs: [
      { title: 'Smooth', artist: 'Santana' },
      { title: 'Sultans of Swing', artist: 'Dire Straits' },
      { title: 'Hit The Road Jack', artist: 'Ray Charles' },
    ],
    theory: 'Descending bass line from i to V. The major V at the end (from harmonic minor) creates strong pull back.',
  },
  {
    numerals: ['i', 'bVII', 'bVI', 'bVII'],
    name: 'Minor Rock',
    description: 'Minor key rock feel',
    genre: ['rock'],
    mood: 'powerful',
    songs: [
      { title: 'All Along the Watchtower', artist: 'Bob Dylan/Hendrix' },
      { title: 'Stairway to Heaven (verse)', artist: 'Led Zeppelin' },
    ],
    theory: 'Avoids the V chord entirely - stays in natural minor for a modal, less "resolved" sound.',
  },
  {
    numerals: ['i', 'iv', 'bVII', 'i'],
    name: 'Minor Blues',
    description: 'Minor blues feel',
    genre: ['blues', 'rock'],
    mood: 'bluesy',
    songs: [
      { title: 'The Thrill Is Gone', artist: 'B.B. King' },
      { title: 'Black Magic Woman', artist: 'Santana' },
    ],
    theory: 'Minor version of the I-IV-V blues. The iv (minor subdominant) adds extra darkness.',
  },
]

// Genre definitions for filtering
const GENRES = [
  { id: 'pop', label: 'Pop', description: 'Catchy, emotionally direct' },
  { id: 'rock', label: 'Rock', description: 'Power and energy' },
  { id: 'jazz', label: 'Jazz', description: 'Sophisticated harmony' },
  { id: 'blues', label: 'Blues', description: 'Raw, soulful emotion' },
  { id: 'folk', label: 'Folk', description: 'Simple, storytelling' },
  { id: 'country', label: 'Country', description: 'Traditional, heartfelt' },
]

// Map of triad to 7th chord conversions
const SEVENTH_MAP = {
  // Major chords -> maj7
  '': 'maj7',
  'maj7': '',
  // Minor chords -> m7
  'm': 'm7',
  'm7': 'm',
  // Dominant 7 (for V chord)
  '7': '',
  // Diminished -> half-diminished
  'dim': 'm7b5',
  'm7b5': 'dim',
}

// Toggle a chord between its triad and 7th form
function toggleChordQuality(chord) {
  // Parse the chord: root + quality
  const match = chord.match(/^([A-G][#b]?)(m7b5|maj7|m7|dim|m|7)?$/)
  if (!match) return chord

  const root = match[1]
  const quality = match[2] || ''

  // Get the toggled quality
  const newQuality = SEVENTH_MAP[quality]
  if (newQuality === undefined) return chord

  return root + newQuality
}

// Check if a chord is a 7th chord
function is7thChord(chord) {
  return /maj7|m7b5|m7|7/.test(chord)
}

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

// Detect if current progression matches a known pattern
function detectProgression(progression, key, chordsInKey) {
  if (progression.length < 3) return null

  // Convert progression to numerals for comparison
  const numerals = progression.map((chord) => {
    // Find in diatonic chords first
    const diatonic = chordsInKey.find(
      (c) => c.chord === chord || c.triad === chord || c.root === chord.replace(/m|dim|7|maj7|m7|m7b5/g, '')
    )
    if (diatonic) {
      // Check if it's minor when it should be major (or vice versa)
      const isMinor = chord.includes('m') && !chord.includes('maj')
      const expectedMinor = diatonic.quality === 'm' || diatonic.quality === 'dim'
      if (isMinor !== expectedMinor && diatonic.degree !== 'vii°') {
        // Could be borrowed chord - check for lowercase
        return diatonic.degree.toLowerCase()
      }
      return diatonic.degree
    }
    // Check for borrowed chords (bVII, bVI, bIII)
    const rootIndex = getNoteIndex(key)
    const chordRoot = chord.replace(/m|dim|7|maj7|m7|m7b5/g, '')
    const chordIndex = getNoteIndex(chordRoot)
    if (chordIndex === -1) return null

    const interval = ((chordIndex - rootIndex + 12) % 12)
    // Common borrowed chords
    if (interval === 10) return 'bVII' // Flat 7
    if (interval === 8) return 'bVI' // Flat 6
    if (interval === 3) return 'bIII' // Flat 3
    return null
  })

  // Check against known progressions
  for (const prog of COMMON_PROGRESSIONS) {
    if (prog.numerals.length !== numerals.length) continue

    const matches = prog.numerals.every((numeral, i) => {
      const actual = numerals[i]
      if (!actual) return false
      // Normalize for comparison (case-insensitive for degree, handle vii° vs vii)
      const normalizedProg = numeral.toLowerCase().replace('°', '')
      const normalizedActual = actual.toLowerCase().replace('°', '')
      return normalizedProg === normalizedActual
    })

    if (matches) return prog
  }

  return null
}

// Get chord function (tonic, dominant, subdominant, etc.)
function getChordFunction(degree) {
  const functions = {
    'I': 'tonic',
    'i': 'tonic',
    'ii': 'subdominant',
    'II': 'subdominant',
    'iii': 'tonic', // Tonic substitute
    'III': 'tonic',
    'bIII': 'tonic',
    'IV': 'subdominant',
    'iv': 'subdominant',
    'V': 'dominant',
    'v': 'dominant',
    'vi': 'tonic', // Tonic substitute
    'VI': 'tonic',
    'bVI': 'subdominant',
    'vii°': 'dominant', // Dominant substitute
    'VII': 'dominant',
    'bVII': 'subdominant',
  }
  return functions[degree] || 'other'
}

export function useChordProgression() {
  const [key, setKey] = useState('C')
  const [progression, setProgression] = useState([])
  const [genreFilter, setGenreFilter] = useState(null)

  // Always show triads in the "Chords in Key" section - user can tap to add 7ths in progression
  const chordsInKey = useMemo(() => getChordsInKey(key, false), [key])
  const relatedKeys = useMemo(() => getRelatedKeys(key), [key])

  // Add chord function to each chord in key
  const chordsWithFunction = useMemo(() => {
    return chordsInKey.map((c) => ({
      ...c,
      function: getChordFunction(c.degree),
    }))
  }, [chordsInKey])

  // Detect if current progression matches a known pattern
  const detectedProgression = useMemo(() => {
    return detectProgression(progression, key, chordsInKey)
  }, [progression, key, chordsInKey])

  // Filter progressions by genre
  const filteredProgressions = useMemo(() => {
    if (!genreFilter) return COMMON_PROGRESSIONS
    return COMMON_PROGRESSIONS.filter((p) => p.genre && p.genre.includes(genreFilter))
  }, [genreFilter])

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

  // Toggle a chord at a specific index between triad and 7th
  const toggleChordAt = useCallback((index) => {
    setProgression((prev) => {
      const newProgression = [...prev]
      if (index >= 0 && index < newProgression.length) {
        newProgression[index] = toggleChordQuality(newProgression[index])
      }
      return newProgression
    })
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
    chordsWithFunction,
    relatedKeys,
    suggestedNext,
    commonProgressions: COMMON_PROGRESSIONS,
    filteredProgressions,
    circleOfFifths: CIRCLE_OF_FIFTHS,
    keyRelationships: KEY_RELATIONSHIPS,
    genres: GENRES,
    genreFilter,
    setGenreFilter,
    detectedProgression,
    addChord,
    removeLastChord,
    clearProgression,
    toggleChordAt,
    is7thChord,
    applyCommonProgression,
    getChordFunction,
  }
}
