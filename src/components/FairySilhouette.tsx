import React from 'react'
import './FairySilhouette.css'

interface FairySilhouetteProps {
  className?: string
  width?: number | string
  height?: number | string
  color?: string
  isFluttering?: boolean
  style?: React.CSSProperties
}

/**
 * Clean, elegant black fairy silhouette in graceful flight.
 * Features outstretched pose, pointed balletic feet, and fluttering wings.
 */
export default function FairySilhouette({
  className = '',
  width = 54,
  height = 54,
  color = '#000000',
  isFluttering = true,
  style = {},
}: FairySilhouetteProps) {
  return (
    <div
      className={`fairy-silhouette-root ${isFluttering ? 'fluttering' : ''} ${className}`}
      style={{
        width,
        height,
        ...style,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="fairy-svg"
      >
        {/* Back Wing Silhouette */}
        <g className="fairy-wing wing-back">
          <path
            d="M48 40 C56 22 72 12 86 16 C90 24 84 38 68 44 C58 48 50 43 48 40 Z"
            fill={color}
            opacity="0.75"
          />
          <path
            d="M50 44 C58 46 76 54 74 66 C66 68 56 58 50 44 Z"
            fill={color}
            opacity="0.6"
          />
        </g>

        {/* Front Wing Silhouette */}
        <g className="fairy-wing wing-front">
          <path
            d="M46 38 C54 16 74 4 90 10 C96 20 88 38 70 44 C56 48 48 41 46 38 Z"
            fill={color}
            opacity="0.95"
          />
          <path
            d="M48 45 C60 50 78 60 74 74 C64 76 52 62 48 45 Z"
            fill={color}
            opacity="0.8"
          />
        </g>

        {/* Fairy Body Silhouette */}
        <g className="fairy-body" fill={color}>
          {/* Head */}
          <circle cx="47" cy="27" r="4.2" />
          {/* Ballerina Hair Bun */}
          <circle cx="43" cy="25" r="3" />

          {/* Arched Torso & Waist */}
          <path d="M47 31 C48 36 47 42 45 46 C43 42 44 36 46 31 Z" />

          {/* Outstretched forward arm reaching gracefully with wand */}
          <path d="M47 34 C52 32 58 30 67 28 C67 29 61 33 49 36 Z" />

          {/* Wand rod extending from hand */}
          <line
            x1="66"
            y1="28"
            x2="73"
            y2="26"
            stroke={color}
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Trailing arm swept back alongside body */}
          <path d="M45 36 C41 40 35 42 31 44 C31 43 37 39 44 35 Z" />

          {/* Flowing fairy dress/wrap */}
          <path d="M45 45 C47 48 49 54 47 58 C43 56 41 51 43 45 Z" />

          {/* Extended legs with pointed balletic toes */}
          <path d="M46 48 C43 58 37 71 27 82 C26 82 27 80 33 70 C39 60 42 51 44 48 Z" />
          <path
            d="M44 50 C41 60 35 72 23 86 C22 86 23 84 31 73 C37 63 41 54 43 50 Z"
            opacity="0.85"
          />
        </g>
      </svg>
    </div>
  )
}

