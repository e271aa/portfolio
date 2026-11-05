import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
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

// The Nook's own card: its buttons and captures, without the client projects below it.
const nook = () => within(screen.getByRole('article', { name: 'Nook' }))

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

    it('shows no Nook button while the addresses are unset', async () => {
      await renderProjects(lang)

      expect(nook().queryAllByRole('link')).toHaveLength(0)
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

    const links = nook().getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
    for (const link of links) expect(link).toHaveAttribute('href', DEMO_URL)
  })

  it.each(['pt', 'en'])('opens the demo from each capture in %s', async (lang) => {
    vi.stubEnv('VITE_DEMO_URL', DEMO_URL)
    const { container } = await renderProjects(lang)

    const shots = [...container.querySelectorAll('figure')]
    expect(shots).toHaveLength(2)
    for (const shot of shots) {
      const link = shot.querySelector('a')
      expect(link).toHaveAttribute('href', DEMO_URL)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link.querySelector('img')).not.toBeNull()
      expect(link.getAttribute('aria-label')).toMatch(lang === 'pt' ? /^Abrir a demo/ : /^Open the demo/)
    }
  })

  it('shows the code button only when VITE_NOOK_REPO_URL is set', async () => {
    vi.stubEnv('VITE_NOOK_REPO_URL', REPO_URL)
    await renderProjects('pt')

    const links = nook().getAllByRole('link')
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAttribute('href', REPO_URL)
  })

  it('ignores an address that is not a web address', async () => {
    vi.stubEnv('VITE_DEMO_URL', '/casa')
    vi.stubEnv('VITE_NOOK_REPO_URL', 'nook')
    await renderProjects('pt')

    expect(nook().queryAllByRole('link')).toHaveLength(0)
  })

  it('uses European Portuguese', () => {
    expect(JSON.stringify(pt.projects)).not.toMatch(/rastreamento/i)
  })
})

// Two freelance projects for the same client, text only: no captures of the client's software.
const CLIENT_PROJECTS = {
  pt: ['Sistema de Gestão Hoteleira (Freelance)', 'Site do Hotel e Restaurante (Freelance)'],
  en: ['Hotel Management System (Freelance)', 'Hotel and Restaurant Website (Freelance)'],
}

describe.each(['pt', 'en'])('Client projects in %s', (lang) => {
  beforeEach(() => {
    vi.stubEnv('VITE_DEMO_URL', '')
    vi.stubEnv('VITE_NOOK_REPO_URL', '')
  })

  it('come after the Nook, as text without images', async () => {
    await renderProjects(lang)
    const cards = screen.getAllByRole('article').map((a) => a.getAttribute('aria-label') ?? within(a).getByRole('heading', { level: 3 }).textContent)

    expect(cards).toEqual(['Nook', ...CLIENT_PROJECTS[lang]])
    for (const name of CLIENT_PROJECTS[lang]) {
      const card = screen.getByRole('article', { name })
      expect(within(card).queryAllByRole('img')).toHaveLength(0)
      expect(within(card).getByText('Hotel Troia, Amares · 2026')).toBeInTheDocument()
      expect(within(card).getAllByRole('listitem').length).toBeGreaterThanOrEqual(3)
    }
  })

  it('links the hotel website, and only that one', async () => {
    await renderProjects(lang)
    const [system, site] = CLIENT_PROJECTS[lang].map((name) => screen.getByRole('article', { name }))

    expect(within(system).queryAllByRole('link')).toHaveLength(0)
    const link = within(site).getByRole('link', { name: lang === 'pt' ? 'Ver o site' : 'View the site' })
    expect(link).toHaveAttribute('href', 'https://restaurantehoteltroia.com')
    expect(link).toHaveAttribute('target', '_blank')
  })
})
