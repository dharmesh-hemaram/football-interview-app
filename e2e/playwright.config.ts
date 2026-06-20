import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:3000',
    launchOptions: {
      executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    },
    screenshot: 'on',
    screenshotPath: '../screenshots',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'cd /home/user/football-interview-app && npm run dev:frontend',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 30000,
  },
  outputDir: '../screenshots/e2e-artifacts',
});
