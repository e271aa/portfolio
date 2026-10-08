import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown, Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'

// What each language's file is called, and what it is saved as. The saved name carries the
// person's name, because that is what ends up in a recruiter's downloads folder.
const CV_FILES = {
  pt: { href: '/Ruben_Martins_CV_PT.pdf', saveAs: 'Ruben_Martins_CV_PT.pdf' },
  en: { href: '/Ruben_Martins_CV_EN.pdf', saveAs: 'Ruben_Martins_CV_EN.pdf' },
}

// The two looks share one structure: a main link, a thin divider and an arrow that opens a
// small menu with the CV in the other language. Only the classes differ.
const STYLES = {
  // hero call to action
  filled: {
    wrapper: 'rounded-md font-mono text-sm font-semibold',
    main: 'gap-2 px-5 py-3 min-h-11 rounded-l-md min-w-[140px] bg-accent text-accent-fg',
    divider: 'bg-black/20',
    toggle: 'min-h-11 min-w-11 px-3 rounded-r-md bg-accent text-accent-fg',
    chevron: 14,
    menuSide: 'left-0',
  },
  // navbar and contact section
  outline: {
    wrapper: 'rounded-md font-medium text-sm',
    main: 'gap-1.5 px-3 min-h-11 rounded-l-md text-accent hover:bg-[var(--accent-dim)]',
    divider: 'bg-accent opacity-25',
    toggle: 'min-h-11 min-w-11 rounded-r-md text-accent hover:bg-[var(--accent-dim)]',
    chevron: 13,
    menuSide: 'right-0',
  },
}

export default function CvDropdownButton({ variant = 'outline', compact = false }) {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const toggleRef = useRef(null)
  const menuId = useId()
  const isPt = i18n.language === 'pt'
  const styles = STYLES[variant]

  // Close on a press outside (pointerdown covers mouse AND touch; the old mousedown left the
  // menu stuck open on phones) and on Escape, handing focus back to the arrow.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const onKeyDown = (e) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      toggleRef.current?.focus()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const labels = { pt: t('hero.cvPt'), en: t('hero.cvEn') }
  const own = isPt ? 'pt' : 'en'
  const other = isPt ? 'en' : 'pt'
  const showIcon = variant === 'filled' || compact
  const mainLabel = compact ? t('hero.cvShort') : labels[own]

  return (
    <div
      ref={ref}
      className={`relative inline-flex items-stretch border border-accent ${styles.wrapper}`}
    >
      <a
        href={CV_FILES[own].href}
        download={CV_FILES[own].saveAs}
        className={`flex items-center justify-center transition-colors duration-200 ${styles.main} ${
          variant === 'outline' && !compact ? 'min-w-[100px]' : variant === 'outline' ? 'min-w-[110px]' : ''
        }`}
      >
        {showIcon && <Download size={14} />}
        {compact && variant === 'outline' ? <span className="text-xs">{mainLabel}</span> : mainLabel}
      </a>
      <span aria-hidden="true" className={`w-px shrink-0 ${styles.divider}`} />
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center justify-center transition-colors duration-200 ${styles.toggle}`}
        aria-label={labels[other]}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
      >
        <ChevronDown
          size={styles.chevron}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className={`absolute top-full ${styles.menuSide} mt-2 rounded-md z-50 overflow-hidden min-w-full bg-[var(--bg-card)] border border-[var(--border-hi)] shadow-[0_8px_24px_var(--shadow-menu)]`}
        >
          <a
            href={CV_FILES[other].href}
            download={CV_FILES[other].saveAs}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap transition-colors text-[var(--text-dim)] hover:text-accent focus-visible:text-accent"
          >
            <Download size={13} />
            {labels[other]}
          </a>
        </div>
      )}
    </div>
  )
}
