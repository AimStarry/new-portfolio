import { useEffect, useRef, useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import FairySilhouette from './FairySilhouette'
import './MagicalIntro.css'

interface MagicalIntroProps {
  onComplete?: () => void
  forcePlay?: boolean
}

export default function MagicalIntro({ onComplete, forcePlay = false }: MagicalIntroProps) {
  const [shouldRender, setShouldRender] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [isTypographyLit, setIsTypographyLit] = useState(false)
  const [hasTapped, setHasTapped] = useState(false)
  const [tapRipplePos, setTapRipplePos] = useState<{ x: number; y: number } | null>(null)
  const [fairyPos, setFairyPos] = useState({ x: -100, y: -100, angle: 0, visible: false })
  const [lightPos, setLightPos] = useState({ x: -200, y: -200 })

  const location = useLocation()
  const animFrameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const isCompleteRef = useRef(false)
  const tapTriggeredRef = useRef(false)

  const startIntro = useCallback(() => {
    isCompleteRef.current = false
    tapTriggeredRef.current = false
    startTimeRef.current = null
    setIsFadingOut(false)
    setIsTypographyLit(false)
    setHasTapped(false)
    setTapRipplePos(null)
    setFairyPos({ x: -100, y: -100, angle: 0, visible: false })
    setLightPos({ x: -200, y: -200 })
    setShouldRender(true)
  }, [])

  // 1. Session check: only play on initial session visit, or query param / programmatic replay
  useEffect(() => {
    const hasSeen = sessionStorage.getItem('hasSeenMagicalIntro_v3')
    const urlParams = new URLSearchParams(location.search)
    const wantsReplay = urlParams.get('intro') === 'replay' || urlParams.get('replay') === 'true'

    if (forcePlay || wantsReplay || !hasSeen) {
      startIntro()
    } else {
      if (onComplete) onComplete()
    }

    ;(window as unknown as { replayMagicalIntro: () => void }).replayMagicalIntro = () => {
      startIntro()
    }
  }, [forcePlay, location.search, onComplete, startIntro])

  // Handle Finish / Skip with smooth fade
  const finishIntro = useCallback(() => {
    if (isCompleteRef.current) return
    isCompleteRef.current = true
    setIsFadingOut(true)
    sessionStorage.setItem('hasSeenMagicalIntro_v3', 'true')

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

  // 2. Flight Path Mathematical Curve with Tap Choreography
  const getFairyCoordinates = (t: number, width: number, height: number) => {
    const textCenterX = width * 0.5
    const textCenterY = height * 0.48
    // Tap target: Near top-left of the typography ("AIMEE")
    const tapTargetX = textCenterX - Math.min(width * 0.22, 140)
    const tapTargetY = textCenterY - 18

    // Phase 1: Swoop in from top-left (t: 0 -> 0.46)
    if (t < 0.46) {
      const p = t / 0.46
      const startX = -80
      const startY = height * 0.18
      const midX = width * 0.28
      const midY = height * 0.55

      // Cubic Bézier curve swooping down and sweeping up toward tap target
      const oneMinusP = 1 - p
      const x =
        oneMinusP * oneMinusP * startX +
        2 * oneMinusP * p * midX +
        p * p * tapTargetX
      const y =
        oneMinusP * oneMinusP * startY +
        2 * oneMinusP * p * midY +
        p * p * tapTargetY

      return { x, y }
    }

    // Phase 2: Gentle hover and Tap contact at target (t: 0.46 -> 0.56)
    if (t < 0.56) {
      const p = (t - 0.46) / 0.10
      // Micro tap dip forward
      const tapDip = Math.sin(p * Math.PI) * 4
      return {
        x: tapTargetX + p * 6,
        y: tapTargetY + tapDip,
      }
    }

    // Phase 3: Graceful arch looping over the illuminated typography (t: 0.56 -> 0.78)
    if (t < 0.78) {
      const p = (t - 0.56) / 0.22
      const startX = tapTargetX + 6
      const startY = tapTargetY
      const endX = textCenterX + Math.min(width * 0.24, 160)
      const endY = textCenterY - 26

      const x = startX + (endX - startX) * p
      // Graceful high arch over the glowing text
      const y = startY + (endY - startY) * p - Math.sin(p * Math.PI) * (height * 0.14)
      return { x, y }
    }

    // Phase 4: Ascending exit flourish toward top-right (t: 0.78 -> 1.0)
    const p = (t - 0.78) / 0.22
    const startX = textCenterX + Math.min(width * 0.24, 160)
    const startY = textCenterY - 26
    const endX = width * 0.92
    const endY = -90

    const x = startX + (endX - startX) * p
    const y = startY + (endY - startY) * p - Math.sin(p * Math.PI * 0.5) * 35
    return { x, y }
  }

  // 3. Animation Loop
  useEffect(() => {
    if (!shouldRender) return

    const urlParams = new URLSearchParams(location.search)
    const wantsReplay = urlParams.get('intro') === 'replay' || urlParams.get('replay') === 'true'
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion && !wantsReplay) {
      setIsTypographyLit(true)
      const timer = setTimeout(() => finishIntro(), 1400)
      return () => clearTimeout(timer)
    }

    const duration = 3800 // 3.8s total sequence
    startTimeRef.current = performance.now()
    let prevFairyX = -100
    let prevFairyY = -100
    let lightCurrentX = -200
    let lightCurrentY = -200

    const loop = (now: number) => {
      if (!startTimeRef.current) startTimeRef.current = now
      const elapsed = now - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)

      const width = window.innerWidth
      const height = window.innerHeight

      // Calculate Fairy Coordinates
      const currentPos = getFairyCoordinates(progress, width, height)

      // Flight rotation angle
      const dx = currentPos.x - prevFairyX
      const dy = currentPos.y - prevFairyY
      let flightAngle = Math.atan2(dy, dx) * (180 / Math.PI)
      if (dx === 0 && dy === 0) flightAngle = 0

      // The light in the background smoothly trails behind the fairy
      const targetLightX = currentPos.x - dx * 0.4
      const targetLightY = currentPos.y - dy * 0.4
      lightCurrentX += (targetLightX - lightCurrentX) * 0.16
      lightCurrentY += (targetLightY - lightCurrentY) * 0.16

      setLightPos({ x: lightCurrentX, y: lightCurrentY })

      const isVisible = progress < 0.96
      setFairyPos({
        x: currentPos.x,
        y: currentPos.y,
        angle: flightAngle,
        visible: isVisible,
      })

      // Trigger the TAP at progress ~0.50
      if (progress >= 0.50 && !tapTriggeredRef.current) {
        tapTriggeredRef.current = true
        setHasTapped(true)
        setTapRipplePos({ x: currentPos.x + 18, y: currentPos.y - 4 })
        // Typography lights up!
        setIsTypographyLit(true)
      }

      prevFairyX = currentPos.x
      prevFairyY = currentPos.y

      // Complete sequence
      if (progress >= 1 && !isCompleteRef.current) {
        setTimeout(() => finishIntro(), 600)
        return
      }

      animFrameRef.current = requestAnimationFrame(loop)
    }

    animFrameRef.current = requestAnimationFrame(loop)

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [shouldRender, finishIntro, location.search])

  if (!shouldRender) return null

  return (
    <div
      className={`magical-intro-overlay ${isFadingOut ? 'fade-out' : ''}`}
      onClick={finishIntro}
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio Intro"
    >
      {/* ── AMBIENT BASE CANVAS ────────────────────────────── */}
      <div className="intro-ambient-canvas">
        <div className="ambient-center-glow" />
      </div>

      {/* ── THE LIGHT IN THE BACKGROUND FOLLOWING THE FAIRY ── */}
      <div
        className="intro-following-light"
        style={{
          transform: `translate3d(${lightPos.x}px, ${lightPos.y}px, 0)`,
        }}
      >
        <div className="light-core-glow" />
        <div className="light-emerald-halo" />
        <div className="light-amber-halo" />
      </div>

      {/* ── TAP RIPPLE SHOCKWAVE EFFECT ─────────────────────── */}
      {hasTapped && tapRipplePos && (
        <div
          className="intro-tap-ripple-container"
          style={{
            left: tapRipplePos.x,
            top: tapRipplePos.y,
          }}
        >
          <div className="tap-ripple-wave wave-1" />
          <div className="tap-ripple-wave wave-2" />
          <div className="tap-contact-flash" />
        </div>
      )}

      {/* ── CENTER STAGE: AIMEE PANGAN TYPOGRAPHY ──────────── */}
      <div className="intro-stage-center">
        <div className={`intro-typography-hero ${isTypographyLit ? 'lit-up' : ''}`}>
          {/* Subtle Backlight Bloom behind the letters when lit */}
          <div className="typography-ambient-backlight" />

          {/* Main Name Typography */}
          <h1 className="intro-name-headline">
            <span className="word-aimee">AIMEE</span>
            <span className="name-gap">&nbsp;</span>
            <span className="word-pangan">PANGAN</span>
          </h1>

          {/* Luminous Shimmer Wave that sweeps across the lit typography */}
          <div className="typography-shimmer-sweep" />

          {/* Editorial Portfolio Metadata Subtitle */}
          <div className="intro-subtitle-row">
            <span className="badge-pill">PORTFOLIO</span>
            <span className="badge-sep">•</span>
            <span className="badge-role">WEB DEVELOPER &amp; DATABASE ARCHITECT</span>
          </div>
        </div>
      </div>

      {/* ── FAIRY: PURE BLACK SILHOUETTE IN FLIGHT ─────────── */}
      {fairyPos.visible && (
        <div
          className="intro-fairy-actor"
          style={{
            transform: `translate3d(${fairyPos.x - 27}px, ${fairyPos.y - 27}px, 0) rotate(${fairyPos.angle + 10}deg)`,
          }}
        >
          <FairySilhouette
            width={54}
            height={54}
            color="#000000"
            isFluttering={true}
          />
        </div>
      )}

      {/* ── SKIP BUTTON ────────────────────────────────────── */}
      <button
        type="button"
        className="intro-skip-btn"
        onClick={(e) => {
          e.stopPropagation()
          finishIntro()
        }}
        aria-label="Skip intro animation"
      >
        <span>SKIP</span>
        <span className="skip-kbd">ESC</span>
      </button>
    </div>
  )
}
