import { defineConfig, devices } from '@playwright/test';

/**
 * 브라우저 E2E 테스트. 빌드 결과물을 preview 서버로 띄워 실제 배포와 같은 형태로 검사한다.
 *   npm run test:e2e                      # 크로미움 전체 + WebKit 핵심
 *   VISUAL=1 npx playwright test e2e/visual.spec.ts --update-snapshots   # 시각 기준 이미지 갱신 (로컬)
 */
export default defineConfig({
  testDir: 'e2e',
  timeout: 40_000,
  expect: { timeout: 8_000, toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled' } },
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
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], locale: 'ko-KR' } },
    {
      // 사파리 계열 차이(dvh, 서비스 워커, 포인터 이벤트)를 잡는다. 시간에 민감한 컴퓨터 대국과
      // 시각 회귀는 제외하고 레이아웃·조작·PWA·접근성·다국어를 돈다.
      name: 'webkit',
      use: { ...devices['Desktop Safari'], locale: 'ko-KR' },
      testIgnore: ['**/ai.spec.ts', '**/visual.spec.ts'],
    },
  ],
});
