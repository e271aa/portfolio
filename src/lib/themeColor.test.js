import { afterEach, describe, expect, it, vi } from 'vitest'
import { syncThemeColor } from './themeColor'

afterEach(() => {
  document.head.innerHTML = ''
  vi.restoreAllMocks()
})

describe('syncThemeColor', () => {
  it('points the browser bar at the page background of the current theme', () => {
    document.head.innerHTML = '<meta name="theme-color" content="#0a0a0a">'
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({ getPropertyValue: () => ' #f6f5f0 ' })

    syncThemeColor()

    expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute('content', '#f6f5f0')
  })

  it('leaves the tag alone when the token cannot be read', () => {
    document.head.innerHTML = '<meta name="theme-color" content="#0a0a0a">'
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({ getPropertyValue: () => '' })

    syncThemeColor()

    expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute('content', '#0a0a0a')
  })
})
