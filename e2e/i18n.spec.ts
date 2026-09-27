import { expect, test } from '@playwright/test';
import { fresh } from './helpers';

test.describe('다국어', () => {
  test('한국어 브라우저는 한국어로 시작한다', async ({ page }) => {
    await fresh(page);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
    await expect(page.locator('.tabs button').first()).toHaveText('대국');
    await expect(page).toHaveTitle(/우리 체스/);
  });

  test('English 로 바꾸면 모든 화면에서 한글이 사라지고 새로고침에도 유지된다', async ({ page }) => {
    await fresh(page);
    await page.locator('.js-lang button[data-locale="en"]').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('.tabs button').first()).toHaveText('Play');
    for (const screen of ['play', 'learn', 'puzzle', 'guide']) {
      await page.locator(`.tabs button[data-screen="${screen}"]`).click();
      const text = await page.locator('.app').innerText();
      const leftovers = text.split('\n').filter((line) => /[가-힣]/.test(line) && !/한국어/.test(line));
      expect(leftovers, screen).toEqual([]);
    }
    await page.reload();
    await page.waitForSelector('.board .square');
    await expect(page.locator('.tabs button').first()).toHaveText('Play');
  });
});

test.describe('영어 브라우저', () => {
  test.use({ locale: 'en-US' });
  test('영어로 시작한다', async ({ page }) => {
    await fresh(page);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('.js-status')).toHaveText('White to move');
  });
});
