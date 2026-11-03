import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Pause, Volume2 } from 'lucide-react'
import { LANGUAGES } from '../lib/data'
import useSpeech from '../hooks/useSpeech'
import Waveform from './Waveform'
import { Reveal, SectionHeading } from './Reveal'

function LanguageCard({ language, index, active, setActive, speech }) {
  const isPlaying = speech.speaking && speech.speakingId === `language-${language.id}`
  const [unavailable, setUnavailable] = useState('')

  const handleListen = (event) => {
    event.stopPropagation()
    if (isPlaying) {
      speech.stop()
      return
    }
    setUnavailable('')
    speech.speak({
      text: language.sample,
      langCode: language.code,
      id: `language-${language.id}`,
      onNotice: setUnavailable,
    })
  }

  return (
    <article
      className="language-card group"
      onMouseEnter={() => setActive(language.id)}
      onFocus={() => setActive(language.id)}
    >
      <div className="absolute inset-x-0 top-0 z-[2] flex items-center justify-between border-b border-white/[0.08] p-5 sm:p-6" dir="ltr">
        <span className="font-mono text-[0.49rem] uppercase tracking-[0.2em] text-gold/70">
          {language.eyebrow}
        </span>
        <button
          type="button"
          onClick={handleListen}
          className="group/voice inline-flex items-center gap-2 border-b border-white/15 pb-1 text-[0.48rem] font-medium uppercase tracking-[0.16em] text-bone/45 transition-colors hover:border-orange hover:text-gold"
          aria-label={isPlaying ? `Stop ${language.display} voice sample` : `Hear a line in ${language.display}`}
        >
          {isPlaying ? <Pause size={9} fill="currentColor" /> : <Volume2 size={11} />}
          {isPlaying ? 'Playing' : 'Hear a line'}
        </button>
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.065]"
        style={{
          background: `radial-gradient(circle at 80% 26%, ${language.accent}, transparent 38%)`,
        }}
      />
      <span
        className="pointer-events-none absolute -bottom-16 right-[-1rem] select-none font-display text-[16rem] leading-none text-white/[0.025]"
        aria-hidden="true"
      >
        {language.script}
      </span>

      <div className="relative z-[2] flex h-full flex-col px-5 pb-6 pt-20 sm:px-6">
        <div className="flex items-start justify-between" dir="ltr">
          <span className="font-mono text-[0.47rem] uppercase tracking-[0.2em] text-bone/25">
            0{index + 1} / 03
          </span>
          <span className="font-mono text-[0.47rem] uppercase tracking-[0.14em] text-bone/25">
            {language.voices}
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-center py-8">
          <div
            dir={language.directions}
            className={`language-card__glyph ${language.directions === 'rtl' ? 'text-right font-urdu leading-[1.7]' : language.code === 'ta' ? 'font-tamil' : 'font-display'}`}
          >
            <span className="block text-[clamp(3.4rem,5.6vw,5.4rem)] leading-none tracking-[-0.05em] text-bone">
              {language.display}
            </span>
            <span className="mt-3 block text-[0.55rem] uppercase tracking-[0.26em] text-white/25">
              {language.label} / {language.code}
            </span>
          </div>

          <div className="language-card__wave mt-7">
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-orange/60 to-transparent" />
              <span className="font-mono text-[0.43rem] uppercase tracking-[0.17em] text-orange/70">
                Voice waveform
              </span>
            </div>
            <Waveform
              bars={35}
              playing={active === language.id || isPlaying}
              height="2.5rem"
              color={language.accent}
              seed={index + 2}
              className="mt-4 justify-start"
              opacity={0.8}
            />
          </div>
        </div>

        <div className="border-t border-white/[0.08] pt-5">
          <p
            dir={language.directions}
            className={`max-w-[24rem] text-[0.84rem] leading-7 text-bone/65 ${
              language.directions === 'rtl' ? 'ml-auto text-right font-urdu leading-[2.4]' : language.code === 'ta' ? 'font-tamil leading-8' : ''
            }`}
          >
            {language.description}
          </p>
          <div className="mt-5 flex items-center justify-between gap-4">
            <span className="text-[0.55rem] uppercase tracking-[0.14em] text-bone/32">
              {language.code === 'en' ? 'Natural & cinematic' : language.descriptionEn}
            </span>
            <a
              href="#studio"
              className="group/link inline-flex shrink-0 items-center gap-2 text-[0.52rem] font-semibold uppercase tracking-[0.15em] text-gold/80 transition-colors hover:text-orange"
              aria-label={`Create an audiobook in ${language.label}`}
            >
              Use voice
              <ArrowUpRight size={13} className="transition-transform duration-300 group-hover/link:rotate-45" />
            </a>
          </div>
          <AnimatePresence>
            {unavailable ? (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 text-[0.58rem] leading-5 text-orange/70"
              >
                {unavailable}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </article>
  )
}

export default function Languages() {
  const [active, setActive] = useState('english')
  const speech = useSpeech()

  return (
    <section id="languages" className="relative overflow-hidden border-b border-white/[0.06] py-[clamp(6rem,10vw,10rem)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="ambient-orb right-[-10%] top-[12%] h-[35rem] w-[35rem] bg-orange/[0.06]" />
        <div className="absolute left-1/2 top-1/2 h-[45rem] w-[45rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.035]" />
        <div className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.025]" />
        <div className="absolute left-1/2 top-1/2 h-[58rem] w-[58rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/[0.025]" />
      </div>

      <div className="container-x relative">
        <SectionHeading
          eyebrow="The languages / EN · தமிழ் · اردو"
          title={
            <>
              One platform. Three languages.
              <br />
              <span className="text-shine">Endless stories.</span>
            </>
          }
          copy="A story is never only its words. It is the cadence of the voice that carries them. Choose a language, and let the pages sound like home."
        />

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3 lg:mt-20">
          {LANGUAGES.map((language, index) => (
            <Reveal key={language.id} delay={index * 0.08}>
              <LanguageCard
                language={language}
                index={index}
                active={active}
                setActive={setActive}
                speech={speech}
              />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-col justify-between gap-4 border-t border-white/[0.08] pt-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gold/30">
                <Volume2 size={10} className="text-gold/80" />
              </span>
              <p className="text-[0.62rem] leading-5 text-smoke">
                Native tongue, natural rhythm. Every language is voiced by a dedicated neural narrator.
              </p>
            </div>
            <span className="font-mono text-[0.47rem] uppercase tracking-[0.19em] text-bone/25">
              More languages entering the studio soon
            </span>
          </div>
        </Reveal>

        <AnimatePresence>
          {speech.notice ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="fixed bottom-6 left-1/2 z-[95] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 border border-orange/30 bg-[#130c08]/95 px-4 py-3 text-center text-[0.65rem] leading-5 text-bone/75 shadow-2xl backdrop-blur-xl"
              role="status"
            >
              {speech.notice}
              <button
                type="button"
                className="ml-3 text-orange underline underline-offset-2"
                onClick={() => speech.setNotice('')}
              >
                Dismiss
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  )
}
