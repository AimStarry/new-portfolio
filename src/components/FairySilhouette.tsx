import React from 'react'
import './FairySilhouette.css'

interface FairySilhouetteProps {
  className?: string
  width?: number | string
  height?: number | string
  color?: string
  glowColor?: string
  isFluttering?: boolean
  style?: React.CSSProperties
}

/**
 * Reusable Fairy Silhouette component.
 * Features an elegant, balletic fairy in flight with translucent gossamer wings
 * that flutter with organic wing-beat micro-animations.
 * Designed for both the cinematic intro sequence and future custom cursor effects.
 */
export default function FairySilhouette({
  className = '',
  width = 48,
  height = 48,
  color = '#FFFFFF',
  glowColor = '#34D399',
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
        <defs>
          <radialGradient id="fairyGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={glowColor} stopOpacity="0.8" />
            <stop offset="60%" stopColor={glowColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#A7F3D0" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FDE047" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Ethereal aura glow around the fairy */}
        <circle cx="52" cy="46" r="32" fill="url(#fairyGlow)" className="fairy-aura-pulse" />

        {/* Back Wing (Translucent gossamer) */}
        <g className="fairy-wing wing-back">
          <path
            d="M50 42 C56 26 70 16 84 20 C88 28 82 42 66 48 C58 51 52 46 50 42 Z"
            fill="url(#wingGrad)"
            opacity="0.55"
          />
          <path
            d="M52 46 C60 48 76 56 74 68 C66 70 56 60 52 46 Z"
            fill="url(#wingGrad)"
            opacity="0.4"
          />
        </g>

        {/* Front Wing (Fluttering with delicate filigree) */}
        <g className="fairy-wing wing-front">
          <path
            d="M48 40 C55 20 72 8 88 14 C94 24 86 42 68 48 C56 52 50 44 48 40 Z"
            fill="url(#wingGrad)"
            opacity="0.85"
          />
          {/* Subtle wing vein filigree */}
          <path
            d="M50 40 Q68 28 84 18 M56 38 Q74 34 82 28 M52 42 Q66 44 76 42"
            stroke="#FFFFFF"
            strokeWidth="0.75"
            strokeOpacity="0.6"
            fill="none"
          />
          {/* Lower secondary wing */}
          <path
            d="M50 47 C62 52 80 62 76 76 C66 78 54 64 50 47 Z"
            fill="url(#wingGrad)"
            opacity="0.65"
          />
        </g>

        {/* Elegant Fairy Body Silhouette in arched flight */}
        <g className="fairy-body" fill={color}>
          {/* Head & delicate bun */}
          <circle cx="48" cy="30" r="4.2" />
          {/* Hair silhouette with gentle bun */}
          <path d="M44 30 C43 27 45 24 48 24 C51 24 53 26 52 29 C50 28 46 28 44 30 Z" />

          {/* Arched slender torso & waist */}
          <path d="M48 34 C49 38 48 44 46 48 C44 44 45 38 47 34 Z" />

          {/* Outstretched forward arm reaching gracefully */}
          <path
            d="M48 36 C52 34 58 32 66 30 C66 31 60 35 50 38 Z"
          />

          {/* Trailing arm alongside body */}
          <path
            d="M46 38 C42 42 36 44 32 46 C32 45 38 41 45 37 Z"
          />

          {/* Flowing skirt/tunic whisper */}
          <path
            d="M46 47 C48 50 50 56 48 60 C44 58 42 53 44 47 Z"
            opacity="0.9"
          />

          {/* Delicate, extended legs with pointed balletic toes */}
          <path
            d="M47 50 C44 60 38 72 28 84 C27 84 28 82 34 72 C40 62 43 53 45 50 Z"
          />
          <path
            d="M45 52 C42 62 36 74 24 88 C23 88 24 86 32 75 C38 65 42 56 44 52 Z"
            opacity="0.8"
          />
        </g>

        {/* Magical Wand / Fingertip Star Sparkle Point */}
        <g className="wand-sparkle-tip">
          <circle cx="67" cy="29" r="2" fill="#FFFFFF" />
          <path
            d="M67 24 L67 34 M62 29 L72 29"
            stroke="#FDE047"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  )
}
