import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // Directory where your test files are located
  timeout: 30000, // Maximum time one test can run
  retries: 2, // Retry failed tests up to 2 times
  projects: [
    {
      name: 'Chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'Firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'WebKit',
      use: { browserName: 'webkit' },
    },
  ],
  use: {
    headless: true, // Set to false if you want to see the browser
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000, // Timeout for each action
    ignoreHTTPSErrors: true, // Ignore HTTPS errors during testing
  },
});