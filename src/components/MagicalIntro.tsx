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
  const [tapPos, setTapPos] = useState<{ x: number; y: number } | null>(null)

  const fairyActorRef = useRef<HTMLDivElement | null>(null)
  const lightActorRef = useRef<HTMLDivElement | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const isCompleteRef = useRef(false)
  const tapTriggeredRef = useRef(false)
  const location = useLocation()

  // Prevent background scrolling while intro is visible
  useEffect(() => {
    if (shouldRender && !isFadingOut) {
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prevOverflow
      }
    }
  }, [shouldRender, isFadingOut])

  const startIntro = useCallback(() => {
    isCompleteRef.current = false
    tapTriggeredRef.current = false
    startTimeRef.current = null
    setIsFadingOut(false)
    setIsTypographyLit(false)
    setHasTapped(false)
    setTapPos(null)
    setShouldRender(true)
  }, [])

  // Session check: only on initial session visit or query param / programmatic replay
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

  // Fast, responsive finish / skip handler
  const finishIntro = useCallback(
    (instant = false) => {
      if (isCompleteRef.current) return
      isCompleteRef.current = true
      sessionStorage.setItem('hasSeenMagicalIntro_v3', 'true')
      document.body.style.overflow = ''

      if (instant) {
        setShouldRender(false)
        if (onComplete) onComplete()
        return
      }

      setIsFadingOut(true)
      setTimeout(() => {
        setShouldRender(false)
        if (onComplete) onComplete()
      }, 450)
    },
    [onComplete]
  )

  // Escape key handler
  useEffect(() => {
    if (!shouldRender) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        finishIntro(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shouldRender, finishIntro])

  // Precise flight coordinates calculation
  const getFairyCoordinates = (t: number, width: number, height: number) => {
    const textCenterX = width * 0.5
    const textCenterY = height * 0.48
    const tapTargetX = textCenterX - Math.min(width * 0.22, 135)
    const tapTargetY = textCenterY - 16

    // Phase 1: Swoop in from top-left (t: 0 -> 0.44)
    if (t < 0.44) {
      const p = t / 0.44
      const startX = -70
      const startY = height * 0.16
      const midX = width * 0.26
      const midY = height * 0.52

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

    // Phase 2: Tap contact at target (t: 0.44 -> 0.54)
    if (t < 0.54) {
      const p = (t - 0.44) / 0.10
      const tapDip = Math.sin(p * Math.PI) * 3
      return {
        x: tapTargetX + p * 5,
        y: tapTargetY + tapDip,
      }
    }

    // Phase 3: Graceful arch looping over the illuminated typography (t: 0.54 -> 0.78)
    if (t < 0.78) {
      const p = (t - 0.54) / 0.24
      const startX = tapTargetX + 5
      const startY = tapTargetY
      const endX = textCenterX + Math.min(width * 0.24, 155)
      const endY = textCenterY - 24

      const x = startX + (endX - startX) * p
      const y = startY + (endY - startY) * p - Math.sin(p * Math.PI) * (height * 0.12)
      return { x, y }
    }

    // Phase 4: Ascending exit flourish toward top-right (t: 0.78 -> 1.0)
    const p = (t - 0.78) / 0.22
    const startX = textCenterX + Math.min(width * 0.24, 155)
    const startY = textCenterY - 24
    const endX = width * 0.94
    const endY = -80

    const x = startX + (endX - startX) * p
    const y = startY + (endY - startY) * p - Math.sin(p * Math.PI * 0.5) * 30
    return { x, y }
  }

  // Optimized Direct DOM Animation Loop (No React setState on frame update!)
  useEffect(() => {
    if (!shouldRender) return

    const urlParams = new URLSearchParams(location.search)
    const wantsReplay = urlParams.get('intro') === 'replay' || urlParams.get('replay') === 'true'
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion && !wantsReplay) {
      setIsTypographyLit(true)
      const timer = setTimeout(() => finishIntro(false), 800)
      return () => clearTimeout(timer)
    }

    // Snappy, cinematic 2.4s flight duration
    const duration = 2400
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

      const currentPos = getFairyCoordinates(progress, width, height)

      // Velocity angle calculation
      const dx = currentPos.x - prevFairyX
      const dy = currentPos.y - prevFairyY
      let flightAngle = Math.atan2(dy, dx) * (180 / Math.PI)
      if (dx === 0 && dy === 0) flightAngle = 0

      // Direct DOM transform updates (Zero React re-render overhead!)
      if (fairyActorRef.current) {
        if (progress >= 0.97) {
          fairyActorRef.current.style.opacity = '0'
        } else {
          fairyActorRef.current.style.opacity = '1'
          fairyActorRef.current.style.transform = `translate3d(${currentPos.x - 27}px, ${currentPos.y - 27}px, 0) rotate(${flightAngle + 10}deg)`
        }
      }

      // Background light trails smoothly
      const targetLightX = currentPos.x - dx * 0.35
      const targetLightY = currentPos.y - dy * 0.35
      lightCurrentX += (targetLightX - lightCurrentX) * 0.22
      lightCurrentY += (targetLightY - lightCurrentY) * 0.22

      if (lightActorRef.current) {
        lightActorRef.current.style.transform = `translate3d(${lightCurrentX}px, ${lightCurrentY}px, 0)`
      }

      // Trigger the tap event at progress ~0.48
      if (progress >= 0.48 && !tapTriggeredRef.current) {
        tapTriggeredRef.current = true
        setTapPos({ x: currentPos.x + 16, y: currentPos.y - 4 })
        setHasTapped(true)
        setIsTypographyLit(true)
      }

      prevFairyX = currentPos.x
      prevFairyY = currentPos.y

      if (progress >= 1 && !isCompleteRef.current) {
        setTimeout(() => finishIntro(false), 350)
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
      onClick={() => finishIntro(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio Loading Intro"
    >
      {/* ── AMBIENT BASE CANVAS ────────────────────────────── */}
      <div className="intro-ambient-canvas">
        <div className="ambient-center-glow" />
      </div>

      {/* ── BACKGROUND MOVING LIGHT (Hardware-accelerated) ──── */}
      <div ref={lightActorRef} className="intro-following-light">
        <div className="light-core-glow" />
        <div className="light-emerald-halo" />
        <div className="light-amber-halo" />
      </div>

      {/* ── TAP RIPPLE EFFECT ───────────────────────────────── */}
      {hasTapped && tapPos && (
        <div
          className="intro-tap-ripple-container"
          style={{
            left: tapPos.x,
            top: tapPos.y,
          }}
        >
          <div className="tap-ripple-wave wave-1" />
          <div className="tap-ripple-wave wave-2" />
          <div className="tap-contact-flash" />
        </div>
      )}

      {/* ── CENTER STAGE: TYPOGRAPHY HERO ─────────────────── */}
      <div className="intro-stage-center">
        <div className={`intro-typography-hero ${isTypographyLit ? 'lit-up' : ''}`}>
          <div className="typography-ambient-backlight" />

          <h1 className="intro-name-headline">
            <span className="word-aimee">AIMEE</span>
            <span className="name-gap">&nbsp;</span>
            <span className="word-pangan">PANGAN</span>
          </h1>

          <div className="typography-shimmer-sweep" />

          <div className="intro-subtitle-row">
            <span className="badge-pill">PORTFOLIO</span>
            <span className="badge-sep">•</span>
            <span className="badge-role">WEB DEVELOPER &amp; DATABASE ARCHITECT</span>
          </div>
        </div>
      </div>

      {/* ── FAIRY SILHOUETTE ACTOR (Direct DOM transform) ──── */}
      <div ref={fairyActorRef} className="intro-fairy-actor">
        <FairySilhouette
          width={54}
          height={54}
          color="#000000"
          isFluttering={true}
        />
      </div>

      {/* ── SKIP BUTTON ────────────────────────────────────── */}
      <button
        type="button"
        className="intro-skip-btn"
        onClick={(e) => {
          e.stopPropagation()
          finishIntro(true)
        }}
        aria-label="Skip loading intro"
      >
        <span>SKIP</span>
        <span className="skip-kbd">ESC</span>
      </button>
    </div>
  )
}
