import './CircleOfFifths.css'

const CIRCLE_OF_FIFTHS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F']

// Get visible keys centered on current key (6 keys shown in arc)
function getVisibleKeys(currentKey, visibleCount = 5) {
  const currentIndex = CIRCLE_OF_FIFTHS.indexOf(currentKey.replace('Gb', 'F#').replace('C#', 'Db'))
  if (currentIndex === -1) return CIRCLE_OF_FIFTHS.slice(0, visibleCount)

  const keys = []
  const halfCount = Math.floor(visibleCount / 2)

  for (let i = -halfCount; i <= halfCount; i++) {
    const index = (currentIndex + i + 12) % 12
    const key = CIRCLE_OF_FIFTHS[index]
    keys.push({
      key,
      position: i, // -2, -1, 0, 1, 2 (0 = center)
      relationship: getRelationship(i),
    })
  }

  return keys
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
  const visibleKeys = getVisibleKeys(currentKey, 5)

  // SVG dimensions
  const width = 320
  const height = 100
  const centerX = width / 2
  const centerY = height + 40 // Arc center below viewport for curve
  const radius = 140
  const segmentAngle = 30 // degrees per segment

  // Calculate arc path for a segment
  const getArcPath = (startAngle, endAngle) => {
    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180

    const x1 = centerX + radius * Math.sin(startRad)
    const y1 = centerY - radius * Math.cos(startRad)
    const x2 = centerX + radius * Math.sin(endRad)
    const y2 = centerY - radius * Math.cos(endRad)

    const innerRadius = radius - 50
    const x3 = centerX + innerRadius * Math.sin(endRad)
    const y3 = centerY - innerRadius * Math.cos(endRad)
    const x4 = centerX + innerRadius * Math.sin(startRad)
    const y4 = centerY - innerRadius * Math.cos(startRad)

    return `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`
  }

  // Calculate label position
  const getLabelPosition = (position) => {
    const angle = position * segmentAngle
    const angleRad = (angle * Math.PI) / 180
    const labelRadius = radius - 25
    return {
      x: centerX + labelRadius * Math.sin(angleRad),
      y: centerY - labelRadius * Math.cos(angleRad),
    }
  }

  return (
    <div className="circle-of-fifths">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="circle-svg"
        role="group"
        aria-label="Circle of fifths key selector"
      >
        {visibleKeys.map(({ key, position, relationship }) => {
          const startAngle = (position - 0.5) * segmentAngle
          const endAngle = (position + 0.5) * segmentAngle
          const labelPos = getLabelPosition(position)
          const isCurrent = position === 0

          return (
            <g key={key} className="circle-segment">
              <path
                d={getArcPath(startAngle, endAngle)}
                className={`segment-path ${relationship} ${isCurrent ? 'current' : ''}`}
                onClick={() => onKeySelect(key)}
                role="button"
                aria-label={`Select key ${key}${isCurrent ? ' (current)' : ''}`}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onKeySelect(key)}
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                className={`segment-label ${isCurrent ? 'current' : ''}`}
                textAnchor="middle"
                dominantBaseline="middle"
                onClick={() => onKeySelect(key)}
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
        <span className="legend-item tonic current-key">{currentKey}</span>
        <span className="legend-item dominant">
          V
          <span className="legend-dot"></span>
        </span>
      </div>
    </div>
  )
}
