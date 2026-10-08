import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// jsdom has no IntersectionObserver, and the scroll animations ask for one. Nothing is ever
// reported as "in view", which is fine: the tests read the markup, not the animation.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
globalThis.IntersectionObserver = IntersectionObserverStub

// jsdom has no matchMedia either. Every query answers "no", so "reduce motion" is off.
window.matchMedia ??= (query) => ({
  matches: false,
  media: query,
  addEventListener() {},
  removeEventListener() {},
})

afterEach(cleanup)
