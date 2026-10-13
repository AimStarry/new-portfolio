import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { GradientCarousel, type CarouselItem } from '../components/GradientCarousel'
import { SideScrollIndicator } from '../components/SideScrollIndicator'
import './About.css'

const technicalDomains = [
  {
    code: 'CORE SPECIALTY // 01',
    title: 'Databases & Architecture',
    isPrimary: true,
    focus: 'Schema Design & Data Integrity',
    problemStatement:
      'Architecting normalized relational schemas, optimizing query indexing, and enforcing strict relational integrity for mission-critical institutional records.',
    skills: ['MySQL', 'PostgreSQL', 'MongoDB', 'Schema Normalization', 'Query Indexing & Optimization', 'Relational Integrity'],
    icon: 'fas fa-database',
  },
  {
    code: 'CORE SPECIALTY // 02',
    title: 'Backend & Server Logic',
    isPrimary: true,
    focus: 'APIs, Business Logic & Security',
    problemStatement:
      'Developing resilient RESTful endpoints, role-based authorization (RBAC), and server-side logic that securely powers complex user workflows.',
    skills: ['PHP', 'Laravel', 'Node.js', 'Python', 'RESTful API Design', 'Role-Based Access Control (RBAC)'],
    icon: 'fas fa-server',
  },
  {
    code: 'CLIENT & INTERFACE // 03',
    title: 'Frontend Engineering',
    isPrimary: false,
    focus: 'Component Architecture & Responsive UI',
    problemStatement:
      'Building modular, state-driven user interfaces with accessible HTML semantics, reactive components, and fluid cross-device performance.',
    skills: ['React', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript (ES6+)', 'Tailwind CSS / CSS3'],
    icon: 'fas fa-code',
  },
  {
    code: 'SYSTEM DESIGN // 04',
    title: 'UI/UX & Design Systems',
    isPrimary: false,
    focus: 'User Flows & Human Ergonomics',
    problemStatement:
      'Crafting intuitive user flow wireframes and high-fidelity Figma prototypes governed by consistent design tokens and ergonomic layouts.',
    skills: ['Figma', 'Interactive Prototyping', 'User Flow Architecture', 'Wireframing', 'Design Tokens'],
    icon: 'fas fa-pen-ruler',
  },
]

const marqueeTools = [
  'VS Code', 'Figma', 'Postman', 'MySQL', 'Laravel', 'React',
  'TypeScript', 'MongoDB', 'Tailwind CSS', 'Node.js', 'Python',
  'Vue.js', 'Angular', 'Git', 'GitHub', 'REST APIs', 'PHP'
]

const trajectorySteps = [
  {
    step: '01',
    horizon: 'Immediate Aspiration',
    title: 'Junior / Entry-Level Developer',
    roleTarget: 'Database & Full-Stack Development',
    description:
      'Apply production internship experience to build robust database schemas, develop clean server-side logic, and craft intuitive frontend interfaces in an engineering team.',
  },
  {
    step: '02',
    horizon: 'Growth Aspiration',
    title: 'Full-Stack & Database Specialist',
    roleTarget: 'Systems & Data Engineering',
    description:
      'Deepen expertise in multi-entity data architectures, query performance tuning, and scalable component systems across enterprise web stacks.',
  },
  {
    step: '03',
    horizon: 'Long-Term Specialization',
    title: 'Enterprise Systems & Data Architect',
    roleTarget: 'Architecture & Technical Leadership',
    description:
      'Bridge high-level data modeling with user-centered engineering — designing resilient, mission-critical architectures that stand the test of scale.',
  },
]

const testimonials = [
  {
    name: 'Marc Canlas',
    role: 'Team Member, Holy Angel University',
    initials: 'MC',
    content:
      'Aimee consistently demonstrates a logical approach to database architecture. Her ability to translate complex data into clean, intuitive interfaces is impressive for a student developer.',
  },
  {
    name: 'Samantha Gonzales',
    role: 'Project Leader, Holy Angel University',
    initials: 'SG',
    content:
      'Working with Aimee was a breeze. She has a keen eye for detail and never settles for "good enough" when it comes to user experience, schema integrity, and clean code quality.',
  },
]

const certifications: CarouselItem[] = [
  { title: 'Google Analytics Certification', issuer: 'Skillshop by Google', date: 'August 27, 2025', image: '/assets/certificates/Skillshop-Google Analytics Certification.png', link: '/assets/certificates/Skillshop-Google Analytics Certification.pdf', tier: 1, badge: 'Industry Standard', colors: ['#F59E0B', '#3B82F6'] },
  { title: 'Cloud Foundations Training', issuer: 'AWS Academy', date: 'August 27, 2025', image: '/assets/certificates/AWS-Cloud Foundations Training Certificate-1.png', link: '/assets/certificates/AWS Cloud Foundations Training Certificate.pdf', tier: 1, badge: 'Cloud', colors: ['#FF9900', '#F59E0B'] },
  { title: 'JavaScript Essentials 1', issuer: 'Cisco', date: 'October 25, 2024', image: '/assets/cert2.png', link: '/assets/certificates/cisco-js.pdf', tier: 1, badge: 'Networking Leader', colors: ['#00BCEB', '#2563EB'] },
  { title: 'Backend Development and APIs V8', issuer: 'freeCodeCamp', date: 'September 27, 2025', image: '/assets/cert1.png', link: '/assets/certificates/fcc-backend-development.pdf', tier: 2, badge: 'Full-Stack', colors: ['#10B981', '#059669'] },
  { title: 'Legacy JavaScript Algorithms and Data Structures V7', issuer: 'freeCodeCamp', date: 'September 30, 2025', image: '/assets/cert3.png', link: '/assets/certificates/fcc-legacy-javascript-algorithms-and-data-structures.pdf', tier: 2, badge: 'Algorithms', colors: ['#8B5CF6', '#10B981'] },
  { title: 'SQL Optimization for Beginners', issuer: 'Simplilearn', date: 'August 27, 2025', image: '/assets/certificates/Simplilearn-SQL Optimization for Beginners-1.png', link: '/assets/certificates/Simplilearn-SQL Optimization for Beginners.pdf', tier: 3, badge: 'Database', colors: ['#0284C7', '#06B6D4'] },
  { title: 'Fundamentals of Database: What is SQL?', issuer: 'Simplilearn', date: 'August 27, 2025', image: '/assets/certificates/Simplilearn-Fundamentals of Database-What is SQL-1.png', link: '/assets/certificates/Simplilearn-Fundamentals of Database-What is SQL.pdf', tier: 3, badge: 'Database', colors: ['#3B82F6', '#10B981'] },
  { title: 'Introduction to Figma Certificate', issuer: 'Simplilearn', date: 'September 23, 2024', image: '/assets/certificates/Simplilearn-Introduction to Figma Certificate-1.png', link: '/assets/certificates/Simplilearn-Introduction to Figma Certificate.pdf', tier: 3, badge: 'Design', colors: ['#EC4899', '#A855F7'] },
  { title: 'Introduction to Graphic Design; Basics of UI/UX Design', issuer: 'Simplilearn', date: 'August 27, 2025', image: '/assets/certificates/Simplilearn-Introduction to Graphic Design-Basics of UIUX-1.png', link: '/assets/certificates/Simplilearn-Introduction to Graphic Design-Basics of UIUX.pdf', tier: 3, badge: 'UI/UX', colors: ['#F43F5E', '#8B5CF6'] },
  { title: 'Website UI/UX Designing using ChatGPT', issuer: 'Simplilearn', date: 'August 27, 2025', image: '/assets/certificates/Simplilearn-Website UIUX Designing using ChatGPT-1.png', link: '/assets/certificates/Simplilearn-Website UIUX Designing using ChatGPT.pdf', tier: 3, badge: 'UI/UX', colors: ['#10B981', '#06B6D4'] },
  { title: 'Design Thinking for Beginners', issuer: 'Simplilearn', date: 'July 24, 2025', image: '/assets/certificates/Simplilearn-Design Thinking for Beginners-1.png', link: '/assets/certificates/Simplilearn-Design Thinking for Beginners.pdf', tier: 3, badge: 'Design', colors: ['#8B5CF6', '#F59E0B'] },
  { title: 'Introduction to PHP', issuer: 'Simplilearn', date: 'February 2, 2025', image: '/assets/certificates/Simplilearn-Introduction to PHP-1.png', link: '/assets/certificates/Simplilearn-Introduction to PHP.pdf', tier: 3, badge: 'Backend', colors: ['#6366F1', '#3B82F6'] },
  { title: 'SEO 1', issuer: 'HubSpot Academy', date: 'January 14, 2026', image: '/assets/certificates/Hubspot-SEO 1 Certificata.png', link: '/assets/certificates/Hubspot-SEO 1 Certificata.pdf', tier: 4, badge: 'SEO', colors: ['#FF7A59', '#F97316'] },
  { title: 'SEO 2', issuer: 'HubSpot Academy', date: 'January 28, 2026', image: '/assets/certificates/Hubspot-SEO 2 Certificate.png', link: '/assets/certificates/Hubspot-SEO 2 Certificate.pdf', tier: 4, badge: 'SEO', colors: ['#FF7A59', '#EA580C'] },
  { title: 'Digital Marketing', issuer: 'HubSpot Academy', date: 'July 28, 2025', image: '/assets/certificates/Hubspot-Digital Marketing Certificate.png', link: '/assets/certificates/Hubspot-Digital Marketing Certificate.pdf', tier: 4, badge: 'Marketing', colors: ['#F43F5E', '#FB923C'] },
  { title: 'Content Marketing', issuer: 'HubSpot Academy', date: 'August 29, 2025', image: '/assets/certificates/Hubspot-Content Marketing Certificate.png', link: '/assets/certificates/Hubspot-Content Marketing Certificate.pdf', tier: 4, badge: 'Marketing', colors: ['#F97316', '#FBBF24'] },
  { title: 'Digital Advertising', issuer: 'HubSpot Academy', date: 'September 28, 2025', image: '/assets/certificates/Hubspot-Digital Advertising Certificate.png', link: '/assets/certificates/Hubspot-Digital Advertising Certificate.pdf', tier: 4, badge: 'Marketing', colors: ['#E11D48', '#F97316'] },
]

export default function About() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const sectionRef = useRef<HTMLElement>(null)
  const [certActive, setCertActive] = useState(0)
  const rafId = useRef<number>(0)
  const targetPos = useRef({ x: 0, y: 0 })

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    targetPos.current = { x: e.clientX, y: e.clientY }
  }, [])

  useEffect(() => {
    const animate = () => {
      setMousePos(prev => ({
        x: prev.x + (targetPos.current.x - prev.x) * 0.08,
        y: prev.y + (targetPos.current.y - prev.y) * 0.08,
      }))
      rafId.current = requestAnimationFrame(animate)
    }
    rafId.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId.current)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('active')
          }
        })
      },
      { threshold: 0.02, rootMargin: '0px 0px 120px 0px' }
    )

    const els = sectionRef.current?.querySelectorAll('.ed-reveal')
    els?.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="about-editorial-page" ref={sectionRef} onMouseMove={onMouseMove}>
      <div className="cursor-spotlight" style={{ left: mousePos.x, top: mousePos.y }} />
      <div className="bg-grid-about" />
      <div className="bg-blob blob-tl" /><div className="bg-blob blob-br" /><div className="bg-blob blob-mid" />
      <div className="page-number-deco">02</div>
      <div className="particles-layer" aria-hidden="true">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <span key={i} className="particle" />)}
      </div>

      <div className="about-editorial-container">
        {/* ── 01: PERSONAL INTRODUCTION (Editorial Personal Profile) ── */}
        <section className="ed-section ed-intro-section ed-reveal">
          <div className="ed-intro-grid">
            {/* Left Column: Large Editorial Portrait & Integrated Metadata */}
            <div className="ed-portrait-col">
              <div className="ed-portrait-frame">
                <div className="portrait-backdrop" />
                <img
                  src="/assets/profile.png"
                  alt="Aimee Li Marael S. Pangan"
                  className="ed-portrait-img"
                />
                <div className="portrait-corner-tl" />
                <div className="portrait-corner-br" />
              </div>

              <div className="ed-status-tag">
                <span className="status-indicator-ping">
                  <span className="ping-ring" />
                  <span className="ping-dot" />
                </span>
                <span className="status-tag-text">AVAILABLE FOR JUNIOR &amp; ENTRY-LEVEL ROLES</span>
              </div>

              {/* Integrated Micro-Facts */}
              <div className="ed-portrait-facts">
                <div className="fact-item">
                  <span className="fact-code">LEVEL</span>
                  <span className="fact-val">4th Year Student</span>
                  <span className="fact-sub">Holy Angel University</span>
                </div>
                <div className="fact-sep" />
                <div className="fact-item">
                  <span className="fact-code">GWA</span>
                  <span className="fact-val">1.5 Standing</span>
                  <span className="fact-sub">Web Development</span>
                </div>
                <div className="fact-sep" />
                <div className="fact-item">
                  <span className="fact-code">LOCATION</span>
                  <span className="fact-val">Angeles City</span>
                  <span className="fact-sub">Pampanga, PH</span>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Typography & Philosophy */}
            <div className="ed-bio-col">
              <div className="ed-section-eyebrow">
                <span className="ed-eyebrow-line" />
                <span className="ed-eyebrow-text">01 // PERSONAL PROFILE</span>
              </div>

              <h1 className="ed-bio-headline">
                Beyond the <span className="ed-serif-italic">code.</span>
              </h1>

              <p className="ed-bio-lead">
                I'm <strong>Aimee Li Marael S. Pangan</strong> — a 4th-year BS Information Technology student at Holy Angel University, specializing in Web Development with an architectural discipline in <strong>Database Management</strong> and <strong>UI/UX Design</strong>.
              </p>

              <blockquote className="ed-pull-quote">
                <div className="quote-accent-bar" />
                <p>
                  "Where structure meets creativity — balancing clean relational data logic with thoughtful, human-centered design."
                </p>
              </blockquote>

              <p className="ed-bio-body">
                I approach software from the schema up. Whether normalizing multi-table relational databases or refining subtle interface micro-interactions, I believe the best software feels effortless to the user and resilient under the hood: it just works, and it works beautifully.
              </p>

              <div className="ed-bio-actions">
                <a
                  href="/assets/Pangan_Resume.pdf"
                  download="Pangan_Resume.pdf"
                  className="ed-primary-btn"
                >
                  <i className="fas fa-download" />
                  <span>Download Resume</span>
                  <span className="ed-btn-badge">PDF</span>
                </a>

                <a
                  href="mailto:aimeelimaraelst@gmail.com"
                  className="ed-secondary-btn"
                >
                  <i className="fas fa-paper-plane" />
                  <span>Say Hello</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 02: TECHNICAL IDENTITY / DEVELOPER WORKSPACE (Hierarchical Layout) ── */}
        <section className="ed-section ed-tech-section ed-reveal">
          <div className="ed-section-header is-right-aligned">
            <div className="ed-section-eyebrow">
              <span className="ed-eyebrow-line" />
              <span className="ed-eyebrow-text">02 // TECHNICAL IDENTITY</span>
            </div>
            <h2 className="ed-section-title">
              Technical <span className="ed-serif-italic">Domains.</span>
            </h2>
          </div>

          <div className="ed-domains-grid">
            {technicalDomains.map((domain, i) => (
              <div
                key={i}
                className={`ed-domain-card ${domain.isPrimary ? 'is-primary-card' : 'is-supporting-card'}`}
              >
                <div className="domain-card-top">
                  <span className="domain-sys-code">{domain.code}</span>
                  <div className="domain-icon-wrap">
                    <i className={domain.icon} />
                  </div>
                </div>

                <div className="domain-heading-block">
                  <h3 className="domain-title">{domain.title}</h3>
                  <span className="domain-focus-badge">{domain.focus}</span>
                </div>

                <p className="domain-problem-statement">{domain.problemStatement}</p>

                <div className="domain-skills-list">
                  {domain.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="domain-skill-pill">
                      <span className="skill-dot" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── FULL WIDTH TOOLS MARQUEE DIVIDER (Edge-to-Edge) ── */}
      <div className="ed-marquee-divider" aria-hidden="true">
        <div className="ed-marquee-track">
          {[...marqueeTools, ...marqueeTools].map((tool, i) => (
            <span key={`t1-${i}`} className="ed-marquee-item">
              <span className="marquee-tool-name">{tool}</span>
              <span className="marquee-sep">•</span>
            </span>
          ))}
          {[...marqueeTools, ...marqueeTools].map((tool, i) => (
            <span key={`t2-${i}`} className="ed-marquee-item">
              <span className="marquee-tool-name">{tool}</span>
              <span className="marquee-sep">•</span>
            </span>
          ))}
        </div>
      </div>

      <div className="about-editorial-container">
        {/* ── 03: MY JOURNEY (Single Connected Editorial Timeline) ── */}
        <section className="ed-section ed-journey-section ed-reveal">
          <div className="ed-section-header">
            <div className="ed-section-eyebrow">
              <span className="ed-eyebrow-line" />
              <span className="ed-eyebrow-text">03 // CHRONOLOGY</span>
            </div>
            <h2 className="ed-section-title">
              The Learning <span className="ed-serif-italic">Journey.</span>
            </h2>
          </div>

          <div className="ed-timeline-spine">
            {/* Timeline Event 1: Internship (Left Meta, Right Featured Project) */}
            <div className="ed-timeline-entry is-entry-left">
              <div className="timeline-sidebar-col">
                <div className="timeline-node-indicator">
                  <span className="node-ring" />
                  <span className="node-dot" />
                  <span className="timeline-node-line" />
                </div>
                <div className="timeline-meta-row">
                  <span className="timeline-period-pill">JUNE 2026 — SEPTEMBER 2026</span>
                  <span className="timeline-org-type">PRODUCTION INTERNSHIP</span>
                </div>
                <h3 className="timeline-org-name">Office of Institutional Effectiveness</h3>
                <h4 className="timeline-role-title">
                  Web Developer Intern &amp; Database Architect
                  <span className="timeline-sub-tag">Holy Angel University</span>
                </h4>
              </div>

              <div className="timeline-main-col">
                <p className="timeline-narrative">
                  Architected and engineered the university-wide <strong>Accreditation Management Portal</strong> used to track real-time compliance across 4 major accrediting bodies: PAASCU, AUN-QA, CHED, and PACUCOA. Designed normalized relational MySQL database schemas, implemented role-based access control (QA Admins, Deans, Heads of Units), and developed evidence repositories.
                </p>

                {/* Contextual Visual Callout for the Accreditation Portal */}
                <div className="ed-project-callout">
                  <div className="callout-img-col">
                    <img
                      src="/assets/accreditation-portal-main.png"
                      alt="Accreditation Management Portal preview"
                      className="callout-img"
                    />
                  </div>
                  <div className="callout-info-col">
                    <span className="callout-badge">FEATURED ACCOMPLISHMENT</span>
                    <h5 className="callout-title">Accreditation Management Portal</h5>
                    <p className="callout-desc">
                      Mission-critical system streamlining institutional quality assurance, evidence repositories, and risk assessment workflows.
                    </p>
                    <div className="callout-tags">
                      <span>Laravel</span>
                      <span>MySQL</span>
                      <span>RBAC</span>
                      <span>4 Accrediting Bodies</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Event 2: Higher Education (Alternating: Left Narrative, Right Meta & Honors) */}
            <div className="ed-timeline-entry is-entry-right">
              <div className="timeline-main-col">
                <p className="timeline-narrative">
                  4th-year student maintaining a <strong>1.5 Cumulative GWA</strong> with an emphasis on relational database management, data normalization, and client-side web architectures. Engineered production capstone systems, e-libraries, and RESTful APIs across modern web stacks.
                </p>

                <div className="timeline-bullet-points">
                  <div className="tl-bullet">
                    <i className="fas fa-check" />
                    <span>Relational Database Management: Schema normalization, indexing, and data integrity</span>
                  </div>
                  <div className="tl-bullet">
                    <i className="fas fa-check" />
                    <span>Full-Stack Engineering: Capstone portals built with PHP, Laravel, React, and Vue.js</span>
                  </div>
                </div>
              </div>

              <div className="timeline-sidebar-col">
                <div className="timeline-node-indicator">
                  <span className="node-ring" />
                  <span className="node-dot" />
                  <span className="timeline-node-line" />
                </div>
                <div className="timeline-meta-row">
                  <span className="timeline-period-pill">2023 — PRESENT</span>
                  <span className="timeline-org-type">HIGHER EDUCATION</span>
                </div>
                <h3 className="timeline-org-name">Holy Angel University</h3>
                <h4 className="timeline-role-title">
                  Bachelor of Science in Information Technology
                  <span className="timeline-sub-tag">Web Development Specialization</span>
                </h4>
                <div className="timeline-highlight-pill">
                  <i className="fas fa-star" />
                  <span>1.5 CUMULATIVE GWA</span>
                </div>
              </div>
            </div>

            {/* Timeline Event 3: Senior High School (Left Meta, Right Narrative) */}
            <div className="ed-timeline-entry is-entry-left">
              <div className="timeline-sidebar-col">
                <div className="timeline-node-indicator">
                  <span className="node-ring" />
                  <span className="node-dot" />
                  <span className="timeline-node-line" />
                </div>
                <div className="timeline-meta-row">
                  <span className="timeline-period-pill">2021 — 2023</span>
                  <span className="timeline-org-type">FOUNDATIONAL</span>
                </div>
                <h3 className="timeline-org-name">Holy Angel University</h3>
                <h4 className="timeline-role-title">
                  Senior High School
                  <span className="timeline-sub-tag">General Academic Strand</span>
                </h4>
              </div>

              <div className="timeline-main-col">
                <p className="timeline-narrative">
                  Graduated General Academic Strand with academic honors. Built the logical reasoning, structured problem-solving, and mathematical foundations that directed my transition into software engineering.
                </p>
                <div className="timeline-highlight-pill honors-pill">
                  <i className="fas fa-award" />
                  <span>GRADUATED WITH ACADEMIC HONORS</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 04: CERTIFICATIONS & CREDENTIALS (Signature Carousel) ── */}
        <section className="ed-section ed-cert-section ed-reveal">
          <div className="ed-cert-header-wrap">
            <div className="ed-section-header" style={{ marginBottom: 0 }}>
              <div className="ed-section-eyebrow">
                <span className="ed-eyebrow-line" />
                <span className="ed-eyebrow-text">04 // CREDENTIALS</span>
              </div>
              <h2 className="ed-section-title">
                Verified <span className="ed-serif-italic">Certifications.</span>
              </h2>
            </div>

            <div className="ed-cert-counter">
              <span className="counter-prefix">CREDENTIAL</span>
              <span className="counter-display">
                <strong className="counter-curr">{String(certActive + 1).padStart(2, '0')}</strong>
                <span className="counter-divider">/</span>
                <span className="counter-max">{String(certifications.length).padStart(2, '0')}</span>
              </span>
            </div>
          </div>

          <div className="cert-tier-bar">
            <div className="cert-tier-legend">
              <span className="tier-badge tier-1"><span className="tier-dot" />Industry Standard</span>
              <span className="tier-badge tier-2"><span className="tier-dot" />Full-Stack &amp; Logic</span>
              <span className="tier-badge tier-3"><span className="tier-dot" />Databases &amp; UI</span>
              <span className="tier-badge tier-4"><span className="tier-dot" />Analytics &amp; SEO</span>
            </div>
          </div>

          <GradientCarousel
            items={certifications}
            onActiveChange={setCertActive}
          />
        </section>

        {/* ── 05: WHERE I'M HEADED (Connected Horizontal Progression - Right Aligned) ── */}
        <section className="ed-section ed-trajectory-section ed-reveal">
          <div className="ed-section-header is-right-aligned">
            <div className="ed-section-eyebrow">
              <span className="ed-eyebrow-line" />
              <span className="ed-eyebrow-text">05 // FUTURE TRAJECTORY</span>
            </div>
            <h2 className="ed-section-title">
              Where I'm <span className="ed-serif-italic">Headed.</span>
            </h2>
          </div>

          <div className="ed-trajectory-progression">
            <div className="progression-steps-track">
              {trajectorySteps.map((step, idx) => (
                <div key={idx} className="progression-step-col">
                  <div className="progression-milestone-header">
                    <div className="milestone-badge-wrap">
                      <div className="milestone-dot-ring">
                        <span className="milestone-dot-inner" />
                      </div>
                      <span className="milestone-num">{step.step}</span>
                    </div>

                    {idx < trajectorySteps.length - 1 && (
                      <div className="progression-connector" aria-hidden="true">
                        <div className="connector-line-glow" />
                        <span className="connector-arrow">
                          <i className="fas fa-chevron-right" />
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="progression-card-inner">
                    <span className="progression-horizon-tag">{step.horizon}</span>
                    <h3 className="progression-title">{step.title}</h3>
                    <span className="progression-role-target">{step.roleTarget}</span>
                    <p className="progression-desc">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 06: WORDS OF COLLABORATION & CLOSING ── */}
        <section className="ed-section ed-quotes-section ed-reveal">
          <div className="ed-section-header">
            <div className="ed-section-eyebrow">
              <span className="ed-eyebrow-line" />
              <span className="ed-eyebrow-text">06 // ENDORSEMENTS</span>
            </div>
            <h2 className="ed-section-title">
              Words of <span className="ed-serif-italic">Collaboration.</span>
            </h2>
          </div>

          <div className="ed-quotes-container">
            {testimonials.map((t, idx) => (
              <div key={idx} className="ed-quote-item">
                <span className="ed-quote-glyph" aria-hidden="true">“</span>
                <p className="ed-quote-text">"{t.content}"</p>
                <div className="ed-quote-author">
                  <div className="author-avatar">{t.initials}</div>
                  <div className="author-details">
                    <span className="author-name">{t.name}</span>
                    <span className="author-role">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Editorial Closing Banner with Subtle Ambient Glow */}
          <div className="ed-closing-banner">
            <div className="closing-ambient-glow" aria-hidden="true" />
            <h3 className="closing-prompt">Ready to build something intuitive together?</h3>
            <p className="closing-sub">My inbox is always open for opportunities and conversations.</p>
            <div className="closing-actions">
              <Link to="/contact" className="ed-primary-btn closing-primary-btn">
                <span>Get In Touch</span>
                <i className="fas fa-arrow-right" />
              </Link>
              <Link to="/projects" className="ed-secondary-btn closing-secondary-btn">
                <span>Explore Projects</span>
                <i className="fas fa-arrow-right" />
              </Link>
            </div>
          </div>
        </section>
      </div>

      <SideScrollIndicator />
    </section>
  )
}
