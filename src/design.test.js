import { describe, expect, it } from 'vitest'

// The rules the design settled on, checked against the source of every component.
const files = import.meta.glob(['./components/*.jsx', './App.jsx'], { query: '?raw', import: 'default', eager: true })
const components = Object.entries(files).filter(([path]) => !path.includes('.test.'))

describe('Design rules', () => {
  it('uses three radii: 6px (buttons, tags), 12px (cards) and the circle', () => {
    const allowed = /^rounded-(md|xl|full|[lrtb]-md)$/
    const bad = []
    for (const [path, source] of components) {
      for (const [, name] of source.matchAll(/(?<![\w-])(rounded(?:-[\w[\].]+)?)(?![\w-])/g)) {
        if (!allowed.test(name)) bad.push(`${path}: ${name}`)
      }
      for (const [, px] of source.matchAll(/borderRadius:\s*(\d+)/g)) {
        if (!['6', '12'].includes(px)) bad.push(`${path}: borderRadius ${px}`)
      }
    }
    expect(bad).toEqual([])
  })

  it('names the properties a transition changes', () => {
    const bad = components.filter(([, source]) => /transition-all/.test(source)).map(([path]) => path)
    expect(bad).toEqual([])
  })

  it('keeps colours in the tokens, not as hex or rgb in a component', () => {
    const bad = components
      .filter(([, source]) => /#[0-9a-fA-F]{3,8}\b|rgba?\(/.test(source))
      .map(([path]) => path)
    expect(bad).toEqual([])
  })

  it('starts every section at the same left edge (max-w-5xl)', () => {
    const sections = ['About', 'Projects', 'Skills', 'Experience', 'Education', 'Highlights']
    for (const name of sections) {
      const source = files[`./components/${name}.jsx`]
      expect(source, name).toMatch(/max-w-5xl/)
      expect(source, name).not.toMatch(/max-w-4xl/)
    }
  })
})
