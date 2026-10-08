import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LazyMotion, domAnimation } from 'framer-motion'
import i18n from '../i18n/index.js'
import pt from '../i18n/pt.json'
import en from '../i18n/en.json'
import Projects from './Projects'

const DEMO_URL = 'https://demo.invalid/casa'
const REPO_URL = 'https://git.invalid/ruben/nook'
const LOCALES = { pt, en }
const FAKE = /example\.com|\/api\/placeholder/

async function renderProjects(lang) {
  await i18n.changeLanguage(lang)
  return render(
    <LazyMotion features={domAnimation} strict>
      <Projects />
    </LazyMotion>,
  )
}

describe('Projects section', () => {
  // Start every test with both addresses unset, whatever a local .env file says.
  beforeEach(() => {
    vi.stubEnv('VITE_DEMO_URL', '')
    vi.stubEnv('VITE_NOOK_REPO_URL', '')
  })

  describe.each(['pt', 'en'])('in %s', (lang) => {
    it('has no sample link and no placeholder image', async () => {
      vi.stubEnv('VITE_DEMO_URL', DEMO_URL)
      vi.stubEnv('VITE_NOOK_REPO_URL', REPO_URL)
      const { container } = await renderProjects(lang)

      expect(JSON.stringify(LOCALES[lang].projects)).not.toMatch(FAKE)
      expect(container.innerHTML).not.toMatch(FAKE)
    })

    it('presents the Nook', async () => {
      await renderProjects(lang)

      expect(screen.getByRole('heading', { level: 3, name: 'Nook' })).toBeInTheDocument()
    })

    it('gives every image a description and its real size', async () => {
      await renderProjects(lang)
      const images = screen.getAllByRole('img')

      expect(images.length).toBeGreaterThanOrEqual(2)
      for (const img of images) {
        expect(img.getAttribute('alt').trim()).not.toBe('')
        expect(Number(img.getAttribute('width'))).toBeGreaterThan(0)
        expect(Number(img.getAttribute('height'))).toBeGreaterThan(0)
      }
    })

    it('shows no button while the addresses are unset', async () => {
      await renderProjects(lang)

      expect(screen.queryAllByRole('link')).toHaveLength(0)
    })
  })

  it.each([
    ['pt', 'Abrir a demo', 'Código'],
    ['en', 'Open the demo', 'Code'],
  ])('labels the buttons in %s', async (lang, demo, code) => {
    vi.stubEnv('VITE_DEMO_URL', DEMO_URL)
    vi.stubEnv('VITE_NOOK_REPO_URL', REPO_URL)
    await renderProjects(lang)

    expect(screen.getByRole('link', { name: demo })).toHaveAttribute('href', DEMO_URL)
    expect(screen.getByRole('link', { name: code })).toHaveAttribute('href', REPO_URL)
  })

  it('shows the demo button only when VITE_DEMO_URL is set', async () => {
    vi.stubEnv('VITE_DEMO_URL', DEMO_URL)
    await renderProjects('pt')

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAttribute('href', DEMO_URL)
  })

  it('shows the code button only when VITE_NOOK_REPO_URL is set', async () => {
    vi.stubEnv('VITE_NOOK_REPO_URL', REPO_URL)
    await renderProjects('pt')

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAttribute('href', REPO_URL)
  })

  it('ignores an address that is not a web address', async () => {
    vi.stubEnv('VITE_DEMO_URL', '/casa')
    vi.stubEnv('VITE_NOOK_REPO_URL', 'nook')
    await renderProjects('pt')

    expect(screen.queryAllByRole('link')).toHaveLength(0)
  })

  it('uses European Portuguese', () => {
    expect(JSON.stringify(pt.projects)).not.toMatch(/rastreamento/i)
  })
})
