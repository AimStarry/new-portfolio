import React, { useEffect, useRef, useState, useCallback } from 'react'
import type { Project } from '../pages/Projects'
import './ProjectDetailModal.css'

interface ProjectDetailModalProps {
  project: Project
  allProjects: Project[]
  onClose: () => void
  onSelectProject: (p: Project) => void
}

export default function ProjectDetailModal({
  project,
  allProjects,
  onClose,
  onSelectProject,
}: ProjectDetailModalProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const [lightboxImg, setLightboxImg] = useState<string | null>(null)

  // Find index in overall project list for prev/next project navigation
  const currentIndex = allProjects.findIndex(p => p.id === project.id)
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : allProjects[allProjects.length - 1]
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : allProjects[0]

  // Prevent background scroll while modal is active
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [])

  // Reset scroll to slide 0 when project changes
  useEffect(() => {
    setActiveSlide(0)
    if (trackRef.current) {
      trackRef.current.scrollTo({ left: 0, behavior: 'instant' })
    }
  }, [project.id])

  // Track active slide index via precise card position relative to overlay
  const handleScroll = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const cards = track.querySelectorAll<HTMLElement>('.editorial-3d-card')
    if (cards.length > 0) {
      // Resting position for active card: aligned just past the left overlay
      const overlayWidth = window.innerWidth < 1024 ? 20 : Math.min(460, Math.max(360, window.innerWidth * 0.31))
      const targetFocusX = track.getBoundingClientRect().left + overlayWidth + 60
      let closestIndex = 0
      let minDiff = Infinity
      cards.forEach((card, i) => {
        const diff = Math.abs(card.getBoundingClientRect().left - targetFocusX)
        if (diff < minDiff) {
          minDiff = diff
          closestIndex = i
        }
      })
      setActiveSlide(closestIndex)
    }
  }, [])

  // Mouse wheel: map vertical wheel to smooth horizontal slide scrolling
  const handleWheel = useCallback((e: React.WheelEvent) => {
    const track = trackRef.current
    if (!track) return
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      track.scrollBy({ left: e.deltaY * 1.3, behavior: 'auto' })
    }
  }, [])

  // Navigate to slide index with clean start alignment
  const goToSlide = (index: number) => {
    const track = trackRef.current
    if (!track) return
    if (index === 0) {
      track.scrollTo({ left: 0, behavior: 'smooth' })
      setActiveSlide(0)
      return
    }
    const cards = track.querySelectorAll<HTMLElement>('.editorial-3d-card')
    if (cards[index]) {
      cards[index].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
      setActiveSlide(index)
    }
  }

  const scrollPrev = () => {
    goToSlide(Math.max(0, activeSlide - 1))
  }

  const scrollNext = () => {
    goToSlide(Math.min(totalSlides - 1, activeSlide + 1))
  }

  // Keyboard navigation: Escape closes, Arrow Left/Right advances slides
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxImg) {
        if (e.key === 'Escape') setLightboxImg(null)
        return
      }

      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowRight') {
        scrollNext()
      } else if (e.key === 'ArrowLeft') {
        scrollPrev()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxImg, activeSlide, onClose])

  // Derive metrics if not explicitly specified
  const metricsList = project.metrics || [
    `Full-Stack • ${project.category}`,
    `Engineered with ${project.tools[0]} & ${project.tools[1] || 'Modern Web'}`,
    'Production Architecture & Scalable Code',
    'Interactive UI / High-Performance UX',
  ]

  // Total slides in the 3D stage
  const totalSlides = 4

  return (
    <div
      className="editorial-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      onClick={e => {
        // Close if clicked directly on the dark backdrop outside cards
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* ── TOP EDITORIAL HEADER BAR ───────────────────────── */}
      <header className="editorial-modal-header">
        <div className="editorial-modal-meta-left">
          <span className="editorial-project-counter">
            PROJECT {String(currentIndex + 1).padStart(2, '0')} / {String(allProjects.length).padStart(2, '0')}
          </span>
          <span className="editorial-category-pill">{project.category}</span>
        </div>

        {/* Project Switcher: Prev & Next */}
        <div className="editorial-project-switcher">
          <button
            type="button"
            className="editorial-switcher-btn"
            onClick={() => onSelectProject(prevProject)}
            title={`Previous Project: ${prevProject.name}`}
          >
            <i className="fas fa-chevron-left" />
            <span className="switcher-label">Prev</span>
          </button>
          <span className="switcher-separator">/</span>
          <button
            type="button"
            className="editorial-switcher-btn"
            onClick={() => onSelectProject(nextProject)}
            title={`Next Project: ${nextProject.name}`}
          >
            <span className="switcher-label">Next</span>
            <i className="fas fa-chevron-right" />
          </button>
        </div>

        {/* Floating Circular Close Button */}
        <button
          type="button"
          className="editorial-modal-close"
          onClick={onClose}
          aria-label="Close project details"
          title="Close (Esc)"
        >
          <span className="close-x">✕</span>
        </button>
      </header>

      {/* ── MAIN SPLIT BODY: STATIC LEFT OVERLAY + RIGHT 3D STAGE ─── */}
      <div className="editorial-modal-body" onWheel={handleWheel}>
        {/* ── LEFT PANEL: STATIC OVERLAY HUD OVER 3D CARDS ── */}
        <aside className="editorial-static-panel" aria-label="Project information">
          <div className="static-panel-inner">
            <div className="static-eyebrow">
              <span className="static-date-tag">01 · 2024</span>
              {project.demoUrl && (
                <span className="static-live-pill">
                  <span className="static-live-dot" /> LIVE DEPLOYMENT
                </span>
              )}
            </div>

            <h2 id="modal-project-title" className="static-project-title">
              {project.name}
            </h2>

            <p className="static-project-role">
              {project.role}
            </p>

            <p className="static-project-desc">
              {project.shortDesc}
            </p>

            {/* Dynamic Active Slide Indicator Line */}
            <div className="static-slide-indicator">
              <span className="indicator-num">0{activeSlide + 1} / 0{totalSlides}</span>
              <div className="indicator-track">
                <div
                  className="indicator-fill"
                  style={{ width: `${((activeSlide + 1) / totalSlides) * 100}%` }}
                />
              </div>
            </div>

            {/* Specification Meta Grid */}
            <div className="static-spec-grid">
              <div className="static-spec-row">
                <span className="spec-label">TYPE</span>
                <span className="spec-val">{project.category}</span>
              </div>
              <div className="static-spec-row">
                <span className="spec-label">STACK</span>
                <span className="spec-val">{project.tools.slice(0, 4).join(' · ')}</span>
              </div>
              <div className="static-spec-row">
                <span className="spec-label">TAGS</span>
                <span className="spec-val">{project.tools.slice(0, 3).join(' • ')}</span>
              </div>
            </div>

            {/* Direct Action Links */}
            <div className="static-actions-row">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="static-btn static-btn-primary"
                >
                  <i className="fas fa-external-link-alt" /> Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="static-btn static-btn-secondary"
                >
                  <i className="fab fa-github" /> Source
                </a>
              )}
              {project.demoVideoUrl && (
                <button
                  type="button"
                  className="static-btn static-btn-secondary"
                  onClick={() => goToSlide(2)}
                >
                  <i className="fas fa-play" /> Video
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* ── RIGHT TRACK: 3D HORIZONTAL STAGE ("PULLING FROM SIDE") ──── */}
        <main
          ref={trackRef}
          className="editorial-3d-stage"
          onScroll={handleScroll}
          onWheel={handleWheel}
        >
          {/* ══════════════════════════════════════════════════════
              CARD 1: 3D HERO ARTBOARD MOCKUP
              ══════════════════════════════════════════════════════ */}
          <section
            className={`editorial-3d-card hero-3d-card ${activeSlide === 0 ? 'is-active-card' : ''}`}
            onClick={() => setLightboxImg(project.thumbnail)}
            title="Click to expand hero image"
          >
            <div className="hero-3d-media-wrap">
              <img
                src={project.thumbnail}
                alt={`${project.name} primary hero`}
                className="hero-3d-img"
              />
              <div className="hero-3d-reflection" />
              <div className="hero-3d-badge">
                <span className="h3b-index">01</span>
                <span className="h3b-title">HERO SHOWCASE</span>
              </div>
              <div className="hero-3d-zoom-hint">
                <i className="fas fa-search-plus" /> Expand View
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════
              CARD 2: 3D ARCHITECTURE & METRIC CARDS (225+ / 36 style)
              ══════════════════════════════════════════════════════ */}
          <section className={`editorial-3d-card metrics-3d-card ${activeSlide === 1 ? 'is-active-card' : ''}`}>
            <div className="card-3d-split-layout">
              {/* Left Column: Metric Cards & Problem narrative */}
              <div className="c3d-left">
                <div className="metric-tiles-grid">
                  {metricsList.slice(0, 4).map((metric, mi) => (
                    <div key={mi} className="metric-tile">
                      <span className="metric-tile-index">0{mi + 1}</span>
                      <p className="metric-tile-label">{metric}</p>
                    </div>
                  ))}
                </div>

                <div className="c3d-narrative-block">
                  <span className="c3d-eyebrow">SYSTEM ARCHITECTURE</span>
                  <h3 className="c3d-title">Technical Strategy &amp; Problem Solved</h3>
                  <p className="c3d-desc">
                    {project.fullDescription}
                  </p>
                </div>
              </div>

              {/* Right Column: Secondary Screenshot */}
              <div className="c3d-right">
                {(() => {
                  const archImg = project.screenshots?.[1] || project.screenshots?.[0] || project.thumbnail
                  return (
                    <div
                      className="c3d-media-frame"
                      onClick={() => setLightboxImg(archImg)}
                      title="Click to zoom image"
                    >
                      <img
                        src={archImg}
                        alt={`${project.name} architecture view`}
                        className="c3d-frame-img"
                      />
                      <div className="c3d-frame-overlay">
                        <span>Architecture &amp; Data Schema</span>
                        <i className="fas fa-expand-alt" />
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════
              CARD 3: 3D SYSTEM GALLERY & VIDEO WALKTHROUGH
              ══════════════════════════════════════════════════════ */}
          <section className={`editorial-3d-card gallery-3d-card ${activeSlide === 2 ? 'is-active-card' : ''}`}>
            <div className="c3d-gallery-inner">
              <div className="c3d-gallery-header">
                <div>
                  <span className="c3d-eyebrow">VISUAL WORKFLOWS</span>
                  <h3 className="c3d-title">Interface Gallery &amp; Walkthrough</h3>
                </div>
                <span className="c3d-index-tag">03 / 04</span>
              </div>

              {project.demoVideoUrl ? (
                <div className="c3d-video-container">
                  <video
                    controls
                    className="c3d-video-player"
                    src={project.demoVideoUrl}
                  >
                    Your browser does not support the video tag.
                  </video>
                  <p className="c3d-video-label">
                    <i className="fas fa-play-circle" /> Interactive recorded workflow demonstration
                  </p>
                </div>
              ) : (
                <div className="c3d-screens-grid">
                  {(project.screenshots.length > 1
                    ? project.screenshots
                    : [project.thumbnail, project.screenshots[0] || project.thumbnail]
                  ).slice(0, 2).map((img, si) => (
                    <div
                      key={si}
                      className="c3d-screen-tile"
                      onClick={() => setLightboxImg(img)}
                      title="Click to zoom screenshot"
                    >
                      <img
                        src={img}
                        alt={`${project.name} screenshot ${si + 1}`}
                        className="c3d-screen-img"
                      />
                      <div className="c3d-screen-hover">
                        <span>Workflow Screen {si + 1}</span>
                        <i className="fas fa-search-plus" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════
              CARD 4: 3D ENGINEERING CONTRIBUTIONS & LAUNCHPAD
              ══════════════════════════════════════════════════════ */}
          <section className={`editorial-3d-card contrib-3d-card ${activeSlide === 3 ? 'is-active-card' : ''}`}>
            <div className="card-3d-split-layout">
              {/* Left Column: Contributions list */}
              <div className="c3d-left">
                <span className="c3d-eyebrow">ENGINEERING OWNERSHIP</span>
                <h3 className="c3d-title">Key Technical Contributions</h3>

                <ul className="c3d-contrib-list">
                  {project.contributions.map((item, ci) => (
                    <li key={ci} className="c3d-contrib-item">
                      <span className="c3d-contrib-check">
                        <i className="fas fa-check" />
                      </span>
                      <span className="c3d-contrib-text">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right Column: Stack & Action Launchpad */}
              <div className="c3d-right c3d-launchpad-col">
                <div className="c3d-panel-box">
                  <h4 className="c3d-panel-title">Technology Stack</h4>
                  <div className="c3d-chips-wrap">
                    {project.tools.map((t, ti) => (
                      <span key={ti} className="c3d-chip">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="c3d-panel-box">
                  <h4 className="c3d-panel-title">Explore Project</h4>
                  <div className="c3d-action-stack">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="c3d-btn c3d-btn-primary"
                      >
                        <i className="fas fa-external-link-alt" />
                        <span>Launch Live Demo</span>
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="c3d-btn c3d-btn-secondary"
                      >
                        <i className="fab fa-github" />
                        <span>View Source Code</span>
                      </a>
                    )}
                    <button
                      type="button"
                      className="c3d-btn c3d-btn-back"
                      onClick={onClose}
                    >
                      <i className="fas fa-times" />
                      <span>Back to Projects</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* ── BOTTOM PAGINATION & INSTRUCTION BAR ─────────────── */}
      <footer className="editorial-modal-footer">
        <div className="footer-controls">
          <button
            type="button"
            className="footer-nav-btn"
            onClick={scrollPrev}
            disabled={activeSlide === 0}
            aria-label="Previous slide"
            title="Previous Slide"
          >
            <i className="fas fa-chevron-left" />
          </button>

          <div className="footer-dots">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                type="button"
                className={`footer-dot-pill ${activeSlide === i ? 'active' : ''}`}
                onClick={() => goToSlide(i)}
                aria-label={`Jump to slide ${i + 1}`}
              >
                <span className="dot-index">0{i + 1}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="footer-nav-btn"
            onClick={scrollNext}
            disabled={activeSlide === totalSlides - 1}
            aria-label="Next slide"
            title="Next Slide"
          >
            <i className="fas fa-chevron-right" />
          </button>
        </div>

        <div className="footer-hint">
          <i className="fas fa-arrows-alt-h" />
          <span>Scroll horizontally or use arrow keys ← → to explore</span>
        </div>
      </footer>

      {/* ── EXPANDED LIGHTBOX ZOOM VIEW ─────────────────────── */}
      {lightboxImg && (
        <div
          className="editorial-lightbox-overlay"
          onClick={() => setLightboxImg(null)}
          role="dialog"
          aria-label="Expanded Image"
        >
          <button
            type="button"
            className="lightbox-close-btn"
            onClick={() => setLightboxImg(null)}
          >
            ✕
          </button>
          <img
            src={lightboxImg}
            alt="Expanded view"
            className="lightbox-img"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
