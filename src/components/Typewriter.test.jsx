import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render } from '@testing-library/react'
import Typewriter from './Typewriter'

const ROLES = ['Software Engineer', 'Full-Stack Developer']

// Lets a test say when the line enters or leaves the screen.
let reportVisibility
class ControlledObserver {
  constructor(callback) {
    reportVisibility = (isIntersecting) => act(() => callback([{ isIntersecting }]))
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Each step's timer is only set after React renders the previous one, so time moves in
// small slices, letting React catch up in between.
const advance = (ms) => {
  for (let t = 0; t < ms; t += 50) act(() => vi.advanceTimersByTime(50))
}

// What a sighted visitor sees: the animated text, without the screen-reader copy or cursor.
const shownText = (container) => container.querySelector('[aria-hidden="true"]').firstChild.textContent

describe('Typewriter', () => {
  let originalObserver
  beforeEach(() => {
    vi.useFakeTimers()
    originalObserver = globalThis.IntersectionObserver
    globalThis.IntersectionObserver = ControlledObserver
  })
  afterEach(() => {
    vi.useRealTimers()
    globalThis.IntersectionObserver = originalObserver
  })

  it('shows the first role already written on load', () => {
    const { container } = render(<Typewriter roles={ROLES} />)

    expect(shownText(container)).toBe(ROLES[0])
  })

  it('keeps cycling through the roles', () => {
    const { container } = render(<Typewriter roles={ROLES} />)

    // Past the 2 s hold: the first role is being deleted.
    advance(2_500)

    expect(shownText(container)).not.toBe(ROLES[0])
    expect(ROLES[0].startsWith(shownText(container))).toBe(true)
  })

  it('stops while the line is off screen and resumes when it is back', () => {
    const { container } = render(<Typewriter roles={ROLES} />)
    reportVisibility(false)

    advance(10_000)
    expect(shownText(container)).toBe(ROLES[0])

    reportVisibility(true)
    advance(2_500)
    expect(shownText(container)).not.toBe(ROLES[0])
  })

  it('gives screen readers every role as plain text', () => {
    const { container } = render(<Typewriter roles={ROLES} />)

    expect(container.querySelector('.sr-only')).toHaveTextContent(ROLES.join(', '))
  })
})
