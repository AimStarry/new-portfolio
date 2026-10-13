import { useEffect, useRef, useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import FairySilhouette from './FairySilhouette'
import './MagicalIntro.css'

interface MagicalIntroProps {
  onComplete?: () => void
  forcePlay?: boolean
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  decay: number
  color: string
  isSparkle: boolean
  rotation: number
  rotationSpeed: number
  twinkleSpeed: number
  twinklePhase: number
}

// Enchanting Disney-Fairies color palette: Gold, Warm Amber, Emerald, Mint & Pure Starfire
const PIXIE_COLORS = [
  '#FDE047', // Pale Gold
  '#FBBF24', // Rich Amber
  '#F59E0B', // Deep Amber
  '#34D399', // Bright Emerald
  '#10B981', // Deep Emerald
  '#A7F3D0', // Mint Whisper
  '#FFFFFF', // Pure Starburst
]

export default function MagicalIntro({ onComplete, forcePlay = false }: MagicalIntroProps) {
  const [shouldRender, setShouldRender] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [logoRevealed, setLogoRevealed] = useState(false)
  const [nameRevealed, setNameRevealed] = useState(false)
  const [fairyPos, setFairyPos] = useState({ x: -100, y: -100, angle: 0, visible: false })

  const location = useLocation()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const isCompleteRef = useRef(false)
  const hasEmittedBurstRef = useRef(false)

  const startIntro = useCallback(() => {
    isCompleteRef.current = false
    hasEmittedBurstRef.current = false
    startTimeRef.current = null
    particlesRef.current = []
    setIsFadingOut(false)
    setLogoRevealed(false)
    setNameRevealed(false)
    setFairyPos({ x: -100, y: -100, angle: 0, visible: false })
    setShouldRender(true)
  }, [])

  // 1. Session check: only play on initial visit or forcePlay or query param replay
  useEffect(() => {
    const hasSeen = sessionStorage.getItem('hasSeenMagicalIntro_v2')
    const urlParams = new URLSearchParams(location.search)
    const wantsReplay = urlParams.get('intro') === 'replay' || urlParams.get('replay') === 'true'

    if (forcePlay || wantsReplay || !hasSeen) {
      startIntro()
    } else {
      if (onComplete) onComplete()
    }

    // Expose programmatic replay helper on window
    ;(window as unknown as { replayMagicalIntro: () => void }).replayMagicalIntro = () => {
      startIntro()
    }
  }, [forcePlay, location.search, onComplete, startIntro])

  // Handle Finish / Skip with smooth fade
  const finishIntro = useCallback(() => {
    if (isCompleteRef.current) return
    isCompleteRef.current = true
    setIsFadingOut(true)
    sessionStorage.setItem('hasSeenMagicalIntro_v2', 'true')

    setTimeout(() => {
      setShouldRender(false)
      if (onComplete) onComplete()
    }, 700)
  }, [onComplete])

  // Listen for Escape key
  useEffect(() => {
    if (!shouldRender) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        finishIntro()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shouldRender, finishIntro])

  // Helper: draw 4-pointed star sparkle on canvas
  const drawSparkle = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    rotation: number,
    alpha: number,
    color: string
  ) => {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rotation)
    ctx.fillStyle = color
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha))

    ctx.beginPath()
    // 4-pointed star sparkle geometry
    const outer = size * 1.8
    const inner = size * 0.25
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2
      ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer)
      const nextAngle = angle + Math.PI / 4
      ctx.lineTo(Math.cos(nextAngle) * inner, Math.sin(nextAngle) * inner)
    }
    ctx.closePath()
    ctx.fill()

    // Central glow core
    ctx.beginPath()
    ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2)
    ctx.fillStyle = '#FFFFFF'
    ctx.fill()

    ctx.restore()
  }

  // Helper: emit burst of particles from logo perimeter
  const emitBurst = (centerX: number, centerY: number, count = 75) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 4.5 + 1.2
      const size = Math.random() * 3.2 + 1.2
      const isSparkle = Math.random() < 0.35

      particlesRef.current.push({
        x: centerX + Math.cos(angle) * (Math.random() * 20),
        y: centerY + Math.sin(angle) * (Math.random() * 20),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size,
        alpha: 1,
        decay: Math.random() * 0.016 + 0.008,
        color: PIXIE_COLORS[Math.floor(Math.random() * PIXIE_COLORS.length)],
        isSparkle,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.08,
        twinkleSpeed: Math.random() * 0.15 + 0.05,
        twinklePhase: Math.random() * Math.PI * 2,
      })
    }
  }

  // 2. Flight Path Mathematical Curve Calculation
  const getFairyCoordinates = (t: number, width: number, height: number) => {
    const centerX = width * 0.5
    const centerY = height * 0.44

    // Phase 1: Entrance swoop from top-left across the screen (t: 0 -> 0.35)
    if (t < 0.35) {
      const p = t / 0.35
      // Smooth cubic swoop
      const x = -60 + p * (width * 0.45 + 60)
      const y = height * 0.15 + Math.sin(p * Math.PI * 0.8) * (height * 0.42)
      return { x, y }
    }

    // Phase 2: Graceful sweeping arch towards upper right (t: 0.35 -> 0.55)
    if (t < 0.55) {
      const p = (t - 0.35) / 0.20
      const startX = width * 0.45
      const startY = height * 0.15 + Math.sin(Math.PI * 0.8) * (height * 0.42)
      const endX = width * 0.68
      const endY = height * 0.24

      // Gentle curve up
      const x = startX + (endX - startX) * p
      const y = startY + (endY - startY) * p - Math.sin(p * Math.PI) * (height * 0.12)
      return { x, y }
    }

    // Phase 3: Halo loop circling around the center AIM logo (t: 0.55 -> 0.85)
    if (t < 0.85) {
      const p = (t - 0.55) / 0.30
      const radiusX = Math.min(width * 0.18, 140)
      const radiusY = Math.min(height * 0.18, 120)

      // Start from top-right and sweep full 360-degree halo
      const angle = -Math.PI * 0.3 + p * Math.PI * 2.15
      const x = centerX + Math.cos(angle) * radiusX
      const y = centerY + Math.sin(angle) * radiusY
      return { x, y }
    }

    // Phase 4: Ascending graceful flourish towards top-right (t: 0.85 -> 1.0)
    const p = (t - 0.85) / 0.15
    const startX = centerX + Math.cos(-Math.PI * 0.3 + Math.PI * 2.15) * Math.min(width * 0.18, 140)
    const startY = centerY + Math.sin(-Math.PI * 0.3 + Math.PI * 2.15) * Math.min(height * 0.18, 120)
    const endX = width * 0.88
    const endY = -80

    const x = startX + (endX - startX) * p
    const y = startY + (endY - startY) * p - Math.sin(p * Math.PI * 0.5) * 40
    return { x, y }
  }

  // 3. Main Animation Loop: Fairy flight + 60FPS Pixie Dust Canvas
  useEffect(() => {
    if (!shouldRender) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set high-DPI canvas dimensions
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Check prefers-reduced-motion (only if user didn't explicitly request replay)
    const urlParams = new URLSearchParams(location.search)
    const wantsReplay = urlParams.get('intro') === 'replay' || urlParams.get('replay') === 'true'
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion && !wantsReplay) {
      setLogoRevealed(true)
      setNameRevealed(true)
      const timer = setTimeout(() => finishIntro(), 1500)
      return () => clearTimeout(timer)
    }

    const duration = 4000 // 4 seconds total flight sequence
    startTimeRef.current = performance.now()
    let prevFairyX = -100
    let prevFairyY = -100

    const loop = (now: number) => {
      if (!startTimeRef.current) startTimeRef.current = now
      const elapsed = now - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)

      const width = window.innerWidth
      const height = window.innerHeight

      // Clear Canvas
      ctx.clearRect(0, 0, width, height)

      // Calculate Fairy Coordinates
      const currentPos = getFairyCoordinates(progress, width, height)

      // Calculate flight rotation angle based on motion delta
      const dx = currentPos.x - prevFairyX
      const dy = currentPos.y - prevFairyY
      let flightAngle = Math.atan2(dy, dx) * (180 / Math.PI)
      if (dx === 0 && dy === 0) flightAngle = 0

      // Smooth fairy state
      const isVisible = progress < 0.96
      setFairyPos({
        x: currentPos.x,
        y: currentPos.y,
        angle: flightAngle,
        visible: isVisible,
      })

      // Emit Pixie Dust Particles along fairy path
      if (isVisible) {
        // Emit 4 to 8 particles per frame from wand tip / wings
        const emitCount = progress > 0.55 && progress < 0.85 ? 7 : 4
        for (let i = 0; i < emitCount; i++) {
          const spread = (Math.random() - 0.5) * 14
          const isSparkle = Math.random() < 0.28
          const size = Math.random() * 2.8 + 1.0

          particlesRef.current.push({
            x: currentPos.x + spread,
            y: currentPos.y + spread,
            vx: (Math.random() - 0.5) * 1.4 - dx * 0.12,
            vy: (Math.random() - 0.5) * 1.4 + 0.35, // Soft downward gravity
            size,
            alpha: Math.random() * 0.4 + 0.6,
            decay: Math.random() * 0.016 + 0.010,
            color: PIXIE_COLORS[Math.floor(Math.random() * PIXIE_COLORS.length)],
            isSparkle,
            rotation: Math.random() * Math.PI,
            rotationSpeed: (Math.random() - 0.5) * 0.06,
            twinkleSpeed: Math.random() * 0.12 + 0.06,
            twinklePhase: Math.random() * Math.PI * 2,
          })
        }
      }

      // Check Stage Triggers:
      // When fairy finishes circling the logo (progress ~0.80):
      if (progress >= 0.78 && !hasEmittedBurstRef.current) {
        hasEmittedBurstRef.current = true
        setLogoRevealed(true)
        emitBurst(width * 0.5, height * 0.44, 90)

        // Reveal Name slightly after logo illumination
        setTimeout(() => {
          setNameRevealed(true)
        }, 400)
      }

      // Render & Update Pixie Dust Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i]

        // Physics update
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.985
        p.vy *= 0.985
        p.vy += 0.015 // Micro-gravity
        p.alpha -= p.decay
        p.rotation += p.rotationSpeed
        p.twinklePhase += p.twinkleSpeed

        // Remove dead particles
        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1)
          continue
        }

        // Twinkle factor
        const twinkle = Math.sin(p.twinklePhase) * 0.25 + 0.75
        const renderAlpha = Math.max(0, p.alpha * twinkle)

        if (p.isSparkle) {
          drawSparkle(ctx, p.x, p.y, p.size * 1.5, p.rotation, renderAlpha, p.color)
        } else {
          // Soft circular glow point
          ctx.save()
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.globalAlpha = renderAlpha
          ctx.shadowBlur = 8
          ctx.shadowColor = p.color
          ctx.fill()
          ctx.restore()
        }
      }

      prevFairyX = currentPos.x
      prevFairyY = currentPos.y

      // Auto-finish when sequence completes
      if (progress >= 1 && !isCompleteRef.current) {
        setTimeout(() => finishIntro(), 600)
        return
      }

      animFrameRef.current = requestAnimationFrame(loop)
    }

    animFrameRef.current = requestAnimationFrame(loop)

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [shouldRender, finishIntro, location.search])

  if (!shouldRender) return null

  return (
    <div
      className={`magical-intro-overlay ${isFadingOut ? 'fade-out' : ''}`}
      onClick={finishIntro}
      role="dialog"
      aria-modal="true"
      aria-label="Magical Portfolio Intro"
    >
      {/* Background Ambience: Deep Obsidian Canvas with Emerald Aura Glow */}
      <div className="intro-ambient-canvas">
        <div className="ambient-radial-glow glow-emerald" />
        <div className="ambient-radial-glow glow-gold" />
      </div>

      {/* Pixie Dust Particle Canvas */}
      <canvas ref={canvasRef} className="pixie-dust-canvas" />

      {/* Fairy Silhouette Enveloped in Surrounding Light */}
      {fairyPos.visible && (
        <div
          className="intro-fairy-actor"
          style={{
            transform: `translate3d(${fairyPos.x - 34}px, ${fairyPos.y - 34}px, 0) rotate(${fairyPos.angle + 12}deg)`,
          }}
        >
          <FairySilhouette
            width={68}
            height={68}
            silhouetteColor="#02040a"
            glowColor="#34D399"
            isFluttering={true}
          />
        </div>
      )}

      {/* Center Stage: AIM Logo & Monogram with Shimmer Reveal */}
      <div className="intro-stage-center">
        <div className={`intro-logo-wrapper ${logoRevealed ? 'revealed' : ''}`}>
          {/* Luminous Halo Ring drawn by the fairy */}
          <div className="magic-halo-ring" />

          {/* Signature hand-drawn AIM Logo */}
          <div className="logo-glow-shell">
            <img
              src="/assets/logo.png"
              alt="AIM Monogram"
              className="intro-brand-logo"
            />
            <div className="magic-shimmer-sweep" />
          </div>
        </div>

        {/* Name & Title Typography Reveal */}
        <div className={`intro-typography-block ${nameRevealed ? 'revealed' : ''}`}>
          <h1 className="intro-name-text">
            AIMEE <span className="name-highlight">PANGAN</span>
          </h1>
          <p className="intro-title-sub">
            <span className="mono-badge">PORTFOLIO</span>
            <span className="bullet-sep">•</span>
            <span>DEVELOPER &amp; DATABASE ARCHITECT</span>
          </p>
        </div>
      </div>

      {/* Discreet Skip Option */}
      <button
        type="button"
        className="intro-skip-btn"
        onClick={(e) => {
          e.stopPropagation()
          finishIntro()
        }}
        aria-label="Skip magical intro animation"
      >
        <span>SKIP</span>
        <span className="skip-kbd">ESC</span>
      </button>
    </div>
  )
}
