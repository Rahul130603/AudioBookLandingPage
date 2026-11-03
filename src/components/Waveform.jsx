import { useMemo } from 'react'

export default function Waveform({
  bars = 42,
  playing = false,
  className = '',
  color = 'currentColor',
  height = '3rem',
  opacity = 1,
  seed = 1,
}) {
  const heights = useMemo(() => {
    return Array.from({ length: bars }, (_, i) => {
      const wave =
        Math.abs(Math.sin(i * 0.55 + seed) * 0.55) +
        Math.abs(Math.sin(i * 0.19 + seed * 2.3) * 0.35) +
        0.12
      return Math.min(1, wave)
    })
  }, [bars, seed])

  return (
    <div
      className={`flex items-center justify-center gap-[3px] ${className}`}
      style={{ height, color, opacity }}
      aria-hidden="true"
    >
      {heights.map((h, i) => (
        <span
          key={i}
          className="block w-[2px] shrink-0 rounded-full bg-current"
          style={{
            height: `${Math.round(h * 100)}%`,
            transform: playing ? undefined : `scaleY(${h})`,
            transformOrigin: 'center',
            animation: playing ? `equalize ${0.75 + (i % 6) * 0.11}s ease-in-out ${i * 0.028}s infinite` : 'none',
            opacity: 0.55 + h * 0.45,
          }}
        />
      ))}
    </div>
  )
}
