import { useEffect, useRef, useState, useCallback, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuroraBackground } from '../components/AuroraBackground'
import { projectList } from './Projects'
import './Home.css'

// Skill nodes — real tech stack with devicon logos, spread across wider canvas
const NODES = [
  { id: 'python',   label: 'Python',    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',         x: 8,   y: 44 },
  { id: 'laravel',  label: 'Laravel',   logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg',       x: 28,  y: 16 },
  { id: 'mongodb',  label: 'MongoDB',   logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',       x: 28,  y: 70 },
  { id: 'figma',    label: 'Figma',     logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',           x: 54,  y: 16 },
  { id: 'sql',      label: 'PostgreSQL',logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', x: 54,  y: 72 },
  { id: 'nodejs',   label: 'Node.js',   logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',         x: 80,  y: 14 },
  { id: 'react',    label: 'React',     logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',           x: 80,  y: 74 },
  { id: 'core',     label: 'Aimee',     logo: '',                                                                                       x: 114, y: 44, isCore: true },
  { id: 'html',     label: 'HTML5',     logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',           x: 148, y: 14 },
  { id: 'mysql',    label: 'MySQL',     logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',           x: 148, y: 74 },
  { id: 'tailwind', label: 'Tailwind',  logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg', x: 174, y: 18 },
  { id: 'git',      label: 'Git',       logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',               x: 174, y: 68 },
  { id: 'php',      label: 'PHP',       logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',               x: 200, y: 44 },
  { id: 'vue',      label: 'Vue.js',    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',           x: 220, y: 20 },
]
const EDGES = [
  ['core', 'python'],  ['core', 'laravel'],  ['core', 'mongodb'],
  ['core', 'figma'],   ['core', 'sql'],      ['core', 'nodejs'],
  ['core', 'react'],   ['core', 'html'],     ['core', 'mysql'],
  ['core', 'tailwind'],['core', 'git'],      ['core', 'php'],
  ['core', 'vue'],
  ['laravel', 'php'],  ['sql', 'mysql'],     ['react', 'html'],
  ['nodejs', 'laravel'],['figma', 'tailwind'],['python', 'mongodb'],
  ['tailwind', 'vue'],
]

const SkillNetwork = memo(function SkillNetwork() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [tick, setTick] = useState(0)
  const [hovered, setHovered] = useState<string | null>(null)

  // Gentle float animation per node using RAF (auto-pauses when tab inactive)
  useEffect(() => {
    let animId: number
    let lastTime = performance.now()
    const loop = (now: number) => {
      if (now - lastTime >= 50) {
        lastTime = now
        setTick(t => (t + 1) % 10000)
      }
      animId = requestAnimationFrame(loop)
    }
    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [])

  const t = tick * 0.05
  const floatY = (id: string, baseY: number) => {
    const seed = id.charCodeAt(0) * 0.7 + id.charCodeAt(id.length - 1) * 0.3
    return baseY + Math.sin(t + seed) * 1.8
  }
  const floatX = (id: string, baseX: number) => {
    const seed = id.charCodeAt(0) * 0.5
    return baseX + Math.cos(t * 0.6 + seed) * 0.8
  }

  return (
    <svg
      ref={svgRef}
      className="skill-svg"
      viewBox="0 0 228 92"
      preserveAspectRatio="xMidYMid meet"
      aria-label="Skill network diagram"
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-strong" x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Edges — dashed animated lines */}
      {EDGES.map(([a, b], i) => {
        const na = NODES.find(n => n.id === a)!
        const nb = NODES.find(n => n.id === b)!
        const ax = floatX(na.id, na.x), ay = floatY(na.id, na.y)
        const bx = floatX(nb.id, nb.x), by = floatY(nb.id, nb.y)
        const isHot = hovered === a || hovered === b
        return (
          <line
            key={i}
            x1={ax} y1={ay} x2={bx} y2={by}
            stroke={isHot ? 'rgba(52,211,153,0.75)' : 'rgba(16,185,129,0.28)'}
            strokeWidth={isHot ? 0.65 : 0.38}
            strokeDasharray="1.8 1.8"
            strokeDashoffset={-(t * 6)}
            style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
          />
        )
      })}

      {/* Nodes */}
      {NODES.map(node => {
        const nx = floatX(node.id, node.x)
        const ny = floatY(node.id, node.y)
        const isHot = hovered === node.id
        const isCore = node.isCore
        const r = isCore ? 8.5 : 5.8
        const logoSize = r * 1.45
        const clipId = `clip-${node.id}`

        return (
          <g
            key={node.id}
            transform={`translate(${nx}, ${ny})`}
            className="skill-node-g"
            onMouseEnter={() => setHovered(node.id)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: 'pointer' }}
          >
            {/* Clip path for logo */}
            <clipPath id={clipId}>
              <circle r={r - 0.8} />
            </clipPath>

            {/* Pulse ring */}
            {(isCore || isHot) && (
              <circle
                r={isCore ? 12 : 8.8}
                fill="none"
                stroke={isCore ? 'rgba(52,211,153,0.45)' : 'rgba(52,211,153,0.55)'}
                strokeWidth="0.5"
                style={{ animation: 'svgPulse 2s ease-out infinite' }}
              />
            )}

            {/* Node circle bg */}
            <circle
              r={r}
              fill={isCore
                ? 'rgba(16,185,129,0.25)'
                : isHot ? 'rgba(52,211,153,0.15)' : 'rgba(15,14,35,0.92)'}
              stroke={isCore
                ? 'rgba(52,211,153,0.95)'
                : isHot ? 'rgba(52,211,153,0.85)' : 'rgba(16,185,129,0.55)'}
              strokeWidth={isCore ? 0.9 : 0.6}
              filter={isCore ? 'url(#glow-strong)' : isHot ? 'url(#glow)' : undefined}
              style={{ transition: 'all 0.25s ease' }}
            />

            {/* White bg circle behind logo for contrast */}
            {!isCore && (
              <circle r={r - 1.2} fill="rgba(255,255,255,0.10)" clipPath={`url(#${clipId})`} />
            )}

            {/* Logo image or core symbol */}
            {isCore ? (
              <text
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={6.2}
                fill="#34D399"
                style={{ userSelect: 'none', fontFamily: 'system-ui', transition: 'fill 0.25s ease' }}
              >
                ✦
              </text>
            ) : (
              <image
                href={node.logo}
                x={-logoSize / 2}
                y={-logoSize / 2}
                width={logoSize}
                height={logoSize}
                clipPath={`url(#${clipId})`}
                style={{ imageRendering: 'crisp-edges' }}
              />
            )}

            {/* Label below */}
            <text
              y={isCore ? 12.2 : 9.2}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={isCore ? 3.8 : 3.0}
              fill={isCore ? '#34D399' : isHot ? '#6EE7B7' : '#E2E8F0'}
              fontWeight={isCore ? '700' : '600'}
              letterSpacing="0.2"
              style={{ userSelect: 'none', fontFamily: 'Lexend, sans-serif', transition: 'fill 0.25s ease' }}
            >
              {node.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
})

export default function Home() {
  const navigate = useNavigate()
  const spotlightRef = useRef<HTMLDivElement>(null)
  const [counts, setCounts] = useState({ projects: 0, certs: 0 })

  useEffect(() => {
    const targets = { projects: 5, certs: 3 }
    let p = 0, c = 0
    const step = () => {
      p = Math.min(p + 1, targets.projects)
      c = Math.min(c + 1, targets.certs)
      setCounts({ projects: p, certs: c })
      if (p < targets.projects || c < targets.certs) setTimeout(step, 160)
    }
    const t = setTimeout(step, 1200)
    return () => clearTimeout(t)
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (spotlightRef.current) {
      spotlightRef.current.style.left = `${e.clientX}px`
      spotlightRef.current.style.top = `${e.clientY}px`
    }
  }, [])

  const scrollToSkills = () => {
    const el = document.getElementById('skills-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="hero-container" onMouseMove={onMouseMove}>
      <div ref={spotlightRef} className="cursor-spotlight" />

      <AuroraBackground
        color="#10B981"
        speed={0.28}
        frequency={1.4}
        intensity={0.80}
        rotation={38}
        fadeTop={0.80}
        dotSpacing={22}
        dotRadius={0.8}
        cursorRadius={420}
        cursorForce={0.24}
        bulgeStrength={42}
        glowRadius={280}
      />

      <div className="editorial-hero-stage">
        {/* ── Editorial Typographic Lockup ── */}
        <div className="editorial-headline-container">
          <div className="editorial-line-first">
            <h1 className="editorial-word-name">Aimee Li Marael</h1>
          </div>
          <div className="editorial-line-mid">
            <span className="editorial-word-role">web developer</span>
          </div>
          <div className="editorial-line-last">
            <span className="editorial-word-surname">Pangan</span>
          </div>
        </div>

        {/* ── Editorial Bottom Meta Bar ── */}
        <div className="editorial-meta-bar">
          <div className="editorial-meta-col">
            <span className="ed-meta-label">WEB &amp; FULL-STACK / DATABASES &amp; UI/UX</span>
            <span className="ed-meta-sub">TURNING STRUCTURED DATA INTO INTUITIVE SYSTEMS</span>
            <span className="ed-meta-status">
              <span className="ed-status-dot" /> AVAILABLE FOR OPPORTUNITIES
            </span>
          </div>

          <div className="editorial-meta-col">
            <span className="ed-meta-label">BASED IN ANGELES CITY, PH</span>
            <span className="ed-meta-sub">HOLY ANGEL UNIVERSITY • BSIT</span>
          </div>

          <div className="editorial-meta-col ed-col-actions">
            <div className="ed-actions-row">
              <button
                className="ed-btn ed-btn-primary"
                onClick={() => navigate('/projects')}
              >
                <span>View Projects</span>
                <span>→</span>
              </button>
              <button
                className="ed-btn ed-btn-secondary"
                onClick={() => navigate('/contact')}
              >
                <span>Contact</span>
              </button>
            </div>

            <button
              className="ed-scroll-indicator"
              onClick={scrollToSkills}
              type="button"
              aria-label="Scroll to explore tech stack"
            >
              <span className="ed-scroll-shaft" />
              <svg className="ed-scroll-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 19 5 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

        {/* ── Animated skill network ── */}
        <div id="skills-section" className="skill-network-wrapper reveal-text anim-delay-5">
          <p className="network-label">TECH STACK &amp; TOOLS</p>
          <SkillNetwork />
          {/* Quick stats row inside the network area */}
          <div className="quick-stats">
            <div className="quick-stat">
              <div className="stat-top">
                <span className="qs-num">{counts.projects}</span><span className="qs-plus">+</span>
              </div>
              <span className="qs-label">Projects</span>
            </div>
            <div className="qs-divider" />
            <div className="quick-stat">
              <div className="stat-top">
                <span className="qs-num">{counts.certs}</span><span className="qs-plus">+</span>
              </div>
              <span className="qs-label">Certifications</span>
            </div>
          </div>
        </div>

        {/* ── Featured Projects Teaser (2 projects + View All link) ── */}
        <div className="home-featured-section reveal-text anim-delay-5">
          <div className="home-featured-header">
            <span className="home-featured-eyebrow">SELECTED WORKS</span>
            <h2 className="home-featured-title">Featured Highlights</h2>
            <p className="home-featured-sub">Enterprise institutional systems &amp; full-stack applications</p>
          </div>

          <div className="home-featured-grid">
            {projectList.filter(p => p.id === 8 || p.id === 1).map(project => (
              <div
                key={project.id}
                className="home-featured-card"
                onClick={() => navigate(`/projects?id=${project.id}`)}
              >
                <div className="hfc-img-wrap">
                  <img src={project.thumbnail} alt={project.name} loading="lazy" />
                  <div className="hfc-overlay" />
                  <span className="hfc-badge">{project.category}</span>
                  {project.id === 8 && <span className="hfc-inst-tag"><i className="fas fa-university" /> University</span>}
                </div>
                <div className="hfc-content">
                  <div className="hfc-role"><i className="fas fa-user-cog" /> {project.role}</div>
                  <h3 className="hfc-title">{project.name}</h3>
                  <p className="hfc-desc">{project.shortDesc}</p>
                  <div className="hfc-tags">
                    {project.tools.slice(0, 4).map((t, i) => (
                      <span key={i} className="hfc-tag">{t}</span>
                    ))}
                  </div>
                  <div className="hfc-actions">
                    <button
                      type="button"
                      className="hfc-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/projects?id=${project.id}`)
                      }}
                    >
                      <span>View Details</span>
                      <span className="hfc-btn-arrow">→</span>
                    </button>
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="hfc-demo-link"
                        onClick={e => e.stopPropagation()}
                      >
                        <i className="fas fa-external-link-alt" /> Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="home-view-all-wrapper">
            <button
              className="home-view-all-btn"
              onClick={() => navigate('/projects')}
            >
              <span>View All Projects ({projectList.length})</span>
              <span className="btn-arrow">→</span>
            </button>
          </div>
        </div>
    </section>
  )
}
