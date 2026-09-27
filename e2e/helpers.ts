import type { Page } from '@playwright/test';

/** 'e4' → 해당 칸의 CSS 선택자 */
export function sq(name: string): string {
  const file = 'abcdefgh'.indexOf(name[0]!);
  const rank = Number(name[1]) - 1;
  return `.board .square[data-sq="${rank * 8 + file}"]`;
}

/** 저장된 상태를 지우고 첫 화면을 연다 */
export async function fresh(page: Page, path = '/'): Promise<void> {
  await page.goto(path);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForSelector('.board .square');
}

export async function twoPlayers(page: Page): Promise<void> {
  await page.getByRole('button', { name: /둘이서/ }).click();
  await page.waitForTimeout(150);
}

export async function move(page: Page, from: string, to: string): Promise<void> {
  await page.click(sq(from));
  await page.click(sq(to));
  await page.waitForTimeout(120);
}

export function notation(page: Page) {
  return page.locator('.js-notation');
}

export function status(page: Page) {
  return page.locator('.js-status');
}
