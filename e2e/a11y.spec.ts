import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { fresh, sq } from './helpers';

test.describe('접근성', () => {
  for (const screen of ['play', 'learn', 'puzzle', 'guide']) {
    test(`${screen} 화면에 axe 위반이 없다`, async ({ page }) => {
      await fresh(page);
      await page.locator(`.tabs button[data-screen="${screen}"]`).click();
      await page.waitForTimeout(200);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'best-practice']).analyze();
      expect(results.violations.map((v) => `${v.id} ×${v.nodes.length}`)).toEqual([]);
    });
  }

  test('키보드만으로 수를 둘 수 있다', async ({ page }) => {
    await fresh(page);
    await page.getByRole('button', { name: /둘이서/ }).click();
    await page.locator('.board .square[tabindex="0"]').focus();
    await expect(page.locator(':focus')).toHaveAttribute('aria-label', /^e1/);
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('Enter');
    await expect(page.locator('.board .square.selected')).toHaveCount(1);
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('Enter');
    await expect(page.locator('.js-notation')).toHaveText('1. e4');
    await expect(page.locator(':focus')).toHaveAttribute('aria-label', /^e4, 흰색 폰/);
    await page.keyboard.press('Escape');
    await expect(page.locator('.board .square.selected')).toHaveCount(0);
  });

  test('칸 라벨이 말과 상태를 설명한다', async ({ page }) => {
    await fresh(page);
    await expect(page.locator(sq('e1'))).toHaveAttribute('aria-label', 'e1, 흰색 킹');
    await expect(page.locator(sq('e4'))).toHaveAttribute('aria-label', 'e4, 빈 칸');
    await page.click(sq('e2'));
    await expect(page.locator(sq('e2'))).toHaveAttribute('aria-label', 'e2, 흰색 폰, 선택됨');
    await expect(page.locator(sq('e4'))).toHaveAttribute('aria-label', 'e4, 빈 칸, 이동 가능');
  });
});
