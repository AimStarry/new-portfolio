import { Link } from 'react-router-dom'

const letters = ['W', 'I', 'T', 'H', 'A', 'I', 'M']

export default function Footer() {
  return (
    <footer className="modern-footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="f-col">
            <h4 className="f-label">LET'S TALK</h4>
            <a href="mailto:aimeelimaraelst@gmail.com" className="f-data">
              aimeelimaraelst@gmail.com
            </a>
            <p className="f-data">Angeles City, Philippines</p>
          </div>
          <div className="f-col">
            <h4 className="f-label">NAVIGATION</h4>
            <ul className="f-list">
              <li><Link to="/home">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/projects">Projects</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="f-col">
            <h4 className="f-label">GET SOCIAL</h4>
            <div className="f-social-links">
              <a
                href="https://www.linkedin.com/in/aimee-li-marael-pangan-56a41634a"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn ↗
              </a>
              <a
                href="https://github.com/AimStarry"
                target="_blank"
                rel="noreferrer"
              >
                Github ↗
              </a>
              <a
                href="https://facebook.com/atmbyjihyo"
                target="_blank"
                rel="noreferrer"
              >
                Facebook ↗
              </a>
            </div>
          </div>
        </div>

        <div className="massive-footer-text">
          <div className="tilt-wrapper">
            <div className="tilt-container">
              {letters.map((l, i) => (
                <span key={i} className="tilt-letter">
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="f-bottom">
          <div className="f-bottom-content">
            <p>© 2026 AIMEE PANGAN.</p>
            <p>MADE WITH REACT</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
