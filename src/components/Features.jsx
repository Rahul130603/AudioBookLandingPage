import { Bookmark, FileText, Globe2, Headphones, Languages, ListMusic, Gauge } from 'lucide-react'
import { FEATURES } from '../lib/data'
import { Reveal, SectionHeading } from './Reveal'

function FormatsGlyph() {
  return (
    <div className="feat-glyph feat-glyph--formats" aria-hidden="true">
      <span className="format-ring" />
      <span className="format-ring format-ring--2" />
      {['PDF', 'EPUB', 'TXT', 'DOCX'].map((format, index) => (
        <span key={format} className={`format-sheet format-sheet--${index + 1}`}>
          <span className="format-sheet__stamp">{format}</span>
          <span className="format-sheet__line" />
          <span className="format-sheet__line format-sheet__line--short" />
          <span className="format-sheet__line" />
        </span>
      ))}
      <span className="format-inflow">
        <FileText size={16} strokeWidth={1.1} />
      </span>
    </div>
  )
}

function LanguagesGlyph() {
  return (
    <div className="feat-glyph feat-glyph--languages" aria-hidden="true">
      <span className="lang-orbit" />
      <span className="lang-orbit lang-orbit--2" />
      <span className="lang-node lang-node--en">EN</span>
      <span className="lang-node lang-node--ta font-tamil">த</span>
      <span className="lang-node lang-node--ur font-urdu">ا</span>
      <span className="lang-center">
        <Languages size={25} strokeWidth={1} />
      </span>
      <span className="lang-dot lang-dot--1" />
      <span className="lang-dot lang-dot--2" />
    </div>
  )
}

function VoicesGlyph() {
  return (
    <div className="feat-glyph feat-glyph--voices" aria-hidden="true">
      <div className="voice-orb">
        {Array.from({ length: 32 }).map((_, index) => (
          <span
            key={index}
            style={{
              transform: `rotate(${index * 11.25}deg) translateY(-3.9rem)`,
              height: `${14 + Math.abs(Math.sin(index * 0.7)) * 28}px`,
              animationDelay: `${index * 0.035}s`,
            }}
          />
        ))}
        <span className="voice-orb__core">
          <span />
          <span />
          <span />
        </span>
      </div>
      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 font-mono text-[0.43rem] uppercase tracking-[0.17em] text-gold/45">
        <span className="h-1 w-1 rounded-full bg-orange" />
        Neural voice · 48 kHz
      </div>
    </div>
  )
}

function SpeedGlyph() {
  return (
    <div className="feat-glyph feat-glyph--speed" aria-hidden="true">
      <div className="speed-dial">
        <span className="speed-dial__ticks" />
        <span className="speed-dial__needle" />
        <span className="speed-dial__hub" />
        <span className="speed-dial__label speed-dial__label--min">0.75×</span>
        <span className="speed-dial__label speed-dial__label--max">2×</span>
        <span className="speed-dial__value">1.25×</span>
      </div>
      <span className="speed-ring" />
    </div>
  )
}

function BookmarkGlyph() {
  return (
    <div className="feat-glyph feat-glyph--bookmark" aria-hidden="true">
      <div className="bookmark-page">
        <span className="bookmark-page__chapter">CH. 02</span>
        <span className="bookmark-page__line" />
        <span className="bookmark-page__line bookmark-page__line--short" />
        <span className="bookmark-page__line" />
        <span className="bookmark-page__line bookmark-page__line--short" />
      </div>
      <div className="bookmark-ribbon">
        <Bookmark size={35} strokeWidth={1.1} fill="currentColor" />
      </div>
      <span className="bookmark-time">00:42</span>
    </div>
  )
}

function AnywhereGlyph() {
  return (
    <div className="feat-glyph feat-glyph--anywhere" aria-hidden="true">
      <div className="globe-wire">
        <svg viewBox="0 0 220 220" fill="none">
          <circle cx="110" cy="110" r="74" stroke="rgba(255,177,92,.22)" />
          <ellipse cx="110" cy="110" rx="34" ry="74" stroke="rgba(255,177,92,.14)" />
          <ellipse cx="110" cy="110" rx="58" ry="74" stroke="rgba(255,177,92,.09)" />
          <ellipse cx="110" cy="110" rx="74" ry="27" stroke="rgba(255,177,92,.15)" />
          <ellipse cx="110" cy="110" rx="74" ry="51" stroke="rgba(255,177,92,.08)" />
          <path d="M36 110h148M110 36v148" stroke="rgba(255,177,92,.08)" />
        </svg>
        <span className="globe-orbit">
          <span />
        </span>
        <span className="globe-core">
          <Headphones size={24} strokeWidth={1.2} />
        </span>
      </div>
      <span className="globe-tag globe-tag--1">TRAIN · 08:14</span>
      <span className="globe-tag globe-tag--2">HOME · 21:36</span>
    </div>
  )
}

function ChaptersGlyph() {
  return (
    <div className="feat-glyph feat-glyph--chapters" aria-hidden="true">
      <div className="chapter-stack">
        {['04', '03', '02', '01'].map((chapter, index) => (
          <span
            key={chapter}
            className="chapter-sheet"
            style={{ transform: `translate(${index * 16}px, ${index * 9}px) rotate(${index * 1.8}deg)`, zIndex: 4 - index }}
          >
            <span className="chapter-sheet__num">{chapter}</span>
            <span>
              <span className="chapter-sheet__line" />
              <span className="chapter-sheet__line chapter-sheet__line--short" />
            </span>
            <ListMusic size={12} strokeWidth={1.2} />
          </span>
        ))}
      </div>
      <span className="chapter-progress">
        <span />
      </span>
    </div>
  )
}

const GLYPHS = {
  formats: FormatsGlyph,
  languages: LanguagesGlyph,
  voices: VoicesGlyph,
  speed: SpeedGlyph,
  bookmark: BookmarkGlyph,
  anywhere: AnywhereGlyph,
  chapters: ChaptersGlyph,
}

const GLYPH_ICONS = {
  formats: FileText,
  languages: Languages,
  voices: Gauge,
  speed: Gauge,
  bookmark: Bookmark,
  anywhere: Globe2,
  chapters: ListMusic,
}

export default function Features() {
  return (
    <section id="features" className="relative overflow-hidden border-b border-bone/[0.06] section-pad">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,107,39,0.075),transparent_38%)]" />
        <div className="grid-lines absolute inset-0 opacity-20" />
      </div>

      <div className="container-x relative">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Why Chaptera / Seven quiet advantages"
            title={
              <>
                Built for the hours
                <br />
                <span className="text-shine">you spend elsewhere.</span>
              </>
            }
          />
          <Reveal delay={0.15}>
            <p className="max-w-sm border-l border-bone/10 pl-5 text-sm leading-7 text-smoke">
              We built Chaptera around a simple belief: a great book should never be limited by the shape of its pages.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-12 lg:mt-20">
          {FEATURES.map((feature, index) => {
            const Glyph = GLYPHS[feature.glyph]
            const Icon = GLYPH_ICONS[feature.glyph]
            return (
              <Reveal key={feature.number} delay={index * 0.045} className={`${feature.span} flex`}>
                <article className={`feature-tile group flex w-full flex-col ${feature.height} p-5 sm:p-7`}>
                  <div className="flex items-start justify-between">
                    <span className="flex items-center gap-2 font-mono text-[0.46rem] uppercase tracking-[0.2em] text-bone/90">
                      <Icon size={11} strokeWidth={1.2} className="text-orange/50" />
                      {feature.number}
                    </span>
                    <span className="font-mono text-[0.42rem] uppercase tracking-[0.14em] text-bone/86">
                      0{index + 1} / 07
                    </span>
                  </div>

                  <Glyph />

                  <div className="mt-auto pt-7">
                    <h3 className="font-display text-[clamp(1.3rem,2.1vw,1.75rem)] font-medium tracking-[-0.035em] text-bone">
                      {feature.title}
                    </h3>
                    <p className="mt-3 max-w-md text-[0.78rem] leading-6 text-smoke">{feature.copy}</p>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-col justify-between gap-3 border-t border-bone/[0.08] pt-5 sm:flex-row sm:items-center">
            <p className="text-[0.58rem] leading-5 text-bone/90">
              Every detail is built to keep you inside the story — not inside the interface.
            </p>
            <div className="flex items-center gap-6 font-mono text-[0.44rem] uppercase tracking-[0.15em] text-bone/38">
              <span>EN</span>
              <span className="font-tamil normal-case text-[0.58rem]">தமிழ்</span>
              <span className="font-urdu normal-case text-[0.62rem]">اردو</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
