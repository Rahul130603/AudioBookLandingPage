import { motion } from 'framer-motion'

export default function Logo({ className = '', as = 'a', onClick }) {
  const Tag = as
  return (
    <Tag
      href={as === 'a' ? '#home' : undefined}
      onClick={onClick}
      aria-label="Chaptera home"
      className={`group inline-flex items-center gap-3 ${className}`}
    >
      <span className="relative flex h-7 w-7 items-end justify-center gap-[3px] pb-[2px]" aria-hidden="true">
        <span className="h-[9px] w-[2px] rounded-full bg-orange transition-all duration-500 group-hover:h-[17px]" />
        <span className="h-[19px] w-[2px] rounded-full bg-orange transition-all duration-500 group-hover:h-[11px]" />
        <span className="h-[13px] w-[2px] rounded-full bg-gold transition-all duration-500 group-hover:h-[22px]" />
        <motion.span
          className="absolute right-[-2px] top-[1px] h-[4px] w-[4px] rounded-full bg-orange"
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.15, 0.8] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </span>
      <span className="font-display text-[0.95rem] font-semibold uppercase tracking-[0.26em] text-bone">
        Chaptera<span className="text-orange">.</span>
      </span>
    </Tag>
  )
}
