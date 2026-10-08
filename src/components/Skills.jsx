import { Reveal } from './AnimatedSection'
import { useTranslation } from 'react-i18next'
import { ChevronDown } from 'lucide-react'
import { categories, foundations, otherSkills } from '../data/skills'
import SectionHeading from './SectionHeading'

function Card({ title, children }) {
  return (
    <div className="p-6 rounded-xl border border-line bg-card h-full">
      <h3 className="text-xs font-mono uppercase tracking-widest mb-5" style={{ color: 'var(--accent)' }}>{title}</h3>
      {children}
    </div>
  )
}

// `strong` is for what was used at work: same tag, brighter text.
function Tags({ items, strong = false }) {
  const { t } = useTranslation()
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map(({ name, nameKey }) => (
        <li key={nameKey ?? name} className="text-sm px-3 py-1 rounded-md border border-line" style={{ color: strong ? 'var(--text)' : 'var(--text-dim)' }}>
          {nameKey ? t(`skills.items.${nameKey}`) : name}
        </li>
      ))}
    </ul>
  )
}

// "At work" and "In projects and coursework", each with its tags. A group with nothing in it
// is left out rather than shown empty.
function Usage({ work, projects }) {
  const { t } = useTranslation()
  const groups = [
    { key: 'work', items: work, strong: true },
    { key: 'projects', items: projects, strong: false },
  ].filter(({ items }) => items.length > 0)

  return (
    <dl className="space-y-4">
      {groups.map(({ key, items, strong }) => (
        <div key={key}>
          <dt className="text-sm mb-2" style={{ color: 'var(--text-dim)' }}>{t(`skills.usage.${key}`)}</dt>
          <dd>
            <Tags items={items} strong={strong} />
          </dd>
        </div>
      ))}
    </dl>
  )
}

export default function Skills() {
  const { t } = useTranslation()

  return (
    <section id="skills" aria-labelledby="skills-title" className="py-16 md:py-24 px-6" style={{ backgroundColor: 'var(--bg-elev)' }}>
      <Reveal className="max-w-5xl mx-auto">
        <SectionHeading id="skills-title" num={t('skills.num')} title={t('skills.title')} />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Card key={cat.key} title={t(`skills.categories.${cat.key}`, cat.key)}>
              <Usage work={cat.work} projects={cat.projects} />
            </Card>
          ))}
        </div>

        <div className="mt-6">
          <Card title={t('skills.foundations')}>
            <Tags items={foundations} />
          </Card>
        </div>

        <details className="group mt-4 rounded-xl border border-line bg-card hover:border-card-hover transition-colors duration-300">
          <summary className="flex items-center justify-between gap-3 px-6 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden rounded-xl focus-visible:outline-2 focus-visible:outline-accent">
            <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--accent)' }}>{t('skills.other')}</span>
            <ChevronDown size={16} aria-hidden="true" className="transition-transform duration-200 group-open:rotate-180" style={{ color: 'var(--text-mute)' }} />
          </summary>
          <ul className="flex flex-wrap gap-2 px-6 pb-6">
            {otherSkills.map(({ name, nameKey }) => (
              <li key={nameKey ?? name} className="text-sm px-3 py-1 rounded-md border border-line" style={{ color: 'var(--text-dim)' }}>
                {nameKey ? t(`skills.items.${nameKey}`) : name}
              </li>
            ))}
          </ul>
        </details>
      </Reveal>
    </section>
  )
}
