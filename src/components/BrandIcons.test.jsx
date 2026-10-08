import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { GithubIcon, LinkedinIcon } from './BrandIcons'

describe('Brand icons', () => {
  it.each([
    ['GithubIcon', GithubIcon],
    ['LinkedinIcon', LinkedinIcon],
  ])('%s is hidden from screen readers (its link carries the name)', (_, Icon) => {
    const { container } = render(<Icon />)

    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })
})
