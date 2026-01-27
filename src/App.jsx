import { useState } from 'react'
import ObjectWriting from './components/tools/ObjectWriting/ObjectWriting'
import RhymeFinder from './components/tools/RhymeFinder/RhymeFinder'
import ChordReference from './components/tools/ChordReference/ChordReference'
import SongStructure from './components/tools/SongStructure/SongStructure'
import './App.css'

const TOOLS = [
  { id: 'object-writing', name: 'Object Writing', icon: '✏️', disabled: false },
  { id: 'word-explorer', name: 'Word Explorer', icon: '🔍', disabled: false },
  { id: 'chords', name: 'Chord Progressions', icon: '🎸', disabled: false },
  { id: 'song-structure', name: 'Song Structure', icon: '🎵', disabled: false },
]

function ToolSelector({ onSelectTool }) {
  return (
    <div className="tool-selector">
      <h1>Pentatonic</h1>
      <p className="tagline">A songwriter's toolkit</p>
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
