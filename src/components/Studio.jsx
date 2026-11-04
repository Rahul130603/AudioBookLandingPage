import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  Check,
  FileText,
  Info,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Volume2,
  X,
} from 'lucide-react'
import { LANGUAGES, VOICES } from '../lib/data'
import { getStageIndex, simulateConversion, STAGES } from '../lib/conversionApi'
import { formatBytes } from '../lib/utils'
import useAudioSample from '../hooks/useAudioSample'
import useManuscriptSpeech from '../hooks/useManuscriptSpeech'
import { extractManuscript } from '../lib/extractManuscript'
import Waveform from './Waveform'
import { Reveal, SectionHeading } from './Reveal'

const ACCEPTED = ['pdf', 'epub', 'txt', 'docx']
const MAX_BYTES = 50 * 1024 * 1024

function readExtension(name) {
  return name.split('.').pop()?.toLowerCase() ?? ''
}

export default function Studio() {
  const reduce = useReducedMotion()
  const inputRef = useRef(null)
  const abortRef = useRef(null)
  const audio = useAudioSample()
  const speech = useManuscriptSpeech()
  const uploadVersion = useRef(0)
  const stopPlayback = useCallback(() => {
    audio.stop()
    speech.stop()
    speech.clearError()
  }, [audio.stop, speech.stop, speech.clearError])

  const [file, setFile] = useState(null)
  const [languageId, setLanguageId] = useState('english')
  const [voiceId, setVoiceId] = useState('aria')
  const [speed, setSpeed] = useState(1)
  const [dragging, setDragging] = useState(false)
  const [phase, setPhase] = useState('idle')
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [extractionMode, setExtractionMode] = useState('sample')

  const language = LANGUAGES.find((item) => item.id === languageId) || LANGUAGES[0]
  const voiceOptions = VOICES[language.code]
  const voice = voiceOptions.find((item) => item.id === voiceId) || voiceOptions[0]
  const busy = phase === 'converting'
  const complete = phase === 'complete'
  const stageIndex = getStageIndex(progress)
  const previewing = speech.playing

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      uploadVersion.current += 1
    }
  }, [])

  const resetConversion = () => {
    abortRef.current?.abort()
    stopPlayback()
    setPhase('idle')
    setProgress(0)
    setResult(null)
    setError('')
  }

  const acceptFile = async (incoming) => {
    if (!incoming || busy) return
    const ext = readExtension(incoming.name)
    if (!ACCEPTED.includes(ext)) {
      setError(`“${incoming.name}” is not a supported format. Choose a PDF, EPUB, TXT, or DOCX file.`)
      return
    }
    if (incoming.size > MAX_BYTES) {
      setError('That manuscript is larger than 50 MB. Try a smaller file for this preview.')
      return
    }

    stopPlayback()
    audio.setError('')
    setError('')
    setResult(null)
    setPhase('idle')
    setProgress(0)
    const version = ++uploadVersion.current
    setFile({ name: incoming.name, size: incoming.size, ext })
    setExcerpt('')
    setExtractionMode('reading')
    try {
      const text = await extractManuscript(incoming, ext)
      if (version !== uploadVersion.current) return
      setFile({ name: incoming.name, size: incoming.size, ext, text })
      setExcerpt(text.slice(0, 480))
      setExtractionMode('local')
    } catch (readError) {
      if (version !== uploadVersion.current) return
      setExtractionMode('error')
      setError(readError.message || 'This document could not be read. Try a text-based PDF or TXT file.')
    }
  }

  const handleInput = (event) => {
    acceptFile(event.target.files?.[0])
    event.target.value = ''
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setDragging(false)
    acceptFile(event.dataTransfer.files?.[0])
  }

  const stopSample = stopPlayback

  const handleLanguage = useCallback(
    (id) => {
      const next = LANGUAGES.find((item) => item.id === id)
      if (!next) return
      abortRef.current?.abort()
      setLanguageId(id)
      setVoiceId(VOICES[next.code][0].id)
      setResult(null)
      setPhase('idle')
      setProgress(0)
      stopSample()
    },
    [stopSample],
  )

  useEffect(() => {
    const onSelectLanguage = (event) => {
      if (!LANGUAGES.some((item) => item.id === event.detail)) return
      handleLanguage(event.detail)
    }
    window.addEventListener('chaptera:select-language', onSelectLanguage)
    return () => window.removeEventListener('chaptera:select-language', onSelectLanguage)
  }, [handleLanguage])

  const handleConvert = async () => {
    if (!file) {
      setError('Add your manuscript first, then Chaptera can give it a voice.')
      inputRef.current?.focus()
      return
    }

    if (!file.text || extractionMode !== 'local') {
      setError(extractionMode === 'reading' ? 'Please wait while the document text is extracted.' : 'Upload a document with readable text before converting.')
      return
    }
    setError('')
    setResult(null)
    setPhase('converting')
    setProgress(0)
    stopPlayback()
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const output = await simulateConversion({
        file,
        language,
        voice,
        speed,
        signal: controller.signal,
        onProgress: setProgress,
      })
      if (controller.signal.aborted) return
      setResult(output)
      setPhase('complete')
      setProgress(100)
    } catch (conversionError) {
      if (conversionError?.name !== 'AbortError') {
        setError('The demo conversion was interrupted. Please try again.')
        setPhase('idle')
        setProgress(0)
      }
    }
  }

  const handleCancel = () => {
    abortRef.current?.abort()
    setPhase('idle')
    setProgress(0)
    setError('')
  }

  const handlePreview = () => {
    if (!result?.text) return
    speech.toggle({
      text: result.text,
      languageCode: result.manifest.languageCode,
      narratorName: result.manifest.voice,
      speed: result.manifest.speed,
    })
  }

  return (
    <section id="studio" className="relative overflow-hidden border-b border-bone/[0.06] section-pad">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,107,39,0.07),transparent_45%)]" />
        <div className="ambient-orb left-[-12%] top-[30%] h-[32rem] w-[32rem] bg-orange/[0.06]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-bone/10 to-transparent" />
      </div>

      <div className="container-x relative">
        <div className="grid grid-cols-12 items-end gap-y-8 lg:gap-8">
          <SectionHeading
            className="col-span-12 lg:col-span-8"
            eyebrow="The conversion studio / API ready"
            title={
              <>
                Give your manuscript
                <br />
                <span className="text-shine">a second life.</span>
              </>
            }
          />
          <Reveal delay={0.15} className="col-span-12 lg:col-span-4">
            <div className="flex gap-8 border-l border-bone/10 pl-5 lg:ml-auto lg:justify-end">
              <div>
                <p className="font-mono text-[0.47rem] uppercase tracking-[0.2em] text-smoke/60">Pipeline</p>
                <p className="mt-1.5 flex items-center gap-1.5 text-[0.62rem] text-bone/84">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                  Frontend ready
                </p>
              </div>
              <div>
                <p className="font-mono text-[0.47rem] uppercase tracking-[0.2em] text-smoke/60">Endpoint</p>
                <p className="mt-1.5 font-mono text-[0.62rem] text-bone/84">/api/convert</p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-12 gap-y-5 lg:gap-5 lg:mt-20">
          <Reveal className="col-span-12 lg:col-span-7">
            <div className="glass-panel relative h-full">
              <span className="panel-corner panel-corner--tl" />
              <span className="panel-corner panel-corner--tr" />
              <span className="panel-corner panel-corner--bl" />
              <span className="panel-corner panel-corner--br" />

              <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex items-center justify-between border-b border-bone/[0.08] pb-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-7 w-7 place-items-center border border-orange/30 font-mono text-[0.55rem] text-orange">
                      01
                    </span>
                    <span className="font-mono text-[0.51rem] uppercase tracking-[0.2em] text-bone/88">
                      Manuscript input
                    </span>
                  </div>
                  <span className="hidden font-mono text-[0.44rem] uppercase tracking-[0.16em] text-bone/90 sm:block">
                    PDF · EPUB · TXT · DOCX
                  </span>
                </div>

                <input
                  ref={inputRef}
                  id="manuscript-upload"
                  type="file"
                  accept=".pdf,.epub,.txt,.docx,application/pdf,application/epub+zip,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="sr-only"
                  onChange={handleInput}
                />

                <AnimatePresence mode="wait">
                  {!file ? (
                    <motion.div
                      key="empty"
                      initial={false}
                      exit={{ opacity: 0, y: -8 }}
                      className="upload-zone group/zone mt-6"
                      data-dragging={dragging}
                      onDragOver={(event) => {
                        event.preventDefault()
                        setDragging(true)
                      }}
                      onDragEnter={(event) => {
                        event.preventDefault()
                        setDragging(true)
                      }}
                      onDragLeave={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false)
                      }}
                      onDrop={handleDrop}
                      onClick={() => inputRef.current?.click()}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          inputRef.current?.click()
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label="Upload a manuscript"
                    >
                      <div className="flex min-h-[16.5rem] flex-col items-center justify-center px-6 py-10 text-center">
                        <div className="upload-zone__icon relative mb-6 grid h-16 w-16 place-items-center rounded-full border border-gold/25 bg-orange/[0.07]">
                          <UploadCloud size={24} strokeWidth={1.2} className="text-gold" />
                          <span className="absolute inset-[-8px] rounded-full border border-dashed border-bone/10" />
                        </div>
                        <p className="font-display text-[1.15rem] font-medium tracking-[-0.02em] text-bone">
                          Drop your manuscript into the light
                        </p>
                        <p className="upload-help mt-2 max-w-sm text-[0.76rem] leading-6 text-smoke">
                          Drag a book here, or browse your shelf. Up to 50 MB. Your file never leaves this demo.
                        </p>
                        <span className="mt-6 inline-flex items-center gap-2 border-b border-gold/40 pb-1 text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-gold transition-colors group-hover/zone:border-orange group-hover/zone:text-orange">
                          Browse files
                          <span className="font-mono text-[0.46rem]">↗</span>
                        </span>
                        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
                          {ACCEPTED.map((format) => (
                            <span
                              key={format}
                              className="border border-bone/10 bg-bone/[0.02] px-2 py-1 font-mono text-[0.44rem] uppercase tracking-[0.13em] text-bone/84"
                            >
                              {format}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="filled"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="mt-6 border border-bone/10 bg-bone/[0.025] p-4 sm:p-5"
                    >
                      <div className="flex items-start gap-4">
                        <div className="relative grid h-14 w-12 shrink-0 place-items-center overflow-hidden border border-gold/25 bg-gradient-to-br from-[#24140b] to-[#090807]">
                          <FileText size={18} className="text-[#FFB15C]" />
                          <span className="absolute bottom-1 font-mono text-[0.4rem] uppercase tracking-widest text-orange">
                            {file.ext}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[0.86rem] font-medium text-bone">{file.name}</p>
                          <p className="mt-1 font-mono text-[0.48rem] uppercase tracking-[0.13em] text-smoke/70">
                            {formatBytes(file.size)} · {extractionMode === 'local' ? 'Text extracted' : extractionMode === 'reading' ? 'Reading document…' : 'Text extraction failed'}
                          </p>
                          <div className="mt-3 flex items-center gap-2">
                            <span className="h-1 w-1 rounded-full bg-emerald-400" />
                            <span className="text-[0.6rem] text-bone/60">
                              {extractionMode === 'local'
                                ? 'The uploaded document text is ready to read aloud.'
                                : extractionMode === 'reading' ? 'Extracting text from your document.' : 'Choose a document with readable text.'}
                            </span>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              stopPlayback()
                              inputRef.current?.click()
                            }}
                            disabled={busy}
                            className="px-2 py-1 text-[0.52rem] uppercase tracking-[0.12em] text-bone/60 transition-colors hover:text-gold disabled:pointer-events-none disabled:opacity-25"
                          >
                            Replace
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              stopPlayback()
                              setFile(null)
                              uploadVersion.current += 1
                              setExtractionMode('sample')
                              setExcerpt('')
                              setResult(null)
                              setPhase('idle')
                              setProgress(0)
                              setError('')
                            }}
                            disabled={busy}
                            className="grid h-7 w-7 place-items-center text-bone/84 transition-colors hover:bg-bone/5 hover:text-orange disabled:pointer-events-none disabled:opacity-25"
                            aria-label="Remove manuscript"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-7 grid grid-cols-1 gap-7 border-t border-bone/[0.08] pt-6 sm:grid-cols-2">
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-mono text-[0.49rem] uppercase tracking-[0.2em] text-bone/88">02 / Language</span>
                      <span className="font-mono text-[0.43rem] uppercase tracking-[0.12em] text-bone/38">3 available</span>
                    </div>
                    <select
                      aria-label="Language"
                      className="min-h-11 w-full border border-bone/15 bg-coal px-3 text-base text-bone disabled:opacity-50 md:hidden"
                      value={languageId}
                      onChange={(event) => handleLanguage(event.target.value)}
                      disabled={busy}
                    >
                      {LANGUAGES.map((item) => (
                        <option key={item.id} value={item.id} lang={item.code}>
                          {item.display}
                        </option>
                      ))}
                    </select>
                    <div className="segmented !hidden w-full md:!inline-flex">
                      {LANGUAGES.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleLanguage(item.id)}
                          aria-pressed={languageId === item.id}
                          className={`flex-1 justify-center !px-1.5 ${
                            item.code === 'ta' ? '!font-tamil !normal-case' : item.code === 'ur' ? '!font-urdu !normal-case !text-[0.78rem]' : ''
                          }`}
                          disabled={busy}
                        >
                          {item.display}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-mono text-[0.49rem] uppercase tracking-[0.2em] text-bone/88">Reading speed</span>
                      <span className="font-mono text-[0.62rem] text-gold">{speed.toFixed(2)}×</span>
                    </div>
                    <input
                      type="range"
                      min="0.75"
                      max="2"
                      step="0.05"
                      value={speed}
                      disabled={busy}
                      onChange={(event) => setSpeed(Number(event.target.value))}
                      className="range"
                      style={{ '--value': `${((speed - 0.75) / 1.25) * 100}%` }}
                      aria-label="Reading speed"
                    />
                    <div className="mt-1 flex justify-between font-mono text-[0.42rem] uppercase tracking-[0.1em] text-bone/90">
                      <span>0.75×</span>
                      <span>1×</span>
                      <span>1.5×</span>
                      <span>2×</span>
                    </div>
                  </div>
                </div>

                <div className="mt-7">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-mono text-[0.49rem] uppercase tracking-[0.2em] text-bone/88">03 / Voice</span>
                    <span className="font-mono text-[0.43rem] uppercase tracking-[0.12em] text-bone/38">
                      {language.display} voices
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {voiceOptions.map((option) => {
                      const auditioning = audio.playingId === `voice-${option.id}`
                      return (
                        <div
                          key={option.id}
                          className="voice-option flex items-stretch"
                          data-active={voiceId === option.id}
                        >
                          <button
                            type="button"
                            className="flex min-w-0 flex-1 items-center gap-3 p-3 text-left"
                            onClick={() => {
                              stopPlayback()
                              setVoiceId(option.id)
                              setResult(null)
                              setPhase('idle')
                              setProgress(0)
                            }}
                            disabled={busy}
                            aria-pressed={voiceId === option.id}
                          >
                            <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-orange/25 bg-gradient-to-br from-orange/15 to-transparent font-display text-[0.8rem] text-gold">
                              {option.name[0]}
                              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-ink bg-orange" />
                            </span>
                            <span className="min-w-0">
                              <span className="flex items-baseline gap-2">
                                <span className="text-[0.78rem] font-medium text-bone">{option.name}</span>
                                <span className="font-mono text-[0.42rem] uppercase tracking-[0.1em] text-bone/84">{option.gender}</span>
                              </span>
                              <span className="mt-0.5 block truncate text-[0.58rem] text-smoke">{option.tone}</span>
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => audio.toggle(option.sampleAudio, `voice-${option.id}`)}
                            disabled={busy}
                            className="my-2 mr-2 grid w-8 shrink-0 place-items-center border border-bone/10 text-bone/88 transition-colors hover:border-gold/40 hover:text-gold disabled:pointer-events-none disabled:opacity-30"
                            aria-label={auditioning ? `Pause ${option.name} voice sample` : `Hear ${option.name} voice sample`}
                          >
                            {auditioning ? <Pause size={12} fill="currentColor" /> : <Volume2 size={13} />}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                  <p className="mt-3 text-[0.6rem] leading-5 text-bone/84">{voice.signature}</p>
                </div>

                <div className="mt-7 border-t border-bone/[0.08] pt-6">
                  <AnimatePresence>
                    {error || audio.error || speech.error ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 overflow-hidden"
                        role="status"
                      >
                        <p className="border-l border-orange bg-orange/[0.06] px-3 py-2 text-[0.65rem] leading-5 text-orange/90">
                          {error || audio.error || speech.error}
                          <button
                            type="button"
                            onClick={() => {
                              setError('')
                              audio.setError('')
                              speech.clearError()
                            }}
                            className="ml-3 underline underline-offset-2"
                          >
                            Dismiss
                          </button>
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  {busy ? (
                    <div className="flex items-center gap-3">
                      <button type="button" className="btn btn-primary flex-1 opacity-80" disabled>
                        <Loader2 size={14} className="animate-spin" />
                        Rendering · {Math.round(progress)}%
                      </button>
                      <button type="button" onClick={handleCancel} className="icon-button" aria-label="Cancel conversion">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={handleConvert} disabled={extractionMode === 'reading'} className="btn btn-primary group w-full">
                      <Sparkles size={14} className="text-bone/84" />
                      {complete ? 'Convert again' : 'Convert to audio'}
                      <span className="btn__icon">
                        <ArrowIcon />
                      </span>
                    </button>
                  )}

                  <div className="mt-3 flex items-center justify-between gap-4">
                    <p className="flex items-center gap-1.5 text-[0.54rem] text-bone/90">
                      <Info size={10} />
                      Uploaded text plays with your device’s text-to-speech voice.
                    </p>
                    <p className="hidden items-center gap-1.5 font-mono text-[0.42rem] uppercase tracking-[0.12em] text-bone/38 sm:flex">
                      <ShieldCheck size={10} /> Private by design
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="col-span-12 lg:col-span-5">
            <aside className="glass-panel relative flex h-full flex-col overflow-hidden">
              <span className="panel-corner panel-corner--tl" />
              <span className="panel-corner panel-corner--tr" />
              <span className="panel-corner panel-corner--bl" />
              <span className="panel-corner panel-corner--br" />

              <div className="flex items-center justify-between border-b border-bone/[0.08] px-5 py-4 sm:px-6">
                <span className="font-mono text-[0.49rem] uppercase tracking-[0.2em] text-bone/88">Conversion chamber</span>
                <span className="flex items-center gap-2 font-mono text-[0.43rem] uppercase tracking-[0.12em] text-bone/88">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      complete ? 'bg-emerald-400' : busy ? 'animate-pulse bg-orange' : 'bg-bone/25'
                    }`}
                  />
                  {complete ? 'Preview ready' : busy ? 'Processing' : 'Standby'}
                </span>
              </div>

              <div className="conversion-visual flex-1 px-5 pb-2 pt-6 sm:px-6">
                <div className="relative grid h-[16rem] w-full place-items-center">
                  <div
                    className="absolute h-[15.5rem] w-[15.5rem] rounded-full p-px transition-all duration-700"
                    style={{
                      background: `conic-gradient(${progress > 0 ? 'var(--orange)' : 'rgba(255,255,255,0.16)'} ${Math.max(
                        0.5,
                        progress * 3.6,
                      )}deg, rgba(255,255,255,0.055) 0)`,
                      opacity: progress > 0 ? 1 : 0.7,
                    }}
                  >
                    <div className="h-full w-full rounded-full bg-coal/80" />
                  </div>
                  <div className="absolute h-[13.2rem] w-[13.2rem] rounded-full border border-dashed border-bone/[0.07]" />
                  <div className="absolute h-[17.5rem] w-[17.5rem] rounded-full border border-bone/[0.035]" />
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="pointer-events-none absolute left-0 top-1/2 hidden -translate-y-1/2 sm:block">
                      <Waveform
                        bars={12}
                        height="5rem"
                        playing={busy || complete}
                        color="rgba(255,177,92,.55)"
                        seed={3}
                      />
                    </div>
                    <div className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 sm:block">
                      <Waveform
                        bars={12}
                        height="5rem"
                        playing={busy || complete}
                        color="rgba(255,107,39,.5)"
                        seed={7}
                      />
                    </div>

                    <motion.div
                      className="relative z-10"
                      animate={reduce ? undefined : { y: busy ? [0, -5, 0] : [0, -8, 0] }}
                      transition={{ duration: busy ? 2 : 6, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <div className="conversion-book">
                        <img
                          src="/assets/books/studio-silent-meridian.png"
                          alt="The Silent Meridian audiobook cover by Arun Krishnan"
                          className="absolute inset-0 h-full w-full rounded-[1px_4px_4px_1px] object-contain"
                          loading="lazy"
                          draggable={false}
                        />
                        {busy ? (
                          <div className="absolute inset-0 flex items-center justify-center gap-[3px] bg-[#0b0806]/55 backdrop-blur-[1px]">
                            {Array.from({ length: 11 }).map((_, i) => (
                              <span
                                key={i}
                                className="w-[2px] bg-gold"
                                style={{
                                  height: `${25 + ((i * 17) % 45)}%`,
                                  animation: `equalize ${0.7 + (i % 4) * 0.15}s ease-in-out ${i * 0.06}s infinite`,
                                  opacity: 0.7,
                                }}
                              />
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </motion.div>
                  </div>

                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 font-mono text-[0.45rem] uppercase tracking-[0.23em] text-bone/90">
                    {complete ? '100% · mastered' : busy ? `${Math.round(progress)}% · weaving voice` : 'Awaiting manuscript'}
                  </span>
                </div>

                <div className="mt-2 space-y-0">
                  {STAGES.map((stage, index) => {
                    const done = complete || progress > stage.at + (index === STAGES.length - 1 ? 0 : 14)
                    const active = busy && index === stageIndex && !done
                    return (
                      <div
                        key={stage.key}
                        className={`flex items-center gap-3 border-t border-bone/[0.065] py-2.5 ${
                          done || active ? 'opacity-100' : 'opacity-35'
                        }`}
                      >
                        <span
                          className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[0.4rem] ${
                            done
                              ? 'border-orange/60 bg-orange/15 text-orange'
                              : active
                                ? 'border-gold/60 text-gold'
                                : 'border-bone/15 text-bone/84'
                          }`}
                        >
                          {done ? <Check size={9} /> : active ? <Loader2 size={9} className="animate-spin" /> : String(index + 1).padStart(2, '0')}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className={`text-[0.64rem] ${done ? 'text-bone/84' : active ? 'text-bone' : 'text-bone/60'}`}>{stage.label}</p>
                          <p className="truncate text-[0.49rem] text-bone/90">{stage.detail}</p>
                        </div>
                        {done ? <span className="font-mono text-[0.4rem] uppercase tracking-[0.1em] text-orange/50">Done</span> : null}
                      </div>
                    )
                  })}
                </div>
              </div>

              <AnimatePresence>
                {complete && result ? (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 14 }}
                    className="border-t border-orange/20 bg-orange/[0.035] p-5 sm:p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange" />
                        <span className="font-mono text-[0.47rem] uppercase tracking-[0.19em] text-gold/80">Preview ready</span>
                      </div>
                      <span className="font-mono text-[0.43rem] uppercase tracking-[0.12em] text-bone/90">Document narration</span>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handlePreview}
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-orange text-bone transition-transform duration-300 hover:scale-105"
                        aria-label={previewing ? 'Pause document narration' : 'Play document narration'}
                      >
                        {previewing ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" className="ml-0.5" />}
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[0.72rem] text-bone/90">
                          {language.display} · {speech.voiceName || 'Device voice'} · {result.manifest.speed.toFixed(2)}×
                        </p>
                        <p className="mt-0.5 truncate font-mono text-[0.42rem] uppercase tracking-[0.1em] text-bone/90">
                          Reading your uploaded document
                        </p>
                      </div>
                      <Volume2 size={14} className="shrink-0 text-bone/90" />
                    </div>

                    <Waveform
                      bars={38}
                      playing={previewing}
                      height="2.2rem"
                      color="rgba(255,177,92,.7)"
                      className="mt-3"
                      seed={5}
                    />

                    <p className="mt-2 line-clamp-2 text-[0.56rem] italic leading-5 text-bone/84">
                      “{excerpt}”
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={resetConversion}
                        className="studio-reset inline-flex items-center justify-center gap-2 border border-bone/10 px-3 py-2.5 text-[0.52rem] font-semibold uppercase tracking-[0.12em] text-bone/90 transition-colors hover:border-bone/25 hover:text-bone"
                      >
                        <RotateCcw size={12} />
                        Reset
                      </button>
                    </div>
                    <p className="mt-3 text-[0.52rem] leading-4 text-bone/90">
                      Reads the complete extracted text using an available device voice. Narrator samples above are auditions. MP3 export requires a connected audio-generation service.
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </aside>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="mt-6 flex flex-col justify-between gap-3 border-t border-bone/[0.07] pt-5 text-[0.55rem] text-bone/90 sm:flex-row sm:items-center">
            <p className="flex items-center gap-2">
              <Info size={11} className="text-orange/60" />
              Document text is extracted in your browser. Playback uses your device’s text-to-speech voices.
            </p>
            <p className="font-mono uppercase tracking-[0.15em]">
              Extraction <span className="mx-1 text-bone/86">/</span> Synthesis{' '}
              <span className="mx-1 text-bone/86">/</span> Mastering
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
