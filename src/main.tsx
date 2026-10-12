import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const loader = document.getElementById('root-loader')
if (loader) {
  loader.style.opacity = '0'
  setTimeout(() => loader.remove(), 650)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
