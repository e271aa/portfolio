import { Mail } from 'lucide-react'
import { Trans, useTranslation } from 'react-i18next'
import { GithubIcon, LinkedinIcon } from './BrandIcons'
import { EMAIL, LINKEDIN, GITHUB } from '../data/contacts'
import { Reveal } from './AnimatedSection'
import SectionHeading from './SectionHeading'

// Styles for the <b> and <accent> tags used in the about.p1..p3 translations.
const bioTags = {
  b: <strong style={{ color: 'var(--text-strong)', fontWeight: 600 }} />,
  accent: <span style={{ color: 'var(--accent)' }} />,
}

const CONTACTS = [
  { href: EMAIL.href, Icon: Mail, label: EMAIL.text, breakAll: true },
  { href: LINKEDIN.href, Icon: LinkedinIcon, label: LINKEDIN.handle, external: true },
  { href: GITHUB.href, Icon: GithubIcon, label: GITHUB.handle, external: true },
]

export default function About() {
  const { t } = useTranslation()

  return (
    <section id="about" aria-labelledby="about-title" className="py-16 md:py-24 px-6" style={{ backgroundColor: 'var(--bg-elev)' }}>
      <Reveal className="max-w-5xl mx-auto">
        <SectionHeading id="about-title" num={t('about.num')} title={t('about.title')} />

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-4">
            {['p1', 'p2', 'p3'].map((key) => (
              <p key={key} className="leading-relaxed" style={{ color: 'var(--text)' }}>
                <Trans i18nKey={`about.${key}`} components={bioTags} />
              </p>
            ))}

            <div className="pt-4">
              <p className="text-sm mb-3" style={{ color: 'var(--text-dim)' }}>{t('about.languages')}</p>
              <div className="flex gap-4">
                {[
                  { code: 'PT', name: t('about.portuguese'), level: t('about.portuguese_level') },
                  { code: 'EN', name: t('about.english'), level: t('about.english_level') },
                ].map(({ code, name, level }) => (
                  <div key={code} className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="w-9 h-9 rounded-md flex items-center justify-center font-mono text-xs font-semibold"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)' }}
                    >
                      {code}
                    </span>
                    <div>
                      <p className="text-base font-medium" style={{ color: 'var(--text)' }}>{name}</p>
                      <p className="text-sm" style={{ color: 'var(--text-dim)' }}>{level}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm mb-4 uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>{t('about.contact')}</p>
            {CONTACTS.map(({ href, Icon, label, breakAll, external }) => (
              <a
                key={href}
                href={href}
                {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                className="flex min-h-11 items-center gap-3 transition-colors text-[var(--text-dim)] hover:text-accent focus-visible:text-accent"
              >
                <div className="w-9 h-9 rounded-md flex items-center justify-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <Icon size={15} />
                </div>
                <span className={`text-base ${breakAll ? 'break-all' : ''}`}>{label}</span>
              </a>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
