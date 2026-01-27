import './ChordDiagram.css'

// Guitar chord fingerings: [E, A, D, G, B, e] where -1 = muted, 0 = open
const GUITAR_CHORDS = {
  // Major chords
  C: { frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], barres: [] },
  D: { frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], barres: [] },
  E: { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0], barres: [] },
  F: { frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], barres: [{ fret: 1, from: 0, to: 5 }] },
  G: { frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3], barres: [] },
  A: { frets: [-1, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0], barres: [] },
  B: { frets: [-1, 2, 4, 4, 4, 2], fingers: [0, 1, 2, 3, 4, 1], barres: [{ fret: 2, from: 1, to: 5 }] },
  'F#': { frets: [2, 4, 4, 3, 2, 2], fingers: [1, 3, 4, 2, 1, 1], barres: [{ fret: 2, from: 0, to: 5 }] },
  'Gb': { frets: [2, 4, 4, 3, 2, 2], fingers: [1, 3, 4, 2, 1, 1], barres: [{ fret: 2, from: 0, to: 5 }] },
  'C#': { frets: [-1, 4, 6, 6, 6, 4], fingers: [0, 1, 2, 3, 4, 1], barres: [{ fret: 4, from: 1, to: 5 }] },
  'Db': { frets: [-1, 4, 6, 6, 6, 4], fingers: [0, 1, 2, 3, 4, 1], barres: [{ fret: 4, from: 1, to: 5 }] },
  'D#': { frets: [-1, 6, 8, 8, 8, 6], fingers: [0, 1, 2, 3, 4, 1], barres: [{ fret: 6, from: 1, to: 5 }] },
  'Eb': { frets: [-1, 6, 8, 8, 8, 6], fingers: [0, 1, 2, 3, 4, 1], barres: [{ fret: 6, from: 1, to: 5 }] },
  'G#': { frets: [4, 6, 6, 5, 4, 4], fingers: [1, 3, 4, 2, 1, 1], barres: [{ fret: 4, from: 0, to: 5 }] },
  'Ab': { frets: [4, 6, 6, 5, 4, 4], fingers: [1, 3, 4, 2, 1, 1], barres: [{ fret: 4, from: 0, to: 5 }] },
  'A#': { frets: [-1, 1, 3, 3, 3, 1], fingers: [0, 1, 2, 3, 4, 1], barres: [{ fret: 1, from: 1, to: 5 }] },
  'Bb': { frets: [-1, 1, 3, 3, 3, 1], fingers: [0, 1, 2, 3, 4, 1], barres: [{ fret: 1, from: 1, to: 5 }] },

  // Minor chords
  Cm: { frets: [-1, 3, 5, 5, 4, 3], fingers: [0, 1, 3, 4, 2, 1], barres: [{ fret: 3, from: 1, to: 5 }] },
  Dm: { frets: [-1, -1, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1], barres: [] },
  Em: { frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], barres: [] },
  Fm: { frets: [1, 3, 3, 1, 1, 1], fingers: [1, 3, 4, 1, 1, 1], barres: [{ fret: 1, from: 0, to: 5 }] },
  Gm: { frets: [3, 5, 5, 3, 3, 3], fingers: [1, 3, 4, 1, 1, 1], barres: [{ fret: 3, from: 0, to: 5 }] },
  Am: { frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], barres: [] },
  Bm: { frets: [-1, 2, 4, 4, 3, 2], fingers: [0, 1, 3, 4, 2, 1], barres: [{ fret: 2, from: 1, to: 5 }] },
  'F#m': { frets: [2, 4, 4, 2, 2, 2], fingers: [1, 3, 4, 1, 1, 1], barres: [{ fret: 2, from: 0, to: 5 }] },
  'Gbm': { frets: [2, 4, 4, 2, 2, 2], fingers: [1, 3, 4, 1, 1, 1], barres: [{ fret: 2, from: 0, to: 5 }] },
  'C#m': { frets: [-1, 4, 6, 6, 5, 4], fingers: [0, 1, 3, 4, 2, 1], barres: [{ fret: 4, from: 1, to: 5 }] },
  'Dbm': { frets: [-1, 4, 6, 6, 5, 4], fingers: [0, 1, 3, 4, 2, 1], barres: [{ fret: 4, from: 1, to: 5 }] },
  'D#m': { frets: [-1, 6, 8, 8, 7, 6], fingers: [0, 1, 3, 4, 2, 1], barres: [{ fret: 6, from: 1, to: 5 }] },
  'Ebm': { frets: [-1, 6, 8, 8, 7, 6], fingers: [0, 1, 3, 4, 2, 1], barres: [{ fret: 6, from: 1, to: 5 }] },
  'G#m': { frets: [4, 6, 6, 4, 4, 4], fingers: [1, 3, 4, 1, 1, 1], barres: [{ fret: 4, from: 0, to: 5 }] },
  'Abm': { frets: [4, 6, 6, 4, 4, 4], fingers: [1, 3, 4, 1, 1, 1], barres: [{ fret: 4, from: 0, to: 5 }] },
  'A#m': { frets: [-1, 1, 3, 3, 2, 1], fingers: [0, 1, 3, 4, 2, 1], barres: [{ fret: 1, from: 1, to: 5 }] },
  'Bbm': { frets: [-1, 1, 3, 3, 2, 1], fingers: [0, 1, 3, 4, 2, 1], barres: [{ fret: 1, from: 1, to: 5 }] },

  // Diminished chords
  Cdim: { frets: [-1, 3, 4, 2, 4, 2], fingers: [0, 2, 3, 1, 4, 1], barres: [] },
  Ddim: { frets: [-1, -1, 0, 1, 3, 1], fingers: [0, 0, 0, 1, 3, 2], barres: [] },
  Edim: { frets: [0, 1, 2, 0, 2, 0], fingers: [0, 1, 2, 0, 3, 0], barres: [] },
  Fdim: { frets: [-1, -1, 3, 4, 3, 4], fingers: [0, 0, 1, 2, 1, 3], barres: [] },
  Gdim: { frets: [-1, -1, 5, 6, 5, 6], fingers: [0, 0, 1, 2, 1, 3], barres: [] },
  Adim: { frets: [-1, 0, 1, 2, 1, 2], fingers: [0, 0, 1, 3, 2, 4], barres: [] },
  Bdim: { frets: [-1, 2, 3, 4, 3, -1], fingers: [0, 1, 2, 4, 3, 0], barres: [] },
  'F#dim': { frets: [-1, -1, 4, 5, 4, 5], fingers: [0, 0, 1, 2, 1, 3], barres: [] },
  'Gbdim': { frets: [-1, -1, 4, 5, 4, 5], fingers: [0, 0, 1, 2, 1, 3], barres: [] },
  'C#dim': { frets: [-1, 4, 5, 3, 5, 3], fingers: [0, 2, 3, 1, 4, 1], barres: [] },
  'Dbdim': { frets: [-1, 4, 5, 3, 5, 3], fingers: [0, 2, 3, 1, 4, 1], barres: [] },
  'D#dim': { frets: [-1, -1, 1, 2, 1, 2], fingers: [0, 0, 1, 2, 1, 3], barres: [] },
  'Ebdim': { frets: [-1, -1, 1, 2, 1, 2], fingers: [0, 0, 1, 2, 1, 3], barres: [] },
  'G#dim': { frets: [-1, -1, 6, 7, 6, 7], fingers: [0, 0, 1, 2, 1, 3], barres: [] },
  'Abdim': { frets: [-1, -1, 6, 7, 6, 7], fingers: [0, 0, 1, 2, 1, 3], barres: [] },
  'A#dim': { frets: [-1, 1, 2, 3, 2, -1], fingers: [0, 1, 2, 4, 3, 0], barres: [] },
  'Bbdim': { frets: [-1, 1, 2, 3, 2, -1], fingers: [0, 1, 2, 4, 3, 0], barres: [] },

  // Major 7th chords
  Cmaj7: { frets: [-1, 3, 2, 0, 0, 0], fingers: [0, 3, 2, 0, 0, 0], barres: [] },
  Dmaj7: { frets: [-1, -1, 0, 2, 2, 2], fingers: [0, 0, 0, 1, 1, 1], barres: [] },
  Emaj7: { frets: [0, 2, 1, 1, 0, 0], fingers: [0, 3, 1, 2, 0, 0], barres: [] },
  Fmaj7: { frets: [1, -1, 2, 2, 1, 0], fingers: [1, 0, 3, 4, 2, 0], barres: [] },
  Gmaj7: { frets: [3, 2, 0, 0, 0, 2], fingers: [2, 1, 0, 0, 0, 3], barres: [] },
  Amaj7: { frets: [-1, 0, 2, 1, 2, 0], fingers: [0, 0, 2, 1, 3, 0], barres: [] },
  Bmaj7: { frets: [-1, 2, 4, 3, 4, 2], fingers: [0, 1, 3, 2, 4, 1], barres: [{ fret: 2, from: 1, to: 5 }] },
  'F#maj7': { frets: [2, -1, 3, 3, 2, 1], fingers: [2, 0, 3, 4, 2, 1], barres: [] },
  'Gbmaj7': { frets: [2, -1, 3, 3, 2, 1], fingers: [2, 0, 3, 4, 2, 1], barres: [] },
  'C#maj7': { frets: [-1, 4, 3, 5, 4, 4], fingers: [0, 2, 1, 4, 3, 3], barres: [] },
  'Dbmaj7': { frets: [-1, 4, 3, 5, 4, 4], fingers: [0, 2, 1, 4, 3, 3], barres: [] },
  'D#maj7': { frets: [-1, 6, 5, 7, 6, 6], fingers: [0, 2, 1, 4, 3, 3], barres: [] },
  'Ebmaj7': { frets: [-1, 6, 5, 7, 6, 6], fingers: [0, 2, 1, 4, 3, 3], barres: [] },
  'G#maj7': { frets: [4, -1, 5, 5, 4, 3], fingers: [2, 0, 3, 4, 2, 1], barres: [] },
  'Abmaj7': { frets: [4, -1, 5, 5, 4, 3], fingers: [2, 0, 3, 4, 2, 1], barres: [] },
  'A#maj7': { frets: [-1, 1, 3, 2, 3, 1], fingers: [0, 1, 3, 2, 4, 1], barres: [{ fret: 1, from: 1, to: 5 }] },
  'Bbmaj7': { frets: [-1, 1, 3, 2, 3, 1], fingers: [0, 1, 3, 2, 4, 1], barres: [{ fret: 1, from: 1, to: 5 }] },

  // Minor 7th chords
  Cm7: { frets: [-1, 3, 5, 3, 4, 3], fingers: [0, 1, 3, 1, 2, 1], barres: [{ fret: 3, from: 1, to: 5 }] },
  Dm7: { frets: [-1, -1, 0, 2, 1, 1], fingers: [0, 0, 0, 2, 1, 1], barres: [] },
  Em7: { frets: [0, 2, 0, 0, 0, 0], fingers: [0, 1, 0, 0, 0, 0], barres: [] },
  Fm7: { frets: [1, 3, 1, 1, 1, 1], fingers: [1, 3, 1, 1, 1, 1], barres: [{ fret: 1, from: 0, to: 5 }] },
  Gm7: { frets: [3, 5, 3, 3, 3, 3], fingers: [1, 3, 1, 1, 1, 1], barres: [{ fret: 3, from: 0, to: 5 }] },
  Am7: { frets: [-1, 0, 2, 0, 1, 0], fingers: [0, 0, 2, 0, 1, 0], barres: [] },
  Bm7: { frets: [-1, 2, 4, 2, 3, 2], fingers: [0, 1, 3, 1, 2, 1], barres: [{ fret: 2, from: 1, to: 5 }] },
  'F#m7': { frets: [2, 4, 2, 2, 2, 2], fingers: [1, 3, 1, 1, 1, 1], barres: [{ fret: 2, from: 0, to: 5 }] },
  'Gbm7': { frets: [2, 4, 2, 2, 2, 2], fingers: [1, 3, 1, 1, 1, 1], barres: [{ fret: 2, from: 0, to: 5 }] },
  'C#m7': { frets: [-1, 4, 6, 4, 5, 4], fingers: [0, 1, 3, 1, 2, 1], barres: [{ fret: 4, from: 1, to: 5 }] },
  'Dbm7': { frets: [-1, 4, 6, 4, 5, 4], fingers: [0, 1, 3, 1, 2, 1], barres: [{ fret: 4, from: 1, to: 5 }] },
  'D#m7': { frets: [-1, 6, 8, 6, 7, 6], fingers: [0, 1, 3, 1, 2, 1], barres: [{ fret: 6, from: 1, to: 5 }] },
  'Ebm7': { frets: [-1, 6, 8, 6, 7, 6], fingers: [0, 1, 3, 1, 2, 1], barres: [{ fret: 6, from: 1, to: 5 }] },
  'G#m7': { frets: [4, 6, 4, 4, 4, 4], fingers: [1, 3, 1, 1, 1, 1], barres: [{ fret: 4, from: 0, to: 5 }] },
  'Abm7': { frets: [4, 6, 4, 4, 4, 4], fingers: [1, 3, 1, 1, 1, 1], barres: [{ fret: 4, from: 0, to: 5 }] },
  'A#m7': { frets: [-1, 1, 3, 1, 2, 1], fingers: [0, 1, 3, 1, 2, 1], barres: [{ fret: 1, from: 1, to: 5 }] },
  'Bbm7': { frets: [-1, 1, 3, 1, 2, 1], fingers: [0, 1, 3, 1, 2, 1], barres: [{ fret: 1, from: 1, to: 5 }] },

  // Dominant 7th chords
  C7: { frets: [-1, 3, 2, 3, 1, 0], fingers: [0, 3, 2, 4, 1, 0], barres: [] },
  D7: { frets: [-1, -1, 0, 2, 1, 2], fingers: [0, 0, 0, 2, 1, 3], barres: [] },
  E7: { frets: [0, 2, 0, 1, 0, 0], fingers: [0, 2, 0, 1, 0, 0], barres: [] },
  F7: { frets: [1, 3, 1, 2, 1, 1], fingers: [1, 3, 1, 2, 1, 1], barres: [{ fret: 1, from: 0, to: 5 }] },
  G7: { frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, 0, 0, 0, 1], barres: [] },
  A7: { frets: [-1, 0, 2, 0, 2, 0], fingers: [0, 0, 1, 0, 2, 0], barres: [] },
  B7: { frets: [-1, 2, 1, 2, 0, 2], fingers: [0, 2, 1, 3, 0, 4], barres: [] },
  'F#7': { frets: [2, 4, 2, 3, 2, 2], fingers: [1, 3, 1, 2, 1, 1], barres: [{ fret: 2, from: 0, to: 5 }] },
  'Gb7': { frets: [2, 4, 2, 3, 2, 2], fingers: [1, 3, 1, 2, 1, 1], barres: [{ fret: 2, from: 0, to: 5 }] },
  'C#7': { frets: [-1, 4, 3, 4, 2, 4], fingers: [0, 3, 2, 4, 1, 4], barres: [] },
  'Db7': { frets: [-1, 4, 3, 4, 2, 4], fingers: [0, 3, 2, 4, 1, 4], barres: [] },
  'D#7': { frets: [-1, 6, 5, 6, 4, 6], fingers: [0, 3, 2, 4, 1, 4], barres: [] },
  'Eb7': { frets: [-1, 6, 5, 6, 4, 6], fingers: [0, 3, 2, 4, 1, 4], barres: [] },
  'G#7': { frets: [4, 6, 4, 5, 4, 4], fingers: [1, 3, 1, 2, 1, 1], barres: [{ fret: 4, from: 0, to: 5 }] },
  'Ab7': { frets: [4, 6, 4, 5, 4, 4], fingers: [1, 3, 1, 2, 1, 1], barres: [{ fret: 4, from: 0, to: 5 }] },
  'A#7': { frets: [-1, 1, 3, 1, 3, 1], fingers: [0, 1, 2, 1, 3, 1], barres: [{ fret: 1, from: 1, to: 5 }] },
  'Bb7': { frets: [-1, 1, 3, 1, 3, 1], fingers: [0, 1, 2, 1, 3, 1], barres: [{ fret: 1, from: 1, to: 5 }] },

  // Half-diminished 7th chords (m7b5)
  'Cm7b5': { frets: [-1, 3, 4, 3, 4, -1], fingers: [0, 1, 2, 1, 3, 0], barres: [] },
  'Dm7b5': { frets: [-1, -1, 0, 1, 1, 1], fingers: [0, 0, 0, 1, 1, 1], barres: [] },
  'Em7b5': { frets: [0, 1, 0, 0, 3, 0], fingers: [0, 1, 0, 0, 3, 0], barres: [] },
  'Fm7b5': { frets: [1, 2, 1, 1, -1, -1], fingers: [1, 2, 1, 1, 0, 0], barres: [] },
  'Gm7b5': { frets: [3, 4, 3, 3, -1, -1], fingers: [1, 2, 1, 1, 0, 0], barres: [] },
  'Am7b5': { frets: [-1, 0, 1, 0, 1, 0], fingers: [0, 0, 1, 0, 2, 0], barres: [] },
  'Bm7b5': { frets: [-1, 2, 3, 2, 3, -1], fingers: [0, 1, 2, 1, 3, 0], barres: [] },
  'F#m7b5': { frets: [2, 3, 2, 2, -1, -1], fingers: [1, 2, 1, 1, 0, 0], barres: [] },
  'Gbm7b5': { frets: [2, 3, 2, 2, -1, -1], fingers: [1, 2, 1, 1, 0, 0], barres: [] },
  'C#m7b5': { frets: [-1, 4, 5, 4, 5, -1], fingers: [0, 1, 2, 1, 3, 0], barres: [] },
  'Dbm7b5': { frets: [-1, 4, 5, 4, 5, -1], fingers: [0, 1, 2, 1, 3, 0], barres: [] },
  'D#m7b5': { frets: [-1, 6, 7, 6, 7, -1], fingers: [0, 1, 2, 1, 3, 0], barres: [] },
  'Ebm7b5': { frets: [-1, 6, 7, 6, 7, -1], fingers: [0, 1, 2, 1, 3, 0], barres: [] },
  'G#m7b5': { frets: [4, 5, 4, 4, -1, -1], fingers: [1, 2, 1, 1, 0, 0], barres: [] },
  'Abm7b5': { frets: [4, 5, 4, 4, -1, -1], fingers: [1, 2, 1, 1, 0, 0], barres: [] },
  'A#m7b5': { frets: [-1, 1, 2, 1, 2, -1], fingers: [0, 1, 2, 1, 3, 0], barres: [] },
  'Bbm7b5': { frets: [-1, 1, 2, 1, 2, -1], fingers: [0, 1, 2, 1, 3, 0], barres: [] },
}

export default function ChordDiagram({ chord, size = 80 }) {
  const chordData = GUITAR_CHORDS[chord]

  if (!chordData) {
    return (
      <div className="chord-diagram-placeholder" style={{ width: size, height: size * 1.2 }}>
        <span className="chord-diagram-label">{chord}</span>
      </div>
    )
  }

  const { frets, barres } = chordData
  const minFret = Math.min(...frets.filter((f) => f > 0))
  const maxFret = Math.max(...frets.filter((f) => f > 0))
  const startFret = maxFret <= 4 ? 1 : minFret

  const stringSpacing = size / 7
  const fretSpacing = (size * 1.1) / 5
  const padding = 10
  const topPadding = 20

  const width = stringSpacing * 7
  const height = fretSpacing * 5 + topPadding + padding

  return (
    <div className="chord-diagram">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Nut or fret indicator */}
        {startFret === 1 ? (
          <rect
            x={padding}
            y={topPadding - 3}
            width={stringSpacing * 5}
            height={4}
            fill="currentColor"
          />
        ) : (
          <text
            x={padding - 8}
            y={topPadding + fretSpacing / 2 + 4}
            fontSize="10"
            fill="currentColor"
            textAnchor="middle"
          >
            {startFret}
          </text>
        )}

        {/* Fret lines */}
        {[0, 1, 2, 3, 4].map((fret) => (
          <line
            key={`fret-${fret}`}
            x1={padding}
            y1={topPadding + fret * fretSpacing}
            x2={padding + stringSpacing * 5}
            y2={topPadding + fret * fretSpacing}
            stroke="currentColor"
            strokeWidth={fret === 0 && startFret === 1 ? 0 : 1}
            strokeOpacity={0.3}
          />
        ))}

        {/* String lines */}
        {[0, 1, 2, 3, 4, 5].map((string) => (
          <line
            key={`string-${string}`}
            x1={padding + string * stringSpacing}
            y1={topPadding}
            x2={padding + string * stringSpacing}
            y2={topPadding + fretSpacing * 4}
            stroke="currentColor"
            strokeWidth={1}
            strokeOpacity={0.5}
          />
        ))}

        {/* Barres */}
        {barres.map((barre, i) => {
          const fretPos = barre.fret - startFret
          if (fretPos < 0 || fretPos >= 4) return null
          return (
            <rect
              key={`barre-${i}`}
              x={padding + barre.to * stringSpacing - 3}
              y={topPadding + fretPos * fretSpacing + fretSpacing / 2 - 5}
              width={(barre.from - barre.to) * stringSpacing + 6}
              height={10}
              rx={5}
              fill="currentColor"
            />
          )
        })}

        {/* Finger positions */}
        {frets.map((fret, string) => {
          const x = padding + (5 - string) * stringSpacing

          if (fret === -1) {
            // Muted string
            return (
              <text
                key={`mute-${string}`}
                x={x}
                y={topPadding - 8}
                fontSize="12"
                fill="currentColor"
                textAnchor="middle"
                opacity={0.7}
              >
                ×
              </text>
            )
          }

          if (fret === 0) {
            // Open string
            return (
              <circle
                key={`open-${string}`}
                cx={x}
                cy={topPadding - 8}
                r={4}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              />
            )
          }

          // Fretted note
          const fretPos = fret - startFret
          if (fretPos < 0 || fretPos >= 4) return null

          const y = topPadding + fretPos * fretSpacing + fretSpacing / 2

          // Check if this position is covered by a barre
          const isBarre = barres.some(
            (b) => b.fret === fret && string >= b.to && string <= b.from
          )
          if (isBarre && string !== barres[0]?.from) return null

          return (
            <circle key={`fret-${string}`} cx={x} cy={y} r={6} fill="currentColor" />
          )
        })}
      </svg>
    </div>
  )
}

export { GUITAR_CHORDS }
