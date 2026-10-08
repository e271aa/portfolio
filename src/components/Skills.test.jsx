import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { LazyMotion, domAnimation } from 'framer-motion'
import i18n from '../i18n/index.js'
import { categories } from '../data/skills'
import Skills from './Skills'

const LABELS = {
  pt: { work: 'No trabalho', projects: 'Em projetos e no curso' },
  en: { work: 'At work', projects: 'In projects and coursework' },
}

async function renderSkills(lang) {
  await i18n.changeLanguage(lang)
  return render(
    <LazyMotion features={domAnimation} strict>
      <Skills />
    </LazyMotion>,
  )
}

// The tags listed under one label ("At work", ...) inside one category card.
function tagsUnder(cardTitle, label) {
  const card = screen.getByRole('heading', { level: 3, name: cardTitle }).parentElement
  const term = within(card).queryByText(label, { selector: 'dt' })
  if (!term) return null
  return within(term.nextElementSibling).getAllByRole('listitem').map((li) => li.textContent)
}

describe('Skills section', () => {
  it('has no self-rated levels, in the data or on the page', async () => {
    const { container } = await renderSkills('pt')

    for (const cat of categories) for (const skill of [...cat.work, ...cat.projects]) expect(skill).not.toHaveProperty('level')
    expect(container.querySelectorAll('[style*="width"]')).toHaveLength(0)
  })

  it('puts programming first and IoT after it', async () => {
    await renderSkills('en')
    const titles = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)

    expect(titles.slice(0, 3)).toEqual(['Backend', 'Frontend', 'Mobile'])
    expect(titles.indexOf('IoT & Automation')).toBeGreaterThan(2)
  })

  it.each(['pt', 'en'])('separates work from projects and coursework in %s', async (lang) => {
    await renderSkills(lang)
    const { work, projects } = LABELS[lang]

    expect(tagsUnder('Backend', work)).toEqual(['Python'])
    expect(tagsUnder('Backend', projects)).toEqual(['C#', 'C/C++'])
    expect(tagsUnder('Frontend', work)).toEqual(['HTML/CSS/JS', 'React.js'])
    expect(tagsUnder('Frontend', projects)).toEqual(['Angular'])
  })

  it('leaves out a label that has nothing under it', async () => {
    await renderSkills('en')

    expect(tagsUnder('Mobile', LABELS.en.work)).toBeNull()
    expect(tagsUnder('Mobile', LABELS.en.projects)).toEqual(['Kotlin', 'Android Jetpack'])
    expect(tagsUnder('IoT & Automation', LABELS.en.projects)).toBeNull()
  })
})
