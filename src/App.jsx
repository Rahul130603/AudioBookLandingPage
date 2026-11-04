import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from 'framer-motion'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import HowItWorks from './components/HowItWorks'
import Languages from './components/Languages'
import Studio from './components/Studio'
import Player from './components/Player'
import FeaturedBooks from './components/FeaturedBooks'
import Features from './components/Features'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const reduce = useReducedMotion()
  const root = useRef(null)

  useEffect(() => {
    if (reduce) return undefined

    const onAnchorClick = (event) => {
      const anchor = event.target.closest('a[href^="#"]')
      if (!anchor) return
      const hash = anchor.getAttribute('href')
      if (!hash || hash === '#') return
      const target = document.querySelector(hash)
      if (!target) return
      event.preventDefault()
      const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 76
      window.scrollTo({
        top: window.scrollY + target.getBoundingClientRect().top - headerHeight,
        behavior: 'smooth',
      })
      window.history.pushState(null, '', hash)
    }

    document.addEventListener('click', onAnchorClick)

    return () => {
      document.removeEventListener('click', onAnchorClick)
    }
  }, [reduce])

  useEffect(() => {
    if (reduce) return undefined
    const context = gsap.context(() => {
      gsap.to('.hero-stage', {
        yPercent: 13,
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: {
          trigger: '#home',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
      })

      gsap.to('.hero-content', {
        opacity: 0.5,
        yPercent: -4,
        ease: 'none',
        scrollTrigger: {
          trigger: '#home',
          start: '12% top',
          end: 'bottom top',
          scrub: 0.6,
        },
      })

      gsap.fromTo(
        '.footer-word',
        { yPercent: 26, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.footer-word',
            start: 'top 96%',
            once: true,
          },
        },
      )

      ScrollTrigger.refresh()
    }, root)

    return () => context.revert()
  }, [reduce])

  return (
    <div ref={root} className="relative min-h-screen overflow-x-clip bg-transparent">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <CustomCursor />
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <Nav />
      <main id="main">
        <Hero />
        <Marquee />
        <HowItWorks />
        <Languages />
        <Studio />
        <Player />
        <FeaturedBooks />
        <Features />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
