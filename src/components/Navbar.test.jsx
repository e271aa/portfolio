import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import i18n from '../i18n/index.js'
import Navbar from './Navbar'

async function renderNavbar() {
  await i18n.changeLanguage('en')
  return render(<Navbar />)
}

describe('Navbar', () => {
  it('writes the name, with the full stop of the title in green, instead of </>', async () => {
    await renderNavbar()
    const logo = screen.getByRole('link', { name: 'Back to top' })

    expect(logo).toHaveTextContent('ruben.martins.')
    expect(logo).not.toHaveTextContent('</>')
    expect(logo.querySelector('.text-accent')).toHaveTextContent(/^\.$/)
  })

  it('gives the logo and the CV arrow a 44px target', async () => {
    await renderNavbar()

    expect(screen.getByRole('link', { name: 'Back to top' })).toHaveClass('min-h-11')
    for (const arrow of screen.getAllByRole('button', { name: 'CV in Portuguese' })) {
      expect(arrow).toHaveClass('min-h-11', 'min-w-11')
    }
  })

  it('names the properties that change instead of transitioning all', async () => {
    const { container } = await renderNavbar()

    expect(container.innerHTML).not.toMatch(/transition-all/)
  })
})
