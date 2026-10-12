import { useEffect, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import gsap from 'gsap'
import './Contact.css'

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const ctxRef = useRef<gsap.Context | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    consent: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastSentName, setLastSentName] = useState('')

  useEffect(() => {
    if (!sectionRef.current) return

    ctxRef.current = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1 } })

      tl.fromTo('.section-eyebrow', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.1 })
        .fromTo('.massive-title', { y: 50, opacity: 0, skewY: 3 }, { y: 0, opacity: 1, skewY: 0, duration: 0.8 }, '-=0.6')
        .fromTo('.main-question', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.5')
        .fromTo('.description-text', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.5')
        .fromTo('.detail-item', { x: -20, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.1, duration: 0.6 }, '-=0.5')
        .fromTo('.contact-resume-btn', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4')
        .to('.action-btn', {
          autoAlpha: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          display: 'inline-flex',
        }, '-=0.4')
        .fromTo('.form-card', { x: 40, opacity: 0, scale: 0.98 }, { x: 0, opacity: 1, scale: 1, duration: 0.8 }, '-=0.6')
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

    try {
      await emailjs.send(
        'service_phoehe2',
        'template_j0rq1xc',
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject || '(No subject)',
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
          subject: formData.subject || '(No subject)',
          message: formData.message,
        },
        'WX3gjhNivPgB7FKE5'
      ).catch(() => {})

      setShowSuccess(true)
      setLastSentName(formData.name)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        consent: false,
      })
    } catch (err) {
      console.error('Email sending failed:', err)
      alert('Failed to send message. Please try reaching out directly via email.')
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
      className="contact-section"
      onMouseMove={handleMouseMove}
    >
      <div className="mouse-spotlight"></div>

      <div className="bg-grid-contact"></div>
      <div className="bg-layer-top"></div>
      <div className="bg-layer-bottom"></div>
      <div className="bg-blob blob-left"></div>
      <div className="bg-blob blob-right"></div>
      <div className="page-number-deco">04</div>

      <div className="content-container">
        <div className="info-column">
          <div className="section-eyebrow">
            <span className="eyebrow-line"></span>
            <span className="eyebrow-text">Get In Touch</span>
            <span className="eyebrow-line"></span>
          </div>

          <h2 className="massive-title">
            LET'S<br />
            <span>TALK</span>
          </h2>
          <p className="main-question">Ready to bring your vision to life?</p>

          <p className="description-text">
            I'm actively open to junior and entry-level opportunities in Database Development
            and Frontend Development. Whether you have a project, an opportunity, or
            just want to say hi — my inbox is open.
          </p>

          <div className="contact-details">
            <div className="detail-item">
              <div className="detail-icon-wrap">
                <i className="fas fa-envelope"></i>
              </div>
              <a href="mailto:aimeelimaraelst@gmail.com">
                aimeelimaraelst@gmail.com
              </a>
            </div>
            <div className="detail-item">
              <div className="detail-icon-wrap">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <span>Angeles City, Philippines</span>
            </div>
            <div className="detail-item">
              <div className="detail-icon-wrap">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <span>Holy Angel University — BS IT, 4th Year</span>
            </div>
          </div>

          <a
            href="/assets/Pangan_Resume.pdf"
            download="Pangan_Resume.pdf"
            className="contact-resume-btn"
          >
            <i className="fas fa-download"></i>
            Download Resume
            <span className="contact-resume-badge">PDF</span>
          </a>

          <div className="social-actions">
            <p className="social-label">Connect with me</p>
            <div className="btn-group-row">
              <a
                href="https://github.com/AimStarry"
                target="_blank"
                rel="noreferrer"
                className="action-btn"
                aria-label="GitHub profile"
              >
                <i className="fab fa-github"></i> GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/aimee-li-marael-pangan-56a41634a"
                target="_blank"
                rel="noreferrer"
                className="action-btn"
                aria-label="LinkedIn profile"
              >
                <i className="fab fa-linkedin-in"></i> LinkedIn
              </a>
              <a
                href="https://www.facebook.com/atmbyjihyo"
                target="_blank"
                rel="noreferrer"
                className="action-btn"
                aria-label="Facebook profile"
              >
                <i className="fab fa-facebook-f"></i> Facebook
              </a>
            </div>
          </div>
        </div>

        <div className="form-column">
          <div className="form-card">
            <div className="form-header">
              <h3 className="form-title">Send a Message</h3>
              <p className="form-subtitle">I'll get back to you within 24 hours.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="input-row">
                <div className="input-field">
                  <label className="input-label" htmlFor="name">
                    Your Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Juan dela Cruz"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="input-field">
                  <label className="input-label" htmlFor="email">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="input-field">
                <label className="input-label" htmlFor="subject">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  name="subject"
                  placeholder="Job Opportunity / Project Inquiry / etc."
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="input-field">
                <label className="input-label" htmlFor="message">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  placeholder="Tell me about your project, opportunity, or question..."
                  value={formData.message}
                  onChange={handleChange}
                  className="form-input form-textarea"
                ></textarea>
              </div>

              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="consent"
                  name="consent"
                  required
                  checked={formData.consent}
                  onChange={handleChange}
                />
                <label htmlFor="consent">
                  I agree to the processing of my personal data.
                </label>
              </div>

              <button
                type="submit"
                className="send-btn"
                disabled={!isFormValid || isSubmitting}
              >
                {!isSubmitting ? (
                  <>
                    Send Message <i className="fas fa-paper-plane"></i>
                  </>
                ) : (
                  <span className="sending-state">
                    <span className="dot-pulse"></span> Sending...
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <i className="fas fa-check"></i>
            </div>
            <h3 className="modal-title">Message Sent!</h3>
            <p className="modal-body">
              Thanks, <strong>{lastSentName}</strong>! I've received your message and
              will get back to you within 24 hours.
            </p>
            <p className="modal-tagline">"Let's create something amazing together."</p>
            <button className="close-btn" onClick={closeModal}>
              <i className="fas fa-times"></i> Close
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
