export default function Logo({ className = '', as = 'a', onClick }) {
  const Tag = as
  return (
    <Tag
      href={as === 'a' ? '#home' : undefined}
      onClick={onClick}
      aria-label="AudioFlow home"
      className={`group inline-flex items-center gap-3 ${className}`}
    >
      <img src="/audioflow-mark.svg" alt="" aria-hidden="true" className="h-7 w-11 shrink-0" />
      <span className="font-display text-xl font-semibold tracking-[-0.045em] text-bone">
        AudioFlow
      </span>
    </Tag>
  )
}
