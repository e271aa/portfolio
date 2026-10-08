import { describe, expect, it } from 'vitest'
import html from '../index.html?raw'
import robots from '../public/robots.txt?raw'
import sitemap from '../public/sitemap.xml?raw'

const SITE = 'https://portfolio.e271aa.blog'

describe('Search and sharing files', () => {
  it('has a canonical link built from VITE_SITE_URL', () => {
    expect(html).toMatch(/<link rel="canonical" href="%VITE_SITE_URL%\/" \/>/)
  })

  it('points robots.txt at the sitemap on the real domain', () => {
    expect(robots).toMatch(new RegExp(`^Sitemap: ${SITE}/sitemap\\.xml$`, 'm'))
    expect(robots).toMatch(/^Allow: \/$/m)
  })

  it('lists only the home page in the sitemap, on the real domain', () => {
    expect(sitemap).toMatch(/<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/)
    expect([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])).toEqual([`${SITE}/`])
  })
})
