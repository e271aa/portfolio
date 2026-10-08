import { test, expect } from '@playwright/test'

const sizes = { mobile: { width: 375, height: 800 }, desktop: { width: 1280, height: 800 } }

for (const lang of ['pt', 'en']) {
  for (const theme of ['light', 'dark']) {
    for (const [name, viewport] of Object.entries(sizes)) {
      test(`${lang} ${theme} ${name}: no console errors, no horizontal scroll`, async ({ browser }) => {
        const context = await browser.newContext({ viewport, reducedMotion: 'reduce' })
        await context.addInitScript(([l, t]) => {
          localStorage.setItem('lang', l)
          localStorage.setItem('themeMode', t)
        }, [lang, theme])
        const page = await context.newPage()
        const problems = []
        page.on('console', (m) => { if (m.type() === 'error') problems.push(m.text()) })
        page.on('pageerror', (e) => problems.push(e.message))
        page.on('requestfailed', (r) => problems.push(`failed: ${r.url()}`))

        await page.goto('/')
        await page.waitForLoadState('networkidle')

        await expect(page.locator('html')).toHaveAttribute('lang', lang)
        await expect(page.locator('html')).toHaveClass(theme === 'light' ? /theme-light/ : /^(?!.*theme-light)/)
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        )
        expect(overflow).toBeLessThanOrEqual(0)
        expect(problems).toEqual([])
        await context.close()
      })
    }
  }
}

test('the CV downloads in both languages', async ({ page }) => {
  for (const file of ['Ruben_Martins_CV_PT.pdf', 'Ruben_Martins_CV_EN.pdf']) {
    const res = await page.request.get(`/${file}`)
    expect(res.status()).toBe(200)
    expect(res.headers()['content-type']).toContain('pdf')
  }
  await page.setViewportSize(sizes.desktop)
  await page.goto('/')
  const link = page.locator('a[href$=".pdf"][download]').first()
  const [download] = await Promise.all([page.waitForEvent('download'), link.click()])
  expect(download.suggestedFilename()).toMatch(/^Ruben_Martins_CV_(PT|EN)\.pdf$/)
})

test('language and theme survive a reload', async ({ page }) => {
  await page.setViewportSize(sizes.desktop)
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  const before = await page.locator('html').getAttribute('lang')

  await page.getByRole('button', { name: /switch language|mudar.*(língua|idioma)/i }).click()
  const lang = await page.locator('html').getAttribute('lang')
  expect(lang).not.toBe(before)

  const themeBtn = page.locator('nav button[aria-label*="heme"], nav button[aria-label*="ema"]').first()
  await themeBtn.click()
  const light = await page.evaluate(() => document.documentElement.classList.contains('theme-light'))
  const mode = await page.evaluate(() => localStorage.getItem('themeMode'))

  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', lang)
  expect(await page.evaluate(() => document.documentElement.classList.contains('theme-light'))).toBe(light)
  expect(await page.evaluate(() => localStorage.getItem('themeMode'))).toBe(mode)
})
