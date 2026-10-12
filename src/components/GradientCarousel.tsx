import { useState, useEffect, useRef, useCallback, memo } from 'react'
import './GradientCarousel.css'

export interface CarouselItem {
  title: string
  issuer: string
  date: string
  image: string
  link: string
  tier: number
  badge: string
  colors: [string, string] // [primaryColor, secondaryColor]
}

interface GradientCarouselProps {
  items: CarouselItem[]
  maxRotationDegrees?: number
  maxDepthPx?: number
  gapPx?: number
  gradientIntensity?: number
  autoPlayInterval?: number
  className?: string
  onActiveChange?: (index: number) => void
}

export const GradientCarousel = memo(function GradientCarousel({
  items,
  maxRotationDegrees = 32,
  maxDepthPx = 160,
  gapPx = 220,
  gradientIntensity = 0.42,
  autoPlayInterval = 5500,
  className = '',
  onActiveChange,
}: GradientCarouselProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const dragStartX = useRef(0)
  const dragCurrentX = useRef(0)
  const autoPlayTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const count = items.length

  const goTo = useCallback((idx: number) => {
    const nextIdx = (idx + count) % count
    setActiveIdx(nextIdx)
    onActiveChange?.(nextIdx)
  }, [count, onActiveChange])

  const next = useCallback(() => goTo(activeIdx + 1), [activeIdx, goTo])
  const prev = useCallback(() => goTo(activeIdx - 1), [activeIdx, goTo])

  // Auto-play management
  const pauseAutoPlay = useCallback(() => {
    if (autoPlayTimer.current) {
      clearInterval(autoPlayTimer.current)
      autoPlayTimer.current = null
    }
  }, [])

  const resumeAutoPlay = useCallback(() => {
    pauseAutoPlay()
    if (!isHovered && !isDragging && autoPlayInterval > 0) {
      autoPlayTimer.current = setInterval(() => {
        setActiveIdx(curr => (curr + 1) % count)
      }, autoPlayInterval)
    }
  }, [autoPlayInterval, count, isDragging, isHovered, pauseAutoPlay])

  useEffect(() => {
    resumeAutoPlay()
    return () => pauseAutoPlay()
  }, [resumeAutoPlay, pauseAutoPlay])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if carousel or section is in viewport or element focused
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const inView = rect.top < window.innerHeight && rect.bottom > 0
      if (!inView) return

      if (e.key === 'ArrowRight') {
        next()
      } else if (e.key === 'ArrowLeft') {
        prev()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [next, prev])

  const sceneRef = useRef<HTMLDivElement>(null)
  const wheelAccumulator = useRef(0)
  const lastWheelTime = useRef(0)

  // Wheel / Trackpad scroll support
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return

    const handleWheel = (e: WheelEvent) => {
      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY)
      const delta = isHorizontal ? e.deltaX : e.deltaY

      if (Math.abs(delta) < 3) return

      wheelAccumulator.current += delta
      const now = performance.now()

      // Responsive step with debounce threshold
      if (Math.abs(wheelAccumulator.current) >= 35) {
        if (now - lastWheelTime.current > 240) {
          if (wheelAccumulator.current > 0) {
            next()
          } else {
            prev()
          }
          lastWheelTime.current = now
          wheelAccumulator.current = 0
        }
      }
    }

    scene.addEventListener('wheel', handleWheel, { passive: true })
    return () => scene.removeEventListener('wheel', handleWheel)
  }, [next, prev])

  // Global window pointer drag listeners for seamless swiping
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true)
    dragStartX.current = e.clientX
    dragCurrentX.current = e.clientX
    pauseAutoPlay()

    const onPointerMove = (moveEvt: PointerEvent) => {
      dragCurrentX.current = moveEvt.clientX
      const delta = moveEvt.clientX - dragStartX.current
      setDragOffset(delta)
    }

    const onPointerUp = (upEvt: PointerEvent) => {
      const delta = upEvt.clientX - dragStartX.current
      setIsDragging(false)
      setDragOffset(0)

      if (Math.abs(delta) > 42) {
        if (delta < 0) {
          next()
        } else {
          prev()
        }
      }
      resumeAutoPlay()

      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
  }

  const activeItem = items[activeIdx] || items[0]
  const [activePrimary, activeSecondary] = activeItem?.colors || ['#10B981', '#34D399']

  return (
    <div
      ref={containerRef}
      className={`gradient-carousel-container ${className}`}
      onMouseEnter={() => { setIsHovered(true); pauseAutoPlay() }}
      onMouseLeave={() => { setIsHovered(false); resumeAutoPlay() }}
      tabIndex={0}
      aria-label="3D Gradient Certificates Carousel"
    >
      {/* ── Ambient Background Tint Mesh ── */}
      <div className="gc-ambient-backdrop" aria-hidden="true">
        {/* Primary soft radial spotlight */}
        <div
          className="gc-glow-orb gc-orb-1"
          style={{
            background: `radial-gradient(circle, ${activePrimary} 0%, transparent 70%)`,
            opacity: gradientIntensity,
          }}
        />
        {/* Secondary counter-balancing color orb */}
        <div
          className="gc-glow-orb gc-orb-2"
          style={{
            background: `radial-gradient(circle, ${activeSecondary} 0%, transparent 68%)`,
            opacity: gradientIntensity * 0.85,
          }}
        />
        {/* Stage floor light reflection */}
        <div
          className="gc-stage-reflection"
          style={{
            background: `linear-gradient(to top, ${activePrimary}26, transparent)`,
          }}
        />
        {/* Vignette to smoothly merge into dark space */}
        <div className="gc-ambient-vignette" />
      </div>

      {/* ── 3D Scene Viewport ── */}
      <div
        ref={sceneRef}
        className="gc-scene"
        onPointerDown={handlePointerDown}
      >
        <div className="gc-card-stage">
          {items.map((item, idx) => {
            // Calculate signed distance from active index
            let diff = idx - activeIdx
            // Handle circular wrapping for seamless perception
            if (diff > count / 2) diff -= count
            if (diff < -count / 2) diff += count

            // Dynamic drag influence
            const dragInfluence = isDragging ? dragOffset / (gapPx * 1.5) : 0
            const virtualPos = diff - dragInfluence
            const absPos = Math.abs(virtualPos)

            // Limit visible cards for optimal performance
            const isVisible = absPos <= 3.2
            if (!isVisible) return null

            const isCurrent = Math.abs(virtualPos) < 0.45
            const sign = Math.sign(virtualPos)

            // 3D Coverflow transformations
            const translateX = virtualPos * gapPx
            const translateZ = -Math.min(absPos * maxDepthPx, maxDepthPx * 2.2)
            const rotateY = -sign * Math.min(absPos * maxRotationDegrees, maxRotationDegrees)
            const scale = Math.max(0.72, 1 - absPos * 0.12)
            const opacity = Math.max(0, isCurrent ? 1 : 0.82 - absPos * 0.24)
            const zIndex = Math.round(100 - absPos * 20)

            const [cardColorA, cardColorB] = item.colors

            return (
              <div
                key={idx}
                className={`gc-card-wrapper ${isCurrent ? 'gc-active-card' : 'gc-side-card'}`}
                style={{
                  transform: `translate3d(${translateX}px, 0, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  transition: isDragging ? 'none' : 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease',
                }}
                onClick={() => {
                  if (!isCurrent) goTo(idx)
                }}
              >
                <div
                  className="gc-card"
                  style={{
                    borderColor: isCurrent ? `${cardColorA}66` : 'rgba(255, 255, 255, 0.08)',
                    boxShadow: isCurrent
                      ? `0 24px 60px rgba(0, 0, 0, 0.65), 0 0 42px ${cardColorA}38, 0 0 1px ${cardColorA}`
                      : '0 16px 36px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  {/* Glowing dynamic top stripe */}
                  <div
                    className="gc-card-stripe"
                    style={{
                      background: `linear-gradient(90deg, ${cardColorA}, ${cardColorB})`,
                    }}
                  />

                  {/* Image container */}
                  <div className="gc-card-media">
                    <img
                      src={item.image}
                      alt={`${item.title} — ${item.issuer}`}
                      loading="lazy"
                    />
                    <div className="gc-card-overlay">
                      <a
                        href={item.link}
                        className="gc-download-btn"
                        download
                        onClick={e => e.stopPropagation()}
                        style={{
                          background: `linear-gradient(135deg, ${cardColorA}, ${cardColorB})`,
                        }}
                      >
                        <i className="fas fa-download" /> Download Certificate
                      </a>
                    </div>
                    {/* Badge */}
                    <span
                      className="gc-card-badge"
                      style={{
                        background: `${cardColorA}22`,
                        borderColor: `${cardColorA}55`,
                        color: '#FFFFFF',
                      }}
                    >
                      {item.badge}
                    </span>
                  </div>

                  {/* Info footer */}
                  <div className="gc-card-info">
                    <div className="gc-card-issuer-row">
                      <span className="gc-card-issuer">
                        <i className="fas fa-award" style={{ color: cardColorA }} /> {item.issuer}
                      </span>
                      <span className="gc-card-date">
                        <i className="fas fa-calendar-alt" /> {item.date}
                      </span>
                    </div>
                    <h3 className="gc-card-title">{item.title}</h3>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Navigation Buttons ── */}
      <button
        className="gc-nav-btn gc-nav-prev"
        onClick={prev}
        aria-label="Previous certificate"
        type="button"
        style={{
          boxShadow: `0 0 20px ${activePrimary}22`,
        }}
      >
        <i className="fas fa-chevron-left" />
      </button>

      <button
        className="gc-nav-btn gc-nav-next"
        onClick={next}
        aria-label="Next certificate"
        type="button"
        style={{
          boxShadow: `0 0 20px ${activePrimary}22`,
        }}
      >
        <i className="fas fa-chevron-right" />
      </button>

      {/* ── Bottom Controls: Counter, Dots, Progress ── */}
      <div className="gc-controls-bar">
        {/* Dots pagination */}
        <div className="gc-dots-container" role="tablist" aria-label="Certificate navigation">
          {items.map((item, i) => {
            const isDotActive = i === activeIdx
            return (
              <button
                key={i}
                type="button"
                className={`gc-dot ${isDotActive ? 'gc-dot-active' : ''}`}
                onClick={() => goTo(i)}
                role="tab"
                aria-selected={isDotActive}
                aria-label={`Go to certificate ${i + 1}: ${item.title}`}
                style={{
                  background: isDotActive ? activePrimary : 'rgba(255, 255, 255, 0.22)',
                  boxShadow: isDotActive ? `0 0 10px ${activePrimary}` : 'none',
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
})
