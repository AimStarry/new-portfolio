import { useEffect, useRef, memo } from 'react'
import './GlyphEmber.css'

interface GlyphEmberProps {
  className?: string
  style?: React.CSSProperties
  heightRatio?: number // Proportion of container covered by flames (default: 0.45 from screenshot)
  glyphSize?: number // Font size in px (default: 11)
  coreColor?: string // White-hot core (default: #5eff8c)
  bodyColor?: string // Main flame body (default: #1d6600)
  sparkColor?: string // Floating embers color (default: #5eff8c)
  darkness?: number // Multiplier (0.7 - 1.0) to make it slightly darker if desired
  interactive?: boolean // Mouse creates extra heat & sparks
}

// Character set sorted by perceived visual density
const DENSE_CHARSET = ' .:\'"`^,-~+;=!><i1tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$'
const SPARK_CHARS = ['+', '*', '·', 'x', '•', '+']

export const GlyphEmber = memo(function GlyphEmber({
  className = '',
  style,
  heightRatio = 0.45,
  glyphSize = 11,
  coreColor = '#5eff8c',
  bodyColor = '#1d6600',
  sparkColor = '#5eff8c',
  darkness = 0.9,
  interactive = true,
}: GlyphEmberProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1, y: -1, active: false })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animId: number
    let width = 0
    let height = 0
    let cols = 0
    let rows = 0
    const charW = Math.round(glyphSize * 0.62)
    const charH = glyphSize + 2

    // 2D heat buffer (normalized 0.0 to 1.0)
    let heat: Float32Array
    let nextHeat: Float32Array

    // Floating spark particles (+, *, ·)
    interface Spark {
      x: number
      y: number
      vx: number
      vy: number
      char: string
      size: number
      alpha: number
      maxAlpha: number
      wobbleSeed: number
      wobbleSpeed: number
      life: number
      maxLife: number
    }
    const sparks: Spark[] = []
    const MAX_SPARKS = 36

    const spawnSpark = (startX?: number, startY?: number) => {
      const sx = startX !== undefined ? startX : Math.random() * width
      const sy = startY !== undefined ? startY : height - Math.random() * (height * heightRatio * 0.7)
      const maxLife = 140 + Math.random() * 160
      sparks.push({
        x: sx,
        y: sy,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(0.5 + Math.random() * 0.9),
        char: SPARK_CHARS[Math.floor(Math.random() * SPARK_CHARS.length)],
        size: Math.random() > 0.4 ? glyphSize : glyphSize * 0.85,
        alpha: 0,
        maxAlpha: 0.6 + Math.random() * 0.4,
        wobbleSeed: Math.random() * 100,
        wobbleSpeed: 0.03 + Math.random() * 0.03,
        life: 0,
        maxLife,
      })
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = Math.floor(rect.width) || window.innerWidth
      height = Math.floor(rect.height) || window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      cols = Math.ceil(width / charW)
      rows = Math.ceil(height / charH)
      heat = new Float32Array(cols * rows)
      nextHeat = new Float32Array(cols * rows)
    }

    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    // Pre-parse colors for interpolation
    const parseHex = (hex: string) => {
      const cleaned = hex.replace('#', '')
      const full = cleaned.length === 3 ? cleaned.split('').map(c => c + c).join('') : cleaned
      const num = parseInt(full, 16)
      return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
    }
    const cCore = parseHex(coreColor)
    const cBody = parseHex(bodyColor)

    let frameCount = 0
    let lastTime = performance.now()

    const render = (now: number) => {
      animId = requestAnimationFrame(render)

      // Cap simulation update to ~40fps for authentic cellular flow & low CPU usage
      const dt = now - lastTime
      if (dt < 22) return
      lastTime = now
      frameCount++

      if (cols === 0 || rows === 0) return

      // ── Step 1: Generate bottom flame bed ──
      // Bed height is 2 rows at the bottom
      const bottomRow = rows - 1
      const secondBottom = rows - 2

      for (let x = 0; x < cols; x++) {
        // Multi-frequency wave to produce organic tongues of fire
        const wave1 = Math.sin(x * 0.12 + frameCount * 0.08)
        const wave2 = Math.cos(x * 0.28 - frameCount * 0.05)
        const wave3 = Math.sin(x * 0.04 + frameCount * 0.02)
        const noise = (wave1 * 0.35 + wave2 * 0.25 + wave3 * 0.4 + 1) * 0.5

        // Base heat with flicker
        const flicker = (Math.sin(frameCount * 0.2 + x * 0.5) + 1) * 0.15
        const baseIntensity = Math.min(1.0, Math.max(0.65, noise * 0.8 + 0.2 + flicker))

        heat[bottomRow * cols + x] = baseIntensity
        if (secondBottom >= 0) {
          heat[secondBottom * cols + x] = Math.min(1.0, baseIntensity * (0.85 + Math.random() * 0.15))
        }
      }

      // Mouse heat injection
      if (interactive && mouseRef.current.active) {
        const mx = mouseRef.current.x
        const my = mouseRef.current.y
        const mCol = Math.floor(mx / charW)
        const mRow = Math.floor(my / charH)
        const radius = 4
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const cx = mCol + dx
            const cy = mRow + dy
            if (cx >= 0 && cx < cols && cy >= 0 && cy < rows) {
              const dist = Math.sqrt(dx * dx + dy * dy)
              if (dist <= radius) {
                const add = (1 - dist / radius) * 0.5
                heat[cy * cols + cx] = Math.min(1.0, heat[cy * cols + cx] + add)
              }
            }
          }
        }
      }

      // ── Step 2: Propagate heat upward (convection & diffusion) ──
      // Cooling factor determines how high the fire climbs
      // Height ratio 0.45 means it cools down by ~0.45 of total height
      const flameMaxRows = Math.floor(rows * heightRatio)
      const baseDecay = 1.0 / Math.max(12, flameMaxRows * 1.35)

      for (let y = 0; y < rows - 1; y++) {
        for (let x = 0; x < cols; x++) {
          const xLeft = (x - 1 + cols) % cols
          const xRight = (x + 1) % cols
          const belowY = y + 1
          const below2Y = Math.min(rows - 1, y + 2)

          // Sample heat from below with horizontal drift
          const hBelow = heat[belowY * cols + x]
          const hLeft = heat[belowY * cols + xLeft]
          const hRight = heat[belowY * cols + xRight]
          const hDeep = heat[below2Y * cols + x]

          // Small natural upward flutter
          const flutter = (Math.sin(x * 0.3 + y * 0.2 + frameCount * 0.1) * 0.5 + 0.5) * 0.015
          const decay = (baseDecay + flutter) * (1.0 + (rows - y) / rows * 0.2)

          let avg = (hBelow * 0.48 + hLeft * 0.2 + hRight * 0.2 + hDeep * 0.12) - decay
          if (avg < 0) avg = 0

          nextHeat[y * cols + x] = avg
        }
      }

      // Swap buffers
      for (let i = 0; i < (rows - 1) * cols; i++) {
        heat[i] = nextHeat[i]
      }

      // ── Step 3: Clear and Render ──
      ctx.clearRect(0, 0, width, height)
      ctx.font = `600 ${glyphSize}px 'Fira Code', 'Cascadia Code', 'Consolas', 'Courier New', monospace`
      ctx.textBaseline = 'top'

      const charsetLen = DENSE_CHARSET.length

      // Draw ASCII grid
      for (let y = rows - flameMaxRows - 4; y < rows; y++) {
        if (y < 0) continue
        const py = y * charH

        for (let x = 0; x < cols; x++) {
          const val = heat[y * cols + x]
          if (val <= 0.04) continue

          const px = x * charW

          // Pick glyph from density charset
          const charIndex = Math.min(charsetLen - 1, Math.floor(val * (charsetLen - 1)))
          const char = DENSE_CHARSET[charIndex]
          if (char === ' ') continue

          // Color interpolation:
          // val ~ 0.04 - 0.3: deep body green (applied darkness)
          // val ~ 0.3 - 0.7: emerald body green
          // val ~ 0.7 - 0.95: bright neon mint green
          // val ~ 0.95 - 1.0: white-hot green
          let r = cBody.r
          let g = cBody.g
          let b = cBody.b
          let alpha = Math.min(1.0, val * 1.3)

          if (val > 0.8) {
            // Hot core: blend from body to bright mint to white
            const t = (val - 0.8) / 0.2
            r = Math.round(cCore.r + (255 - cCore.r) * t * 0.75)
            g = Math.round(cCore.g + (255 - cCore.g) * t * 0.75)
            b = Math.round(cCore.b + (255 - cCore.b) * t * 0.75)
            alpha = 1.0
          } else if (val > 0.4) {
            // Mid flame: blend from body to core
            const t = (val - 0.4) / 0.4
            r = Math.round(cBody.r + (cCore.r - cBody.r) * t)
            g = Math.round(cBody.g + (cCore.g - cBody.g) * t)
            b = Math.round(cBody.b + (cCore.b - cBody.b) * t)
          } else {
            // Cooler tips: dark body color scaled by darkness
            r = Math.round(cBody.r * darkness * (val / 0.4 + 0.3))
            g = Math.round(cBody.g * darkness * (val / 0.4 + 0.3))
            b = Math.round(cBody.b * darkness * (val / 0.4 + 0.3))
            alpha = Math.max(0.18, val * 1.5)
          }

          ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
          ctx.fillText(char, px, py)
        }
      }

      // ── Step 4: Update & Draw Floating Embers (+, *, ·) ──
      // Periodically spawn new embers near active flames
      if (sparks.length < MAX_SPARKS && Math.random() < 0.35) {
        spawnSpark()
      }

      // Draw embers with soft glow
      ctx.save()
      ctx.shadowColor = sparkColor
      ctx.shadowBlur = 6

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.life++
        if (s.life >= s.maxLife || s.y < 0) {
          sparks.splice(i, 1)
          continue
        }

        // Wobble physics
        s.wobbleSeed += s.wobbleSpeed
        s.x += s.vx + Math.sin(s.wobbleSeed) * 0.45
        s.y += s.vy

        // Fade in, then gradual fade out
        const progress = s.life / s.maxLife
        if (progress < 0.15) {
          s.alpha = (progress / 0.15) * s.maxAlpha
        } else {
          s.alpha = (1 - (progress - 0.15) / 0.85) * s.maxAlpha
        }

        ctx.font = `700 ${s.size}px 'Fira Code', 'Consolas', monospace`
        ctx.fillStyle = `rgba(${cCore.r},${cCore.g},${cCore.b},${s.alpha})`
        ctx.fillText(s.char, s.x, s.y)
      }
      ctx.restore()
    }

    animId = requestAnimationFrame(render)

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      }
      if (Math.random() < 0.4) {
        spawnSpark(e.clientX - rect.left, e.clientY - rect.top)
      }
    }

    const onMouseLeave = () => {
      mouseRef.current.active = false
    }

    window.addEventListener('resize', resize)
    if (interactive) {
      canvas.addEventListener('mousemove', onMouseMove)
      canvas.addEventListener('mouseleave', onMouseLeave)
    }

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      resizeObserver.disconnect()
      if (interactive) {
        canvas.removeEventListener('mousemove', onMouseMove)
        canvas.removeEventListener('mouseleave', onMouseLeave)
      }
    }
  }, [heightRatio, glyphSize, coreColor, bodyColor, sparkColor, darkness, interactive])

  return (
    <div className={`glyph-ember-container ${className}`} style={style} aria-hidden="true">
      <canvas ref={canvasRef} className="glyph-ember-canvas" />
      <div className="glyph-ember-vignette" />
    </div>
  )
})
