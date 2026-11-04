import { useMemo, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight, Headphones } from 'lucide-react'
import { FEATURED_BOOKS } from '../lib/data'
import BookCover from './BookCover'
import Waveform from './Waveform'
import { Reveal } from './Reveal'

const BOOK = FEATURED_BOOKS[0]

export default function FinalCTA() {
  const sectionRef = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  })

  const rawCover = useTransform(scrollYProgress, [0.05, 0.78], [-62, -1.5])
  const coverRotation = useSpring(rawCover, { stiffness: 55, damping: 18, mass: 0.7 })
  const rawTilt = useTransform(scrollYProgress, [0, 1], [22, 7])
  const bookTilt = useSpring(rawTilt, { stiffness: 50, damping: 18 })
  const particlesOpacity = useTransform(scrollYProgress, [0.1, 0.75], [0.9, 0.08])
  const particlesY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const waveOpacity = useTransform(scrollYProgress, [0.1, 0.65, 1], [0.18, 0.7, 1])

  const embers = useMemo(
    () =>
      Array.from({ length: 34 }, (_, index) => ({
        id: index,
        left: `${8 + ((index * 37) % 75)}%`,
        top: `${15 + ((index * 23) % 70)}%`,
        size: 1.5 + ((index * 7) % 4),
        delay: -((index * 0.47) % 7),
        duration: 5 + ((index * 3) % 5),
        drift: `${((index % 2 ? 1 : -1) * (18 + ((index * 11) % 50)))}px`,
      })),
    [],
  )

  return (
    <section
      id="begin"
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden border-b border-bone/[0.06] py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_68%_45%,rgba(255,107,39,0.16),transparent_45%)]" />
        <div className="absolute left-[-10%] top-[20%] h-[35rem] w-[35rem] rounded-full border border-bone/[0.035]" />
        <div className="absolute left-[-5%] top-[14%] h-[47rem] w-[47rem] rounded-full border border-bone/[0.025]" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="cta-book-wrap pointer-events-none absolute inset-y-0 right-[-8%] z-[1] flex w-[85%] items-center justify-end pr-4 opacity-[0.16] sm:right-[-10%] sm:w-[70%] sm:opacity-[0.2] lg:opacity-[0.26] xl:right-0 xl:w-[54%] xl:pr-6 xl:opacity-100">
        <motion.div
          className="relative h-[70vh] max-h-[46rem] w-full max-w-[36rem]"
          style={{ opacity: reduce ? 0.75 : undefined }}
        >
          <div className="cta-book-glow" />
          <div className="cta-book-stage">
            <motion.div
              className="cta-book"
              style={{ rotateY: reduce ? -36 : bookTilt, rotateX: reduce ? 7 : 10, transformStyle: 'preserve-3d' }}
            >
              <div className="cta-book__back" />
              <div className="cta-book__pages" />
              <div className="cta-book__inside">
                <div className="cta-page">
                  <span className="cta-page__eyebrow">Chaptera / Every book has a voice</span>
                  <span className="cta-page__title">
                    LISTEN
                    <br />
                    <span>TO THE</span>
                    <br />
                    STORY.
                  </span>
                  <span className="cta-page__rule" />
                  <p className="cta-page__copy">
                    Your books do not have to end at the last page. Give them a voice, and they will follow you into the world.
                  </p>
                  <span className="cta-page__number">PAGE 001</span>
                </div>
              </div>
              <div className="cta-book__spine" />
              <motion.div className="cta-book__cover" style={{ rotateY: reduce ? -30 : coverRotation, transformOrigin: 'left center' }}>
                <div className="cta-book__cover-face">
                  <BookCover book={BOOK} />
                </div>
                <div className="cta-book__cover-back">
                  <span>Every book has a voice.</span>
                  <span>CHAPTERA · 2026</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{ opacity: reduce ? 0.4 : particlesOpacity, y: reduce ? 0 : particlesY }}
        aria-hidden="true"
      >
        {embers.map((ember) => (
          <span
            key={ember.id}
            className="cta-ember"
            style={{
              left: ember.left,
              top: ember.top,
              width: ember.size,
              height: ember.size,
              animationDelay: `${ember.delay}s`,
              animationDuration: `${ember.duration}s`,
              '--drift': ember.drift,
            }}
          />
        ))}
      </motion.div>

      <div className="container-x relative z-10">
        <div className="max-w-[62rem]">
          <Reveal>
            <span className="eyebrow">The final page / The first listen</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="display mt-7 text-[clamp(2.7rem,5.5vw,6.2rem)] uppercase leading-[0.87] tracking-[-0.055em] text-bone">
              <span className="block">Stop reading</span>
              <span className="block">with your eyes.</span>
              <span className="mt-2 block text-shine">Start experiencing</span>
              <span className="block text-shine">with your ears.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-8 max-w-md text-[0.88rem] leading-7 text-bone/90">
              Turn the page you already love into a voice you will remember. Your first audiobook is waiting on the other side of this button.
            </p>
          </Reveal>
          <Reveal delay={0.26}>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <a href="#studio" className="btn btn-primary group">
                Create your first audiobook
                <span className="btn__icon">
                  <ArrowUpRight size={16} strokeWidth={1.8} />
                </span>
              </a>
              <span className="flex items-center gap-2 text-[0.55rem] uppercase tracking-[0.14em] text-bone/90">
                <Headphones size={12} className="text-orange/60" />
                3 languages · 4 formats · one voice
              </span>
            </div>
          </Reveal>
        </div>

        <motion.div
          className="relative mt-16 max-w-[45rem] border-t border-bone/[0.08] pt-6 sm:mt-24"
          style={{ opacity: reduce ? 0.8 : waveOpacity }}
        >
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-orange shadow-[0_0_12px_#FF6B27]" />
            <span className="font-mono text-[0.46rem] uppercase tracking-[0.22em] text-gold/55">
              And the story continues
            </span>
          </div>
          <div className="mt-4 flex items-end gap-5">
            <Waveform bars={72} height="3.2rem" playing={!reduce} color="rgba(255,107,39,.8)" seed={8} className="flex-1 justify-start" />
            <span className="hidden shrink-0 font-mono text-[0.44rem] uppercase tracking-[0.15em] text-bone/38 sm:block">
              Chaptera / 001
            </span>
          </div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-8 right-8 hidden xl:block">
        <span className="hero-vertical font-mono text-[0.47rem] uppercase tracking-[0.3em] text-bone/38">
          Scroll to close the book
        </span>
      </div>
    </section>
  )
}
