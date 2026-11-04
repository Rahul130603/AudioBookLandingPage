import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!finePointer || reduce) return undefined

    setEnabled(true)
    document.body.classList.add('custom-cursor-active')

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let ringX = x
    let ringY = y
    let raf
    let zoom = 1

    const syncZoom = () => {
      zoom = Number(getComputedStyle(document.documentElement).zoom) || 1
    }
    syncZoom()

    const onMove = (event) => {
      x = event.clientX
      y = event.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x / zoom}px, ${y / zoom}px, 0) translate(-50%, -50%)`
      }
    }

    const onOver = (event) => {
      const target = event.target.closest('a, button, [data-cursor="hover"], input, select, label')
      if (ringRef.current) {
        ringRef.current.dataset.hover = target ? 'true' : 'false'
      }
    }

    const loop = () => {
      ringX += (x - ringX) * 0.14
      ringY += (y - ringY) * 0.14
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX / zoom}px, ${ringY / zoom}px, 0) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('resize', syncZoom)
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('resize', syncZoom)
      cancelAnimationFrame(raf)
      document.body.classList.remove('custom-cursor-active')
    }
  }, [])

  if (!enabled) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[999] hidden md:block" aria-hidden="true">
      <span
        ref={dotRef}
        className="fixed left-0 top-0 h-[6px] w-[6px] rounded-full bg-orange"
      />
      <span
        ref={ringRef}
        data-hover="false"
        className="fixed left-0 top-0 h-9 w-9 rounded-full border border-bone/35 transition-[width,height,background-color,border-color] duration-300 data-[hover=true]:h-14 data-[hover=true]:w-14 data-[hover=true]:border-orange/70 data-[hover=true]:bg-orange/5"
      />
    </div>
  )
}
