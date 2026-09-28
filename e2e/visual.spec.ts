import { expect, test } from '@playwright/test';
import { fresh } from './helpers';

/**
 * 시각 회귀: 화면 모양이 의도치 않게 바뀌면 잡는다.
 * 기준 이미지는 운영체제·브라우저마다 달라서 로컬(macOS)에서만 돌린다. CI 에서는 건너뛴다.
 *   VISUAL=1 npx playwright test e2e/visual.spec.ts                  # 비교
 *   VISUAL=1 npx playwright test e2e/visual.spec.ts --update-snapshots  # 기준 갱신
 */
test.skip(!process.env.VISUAL, 'VISUAL=1 일 때만 (기준 이미지는 로컬 macOS 기준)');

const SCREENS = ['play', 'learn', 'puzzle', 'guide'] as const;

for (const [name, width, height] of [
  ['desktop', 1280, 860],
  ['tablet-portrait', 820, 1180],
] as const) {
  for (const screen of SCREENS) {
    test(`${name} ${screen}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await fresh(page);
      await page.getByRole('button', { name: /둘이서/ }).click();
      await page.locator(`.tabs button[data-screen="${screen}"]`).click();
      await page.waitForTimeout(300);
      await expect(page).toHaveScreenshot(`${name}-${screen}.png`, { fullPage: screen === 'guide' });
    });
  }
}
