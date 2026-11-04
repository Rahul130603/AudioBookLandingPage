import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, ArrowUpRight, X } from 'lucide-react'
import Logo from './Logo'

const LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Explore', href: '#explore' },
  { label: 'Upload Book', href: '#studio' },
  { label: 'Features', href: '#features' },
  { label: 'About', action: 'about' },
  { label: 'Contact', href: 'mailto:hello@chaptera.audio' },
  { label: 'Privacy Policy', action: 'privacy' },
]

const MODAL_CONTENT = {
  about: {
    eyebrow: 'About Chaptera',
    title: 'Every book deserves a voice.',
    body: [
      'Chaptera is a cinematic audiobook studio for the books already on your shelf. Upload a manuscript, choose a language and a voice, and step into the story with your ears.',
      'This build is a working frontend experience. Uploads and conversion are staged for a production API, while the listening room plays real narrated chapters and remembers your place on this device.',
      'Designed and built for readers in English, Tamil, and Urdu.',
    ],
  },
  privacy: {
    eyebrow: 'Privacy Policy',
    title: 'Your stories stay yours.',
    body: [
      'This demo does not upload, transmit, or store your manuscript on a server. Files are read locally in your browser only for the duration of the preview.',
      'Bookmarks are saved in your browser’s local storage and never leave this device. Clearing your browser storage removes them.',
      'When the Chaptera conversion API is connected, files will be processed over an encrypted connection and removed after rendering. A full production policy will be published before launch.',
      'Questions? Write to hello@chaptera.audio.',
    ],
  },
}

function InfoModal({ type, onClose }) {
  const content = MODAL_CONTENT[type]

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[120] grid place-items-center bg-ink/80 p-4 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="info-modal-title"
        initial={{ opacity: 0, y: 22, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel relative w-full max-w-xl p-7 sm:p-10"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="panel-corner panel-corner--tl" />
        <span className="panel-corner panel-corner--tr" />
        <span className="panel-corner panel-corner--bl" />
        <span className="panel-corner panel-corner--br" />
        <button
          type="button"
          onClick={onClose}
          autoFocus
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center border border-white/10 text-bone/40 transition-colors hover:border-orange/40 hover:text-orange"
          aria-label="Close dialog"
        >
          <X size={14} />
        </button>
        <span className="eyebrow">{content.eyebrow}</span>
        <h2 id="info-modal-title" className="display mt-5 text-[clamp(1.9rem,4vw,2.8rem)] text-bone">
          {content.title}
        </h2>
        <div className="mt-6 space-y-4 border-t border-white/[0.08] pt-6">
          {content.body.map((paragraph) => (
            <p key={paragraph} className="text-[0.78rem] leading-7 text-smoke">
              {paragraph}
            </p>
          ))}
        </div>
        <button type="button" onClick={onClose} className="btn btn-ghost btn-sm mt-8">
          Back to Chaptera
          <span className="btn__icon">
            <ArrowUpRight size={14} />
          </span>
        </button>
      </motion.div>
    </motion.div>
  )
}

export default function Footer() {
  const [modal, setModal] = useState(null)

  return (
    <>
      <footer className="relative overflow-hidden bg-[#070707]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute bottom-[-30%] left-1/2 h-[44rem] w-[44rem] -translate-x-1/2 rounded-full bg-orange/[0.045] blur-[110px]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="container-x relative">
          <div className="flex flex-col justify-between gap-8 border-b border-white/[0.07] py-12 md:flex-row md:items-center">
            <div>
              <span className="eyebrow">The next chapter</span>
              <p className="mt-3 max-w-lg font-display text-[clamp(1.5rem,3vw,2.3rem)] font-medium tracking-[-0.045em] text-bone">
                Turn a page into a voice.
              </p>
            </div>
            <a href="#studio" className="group inline-flex items-center gap-3 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-gold transition-colors hover:text-orange">
              Open the studio
              <span className="grid h-10 w-10 place-items-center rounded-full border border-gold/25 transition-all duration-500 group-hover:rotate-45 group-hover:border-orange">
                <ArrowUpRight size={15} />
              </span>
            </a>
          </div>

          <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <Logo />
              <p className="mt-5 max-w-xs font-display text-[1.1rem] font-light leading-relaxed tracking-[-0.02em] text-bone/55">
                Every Book Has a Voice.
              </p>
              <p className="mt-4 max-w-xs text-[0.7rem] leading-6 text-white/25">
                A cinematic listening room for the stories you already love — and the ones still waiting to be heard.
              </p>
              <a
                href="mailto:hello@chaptera.audio"
                className="mt-6 inline-flex items-center gap-2 border-b border-white/15 pb-1 text-[0.6rem] uppercase tracking-[0.14em] text-white/40 transition-colors hover:border-orange hover:text-gold"
              >
                hello@chaptera.audio
                <ArrowUpRight size={11} />
              </a>
            </div>

            <div className="lg:col-span-3">
              <p className="font-mono text-[0.46rem] uppercase tracking-[0.22em] text-white/25">Navigate</p>
              <nav aria-label="Footer" className="mt-5 flex flex-col items-start gap-3">
                {LINKS.map((link) =>
                  link.action ? (
                    <button
                      key={link.label}
                      type="button"
                      onClick={() => setModal(link.action)}
                      className="text-[0.7rem] text-bone/45 transition-colors hover:text-gold"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-[0.7rem] text-bone/45 transition-colors hover:text-gold"
                    >
                      {link.label}
                    </a>
                  ),
                )}
              </nav>
            </div>

            <div className="lg:col-span-2">
              <p className="font-mono text-[0.46rem] uppercase tracking-[0.22em] text-white/25">Languages</p>
              <div className="mt-5 flex flex-col items-start gap-3">
                <a href="#languages" className="text-[0.7rem] text-bone/45 transition-colors hover:text-gold">
                  English
                </a>
                <a href="#languages" lang="ta" className="font-tamil text-[0.8rem] text-bone/45 transition-colors hover:text-gold">
                  தமிழ்
                </a>
                <a href="#languages" lang="ur" className="font-urdu text-[0.9rem] text-bone/45 transition-colors hover:text-gold">
                  اردو
                </a>
              </div>
            </div>

            <div className="lg:col-span-2 lg:text-right">
              <p className="font-mono text-[0.46rem] uppercase tracking-[0.22em] text-white/25">Chaptera</p>
              <p className="mt-5 text-[0.7rem] leading-6 text-white/25">
                A studio for voices,
                <br />
                pages & in-between hours.
              </p>
              <a
                href="#home"
                className="mt-6 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/35 transition-colors hover:border-orange/50 hover:text-orange"
                aria-label="Back to top"
              >
                <ArrowUp size={14} />
              </a>
            </div>
          </div>

          <div className="footer-word select-none pb-2 text-center" aria-hidden="true">
            CHAPTERA<span style={{ color: '#FF6B27', WebkitTextStroke: '0' }}>.</span>
          </div>

          <div className="flex flex-col justify-between gap-3 border-t border-white/[0.07] py-5 text-[0.55rem] text-white/20 sm:flex-row sm:items-center">
            <p>© 2026 Chaptera Studio. All stories belong to their authors.</p>
            <div className="flex items-center gap-5">
              <button type="button" onClick={() => setModal('privacy')} className="transition-colors hover:text-gold">
                Privacy
              </button>
              <span className="h-3 w-px bg-white/10" />
              <span className="font-mono uppercase tracking-[0.12em]">Made for listening</span>
            </div>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {modal ? <InfoModal type={modal} onClose={() => setModal(null)} /> : null}
      </AnimatePresence>
    </>
  )
}
