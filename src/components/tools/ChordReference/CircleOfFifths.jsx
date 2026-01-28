import './CircleOfFifths.css'

const CIRCLE_OF_FIFTHS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F']

// Relative minors follow the same circle pattern, offset by 3 positions (A, E, B, F#, C#, G#, D#, Bb, F, C, G, D)
const RELATIVE_MINORS = ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m', 'Bbm', 'Fm', 'Cm', 'Gm', 'Dm']

// Get visible keys centered on current key (5 keys shown in arc)
function getVisibleKeys(currentKey, visibleCount = 5) {
  const currentIndex = CIRCLE_OF_FIFTHS.indexOf(currentKey.replace('Gb', 'F#').replace('C#', 'Db'))
  if (currentIndex === -1) return { major: [], minor: [] }

  const major = []
  const minor = []
  const halfCount = Math.floor(visibleCount / 2)

  for (let i = -halfCount; i <= halfCount; i++) {
    const index = (currentIndex + i + 12) % 12
    const key = CIRCLE_OF_FIFTHS[index]
    const relativeMinor = RELATIVE_MINORS[index]
    const relationship = getRelationship(i)

    major.push({
      key,
      position: i,
      relationship,
    })

    minor.push({
      key: relativeMinor,
      position: i,
      relationship,
    })
  }

  return { major, minor }
}

function getRelationship(position) {
  if (position === 0) return 'tonic'
  if (position === 1) return 'dominant'
  if (position === -1) return 'subdominant'
  if (position === 2) return 'dominant-of-dominant'
  if (position === -2) return 'subdominant-of-subdominant'
  return 'distant'
}

export default function CircleOfFifths({ currentKey, onKeySelect }) {
  const { major: majorKeys, minor: minorKeys } = getVisibleKeys(currentKey, 5)

  // SVG dimensions
  const width = 320
  const height = 120
  const centerX = width / 2
  const centerY = height + 60 // Arc center below viewport for curve
  const outerRadius = 170
  const middleRadius = 120 // Border between major and minor
  const innerRadius = 70
  const segmentAngle = 30 // degrees per segment

  // Calculate arc path for a segment (outer = major keys)
  const getOuterArcPath = (startAngle, endAngle) => {
    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180

    const x1 = centerX + outerRadius * Math.sin(startRad)
    const y1 = centerY - outerRadius * Math.cos(startRad)
    const x2 = centerX + outerRadius * Math.sin(endRad)
    const y2 = centerY - outerRadius * Math.cos(endRad)

    const x3 = centerX + middleRadius * Math.sin(endRad)
    const y3 = centerY - middleRadius * Math.cos(endRad)
    const x4 = centerX + middleRadius * Math.sin(startRad)
    const y4 = centerY - middleRadius * Math.cos(startRad)

    return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${middleRadius} ${middleRadius} 0 0 0 ${x4} ${y4} Z`
  }

  // Calculate arc path for inner segment (minor keys)
  const getInnerArcPath = (startAngle, endAngle) => {
    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180

    const x1 = centerX + middleRadius * Math.sin(startRad)
    const y1 = centerY - middleRadius * Math.cos(startRad)
    const x2 = centerX + middleRadius * Math.sin(endRad)
    const y2 = centerY - middleRadius * Math.cos(endRad)

    const x3 = centerX + innerRadius * Math.sin(endRad)
    const y3 = centerY - innerRadius * Math.cos(endRad)
    const x4 = centerX + innerRadius * Math.sin(startRad)
    const y4 = centerY - innerRadius * Math.cos(startRad)

    return `M ${x1} ${y1} A ${middleRadius} ${middleRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`
  }

  // Calculate label position for outer ring (major keys)
  const getOuterLabelPosition = (position) => {
    const angle = position * segmentAngle
    const angleRad = (angle * Math.PI) / 180
    const labelRadius = (outerRadius + middleRadius) / 2
    return {
      x: centerX + labelRadius * Math.sin(angleRad),
      y: centerY - labelRadius * Math.cos(angleRad),
    }
  }

  // Calculate label position for inner ring (minor keys)
  const getInnerLabelPosition = (position) => {
    const angle = position * segmentAngle
    const angleRad = (angle * Math.PI) / 180
    const labelRadius = (middleRadius + innerRadius) / 2
    return {
      x: centerX + labelRadius * Math.sin(angleRad),
      y: centerY - labelRadius * Math.cos(angleRad),
    }
  }

  // Get the relative minor of current key for legend
  const currentIndex = CIRCLE_OF_FIFTHS.indexOf(currentKey.replace('Gb', 'F#').replace('C#', 'Db'))
  const currentRelativeMinor = currentIndex !== -1 ? RELATIVE_MINORS[currentIndex] : ''

  return (
    <div className="circle-of-fifths">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="circle-svg"
        role="group"
        aria-label="Circle of fifths key selector"
      >
        {/* Outer ring - Major keys */}
        {majorKeys.map(({ key, position, relationship }) => {
          const startAngle = (position - 0.5) * segmentAngle
          const endAngle = (position + 0.5) * segmentAngle
          const labelPos = getOuterLabelPosition(position)
          const isCurrent = position === 0

          return (
            <g key={`major-${key}`} className="circle-segment">
              <path
                d={getOuterArcPath(startAngle, endAngle)}
                className={`segment-path ${relationship} ${isCurrent ? 'current' : ''}`}
                onClick={() => onKeySelect(key)}
                role="button"
                aria-label={`Select key ${key} major${isCurrent ? ' (current)' : ''}`}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onKeySelect(key)}
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                className={`segment-label major-label ${isCurrent ? 'current' : ''}`}
                textAnchor="middle"
                dominantBaseline="middle"
                onClick={() => onKeySelect(key)}
              >
                {key}
              </text>
            </g>
          )
        })}

        {/* Inner ring - Minor keys */}
        {minorKeys.map(({ key, position, relationship }) => {
          const startAngle = (position - 0.5) * segmentAngle
          const endAngle = (position + 0.5) * segmentAngle
          const labelPos = getInnerLabelPosition(position)
          const isCurrent = position === 0

          return (
            <g key={`minor-${key}`} className="circle-segment minor">
              <path
                d={getInnerArcPath(startAngle, endAngle)}
                className={`segment-path minor-path ${relationship} ${isCurrent ? 'current' : ''}`}
                role="button"
                aria-label={`${key} - relative minor of ${majorKeys[position + 2]?.key || ''}`}
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                className={`segment-label minor-label ${isCurrent ? 'current' : ''}`}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {key}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="circle-legend">
        <span className="legend-item subdominant">
          <span className="legend-dot"></span>
          IV
        </span>
        <span className="legend-item tonic current-key">
          {currentKey}
          <span className="relative-minor">{currentRelativeMinor}</span>
        </span>
        <span className="legend-item dominant">
          V
          <span className="legend-dot"></span>
        </span>
      </div>
      <p className="circle-hint">Tap to select key</p>
    </div>
  )
}
