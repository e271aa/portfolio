import { useState, useEffect } from 'react'
import { Moon, Sun, Monitor, Menu, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import CvDropdownButton from './CvDropdownButton'
import { LANGUAGES } from '../i18n'
import { readStored, writeStored } from '../lib/storage'
import { syncThemeColor } from '../lib/themeColor'

const MODES = ['system', 'light', 'dark']

function applyTheme(mode) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isLight = mode === 'light' || (mode === 'system' && !prefersDark)
  document.documentElement.classList.toggle('theme-light', isLight)
  syncThemeColor()
}

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mode, setMode] = useState(() => {
    const saved = readStored('themeMode')
    return MODES.includes(saved) ? saved : 'system'
  })

  const links = [
    { href: '#about', label: t('nav.about') },
    { href: '#projects', label: t('nav.projects') },
    { href: '#skills', label: t('nav.skills') },
    { href: '#experience', label: t('nav.experience') },
    { href: '#education', label: t('nav.education') },
    { href: '#highlights', label: t('nav.highlights') },
  ]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // The full menu appears from 1280px (Tailwind `xl`); below that the list is
  // behind the hamburger. Close it if the window grows past that width, so it
  // can't stay open out of sight.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1280px)')
    const onChange = (e) => { if (e.matches) setMenuOpen(false) }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  useEffect(() => {
    writeStored('themeMode', mode)
    applyTheme(mode)

    if (mode === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const onChange = () => applyTheme('system')
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    }
  }, [mode])

  const cycleMode = () => {
    setMode(prev => MODES[(MODES.indexOf(prev) + 1) % MODES.length])
  }

  const toggleLang = () => {
    const next = LANGUAGES[(LANGUAGES.indexOf(i18n.language) + 1) % LANGUAGES.length]
    i18n.changeLanguage(next)
    writeStored('lang', next)
  }

  const goToTop = (e) => {
    e.preventDefault()
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    // Drop any "#section" from the address, so reloading or sharing the link
    // opens at the top instead of jumping back to that section.
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }

  const icons = { system: <Monitor size={18} />, light: <Sun size={18} />, dark: <Moon size={18} /> }
  const titles = {
    system: t('nav.themeSystem'),
    light: t('nav.themeLight'),
    dark: t('nav.themeDark'),
  }
  const solid = scrolled || menuOpen

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        solid ? 'bg-nav-solid backdrop-blur-md border-b border-hairline' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-2.5 flex items-center justify-between">
        <a
          href="#"
          onClick={goToTop}
          aria-label={t('nav.backToTop')}
          className="font-bold text-lg tracking-tight flex min-h-11 items-center text-strong"
        >
          ruben.martins<span className="text-accent">.</span>
        </a>
        <ul className="hidden xl:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className="text-nav hover:text-strong text-sm transition-colors duration-200"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleLang}
            className="relative after:absolute after:-inset-1.5 after:content-[''] w-10 h-8 flex items-center justify-center rounded-md hover:bg-hover-tint transition-colors text-nav hover:text-strong font-mono text-xs font-semibold tracking-wider shrink-0"
            title={t('nav.switchLanguage')}
            aria-label={t('nav.switchLanguage')}
          >
            {i18n.language === 'pt' ? 'EN' : 'PT'}
          </button>
          <button
            type="button"
            onClick={cycleMode}
            className="relative after:absolute after:-inset-1.5 after:content-[''] w-8 h-8 flex items-center justify-center rounded-md hover:bg-hover-tint transition-colors text-nav hover:text-strong shrink-0"
            title={titles[mode]}
            aria-label={titles[mode]}
          >
            {icons[mode]}
          </button>
          <div className="hidden sm:block">
            <CvDropdownButton variant="outline" compact />
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(v => !v)}
            className="xl:hidden relative after:absolute after:-inset-1.5 after:content-[''] w-8 h-8 flex items-center justify-center rounded-md hover:bg-hover-tint transition-colors text-nav hover:text-strong shrink-0"
            aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="xl:hidden border-t border-hairline px-6 pb-4 pt-2">
          <ul>
            {links.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 text-nav hover:text-strong text-base transition-colors duration-200"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="pt-3 sm:hidden">
            <CvDropdownButton variant="outline" compact />
          </div>
        </div>
      )}
    </nav>
  )
}
