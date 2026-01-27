import { useState } from 'react'
import { useWordExplorer } from '../../../hooks/useWordExplorer'
import './RhymeFinder.css'

export default function RhymeFinder({ onBack }) {
  const [input, setInput] = useState('')
  const { word, mode, setMode, results, loading, error, search, clear, modes } = useWordExplorer()

  const handleSubmit = (e) => {
    e.preventDefault()
    search(input, mode)
  }

  const handleModeChange = (newMode) => {
    setMode(newMode)
    if (input.trim()) {
      search(input, newMode)
    }
  }

  const handleClear = () => {
    setInput('')
    clear()
  }

  const hasResults = results?.sections?.some((s) => s.words.length > 0)

  return (
    <div className="rhyme-finder">
      <button onClick={onBack} className="btn-back" aria-label="Back to home">
        &larr;
      </button>

      <div className="content">
        <h1>Word Explorer</h1>

        {/* Mode Selector */}
        <div className="mode-selector">
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={() => handleModeChange(m.key)}
              className={`mode-btn ${mode === m.key ? 'selected' : ''}`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a word..."
            className="search-input"
            autoFocus
            autoComplete="off"
            autoCapitalize="off"
          />
          <div className="search-buttons">
            <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()}>
              {loading ? 'Searching...' : 'Search'}
            </button>
            {(input || results) && (
              <button type="button" onClick={handleClear} className="btn btn-secondary">
                Clear
              </button>
            )}
          </div>
        </form>

        {error && <p className="error-message">{error}</p>}

        {results && (
          <div className="results">
            {results.sections.map(
              (section) =>
                section.words.length > 0 && (
                  <div key={section.title} className="result-section">
                    <h2>{section.title}</h2>
                    <div className="word-list">
                      {section.words.map((w) => (
                        <span key={w} className={`word-chip ${section.color}`}>
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                )
            )}

            {!hasResults && <p className="no-results">No results found for "{word}"</p>}
          </div>
        )}
      </div>
    </div>
  )
}
