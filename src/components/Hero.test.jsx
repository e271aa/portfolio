import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LazyMotion, domAnimation } from 'framer-motion'
import i18n from '../i18n/index.js'
import pt from '../i18n/pt.json'
import en from '../i18n/en.json'
import Hero from './Hero'

const LOCALES = { pt, en }

async function renderHero(lang) {
  await i18n.changeLanguage(lang)
  return render(
    <LazyMotion features={domAnimation} strict>
      <Hero />
    </LazyMotion>,
  )
}

describe('Hero', () => {
  it.each([
    ['pt', 'Ver o projeto'],
    ['en', 'See the project'],
  ])('leads to the project in %s, next to the CV', async (lang, label) => {
    await renderHero(lang)

    expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', '#projects')
  })

  it.each([
    ['pt', /apaixonado|soluções inteligentes|fazem a diferença/i],
    ['en', /passionate|smart solutions|that matter/i],
  ])('states facts, not adjectives, in %s', (lang, empty) => {
    expect(LOCALES[lang].hero.bio).not.toMatch(empty)
    expect(LOCALES[lang].hero.bio).toMatch(/Braga/)
  })

  it.each(['pt', 'en'])('lists only real job titles in %s', (lang) => {
    const roles = LOCALES[lang].hero.roles

    expect(roles).toHaveLength(6)
    expect(roles.join(' ')).not.toMatch(/Orientado para Soluções|Problem Solver|Dev\b/)
  })

  it.each(['pt', 'en'])('has no bouncing arrow below the fold in %s', async (lang) => {
    const { container } = await renderHero(lang)

    expect(container.querySelector('a[href="#about"]')).toBeNull()
    expect(container.querySelector('.animate-bounce')).toBeNull()
    expect(LOCALES[lang].hero).not.toHaveProperty('scrollDown')
  })

  it('fills the screen without a calc that overflows it', async () => {
    const { container } = await renderHero('en')

    expect(container.querySelector('section')).toHaveClass('min-h-[100dvh]')
    expect(container.innerHTML).not.toMatch(/100vh/)
  })
})
