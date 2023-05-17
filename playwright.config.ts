import { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  testDir: 'test',
  workers: 3,
  retries: 0,
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    baseURL: process.env.BASE_URL || 'http://localhost:8080',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium', headless: false}
    }
  ]
}

export default config