import { useTranslation } from 'react-i18next'
import { Reveal } from './AnimatedSection'
import SectionHeading from './SectionHeading'

// The first highlight is the big one: wider than the rest and as tall as the other two together.
function HighlightCard({ item, lead }) {
  return (
    <article
      className={`p-6 rounded-xl border border-line bg-card ${
        lead ? 'md:col-span-3 md:row-span-2 md:p-8' : 'md:col-span-2'
      }`}
    >
      <span className="inline-block text-xs font-mono px-2 py-1 rounded-md bg-tag text-accent border border-tag-border mb-3">
        {item.badge}
      </span>
      <h3 className={`font-semibold leading-snug mb-2 text-strong ${lead ? 'text-2xl' : 'text-lg'}`}>{item.title}</h3>
      <p className="text-sm font-mono mb-3" style={{ color: 'var(--text-dim)' }}>
        {item.date} &middot; {item.location}
      </p>
      <p className="text-base leading-relaxed" style={{ color: 'var(--text)' }}>{item.description}</p>
    </article>
  )
}

export default function Highlights() {
  const { t } = useTranslation()
  const items = t('highlights.items', { returnObjects: true })

  return (
    <section id="highlights" aria-labelledby="highlights-title" className="py-16 md:py-24 px-6" style={{ backgroundColor: 'var(--bg)' }}>
      <Reveal className="max-w-5xl mx-auto">
        <SectionHeading id="highlights-title" num={t('highlights.num')} title={t('highlights.title')} />

        <div className="grid gap-5 md:grid-cols-5">
          {items.map((item, i) => (
            <HighlightCard key={item.id} item={item} lead={i === 0} />
          ))}
        </div>
      </Reveal>
    </section>
  )
}
