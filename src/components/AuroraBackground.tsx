import { useEffect, useRef, memo } from 'react'
import './AuroraBackground.css'

interface AuroraBackgroundProps {
  color?: string // Emerald color, default #10B981
  speed?: number // 0.3
  frequency?: number // 1.5
  rotation?: number // 60 deg
  fadeTop?: number // 0.80
  intensity?: number // 1.1
  dotSpacing?: number // 16
  dotRadius?: number // 0.85 (pinpoint micro-dots)
  cursorRadius?: number // 880 (wide hover field)
  cursorForce?: number // 0.22
  bulgeStrength?: number // 55
  glowRadius?: number // 480 (wide glow field)
  className?: string
  children?: React.ReactNode
}

export const AuroraBackground = memo(function AuroraBackground({
  color = '#10B981',
  speed = 0.3,
  frequency = 1.5,
  rotation = 60,
  fadeTop = 0.80,
  intensity = 1.1,
  dotSpacing = 16,
  dotRadius = 0.85,
  cursorRadius = 880,
  cursorForce = 0.22,
  bulgeStrength = 55,
  glowRadius = 480,
  className = '',
  children,
}: AuroraBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const glCanvasRef = useRef<HTMLCanvasElement>(null)
  const dotCanvasRef = useRef<HTMLCanvasElement>(null)
  const mousePos = useRef({ x: -9999, y: -9999, targetX: -9999, targetY: -9999 })

  // ── WebGL ColorBends Ribbon Layer ──
  useEffect(() => {
    const canvas = glCanvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { alpha: true, antialias: true })
    if (!gl) return

    // Parse hex color into normalized RGB
    const hex = color.replace('#', '')
    const rgb = [
      parseInt(hex.slice(0, 2), 16) / 255,
      parseInt(hex.slice(2, 4), 16) / 255,
      parseInt(hex.slice(4, 6), 16) / 255,
    ]

    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `

    // ── Water-Ripple ColorBends — 4 directional bands covering full canvas ──
    const fsSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec3 u_color;
      uniform float u_speed;
      uniform float u_freq;
      uniform float u_rotation;
      uniform float u_fadeTop;
      uniform float u_intensity;

      float hash21(vec2 p) {
        p = fract(p * vec2(234.34, 435.345));
        p += dot(p, p + 34.23);
        return fract(p.x * p.y);
      }

      float smoothNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash21(i);
        float b = hash21(i + vec2(1.0, 0.0));
        float c2 = hash21(i + vec2(0.0, 1.0));
        float d2 = hash21(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c2, d2, f.x), f.y);
      }

      float staticGrain(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;
        float t = u_time * u_speed;

        // Background: deep purplish-blue night
        vec3 bgDeep = vec3(0.040, 0.036, 0.098);
        vec3 bgMid  = vec3(0.055, 0.050, 0.135);
        float vig   = 1.0 - length(uv - 0.5) * 0.85;
        vec3 bg     = mix(bgDeep, bgMid, clamp(vig * 0.8, 0.0, 1.0));

        vec2 cp = uv - 0.5;
        cp.x *= aspect;

        float noiseVal = smoothNoise(vec2(cp.x * 1.6 + t * 0.18, cp.y * 1.3 - t * 0.15));

        // ── Band 1: primary diagonal ──
        float a1  = radians(u_rotation);
        float rA1 = cp.x * sin(a1) + cp.y * cos(a1)
                  + sin(cp.x * u_freq * 1.6 + t * 0.65) * 0.11
                  + sin(cp.y * u_freq * 1.1 - t * 0.42) * 0.08
                  + noiseVal * 0.055;
        float band1 = (pow(max(cos(rA1 * u_freq * 7.5 - t * 1.2), 0.0), 3.2)
                     + pow(max(cos(rA1 * u_freq * 3.9 - t * 0.6 + 1.8), 0.0), 4.8) * 0.32)
                    * exp(-abs(rA1) * 0.78);

        // ── Band 2: perpendicular cross ──
        float a2  = radians(u_rotation + 90.0);
        float rA2 = cp.x * sin(a2) + cp.y * cos(a2)
                  + sin(cp.x * u_freq * 1.2 + t * 0.50 + 2.1) * 0.09
                  + sin(cp.y * u_freq * 0.9 - t * 0.35 + 2.8) * 0.07
                  + noiseVal * 0.04;
        float band2 = (pow(max(cos(rA2 * u_freq * 6.8 - t * 0.85), 0.0), 3.5)
                     + pow(max(cos(rA2 * u_freq * 3.6 - t * 0.45 + 0.9), 0.0), 5.2) * 0.28)
                    * exp(-abs(rA2) * 0.72) * 0.70;

        // ── Band 3: shallow diagonal toward top-left ──
        float a3  = radians(u_rotation - 50.0);
        float rA3 = cp.x * sin(a3) + cp.y * cos(a3)
                  + sin(cp.x * u_freq * 1.0 + t * 0.40 + 4.3) * 0.08
                  + sin(cp.y * u_freq * 0.8 - t * 0.30 + 5.6) * 0.06
                  + noiseVal * 0.035;
        float band3 = (pow(max(cos(rA3 * u_freq * 5.5 - t * 0.60), 0.0), 3.8)
                     + pow(max(cos(rA3 * u_freq * 2.9 - t * 0.35 + 2.4), 0.0), 5.5) * 0.25)
                    * exp(-abs(rA3) * 0.62) * 0.62;

        // ── Band 4: near-horizontal (best for top coverage) ──
        float a4  = radians(u_rotation + 140.0);
        float rA4 = cp.x * sin(a4) + cp.y * cos(a4)
                  + sin(cp.x * u_freq * 0.9 + t * 0.35 + 1.7) * 0.07
                  + sin(cp.y * u_freq * 0.7 - t * 0.25 + 3.1) * 0.05
                  + noiseVal * 0.03;
        float band4 = (pow(max(cos(rA4 * u_freq * 4.8 - t * 0.45), 0.0), 4.0)
                     + pow(max(cos(rA4 * u_freq * 2.5 - t * 0.28 + 3.5), 0.0), 5.8) * 0.22)
                    * exp(-abs(rA4) * 0.58) * 0.58;

        float combined = clamp((band1 + band2 + band3 + band4) * u_intensity * 0.85, 0.0, 1.0);

        vec3 darkForest = vec3(0.005, 0.075, 0.045);
        vec3 midEmerald = u_color * 0.42;
        vec3 crestGlow  = u_color * 0.75;

        vec3 rippleColor = darkForest;
        rippleColor = mix(rippleColor, midEmerald, smoothstep(0.0, 0.40, combined));
        rippleColor = mix(rippleColor, crestGlow,  smoothstep(0.55, 1.0, combined) * 0.58);

        // Softer top fade — ripples visible all the way up to the navbar
        float topFade  = smoothstep(1.0, 0.68, uv.y);
        float sideFade = smoothstep(0.0, 0.06, uv.x) * smoothstep(1.0, 0.94, uv.x);
        float alpha = combined * topFade * sideFade * 0.92;

        vec3 result = mix(bg, rippleColor, clamp(alpha, 0.0, 1.0));

        float grain = staticGrain(gl_FragCoord.xy + vec2(floor(u_time * 24.0)));
        result += (grain - 0.5) * 0.015;

        gl_FragColor = vec4(clamp(result, 0.0, 1.0), 1.0);
      }
    `

    const compileShader = (type: number, src: string) => {
      const shader = gl.createShader(type)!
      gl.shaderSource(shader, src)
      gl.compileShader(shader)
      return shader
    }

    const program = gl.createProgram()!
    gl.attachShader(program, compileShader(gl.VERTEX_SHADER, vsSource))
    gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, fsSource))
    gl.linkProgram(program)
    gl.useProgram(program)

    // Quad geometry
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]), gl.STATIC_DRAW)

    const posLoc = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    const uResLoc      = gl.getUniformLocation(program, 'u_resolution')
    const uTimeLoc     = gl.getUniformLocation(program, 'u_time')
    const uColorLoc    = gl.getUniformLocation(program, 'u_color')
    const uSpeedLoc    = gl.getUniformLocation(program, 'u_speed')
    const uFreqLoc     = gl.getUniformLocation(program, 'u_freq')
    const uRotLoc      = gl.getUniformLocation(program, 'u_rotation')
    const uFadeTopLoc  = gl.getUniformLocation(program, 'u_fadeTop')
    const uIntensityLoc = gl.getUniformLocation(program, 'u_intensity')

    gl.uniform3fv(uColorLoc, rgb)
    gl.uniform1f(uSpeedLoc, speed)
    gl.uniform1f(uFreqLoc, frequency)
    gl.uniform1f(uRotLoc, rotation)
    gl.uniform1f(uFadeTopLoc, fadeTop)
    gl.uniform1f(uIntensityLoc, intensity)

    let animId: number
    const startTime = performance.now()

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25)
      const w = Math.floor(canvas.clientWidth * dpr) || window.innerWidth
      const h = Math.floor(canvas.clientHeight * dpr) || window.innerHeight
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
      gl.uniform2f(uResLoc, canvas.width, canvas.height)
    }

    resize()
    window.addEventListener('resize', resize)

    const loop = (now: number) => {
      const elapsed = (now - startTime) * 0.001
      gl.uniform1f(uTimeLoc, elapsed)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      animId = requestAnimationFrame(loop)
    }
    animId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [color, speed, frequency, rotation, fadeTop, intensity])

  // ── 2D Canvas DotField Layer (Continuous 3D Wave Flow + Batched High-Performance Rendering) ──
  useEffect(() => {
    const canvas = dotCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let width = 0
    let height = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width || window.innerWidth
      height = rect.height || window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mousePos.current.targetX = e.clientX - rect.left
      mousePos.current.targetY = e.clientY - rect.top
    }
    const handleMouseLeave = () => {
      mousePos.current.targetX = -9999
      mousePos.current.targetY = -9999
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    let time = 0

    // Constant colors for depth tiers (avoids string allocations inside 60fps loop)
    const TIER_COLORS = [
      'rgba(16, 185, 129, 0.14)', // Deep trough / distance
      'rgba(16, 185, 129, 0.32)', // Mid slope
      'rgba(52, 211, 153, 0.65)', // Wave crest
      'rgba(110, 231, 183, 0.95)', // Peak crest & interactive hover glow
    ]

    const render = () => {
      time += 0.024

      // Smooth mouse lerp
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.12
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.12

      ctx.clearRect(0, 0, width, height)

      const cols = Math.ceil(width / dotSpacing) + 2
      const rows = Math.ceil(height / dotSpacing) + 2
      const mx = mousePos.current.x
      const my = mousePos.current.y
      const curRadSq = cursorRadius * cursorRadius

      // Batched flat arrays storing [x, y, radius] for 4 draw calls total
      const b0: number[] = []
      const b1: number[] = []
      const b2: number[] = []
      const b3: number[] = []

      for (let r = 0; r < rows; r++) {
        const baseY = r * dotSpacing
        for (let c = 0; c < cols; c++) {
          const baseX = c * dotSpacing

          // ── Multi-frequency 3D Traveling Wave ──
          // Rolling diagonal swell
          const w1 = Math.sin(c * 0.14 + r * 0.08 - time * 1.5) * 8.5
          // Secondary undulating counter-wave
          const w2 = Math.cos(c * 0.08 - r * 0.13 + time * 1.0) * 6.0
          // High-frequency surface ripple
          const w3 = Math.sin((c + r) * 0.18 + time * 1.8) * 3.5

          const elevation = w1 + w2 + w3 // ~ -18 to +18

          // 3D perspective projection:
          // Vertical elevation
          let renderY = baseY + elevation
          // Subtle horizontal perspective slant
          let renderX = baseX + (elevation * 0.22)

          // Normalized elevation factor: 0.0 at deepest trough, 1.0 at highest crest
          const depth = (elevation + 18.0) / 36.0
          // 3D scale: closer crest dots are bigger, distant troughs are pinpoint
          let rRadius = dotRadius * (0.75 + depth * 0.65)
          let alpha = 0.12 + depth * 0.32

          // Cursor interactive repulsion & bloom
          const dx = renderX - mx
          const dy = renderY - my
          const distSq = dx * dx + dy * dy

          if (distSq < curRadSq && distSq > 0.01) {
            const dist = Math.sqrt(distSq)
            const push = Math.pow(1 - dist / cursorRadius, 2) * bulgeStrength * cursorForce
            renderX += (dx / dist) * push
            renderY += (dy / dist) * push

            if (dist < glowRadius) {
              const glowFactor = 1 - dist / glowRadius
              alpha = Math.min(1.0, alpha + glowFactor * 0.65)
              rRadius += glowFactor * 1.1
            }
          }

          // Bucket assignment for ultra-fast single-pass drawing
          if (alpha > 0.60) {
            b3.push(renderX, renderY, rRadius)
          } else if (alpha > 0.35) {
            b2.push(renderX, renderY, rRadius)
          } else if (alpha > 0.20) {
            b1.push(renderX, renderY, rRadius)
          } else {
            b0.push(renderX, renderY, rRadius)
          }
        }
      }

      // Draw each bucket with a single beginPath() + fill()
      const drawBucket = (coords: number[], fillStyle: string) => {
        if (coords.length === 0) return
        ctx.fillStyle = fillStyle
        ctx.beginPath()
        for (let i = 0; i < coords.length; i += 3) {
          const x = coords[i]
          const y = coords[i + 1]
          const r = coords[i + 2]
          ctx.moveTo(x + r, y)
          ctx.arc(x, y, r, 0, 6.2831853)
        }
        ctx.fill()
      }

      drawBucket(b0, TIER_COLORS[0])
      drawBucket(b1, TIER_COLORS[1])
      drawBucket(b2, TIER_COLORS[2])
      drawBucket(b3, TIER_COLORS[3])

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [dotSpacing, dotRadius, cursorRadius, cursorForce, bulgeStrength, glowRadius])

  return (
    <div ref={containerRef} className={`aurora-bg-container ${className}`}>
      {/* Layer 1: ColorBends pure emerald wave on purplish-blue night space */}
      <canvas ref={glCanvasRef} className="aurora-gl-canvas" />

      {/* Layer 2: DotField pinpoint dots */}
      <canvas ref={dotCanvasRef} className="aurora-dot-canvas" />

      {/* Radial atmospheric vignette */}
      <div className="aurora-vignette" />

      {children && <div className="aurora-content">{children}</div>}
    </div>
  )
})
