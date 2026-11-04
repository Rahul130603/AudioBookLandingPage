import { useLayoutEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ArrowDown, ArrowUpRight, Play } from 'lucide-react'
import HeroVisual from './HeroVisual'
import Waveform from './Waveform'

export default function Hero() {
  const root = useRef(null)
  const reduce = useReducedMotion()

  useLayoutEffect(() => {
    if (reduce || !root.current) return undefined
    const context = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.from('[data-hero-eyebrow]', { opacity: 0, y: 16, duration: 0.8, delay: 0.15 })
        .from('[data-hero-line]', { yPercent: 115, duration: 1.15, stagger: 0.105 }, '-=0.44')
        .from('[data-hero-copy]', { opacity: 0, y: 18, duration: 0.85 }, '-=0.62')
        .from('[data-hero-cta]', { opacity: 0, y: 14, duration: 0.65, stagger: 0.08 }, '-=0.55')
        .from('[data-hero-foot]', { opacity: 0, duration: 0.85 }, '-=0.3')
    }, root)
    return () => context.revert()
  }, [reduce])

  return (
    <section id="home" ref={root} className="hero border-b border-bone/[0.06]">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_42%,rgba(255,107,39,0.13),transparent_42%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_85%,rgba(255,177,92,0.05),transparent_38%)]" />
        <div className="grid-lines absolute inset-0 opacity-40" />
        <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="hero-stage pointer-events-none z-[1]">
        <div className="pointer-events-auto h-full w-full">
          <HeroVisual />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[46%] bg-gradient-to-t from-ink via-ink/60 to-transparent md:hidden" />
      <div className="hero-scrim pointer-events-none absolute inset-0 z-[2] hidden md:block" />

      <div className="hero-content container-x relative z-10 flex min-h-[100svh] flex-col justify-between pb-7 pt-28 sm:pt-32 lg:pb-9">
        <div className="flex flex-1 items-center">
          <div className="grid w-full grid-cols-12 items-center gap-8">
            <div className="col-span-12 xl:col-span-9">
              <div data-hero-eyebrow className="mb-8 flex flex-wrap items-center gap-4 sm:mb-10">
                <span className="inline-flex items-center gap-2 border border-bone/10 bg-coal/75 px-3 py-2 shadow-[0_10px_28px_-24px_rgba(74,43,21,0.45)] text-[0.56rem] font-medium uppercase tracking-[0.21em] text-bone/84 backdrop-blur-md">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-orange" />
                  </span>
                  Cinematic AI audiobooks
                </span>
                <span className="hidden h-px w-12 bg-bone/15 sm:block" />
                <span className="font-mono text-[0.52rem] uppercase tracking-[0.24em] text-smoke">
                  Vol. 001 — The listening edition
                </span>
              </div>

              <h1 className="hero-title text-bone">
                <span className="line">
                  <span data-hero-line>YOUR BOOKS.</span>
                </span>
                <span className="line">
                  <span data-hero-line>
                    YOUR <span className="serif-accent font-normal text-bone/90">VOICE.</span>
                  </span>
                </span>
                <span className="line">
                  <span data-hero-line className="text-shine">YOUR WORLD.</span>
                </span>
              </h1>

              <div className="mt-9 flex flex-col gap-8 sm:mt-11 xl:flex-row xl:items-end xl:gap-12">
                <div data-hero-copy className="max-w-[31rem]">
                  <div className="mb-5 h-px w-16 bg-gradient-to-r from-orange to-transparent" />
                  <p className="text-balance text-[0.95rem] leading-[1.8] text-bone/88">
                    Transform any book into an immersive audiobook experience.
                    Upload, convert, and listen in{' '}
                    <span className="text-bone">English</span>,{' '}
                    <span className="font-tamil text-bone" lang="ta">Tamil</span>, and{' '}
                    <span className="font-urdu text-[1.05rem] leading-loose text-bone" lang="ur">Urdu</span>.
                  </p>
                </div>

                <div className="flex flex-wrap items-stretch gap-3">
                  <a href="#player" data-hero-cta className="btn btn-primary group">
                    Start listening
                    <span className="btn__icon">
                      <Play size={15} fill="currentColor" strokeWidth={0} />
                    </span>
                  </a>
                  <a href="#studio" data-hero-cta className="btn btn-ghost group">
                    Upload your book
                    <span className="btn__icon">
                      <ArrowUpRight size={16} strokeWidth={1.8} />
                    </span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div data-hero-foot className="mt-16 border-t border-bone/[0.09] pt-5">
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <div className="hero-meta">
                <span className="mb-1 block font-mono text-[0.48rem] uppercase tracking-[0.2em] text-smoke/70">
                  Languages
                </span>
                <div className="flex items-baseline gap-4 text-[0.7rem] font-medium tracking-wide text-bone/88">
                  <span>EN</span>
                  <span className="font-tamil text-[0.78rem]">தமிழ்</span>
                  <span className="font-urdu text-[0.84rem]">اردو</span>
                </div>
              </div>
              <div className="hero-meta hidden sm:block">
                <span className="mb-1 block font-mono text-[0.48rem] uppercase tracking-[0.2em] text-smoke/70">
                  Formats
                </span>
                <div className="flex items-baseline gap-3 text-[0.7rem] font-medium tracking-wide text-bone/88">
                  <span>PDF</span>
                  <span>EPUB</span>
                  <span>TXT</span>
                  <span>DOCX</span>
                </div>
              </div>
              <div className="hero-meta hidden md:block">
                <span className="mb-1 block font-mono text-[0.48rem] uppercase tracking-[0.2em] text-smoke/70">
                  The promise
                </span>
                <span className="text-[0.7rem] font-medium tracking-wide text-bone/88">
                  Every page, spoken beautifully.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden items-center gap-3 sm:flex">
                <span className="font-mono text-[0.48rem] uppercase tracking-[0.2em] text-smoke/70">Now in the studio</span>
                <Waveform bars={22} height="1.6rem" className="w-24 text-orange/80" seed={2} />
              </div>
              <a href="#how-it-works" className="hero-scroll group">
                <span className="flex flex-col items-start gap-1">
                  <span>Scroll to enter</span>
                  <ArrowDown size={13} className="text-orange transition-transform duration-500 group-hover:translate-y-1" />
                </span>
                <span className="hero-scroll__track" />
              </a>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
