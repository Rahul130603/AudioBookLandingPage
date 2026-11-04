import { MARQUEE_ITEMS } from '../lib/data'

export default function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <div className="relative overflow-hidden border-b border-bone/[0.06] bg-[#f7f2ea] py-5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-[#f7f2ea] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-[#f7f2ea] to-transparent" />
      <div className="marquee-track items-center">
        {items.map((item, index) => (
          <div key={`${item}-${index}`} className="flex shrink-0 items-center gap-8 px-8">
            <span
              className={`whitespace-nowrap text-[0.58rem] font-medium uppercase tracking-[0.26em] text-bone/88 ${
                item === 'தமிழ்' ? 'font-tamil text-[0.74rem] tracking-[0.08em]' : ''
              } ${item === 'اردو' ? 'font-urdu text-[0.8rem] tracking-normal' : ''}`}
            >
              {item}
            </span>
            <span className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-[3px] w-[3px] rounded-full bg-orange/60" />
              <span className="h-[2px] w-6 bg-bone/10" />
              <span className="h-[3px] w-[3px] rounded-full bg-gold/40" />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
