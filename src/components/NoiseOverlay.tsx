import { useEffect, useRef, useState } from 'react'
import './NoiseOverlay.css'

/**
 * NoiseOverlay
 * Very subtle, refined analog film static & fine grain overlay.
 * Features soft micro-specks cycled gently at ~12 FPS (80ms)
 * to provide a subtle tactile texture across the background and text
 * without being intrusive or heavy.
 */
export default function NoiseOverlay() {
  const [frames, setFrames] = useState<string[]>([])
  const [frameIndex, setFrameIndex] = useState(0)
  const isVisibleRef = useRef(true)

  // Pre-generate 6 delicate static frames
  useEffect(() => {
    const size = 160
    const generated: string[] = []

    for (let f = 0; f < 6; f++) {
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      if (!ctx) continue

      const imgData = ctx.createImageData(size, size)
      const data = imgData.data

      for (let i = 0; i < data.length; i += 4) {
        const rand = Math.random()

        if (rand < 0.5) {
          // Soft bright grain specks
          const bright = (Math.random() * 80 + 175) | 0
          data[i] = bright
          data[i + 1] = bright
          data[i + 2] = bright
          data[i + 3] = (Math.random() * 45 + 20) | 0 // Soft 20-65 alpha
        } else {
          // Soft dark grain specks
          const dark = (Math.random() * 40) | 0
          data[i] = dark
          data[i + 1] = dark
          data[i + 2] = dark
          data[i + 3] = (Math.random() * 45 + 20) | 0 // Soft 20-65 alpha
        }
      }

      ctx.putImageData(imgData, 0, 0)
      generated.push(canvas.toDataURL('image/png'))
    }

    setFrames(generated)
  }, [])

  // Gentle film flutter at ~12 FPS (80ms)
  useEffect(() => {
    if (frames.length === 0) return

    const handleVisibility = () => {
      isVisibleRef.current = !document.hidden
    }
    document.addEventListener('visibilitychange', handleVisibility)

    const timer = setInterval(() => {
      if (isVisibleRef.current) {
        setFrameIndex(prev => (prev + 1) % frames.length)
      }
    }, 80)

    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [frames])

  return (
    <div
      className="global-static-noise-overlay"
      aria-hidden="true"
      style={
        frames.length > 0
          ? { backgroundImage: `url(${frames[frameIndex]})` }
          : undefined
      }
    />
  )
}
