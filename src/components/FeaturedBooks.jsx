import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Pause, Play, Volume2 } from 'lucide-react'
import { FEATURED_BOOKS } from '../lib/data'
import useSpeech from '../hooks/useSpeech'
import BookCover from './BookCover'
import { Reveal, SectionHeading } from './Reveal'

function BookPreviewButton({ book, speech, isPlaying, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-2 border border-white/15 bg-ink/60 px-3 py-2 text-[0.49rem] font-medium uppercase tracking-[0.12em] text-bone/70 backdrop-blur-md transition-colors hover:border-gold/40 hover:text-gold"
      aria-label={isPlaying ? `Pause preview of ${book.title}` : `Hear a line from ${book.title}`}
    >
      {isPlaying ? <Pause size={11} fill="currentColor" /> : <Volume2 size={11} />}
      {isPlaying ? 'Playing' : 'Hear a line'}
    </button>
  )
}

function FeaturedBookCard({ book, index, speech, activeId, setActiveId, setNotice }) {
  const cardRef = useRef(null)
  const stageRef = useRef(null)
  const isPlaying = speech.speaking && speech.speakingId === `feature-${book.id}`

  const handleMove = (event) => {
    const node = stageRef.current
    if (!node) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    node.style.transform = `rotateX(${4 - y * 10}deg) rotateY(${-15 + x * 14}deg) translateY(-7px) scale(1.02)`
    node.style.setProperty('--glow-x', `${(x + 0.5) * 100}%`)
    node.style.setProperty('--glow-y', `${(y + 0.5) * 100}%`)
  }

  const handleLeave = () => {
    const node = stageRef.current
    if (!node) return
    node.style.transform = 'rotateX(3deg) rotateY(-15deg) translateY(0) scale(1)'
    setActiveId(null)
  }

  const togglePreview = (event) => {
    event.stopPropagation()
    if (isPlaying) {
      speech.stop()
      return
    }
    setActiveId(book.id)
    speech.speak({
      text: book.sample,
      langCode: book.langCode === 'த' ? 'ta' : book.langCode === 'اردو' ? 'ur' : 'en',
      rate: 0.94,
      id: `feature-${book.id}`,
      onNotice: setNotice,
    })
  }

  return (
    <article
      ref={cardRef}
      className="book-card group snap-start"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onMouseEnter={() => setActiveId(book.id)}
    >
      <div className="relative px-3 pt-3">
        <div className="book-glow" style={{ background: `radial-gradient(circle, ${book.accent}42, transparent 65%)` }} />
        <div className="book-stage relative aspect-[0.68] w-full">
          <div
            ref={stageRef}
            className="book-3d h-full w-full"
            style={{ transform: 'rotateX(3deg) rotateY(-15deg)' }}
          >
            <div className="book-3d__pages" />
            <div className="book-3d__pages book-3d__pages--back" />
            <div className="book-3d__spine" />
            <div className="book-3d__cover">
              <BookCover book={book} />
            </div>
          </div>
        </div>

        <div className="absolute bottom-5 right-5 z-20 translate-y-0 opacity-100 transition-all duration-500 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          <BookPreviewButton book={book} speech={speech} isPlaying={isPlaying} onToggle={togglePreview} />
        </div>

        {isPlaying ? (
          <span
            className="absolute left-5 top-5 z-20 flex h-7 items-end gap-[2px] border border-orange/30 bg-ink/70 px-2 py-1.5 backdrop-blur-md"
            aria-hidden="true"
          >
            {[0, 1, 2, 3].map((bar) => (
              <span
                key={bar}
                className="w-[2px] bg-orange"
                style={{ height: `${45 + (bar % 2) * 40}%`, animation: `equalize ${0.6 + bar * 0.11}s ease-in-out ${bar * 0.08}s infinite` }}
              />
            ))}
          </span>
        ) : null}
      </div>

      <div className="flex items-start justify-between gap-3 px-3 pb-3 pt-6">
        <div className="min-w-0">
          <h3 className="truncate font-display text-[1.08rem] font-medium tracking-[-0.03em] text-bone transition-colors group-hover:text-gold">
            {book.title}
          </h3>
          <p className="mt-1 truncate text-[0.61rem] text-bone/45">{book.author}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-mono text-[0.41rem] uppercase tracking-[0.13em] text-white/22">0{index + 1}</p>
          <p className="mt-1 font-mono text-[0.41rem] uppercase tracking-[0.09em] text-white/18">{book.duration}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 pb-3 font-mono text-[0.43rem] uppercase tracking-[0.13em] text-gold/45">
        <span style={{ background: book.accent }} className="h-1 w-1 rounded-full" />
        {book.langCode === 'EN' ? 'English' : book.language}
      </div>
      <p className="min-h-[2.6rem] px-3 pb-4 text-[0.66rem] leading-5 text-white/40">{book.blurb}</p>
    </article>
  )
}

export default function FeaturedBooks() {
  const railRef = useRef(null)
  const speech = useSpeech()
  const [activeId, setActiveId] = useState(null)
  const [notice, setNotice] = useState('')
  const [progress, setProgress] = useState(0)

  const scrollRail = (direction) => {
    const rail = railRef.current
    if (!rail) return
    const amount = Math.min(rail.clientWidth * 0.75, 560)
    rail.scrollBy({ left: amount * direction, behavior: 'smooth' })
  }

  const updateProgress = () => {
    const rail = railRef.current
    if (!rail) return
    const max = rail.scrollWidth - rail.clientWidth
    setProgress(max > 0 ? rail.scrollLeft / max : 0)
  }

  return (
    <section id="explore" className="relative overflow-hidden border-b border-white/[0.06] py-[clamp(6rem,10vw,10rem)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(255,177,92,0.045),transparent_45%)]" />
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-ink via-ink/50 to-transparent" />
      </div>

      <div className="container-x relative">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="The shelf / Selected voices"
            title={
              <>
                Stories that have
                <br />
                <span className="text-shine">already found a voice.</span>
              </>
            }
          />
          <div className="flex items-center gap-3">
            <div className="mr-2 hidden flex-col items-end sm:flex">
              <span className="font-mono text-[0.46rem] uppercase tracking-[0.2em] text-white/25">Browse the shelf</span>
              <span className="mt-1 font-mono text-[0.44rem] tracking-[0.1em] text-gold/60">{String(FEATURED_BOOKS.length).padStart(2, '0')} TITLES</span>
            </div>
            <button type="button" onClick={() => scrollRail(-1)} className="icon-button" aria-label="Scroll books left">
              <ArrowLeft size={16} />
            </button>
            <button type="button" onClick={() => scrollRail(1)} className="icon-button" aria-label="Scroll books right">
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="relative mt-14">
        <div className="container-x">
          <div
            ref={railRef}
            onScroll={updateProgress}
            className="book-rail fade-edges -mx-3 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5"
          >
            {FEATURED_BOOKS.map((book, index) => (
              <Reveal key={book.id} delay={index * 0.04} className="w-[78vw] shrink-0 sm:w-[20rem] lg:w-[21.5rem]">
                <FeaturedBookCard
                  book={book}
                  index={index}
                  speech={speech}
                  activeId={activeId}
                  setActiveId={setActiveId}
                  setNotice={setNotice}
                />
              </Reveal>
            ))}
          </div>
        </div>
        <div className="container-x">
          <div className="mt-4 flex items-center justify-between">
            <div className="h-px flex-1 bg-white/[0.08]">
              <div
                className="h-full origin-left bg-gradient-to-r from-orange to-gold transition-transform duration-200"
                style={{ transform: `scaleX(${Math.max(0.12, progress)})` }}
              />
            </div>
            <span className="ml-5 font-mono text-[0.42rem] uppercase tracking-[0.15em] text-white/20">
              Drag / scroll the shelf
            </span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {notice ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="container-x"
          >
            <div className="mt-6 flex items-center justify-between gap-4 border border-orange/25 bg-orange/[0.05] px-4 py-3 text-[0.62rem] leading-5 text-bone/65" role="status">
              <span>{notice}</span>
              <button type="button" onClick={() => setNotice('')} className="shrink-0 text-[0.52rem] uppercase tracking-[0.12em] text-orange underline underline-offset-2">
                Dismiss
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="container-x mt-16">
        <Reveal>
          <div className="flex flex-col justify-between gap-4 border-t border-white/[0.08] pt-5 sm:flex-row sm:items-center">
            <p className="flex items-center gap-2 text-[0.6rem] text-white/25">
              <Play size={9} className="text-orange/60" />
              Hover a book to hear a line in its native language.
            </p>
            <a href="#studio" className="group inline-flex items-center gap-2 text-[0.54rem] font-semibold uppercase tracking-[0.15em] text-gold/75 transition-colors hover:text-orange">
              Bring your own book to the shelf
              <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
