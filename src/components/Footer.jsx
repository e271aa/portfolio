import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowUp } from 'lucide-react'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'
import { EMAIL, LINKEDIN, GITHUB } from '../data/contacts'

const CONTACTS = [
  { label: 'mail', ...EMAIL },
  { label: 'linkedin', ...LINKEDIN, external: true },
  { label: 'github', ...GITHUB, external: true },
]

function lisbonTime(language) {
  return new Date().toLocaleTimeString(language === 'pt' ? 'pt-PT' : 'en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Lisbon',
  })
}

// Owns its own state so the clock ticking does not re-render the rest of the footer. It shows
// Lisbon time (like the TZ box in the hero), not the visitor's, next to ruben@portfolio.
function LisbonClock() {
  const { t, i18n } = useTranslation()
  const [time, setTime] = useState(() => lisbonTime(i18n.language))

  // A minute is all the clock shows; checking every 15 s keeps it within seconds of the change,
  // and React skips the render when the text is the same.
  useEffect(() => {
    const id = setInterval(() => setTime(lisbonTime(i18n.language)), 15000)
    return () => clearInterval(id)
  }, [i18n.language])

  return (
    <span className="text-xs" style={{ color: 'var(--text-mute)' }} aria-hidden="true">
      {time} {t('footer.clockCity')}
    </span>
  )
}

export default function Footer() {
  const { t } = useTranslation()
  const reduceMotion = usePrefersReducedMotion()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  return (
    <footer
      className="px-6 py-12 border-t"
      style={{
        backgroundColor: 'var(--bg)',
        borderColor: 'var(--border)'
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Terminal-style block: commands stay in English like a real terminal, their output is translated */}
        <div
          className="rounded-xl p-6 mb-8 font-mono text-sm"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)'
          }}
        >
          <div className="flex items-center justify-between mb-4 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2" aria-hidden="true">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--dot-close)' }} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--dot-min)' }} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--dot-max)' }} />
            </div>
            <span className="text-xs" style={{ color: 'var(--text-mute)' }}>
              ruben@portfolio:~$
            </span>
            <LisbonClock />
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <span style={{ color: 'var(--accent)' }}>$</span>
              <span data-command style={{ color: 'var(--text-dim)' }}>whoami</span>
            </div>
            <div className="pl-4" style={{ color: 'var(--text)' }}>
              {t('footer.whoami')}
            </div>

            <div className="flex gap-2 pt-2">
              <span style={{ color: 'var(--accent)' }}>$</span>
              <span data-command style={{ color: 'var(--text-dim)' }}>cat status</span>
            </div>
            <div className="pl-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: 'var(--accent)' }}></span>
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: 'var(--accent)' }}></span>
              </span>
              {t('footer.status')}
            </div>

            <div className="flex gap-2 pt-2">
              <span style={{ color: 'var(--accent)' }}>$</span>
              <span data-command style={{ color: 'var(--text-dim)' }}>cat contacts</span>
            </div>
            <ul className="pl-4" style={{ color: 'var(--text)' }}>
              {CONTACTS.map(({ label, text, href, external }) => (
                <li key={label} className="flex flex-wrap gap-x-3">
                  <span className="w-20 shrink-0" style={{ color: 'var(--text-mute)' }}>{label}</span>
                  <a
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                    className="inline-flex min-h-11 items-center break-all transition-colors hover:text-accent focus-visible:text-accent"
                  >
                    {text}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex gap-2 pt-2">
              <span style={{ color: 'var(--accent)' }}>$</span>
              <span data-command style={{ color: 'var(--text-dim)' }}>echo thanks</span>
            </div>
            <div className="pl-4" style={{ color: 'var(--text)' }}>
              {t('footer.thanks')}
            </div>
            <div className="flex gap-2 pt-2" aria-hidden="true">
              <span style={{ color: 'var(--accent)' }}>$</span>
              <span className="motion-safe:animate-pulse" style={{ color: 'var(--accent)' }}>▮</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs" style={{ color: 'var(--text-mute)' }}>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span>© {new Date().getFullYear()} <span style={{ color: 'var(--text-dim)' }}>Ruben Martins</span></span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex min-h-11 items-center gap-2 transition-colors group text-[var(--text-dim)] hover:text-accent focus-visible:text-accent"
          >
            <ArrowUp size={12} className="transition-transform group-hover:-translate-y-0.5" />
            <span>{t('footer.backToTop')}</span>
          </button>
        </div>
      </div>
    </footer>
  )
}
