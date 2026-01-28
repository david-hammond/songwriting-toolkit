import './PianoDiagram.css'

// Note names in chromatic order
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const NOTES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']

// Intervals for different chord types (semitones from root)
const CHORD_INTERVALS = {
  '': [0, 4, 7], // Major
  'm': [0, 3, 7], // Minor
  'dim': [0, 3, 6], // Diminished
  'aug': [0, 4, 8], // Augmented
  'maj7': [0, 4, 7, 11], // Major 7
  'm7': [0, 3, 7, 10], // Minor 7
  '7': [0, 4, 7, 10], // Dominant 7
  'm7b5': [0, 3, 6, 10], // Half-diminished
  'dim7': [0, 3, 6, 9], // Diminished 7
}

// Parse chord name into root and quality
function parseChord(chord) {
  const match = chord.match(/^([A-G][#b]?)(m7b5|maj7|dim7|aug|dim|m7|m|7)?$/)
  if (!match) return null
  return {
    root: match[1],
    quality: match[2] || '',
  }
}

// Get note index (0-11)
function getNoteIndex(note) {
  let idx = NOTES.indexOf(note)
  if (idx === -1) idx = NOTES_FLAT.indexOf(note)
  return idx
}

// Get notes in a chord
function getChordNotes(chord) {
  const parsed = parseChord(chord)
  if (!parsed) return []

  const rootIndex = getNoteIndex(parsed.root)
  if (rootIndex === -1) return []

  const intervals = CHORD_INTERVALS[parsed.quality]
  if (!intervals) return []

  return intervals.map((interval) => (rootIndex + interval) % 12)
}

// Check if a note index is a black key
function isBlackKey(noteIndex) {
  return [1, 3, 6, 8, 10].includes(noteIndex)
}

export default function PianoDiagram({ chord, size = 80 }) {
  const chordNotes = getChordNotes(chord)

  // Show one octave (C to B) plus the next C
  const whiteKeys = [0, 2, 4, 5, 7, 9, 11] // C, D, E, F, G, A, B
  const blackKeys = [1, 3, 6, 8, 10] // C#, D#, F#, G#, A#

  // SVG dimensions
  const width = size * 1.4
  const height = size
  const whiteKeyWidth = width / 7
  const blackKeyWidth = whiteKeyWidth * 0.6
  const blackKeyHeight = height * 0.6

  // Black key positions (offset from left edge of white key)
  const blackKeyPositions = {
    1: 0, // C# after C
    3: 1, // D# after D
    6: 3, // F# after F
    8: 4, // G# after G
    10: 5, // A# after A
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="piano-diagram"
      style={{ width: size * 1.4, height: size }}
      role="img"
      aria-label={`Piano chord diagram for ${chord}`}
    >
      {/* White keys */}
      {whiteKeys.map((noteIndex, i) => {
        const isPressed = chordNotes.includes(noteIndex)
        return (
          <rect
            key={`white-${noteIndex}`}
            x={i * whiteKeyWidth}
            y={0}
            width={whiteKeyWidth - 1}
            height={height - 1}
            className={`piano-key white ${isPressed ? 'pressed' : ''}`}
            rx={2}
          />
        )
      })}

      {/* Black keys */}
      {blackKeys.map((noteIndex) => {
        const isPressed = chordNotes.includes(noteIndex)
        const whiteKeyIndex = blackKeyPositions[noteIndex]
        const x = (whiteKeyIndex + 1) * whiteKeyWidth - blackKeyWidth / 2

        return (
          <rect
            key={`black-${noteIndex}`}
            x={x}
            y={0}
            width={blackKeyWidth}
            height={blackKeyHeight}
            className={`piano-key black ${isPressed ? 'pressed' : ''}`}
            rx={2}
          />
        )
      })}
    </svg>
  )
}
