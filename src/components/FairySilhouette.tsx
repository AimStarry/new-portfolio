import React from 'react'
import './FairySilhouette.css'

interface FairySilhouetteProps {
  className?: string
  width?: number | string
  height?: number | string
  silhouetteColor?: string
  glowColor?: string
  isFluttering?: boolean
  style?: React.CSSProperties
}

/**
 * Reusable Fairy Silhouette component.
 * Features an elegant dark silhouette of a fairy in graceful flight,
 * enveloped in a radiant, multi-layered sphere of golden & emerald light.
 * Designed for both cinematic intro sequences and custom cursor effects.
 */
export default function FairySilhouette({
  className = '',
  width = 68,
  height = 68,
  silhouetteColor = '#030712',
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
          {/* Luminous Outer Halo of emerald & amber light */}
          <radialGradient id="fairyOuterHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#34D399" stopOpacity="0.65" />
            <stop offset="45%" stopColor={glowColor} stopOpacity="0.35" />
            <stop offset="75%" stopColor="#059669" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0" />
          </radialGradient>

          {/* Radiant Core Light Orb surrounding the silhouette */}
          <radialGradient id="fairyCoreLight" cx="48%" cy="44%" r="48%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="25%" stopColor="#FEF08A" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#F59E0B" stopOpacity="0.6" />
            <stop offset="80%" stopColor="#10B981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </radialGradient>

          {/* Delicate rim light for wings */}
          <linearGradient id="fairyWingRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#FDE047" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#34D399" stopOpacity="0.2" />
          </linearGradient>

          {/* Soft blur for ambient light halo */}
          <filter id="softGlowBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ── 1. LIGHT SURROUNDING THE FAIRY AS IT FLIES ── */}
        {/* Outer ambient glow expansion */}
        <circle
          cx="50"
          cy="48"
          r="46"
          fill="url(#fairyOuterHalo)"
          className="fairy-outer-halo"
        />

        {/* Core luminous orb of light */}
        <circle
          cx="49"
          cy="45"
          r="30"
          fill="url(#fairyCoreLight)"
          className="fairy-light-orb"
        />

        {/* Soft celestial core highlight behind the fairy */}
        <circle
          cx="48"
          cy="43"
          r="16"
          fill="#FFFBEB"
          opacity="0.85"
          filter="url(#softGlowBlur)"
          className="fairy-light-core"
        />

        {/* Subtle cross starlight glint radiating from the surrounding light */}
        <g className="fairy-light-glint">
          <ellipse cx="48" cy="43" rx="24" ry="2" fill="#FFFFFF" opacity="0.45" />
          <ellipse cx="48" cy="43" rx="2" ry="24" fill="#FFFFFF" opacity="0.45" />
        </g>

        {/* ── 2. ELEGANT DARK SILHOUETTE ── */}
        <g className="fairy-silhouette-figure">
          {/* Back Wing Silhouette */}
          <g className="fairy-wing wing-back">
            <path
              d="M48 40 C55 24 70 14 84 18 C88 26 82 40 66 46 C57 49 50 44 48 40 Z"
              fill={silhouetteColor}
              opacity="0.78"
            />
            {/* Luminous rim highlight on wing leading edge */}
            <path
              d="M49 39 C56 25 70 15 84 19"
              stroke="url(#fairyWingRim)"
              strokeWidth="0.8"
              fill="none"
              opacity="0.7"
            />
            <path
              d="M50 44 C58 46 75 54 73 66 C65 68 55 58 50 44 Z"
              fill={silhouetteColor}
              opacity="0.65"
            />
          </g>

          {/* Front Wing Silhouette */}
          <g className="fairy-wing wing-front">
            <path
              d="M46 38 C54 18 72 6 88 12 C95 22 86 40 68 46 C55 50 48 42 46 38 Z"
              fill={silhouetteColor}
              opacity="0.92"
            />
            {/* Subtle luminous edge rim highlight */}
            <path
              d="M47 37 C55 19 72 7 88 13"
              stroke="url(#fairyWingRim)"
              strokeWidth="1.1"
              fill="none"
              opacity="0.9"
            />
            {/* Lower secondary wing silhouette */}
            <path
              d="M48 45 C60 50 78 60 74 74 C64 76 52 62 48 45 Z"
              fill={silhouetteColor}
              opacity="0.8"
            />
          </g>

          {/* Balletic Fairy Body Silhouette */}
          <g className="fairy-body-silhouette" fill={silhouetteColor}>
            {/* Head silhouette */}
            <circle cx="47" cy="28" r="4.3" />
            {/* Delicate hair bun silhouette */}
            <circle cx="43.5" cy="26" r="3.2" />

            {/* Arching, slender torso & waist */}
            <path d="M47 32 C48 37 47 43 45 47 C43 43 44 37 46 32 Z" />

            {/* Forward outstretched arm reaching forward */}
            <path d="M47 35 C52 33 58 31 66 29 C66 30 60 34 49 37 Z" />

            {/* Trailing arm alongside body */}
            <path d="M45 37 C41 41 35 43 31 45 C31 44 37 40 44 36 Z" />

            {/* Flowing skirt/wrap contour */}
            <path d="M45 46 C47 49 49 55 47 59 C43 57 41 52 43 46 Z" />

            {/* Extended legs in arched flight with pointed toes */}
            <path d="M46 49 C43 59 37 72 27 83 C26 83 27 81 33 71 C39 61 42 52 44 49 Z" />
            <path d="M44 51 C41 61 35 73 23 87 C22 87 23 85 31 74 C37 64 41 55 43 51 Z" opacity="0.85" />
          </g>

          {/* Wand Tip: Pinpoint starburst sparkle */}
          <g className="wand-sparkle-tip">
            <circle cx="67" cy="28" r="1.8" fill="#FFFFFF" />
            <path
              d="M67 22 L67 34 M61 28 L73 28"
              stroke="#FFFBEB"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </g>
        </g>
      </svg>
    </div>
  )
}

