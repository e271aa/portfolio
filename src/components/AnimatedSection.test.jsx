import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import i18n from '../i18n/index.js'
import App from '../App'

// Nothing is ever "in view" in jsdom, so every animated element is still at its start state
// (an inline opacity). Counting them counts the entrances.
describe('Scroll entrances', () => {
  it('has one entrance per section, below the hero', async () => {
    await i18n.changeLanguage('en')
    const { container } = render(<App />)
    const sections = [...container.querySelectorAll('main section')].filter((s) => s.id)

    expect(sections.length).toBe(6)
    for (const section of sections) {
      expect(section.querySelectorAll('[style*="opacity"]'), section.id).toHaveLength(1)
    }
  })

  it('never slides in from the side', async () => {
    const { container } = render(<App />)
    const moving = [...container.querySelectorAll('main section[id] [style*="translateX"]')]

    expect(moving).toHaveLength(0)
  })
})
