import { useState } from 'react'
import ObjectWriting from './components/tools/ObjectWriting/ObjectWriting'
import RhymeFinder from './components/tools/RhymeFinder/RhymeFinder'
import ChordReference from './components/tools/ChordReference/ChordReference'
import SongStructure from './components/tools/SongStructure/SongStructure'
import './App.css'

const TOOLS = [
  { id: 'object-writing', name: 'Object Writing', icon: '✏️', disabled: false },
  { id: 'word-explorer', name: 'Rhyme Finder', icon: '📖', disabled: false },
  { id: 'chords', name: 'Chords', icon: '🎸', disabled: false },
  { id: 'song-structure', name: 'Structures', icon: '🎵', disabled: false },
]

// Check if app is installed as PWA (standalone mode)
const isInstalled = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true // iOS Safari
}

// Check if on mobile device
const isMobile = () => {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

// Get install instructions based on platform
const getInstallInstructions = () => {
  const ua = navigator.userAgent
  if (/iPhone|iPad|iPod/i.test(ua)) {
    return 'tap Share ⬆ then "Add to Home Screen"'
  }
  // Android / other
  return 'tap ⋮ menu then "Add to Home Screen"'
}

function ToolSelector({ onSelectTool }) {
  const showInstallHint = isMobile() && !isInstalled()

  return (
    <div className="tool-selector">
      <h1>Songwriting Toolkit</h1>
      <p className="tagline">Notebook ready. Instrument tuned. Let's write.</p>
      <div className="tool-grid">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => !tool.disabled && onSelectTool(tool.id)}
            className={`tool-card ${tool.disabled ? 'disabled' : ''}`}
            disabled={tool.disabled}
          >
            <span className="tool-icon">{tool.icon}</span>
            <span className="tool-name">{tool.name}</span>
            {tool.disabled && <span className="coming-soon">Coming Soon</span>}
          </button>
        ))}
      </div>
      <footer className="app-footer">
        <span>Made by David Hammond</span>
        <div className="footer-links">
          <a
            href="https://github.com/david-hammond/songwriting-toolkit"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source Code
          </a>
          <span className="separator">·</span>
          <a
            href="https://github.com/david-hammond/songwriting-toolkit/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            Feedback & Issues
          </a>
        </div>
{showInstallHint && (
          <p className="install-hint">
            <span className="install-icon">📲</span>
            Install: {getInstallInstructions()}
          </p>
        )}
      </footer>
    </div>
  )
}

function App() {
  const [currentTool, setCurrentTool] = useState('home')

  const handleBack = () => setCurrentTool('home')

  return (
    <div className="app">
      {currentTool === 'home' && <ToolSelector onSelectTool={setCurrentTool} />}
      {currentTool === 'object-writing' && <ObjectWriting onBack={handleBack} />}
      {currentTool === 'word-explorer' && <RhymeFinder onBack={handleBack} />}
      {currentTool === 'chords' && <ChordReference onBack={handleBack} />}
      {currentTool === 'song-structure' && <SongStructure onBack={handleBack} />}
    </div>
  )
}

export default App
