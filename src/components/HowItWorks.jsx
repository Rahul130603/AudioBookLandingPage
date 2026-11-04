import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Headphones, Sparkles, Waves } from 'lucide-react'
import TiltCard from './TiltCard'
import Waveform from './Waveform'
import { HOW_IT_WORKS } from '../lib/data'
import { Reveal, SectionHeading } from './Reveal'

function UploadVisual() {
  return (
    <div className="step-visual step-visual--upload" aria-hidden="true">
      <div className="upload-portal">
        <span className="upload-portal__orbit" />
        <span className="upload-portal__orbit upload-portal__orbit--2" />
        <span className="upload-portal__core">
          <ArrowUpRight size={22} strokeWidth={1.3} />
        </span>
      </div>
      <div className="flying-book">
        <span className="flying-book__back" />
        <span className="flying-book__pages" />
        <span className="flying-book__cover">
          <span className="flying-book__brand">CH.</span>
          <span className="flying-book__title">THE<br />UNSEEN</span>
          <span className="flying-book__line" />
        </span>
      </div>
      <span className="step-particle step-particle--1" />
      <span className="step-particle step-particle--2" />
      <span className="step-particle step-particle--3" />
      <div className="absolute bottom-4 left-5 flex items-center gap-2 font-mono text-[0.46rem] uppercase tracking-[0.21em] text-bone/90">
        <span className="h-1 w-1 rounded-full bg-orange" />
        Manuscript detected
      </div>
    </div>
  )
}

function VoiceVisual() {
  const reduce = useReducedMotion()
  return (
    <div className="step-visual step-visual--voice" aria-hidden="true">
      <div className="voice-halo" />
      <div className="voice-rings">
        <span />
        <span />
        <span />
      </div>
      <div className="relative z-[2] flex flex-col items-center gap-5">
        <div className="flex items-end gap-1.5 font-display text-[1.1rem] font-light tracking-[0.3em] text-bone/84">
          <motion.span
            animate={reduce ? undefined : { opacity: [0.15, 0.55, 0.15], y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            T
          </motion.span>
          <motion.span
            animate={reduce ? undefined : { opacity: [0.2, 0.7, 0.2], y: [0, -8, 0] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          >
            E
          </motion.span>
          <motion.span
            animate={reduce ? undefined : { opacity: [0.12, 0.6, 0.12], y: [0, -3, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          >
            X
          </motion.span>
          <motion.span
            animate={reduce ? undefined : { opacity: [0.18, 0.78, 0.18], y: [0, -7, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
          >
            T
          </motion.span>
        </div>
        <div className="voice-wave">
          <Waveform bars={34} playing={!reduce} height="6.2rem" seed={4} />
        </div>
        <div className="inline-flex items-center gap-2 border border-orange/25 bg-orange/[0.06] px-3 py-1.5 font-mono text-[0.46rem] uppercase tracking-[0.2em] text-gold/80">
          <Waves size={10} />
          Synthesising voice
        </div>
      </div>
      <span className="voice-spark voice-spark--1" />
      <span className="voice-spark voice-spark--2" />
      <span className="voice-spark voice-spark--3" />
    </div>
  )
}

function HeadphoneVisual() {
  return (
    <div className="step-visual step-visual--listen" aria-hidden="true">
      <div className="listen-rings">
        <span />
        <span />
        <span />
      </div>
      <svg viewBox="0 0 300 250" className="headphone-art" fill="none">
        <defs>
          <linearGradient id="hp-band" x1="40" y1="30" x2="250" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4b2a16" />
            <stop offset="0.45" stopColor="#FFB15C" />
            <stop offset="0.7" stopColor="#FF6B27" />
            <stop offset="1" stopColor="#3a2113" />
          </linearGradient>
          <linearGradient id="hp-cup" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#2b1a10" />
            <stop offset="0.55" stopColor="#0d0a08" />
            <stop offset="1" stopColor="#4a2b15" />
          </linearGradient>
          <linearGradient id="hp-pad" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#1a120d" />
            <stop offset="0.5" stopColor="#5a3920" />
            <stop offset="1" stopColor="#1a120d" />
          </linearGradient>
          <filter id="hp-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <path
          d="M52 151v-35c0-55 44-96 98-96s98 41 98 96v35"
          stroke="url(#hp-band)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M53 151v-35c0-54 43-94 97-94s97 40 97 94v35"
          stroke="rgba(255,255,255,.12)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <g filter="url(#hp-glow)">
          <rect x="27" y="126" width="59" height="91" rx="26" fill="url(#hp-cup)" stroke="#6d4329" />
          <rect x="214" y="126" width="59" height="91" rx="26" fill="url(#hp-cup)" stroke="#6d4329" />
          <rect x="39" y="139" width="35" height="65" rx="17" fill="url(#hp-pad)" />
          <rect x="226" y="139" width="35" height="65" rx="17" fill="url(#hp-pad)" />
        </g>
        <circle cx="56.5" cy="171.5" r="7" fill="#FF6B27" fillOpacity="0.85" />
        <circle cx="243.5" cy="171.5" r="7" fill="#FF6B27" fillOpacity="0.85" />
        <path d="M122 166h13M146 158v20M158 147v42M170 160v24M182 169h12" stroke="#FFB15C" strokeOpacity="0.42" strokeLinecap="round" />
      </svg>
      <div className="absolute bottom-5 left-5 flex items-center gap-2 font-mono text-[0.46rem] uppercase tracking-[0.21em] text-bone/90">
        <Headphones size={10} className="text-gold/50" />
        Chapter II · 00:42
      </div>
      <span className="listen-spark listen-spark--1" />
      <span className="listen-spark listen-spark--2" />
    </div>
  )
}

const VISUALS = {
  upload: UploadVisual,
  voice: VoiceVisual,
  listen: HeadphoneVisual,
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden border-b border-bone/[0.06] py-[clamp(6rem,10vw,10rem)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-15%] top-[20%] h-[32rem] w-[32rem] rounded-full bg-orange/[0.045] blur-[120px]" />
        <div className="absolute right-[-10%] bottom-0 h-[24rem] w-[24rem] rounded-full bg-gold/[0.035] blur-[100px]" />
      </div>
      <div className="container-x relative">
        <div className="grid grid-cols-12 items-end gap-8">
          <SectionHeading
            className="col-span-12 lg:col-span-8"
            eyebrow="The experience / 01 — 03"
            title={
              <>
                From paper to a voice,
                <br />
                <span className="text-shine">in three movements.</span>
              </>
            }
          />
          <Reveal delay={0.2} className="col-span-12 lg:col-span-4 lg:pb-2">
            <p className="max-w-sm border-l border-bone/10 pl-5 text-sm leading-7 text-smoke lg:ml-auto">
              A manuscript is not just text. It is pace, silence, and breath. Chaptera listens for all three, then gives them back to you.
            </p>
            <div className="mt-6 flex items-center gap-3 font-mono text-[0.5rem] uppercase tracking-[0.23em] text-bone/84 lg:justify-end">
              <Sparkles size={11} className="text-orange/70" />
              The ritual of listening
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden border border-bone/[0.08] md:grid-cols-3 lg:mt-20">
          {HOW_IT_WORKS.map((step, index) => {
            const Visual = VISUALS[step.glyph]
            return (
              <Reveal key={step.number} delay={index * 0.09} className="h-full">
                <TiltCard intensity={4.5} className="h-full">
                  <article className="group relative flex h-full min-h-[34rem] flex-col overflow-hidden bg-coal p-6 sm:p-8">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(255,107,39,0.09),transparent_60%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                    <div className="relative flex items-start justify-between">
                      <span className="font-display text-[0.68rem] font-medium tracking-[0.18em] text-gold/80">
                        STEP {step.number}
                      </span>
                      <span className="font-mono text-[0.46rem] uppercase tracking-[0.2em] text-bone/38">
                        {String(index + 1).padStart(2, '0')} / 03
                      </span>
                    </div>

                    <Visual />

                    <div className="relative mt-auto pt-8">
                      <p className="font-mono text-[0.49rem] uppercase tracking-[0.22em] text-orange/60">
                        {step.subtitle}
                      </p>
                      <h3 className="display mt-3 text-[clamp(1.55rem,2.4vw,2.1rem)] text-bone">
                        {step.title}
                      </h3>
                      <p className="mt-4 max-w-sm text-[0.83rem] leading-6 text-smoke">{step.copy}</p>
                      <div className="mt-6 flex items-center justify-between border-t border-bone/[0.08] pt-4">
                        <div className="flex items-center gap-3">
                          {step.meta.map((item) => (
                            <span
                              key={item}
                              className={`text-[0.48rem] font-medium uppercase tracking-[0.15em] text-bone/88 ${
                                item === 'தமிழ்' ? 'font-tamil text-[0.6rem]' : ''
                              } ${item === 'اردو' ? 'font-urdu text-[0.66rem]' : ''}`}
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                        <ArrowUpRight
                          size={15}
                          className="text-bone/38 transition-all duration-500 group-hover:rotate-45 group-hover:text-orange"
                        />
                      </div>
                    </div>
                  </article>
                </TiltCard>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
