import { useState } from 'react'
import { useRhymeFinder } from '../../../hooks/useRhymeFinder'
import './RhymeFinder.css'

export default function RhymeFinder({ onBack }) {
  const [input, setInput] = useState('')
  const { word, results, loading, error, searchRhymes, clear } = useRhymeFinder()

  const handleSubmit = (e) => {
    e.preventDefault()
    searchRhymes(input)
  }

  const handleClear = () => {
    setInput('')
    clear()
  }

  return (
    <div className="rhyme-finder">
      <button onClick={onBack} className="btn-back" aria-label="Back to home">
        &larr;
      </button>

      <div className="content">
        <h1>Rhyme Finder</h1>

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
              {loading ? 'Searching...' : 'Find Rhymes'}
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
            {results.perfect.length > 0 && (
              <div className="result-section">
                <h2>Perfect Rhymes</h2>
                <div className="word-list">
                  {results.perfect.map((w) => (
                    <span key={w} className="word-chip">
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {results.near.length > 0 && (
              <div className="result-section">
                <h2>Near Rhymes</h2>
                <div className="word-list">
                  {results.near.map((w) => (
                    <span key={w} className="word-chip near">
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {results.perfect.length === 0 && results.near.length === 0 && (
              <p className="no-results">No rhymes found for "{word}"</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
