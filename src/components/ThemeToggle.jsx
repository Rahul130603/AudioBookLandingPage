import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

const STORAGE_KEY = 'chaptera:theme'

export default function ThemeToggle({ className = '' }) {
  const [theme, setTheme] = useState(() => {
    if (typeof document === 'undefined') return 'dark'
    return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.style.colorScheme = theme
    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // storage can be unavailable in private browsing modes
    }
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#080808' : '#FAF8F5')
  }, [theme])

  const dark = theme === 'dark'
  const next = dark ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className={`theme-toggle group inline-flex h-11 min-h-[2.7rem] items-center gap-2 border border-bone/10 bg-coal/85 px-1.5 text-bone shadow-[0_12px_30px_-24px_rgba(74,43,21,0.5)] backdrop-blur-md transition-colors duration-300 hover:border-gold/40 hover:text-gold sm:pl-2.5 ${className}`}
      aria-label={`Switch to ${next} mode`}
      aria-pressed={dark}
      title={`Switch to ${next} mode`}
    >
      <span className="grid h-8 w-8 place-items-center rounded-full border border-bone/10 bg-bone/[0.045] transition-colors duration-300 group-hover:border-gold/25 group-hover:bg-gold/[0.08]">
        {dark ? <Sun size={14} strokeWidth={1.7} /> : <Moon size={14} strokeWidth={1.7} />}
      </span>
      <span className="hidden font-semibold uppercase tracking-[0.14em] lg:block" style={{ fontSize: '0.55rem' }}>
        {dark ? 'Light' : 'Dark'}
      </span>
    </button>
  )
}
