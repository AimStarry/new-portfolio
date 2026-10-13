import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SideScrollIndicator } from '../components/SideScrollIndicator'
import './Projects.css'

export interface Project {
  id: number
  name: string
  category: string
  shortDesc: string
  fullDescription: string
  role: string
  contributions: string[]
  tools: string[]
  thumbnail: string
  screenshots: string[]
  demoVideoUrl: string | null
  demoUrl: string | null
  githubUrl: string | null
  hasCaseStudy: boolean
  isFeatured?: boolean
  bentoSpan?: 'wide' | 'tall' | 'standard'
  metrics?: string[]
}

export const projectList: Project[] = [
  {
    id: 8,
    name: 'Accreditation Management Portal',
    category: 'Full-Stack Web',
    shortDesc: 'A mission-critical university portal tracking real-time compliance across PAASCU, AUN-QA, CHED, and PACUCOA accrediting bodies.',
    fullDescription: 'Built during my internship at the Office of Institutional Effectiveness (Holy Angel University), this accreditation management portal is used university-wide to track compliance across multiple accrediting bodies including PAASCU, AUN-QA, CHED, and PACUCOA. It provides role-based access for QA Admins, Deans, and Heads of Units with dedicated modules for evidence repositories, compliance records, risk monitoring, and program-accreditor matrices.',
    role: 'Web Developer Intern & Database Architect',
    hasCaseStudy: true,
    isFeatured: true,
    metrics: [
      '4 Accrediting Bodies (PAASCU, AUN-QA, CHED, PACUCOA)',
      'University-Wide Institutional Rollout',
      'Normalized Relational MySQL Schemas',
      'Granular Role-Based Access Control (RBAC)'
    ],
    contributions: [
      'Built an accreditation management portal used university-wide, tracking compliance across multiple accrediting bodies including PAASCU, AUN-QA, CHED, and PACUCOA.',
      'Developed compliance record, evidence repository, risk monitoring, and program-accreditor matrix modules, giving QA Admin, Dean, and Head of Unit users role-based views of accreditation status.',
      'Designed and normalized the relational MySQL database schemas ensuring high integrity across complex institutional accreditation workflows.',
      'Implemented role-based access control (RBAC) and security clearances tailored to institutional quality assurance procedures.'
    ],
    tools: ['Laravel', 'MySQL', 'PHP', 'HTML', 'CSS', 'JavaScript'],
    thumbnail: '/assets/accreditation-portal-main.png',
    screenshots: ['/assets/accreditation-portal-main.png'],
    demoVideoUrl: null,
    demoUrl: null,
    githubUrl: null
  },
  {
    id: 1,
    name: 'Bibliosage',
    category: 'Full-Stack Web',
    shortDesc: 'An E-Library Management System built with a relational MySQL schema, inventory tracking, and administrative dashboards.',
    fullDescription: 'Bibliosage is an E-Library Management System designed to handle complex relational data. It features inventory tracking, user lending history, and administrative dashboards built with PHP and MySQL.',
    role: 'Backend Developer & Database Designer',
    hasCaseStudy: true,
    bentoSpan: 'wide',
    contributions: [
      'Designed and implemented the relational MySQL database schema with normalized tables',
      'Built the full PHP backend with CRUD operations for books, users, and borrow records',
      'Developed the administrative dashboard with server-side real-time inventory statistics',
      'Implemented user authentication, session management, and role-based access control'
    ],
    tools: ['PHP', 'MySQL', 'HTML', 'CSS'],
    thumbnail: '/assets/project1-main.png',
    screenshots: ['/assets/p1-ss1.png', '/assets/p1-ss2.png'],
    demoVideoUrl: null,
    demoUrl: 'https://bibliosage.free.nf',
    githubUrl: 'https://github.com/AimStarry/Bibliosage'
  },
  {
    id: 2,
    name: 'QuickCook',
    category: 'Web Application',
    shortDesc: 'An interactive culinary discovery application with dynamic keyword search, recipe filtering, and responsive UI/UX.',
    fullDescription: 'QuickCook is a modern, responsive web application designed to help users find and explore culinary recipes with ease. The project focuses on high-performance UI/UX, featuring a clean aesthetic, intuitive navigation, and a mobile-first design approach.',
    role: 'Frontend Developer',
    hasCaseStudy: false,
    bentoSpan: 'standard',
    contributions: [
      'Designed the full UI/UX from wireframe sketches to pixel-perfect production layout',
      'Built dynamic recipe filtering and keyword search using vanilla JavaScript',
      'Implemented a fully mobile-responsive layout using a mobile-first CSS strategy',
      'Deployed and configured the application on GitHub Pages with a custom workflow'
    ],
    tools: ['HTML', 'CSS', 'JavaScript', 'GitHub Pages'],
    thumbnail: '/assets/project2-main.png',
    screenshots: ['/assets/p2-ss1.png', '/assets/p2-ss2.png'],
    demoVideoUrl: null,
    demoUrl: 'https://aimstarry.github.io/QuickCook/',
    githubUrl: 'https://github.com/AimStarry/QuickCook'
  },
  {
    id: 4,
    name: 'Finance Tracker',
    category: 'Full-Stack Web',
    shortDesc: 'Financial management application with dynamic chart visualizations, budget analytics, and PostgreSQL database.',
    fullDescription: 'Finance Tracker is a full-stack web application designed to help users manage their finances effectively. It features a responsive design, seamless user experience, and robust backend functionality to support financial tracking and budget visualization.',
    role: 'Full-Stack Developer',
    hasCaseStudy: true,
    bentoSpan: 'standard',
    contributions: [
      'Designed and built the Angular frontend with dynamic charts and budget visualizations',
      'Developed a Node.js/Express REST API for transaction creation and budget management',
      'Modeled and managed the PostgreSQL relational database schema for financial records',
      'Deployed the full application to Vercel with environment-based configuration'
    ],
    tools: ['PostgreSQL', 'Angular', 'Express', 'Node.js'],
    thumbnail: '/assets/project4-main.png',
    screenshots: ['/assets/p4-ss1.png', '/assets/p4-ss2.png'],
    demoVideoUrl: null,
    demoUrl: 'https://finance-tracker-pearl-mu.vercel.app/',
    githubUrl: 'https://github.com/AimStarry/finance-tracker'
  },
  {
    id: 6,
    name: 'AningKabalen',
    category: 'Full-Stack Web',
    shortDesc: 'A real-time digital agricultural marketplace connecting local farmers directly with HORECA restaurant buyers.',
    fullDescription: 'AningKabalen is a full-stack, real-time digital marketplace designed to eliminate predatory middlemen and connect local farmers in Pampanga directly with HORECA (Hotel, Restaurant, Catering) buyers. Built on a reactive Angular frontend and a robust Node.js/Express backend.',
    role: 'Systems Analyst & Database Designer',
    hasCaseStudy: true,
    bentoSpan: 'wide',
    contributions: [
      'Spearheaded the initial system proposal and feature roadmap, defining the marketplace mechanics and structural business requirements.',
      'Designed and implemented the core database layer to handle secure, real-time product inventories and vendor transactions.',
      'Contributed directly to frontend development, utilizing Angular to translate wireframes into interactive, user-facing client application layouts.'
    ],
    tools: ['Node.js', 'Express.js', 'Angular', 'MongoDB'],
    thumbnail: '/assets/p6-main.png',
    screenshots: ['/assets/p6-ss1.png', '/assets/p6-ss2.png'],
    demoVideoUrl: null,
    demoUrl: 'https://aningkabalen.site/',
    githubUrl: 'https://github.com/AimStarry/AningKabalen'
  },
  {
    id: 3,
    name: 'Shoporia',
    category: 'Full-Stack Web',
    shortDesc: 'A responsive e-commerce storefront with product discovery, cart workflows, and MongoDB document schemas.',
    fullDescription: 'Shoporia is a full-stack e-commerce application built with modern web technologies. It features a responsive design, seamless user experience, and robust backend functionality to support online shopping.',
    role: 'UI/UX Designer & Database Designer',
    hasCaseStudy: false,
    bentoSpan: 'standard',
    contributions: [
      'Designed the full UI/UX in Figma and implemented it as a Vue.js component-based frontend',
      'Defined the MongoDB document schema for products, users, orders, and transactions',
      'Crafted the responsive storefront layout, product cards, and checkout page UI',
      'Ensured data integrity through schema validation rules and structured document design'
    ],
    tools: ['HTML', 'CSS', 'Vue.js', 'Node.js', 'MongoDB'],
    thumbnail: '/assets/project3-main.png',
    screenshots: ['/assets/p3-ss1.png', '/assets/p3-ss2.png'],
    demoVideoUrl: null,
    demoUrl: 'https://shoporiafrontend.vercel.app',
    githubUrl: 'https://github.com/AimStarry/Shoporia'
  },
  {
    id: 5,
    name: 'Multi-Vendor Inventory System',
    category: 'Full-Stack Web',
    shortDesc: 'Enterprise-ready inventory and supplier management CLI system engineered in Python and PostgreSQL.',
    fullDescription: 'A robust, enterprise-ready inventory management system built with Python and PostgreSQL. This application provides a comprehensive solution for tracking products, managing vendor relationships, and generating business-critical reports.',
    role: 'Backend Developer',
    hasCaseStudy: false,
    bentoSpan: 'standard',
    contributions: [
      'Designed the full PostgreSQL schema for multi-vendor product and supplier relationships',
      'Built the Python CLI application using the Rich library for a polished terminal UI',
      'Implemented low-stock alerts, vendor filtering, and CSV export functionality',
      'Wrote the complete data access layer using parameterized queries to prevent SQL injection'
    ],
    tools: ['Python', 'PostgreSQL', 'Rich Library', 'CSV Export'],
    thumbnail: '/assets/project5-main.png',
    screenshots: ['/assets/p5-ss1.png', '/assets/p5-ss2.png'],
    demoVideoUrl: '/assets/project5-vid.mp4',
    demoUrl: null,
    githubUrl: 'https://github.com/AimStarry/Inventory-System-Python'
  },
  {
    id: 7,
    name: 'Bossrich Photography',
    category: 'Web Design & SEO',
    shortDesc: 'A responsive portfolio and client website built with WordPress, on-page SEO architecture, and content marketing.',
    fullDescription: 'Bossrich Photography is a static responsive website engineered to maximize search engine visibility and user engagement for a local photography studio. Built with WordPress, the platform focuses heavily on on-page SEO architecture, visual hierarchy, and localized content marketing strategies.',
    role: 'UI/UX Designer & SEO Specialist',
    hasCaseStudy: false,
    bentoSpan: 'standard',
    contributions: [
      'Spearheaded the UI/UX design layout, focusing on visual hierarchy, cross-device responsiveness, and a friction-free user portfolio experience.',
      'Conducted comprehensive keyword research and implemented strategic keyword stuffing, meta titles, alt text, and meta descriptions across core pages.',
      'Authored optimized blog content architectures designed to capture localized organic search intent and improve domain authority.',
      'Configured technical on-page SEO settings, sitemaps, and indexing properties to enhance visibility under search engine analytics frameworks.'
    ],
    tools: ['WordPress', 'SEO Tools', 'Google Analytics'],
    thumbnail: '/assets/project7-main.png',
    screenshots: ['/assets/p7-ss1.png', '/assets/p7-ss2.png'],
    demoVideoUrl: null,
    demoUrl: 'https://bossrichphoto.pro',
    githubUrl: null
  },
]

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams()
  const projectIdParam = searchParams.get('id')
  const selected = projectList.find(p => String(p.id) === projectIdParam) || null
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [activeFilter, setActiveFilter] = useState('All')
  const [lightboxImg, setLightboxImg] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  const categories = ['Full-Stack Web', 'Web Application', 'Web Design & SEO']
  const featuredProject = projectList.find(p => p.id === 8)!
  const showFeatured = activeFilter === 'All' || activeFilter === featuredProject.category

  // Bento projects: All projects except the featured one, matching current filter
  const bentoProjects = useMemo(() => {
    const list = projectList.filter(p => {
      if (p.id === 8) return false
      if (activeFilter === 'All') return true
      return p.category === activeFilter
    })

    // When filtering by Full-Stack Web, maintain criss-cross layout between wide and standard cards
    if (activeFilter === 'Full-Stack Web') {
      const bib = list.find(p => p.id === 1)
      const fin = list.find(p => p.id === 4)
      const shop = list.find(p => p.id === 3)
      const aning = list.find(p => p.id === 6)
      const multi = list.find(p => p.id === 5)
      return [bib, fin, shop, aning, multi].filter(Boolean) as Project[]
    }

    return list
  }, [activeFilter])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }, [])

  const initScrollAnimations = useCallback(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active') })
    }, { threshold: 0.08 })
    const els = sectionRef.current?.querySelectorAll('.reveal, .bento-card, .featured-showcase-card, .center-title')
    els?.forEach(el => observer.observe(el))
  }, [])

  useEffect(() => { initScrollAnimations() }, [initScrollAnimations, activeFilter, selected])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.5 + 0.3, alpha: Math.random() * 0.35 + 0.05
    }))
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2)
        ctx.fillStyle = `rgba(16,185,129,${p.alpha})`; ctx.fill()
      })
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx*dx + dy*dy)
          if (dist < 110) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(16,185,129,${0.05 * (1 - dist / 110)})`; ctx.lineWidth = 0.5; ctx.stroke()
          }
        }
      }
      animRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize) }
  }, [])

  const onCardMouseMove = (e: React.MouseEvent, card: HTMLDivElement) => {
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left, y = e.clientY - rect.top
    const cx = rect.width / 2, cy = rect.height / 2
    const inner = card.querySelector<HTMLElement>('.card-inner')
    if (inner) {
      inner.style.transform = `perspective(1000px) rotateX(${((y - cy) / cy) * -5}deg) rotateY(${((x - cx) / cx) * 5}deg) translateY(-4px)`
      inner.style.transition = 'transform 0.05s ease'
    }
  }

  const onCardMouseLeave = (card: HTMLDivElement) => {
    const inner = card.querySelector<HTMLElement>('.card-inner')
    if (inner) {
      inner.style.transform = ''
      inner.style.transition = 'transform 0.4s cubic-bezier(0.23,1,0.32,1)'
    }
  }

  const selectProject = (p: Project) => {
    if (p.hasCaseStudy) {
      setSearchParams({ id: String(p.id) })
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setTimeout(initScrollAnimations, 100)
    } else if (p.demoUrl) {
      window.open(p.demoUrl, '_blank', 'noreferrer')
    } else if (p.githubUrl) {
      window.open(p.githubUrl, '_blank', 'noreferrer')
    }
  }

  const closeDetails = useCallback(() => {
    setSearchParams({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(initScrollAnimations, 100)
  }, [initScrollAnimations, setSearchParams])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxImg) {
          setLightboxImg(null)
        } else if (selected) {
          closeDetails()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxImg, selected, closeDetails])

  const setFilter = (cat: string) => {
    setActiveFilter(cat)
    setTimeout(initScrollAnimations, 50)
  }

  return (
    <section className="projects-wrapper" ref={sectionRef} onMouseMove={onMouseMove}>
      <div className="cursor-spotlight" style={{ left: mousePos.x, top: mousePos.y }} />
      <canvas className="particle-canvas" ref={canvasRef} />
      <div className="bg-grid-projects" /><div className="noise-overlay" /><div className="mesh-gradient" />
      <div className="bg-decor blur-1" /><div className="bg-decor blur-2" /><div className="bg-decor blur-3" />
      <div className="page-number-deco">03</div>

      {/* ═══════════════════════════════════════════════════
          GALLERY VIEW (SHOWCASE + BENTO GRID)
          ═══════════════════════════════════════════════════ */}
      {!selected && (
        <div className="gallery-view">
          {/* Eyebrow & Page Header */}
          <div className="section-eyebrow reveal">
            <span className="eyebrow-line" /><span className="eyebrow-text">Portfolio</span><span className="eyebrow-line" />
          </div>

          <div className="header-group reveal">
            <h2 className="center-title">Featured <span>Work</span></h2>
            <p className="subtitle">Turning structured data and complex institutional logic into elegant interfaces</p>

            <div className="stats-bar">
              <div className="stat-item reveal"><span className="stat-num">4th</span><span className="stat-label">Year IT</span></div>
              <div className="stat-divider" />
              <div className="stat-item reveal"><span className="stat-num">{projectList.length}</span><span className="stat-label">Total Projects</span></div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="filter-bar reveal">
            <button className={`filter-btn ${activeFilter === 'All' ? 'active' : ''}`} onClick={() => setFilter('All')}>
              All Projects ({projectList.length})
            </button>
            {categories.map(cat => {
              const count = projectList.filter(p => p.category === cat).length
              return (
                <button
                  key={cat}
                  className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
                  onClick={() => setFilter(cat)}
                >
                  {cat} ({count})
                </button>
              )
            })}
          </div>

          {/* ─────────────────────────────────────────────────
              1. FEATURED SHOWCASE: Accreditation Management Portal
              Larger showcase for the strongest project
              ───────────────────────────────────────────────── */}
          {showFeatured && (
            <div className="featured-showcase-section reveal">
              <div className="featured-section-label">
                <span className="fsl-icon">★</span>
                <span>FLAGSHIP SHOWCASE • HIGHEST IMPACT PROJECT</span>
              </div>

              <div className="featured-showcase-card glass-panel">
                <div className="showcase-glow-backdrop" />

                <div className="showcase-grid">
                  {/* Visual Preview Side */}
                  <div className="showcase-visual" onClick={() => selectProject(featuredProject)}>
                    <div className="showcase-img-wrap">
                      <img
                        src={featuredProject.thumbnail}
                        alt="Accreditation Management Portal Preview"
                        className="showcase-img"
                      />
                      <div className="showcase-img-overlay" />
                    </div>

                    <div className="showcase-visual-badges">
                      <span className="badge-flagship"><span className="badge-dot" /> Live Institutional Deployment</span>
                      <span className="badge-inst"><i className="fas fa-university" /> Holy Angel University</span>
                    </div>

                    <button
                      type="button"
                      className="showcase-hover-hint"
                      onClick={(e) => {
                        e.stopPropagation()
                        selectProject(featuredProject)
                      }}
                    >
                      <i className="fas fa-eye" /> View Details
                    </button>
                  </div>

                  {/* Content & Details Side */}
                  <div className="showcase-details">
                    <div className="showcase-meta-row">
                      <span className="showcase-cat-pill">{featuredProject.category}</span>
                      <span className="showcase-num">PROJECT #08</span>
                    </div>

                    <h3 className="showcase-title">{featuredProject.name}</h3>

                    <p className="showcase-desc">
                      A university-wide compliance automation portal deployed during my internship at Holy Angel University's
                      Office of Institutional Effectiveness, orchestrating accreditation across multiple regulatory bodies.
                    </p>

                    <div className="showcase-role-pill">
                      <i className="fas fa-user-cog" />
                      <span>{featuredProject.role}</span>
                    </div>

                    {/* Metrics / Key highlights */}
                    <div className="showcase-highlights-grid">
                      <div className="highlight-item">
                        <div className="hl-bullet">✦</div>
                        <div className="hl-text"><strong>Multi-Agency Matrices:</strong> Tracks PAASCU, AUN-QA, CHED &amp; PACUCOA compliance</div>
                      </div>
                      <div className="highlight-item">
                        <div className="hl-bullet">✦</div>
                        <div className="hl-text"><strong>Relational Integrity:</strong> Normalized MySQL schemas for cross-departmental records</div>
                      </div>
                      <div className="highlight-item">
                        <div className="hl-bullet">✦</div>
                        <div className="hl-text"><strong>Security &amp; RBAC:</strong> Tailored role clearances for QA Admins, Deans &amp; Unit Heads</div>
                      </div>
                      <div className="highlight-item">
                        <div className="hl-bullet">✦</div>
                        <div className="hl-text"><strong>Digital Evidence Vault:</strong> Centralized compliance repository with risk monitoring</div>
                      </div>
                    </div>

                    {/* Tech Stack Chips */}
                    <div className="showcase-tech-list">
                      {featuredProject.tools.map((t, idx) => (
                        <span key={idx} className="tech-chip">{t}</span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="showcase-actions-bar">
                      <button
                        className="btn-showcase-primary"
                        onClick={() => selectProject(featuredProject)}
                      >
                        <i className="fas fa-eye" /> View Project Details
                        <span className="btn-arrow">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────
              2. ASYMMETRIC BENTO GRID (OTHER PROJECTS)
              Editorial cards with prominent Live Demo & Source Code
              ───────────────────────────────────────────────── */}
          <div className="bento-section-header reveal">
            <h3 className="bento-heading">
              {activeFilter === 'All' ? 'Curated Projects & Applications' : `${activeFilter} Projects`}
            </h3>
            <span className="bento-subtitle">
              Explore live deployments, interactive prototypes, and source repositories
            </span>
          </div>

          <div className="bento-grid">
            {bentoProjects.map((project, i) => (
              <div
                key={project.id}
                className={`bento-card bento-${project.bentoSpan || 'standard'} ${project.hasCaseStudy ? 'is-casestudy' : 'is-direct'}`}
                style={{ transitionDelay: `${i * 0.06}s` }}
                onMouseMove={e => onCardMouseMove(e, e.currentTarget)}
                onMouseLeave={e => onCardMouseLeave(e.currentTarget)}
              >
                <div className="card-inner">
                  {/* Media Banner */}
                  <div
                    className="bento-img-wrap"
                    onClick={() => selectProject(project)}
                  >
                    <img
                      src={project.thumbnail}
                      alt={`${project.name} thumbnail`}
                      loading="lazy"
                      className="bento-img"
                    />
                    <div className="bento-img-gradient" />

                    <div className="bento-top-badges">
                      <span className="bento-cat-tag">{project.category}</span>
                    </div>

                    <div className="bento-status-indicators">
                      {project.demoUrl && (
                        <span className="status-pill live">
                          <span className="live-dot" /> Live
                        </span>
                      )}
                      {project.githubUrl && (
                        <span className="status-pill source">
                          <i className="fab fa-github" /> Repo
                        </span>
                      )}
                      {project.demoVideoUrl && (
                        <span className="status-pill video">
                          <i className="fas fa-play" /> Video
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="bento-content">
                    <div className="bento-title-row">
                      <h4
                        className="bento-title"
                        onClick={() => selectProject(project)}
                      >
                        {project.name}
                      </h4>
                      <span className="bento-index">#{String(project.id).padStart(2, '0')}</span>
                    </div>

                    <p className="bento-desc">{project.shortDesc}</p>

                    <div className="bento-role-chip">
                      <i className="fas fa-user-cog" /> {project.role}
                    </div>

                    <div className="bento-tags-row">
                      {project.tools.slice(0, 4).map((tool, ti) => (
                        <span key={ti} className="bento-tag">{tool}</span>
                      ))}
                      {project.tools.length > 4 && (
                        <span className="bento-tag-more">+{project.tools.length - 4}</span>
                      )}
                    </div>
                  </div>

                  {/* Prominent Action Bar */}
                  <div className="bento-actions-bar">
                    {/* Direct Live Demo button */}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="bento-btn bento-btn-demo"
                        title={`Open live demo for ${project.name}`}
                        onClick={e => e.stopPropagation()}
                      >
                        <i className="fas fa-external-link-alt" />
                        <span>Live Demo</span>
                      </a>
                    )}

                    {/* Direct Source Code button */}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="bento-btn bento-btn-source"
                        title={`View GitHub source code for ${project.name}`}
                        onClick={e => e.stopPropagation()}
                      >
                        <i className="fab fa-github" />
                        <span>Source</span>
                      </a>
                    )}

                    {/* View Details button for projects with details */}
                    {project.hasCaseStudy && (
                      <button
                        type="button"
                        className="bento-btn bento-btn-study"
                        onClick={() => selectProject(project)}
                      >
                        <span>View Details</span>
                        <i className="fas fa-arrow-right" />
                      </button>
                    )}

                    {/* Video preview button if demo video exists */}
                    {!project.hasCaseStudy && project.demoVideoUrl && (
                      <button
                        type="button"
                        className="bento-btn bento-btn-video"
                        onClick={() => {
                          setLightboxImg(null)
                          selectProject(project)
                        }}
                      >
                        <i className="fas fa-play-circle" />
                        <span>Demo Video</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {bentoProjects.length === 0 && !showFeatured && (
            <div className="empty-state">
              <i className="fas fa-search" />
              <p>No projects found in this category.</p>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          IN-DEPTH CASE STUDY VIEW (FOR SUBSTANTIAL PROJECTS)
          ═══════════════════════════════════════════════════ */}
      {selected && (
        <div className="detail-view">
          <div className="navigation-header reveal">
            <button onClick={closeDetails} className="back-link">
              <i className="fas fa-arrow-left" /> Back to All Projects
            </button>
            <span className="detail-breadcrumb">
              <span>Portfolio</span>
              <i className="fas fa-chevron-right" />
              <span>Projects</span>
              <i className="fas fa-chevron-right" />
              <strong className="crumb-active">{selected.name}</strong>
            </span>
          </div>

          <div className="detail-hero reveal">
            <div className="detail-hero-meta">
              <span className="detail-category-tag">{selected.category}</span>
              <span className="detail-study-badge">
                <i className="fas fa-layer-group" /> Project Details &amp; Architecture
              </span>
            </div>
            <h2 className="detail-hero-title">{selected.name}</h2>
            <p className="detail-hero-subtitle">{selected.shortDesc}</p>
          </div>

          <div className="detail-layout">
            {/* Visuals Gallery */}
            <div className="visuals-gallery reveal">
              {selected.demoVideoUrl && (
                <div className="video-container">
                  <div className="media-label"><i className="fas fa-play-circle" /> Walkthrough Demo Video</div>
                  <video controls className="gallery-video" src={selected.demoVideoUrl}>
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {selected.screenshots?.length > 0 && (
                <div className="screenshots-block">
                  <div className="media-label">
                    <i className="fas fa-images" /> System Screenshots &amp; Architecture Diagrams
                    <span className="media-count">{selected.screenshots.length}</span>
                  </div>
                  <div className="screenshots-scroll">
                    {selected.screenshots.map((img, si) => (
                      <div key={si} className="gallery-img-wrapper" onClick={() => setLightboxImg(img)}>
                        <img
                          src={img}
                          className="gallery-img"
                          alt={`${selected.name} screenshot ${si + 1}`}
                        />
                        <span className="zoom-indicator"><i className="fas fa-search-plus" /> Expand</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* In-Depth Information Pane */}
            <div className="info-pane reveal">
              <div className="info-group">
                <h3>The Challenge &amp; Purpose</h3>
                <p>{selected.fullDescription}</p>
              </div>

              <div className="info-group">
                <h3>My Role &amp; Technical Ownership</h3>
                <div className="role-display">
                  <i className="fas fa-user-cog role-icon" />
                  <span>{selected.role}</span>
                </div>
              </div>

              {selected.contributions?.length > 0 && (
                <div className="info-group">
                  <h3>Key Engineering Contributions</h3>
                  <ul className="contributions-list">
                    {selected.contributions.map((item, ci) => (
                      <li key={ci} style={{ animationDelay: `${ci * 0.08}s` }}>
                        <i className="fas fa-check-circle contrib-check" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="info-group">
                <h3>Architecture &amp; Tech Stack</h3>
                <div className="tag-bar">
                  {selected.tools.map((t, ti) => (
                    <span key={ti} className="skill-tag">{t}</span>
                  ))}
                </div>
              </div>

              {/* Action Links */}
              <div className="action-links">
                {selected.demoUrl ? (
                  <a href={selected.demoUrl} target="_blank" rel="noreferrer" className="btn-launch">
                    <i className="fas fa-external-link-alt" /> Launch Live Demo
                    <span className="btn-shine" />
                  </a>
                ) : selected.id === 8 ? (
                  <div className="no-demo-notice">
                    <i className="fas fa-university" />
                    <span>Internal institutional portal deployed across the Holy Angel University network (restricted intranet access).</span>
                  </div>
                ) : (
                  <div className="no-demo-notice">
                    <i className="fas fa-info-circle" />
                    <span>Live demo unavailable due to environment constraints.</span>
                  </div>
                )}

                {selected.githubUrl ? (
                  <a href={selected.githubUrl} target="_blank" rel="noreferrer" className="btn-source">
                    <i className="fab fa-github" /> Inspect Source Code
                  </a>
                ) : selected.id === 8 ? (
                  <div className="no-source-notice">
                    <i className="fas fa-shield-alt" />
                    <span>Source code is confidential under Holy Angel University OIE institutional policy.</span>
                  </div>
                ) : (
                  <div className="no-source-notice">
                    <i className="fas fa-lock" />
                    <span>Source code private due to client/proprietary terms.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox for screenshots and diagrams */}
      {lightboxImg && (
        <div className="lightbox" onClick={() => setLightboxImg(null)}>
          <button className="lightbox-close" onClick={() => setLightboxImg(null)} aria-label="Close image preview">
            <i className="fas fa-times" />
          </button>
          <img src={lightboxImg} className="lightbox-img" onClick={e => e.stopPropagation()} alt="Enlarged screenshot" />
        </div>
      )}

      <SideScrollIndicator />
    </section>
  )
}
