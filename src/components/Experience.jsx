import { Reveal } from './AnimatedSection'
import { useTranslation } from 'react-i18next'
import SectionHeading from './SectionHeading'

export default function Experience() {
  const { t } = useTranslation()
  const items = t('experience.items', { returnObjects: true })

  return (
    <section id="experience" aria-labelledby="experience-title" className="py-16 md:py-24 px-6" style={{ backgroundColor: 'var(--bg)' }}>
      <Reveal className="max-w-5xl mx-auto">
        <SectionHeading id="experience-title" num={t('experience.num')} title={t('experience.title')} />

        <div className="relative">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-rule" />

          <div className="space-y-10">
            {items.map((exp) => (
              <div key={exp.company + exp.period}>
                <div className="relative pl-8">
                  <div className="absolute left-0 top-2 w-3.5 h-3.5 rounded-full border-2" style={{ borderColor: 'var(--accent)', backgroundColor: 'var(--bg)' }} />

                  <div className="p-6 rounded-xl border border-line bg-card">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-strong">{exp.role}</h3>
                        <p className="text-base font-medium" style={{ color: 'var(--text)' }}>
                          {exp.company}<span style={{ color: 'var(--text-dim)' }}> &middot; {exp.location}</span>
                        </p>
                      </div>
                      <span className="text-sm font-mono shrink-0" style={{ color: 'var(--text-dim)' }}>{exp.period}</span>
                    </div>

                    <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text)' }}>{exp.description}</p>

                    <ul className="flex flex-wrap gap-2">
                      {exp.tags.map((tag) => (
                        <li
                          key={tag}
                          style={{ color: 'var(--text-dim)' }}
                          className="text-sm px-2 py-1 rounded-md border border-line font-mono"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
