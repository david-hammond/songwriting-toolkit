import { useState } from 'react'
import './SongStructure.css'

const STRUCTURES = [
  {
    name: 'Verse-Chorus',
    description: 'Most common pop/rock structure',
    sections: ['Intro', 'Verse 1', 'Chorus', 'Verse 2', 'Chorus', 'Bridge', 'Chorus', 'Outro'],
    examples: ['Most pop songs', 'Rock anthems'],
  },
  {
    name: 'Verse-Chorus-Verse',
    description: 'Simple and effective',
    sections: ['Verse 1', 'Chorus', 'Verse 2', 'Chorus', 'Verse 3', 'Chorus'],
    examples: ['Folk songs', 'Country ballads'],
  },
  {
    name: 'AABA',
    description: 'Classic 32-bar form',
    sections: ['A (Verse)', 'A (Verse)', 'B (Bridge)', 'A (Verse)'],
    examples: ['Jazz standards', '"Yesterday" by Beatles'],
  },
  {
    name: 'ABABCB',
    description: 'Verse-Chorus with bridge',
    sections: ['Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Chorus'],
    examples: ['Pop ballads', 'Modern rock'],
  },
  {
    name: '12-Bar Blues',
    description: 'Classic blues progression',
    sections: ['I-I-I-I', 'IV-IV-I-I', 'V-IV-I-V'],
    examples: ['Blues standards', 'Early rock & roll'],
  },
  {
    name: 'Through-Composed',
    description: 'No repeating sections',
    sections: ['A', 'B', 'C', 'D', '...'],
    examples: ['Art songs', 'Bohemian Rhapsody'],
  },
  {
    name: 'Verse-Pre-Chorus-Chorus',
    description: 'Builds anticipation',
    sections: ['Verse', 'Pre-Chorus', 'Chorus', 'Verse', 'Pre-Chorus', 'Chorus', 'Bridge', 'Chorus'],
    examples: ['Modern pop', 'EDM drops'],
  },
  {
    name: 'AAA (Strophic)',
    description: 'Same melody, different lyrics',
    sections: ['Verse 1', 'Verse 2', 'Verse 3', 'Verse 4'],
    examples: ['Folk ballads', '"Blowin\' in the Wind"'],
  },
]

const SECTION_INFO = {
  Intro: { bars: '4-8', purpose: 'Set the mood, hook the listener' },
  Verse: { bars: '8-16', purpose: 'Tell the story, build narrative' },
  'Verse 1': { bars: '8-16', purpose: 'Introduce the story/theme' },
  'Verse 2': { bars: '8-16', purpose: 'Develop the story/theme' },
  'Verse 3': { bars: '8-16', purpose: 'Conclude or twist the story' },
  'Pre-Chorus': { bars: '4-8', purpose: 'Build tension before chorus' },
  Chorus: { bars: '8-16', purpose: 'Main hook, emotional peak' },
  Bridge: { bars: '8', purpose: 'Contrast, new perspective' },
  Outro: { bars: '4-8', purpose: 'Resolve, fade out' },
  'A (Verse)': { bars: '8', purpose: 'Main melodic theme' },
  'B (Bridge)': { bars: '8', purpose: 'Contrasting middle section' },
}

export default function SongStructure({ onBack }) {
  const [selectedStructure, setSelectedStructure] = useState(null)

  return (
    <div className="song-structure">
      <button onClick={onBack} className="btn-back" aria-label="Back to home">
        &larr;
      </button>

      <div className="content">
        <h1>Song Structure</h1>

        {!selectedStructure ? (
          <>
            <p className="intro-text">Choose a structure to explore</p>
            <div className="structure-grid">
              {STRUCTURES.map((structure) => (
                <button
                  key={structure.name}
                  onClick={() => setSelectedStructure(structure)}
                  className="structure-card"
                >
                  <span className="structure-name">{structure.name}</span>
                  <span className="structure-desc">{structure.description}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="structure-detail">
            <button onClick={() => setSelectedStructure(null)} className="btn btn-secondary back-btn">
              &larr; All Structures
            </button>

            <h2>{selectedStructure.name}</h2>
            <p className="detail-desc">{selectedStructure.description}</p>

            <div className="sections-flow">
              {selectedStructure.sections.map((section, i) => (
                <div key={i} className="section-item">
                  <span className="section-name">{section}</span>
                  {SECTION_INFO[section] && (
                    <span className="section-bars">{SECTION_INFO[section].bars} bars</span>
                  )}
                </div>
              ))}
            </div>

            <div className="section-details">
              <h3>Section Guide</h3>
              {[...new Set(selectedStructure.sections)].map((section) => {
                const info = SECTION_INFO[section]
                if (!info) return null
                return (
                  <div key={section} className="section-info">
                    <span className="info-name">{section}</span>
                    <span className="info-purpose">{info.purpose}</span>
                  </div>
                )
              })}
            </div>

            {selectedStructure.examples && (
              <div className="examples">
                <h3>Examples</h3>
                <ul>
                  {selectedStructure.examples.map((ex, i) => (
                    <li key={i}>{ex}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
