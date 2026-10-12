import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // Track scroll position for dynamic glass blur
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close nav on route change
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  // Close nav on window resize or Escape key
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992) {
        setOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <>
      <div
        className={`nav-backdrop ${open ? 'active' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <header className={`editorial-nav-header ${scrolled ? 'scrolled' : ''}`}>
        <nav className="editorial-nav" aria-label="Main Navigation">
          <div className="nav-brand-group">
            <NavLink
              to="/home"
              className="nav-brand-link"
              onClick={() => setOpen(false)}
              aria-label="Aimee Pangan Home"
            >
              <img src="/assets/logo.png" alt="Aim Logo" className="nav-brand-logo" />
              <span className="nav-brand-text">AIMEE PANGAN</span>
            </NavLink>
          </div>

          <div className={`nav-menu-links ${open ? 'open' : ''}`}>
            <NavLink
              to="/home"
              className={({ isActive }) => `nav-menu-item ${isActive ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              HOME
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => `nav-menu-item ${isActive ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              ABOUT
            </NavLink>
            <NavLink
              to="/projects"
              className={({ isActive }) => `nav-menu-item ${isActive ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              PROJECTS
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => `nav-menu-item ${isActive ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              CONTACT
            </NavLink>

            {/* Mobile-only resume button inside drawer */}
            <a
              href="/assets/Pangan_Resume.pdf"
              className="nav-resume-pill nav-resume-mobile"
              download="Pangan_Resume.pdf"
              onClick={() => setOpen(false)}
            >
              <span>RESUME</span>
              <i className="fas fa-arrow-down" aria-hidden="true" />
            </a>
          </div>

          <div className="nav-actions-group">
            {/* Desktop-only resume link */}
            <a
              href="/assets/Pangan_Resume.pdf"
              className="nav-resume-pill nav-resume-desktop"
              download="Pangan_Resume.pdf"
            >
              <span>RESUME</span>
              <i className="fas fa-arrow-down" aria-hidden="true" />
            </a>

            {/* Hamburger toggle button for mobile */}
            <button
              type="button"
              className={`nav-toggle-btn ${open ? 'open' : ''}`}
              onClick={() => setOpen(prev => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={open}
            >
              <span className="hamburger-line line-1" />
              <span className="hamburger-line line-2" />
              <span className="hamburger-line line-3" />
            </button>
          </div>
        </nav>
      </header>
    </>
  )
}
