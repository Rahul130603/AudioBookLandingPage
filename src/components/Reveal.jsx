import { motion, useReducedMotion } from 'framer-motion'

export function Reveal({ children, delay = 0, y = 26, className = '', once = true, amount = 0.2 }) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeading({ eyebrow, title, copy, align = 'left', className = '', titleClassName = '' }) {
  return (
    <div
      className={`min-w-0 ${align === 'center' ? 'mx-auto text-center' : ''} ${className}`}
    >
      <Reveal>
        <span className={`eyebrow ${align === 'center' ? 'justify-center' : ''}`}>{eyebrow}</span>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          className={`display mt-6 text-balance text-[clamp(2.4rem,5.1vw,5.2rem)] leading-[0.94] text-bone ${titleClassName}`}
        >
          {title}
        </h2>
      </Reveal>
      {copy ? (
        <Reveal delay={0.16}>
          <p className={`section-copy mt-6 max-w-xl text-[0.95rem] leading-7 text-smoke ${align === 'center' ? 'mx-auto' : ''}`}>
            {copy}
          </p>
        </Reveal>
      ) : null}
    </div>
  )
}
