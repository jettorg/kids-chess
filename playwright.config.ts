import { defineConfig, devices } from '@playwright/test';

/**
 * 브라우저 E2E 테스트. 빌드 결과물을 preview 서버로 띄워 실제 배포와 같은 형태로 검사한다.
 *   npm run test:e2e
 */
export default defineConfig({
  testDir: 'e2e',
  timeout: 40_000,
  expect: { timeout: 8_000 },
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    locale: 'ko-KR',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], locale: 'ko-KR' } }],
});
