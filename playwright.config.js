import { defineConfig } from '@playwright/test'

// CI installs Chromium with `npx playwright install chromium`; locally PW_CHROMIUM can point
// at an existing binary.
const executablePath = process.env.PW_CHROMIUM || undefined

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL: 'http://localhost:4173', launchOptions: { executablePath } },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
