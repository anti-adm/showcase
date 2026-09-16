import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  workers: 2,
  timeout: 45000,
  expect: {timeout: 10000},
  reporter: [['list'], ['html', {open: 'never'}]],
  use: {baseURL: 'http://127.0.0.1:3212', trace: 'retain-on-failure', screenshot: 'only-on-failure', reducedMotion: 'reduce'},
  projects: [
    {name: 'desktop', use: {...devices['Desktop Chrome'], channel: 'chrome', viewport: {width: 1440, height: 900}}},
    {name: 'mobile', use: {...devices['Desktop Chrome'], channel: 'chrome', viewport: {width: 390, height: 844}, isMobile: true, hasTouch: true}}
  ],
  webServer: {command: 'pnpm start --port 3212', url: 'http://127.0.0.1:3212/ru', reuseExistingServer: !process.env.CI, timeout: 30000}
});
