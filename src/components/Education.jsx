import { useTranslation } from 'react-i18next'
import { Reveal } from './AnimatedSection'
import SectionHeading from './SectionHeading'

// Dates on the left, the course on the right: the way a CV reads, with no icon or box.
function EducationRow({ edu }) {
  return (
    <li className="grid gap-2 border-t border-line py-6 first:border-t-0 first:pt-0 sm:grid-cols-[11rem_1fr] sm:gap-8">
      <div className="font-mono text-sm" style={{ color: 'var(--text-dim)' }}>
        <span>{edu.period}</span>
        {edu.note && <p className="mt-1">{edu.note}</p>}
      </div>
      <div>
        <h3 className="font-semibold text-lg leading-snug text-strong">{edu.degree}</h3>
        <p className="mt-1 text-base font-medium" style={{ color: 'var(--text)' }}>{edu.institution}</p>
        <p className="text-sm" style={{ color: 'var(--text-dim)' }}>{edu.location}</p>
        <p className="mt-3 text-base leading-relaxed" style={{ color: 'var(--text)' }}>{edu.description}</p>
      </div>
    </li>
  )
}

export default function Education() {
  const { t } = useTranslation()
  const items = t('education.items', { returnObjects: true })

  return (
    <section id="education" aria-labelledby="education-title" className="py-16 md:py-24 px-6" style={{ backgroundColor: 'var(--bg-elev)' }}>
      <Reveal className="max-w-5xl mx-auto">
        <SectionHeading id="education-title" num={t('education.num')} title={t('education.title')} />

        <ol>
          {items.map((edu) => (
            <EducationRow key={edu.id} edu={edu} />
          ))}
        </ol>
      </Reveal>
    </section>
  )
}
