import { useEffect, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import gsap from 'gsap'
import './Contact.css'

const SUBJECT_OPTIONS = [
  'Job Opportunity',
  'Freelance Project',
  'Collaboration',
  'Other',
]

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const ctxRef = useRef<gsap.Context | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    consent: false,
  })

  const [selectedSubject, setSelectedSubject] = useState<string>('Job Opportunity')
  const [customSubject, setCustomSubject] = useState<string>('')
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastSentName, setLastSentName] = useState('')

  useEffect(() => {
    if (!sectionRef.current) return

    ctxRef.current = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } })

      tl.fromTo('.contact-eyebrow', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.05 })
        .fromTo('.form-card-glow-wrap', { x: 25, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6 }, 0.1)
        .fromTo('.contact-headline', { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, 0.15)
        .fromTo('.contact-subheading', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0.25)
        .fromTo('.contact-bio-lead', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0.35)
        .fromTo('.contact-availability-badge', { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4 }, 0.42)
        .fromTo('.featured-email-block', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, 0.48)
        .fromTo('.meta-row-item', { x: -15, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.08, duration: 0.4 }, 0.52)
        .fromTo('.contact-actions-row', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, 0.58)
    }, sectionRef.current)

    return () => {
      if (ctxRef.current) ctxRef.current.revert()
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    sectionRef.current.style.setProperty('--mouse-x', `${x}px`)
    sectionRef.current.style.setProperty('--mouse-y', `${y}px`)
  }

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('aimeelimaraelst@gmail.com')
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2500)
    } catch {
      // Fallback
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2500)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const isFormValid =
    formData.name.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.message.trim() !== '' &&
    formData.consent

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid || isSubmitting) return

    setIsSubmitting(true)

    const finalSubject =
      selectedSubject === 'Other' && customSubject.trim() !== ''
        ? `[Portfolio Contact - Other] ${customSubject.trim()}`
        : `[Portfolio Contact] ${selectedSubject}`

    try {
      await emailjs.send(
        'service_phoehe2',
        'template_j0rq1xc',
        {
          name: formData.name,
          email: formData.email,
          subject: finalSubject,
          message: formData.message,
          to_name: 'Aimee Li',
        },
        'WX3gjhNivPgB7FKE5'
      )

      emailjs.send(
        'service_phoehe2',
        'template_yrc2aer',
        {
          name: formData.name,
          email: formData.email,
          subject: finalSubject,
          message: formData.message,
        },
        'WX3gjhNivPgB7FKE5'
      ).catch(() => {})

      setShowSuccess(true)
      setLastSentName(formData.name)
      setFormData({
        name: '',
        email: '',
        message: '',
        consent: false,
      })
      setSelectedSubject('Job Opportunity')
      setCustomSubject('')
    } catch (err) {
      console.error('Email sending failed:', err)
      alert('Failed to send message. Please reach out directly at aimeelimaraelst@gmail.com')
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeModal = () => {
    setShowSuccess(false)
  }

  return (
    <section
      ref={sectionRef}
      className="contact-editorial-section"
      onMouseMove={handleMouseMove}
    >
      <div className="mouse-spotlight" />
      <div className="bg-grid-contact" />
      <div className="bg-contact-glow glow-teal" />
      <div className="bg-contact-glow glow-blue" />
      <div className="bg-contact-glow glow-form-ambient" />
      <div className="page-number-deco">04</div>

      <div className="contact-editorial-container">
        {/* ── LEFT COLUMN: EDITORIAL PROFILE & CONTACT FEATURES ── */}
        <div className="contact-editorial-col">
          <div className="contact-eyebrow">
            <span className="eyebrow-accent-line" />
            <span className="eyebrow-label">GET IN TOUCH // 04</span>
          </div>

          <h1 className="contact-headline">
            LET'S<br />
            <span className="headline-green">TALK.</span>
          </h1>

          <p className="contact-subheading">
            Have a project <span className="serif-amber">in mind?</span>
          </p>

          <p className="contact-bio-lead">
            I'm open to junior and entry-level opportunities in web development, databases, and UI/UX. Let's build something meaningful.
          </p>

          {/* Understated Availability Badge */}
          <div className="contact-availability-badge">
            <span className="avail-pulse">
              <span className="avail-ring" />
              <span className="avail-dot" />
            </span>
            <span className="avail-text">AVAILABLE FOR OPPORTUNITIES</span>
          </div>

          {/* Featured Interactive Email Card */}
          <div className="featured-email-block">
            <div className="email-meta-label">
              <i className="fas fa-paper-plane" />
              <span>DIRECT INBOX</span>
            </div>
            <div className="email-interactive-row">
              <a
                href="mailto:aimeelimaraelst@gmail.com"
                className="featured-email-link"
                title="Open default email client"
              >
                <span>aimeelimaraelst@gmail.com</span>
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className={`copy-email-btn ${copiedEmail ? 'copied' : ''}`}
                aria-label="Copy email address to clipboard"
                title="Copy email to clipboard"
              >
                {copiedEmail ? (
                  <>
                    <i className="fas fa-check" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <i className="far fa-copy" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Clean Secondary Location & Education (Editorial Metadata) */}
          <div className="contact-editorial-meta">
            <div className="meta-row-item">
              <div className="meta-icon-box">
                <i className="fas fa-location-dot" />
              </div>
              <div className="meta-text-wrap">
                <span className="meta-title">Angeles City, Philippines</span>
                <span className="meta-sub">Pampanga · Central Luzon (GMT+8)</span>
              </div>
            </div>
            <div className="meta-row-item">
              <div className="meta-icon-box">
                <i className="fas fa-graduation-cap" />
              </div>
              <div className="meta-text-wrap">
                <span className="meta-title">Holy Angel University</span>
                <span className="meta-sub">BS Information Technology · 4th Year</span>
              </div>
            </div>
          </div>

          {/* Resume CTA & Social Links */}
          <div className="contact-actions-row">
            <a
              href="/assets/Pangan_Resume.pdf"
              download="Pangan_Resume.pdf"
              className="contact-resume-pill"
            >
              <i className="fas fa-download" />
              <span>Download Resume</span>
              <span className="resume-badge-pdf">PDF</span>
            </a>

            <div className="contact-social-pills">
              <a
                href="https://github.com/AimStarry"
                target="_blank"
                rel="noreferrer"
                className="social-pill"
                aria-label="GitHub profile"
              >
                <i className="fab fa-github" />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/aimee-li-marael-pangan-56a41634a"
                target="_blank"
                rel="noreferrer"
                className="social-pill"
                aria-label="LinkedIn profile"
              >
                <i className="fab fa-linkedin-in" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://www.facebook.com/atmbyjihyo"
                target="_blank"
                rel="noreferrer"
                className="social-pill"
                aria-label="Facebook profile"
              >
                <i className="fab fa-facebook-f" />
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: SPACIOUS FORM CARD WITH AMBIENT GLOW ── */}
        <div className="contact-form-col">
          <div className="form-card-glow-wrap">
            <div className="form-glow-backdrop" aria-hidden="true" />

            <div className="form-card-editorial">
              <div className="form-header-row">
                <div className="form-header-text">
                  <h2 className="form-editorial-title">Send a message.</h2>
                  <p className="form-editorial-subtitle">Tell me what you're working on.</p>
                </div>
                <div className="form-response-badge">
                  <span className="response-dot" />
                  <span>Replies in ~24h</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="editorial-form-body">
                <div className="form-grid-two">
                  <div className="form-group">
                    <label className="field-label" htmlFor="name">
                      YOUR NAME <span className="req">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Juan dela Cruz"
                      value={formData.name}
                      onChange={handleChange}
                      className="field-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="field-label" htmlFor="email">
                      EMAIL ADDRESS <span className="req">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      required
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="field-input"
                    />
                  </div>
                </div>

                {/* Interactive Subject Selector */}
                <div className="form-group">
                  <label className="field-label">
                    WHAT'S THIS ABOUT?
                  </label>
                  <div className="subject-selector-pills">
                    {SUBJECT_OPTIONS.map((subj) => (
                      <button
                        key={subj}
                        type="button"
                        className={`subject-pill ${selectedSubject === subj ? 'active' : ''}`}
                        onClick={() => setSelectedSubject(subj)}
                      >
                        {subj}
                      </button>
                    ))}
                  </div>

                  {selectedSubject === 'Other' && (
                    <input
                      type="text"
                      placeholder="Specify your inquiry topic..."
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      className="field-input custom-subject-input"
                      autoFocus
                    />
                  )}
                </div>

                <div className="form-group">
                  <label className="field-label" htmlFor="message">
                    MESSAGE <span className="req">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    placeholder="Tell me a little about it..."
                    value={formData.message}
                    onChange={handleChange}
                    className="field-input field-textarea"
                  />
                </div>

                <div className="privacy-checkbox-row">
                  <input
                    type="checkbox"
                    id="consent"
                    name="consent"
                    required
                    checked={formData.consent}
                    onChange={handleChange}
                    className="consent-checkbox"
                  />
                  <label htmlFor="consent" className="consent-label">
                    I agree to the processing of my contact information to respond to this message.
                  </label>
                </div>

                <button
                  type="submit"
                  className="form-submit-btn"
                  disabled={!isFormValid || isSubmitting}
                >
                  {!isSubmitting ? (
                    <>
                      <span>SEND MESSAGE</span>
                      <i className="fas fa-arrow-up-right-from-square submit-arrow" />
                    </>
                  ) : (
                    <span className="sending-indicator">
                      <span className="send-pulse-dot" />
                      <span>Transmitting...</span>
                    </span>
                  )}
                </button>

                <div className="form-conversation-quote">
                  <span className="quote-bullet">•</span>
                  <span>GOOD THINGS START WITH A CONVERSATION.</span>
                  <span className="quote-bullet">•</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ── SUCCESS NOTIFICATION MODAL ── */}
      {showSuccess && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <i className="fas fa-check" />
            </div>
            <h3 className="modal-title">Message Sent!</h3>
            <p className="modal-body">
              Thanks, <strong>{lastSentName}</strong>! I've received your note and
              will reply directly to your email within 24 hours.
            </p>
            <p className="modal-tagline">"Good things start with a conversation."</p>
            <button className="close-btn" onClick={closeModal}>
              <i className="fas fa-times" /> Close
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
