import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import i18n from '../i18n/index.js'
import CvDropdownButton from './CvDropdownButton'

afterEach(cleanup)

// The main button gives the plain (ATS) CV in the page language; the menu has the designed
// version of it and both versions in the other language.
const CASES = [
  ['pt', 'Ruben_Martins_CV_PT.pdf', ['Ruben_Martins_CV_Design_PT.pdf', 'Ruben_Martins_CV_EN.pdf', 'Ruben_Martins_CV_Design_EN.pdf']],
  ['en', 'Ruben_Martins_CV_EN.pdf', ['Ruben_Martins_CV_Design_EN.pdf', 'Ruben_Martins_CV_PT.pdf', 'Ruben_Martins_CV_Design_PT.pdf']],
]

describe.each(CASES)('CV button in %s', (lang, main, menu) => {
  it('downloads the ATS CV from the main button and offers the other three in the menu', async () => {
    await i18n.changeLanguage(lang)
    const { container } = render(<CvDropdownButton variant="filled" />)

    const mainLink = container.querySelector('a[download]')
    expect(mainLink.getAttribute('href')).toBe(`/${main}`)
    expect(mainLink.getAttribute('download')).toBe(main)

    fireEvent.click(screen.getByRole('button', { name: i18n.t('hero.cvMore') }))
    const items = screen.getAllByRole('menuitem')
    expect(items.map((a) => a.getAttribute('download'))).toEqual(menu)
    expect(items.map((a) => a.getAttribute('href'))).toEqual(menu.map((f) => `/${f}`))
    items.forEach((a) => expect(a.textContent.trim()).not.toBe(''))
  })
})
