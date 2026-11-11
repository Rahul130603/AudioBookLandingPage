import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import { studioHref } from '../lib/studioLink'

const LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Experience', href: '#how-it-works' },
  { label: 'Languages', href: '#languages' },
  { label: 'Studio', href: studioHref },
  { label: 'Listening Room', href: '#player' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const progressRef = useRef(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const y = window.scrollY
        const max = document.documentElement.scrollHeight - window.innerHeight
        setScrolled(y > 32)
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`
        }
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const desktop = window.matchMedia('(min-width: 1280px)')
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false)
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    desktop.addEventListener('change', closeOnDesktop)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
      desktop.removeEventListener('change', closeOnDesktop)
    }
  }, [open])

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[80]">
        <div
          className={`relative transition-all duration-500 ${
            scrolled
              ? 'border-b border-bone/[0.07] bg-ink/72 backdrop-blur-2xl'
              : 'border-b border-transparent bg-gradient-to-b from-ink/65 to-transparent'
          }`}
        >
          <div className="container-x flex h-[5.2rem] items-center justify-between">
            <Logo className="relative z-10" />

            <nav aria-label="Primary" className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 xl:flex">
              {LINKS.map((link, index) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="group relative flex items-center gap-1.5 whitespace-nowrap py-2 text-[0.62rem] font-medium uppercase tracking-[0.17em] text-bone transition-colors duration-300 hover:text-orange"
                >
                  <span className="text-[0.47rem] text-orange/80 transition-colors group-hover:text-orange">
                    0{index + 1}
                  </span>
                  {link.label}
                  <span className="absolute -bottom-0.5 left-4 right-0 h-px origin-left scale-x-0 bg-orange/70 transition-transform duration-[400ms] group-hover:scale-x-100" />
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <a
                href={studioHref}
                className="group hidden min-h-[2.7rem] items-center gap-3 border border-bone/10 bg-coal/85 pl-4 pr-1.5 shadow-[0_12px_30px_-24px_rgba(74,43,21,0.5)] text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-bone backdrop-blur-md transition-all duration-300 hover:border-gold/40 hover:bg-gold/[0.06] sm:inline-flex"
              >
                Upload book
                <span className="grid h-8 w-8 place-items-center rounded-full bg-orange text-ink transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight size={14} strokeWidth={2.2} />
                </span>
              </a>

              <button
                type="button"
                onClick={() => setOpen(true)}
                className="grid h-11 w-11 place-items-center border border-bone/15 text-bone transition-colors hover:border-orange/60 hover:text-orange xl:hidden"
                aria-label="Open navigation menu"
                aria-expanded={open}
              >
                <Menu size={19} strokeWidth={1.7} />
              </button>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-px bg-bone/[0.04]">
            <div
              ref={progressRef}
              className="h-full origin-left bg-gradient-to-r from-orange to-gold transition-transform duration-150"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[85] flex flex-col bg-ink xl:hidden"
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="pointer-events-none absolute inset-0 opacity-70">
              <div className="ambient-orb left-[-20%] top-[8%] h-[28rem] w-[28rem] bg-orange/20" />
              <div className="absolute bottom-[-10%] right-[-15%] h-[32rem] w-[32rem] rounded-full border border-gold/10" />
              <div className="absolute bottom-[-4%] right-[-9%] h-[22rem] w-[22rem] rounded-full border border-gold/[0.06]" />
            </div>
            <div className="container-x flex h-[5.2rem] shrink-0 items-center justify-between">
              <Logo onClick={() => setOpen(false)} />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-11 w-11 place-items-center border border-bone/15 text-bone"
                aria-label="Close navigation menu"
              >
                <X size={20} strokeWidth={1.7} />
              </button>
            </div>

            <nav aria-label="Mobile" className="container-x flex min-h-0 flex-1 flex-col overflow-y-auto pb-8">
              <div className="my-auto">
              {LINKS.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16 + index * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex items-center justify-between border-b border-bone/[0.08] py-4"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono text-[0.55rem] text-orange/70">0{index + 1}</span>
                    <span className="display text-[clamp(2.2rem,10vw,3.6rem)] text-bone transition-colors group-hover:text-gold">
                      {link.label}
                    </span>
                  </span>
                  <ArrowUpRight size={20} className="text-bone/38 transition-all group-hover:rotate-45 group-hover:text-orange" />
                </motion.a>
              ))}

              <motion.a
                href={studioHref}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.44, duration: 0.6 }}
                className="mt-6 flex min-h-[3.25rem] items-center justify-between gap-4 border border-bone/15 px-4 text-bone/90 transition-colors hover:border-gold/40 hover:text-gold"
                aria-label="Upload a book in the studio"
              >
                <span className="flex flex-col items-start gap-1">
                  <span className="text-[0.58rem] font-semibold uppercase tracking-[0.16em]">Upload book</span>
                  <span className="font-mono text-[0.44rem] uppercase tracking-[0.13em] text-smoke">PDF · EPUB · TXT · DOCX</span>
                </span>
                <ArrowUpRight size={16} className="shrink-0 text-orange" />
              </motion.a>

              <motion.a
                href={studioHref}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="btn btn-primary mt-5 w-full"
              >
                Start your first audiobook
                <span className="btn__icon">
                  <ArrowUpRight size={16} />
                </span>
              </motion.a>
              <div className="mt-5 flex items-center justify-between text-[0.58rem] uppercase tracking-[0.2em] text-smoke">
                <span>English</span>
                <span className="font-tamil">தமிழ்</span>
                <span className="font-urdu text-sm">العربية</span>
              </div>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
