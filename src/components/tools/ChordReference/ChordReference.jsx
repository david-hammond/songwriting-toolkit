import { useState } from 'react'
import { useChordProgression } from '../../../hooks/useChordProgression'
import { playProgression } from '../../../utils/audio'
import ChordDiagram from '../../ChordDiagram'
import CircleOfFifths from './CircleOfFifths'
import './ChordReference.css'

export default function ChordReference({ onBack }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showDiagrams, setShowDiagrams] = useState(false)
  const [selectedChord, setSelectedChord] = useState(null)

  const {
    key,
    setKey,
    progression,
    chordsWithFunction,
    relatedKeys,
    suggestedNext,
    filteredProgressions,
    genres,
    genreFilter,
    setGenreFilter,
    detectedProgression,
    use7ths,
    setUse7ths,
    addChord,
    removeLastChord,
    clearProgression,
    applyCommonProgression,
  } = useChordProgression()

  const handlePlay = () => {
    if (progression.length === 0 || isPlaying) return
    setIsPlaying(true)
    const duration = playProgression(progression)
    setTimeout(() => setIsPlaying(false), duration)
  }

  const handleClear = () => {
    clearProgression()
    setSelectedChord(null)
  }

  const handleApplyProgression = (numerals) => {
    applyCommonProgression(numerals)
    setSelectedChord(null)
  }

  return (
    <div className="chord-reference">
      <button onClick={onBack} className="btn-back" aria-label="Back to home">
        &larr;
      </button>

      <div className="content">
        <h1>Circle of Fifths</h1>

        {/* Circle of Fifths Visualization */}
        <div className="section">
          <CircleOfFifths
            currentKey={key}
            onKeySelect={setKey}
          />
        </div>

        {/* Options */}
        <div className="section">
          <div className="options-row">
            <label className="toggle-option">
              <input
                type="checkbox"
                checked={use7ths}
                onChange={(e) => setUse7ths(e.target.checked)}
              />
              <span className="toggle-label">7th Chords</span>
            </label>
            <label className="toggle-option">
              <input
                type="checkbox"
                checked={showDiagrams}
                onChange={(e) => setShowDiagrams(e.target.checked)}
              />
              <span className="toggle-label">Guitar Diagrams</span>
            </label>
          </div>
        </div>

        {/* Current Progression */}
        <div className="section">
          <h2>Your Progression</h2>
          <div className="progression-display">
            {progression.length > 0 ? (
              <>
                <div className="progression-chords">
                  {progression.map((chord, i) => (
                    <button
                      key={i}
                      className={`progression-chord-btn ${selectedChord === chord ? 'selected' : ''}`}
                      onClick={() => setSelectedChord(selectedChord === chord ? null : chord)}
                    >
                      {chord}
                    </button>
                  ))}
                </div>
                {selectedChord && (
                  <div className="selected-chord-diagram">
                    <ChordDiagram chord={selectedChord} size={100} />
                  </div>
                )}
                {/* Inline Theory Tip - shown when progression matches a known pattern */}
                {detectedProgression && (
                  <div className="theory-tip">
                    <div className="theory-tip-header">
                      <span className="theory-tip-name">{detectedProgression.name}</span>
                      <span className="theory-tip-numerals">
                        {detectedProgression.numerals.join(' - ')}
                      </span>
                    </div>
                    <p className="theory-tip-description">{detectedProgression.theory}</p>
                    {detectedProgression.songs && detectedProgression.songs.length > 0 && (
                      <p className="theory-tip-songs">
                        Like "{detectedProgression.songs[0].title}" by {detectedProgression.songs[0].artist}
                        {detectedProgression.songs.length > 1 && (
                          <>, "{detectedProgression.songs[1].title}"</>
                        )}
                      </p>
                    )}
                  </div>
                )}
                <div className="progression-actions">
                  <button
                    onClick={handlePlay}
                    disabled={isPlaying}
                    className="btn btn-accent btn-small"
                  >
                    {isPlaying ? '▶ ...' : '▶ Play'}
                  </button>
                  <button onClick={removeLastChord} className="btn btn-secondary btn-small">
                    Undo
                  </button>
                  <button onClick={handleClear} className="btn btn-secondary btn-small">
                    Clear
                  </button>
                </div>
              </>
            ) : (
              <p className="empty-progression">Tap chords below to build a progression</p>
            )}
          </div>
        </div>

        {/* Suggested Next Chords */}
        <div className="section">
          <h2>Suggested Next</h2>
          <div className="chord-grid">
            {suggestedNext.map((chord) => (
              <button key={chord} onClick={() => addChord(chord)} className="chord-btn suggested">
                {chord}
              </button>
            ))}
          </div>
        </div>

        {/* Chords in Key */}
        <div className="section">
          <h2>Chords in {key} Major</h2>
          <div className={`chords-in-key ${showDiagrams ? 'with-diagrams' : ''}`}>
            {chordsWithFunction.map((c) => (
              <button
                key={c.degree}
                onClick={() => addChord(c.chord)}
                className={`chord-btn ${showDiagrams ? 'with-diagram' : ''} function-${c.function}`}
              >
                <span className="chord-name">{c.chord}</span>
                <span className="chord-degree">{c.degree}</span>
                {showDiagrams && <ChordDiagram chord={c.chord} size={60} />}
              </button>
            ))}
          </div>
          <div className="function-legend">
            <span className="function-legend-item tonic">Tonic</span>
            <span className="function-legend-item subdominant">Subdominant</span>
            <span className="function-legend-item dominant">Dominant</span>
          </div>
        </div>

        {/* Common Progressions */}
        <div className="section">
          <h2>Common Progressions</h2>

          {/* Genre Filter */}
          <div className="genre-filters">
            <button
              onClick={() => setGenreFilter(null)}
              className={`genre-chip ${genreFilter === null ? 'active' : ''}`}
            >
              All
            </button>
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => setGenreFilter(genre.id)}
                className={`genre-chip ${genreFilter === genre.id ? 'active' : ''}`}
              >
                {genre.label}
              </button>
            ))}
          </div>

          <div className="common-progressions">
            {filteredProgressions.map((prog) => (
              <div key={prog.name} className="progression-card">
                <div className="progression-card-header">
                  <span className="prog-name">{prog.name}</span>
                  <span className="prog-numerals">{prog.numerals.join(' - ')}</span>
                </div>
                <div className="progression-card-meta">
                  {prog.genre && (
                    <span className="prog-genres">
                      {prog.genre.map((g) => g.charAt(0).toUpperCase() + g.slice(1)).join(', ')}
                    </span>
                  )}
                  {prog.mood && (
                    <span className="prog-mood">{prog.mood}</span>
                  )}
                </div>
                {prog.songs && prog.songs.length > 0 && (
                  <div className="prog-songs">
                    {prog.songs.slice(0, 2).map((song, i) => (
                      <span key={i} className="prog-song">
                        "{song.title}" - {song.artist}
                      </span>
                    ))}
                  </div>
                )}
                <div className="progression-card-actions">
                  <button
                    onClick={() => handleApplyProgression(prog.numerals)}
                    className="btn btn-small btn-accent"
                  >
                    Apply to {key}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Keys */}
        <div className="section">
          <h2>Related Keys</h2>
          <div className="related-keys">
            <button onClick={() => setKey(relatedKeys.dominant)} className="related-key-btn">
              <span className="relation">Dominant (V)</span>
              <span className="key-name">{relatedKeys.dominant}</span>
            </button>
            <button onClick={() => setKey(relatedKeys.subdominant)} className="related-key-btn">
              <span className="relation">Subdominant (IV)</span>
              <span className="key-name">{relatedKeys.subdominant}</span>
            </button>
            <div className="related-key-info">
              <span className="relation">Relative Minor</span>
              <span className="key-name">{relatedKeys.relativeMinor}</span>
            </div>
            <div className="related-key-info">
              <span className="relation">Parallel Minor</span>
              <span className="key-name">{relatedKeys.parallelMinor}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
