import { useState, useEffect, useRef } from 'react'
import './SideScrollIndicator.css'

interface SideScrollIndicatorProps {
  idleDelay?: number
}

export function SideScrollIndicator({ idleDelay = 850 }: SideScrollIndicatorProps) {
  const [visible, setVisible] = useState(true)
  const [isAtBottom, setIsAtBottom] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const idleTimerRef = useRef<number | null>(null)

  useEffect(() => {
    const updateMetrics = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const currentScroll = window.scrollY
      const progress = scrollHeight > 0 ? Math.min(100, Math.max(0, (currentScroll / scrollHeight) * 100)) : 0
      const atBottom = scrollHeight > 0 && currentScroll >= scrollHeight - 90

      setScrollProgress(progress)
      setIsAtBottom(atBottom)
    }

    const handleScroll = () => {
      // Disappear immediately when user starts scrolling
      setVisible(false)

      if (idleTimerRef.current !== null) {
        window.clearTimeout(idleTimerRef.current)
      }

      // Reappear when scrolling is idle
      idleTimerRef.current = window.setTimeout(() => {
        updateMetrics()
        setVisible(true)
      }, idleDelay)
    }

    updateMetrics()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (idleTimerRef.current !== null) {
        window.clearTimeout(idleTimerRef.current)
      }
    }
  }, [idleDelay])

  const handleClick = () => {
    if (isAtBottom) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      window.scrollBy({ top: window.innerHeight * 0.75, behavior: 'smooth' })
    }
  }

  return (
    <div
      className={`side-scroll-indicator ${visible ? 'is-visible' : 'is-hidden'} ${isAtBottom ? 'at-bottom' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      title={isAtBottom ? 'Back to top' : 'Scroll down'}
      aria-label={isAtBottom ? 'Scroll to top' : 'Scroll down'}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      <div className="ssi-glow-ring" />

      {/* Mouse Icon or Arrow Up */}
      <div className="ssi-icon-wrap">
        {isAtBottom ? (
          <div className="ssi-arrow-up">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 15l-6-6-6 6"/>
            </svg>
          </div>
        ) : (
          <div className="ssi-mouse">
            <div className="ssi-wheel" />
          </div>
        )}
      </div>

      {/* Progress Track */}
      <div className="ssi-track">
        <div
          className="ssi-progress-bar"
          style={{ height: `${scrollProgress}%` }}
        />
      </div>

      {/* Label & Indicator */}
      <div className="ssi-meta">
        <span className="ssi-label">
          {isAtBottom ? 'TOP' : 'SCROLL'}
        </span>
        <div className={`ssi-chevron ${isAtBottom ? 'up' : 'down'}`}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {isAtBottom ? (
              <path d="M18 15l-6-6-6 6"/>
            ) : (
              <path d="M6 9l6 6 6-6"/>
            )}
          </svg>
        </div>
      </div>
    </div>
  )
}
