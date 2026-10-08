import { useEffect, useRef, useState, useMemo } from 'react'
import { m } from 'framer-motion'
import { ArrowDown, Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './BrandIcons'
import { EMAIL, LINKEDIN, GITHUB } from '../data/contacts'
import { Trans, useTranslation } from 'react-i18next'
import CvDropdownButton from './CvDropdownButton'
import Typewriter from './Typewriter'
import { lisbonZoneLabel } from '../lib/lisbonZone'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'

const photoFrameBaseStyle = {
  border: '1px solid var(--border-hi)',
  background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-elev) 100%)',
  boxShadow: '0 30px 60px -30px var(--photo-shadow)',
  aspectRatio: '4 / 5',
}

const cornerBracketStyle = (pos) => ({
  width: 18, height: 18,
  border: '2px solid var(--accent)',
  top: pos.startsWith('t') ? 10 : 'auto',
  bottom: pos.startsWith('b') ? 10 : 'auto',
  left: pos.endsWith('l') ? 10 : 'auto',
  right: pos.endsWith('r') ? 10 : 'auto',
  borderRight: pos.endsWith('l') ? 0 : undefined,
  borderLeft: pos.endsWith('r') ? 0 : undefined,
  borderBottom: pos.startsWith('t') ? 0 : undefined,
  borderTop: pos.startsWith('b') ? 0 : undefined,
})

export default function Hero() {
  const { t, i18n } = useTranslation()
  const rolesRaw = t('hero.roles', { returnObjects: true })
  const roles = Array.isArray(rolesRaw) ? rolesRaw : []

  const zone = useMemo(() => lisbonZoneLabel(), [])
  const reduceMotion = usePrefersReducedMotion()

  // Scrolls to a section ourselves instead of letting the browser follow the "#" link: on
  // phones the browser's own jump (a smooth scroll on a page that is still animating and whose
  // address bar is collapsing) could end up back at the top.
  const scrollToSection = (id) => (e) => {
    const section = document.getElementById(id)
    if (!section) return
    e.preventDefault()
    window.scrollTo({ top: section.getBoundingClientRect().top + window.scrollY, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  // Purely visual "drop zone": while ANYTHING is dragged over the photo (a file, text, a link,
  // an image from another page) it lights up like an upload box, but dropping does nothing at
  // all. Cancelling the drop's default is what stops the browser from opening a dropped file or
  // following a dropped link, which would take the visitor away from the site. The depth counter
  // stops the effect flickering as the pointer crosses the photo's child elements.
  const [dragging, setDragging] = useState(false)
  const dragDepth = useRef(0)

  // Which drop effect to advertise, or null to leave the drag alone. Only move-only drags are
  // ignored: accepting one could make the source (another app) delete what it was dragging.
  // Anything else, including values a browser leaves unset, is accepted.
  const dropEffectFor = (e) => {
    const allowed = e.dataTransfer?.effectAllowed
    if (allowed === 'move') return null
    if (allowed === 'link' || allowed === 'linkMove') return 'link'
    return 'copy'
  }
  const onDragEnter = (e) => {
    if (!dropEffectFor(e)) return
    e.preventDefault()
    dragDepth.current += 1
    setDragging(true)
  }
  const onDragOver = (e) => {
    const effect = dropEffectFor(e)
    if (!effect) return
    e.preventDefault()
    e.dataTransfer.dropEffect = effect
  }
  const onDragLeave = (e) => {
    if (!dropEffectFor(e)) return
    dragDepth.current = Math.max(0, dragDepth.current - 1)
    if (dragDepth.current === 0) setDragging(false)
  }
  const onDrop = (e) => {
    if (!dropEffectFor(e)) return
    e.preventDefault()
    dragDepth.current = 0
    setDragging(false)
  }

  // Safety net: if a drag ends somewhere else (Esc, dropped elsewhere), never stay lit.
  useEffect(() => {
    const reset = () => { dragDepth.current = 0; setDragging(false) }
    window.addEventListener('dragend', reset)
    window.addEventListener('drop', reset)
    return () => {
      window.removeEventListener('dragend', reset)
      window.removeEventListener('drop', reset)
    }
  }, [])

  const hatchStyle = {
    backgroundImage: 'repeating-linear-gradient(45deg, transparent 0, transparent 14px, var(--accent) 14px, var(--accent) 15px)',
  }

  const photoTagStyle = useMemo(() => ({
    fontSize: 12,
    color: 'var(--on-photo)', // sits on a dark strip over the photo, so it is light in both themes
    padding: '5px 10px',
    background: 'var(--on-photo-bg)',
    border: '1px solid var(--border)',
    borderRadius: 6,
  }), [])

  const metadataItemStyle = useMemo(() => ({
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
  }), [])

  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex min-h-[100dvh] items-center px-6 pt-32 pb-20"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 60% 50%, var(--accent-glow) 0%, transparent 70%)'
      }} />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-16 md:grid-cols-[1.4fr_1fr]">

        {/* Left: text */}
        <div>
          <m.h1
            id="hero-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-mono font-bold tracking-tight leading-none mb-3"
            style={{ fontSize: 'clamp(48px, 8vw, 88px)', color: 'var(--text)' }}
          >
            Ruben{' '}<br />
            <span style={{ color: 'var(--accent)' }}>Martins</span>
            <span style={{ color: 'var(--accent)' }}>.</span>
          </m.h1>

          {/* 16 px on phones keeps the longest role on one line, so the hero never jumps. */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex items-baseline gap-2 mb-8 font-mono"
            style={{ fontSize: 'clamp(16px, 3vw, 26px)', color: 'var(--text-dim)' }}
          >
            <span aria-hidden="true" style={{ color: 'var(--accent)' }}>$</span>
            <span style={{ color: 'var(--text)' }}>
              <Typewriter key={i18n.language} roles={roles} />
            </span>
          </m.div>

          <m.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-base leading-relaxed mb-10 max-w-lg"
            style={{ color: 'var(--text)' }}
          >
            <Trans
              i18nKey="hero.bio"
              components={{ b: <strong style={{ color: 'var(--text-strong)', fontWeight: 600 }} /> }}
            />
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-3 mb-10"
          >
            <CvDropdownButton variant="filled" compact={false} />
            <a
              href="#projects"
              onClick={scrollToSection('projects')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-accent text-accent font-mono text-sm font-semibold transition-[background-color,transform] duration-150 ease-out hover:bg-[var(--accent-dim)] active:scale-[0.97]"
            >
              <ArrowDown size={14} aria-hidden="true" />
              {t('hero.seeProject')}
            </a>
          </m.div>

          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            className="flex items-center gap-5"
          >
            <a href={GITHUB.href} target="_blank" rel="noreferrer" aria-label={t('hero.iconGithub')} style={{ color: 'var(--text-mute)' }} className="relative after:absolute after:-inset-3 after:content-[''] hover:opacity-80 transition-opacity">
              <GithubIcon size={20} />
            </a>
            <a href={LINKEDIN.href} target="_blank" rel="noreferrer" aria-label={t('hero.iconLinkedin')} style={{ color: 'var(--text-mute)' }} className="relative after:absolute after:-inset-3 after:content-[''] hover:opacity-80 transition-opacity">
              <LinkedinIcon size={20} />
            </a>
            <a href={EMAIL.href} aria-label={t('hero.iconEmail')} style={{ color: 'var(--text-mute)' }} className="relative after:absolute after:-inset-3 after:content-[''] hover:opacity-80 transition-opacity">
              <Mail size={20} />
            </a>
          </m.div>
        </div>

        {/* Right: photo frame + meta */}
        <m.aside
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-col gap-4"
        >
          <div
            className="group relative rounded-xl overflow-hidden transition-shadow duration-300"
            style={{
              ...photoFrameBaseStyle,
              boxShadow: dragging
                ? '0 0 0 1px var(--accent), 0 0 44px -8px var(--accent)'
                : photoFrameBaseStyle.boxShadow,
            }}
            onDragEnter={onDragEnter}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            {/* The file is already cropped to the 4:5 frame (the old 1.3x zoom is baked in), in two WebP widths. */}
            <img
              src="/retrato-960.webp"
              srcSet="/retrato-480.webp 480w, /retrato-960.webp 960w"
              sizes="(min-width: 768px) 451px, calc(100vw - 32px)"
              fetchPriority="high"
              alt={t('hero.photoAlt')}
              width={960}
              height={1200}
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* "Sketch" treatment: diagonal hatching under a dark tint with the upload-box
                hint from the design. Everything fades out when the mouse is over the photo.
                Touch screens have no hover, so there the tint and hint are dropped (the face
                stays visible) and only faint hatching remains. */}
            <div
              aria-hidden="true"
              className={`absolute inset-0 pointer-events-none z-[1] transition-opacity duration-300 [@media(hover:none)]:opacity-15 ${
                dragging ? 'opacity-60' : 'opacity-40 group-hover:opacity-0'
              }`}
              style={hatchStyle}
            />
            <div
              aria-hidden="true"
              className={`absolute inset-0 pointer-events-none z-10 flex flex-col items-center justify-center text-white/70 transition-[opacity,background-color] duration-300 [@media(hover:none)]:hidden ${
                dragging ? 'bg-black/65' : 'bg-black/55 group-hover:opacity-0'
              }`}
            >
              <svg
                width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"
                className={`mb-3 transition-[color,opacity,translate,scale] duration-300 ${dragging ? 'text-accent -translate-y-1 scale-125' : 'opacity-60'}`}
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <p className={`font-mono text-xs ${dragging ? 'text-accent' : 'opacity-70'}`}>
                {t(dragging ? 'hero.dropHere' : 'hero.dragPhoto')}
              </p>
              <p className="font-mono text-xs opacity-50 mt-1">{t('hero.browseFiles')}</p>
            </div>

            {/* Dashed drop-zone outline, only while a file is being dragged over the photo. */}
            <div
              aria-hidden="true"
              className={`absolute inset-4 z-[15] rounded-md border-2 border-dashed border-accent pointer-events-none transition-opacity duration-200 ${
                dragging ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {['tl','tr','bl','br'].map(pos => (
              <span key={pos} className="absolute z-20 pointer-events-none" style={cornerBracketStyle(pos)} />
            ))}

            <div
              className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 font-mono whitespace-nowrap"
              style={photoTagStyle}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent)', boxShadow: '0 0 6px var(--accent)' }} />
              {t('hero.photoTag')}
            </div>
          </div>

          <ul className="grid grid-cols-3 gap-2 list-none p-0 font-mono text-xs">
            {[
              { key: 'loc', val: t('hero.loc'), short: t('hero.locShort') },
              { key: 'tz',  val: zone, short: zone.split(' · ')[0] },
              { key: 'lang', val: t('hero.lang') },
            ].map(({ key, val, short }) => (
              <li key={key} className="flex flex-col gap-0.5 rounded-md py-2.5 px-1.5 sm:px-3" style={metadataItemStyle}>
                <span className="uppercase tracking-widest" style={{ fontSize: 11, color: 'var(--text-dim)' }}>{key}</span>
                {short ? (
                  <>
                    {/* the column is too narrow below 372 px and from 768 to 959 px for the full text */}
                    <span className="max-[372px]:hidden md:max-[960px]:hidden" style={{ color: 'var(--text)' }}>{val}</span>
                    <span className="hidden max-[372px]:inline md:max-[960px]:inline" style={{ color: 'var(--text)' }}>{short}</span>
                  </>
                ) : (
                  <span style={{ color: 'var(--text)' }}>{val}</span>
                )}
              </li>
            ))}
          </ul>
        </m.aside>
      </div>
    </section>
  )
}
