import { useEffect, useRef } from 'react'

const BAR_COUNT = 84

export default function CircularVisualizer({ audioRef, playing }) {
  const canvasRef = useRef(null)
  const playingRef = useRef(playing)
  const analyserRef = useRef(null)
  const contextRef = useRef(null)

  useEffect(() => {
    playingRef.current = playing
  }, [playing])

  useEffect(() => {
    const canvas = canvasRef.current
    const audio = audioRef.current
    if (!canvas || !audio) return undefined

    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    let analyser = null
    let audioContext = null
    let source = null
    let frequencyData = null

    if (AudioContextClass) {
      try {
        audioContext = new AudioContextClass()
        source = audioContext.createMediaElementSource(audio)
        analyser = audioContext.createAnalyser()
        analyser.fftSize = 512
        analyser.smoothingTimeConstant = 0.84
        source.connect(analyser)
        analyser.connect(audioContext.destination)
        frequencyData = new Uint8Array(analyser.frequencyBinCount)
        analyserRef.current = analyser
        contextRef.current = audioContext
      } catch (error) {
        analyser = null
        audioContext = null
        source = null
      }
    }

    const resume = () => {
      if (audioContext?.state === 'suspended') audioContext.resume().catch(() => {})
    }
    audio.addEventListener('play', resume)

    const ctx = canvas.getContext('2d')
    let frame = 0
    let width = 0
    let height = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let start = performance.now()

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    const render = (now) => {
      const w = width
      const h = height
      if (!w || !h) {
        frame = requestAnimationFrame(render)
        return
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      const cx = w / 2
      const cy = h / 2
      const unit = Math.min(w, h)
      const t = (now - start) / 1000
      const base = unit * 0.355

      if (playingRef.current && analyser) analyser.getByteFrequencyData(frequencyData)

      // Guide rings
      ctx.beginPath()
      ctx.arc(cx, cy, unit * 0.49, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255,255,255,0.045)'
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(cx, cy, unit * 0.335, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255,177,92,0.10)'
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.save()
      ctx.translate(cx, cy)
      ctx.lineCap = 'round'

      for (let i = 0; i < BAR_COUNT; i += 1) {
        const angle = (i / BAR_COUNT) * Math.PI * 2 - Math.PI / 2
        let amplitude
        if (playingRef.current && frequencyData) {
          const bin = Math.floor((i / BAR_COUNT) * frequencyData.length * 0.55)
          amplitude = frequencyData[bin] / 255
          amplitude = Math.pow(amplitude, 0.72)
        } else {
          amplitude = 0.08 + Math.abs(Math.sin(i * 0.42 + t * 0.55)) * 0.08
        }
        const slow = 0.86 + Math.sin(t * 0.4 + i * 0.25) * 0.1
        const length = unit * (0.018 + amplitude * 0.115) * slow
        const x1 = Math.cos(angle) * base
        const y1 = Math.sin(angle) * base
        const x2 = Math.cos(angle) * (base + length)
        const y2 = Math.sin(angle) * (base + length)
        const accent = i % 9 === 0 ? '255,177,92' : '255,107,39'
        const alpha = 0.14 + amplitude * 0.62

        ctx.strokeStyle = `rgba(${accent},${alpha})`
        ctx.lineWidth = i % 6 === 0 ? 2 : 1
        ctx.shadowColor = `rgba(255,107,39,${alpha * 0.65})`
        ctx.shadowBlur = i % 6 === 0 ? 10 : 4
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }

      // Tiny orbiting particles
      for (let i = 0; i < 3; i += 1) {
        const angle = t * (0.07 + i * 0.018) + i * 2.1
        const radius = unit * (0.43 + i * 0.018)
        ctx.beginPath()
        ctx.arc(Math.cos(angle) * radius, Math.sin(angle) * radius, i === 0 ? 1.6 : 1, 0, Math.PI * 2)
        ctx.fillStyle = i === 0 ? 'rgba(255,177,92,.7)' : 'rgba(255,107,39,.35)'
        ctx.shadowColor = 'rgba(255,107,39,.6)'
        ctx.shadowBlur = 8
        ctx.fill()
      }

      ctx.restore()
      frame = requestAnimationFrame(render)
    }

    frame = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      audio.removeEventListener('play', resume)
      try {
        source?.disconnect()
        analyser?.disconnect()
        audioContext?.close()
      } catch {
        // The audio context may already be closed during unmount.
      }
      analyserRef.current = null
      contextRef.current = null
    }
  }, [audioRef])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  )
}
