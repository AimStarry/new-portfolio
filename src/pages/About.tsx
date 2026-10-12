import { useEffect, useRef, useState, useCallback } from 'react'
import { GradientCarousel, type CarouselItem } from '../components/GradientCarousel'
import { SideScrollIndicator } from '../components/SideScrollIndicator'
import './About.css'

const techSkills = [
  { name: 'SQL / MySQL / PostgreSQL', percent: 90, icon: 'fas fa-database' },
  { name: 'MongoDB / NoSQL', percent: 85, icon: 'fas fa-leaf' },
  { name: 'HTML / CSS / JavaScript', percent: 88, icon: 'fas fa-code' },
  { name: 'PHP / Node.js / Python', percent: 80, icon: 'fas fa-server' },
  { name: 'Angular / Vue.js / React', percent: 78, icon: 'fas fa-layer-group' },
  { name: 'UI/UX Design (Figma)', percent: 82, icon: 'fas fa-pen-ruler' },
  { name: 'Git / GitHub', percent: 80, icon: 'fab fa-github' },
]

const softSkills = ['Problem-Solving','Analytical Thinking','Time Management','Communication','Adaptability','Critical Thinking','Team Collaboration','Attention to Detail']
const devTools = ['Visual Studio Code','Figma','Postman','GitHub','Angular CLI','Canva']

const careerGoals = [
  { horizon:'Immediate', icon:'fas fa-briefcase', title:'Junior / Entry-Level Developer Role', description:'Apply industry experience from my internship to design robust database architectures, develop server-side logic, and craft intuitive frontend interfaces.' },
  { horizon:'Short-Term', icon:'fas fa-rocket', title:'Junior Database Developer or Frontend Developer', description:'After graduation, join a company where I can grow expertise in building intuitive, performant user interfaces while staying grounded in clean data architecture.' },
  { horizon:'Long-Term', icon:'fas fa-bullseye', title:'Data Architect & Full-Stack Specialist', description:'Grow into a role that bridges data engineering and full-stack development — designing systems that are both technically robust and genuinely user-centered.' },
]

const testimonials = [
  { name:'Marc Canlas', role:'Team Member, Holy Angel University', initials:'MC', content:"Aimee consistently demonstrates a logical approach to database architecture. Her ability to translate complex data into clean, intuitive interfaces is impressive for a 3rd-year student." },
  { name:'Samantha Gonzales', role:'Project Leader, Holy Angel University', initials:'SG', content:'Working with Aimee was a breeze. She has a keen eye for detail and never settles for "good enough" when it comes to user experience and code quality.' },
]

const certifications: CarouselItem[] = [
  { title:'Google Analytics Certification', issuer:'Skillshop by Google', date:'August 27, 2025', image:'/assets/certificates/Skillshop-Google Analytics Certification.png', link:'/assets/certificates/Skillshop-Google Analytics Certification.pdf', tier:1, badge:'Industry Standard', colors: ['#F59E0B', '#3B82F6'] },
  { title:'Cloud Foundations Training', issuer:'AWS Academy', date:'August 27, 2025', image:'/assets/certificates/AWS-Cloud Foundations Training Certificate-1.png', link:'/assets/certificates/AWS Cloud Foundations Training Certificate.pdf', tier:1, badge:'Cloud', colors: ['#FF9900', '#F59E0B'] },
  { title:'JavaScript Essentials 1', issuer:'Cisco', date:'October 25, 2024', image:'/assets/cert2.png', link:'/assets/certificates/cisco-js.pdf', tier:1, badge:'Networking Leader', colors: ['#00BCEB', '#2563EB'] },
  { title:'Backend Development and APIs V8', issuer:'freeCodeCamp', date:'September 27, 2025', image:'/assets/cert1.png', link:'/assets/certificates/fcc-backend-development.pdf', tier:2, badge:'Full-Stack', colors: ['#10B981', '#059669'] },
  { title:'Legacy JavaScript Algorithms and Data Structures V7', issuer:'freeCodeCamp', date:'September 30, 2025', image:'/assets/cert3.png', link:'/assets/certificates/fcc-legacy-javascript-algorithms-and-data-structures.pdf', tier:2, badge:'Algorithms', colors: ['#8B5CF6', '#10B981'] },
  { title:'SQL Optimization for Beginners', issuer:'Simplilearn', date:'August 27, 2025', image:'/assets/certificates/Simplilearn-SQL Optimization for Beginners-1.png', link:'/assets/certificates/Simplilearn-SQL Optimization for Beginners.pdf', tier:3, badge:'Database', colors: ['#0284C7', '#06B6D4'] },
  { title:'Fundamentals of Database: What is SQL?', issuer:'Simplilearn', date:'August 27, 2025', image:'/assets/certificates/Simplilearn-Fundamentals of Database-What is SQL-1.png', link:'/assets/certificates/Simplilearn-Fundamentals of Database-What is SQL.pdf', tier:3, badge:'Database', colors: ['#3B82F6', '#10B981'] },
  { title:'Introduction to Figma Certificate', issuer:'Simplilearn', date:'September 23, 2024', image:'/assets/certificates/Simplilearn-Introduction to Figma Certificate-1.png', link:'/assets/certificates/Simplilearn-Introduction to Figma Certificate.pdf', tier:3, badge:'Design', colors: ['#EC4899', '#A855F7'] },
  { title:'Introduction to Graphic Design; Basics of UI/UX Design', issuer:'Simplilearn', date:'August 27, 2025', image:'/assets/certificates/Simplilearn-Introduction to Graphic Design-Basics of UIUX-1.png', link:'/assets/certificates/Simplilearn-Introduction to Graphic Design-Basics of UIUX.pdf', tier:3, badge:'UI/UX', colors: ['#F43F5E', '#8B5CF6'] },
  { title:'Website UI/UX Designing using ChatGPT', issuer:'Simplilearn', date:'August 27, 2025', image:'/assets/certificates/Simplilearn-Website UIUX Designing using ChatGPT-1.png', link:'/assets/certificates/Simplilearn-Website UIUX Designing using ChatGPT.pdf', tier:3, badge:'UI/UX', colors: ['#10B981', '#06B6D4'] },
  { title:'Design Thinking for Beginners', issuer:'Simplilearn', date:'July 24, 2025', image:'/assets/certificates/Simplilearn-Design Thinking for Beginners-1.png', link:'/assets/certificates/Simplilearn-Design Thinking for Beginners.pdf', tier:3, badge:'Design', colors: ['#8B5CF6', '#F59E0B'] },
  { title:'Introduction to PHP', issuer:'Simplilearn', date:'February 2, 2025', image:'/assets/certificates/Simplilearn-Introduction to PHP-1.png', link:'/assets/certificates/Simplilearn-Introduction to PHP.pdf', tier:3, badge:'Backend', colors: ['#6366F1', '#3B82F6'] },
  { title:'SEO 1', issuer:'HubSpot Academy', date:'January 14, 2026', image:'/assets/certificates/Hubspot-SEO 1 Certificata.png', link:'/assets/certificates/Hubspot-SEO 1 Certificata.pdf', tier:4, badge:'SEO', colors: ['#FF7A59', '#F97316'] },
  { title:'SEO 2', issuer:'HubSpot Academy', date:'January 28, 2026', image:'/assets/certificates/Hubspot-SEO 2 Certificate.png', link:'/assets/certificates/Hubspot-SEO 2 Certificate.pdf', tier:4, badge:'SEO', colors: ['#FF7A59', '#EA580C'] },
  { title:'Digital Marketing', issuer:'HubSpot Academy', date:'July 28, 2025', image:'/assets/certificates/Hubspot-Digital Marketing Certificate.png', link:'/assets/certificates/Hubspot-Digital Marketing Certificate.pdf', tier:4, badge:'Marketing', colors: ['#F43F5E', '#FB923C'] },
  { title:'Content Marketing', issuer:'HubSpot Academy', date:'August 29, 2025', image:'/assets/certificates/Hubspot-Content Marketing Certificate.png', link:'/assets/certificates/Hubspot-Content Marketing Certificate.pdf', tier:4, badge:'Marketing', colors: ['#F97316', '#FBBF24'] },
  { title:'Digital Advertising', issuer:'HubSpot Academy', date:'September 28, 2025', image:'/assets/certificates/Hubspot-Digital Advertising Certificate.png', link:'/assets/certificates/Hubspot-Digital Advertising Certificate.pdf', tier:4, badge:'Marketing', colors: ['#E11D48', '#F97316'] },
]

const initialStats = [
  { label:'Projects Completed', value:5, suffix:'+', current:0, isDecimal:false },
  { label:'Certifications', value:10, suffix:'+', current:0, isDecimal:false },
  { label:'Technologies', value:7, suffix:'+', current:0, isDecimal:false },
  { label:'GWA', value:1.5, suffix:'', current:0, isDecimal:true },
]

export default function About() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const sectionRef = useRef<HTMLElement>(null)
  const [certActive, setCertActive] = useState(0)
  const [stats, setStats] = useState(initialStats.map(s => ({ ...s })))
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
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('active')
          if (e.target.classList.contains('stats-row')) {
            setStats(initialStats.map(s => ({ ...s })))
            initialStats.forEach((stat, idx) => {
              const duration = 1800, steps = 60, increment = stat.value / steps
              let count = 0
              const timer = setInterval(() => {
                count += increment
                if (count >= stat.value) {
                  setStats(prev => prev.map((s,i) => i === idx ? { ...s, current: stat.value } : s))
                  clearInterval(timer)
                } else {
                  const val = stat.isDecimal ? Math.round(count * 10) / 10 : Math.floor(count)
                  setStats(prev => prev.map((s,i) => i === idx ? { ...s, current: val } : s))
                }
              }, duration / steps)
            })
          }
          if (e.target.classList.contains('skills-box')) {
            const bars = e.target.querySelectorAll<HTMLElement>('.progress-fill')
            bars.forEach(bar => {
              const w = bar.getAttribute('data-width')
              if (w) bar.style.width = w + '%'
            })
          }
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' })

    const els = sectionRef.current?.querySelectorAll('.reveal, .scale-reveal, .center-title, .stats-row, .cert-section, .skills-box')
    els?.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="about-page" ref={sectionRef} onMouseMove={onMouseMove}>
      <div className="cursor-spotlight" style={{ left: mousePos.x, top: mousePos.y }} />
      <div className="bg-grid-about" />
      <div className="bg-blob blob-tl" /><div className="bg-blob blob-br" /><div className="bg-blob blob-mid" />
      <div className="page-number-deco">02</div>
      <div className="particles-layer" aria-hidden="true">
        {[1,2,3,4,5,6,7,8].map(i => <span key={i} className="particle" />)}
      </div>

      <div className="main-wrapper">
        <div className="section-eyebrow reveal">
          <span className="eyebrow-line" /><span className="eyebrow-text">About Me</span><span className="eyebrow-line" />
        </div>

        <div className="glass-panel bio-section reveal">
          <div className="bio-image-col">
            <div className="bio-image">
              <div className="image-accent" /><div className="image-ring" /><div className="image-ring image-ring-2" />
              <img src="/assets/profile.png" alt="Aimee Pangan - BS Information Technology student at Holy Angel University" />
            </div>
            <div className="status-indicator-card">
              <div className="status-ping-wrap">
                <span className="status-ping-ring" />
                <span className="status-ping-dot" />
              </div>
              <div className="status-card-content">
                <span className="status-card-label">CURRENT STATUS</span>
                <span className="status-card-text">Available for Junior &amp; Full-Time Roles</span>
              </div>
            </div>
          </div>
          <div className="bio-text">
            <h2 className="center-title">Who I <span>Am</span></h2>
            <p className="bio-lead">I'm <strong>Aimee Li Marael S. Pangan</strong>, a 4th-year BS Information Technology student at Holy Angel University, specializing in Web Development with a deep focus on <strong>Database Management</strong> and <strong>UI/UX Design</strong>.</p>
            <p className="bio-body">I enjoy building systems that are not only technically efficient but also intuitive and user-friendly — from designing normalized database schemas to crafting clean, accessible interfaces. I believe the best software is invisible to the user: it just works, and it works beautifully.</p>
            <p className="italic-tagline">"Where structure meets creativity — balancing clean data logic with thoughtful design."</p>
            <div className="bio-meta">
              <div className="bio-meta-item"><i className="fas fa-map-marker-alt" /><span>Pandan, Angeles City, PH</span></div>
              <div className="bio-meta-item"><i className="fas fa-university" /><span>Holy Angel University</span></div>
              <div className="bio-meta-item"><i className="fas fa-graduation-cap" /><span>BS Information Technology, 4th Year</span></div>
            </div>
            <div className="bio-cta-row">
              <a href="/assets/Pangan_Resume.pdf" download className="resume-download-btn"><i className="fas fa-download" /> Download Resume</a>
              <a href="mailto:aimeelimaraelst@gmail.com" className="contact-ghost-btn"><i className="fas fa-paper-plane" /> Say Hello</a>
            </div>
          </div>
        </div>

        <div className="stats-row reveal" aria-label="Key statistics">
          {stats.map((s, i) => (
            <div key={i} className="stat-card">
              <span className="stat-value">{s.current}{s.suffix}</span>
              <span className="stat-label">{s.label}</span>
              <div className="stat-glow" />
            </div>
          ))}
        </div>

        <div className="content-grid">
          <div className="glass-panel skills-box reveal">
            <h2 className="center-title">Technical <span>Expertise</span></h2>
            {techSkills.map((s, i) => (
              <div key={i} className="skill-item" style={{ transitionDelay: `${i * 0.07}s` }}>
                <div className="skill-info">
                  <span className="skill-name"><i className={s.icon} /> {s.name}</span>
                  <span className="skill-pct">{s.percent}%</span>
                </div>
                <div className="progress-bg">
                  <div className="progress-fill" data-width={s.percent} style={{ width: 0 }} />
                </div>
              </div>
            ))}
          </div>

          <div className="glass-panel soft-skills-box reveal delay-1">
            <h2 className="center-title">Soft <span>Skills</span></h2>
            <div className="tag-cloud">
              {softSkills.map((t, i) => <span key={i} className="skill-tag">{t}</span>)}
            </div>
            <div className="dev-tools-block">
              <h3 className="dev-tools-label">Development Tools</h3>
              <div className="dev-tools-list">
                {devTools.map((t, i) => <span key={i} className="dev-tool"><i className="fas fa-circle-dot" /> {t}</span>)}
              </div>
            </div>
          </div>
        </div>

        <div className="tools-marquee-container reveal">
          <h3 className="marquee-title">Tools I Work With</h3>
          <div className="marquee-wrapper">
            <div className="marquee-content">
              <span>VS Code</span> • <span>Figma</span> • <span>Postman</span> • <span>MongoDB</span> •
              <span>Netlify</span> • <span>GitHub</span> • <span>React</span> • <span>Canva</span> •
              <span>MySQL</span> • <span>Python</span> • <span>Node.js</span> • <span>Vue.js</span> •
              <span>VS Code</span> • <span>Figma</span> • <span>Postman</span> • <span>MongoDB</span> •
              <span>Netlify</span> • <span>GitHub</span> • <span>React</span> • <span>Canva</span> •
              <span>MySQL</span> • <span>Python</span> • <span>Node.js</span> • <span>Vue.js</span>
            </div>
          </div>
        </div>

        {/* ── Experience Section ── */}
        <div className="experience-section glass-panel reveal">
          <h2 className="center-title">Work <span>Experience</span></h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-content">
                <div className="timeline-header">
                  <div>
                    <h3 className="exp-company-title">Office of Institutional Effectiveness</h3>
                    <p className="exp-company-sub">Holy Angel University • Angeles City</p>
                  </div>
                  <span className="timeline-date">June 2026 — September 2026</span>
                </div>
                <p className="degree-title">Web Developer Intern <span className="exp-badge"><i className="fas fa-check-circle" /> Internship Completed</span></p>
                <div className="exp-tags">
                  <span className="exp-tag">Laravel</span>
                  <span className="exp-tag">MySQL</span>
                  <span className="exp-tag">Database Architecture</span>
                  <span className="exp-tag">Role-Based Access Control</span>
                  <span className="exp-tag">Full-Stack Development</span>
                </div>
                <ul className="edu-highlights">
                  <li>Built an accreditation management portal used university-wide, tracking compliance across multiple accrediting bodies including PAASCU, AUN-QA, CHED, and PACUCOA.</li>
                  <li>Developed compliance record, evidence repository, risk monitoring, and program-accreditor matrix modules, giving QA Admin, Dean, and Head of Unit users role-based views of accreditation status. Built with Laravel and MySQL.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="education-section glass-panel reveal">
          <h2 className="center-title">Academic <span>Journey</span></h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-content">
                <div className="timeline-header">
                  <h3>Holy Angel University</h3>
                  <span className="timeline-date">2023 — Present</span>
                </div>
                <p className="degree-title">Bachelor of Science in Information Technology</p>
                <p className="specialization">Area of Specialization: Web Development</p>
                <ul className="edu-highlights">
                  <li>Deep focus on Database Management, SQL optimization, and data-driven architecture.</li>
                  <li>Developing expertise in UI/UX Design and building accessible, intuitive interfaces.</li>
                  <li>Completed full-stack projects using PHP, Angular, Vue.js, Node.js, and MongoDB.</li>
                </ul>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-content">
                <div className="timeline-header">
                  <h3>Holy Angel University</h3>
                  <span className="timeline-date">2021 — 2023</span>
                </div>
                <p className="degree-title">Senior High School — General Academic Strand</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel career-goals-section reveal">
          <h2 className="center-title">Career <span>Goals</span></h2>
          <p className="career-intro">Having completed my internship, I'm actively seeking <strong>Junior / Entry-Level opportunities in Database &amp; Web Development</strong> where I can contribute to real-world products. My path is rooted in becoming a well-rounded data professional and engineer.</p>
          <div className="goals-grid">
            {careerGoals.map((g, i) => (
              <div key={i} className="goal-card" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="goal-icon-wrap"><i className={g.icon} /></div>
                <div className="goal-body">
                  <span className="goal-horizon">{g.horizon}</span>
                  <h4 className="goal-title">{g.title}</h4>
                  <p className="goal-desc">{g.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cert-section reveal">
          <div className="cert-section-header">
            <div className="cert-title-group">
              <h2 className="center-title">Certifications <span>&amp; Training</span></h2>
              <p className="cert-subtitle">Professional certifications, cloud foundations, and technical credentials</p>
            </div>
            <div className="cert-counter-pill">
              <span className="counter-icon">✦</span>
              <span className="counter-numbers">
                <strong className="counter-curr">{String(certActive + 1).padStart(2, '0')}</strong>
                <span className="counter-sep">/</span>
                <span className="counter-total">{String(certifications.length).padStart(2, '0')}</span>
              </span>
              <span className="counter-label">Credentials</span>
            </div>
          </div>

          <div className="cert-tier-bar">
            <div className="cert-tier-legend">
              <span className="tier-badge tier-1"><span className="tier-dot" />Industry</span>
              <span className="tier-badge tier-2"><span className="tier-dot" />Technical</span>
              <span className="tier-badge tier-3"><span className="tier-dot" />Skills</span>
              <span className="tier-badge tier-4"><span className="tier-dot" />Marketing</span>
            </div>
          </div>

          <GradientCarousel
            items={certifications}
            onActiveChange={setCertActive}
          />
        </div>

        <div className="testimonials-section reveal">
          <h2 className="center-title">Testimonials</h2>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card glass-panel">
                <div className="quote-icon">"</div>
                <div className="rating">★★★★★</div>
                <p className="testimonial-text">{t.content}</p>
                <div className="testimonial-footer">
                  <div className="client-avatar">{t.initials}</div>
                  <div className="client-info">
                    <span className="client-name">{t.name}</span><br />
                    <span className="client-role">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SideScrollIndicator />
    </section>
  )
}


