import { Reveal } from './AnimatedSection'
import { useTranslation } from 'react-i18next'
import { ExternalLink } from 'lucide-react'
import { GithubIcon } from './BrandIcons'
import SectionHeading from './SectionHeading'
import { NOOK_SHOTS, NOOK_STACK, nookLinks } from '../data/nook'

const BUTTON =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 font-mono text-sm font-semibold transition-[background-color,scale] duration-150 ease-out motion-safe:active:scale-[0.97]'
const LABEL = 'font-mono text-xs text-[var(--text-mute)]'

// A capture on its own: the same 1px line and 12px corner as the cards, no device drawn around it.
// The line is an outline, not a border, so it takes no room and both captures keep their shape.
// With a demo address, the capture is a link to the demo as well.
function Shot({ name, demo, className = '' }) {
  const { t } = useTranslation()
  const { src, width, height } = NOOK_SHOTS[name]
  const image = (
    <img
      src={src}
      width={width}
      height={height}
      alt={t(`projects.nook.shots.${name}.alt`)}
      loading="lazy"
      decoding="async"
      className="block h-auto w-full rounded-xl outline-1 -outline-offset-1 outline-line transition-[outline-color] duration-150 group-hover:outline-accent"
    />
  )

  return (
    <figure className={className}>
      {demo ? (
        <a
          href={demo}
          target="_blank"
          rel="noreferrer"
          aria-label={`${t('projects.nook.demo')}: ${t(`projects.nook.shots.${name}.caption`)}`}
          className="group block rounded-xl"
        >
          {image}
        </a>
      ) : (
        image
      )}
      <figcaption className={`mt-2 ${LABEL}`}>{t(`projects.nook.shots.${name}.caption`)}</figcaption>
    </figure>
  )
}

export default function Projects() {
  const { t } = useTranslation()
  const { demo, repo } = nookLinks()
  const work = t('projects.nook.work', { returnObjects: true })
  const screens = t('projects.nook.screens', { returnObjects: true })

  return (
    <section id="projects" aria-labelledby="projects-title" className="bg-[var(--bg)] px-6 py-16 md:py-24">
      <Reveal className="mx-auto max-w-5xl">
        <SectionHeading id="projects-title" num={t('projects.num')} title={t('projects.title')} />

        <div>
          <div className="md:flex md:items-end md:justify-between md:gap-10">
            <div className="max-w-[60ch]">
              <h3 className="text-2xl font-bold text-strong">{t('projects.nook.name')}</h3>
              <p className="mt-3 text-lg leading-relaxed text-pretty text-[var(--text)]">{t('projects.nook.lead')}</p>
            </div>

            {(demo || repo) && (
              <div className="mt-6 flex flex-wrap gap-3 md:mt-0 md:shrink-0">
                {demo && (
                  <a
                    href={demo}
                    target="_blank"
                    rel="noreferrer"
                    className={`${BUTTON} bg-accent text-accent-fg hover:bg-accent-hover`}
                  >
                    {t('projects.nook.demo')}
                    <ExternalLink size={16} aria-hidden="true" />
                  </a>
                )}
                {repo && (
                  <a
                    href={repo}
                    target="_blank"
                    rel="noreferrer"
                    className={`${BUTTON} border border-accent text-accent hover:bg-tag`}
                  >
                    <GithubIcon size={16} />
                    {t('projects.nook.code')}
                  </a>
                )}
              </div>
            )}
          </div>

          {/* The two columns are as wide as the captures are (1280:800 and 390:844), so on a
              computer both end up the same height. On a phone the tablet takes the full width
              and the facts sit beside the phone capture. */}
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-[1600fr_462fr] md:gap-x-6 md:gap-y-10">
            <Shot name="tablet" demo={demo} className="col-span-2 md:col-span-1" />
            <Shot name="phone" demo={demo} />

            <dl className="space-y-6 md:col-start-2 md:row-start-2">
              <div>
                <dt className={LABEL}>{t('projects.nook.screensTitle')}</dt>
                {screens.map((screen) => (
                  <dd key={screen} className="mt-2 text-sm">{screen}</dd>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <dt className={`w-full ${LABEL}`}>{t('projects.nook.stackTitle')}</dt>
                {NOOK_STACK.map((tech) => (
                  <dd key={tech} className="rounded-md border border-tag-border bg-tag px-2 py-1 font-mono text-xs text-accent">
                    {tech}
                  </dd>
                ))}
              </div>
            </dl>

            <div className="col-span-2 md:col-span-1 md:col-start-1 md:row-start-2">
              <h4 className={LABEL}>{t('projects.nook.workTitle')}</h4>
              <ul className="mt-3 max-w-[62ch] list-disc space-y-3 pl-5 leading-relaxed marker:text-accent">
                {work.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
