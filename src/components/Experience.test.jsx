import { describe, expect, it } from 'vitest'
import pt from '../i18n/pt.json'
import en from '../i18n/en.json'

const ACASA = {
  pt: [
    ['Lead Full-Stack Developer', 'Abr 2026 - Jun 2026'],
    ['Full-Stack Developer (Estágio Profissional)', 'Set 2025 - Mar 2026'],
    ['Junior Full-Stack Developer (Estágio Curricular)', 'Fev 2025 - Jun 2025'],
  ],
  en: [
    ['Lead Full-Stack Developer', 'Apr 2026 - Jun 2026'],
    ['Full-Stack Developer (Professional Internship)', 'Sep 2025 - Mar 2026'],
    ['Junior Full-Stack Developer (Academic Internship)', 'Feb 2025 - Jun 2025'],
  ],
}

describe.each([['pt', pt], ['en', en]])('Experience in %s', (lang, locale) => {
  it('has the three A+CASA roles first, newest first, with the CV dates', () => {
    const roles = locale.experience.items.slice(0, 3).map((item) => [item.role, item.period])

    expect(roles).toEqual(ACASA[lang])
    for (const item of locale.experience.items.slice(0, 3)) expect(item.company).toBe('A+CASA')
  })

  it('keeps Fujitsu and Happy PC after them', () => {
    expect(locale.experience.items.slice(3).map((item) => item.company)).toEqual(['Fujitsu Technology Solutions', 'Happy PC'])
  })
})
