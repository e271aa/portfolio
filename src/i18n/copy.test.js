import { describe, expect, it } from 'vitest'
import pt from './pt.json'
import en from './en.json'

// Site copy states facts. These are the empty phrases the audit found, per language.
const EMPTY = {
  pt: /apaixonado|versatilidade|adaptabilidade|novo desafio|sólida|forte componente|despertou/i,
  en: /passionate|versatility|adaptability|new challenge|solid|strong practical|sparked|crafted/i,
}

// "a, b, and c": British copy drops the comma before the last "and".
const OXFORD_COMMA = /, and [^,.]*\./

const text = (value) => JSON.stringify(value)

describe.each([['pt', pt], ['en', en]])('About in %s', (lang, locale) => {
  it('has no empty adjectives', () => {
    expect(text(locale.about)).not.toMatch(EMPTY[lang])
  })

  it('uses the menu name as its title', () => {
    expect(locale.about.title).toBe(locale.nav.about)
  })
})

describe('About in en-GB', () => {
  it('gives the CEFR name for B2', () => {
    expect(en.about.english_level).toBe('Upper intermediate (B2)')
  })

  it('has no Oxford comma', () => {
    for (const key of ['p1', 'p2', 'p3']) expect(en.about[key]).not.toMatch(OXFORD_COMMA)
  })
})

const words = (sentence) => sentence.trim().split(/\s+/).length

describe.each([['pt', pt], ['en', en]])('Experience in %s', (lang, locale) => {
  it('has no empty adjectives', () => {
    expect(text(locale.experience)).not.toMatch(EMPTY[lang])
  })

  it('keeps every description to 30 words or fewer', () => {
    for (const item of locale.experience.items) expect(words(item.description), item.role).toBeLessThanOrEqual(30)
  })
})

describe('Experience in en-GB', () => {
  it('says academic internship and Centre', () => {
    const copy = text(en.experience)
    expect(copy).not.toMatch(/curricular/i)
    expect(copy).not.toMatch(/Center\b/)
    expect(copy).toMatch(/Network Operations Centre/)
  })

  it('has no Oxford comma', () => {
    for (const item of en.experience.items) expect(item.description).not.toMatch(OXFORD_COMMA)
  })
})

describe.each([['pt', pt], ['en', en]])('Education in %s', (lang, locale) => {
  it('has no empty adjectives', () => {
    expect(text(locale.education)).not.toMatch(EMPTY[lang])
  })
})

describe('Education in en-GB', () => {
  it('has no Oxford comma', () => {
    for (const item of en.education.items) expect(item.description).not.toMatch(OXFORD_COMMA)
  })
})

describe.each([['pt', pt], ['en', en]])('Highlights in %s', (lang, locale) => {
  it('has no empty adjectives', () => {
    expect(text(locale.highlights)).not.toMatch(EMPTY[lang])
  })

  it('describes only my part at Web Summit', () => {
    const webSummit = locale.highlights.items.find((item) => item.id === 'websummit').description
    expect(webSummit).not.toMatch(/160|maiores|largest/)
    expect(words(webSummit)).toBeLessThanOrEqual(30)
  })
})

describe.each([['pt', pt], ['en', en]])('Footer in %s', (lang, locale) => {
  it('has no empty adjectives', () => {
    expect(text(locale.footer)).not.toMatch(EMPTY[lang])
  })
})
