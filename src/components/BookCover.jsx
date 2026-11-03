function CoverArt({ variant, accent }) {
  if (variant === 'meridian') {
    return (
      <svg viewBox="0 0 400 560" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <radialGradient id="meridian-glow" cx="50%" cy="64%" r="55%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.55" />
            <stop offset="55%" stopColor={accent} stopOpacity="0.08" />
            <stop offset="100%" stopColor="#080808" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="meridian-line" x1="0" x2="1">
            <stop stopColor={accent} stopOpacity="0" />
            <stop offset="0.5" stopColor={accent} />
            <stop offset="1" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="400" height="560" fill="#0a0908" />
        <rect width="400" height="560" fill="url(#meridian-glow)" />
        <g fill="none" stroke={accent} strokeOpacity="0.4">
          <circle cx="200" cy="345" r="122" />
          <circle cx="200" cy="345" r="99" strokeOpacity="0.22" />
          <circle cx="200" cy="345" r="158" strokeOpacity="0.12" />
          <circle cx="200" cy="345" r="188" strokeOpacity="0.07" />
        </g>
        <circle cx="200" cy="345" r="59" fill={accent} fillOpacity="0.14" stroke={accent} strokeOpacity="0.7" />
        <path d="M0 346h400" stroke="url(#meridian-line)" strokeWidth="1" />
        <path d="M200 176v338" stroke="#fff" strokeOpacity="0.09" />
        <g fill="#F4EDE3" fillOpacity="0.6">
          <circle cx="80" cy="205" r="1" />
          <circle cx="326" cy="164" r="1.4" />
          <circle cx="305" cy="246" r="0.8" />
          <circle cx="101" cy="278" r="1.2" />
          <circle cx="342" cy="330" r="1" />
        </g>
        <path d="M-20 500c90-38 173-42 250-14s135 24 190-6" fill="none" stroke={accent} strokeOpacity="0.28" />
      </svg>
    )
  }

  if (variant === 'moon') {
    return (
      <svg viewBox="0 0 400 560" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="moon-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#261208" />
            <stop offset="50%" stopColor="#120b07" />
            <stop offset="100%" stopColor="#080706" />
          </linearGradient>
          <linearGradient id="moon-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFE0B0" />
            <stop offset="48%" stopColor={accent} />
            <stop offset="100%" stopColor="#B95D22" />
          </linearGradient>
        </defs>
        <rect width="400" height="560" fill="url(#moon-bg)" />
        <circle cx="238" cy="270" r="114" fill="url(#moon-grad)" opacity="0.94" />
        <circle cx="196" cy="245" r="121" fill="#120b07" />
        <g stroke="#FFD6A0" strokeOpacity="0.25" fill="none">
          <path d="M40 112h320M40 446h320" />
          <path d="M64 426c30-18 62-26 96-22s60 22 92 22 56-12 84-34" />
        </g>
        <g fill="#FFD6A0" fillOpacity="0.55">
          <circle cx="70" cy="150" r="1.3" />
          <circle cx="320" cy="112" r="1" />
          <circle cx="342" cy="390" r="1.4" />
          <circle cx="88" cy="370" r="1" />
        </g>
        <text x="42" y="88" fill="#FFD6A0" fillOpacity="0.7" fontFamily="monospace" fontSize="7" letterSpacing="3">
          A LOVE STORY IN TWO MONSOONS
        </text>
      </svg>
    )
  }

  if (variant === 'dawn') {
    return (
      <svg viewBox="0 0 400 560" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="dawn-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1c1209" />
            <stop offset="70%" stopColor="#0c0907" />
            <stop offset="100%" stopColor="#080706" />
          </linearGradient>
          <radialGradient id="dawn-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE9C4" />
            <stop offset="50%" stopColor={accent} />
            <stop offset="100%" stopColor="#FF6B27" stopOpacity="0.1" />
          </radialGradient>
        </defs>
        <rect width="400" height="560" fill="url(#dawn-bg)" />
        <g fill="none" stroke={accent} strokeOpacity="0.18">
          <path d="M26 34h348v492H26z" />
          <path d="M34 42h332v476H34z" strokeOpacity="0.1" />
          <path d="M54 54h292" />
          <path d="M54 506h292" />
        </g>
        <circle cx="200" cy="310" r="116" fill="url(#dawn-sun)" opacity="0.32" />
        <circle cx="200" cy="310" r="62" fill={accent} fillOpacity="0.24" stroke={accent} strokeOpacity="0.8" />
        <g stroke={accent} strokeOpacity="0.5">
          <path d="M200 70v74M200 476v40M42 310h86M272 310h86" />
          <path d="M92 202l48 48M260 370l48 48M308 202l-48 48M140 370l-48 48" strokeOpacity="0.24" />
        </g>
        <g fill={accent} fillOpacity="0.6">
          <circle cx="114" cy="128" r="1" />
          <circle cx="304" cy="94" r="1.4" />
          <circle cx="334" cy="454" r="1" />
          <circle cx="76" cy="416" r="1.3" />
        </g>
      </svg>
    )
  }

  if (variant === 'topography') {
    return (
      <svg viewBox="0 0 400 560" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="topo-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1b1711" />
            <stop offset="100%" stopColor="#0a0907" />
          </linearGradient>
          <radialGradient id="topo-eclipse" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE7C7" stopOpacity="0.9" />
            <stop offset="62%" stopColor={accent} stopOpacity="0.2" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="560" fill="url(#topo-bg)" />
        <g fill="none" stroke={accent} strokeOpacity="0.25" strokeWidth="0.8">
          <path d="M-40 430c76-52 132-84 197-80s99 35 148 15 73-56 120-64" />
          <path d="M-40 410c80-48 139-78 199-73s94 35 143 14 76-52 121-61" />
          <path d="M-40 390c82-44 146-70 202-66s90 33 137 12 78-48 124-56" />
          <path d="M-40 370c86-40 153-62 204-58s86 31 133 10 80-44 128-52" />
          <path d="M-40 350c88-36 160-55 207-51s82 29 127 8 82-40 130-47" />
          <path d="M-30 330c90-32 166-47 212-43s77 26 122 5 82-36 131-42" />
          <path d="M-20 310c92-28 172-40 217-36s73 24 116 3 84-32 132-37" />
          <path d="M-10 290c94-24 178-33 222-29s68 22 110 1 85-28 133-32" />
          <path d="M0 270c96-20 184-27 227-23s63 20 104-1 86-24 134-27" />
          <path d="M10 250c98-16 190-20 232-16s58 18 98-3 87-20 135-22" />
        </g>
        <circle cx="202" cy="190" r="96" fill="url(#topo-eclipse)" opacity="0.55" />
        <circle cx="202" cy="190" r="39" fill="#090807" stroke={accent} strokeOpacity="0.7" />
        <path d="M110 190h184" stroke={accent} strokeOpacity="0.4" />
        <path d="M202 102v176" stroke={accent} strokeOpacity="0.2" />
        <g fill={accent} fillOpacity="0.6">
          <circle cx="120" cy="102" r="1" />
          <circle cx="312" cy="140" r="1.4" />
          <circle cx="70" cy="470" r="1" />
          <circle cx="338" cy="440" r="1.2" />
        </g>
      </svg>
    )
  }

  if (variant === 'ocean') {
    return (
      <svg viewBox="0 0 400 560" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="ocean-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#17100b" />
            <stop offset="58%" stopColor="#0d0907" />
            <stop offset="100%" stopColor="#080706" />
          </linearGradient>
          <linearGradient id="ocean-wave" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor={accent} stopOpacity="0" />
            <stop offset="0.5" stopColor={accent} />
            <stop offset="1" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="400" height="560" fill="url(#ocean-bg)" />
        <circle cx="200" cy="230" r="86" fill="none" stroke={accent} strokeOpacity="0.7" />
        <circle cx="200" cy="230" r="68" fill={accent} fillOpacity="0.1" />
        <g fill="none" stroke="url(#ocean-wave)" strokeWidth="1">
          <path d="M-20 330c60-34 105-34 165 0s120 34 190 0 75-22 106 0" />
          <path d="M-20 366c60-34 105-34 165 0s120 34 190 0 75-22 106 0" strokeOpacity="0.7" />
          <path d="M-20 402c60-34 105-34 165 0s120 34 190 0 75-22 106 0" strokeOpacity="0.5" />
          <path d="M-20 438c60-34 105-34 165 0s120 34 190 0 75-22 106 0" strokeOpacity="0.3" />
          <path d="M-20 474c60-34 105-34 165 0s120 34 190 0 75-22 106 0" strokeOpacity="0.18" />
          <path d="M-20 510c60-34 105-34 165 0s120 34 190 0 75-22 106 0" strokeOpacity="0.1" />
        </g>
        <g fill={accent} fillOpacity="0.55">
          <circle cx="96" cy="130" r="1.2" />
          <circle cx="318" cy="118" r="1" />
          <circle cx="342" cy="282" r="1.3" />
          <circle cx="62" cy="290" r="1" />
          <circle cx="284" cy="176" r="0.8" />
        </g>
        <path d="M200 144v172" stroke={accent} strokeOpacity="0.2" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 400 560" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="noir-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a0c08" />
          <stop offset="52%" stopColor="#0d0807" />
          <stop offset="100%" stopColor="#070706" />
        </linearGradient>
        <linearGradient id="noir-beam" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={accent} stopOpacity="0.5" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="400" height="560" fill="url(#noir-bg)" />
      <path d="M260 0h74L230 560h-74z" fill="url(#noir-beam)" opacity="0.38" />
      <path d="M320 0h28L248 560h-28z" fill="url(#noir-beam)" opacity="0.3" />
      <g stroke={accent} strokeOpacity="0.26">
        <path d="M40 78h320M40 470h320" />
        <path d="M40 88h150M210 460h150" strokeOpacity="0.15" />
      </g>
      <g fill="none" stroke={accent} strokeOpacity="0.3">
        <circle cx="292" cy="164" r="58" />
        <circle cx="292" cy="164" r="72" strokeOpacity="0.14" />
      </g>
      <g fill="#F1E6D6" fillOpacity="0.55" fontFamily="monospace" fontSize="7" letterSpacing="3">
        <text x="40" y="112">CASE FILE / 004</text>
        <text x="40" y="496">A CITY THAT NEVER SLEEPS</text>
      </g>
      <path d="M74 206h118M74 222h86M74 238h102" stroke="#F1E6D6" strokeOpacity="0.22" />
    </svg>
  )
}

export default function BookCover({ book, className = '' }) {
  const isRtl = book.langCode === 'اردو'
  const isTamil = book.langCode === 'த'
  const titleSize = isRtl ? '8.4cqw' : isTamil ? '10.2cqw' : book.title.length > 19 ? '8.1cqw' : book.title.length > 15 ? '9.4cqw' : '10.8cqw'

  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-[2px_4px_4px_2px] ${className}`}
      style={{ containerType: 'inline-size', background: '#0a0908' }}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <CoverArt variant={book.art} accent={book.accent} />

      <div className="absolute inset-0 flex flex-col justify-between p-[8cqw]">
        <div className="flex items-start justify-between gap-3">
          <span
            className="font-display font-semibold uppercase"
            style={{ fontSize: '3.1cqw', letterSpacing: '0.3em', color: book.ink, opacity: 0.75 }}
          >
            Chaptera
          </span>
          <span
            className="font-mono uppercase"
            style={{ fontSize: '2.2cqw', letterSpacing: '0.16em', color: book.ink, opacity: 0.38 }}
          >
            Original
          </span>
        </div>

        <div className={`${book.art === 'meridian' ? 'mb-[16cqw]' : ''}`}>
          <div className="mb-[4cqw] flex items-center gap-[2.5cqw]">
            <span style={{ height: 1, width: '9cqw', background: book.accent, opacity: 0.8 }} />
            <span
              className={isTamil ? 'font-tamil' : isRtl ? 'font-urdu' : 'font-sans'}
              style={{
                fontSize: isRtl ? '3.5cqw' : '2.6cqw',
                letterSpacing: isRtl ? '0' : '0.18em',
                color: book.accent,
                lineHeight: isRtl ? 2 : 1.2,
              }}
            >
              {book.kicker}
            </span>
          </div>
          <h3
            className={`font-display font-semibold leading-[0.94] ${
              isRtl ? 'font-urdu leading-[1.5]' : isTamil ? 'font-tamil' : ''
            }`}
            style={{
              fontSize: titleSize,
              letterSpacing: isRtl ? '0' : '-0.055em',
              color: book.ink,
              textShadow: '0 2px 20px rgba(0,0,0,.35)',
              overflowWrap: 'break-word',
            }}
          >
            {book.title}
          </h3>
          <p
            className="font-sans uppercase"
            style={{
              fontSize: '2.7cqw',
              letterSpacing: '0.18em',
              color: book.ink,
              opacity: 0.58,
              marginTop: '4cqw',
            }}
          >
            {book.author}
          </p>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex items-center gap-[1.5cqw]">
            <span style={{ width: 3, height: '2.7cqw', background: book.accent }} />
            <span
              className="font-sans uppercase"
              style={{ fontSize: '2.1cqw', letterSpacing: '0.2em', color: book.ink, opacity: 0.48 }}
            >
              Unabridged · {book.duration}
            </span>
          </div>
          <span
            className="font-sans uppercase"
            style={{ fontSize: '2.2cqw', letterSpacing: '0.16em', color: book.accent, opacity: 0.9 }}
          >
            {book.language}
          </span>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(0,0,0,.36), transparent 8%, transparent 92%, rgba(0,0,0,.28)), linear-gradient(125deg, rgba(255,255,255,.12), transparent 28%)',
        }}
      />
      <div className="noise-overlay" />
    </div>
  )
}
