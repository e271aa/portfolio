import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import i18n from '../i18n/index.js'
import Education from './Education'
import Experience from './Experience'
import Highlights from './Highlights'
import Skills from './Skills'

async function renderEn(ui) {
  await i18n.changeLanguage('en')
  return render(ui)
}

describe('Education', () => {
  it('is a list of rows, dates first, without icons or boxes', async () => {
    const { container } = await renderEn(<Education />)
    const rows = container.querySelectorAll('li')

    expect(rows).toHaveLength(4)
    expect(container.querySelector('svg')).toBeNull()
    expect(container.querySelector('.rounded-xl')).toBeNull()
    expect(rows[0].firstElementChild).toHaveTextContent('Sep 2022 - Jul 2025')
  })

  it('writes the descriptions in the text colour at 16px', async () => {
    const { container } = await renderEn(<Education />)

    for (const p of container.querySelectorAll('li p.leading-relaxed')) {
      expect(p).toHaveClass('text-base')
      expect(p.getAttribute('style')).toMatch(/var\(--text\)/)
    }
  })
})

describe('Highlights', () => {
  it('leads with COSPACE, wider than the others, with no icons', async () => {
    const { container } = await renderEn(<Highlights />)
    const titles = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)

    expect(titles[0]).toMatch(/COSPACE/)
    expect(container.querySelector('svg')).toBeNull()
    expect(screen.getByRole('heading', { level: 3, name: /COSPACE/ }).closest('article')).toHaveClass('md:col-span-3')
  })
})

describe.each([
  ['Experience', Experience],
  ['Education', Education],
  ['Highlights', Highlights],
  ['Skills', Skills],
])('%s', (_, Section) => {
  it('does not react to the mouse where nothing is clickable', async () => {
    const { container } = await renderEn(<Section />)
    const withHover = [...container.querySelectorAll('*')].filter((el) =>
      /hover:border|group-hover|hover:opacity/.test(el.className?.toString() ?? ''),
    )

    // the "Other" disclosure in Skills is a button, so it may keep its hover
    expect(withHover.filter((el) => !el.closest('details'))).toHaveLength(0)
  })
})

describe('Experience', () => {
  it('keeps the company in the text colour and the tags neutral', async () => {
    const { container } = await renderEn(<Experience />)
    const first = container.querySelector('h3').parentElement

    expect(first.querySelector('p').getAttribute('style') ?? '').not.toMatch(/--accent/)
    for (const tag of container.querySelectorAll('ul li')) {
      expect(tag).not.toHaveClass('text-accent')
      expect(tag).toHaveClass('border-line')
    }
  })

  it('writes the descriptions in the text colour at 16px', async () => {
    const { container } = await renderEn(<Experience />)

    for (const p of container.querySelectorAll('p.leading-relaxed')) {
      expect(p).toHaveClass('text-base')
      expect(p.getAttribute('style')).toMatch(/var\(--text\)/)
    }
  })
})
