import { expect, test } from '@playwright/test';
import { fresh, sq } from './helpers';

const VIEWPORTS: [string, number, number, number][] = [
  // 이름, 폭, 높이, 판의 최소 크기
  ['MacBook', 1440, 900, 640],
  ['노트북', 1366, 768, 520],
  ['아이패드 가로', 1024, 768, 520],
  ['아이패드 세로', 820, 1180, 740],
  ['아이폰', 390, 844, 340],
];

for (const [name, width, height, minBoard] of VIEWPORTS) {
  test(`${name} ${width}x${height}: 판이 잘리지 않고 충분히 크다`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await fresh(page);
    const box = await page.locator('.board').boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(minBoard);
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(overflow).toBe(false);
    if (height > width) return; // 세로 화면은 아래로 스크롤이 자연스럽다
    expect(box!.y + box!.height).toBeLessThanOrEqual(height + 1);
  });
}

test('잡기가 일어나도 대국 중 판 크기는 그대로다', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await fresh(page);
  await page.getByRole('button', { name: /둘이서/ }).click();
  const before = (await page.locator('.board').boundingBox())!.width;
  for (const [f, t] of [['e2', 'e4'], ['d7', 'd5'], ['e4', 'd5']]) {
    await page.click(sq(f!));
    await page.click(sq(t!));
  }
  await expect(page.locator('.tray .piece')).toHaveCount(1);
  const after = (await page.locator('.board').boundingBox())!.width;
  expect(after).toBe(before);
});
