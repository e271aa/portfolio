import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import i18n from './i18n/index.js'
import pt from './i18n/pt.json'
import en from './i18n/en.json'
import App from './App'

// The project is the proof, so it comes right after About.
const ORDER = ['about', 'projects', 'skills', 'experience', 'education', 'highlights']

describe('Page structure', () => {
  it('puts the sections and the menu in the same order, with Projects second', async () => {
    await i18n.changeLanguage('pt')
    const { container } = render(<App />)

    const sections = [...container.querySelectorAll('main section[id]')].map((s) => s.id)
    const menu = [...container.querySelector('nav ul').querySelectorAll('a[href^="#"]')].map((a) =>
      a.getAttribute('href').slice(1),
    )

    expect(sections).toEqual(ORDER)
    expect(menu).toEqual(ORDER)
  })

  it.each([['pt', pt], ['en', en]])('numbers the headings in page order in %s', (_, locale) => {
    expect(ORDER.map((id) => locale[id].num)).toEqual(['01.', '02.', '03.', '04.', '05.', '06.'])
  })
})
