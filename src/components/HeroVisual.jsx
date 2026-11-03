import { Component, lazy, Suspense, useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import BookCover from './BookCover'
import { FEATURED_BOOKS } from '../lib/data'

const HeroScene = lazy(() => import('./three/HeroScene'))

class SceneBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.warn('Chaptera 3D scene could not start:', error)
  }

  render() {
    if (this.state.failed) return this.props.fallback
    return this.props.children
  }
}

function SceneLoader() {
  return (
    <div className="loader-stage" aria-hidden="true">
      <div className="relative">
        <div className="loader-ring" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[0.5rem] uppercase tracking-[0.25em] text-gold/70">
          ch.
        </span>
      </div>
    </div>
  )
}

function StaticBook() {
  return (
    <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
      <div className="relative w-[min(58%,20rem)] -rotate-6 animate-[float-y_7s_ease-in-out_infinite]">
        <div className="absolute inset-0 scale-110 rounded-full bg-orange/25 blur-[70px]" />
        <div className="book-stage relative aspect-[0.72] w-full">
          <div className="book-3d h-full w-full" style={{ transform: 'rotateX(3deg) rotateY(-14deg)' }}>
            <div className="book-3d__pages" />
            <div className="book-3d__spine" />
            <div className="book-3d__cover">
              <BookCover book={FEATURED_BOOKS[0]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HeroVisual() {
  const reduce = useReducedMotion()
  const [canRender, setCanRender] = useState(false)

  useEffect(() => {
    let mounted = true
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
      if (mounted) setCanRender(Boolean(gl))
    } catch {
      if (mounted) setCanRender(false)
    }
    return () => {
      mounted = false
    }
  }, [])

  if (!canRender) return <StaticBook />

  return (
    <SceneBoundary fallback={<StaticBook />}>
      <Suspense fallback={<StaticBook />}>
        <HeroScene reducedMotion={Boolean(reduce)} />
      </Suspense>
    </SceneBoundary>
  )
}
