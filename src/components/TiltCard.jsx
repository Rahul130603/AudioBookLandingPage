import { useRef } from 'react'

export default function TiltCard({
  children,
  className = '',
  intensity = 8,
  glare = true,
  scale = 1.015,
}) {
  const ref = useRef(null)
  const frame = useRef(0)

  const handleMove = (event) => {
    const node = ref.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    const rx = (0.5 - y) * intensity
    const ry = (x - 0.5) * intensity

    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      node.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`
      if (glare) {
        node.style.setProperty('--mx', `${x * 100}%`)
        node.style.setProperty('--my', `${y * 100}%`)
      }
    })
  }

  const reset = () => {
    const node = ref.current
    if (!node) return
    cancelAnimationFrame(frame.current)
    node.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)'
  }

  return (
    <div className={`tilt-wrap ${className}`}>
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        className="tilt-card h-full"
      >
        {children}
      </div>
    </div>
  )
}
