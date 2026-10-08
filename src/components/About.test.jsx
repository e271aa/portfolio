import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import i18n from '../i18n/index.js'
import About from './About'

async function renderAbout() {
  await i18n.changeLanguage('en')
  return render(<About />)
}

describe('About', () => {
  it('gives each contact a 44px tall target', async () => {
    await renderAbout()
    const links = screen.getAllByRole('link')

    expect(links).toHaveLength(3)
    for (const link of links) expect(link).toHaveClass('min-h-11')
  })

  it('writes the bio in the text colour, keeping grey for the small print', async () => {
    const { container } = await renderAbout()

    for (const p of container.querySelectorAll('p.leading-relaxed')) {
      expect(p.getAttribute('style')).toMatch(/var\(--text\)/)
    }
  })
})
