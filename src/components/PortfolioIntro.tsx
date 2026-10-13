import { useEffect, useRef, useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import './PortfolioIntro.css'

interface PortfolioIntroProps {
  onComplete?: () => void
  forcePlay?: boolean
}


export default function PortfolioIntro({ onComplete, forcePlay = false }: PortfolioIntroProps) {
  // Initialize synchronously on frame 0 to prevent any flash of the homepage
  const [shouldRender, setShouldRender] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      const searchStr = window.location.search
      const urlParams = new URLSearchParams(searchStr)
      const wantsReplay = urlParams.get('intro') === 'replay' || urlParams.get('replay') === 'true'
      if (forcePlay || wantsReplay) return true
      return sessionStorage.getItem('hasSeenPesqueraIntro_v2') !== 'true'
    } catch {
      return true
    }
  })

  const overlayRef = useRef<HTMLDivElement | null>(null)
  const topShutterRef = useRef<HTMLDivElement | null>(null)
  const bottomShutterRef = useRef<HTMLDivElement | null>(null)
  const centerFlareRef = useRef<HTMLDivElement | null>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  const isCompleteRef = useRef(!shouldRender)
  const hasStartedRef = useRef(shouldRender)
  const location = useLocation()

  // Prevent background scrolling while intro is visible
  useEffect(() => {
    if (shouldRender && !isCompleteRef.current) {
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prevOverflow
      }
    }
  }, [shouldRender])

  // Graceful finish & unmount
  const finishIntro = useCallback(
    (instant = false) => {
      if (isCompleteRef.current) return
      isCompleteRef.current = true

      if (timelineRef.current) {
        timelineRef.current.kill()
        timelineRef.current = null
      }

      const searchStr = location.search || window.location.search
      const urlParams = new URLSearchParams(searchStr)
      const wantsReplay = urlParams.get('intro') === 'replay' || urlParams.get('replay') === 'true'

      // Only save session flag if not explicitly requesting replay
      if (!wantsReplay) {
        try {
          sessionStorage.setItem('hasSeenPesqueraIntro_v2', 'true')
        } catch {
          // Safe fallback for restricted storage environments
        }
      }

      document.body.style.overflow = ''

      if (instant || !overlayRef.current) {
        setShouldRender(false)
        if (onComplete) onComplete()
        return
      }

      // Fast, smooth fade out of remaining wrapper
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.18,
        ease: 'power2.out',
        onComplete: () => {
          setShouldRender(false)
          if (onComplete) onComplete()
        },
      })
    },
    [location.search, onComplete]
  )

  // Choreographed GSAP timeline with optimized pacing and clean line break
  const startAnimation = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill()
    }

    const overlay = overlayRef.current
    const topShutter = topShutterRef.current
    const bottomShutter = bottomShutterRef.current
    const centerFlare = centerFlareRef.current
    if (!overlay || !topShutter || !bottomShutter) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const searchStr = location.search || window.location.search
    const urlParams = new URLSearchParams(searchStr)
    const wantsReplay = urlParams.get('intro') === 'replay' || urlParams.get('replay') === 'true'

    if (prefersReducedMotion && !wantsReplay) {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.25,
        delay: 0.05,
        ease: 'power2.out',
        onComplete: () => finishIntro(true),
      })
      return
    }

    const tl = gsap.timeline({
      onComplete: () => {
        finishIntro()
      },
    })
    timelineRef.current = tl

    // Initial state: Shutters joined at 50vh, meeting at the thick line
    gsap.set(overlay, { opacity: 1, pointerEvents: 'auto' })
    gsap.set(topShutter, { yPercent: 0 })
    gsap.set(bottomShutter, { yPercent: 0 })
    gsap.set('.p10-withaim-char', { y: '115%', opacity: 0 })
    gsap.set('.p10-aimee-char', { y: '115%', opacity: 0 })
    gsap.set('.p10-pangan-char', { y: '-115%', opacity: 0 })
    gsap.set('.p10-role-bar', { y: 14, opacity: 0 })
    gsap.set('.p10-meta-header', { opacity: 0 })
    gsap.set('.p10-center-glow-line', { scaleX: 0, opacity: 0 })
    gsap.set('.p10-line-edge', { opacity: 1 })
    if (centerFlare) gsap.set(centerFlare, { opacity: 0, scale: 0.5 })

    // ── 1. OPENING: THICK CENTER LINE & WITHAIM REVEAL (0.0s - 0.65s) ──
    // Center line draws across quickly in front
    tl.to('.p10-center-glow-line', {
      scaleX: 1,
      opacity: 1,
      duration: 0.38,
      ease: 'power2.out',
    }, 0.05)

    tl.to('.p10-meta-header', {
      opacity: 1,
      duration: 0.35,
      ease: 'power2.out',
    }, 0.08)

    // WITHAIM characters emerge boldly in the top section above the line
    tl.to('.p10-withaim-char', {
      y: '0%',
      opacity: 1,
      stagger: 0.03,
      duration: 0.5,
      ease: 'power3.out',
    }, 0.12)

    // ── 2. TYPOGRAPHIC TRANSFORMATION: AIMEE PANGAN (0.65s - 1.35s) ──
    // Center line flashes with bright specular spark
    if (centerFlare) {
      tl.to(centerFlare, {
        opacity: 1,
        scale: 1.25,
        duration: 0.18,
        ease: 'power2.inOut',
      }, 0.68)
      tl.to(centerFlare, {
        opacity: 0,
        scale: 1.8,
        duration: 0.2,
        ease: 'power2.out',
      }, 0.86)
    }

    // WITHAIM slides up into mask
    tl.to('.p10-withaim-char', {
      y: '-120%',
      opacity: 0,
      stagger: 0.018,
      duration: 0.3,
      ease: 'power3.in',
    }, 0.72)

    // AIMEE enters above the line (in top shutter)
    tl.to('.p10-aimee-char', {
      y: '0%',
      opacity: 1,
      stagger: 0.028,
      duration: 0.45,
      ease: 'power3.out',
    }, 0.88)

    // PANGAN enters below the line (in bottom shutter)
    tl.to('.p10-pangan-char', {
      y: '0%',
      opacity: 1,
      stagger: 0.028,
      duration: 0.45,
      ease: 'power3.out',
    }, 0.94)

    // WEB DEVELOPER discipline pill enters below PANGAN
    tl.to('.p10-role-bar', {
      y: 0,
      opacity: 1,
      duration: 0.38,
      ease: 'power2.out',
    }, 1.12)

    // ── 3. GRAPHIC LOCKUP MOMENT (1.35s - 1.95s) ──
    // Confident, clean hold (~0.6s) with zero text colliding with the line

    // ── 4. LINE BREAK & VERTICAL SEPARATION (1.95s - 2.75s) ──
    // CRITICAL FIX: The static center line immediately breaks / disappears at separation!
    // The line itself divides into the two moving edge lines attached to the shutters.
    // Zero line is left in the middle of the screen!
    tl.to('.p10-center-glow-line', {
      opacity: 0,
      duration: 0.08,
      ease: 'power1.out',
    }, 1.95)

    // Immediately release pointer events so the live homepage can be clicked
    tl.call(() => {
      if (overlay) overlay.style.pointerEvents = 'none'
    }, undefined, 1.98)

    // Top Shutter slides UP to ceiling (Hardware-accelerated)
    tl.to(topShutter, {
      yPercent: -100,
      duration: 0.78,
      ease: 'power3.inOut',
    }, 1.95)

    // Bottom Shutter slides DOWN to floor (Hardware-accelerated)
    tl.to(bottomShutter, {
      yPercent: 100,
      duration: 0.78,
      ease: 'power3.inOut',
    }, 1.95)

    // Fade out moving edge lines as shutters exit the viewport
    tl.to('.p10-line-edge', {
      opacity: 0,
      duration: 0.12,
      ease: 'power1.out',
    }, 2.65)

    // Developer inspection hooks
    const stepParam = urlParams.get('step')
    if (stepParam === '1') {
      tl.pause(0.45)
    } else if (stepParam === '2') {
      tl.pause(1.5)
    } else if (stepParam === '3') {
      tl.pause(2.25)
    }

  }, [finishIntro, location.search])

  // Session check & mount logic
  useEffect(() => {
    let hasSeen = false
    try {
      hasSeen = sessionStorage.getItem('hasSeenPesqueraIntro_v2') === 'true'
    } catch {
      hasSeen = false
    }

    const searchStr = location.search || window.location.search
    const urlParams = new URLSearchParams(searchStr)
    const wantsReplay = urlParams.get('intro') === 'replay' || urlParams.get('replay') === 'true'

    if (wantsReplay) {
      hasStartedRef.current = false
      isCompleteRef.current = false
    }

    if (forcePlay || wantsReplay || !hasSeen) {
      if (!hasStartedRef.current) {
        hasStartedRef.current = true
        isCompleteRef.current = false
        setShouldRender(true)
      }
    } else {
      if (onComplete) onComplete()
    }

    // Window helper: window.replayPesqueraIntro()
    ;(window as unknown as { replayPesqueraIntro: () => void }).replayPesqueraIntro = () => {
      try {
        sessionStorage.removeItem('hasSeenPesqueraIntro_v2')
      } catch {
        // ignore
      }
      hasStartedRef.current = false
      isCompleteRef.current = false
      setShouldRender(true)
    }
  }, [forcePlay, location.search, onComplete])

  // Trigger animation immediately on mount
  useEffect(() => {
    if (shouldRender && !isCompleteRef.current) {
      const raf = requestAnimationFrame(() => {
        startAnimation()
      })
      return () => cancelAnimationFrame(raf)
    }
  }, [shouldRender, startAnimation])

  // Keyboard shortcut: ESC or Space to skip instantly
  useEffect(() => {
    if (!shouldRender) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        e.preventDefault()
        finishIntro(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shouldRender, finishIntro])

  if (!shouldRender) return null

  return (
    <aside
      ref={overlayRef}
      className="p10-intro-overlay"
      role="status"
      aria-live="polite"
      aria-label="Portfolio Introduction"
    >
      {/* ── HARDWARE-ACCELERATED CSS DOT GRID BACKGROUND ──────── */}
      <div className="p10-dot-grid-bg" aria-hidden="true" />

      {/* ── TOP SHUTTER PANEL (Sliding Upward on Separate) ──────── */}
      <div ref={topShutterRef} className="p10-shutter p10-shutter-top">
        <div className="p10-dot-grid-bg" aria-hidden="true" />
        <div className="p10-shutter-ambient-glow top-glow" aria-hidden="true" />

        {/* Editorial Header Meta Bar */}
        <header className="p10-meta-header" aria-hidden="true">
          <div className="p10-meta-item">
            <span className="p10-mono-accent">01 //</span>
            <span className="p10-mono-text">PORTFOLIO LOADING</span>
          </div>
          <div className="p10-meta-item p10-meta-center">
            <span className="p10-brand-mark">WITHAIM</span>
          </div>
          <div className="p10-meta-item p10-meta-right">
            <span className="p10-status-dot" />
            <span className="p10-mono-text">HAU • BSIT</span>
          </div>
        </header>

        {/* Top Typography Zone: AIMEE sits cleanly ABOVE the line */}
        <div className="p10-top-zone">
          {/* Act 1: WITHAIM (Upper Zone) */}
          <div className="p10-withaim-row" aria-hidden="true">
            {['W', 'I', 'T', 'H', 'A', 'I', 'M'].map((char, index) => (
              <span key={index} className="p10-mask-cell">
                <span className={`p10-withaim-char ${index >= 4 ? 'is-aim-core' : ''}`}>
                  {char}
                </span>
              </span>
            ))}
          </div>

          {/* Act 2: AIMEE (Cleanly above the dividing line) */}
          <div className="p10-aimee-row">
            {['A', 'I', 'M', 'E', 'E'].map((char, index) => (
              <span key={index} className="p10-mask-cell">
                <span className="p10-aimee-char">{char}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Bottom glowing line edge attached to Top Shutter */}
        <div className="p10-line-edge p10-line-edge-top" aria-hidden="true">
          <div className="p10-edge-core" />
          <div className="p10-edge-glow" />
        </div>
      </div>

      {/* ── BOTTOM SHUTTER PANEL (Sliding Downward on Separate) ──── */}
      <div ref={bottomShutterRef} className="p10-shutter p10-shutter-bottom">
        <div className="p10-dot-grid-bg" aria-hidden="true" />
        <div className="p10-shutter-ambient-glow bottom-glow" aria-hidden="true" />

        {/* Top glowing line edge attached to Bottom Shutter */}
        <div className="p10-line-edge p10-line-edge-bottom" aria-hidden="true">
          <div className="p10-edge-core" />
          <div className="p10-edge-glow" />
        </div>

        {/* Bottom Typography Zone: PANGAN sits cleanly BELOW the line */}
        <div className="p10-bottom-zone">
          {/* Act 2: PANGAN (Cleanly below the dividing line) */}
          <div className="p10-pangan-row">
            {['P', 'A', 'N', 'G', 'A', 'N'].map((char, index) => (
              <span key={index} className="p10-mask-cell">
                <span className="p10-pangan-char">{char}</span>
              </span>
            ))}
          </div>

          {/* Subtitle / Discipline Bar */}
          <div className="p10-role-bar">
            <span className="p10-role-line" aria-hidden="true" />
            <span className="p10-role-pill">
              <span className="p10-amber-bullet" aria-hidden="true">✦</span>
              <span className="p10-role-title">WEB DEVELOPER</span>
              <span className="p10-amber-bullet" aria-hidden="true">✦</span>
            </span>
            <span className="p10-role-line" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* ── STATIC CENTER LINE (Only visible while joined; vanishes on split) ─── */}
      <div className="p10-center-glow-line" aria-hidden="true">
        <div className="p10-thick-core" />
        <div className="p10-thick-emerald-glow" />
        <div ref={centerFlareRef} className="p10-center-spark" />
      </div>

      {/* ── SKIP BUTTON ────────────────────────────────────────── */}
      <button
        type="button"
        className="p10-skip-button"
        onClick={() => finishIntro(true)}
        aria-label="Skip introduction"
      >
        <span className="p10-skip-text">SKIP</span>
        <kbd className="p10-skip-kbd">ESC</kbd>
      </button>
    </aside>
  )
}
