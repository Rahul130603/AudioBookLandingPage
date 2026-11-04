import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bookmark,
  BookmarkCheck,
  Check,
  Headphones,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import { PLAYER_CHAPTERS } from '../lib/data'
import { formatTime } from '../lib/utils'
import CircularVisualizer from './CircularVisualizer'
import { Reveal, SectionHeading } from './Reveal'

const BOOKMARK_KEY = 'chaptera:bookmark:v1'
const SPEEDS = [0.75, 1, 1.25, 1.5, 2]

function readBookmark() {
  try {
    const stored = window.localStorage.getItem(BOOKMARK_KEY)
    if (!stored) return null
    const parsed = JSON.parse(stored)
    if (typeof parsed.chapterIndex !== 'number' || typeof parsed.time !== 'number') return null
    if (!PLAYER_CHAPTERS[parsed.chapterIndex]) return null
    return parsed
  } catch {
    return null
  }
}

function SkipButton({ direction, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="group relative grid h-11 w-11 place-items-center rounded-full border border-bone/10 text-bone/88 transition-all duration-300 hover:border-gold/40 hover:text-gold"
    >
      {direction === 'back' ? <RotateCcw size={21} strokeWidth={1.25} /> : <RotateCw size={21} strokeWidth={1.25} />}
      <span className="absolute font-mono text-[0.4rem] tracking-[-0.03em]">15</span>
    </button>
  )
}

function ChapterEqualizer({ playing }) {
  return (
    <span className="flex h-3 items-end gap-[2px]" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-[1.5px] bg-current"
          style={{
            height: playing ? '100%' : '60%',
            animation: playing ? `equalize ${0.65 + i * 0.12}s ease-in-out ${i * 0.09}s infinite` : 'none',
          }}
        />
      ))}
    </span>
  )
}

function PlayerArtwork() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-full border border-gold/30 bg-[#0b0806] shadow-[0_30px_80px_-20px_rgba(0,0,0,.9)]">
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <radialGradient id="player-bg" cx="50%" cy="42%" r="66%">
            <stop offset="0%" stopColor="#2c180b" />
            <stop offset="58%" stopColor="#100b08" />
            <stop offset="100%" stopColor="#070706" />
          </radialGradient>
          <radialGradient id="player-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD7AC" />
            <stop offset="46%" stopColor="#FF6B27" />
            <stop offset="100%" stopColor="#6b2e0f" stopOpacity="0.1" />
          </radialGradient>
          <linearGradient id="player-line" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#FF6B27" stopOpacity="0" />
            <stop offset="0.5" stopColor="#FFB15C" />
            <stop offset="1" stopColor="#FF6B27" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill="url(#player-bg)" />
        <g fill="none" stroke="rgba(255,177,92,.18)">
          <circle cx="200" cy="190" r="134" />
          <circle cx="200" cy="190" r="100" strokeOpacity="0.12" />
          <circle cx="200" cy="190" r="162" strokeOpacity="0.08" />
        </g>
        <circle cx="200" cy="174" r="68" fill="url(#player-sun)" opacity="0.8" />
        <path d="M52 268h296" stroke="url(#player-line)" />
        <path d="M78 286c40-12 66-14 94-5s48 10 76 2 50-11 74-4" fill="none" stroke="rgba(255,107,39,.25)" />
        <g fill="rgba(255,225,196,.55)">
          <circle cx="91" cy="110" r="1.4" />
          <circle cx="314" cy="131" r="1" />
          <circle cx="298" cy="80" r="0.8" />
          <circle cx="110" cy="318" r="1.2" />
        </g>
      </svg>

      <div className="absolute inset-0 flex flex-col justify-between p-[13%] text-center">
        <div className="flex items-center justify-between">
          <span className="font-display text-[0.48rem] font-semibold uppercase tracking-[0.3em] text-cream/55">Chaptera</span>
          <span className="font-mono text-[0.36rem] uppercase tracking-[0.15em] text-cream/25">Original</span>
        </div>

        <div>
          <span className="font-mono text-[0.35rem] uppercase tracking-[0.22em] text-[#FFB15C]/55">A novel of voice & memory</span>
          <h3 className="mt-2 font-display text-[clamp(1.35rem,3.4vw,2.1rem)] font-semibold uppercase leading-[0.95] tracking-[-0.06em] text-cream">
            The Silent
            <br />
            <span className="text-shine">Meridian</span>
          </h3>
          <div className="mx-auto mt-3 h-px w-10 bg-orange/60" />
          <p className="mt-2.5 font-mono text-[0.4rem] uppercase tracking-[0.2em] text-cream/40">A. R. Voss</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-mono text-[0.34rem] uppercase tracking-[0.15em] text-cream/25">Unabridged</span>
          <span className="flex items-center gap-1 font-mono text-[0.34rem] uppercase tracking-[0.15em] text-cream/25">
            <Headphones size={7} /> Audio edition
          </span>
        </div>
      </div>

      <div className="absolute inset-0 rounded-full shadow-[inset_0_0_60px_rgba(0,0,0,.6)]" />
      <div className="noise-overlay" />
    </div>
  )
}

export default function Player() {
  const audioRef = useRef(null)
  const shouldAutoPlayRef = useRef(false)
  const pendingSeekRef = useRef(null)
  const toastTimer = useRef(null)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(true)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(PLAYER_CHAPTERS[0].fallbackDuration)
  const [volume, setVolume] = useState(0.82)
  const [muted, setMuted] = useState(false)
  const [rate, setRate] = useState(1)
  const [bookmark, setBookmark] = useState(readBookmark)
  const [toast, setToast] = useState('')
  const [audioError, setAudioError] = useState('')

  const chapter = PLAYER_CHAPTERS[currentIndex]
  const progress = duration > 0 ? Math.min(100, (time / duration) * 100) : 0
  const circumference = 2 * Math.PI * 46

  const flash = (message) => {
    setToast(message)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 3200)
  }

  useEffect(() => {
    return () => clearTimeout(toastTimer.current)
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return undefined

    audio.pause()
    audio.src = chapter.file
    audio.load()
    setTime(0)
    setDuration(chapter.fallbackDuration)
    setAudioError('')
    setLoading(true)

    const onLoaded = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration)
      }
      if (pendingSeekRef.current != null) {
        const target = Math.min(pendingSeekRef.current, (audio.duration || pendingSeekRef.current) - 0.1)
        audio.currentTime = Math.max(0, target)
        setTime(Math.max(0, target))
        pendingSeekRef.current = null
      }
      if (shouldAutoPlayRef.current) {
        shouldAutoPlayRef.current = false
        audio.play().catch(() => setPlaying(false))
      }
      setLoading(false)
    }

    audio.addEventListener('loadedmetadata', onLoaded)
    return () => audio.removeEventListener('loadedmetadata', onLoaded)
  }, [chapter.file, currentIndex])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return undefined

    const onTime = () => setTime(audio.currentTime)
    const onPlay = () => {
      setPlaying(true)
      setLoading(false)
    }
    const onPause = () => setPlaying(false)
    const onWaiting = () => setLoading(true)
    const onPlaying = () => setLoading(false)
    const onEnded = () => {
      setPlaying(false)
      if (currentIndex < PLAYER_CHAPTERS.length - 1) {
        shouldAutoPlayRef.current = true
        setCurrentIndex((index) => index + 1)
      } else {
        setTime(audio.duration || 0)
      }
    }
    const onError = () => {
      setLoading(false)
      setPlaying(false)
      setAudioError('The audio sample could not be loaded. Refresh the page to reconnect.')
    }

    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)

    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('playing', onPlaying)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
    }
  }, [currentIndex])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = muted ? 0 : volume
  }, [volume, muted])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.playbackRate = rate
  }, [rate])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return undefined
    const onSamplePlay = () => audio.pause()
    window.addEventListener('chaptera:sample-play', onSamplePlay)
    return () => window.removeEventListener('chaptera:sample-play', onSamplePlay)
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      window.dispatchEvent(new Event('chaptera:main-play'))
      if (audio.ended || (Number.isFinite(audio.duration) && audio.currentTime >= audio.duration - 0.05)) {
        audio.currentTime = 0
        setTime(0)
      }
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setAudioError('Your browser blocked playback. Press play once more to begin.'))
    } else {
      audio.pause()
    }
  }

  const skip = (delta) => {
    const audio = audioRef.current
    if (!audio) return
    const total = Number.isFinite(audio.duration) ? audio.duration : duration
    const next = Math.max(0, Math.min(total || 0, audio.currentTime + delta))
    audio.currentTime = next
    setTime(next)
  }

  const seek = (event) => {
    const audio = audioRef.current
    if (!audio) return
    const next = Number(event.target.value)
    audio.currentTime = next
    setTime(next)
  }

  const selectChapter = (index) => {
    if (index === currentIndex) {
      togglePlay()
      return
    }
    window.dispatchEvent(new Event('chaptera:main-play'))
    pendingSeekRef.current = null
    shouldAutoPlayRef.current = true
    setCurrentIndex(index)
  }

  const saveBookmark = () => {
    const entry = {
      chapterIndex: currentIndex,
      chapterTitle: chapter.title,
      time,
      createdAt: Date.now(),
    }
    setBookmark(entry)
    try {
      window.localStorage.setItem(BOOKMARK_KEY, JSON.stringify(entry))
    } catch {
      flash('Bookmark saved for this session only.')
      return
    }
    flash(`Bookmarked ${chapter.label} at ${formatTime(time)}`)
  }

  const clearBookmark = () => {
    setBookmark(null)
    try {
      window.localStorage.removeItem(BOOKMARK_KEY)
    } catch {
      // ignore storage access errors
    }
    flash('Bookmark removed')
  }

  const resumeBookmark = () => {
    if (!bookmark) return
    const audio = audioRef.current
    if (!audio) return
    if (bookmark.chapterIndex === currentIndex) {
      window.dispatchEvent(new Event('chaptera:main-play'))
      const target = Math.max(0, bookmark.time)
      audio.currentTime = target
      setTime(target)
      audio.play().catch(() => {})
    } else {
      pendingSeekRef.current = bookmark.time
      shouldAutoPlayRef.current = true
      setCurrentIndex(bookmark.chapterIndex)
    }
    flash(`Returning to ${PLAYER_CHAPTERS[bookmark.chapterIndex]?.label ?? 'your bookmark'}`)
  }

  return (
    <section id="player" className="relative overflow-hidden border-b border-bone/[0.06] py-[clamp(6rem,10vw,10rem)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(255,107,39,0.08),transparent_48%)]" />
        <div className="ambient-orb right-[-15%] top-[20%] h-[38rem] w-[38rem] bg-orange/[0.06]" />
        <div className="absolute left-[-10%] bottom-[-10%] h-[30rem] w-[30rem] rounded-full border border-bone/[0.035]" />
      </div>

      <div className="container-x relative">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="The listening room / Live player"
            title={
              <>
                Press play.
                <br />
                <span className="text-shine">Let the room disappear.</span>
              </>
            }
          />
          <Reveal delay={0.15}>
            <div className="flex items-center gap-4 border-l border-bone/10 pl-5">
              <Headphones size={16} className="text-orange/70" />
              <p className="max-w-[16rem] text-[0.7rem] leading-5 text-smoke">
                A working audiobook player with real narration, chapter navigation, speed, volume, and bookmarks.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div className="player-shell mt-14 lg:mt-20">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-bone/[0.08] px-4 py-3.5 sm:px-6">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2 font-mono text-[0.46rem] uppercase tracking-[0.18em] text-bone/90">
                  <span className={`h-1.5 w-1.5 rounded-full ${playing ? 'animate-pulse bg-orange' : 'bg-bone/25'}`} />
                  {playing ? 'Now playing' : 'Ready to listen'}
                </span>
                <span className="hidden h-3 w-px bg-bone/10 sm:block" />
                <span className="hidden font-mono text-[0.44rem] uppercase tracking-[0.14em] text-bone/38 sm:block">
                  Chaptera original · 2026
                </span>
              </div>

              <div className="flex items-center gap-2">
                {bookmark ? (
                  <div className="flex items-center border border-gold/20 bg-gold/[0.045]">
                    <button
                      type="button"
                      onClick={resumeBookmark}
                      className="flex items-center gap-2 px-2.5 py-1.5 text-[0.48rem] uppercase tracking-[0.11em] text-gold/85 transition-colors hover:text-orange"
                    >
                      <BookmarkCheck size={11} />
                      Resume {PLAYER_CHAPTERS[bookmark.chapterIndex]?.label ?? 'bookmark'} · {formatTime(bookmark.time)}
                    </button>
                    <button
                      type="button"
                      onClick={clearBookmark}
                      className="grid h-6 w-6 place-items-center border-l border-gold/15 text-bone/90 hover:text-orange"
                      aria-label="Remove bookmark"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ) : (
                  <span className="hidden font-mono text-[0.44rem] uppercase tracking-[0.14em] text-bone/38 sm:block">
                    English · Aria
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[0.94fr_1.06fr]">
              <div className="border-b border-bone/[0.08] p-5 sm:p-8 lg:border-b-0 lg:border-r lg:p-9">
                <div className="relative mx-auto aspect-square w-full max-w-[29rem]">
                  <CircularVisualizer audioRef={audioRef} playing={playing} />

                  <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-[15%] h-[70%] w-[70%] -rotate-90" aria-hidden="true">
                    <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(26,21,17,.10)" strokeWidth="0.55" />
                    <circle
                      cx="50"
                      cy="50"
                      r="46"
                      fill="none"
                      stroke="rgba(255,177,92,.7)"
                      strokeWidth="0.55"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference * (1 - progress / 100)}
                      style={{ transition: 'stroke-dashoffset .25s linear' }}
                    />
                  </svg>

                  <div className="absolute inset-[18%]">
                    <PlayerArtwork />
                  </div>

                  <span className="absolute left-1/2 top-[3%] -translate-x-1/2 whitespace-nowrap font-mono text-[0.4rem] uppercase tracking-[0.28em] text-bone/60">
                    A Chaptera audio experience
                  </span>
                  <span className="absolute bottom-[2.5%] left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap border border-bone/10 bg-ink/70 px-2.5 py-1 font-mono text-[0.38rem] uppercase tracking-[0.18em] text-bone/84 backdrop-blur-md">
                    <span className={`h-1 w-1 rounded-full ${playing ? 'bg-orange' : 'bg-bone/20'}`} />
                    {playing ? 'Signal live' : 'Signal paused'}
                  </span>
                </div>

                <div className="mt-7 flex items-end justify-between gap-4 border-t border-bone/[0.08] pt-5">
                  <div>
                    <p className="font-mono text-[0.43rem] uppercase tracking-[0.22em] text-orange/60">
                      Currently listening
                    </p>
                    <h3 className="mt-1.5 font-display text-[1.4rem] font-medium tracking-[-0.04em] text-bone">
                      The Silent Meridian
                    </h3>
                    <p className="mt-1 text-[0.64rem] text-smoke">A. R. Voss · Narrated by Aria</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-mono text-[0.4rem] uppercase tracking-[0.16em] text-bone/60">Total</p>
                    <p className="mt-1 whitespace-nowrap font-mono text-[0.62rem] text-bone/84">3m 08s</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col p-5 sm:p-8 lg:p-9">
                <div className="flex items-center justify-between border-b border-bone/[0.08] pb-4">
                  <div>
                    <p className="font-mono text-[0.46rem] uppercase tracking-[0.2em] text-bone/84">Contents</p>
                    <p className="mt-1 text-[0.58rem] text-bone/90">4 chapters · spoken edition</p>
                  </div>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-bone/10 text-[0.45rem] text-bone/88">
                    04
                  </span>
                </div>

                <div className="mt-2">
                  {PLAYER_CHAPTERS.map((item, index) => {
                    const active = index === currentIndex
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => selectChapter(index)}
                        data-active={active}
                        aria-current={active ? 'true' : undefined}
                        className="chapter-row group"
                      >
                        <span className="chapter-row__index font-mono">
                          {active && playing ? <ChapterEqualizer playing /> : String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="min-w-0">
                          <span className={`block text-[0.78rem] leading-5 ${active ? 'text-gold' : 'text-bone/90 group-hover:text-bone'}`}>
                            {item.title}
                          </span>
                          <span className={`mt-0.5 block font-mono text-[0.42rem] uppercase tracking-[0.13em] ${active ? 'text-gold/50' : 'text-bone/60'}`}>
                            {item.label} · {formatTime(item.fallbackDuration)}
                          </span>
                        </span>
                        <span className="grid h-7 w-7 place-items-center text-bone/38 transition-colors group-hover:text-orange">
                          {active && playing ? (
                            <span className="flex h-4 items-end gap-[2px]" aria-hidden="true">
                              {[0, 1, 2].map((bar) => (
                                <span
                                  key={bar}
                                  className="w-[1.5px] bg-orange"
                                  style={{
                                    height: '70%',
                                    animation: `equalize ${0.6 + bar * 0.13}s ease-in-out ${bar * 0.1}s infinite`,
                                  }}
                                />
                              ))}
                            </span>
                          ) : (
                            <Play size={11} fill="currentColor" />
                          )}
                        </span>
                      </button>
                    )
                  })}
                </div>

                <div className="mt-6 border-l border-orange/35 pl-5">
                  <p className="font-display text-[0.92rem] font-light italic leading-7 tracking-[-0.015em] text-bone/88">
                    “Maps do not show us where to go. They show us what we are willing to leave behind.”
                  </p>
                  <p className="mt-2.5 font-mono text-[0.42rem] uppercase tracking-[0.17em] text-gold/45">
                    A line from Chapter III
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-3 border border-bone/[0.07]">
                  {[
                    ['Voice', 'Aria'],
                    ['Language', 'English'],
                    ['Edition', 'Unabridged'],
                  ].map(([label, value], index) => (
                    <div
                      key={label}
                      className={`bg-bone/[0.015] px-3 py-3 ${index < 2 ? 'border-r border-bone/[0.07]' : ''}`}
                    >
                      <p className="font-mono text-[0.4rem] uppercase tracking-[0.14em] text-bone/60">{label}</p>
                      <p className="mt-1 text-[0.6rem] text-bone/88">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-6">
                  <div className="border border-bone/[0.08] bg-bone/[0.02] p-3.5">
                    <div className="flex items-start gap-3">
                      <Bookmark size={13} className="mt-0.5 shrink-0 text-gold/60" />
                      <div className="min-w-0">
                        <p className="text-[0.63rem] text-bone/88">
                          The story remembers where you stopped.
                        </p>
                        <p className="mt-1 text-[0.54rem] leading-4 text-bone/90">
                          Bookmark any moment. Your place is stored on this device and waiting when you return.
                        </p>
                      </div>
                    </div>
                  </div>

                  {audioError ? (
                    <p className="mt-3 border-l border-orange bg-orange/[0.06] px-3 py-2 text-[0.6rem] text-orange/85" role="status">
                      {audioError}
                    </p>
                  ) : (
                    <div className="mt-3 flex items-center justify-between font-mono text-[0.4rem] uppercase tracking-[0.12em] text-bone/38">
                      <span className="flex items-center gap-1.5">
                        <Headphones size={9} /> Headphones recommended
                      </span>
                      <span>Neural voice · MP3 · 48 kbps</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-bone/[0.08] p-5 sm:p-7 lg:px-9">
              <div className="flex items-center gap-4">
                <span className="w-9 shrink-0 font-mono text-[0.55rem] text-bone/84">{formatTime(time)}</span>
                <input
                  type="range"
                  min="0"
                  max={Number.isFinite(duration) && duration > 0 ? duration : 1}
                  step="0.05"
                  value={Math.min(time, duration || 0)}
                  onChange={seek}
                  className="range flex-1"
                  style={{ '--value': `${progress}%` }}
                  aria-label="Audiobook progress"
                  aria-valuetext={`${formatTime(time)} of ${formatTime(duration)}`}
                />
                <span className="w-9 shrink-0 text-right font-mono text-[0.55rem] text-bone/84">{formatTime(duration)}</span>
              </div>

              <div className="mt-4 grid grid-cols-1 items-center gap-5 sm:grid-cols-3">
                <div className="flex items-center justify-center gap-3 sm:justify-start">
                  <button
                    type="button"
                    onClick={() => setMuted((value) => !value)}
                    className="text-bone/88 transition-colors hover:text-gold"
                    aria-label={muted ? 'Unmute' : 'Mute'}
                  >
                    {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={muted ? 0 : volume}
                    onChange={(event) => {
                      const next = Number(event.target.value)
                      setVolume(next)
                      setMuted(next === 0)
                    }}
                    className="range w-20 sm:w-24"
                    style={{ '--value': `${(muted ? 0 : volume) * 100}%` }}
                    aria-label="Volume"
                  />
                  <span className="hidden font-mono text-[0.4rem] uppercase tracking-[0.1em] text-bone/60 lg:block">
                    Vol {Math.round((muted ? 0 : volume) * 100)}
                  </span>
                </div>

                <div className="order-first flex items-center justify-center gap-4 sm:order-none">
                  <SkipButton direction="back" label="Back 15 seconds" onClick={() => skip(-15)} />
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="group relative grid h-[4.2rem] w-[4.2rem] place-items-center rounded-full bg-orange text-bone shadow-[0_0_45px_-8px_rgba(255,107,39,.75)] transition-transform duration-300 hover:scale-105"
                    aria-label={playing ? 'Pause audiobook' : 'Play audiobook'}
                  >
                    <span className={`absolute inset-[-7px] rounded-full border border-orange/25 ${playing ? 'animate-[slow-spin_14s_linear_infinite]' : ''}`} style={{ borderStyle: 'dashed' }} />
                    {loading && !playing ? (
                      <Loader2 size={21} className="animate-spin" />
                    ) : playing ? (
                      <Pause size={20} fill="currentColor" />
                    ) : (
                      <Play size={20} fill="currentColor" className="ml-0.5" />
                    )}
                  </button>
                  <SkipButton direction="forward" label="Forward 15 seconds" onClick={() => skip(15)} />
                </div>

                <div className="flex items-center justify-center gap-3 sm:justify-end">
                  <div className="segmented">
                    {SPEEDS.map((speed) => (
                      <button
                        key={speed}
                        type="button"
                        onClick={() => setRate(speed)}
                        aria-pressed={rate === speed}
                        className="!px-2 !text-[0.52rem]"
                        aria-label={`Playback speed ${speed}x`}
                      >
                        {speed}×
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={saveBookmark}
                    className="group flex h-9 items-center gap-2 border border-bone/10 px-3 text-[0.46rem] font-medium uppercase tracking-[0.11em] text-bone/60 transition-colors hover:border-gold/35 hover:text-gold"
                    aria-label="Bookmark current position"
                  >
                    <Bookmark size={11} />
                    <span className="hidden xl:inline">Bookmark</span>
                  </button>
                </div>
              </div>
            </div>

            <audio ref={audioRef} preload="metadata" playsInline src={PLAYER_CHAPTERS[0].file} className="hidden" />

            <AnimatePresence>
              {toast ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 border border-orange/30 bg-coal/95 px-3.5 py-2 text-[0.58rem] text-bone/88 shadow-xl backdrop-blur-md"
                  role="status"
                >
                  <Check size={11} className="text-emerald-400" />
                  {toast}
                </motion.div>
              ) : null}
            </AnimatePresence>

            <span className="sr-only" aria-live="polite">
              {playing ? `Playing ${chapter.title}` : 'Playback paused'}
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-[0.54rem] text-bone/90">
            <p className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-orange/70" />
              Full playback supported: seek, skip, speed, volume, chapters, and local bookmarks.
            </p>
            <p className="font-mono uppercase tracking-[0.15em]">Rendered with Chaptera Voice Engine — demo edition</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
