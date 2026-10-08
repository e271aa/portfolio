import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import i18n from '../i18n/index.js'
import Footer from './Footer'

async function renderFooter(lang = 'en') {
  await i18n.changeLanguage(lang)
  return render(<Footer />)
}

describe('Footer', () => {
  it('only types commands that exist in a shell', async () => {
    const { container } = await renderFooter()
    const commands = [...container.querySelectorAll('[data-command]')].map((c) => c.textContent)

    expect(commands).toEqual(['whoami', 'cat status', 'cat contacts', 'echo thanks'])
  })

  it('gives every contact a 44px tall target', async () => {
    await renderFooter()
    const links = screen.getAllByRole('link').filter((a) => a.href.match(/^(mailto|https)/))

    expect(links).toHaveLength(3)
    for (const link of links) expect(link.className).toMatch(/\bmin-h-11\b/)
  })

  it('does not advertise the stack', async () => {
    await renderFooter()

    expect(screen.queryByText(/Vite|Tailwind/)).toBeNull()
  })

  it('has no fixed hex colours in the window dots', async () => {
    const { container } = await renderFooter()

    expect(container.innerHTML).not.toMatch(/#[0-9a-f]{6}|rgb\(255, 95, 87\)/i)
  })
})
