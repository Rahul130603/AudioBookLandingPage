export default function BookCover({ book, className = '', mode = 'custom' }) {
  const isRtl = book.langCode === 'اردو'
  const isTamil = book.langCode === 'த'
  const titleSize = isRtl ? '8.4cqw' : isTamil ? '10.2cqw' : book.title.length > 19 ? '8.1cqw' : book.title.length > 15 ? '9.4cqw' : '10.8cqw'
  const source = mode === 'full' ? book.fullCover || book.cover : book.cover

  if (mode === 'full') {
    return (
      <div
        className={`relative h-full w-full overflow-hidden rounded-[2px_4px_4px_2px] ${className}`}
        style={{ background: '#0a0908' }}
      >
        <img
          src={source}
          alt=""
          loading="lazy"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(0,0,0,.34), transparent 8%, transparent 92%, rgba(0,0,0,.26)), linear-gradient(125deg, rgba(255,255,255,.12), transparent 28%)',
          }}
        />
        <div className="noise-overlay" />
      </div>
    )
  }

  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-[2px_4px_4px_2px] ${className}`}
      style={{ containerType: 'inline-size', background: '#0a0908' }}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={source}
          alt=""
          loading="lazy"
          draggable={false}
          className="absolute left-1/2 h-[178%] w-[112%] max-w-none -translate-x-1/2 object-cover"
          style={{ top: '-66%' }}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #080706 0%, #080706 42%, rgba(8,7,6,.96) 48%, rgba(8,7,6,.78) 58%, rgba(8,7,6,.44) 68%, rgba(8,7,6,.22) 78%, #080706 86%, #080706 100%)',
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[14%] bg-[#080706]" />

      <div className="absolute inset-0 flex flex-col justify-between p-[8cqw]">
        <div className="flex items-start justify-between gap-3">
          <span
            className="font-display font-semibold uppercase"
            style={{ fontSize: '3.1cqw', letterSpacing: '0.3em', color: book.ink, opacity: 0.75 }}
          >
            AudioFlow
          </span>
          <span
            className="font-mono uppercase"
            style={{ fontSize: '2.2cqw', letterSpacing: '0.16em', color: book.ink, opacity: 0.38 }}
          >
            Original
          </span>
        </div>

        <div className={`${book.id === 'silent-meridian' ? 'mb-[16cqw]' : ''}`}>
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
              textShadow: '0 2px 20px rgba(0,0,0,.55)',
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
              opacity: 0.72,
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
              style={{ fontSize: '2.1cqw', letterSpacing: '0.2em', color: book.ink, opacity: 0.6 }}
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
