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

test.describe('대화상자 초점', () => {
  test('결과 창이 열리면 초점이 안으로 들어오고 Tab 이 밖으로 나가지 않는다', async ({ page }) => {
    await fresh(page);
    await page.getByRole('button', { name: /둘이서/ }).click();
    for (const [f, t] of [['e2', 'e4'], ['e7', 'e5'], ['f1', 'c4'], ['b8', 'c6'], ['d1', 'h5'], ['g8', 'f6'], ['h5', 'f7']]) {
      await page.click(sq(f!));
      await page.click(sq(t!));
    }
    await expect(page.locator('.js-banner [role="dialog"]')).toBeVisible();
    await expect(page.locator(':focus')).toHaveText(/한 판 더/);
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press('Tab');
      const inside = await page.evaluate(() => document.querySelector('.js-banner')!.contains(document.activeElement));
      expect(inside, `Tab ${i + 1}`).toBe(true);
    }
    await page.keyboard.press('Shift+Tab');
    expect(await page.evaluate(() => document.querySelector('.js-banner')!.contains(document.activeElement))).toBe(true);
    await page.keyboard.press('Escape');
    await expect(page.locator('.js-banner')).toHaveClass(/hidden/);
  });

  test('승격 창은 Tab 을 가두고 Esc 로 취소할 수 있다', async ({ page }) => {
    await fresh(page);
    await page.evaluate(() => {
      localStorage.setItem('kids-chess.settings.v1', JSON.stringify({ sound: false, coords: true, opponent: 'human', playerColor: 'w', flipped: false }));
      localStorage.setItem('kids-chess.game.v1', JSON.stringify({ start: '4k3/P7/8/8/8/8/8/4K3 w - - 0 1', moves: [] }));
    });
    await page.reload();
    await page.waitForSelector('.board .square');
    await page.click(sq('a7'));
    await page.click(sq('a8'));
    await expect(page.locator('.promo-card[role="dialog"]')).toBeVisible();
    await expect(page.locator(':focus')).toHaveAttribute('data-promo', 'q');
    for (let i = 0; i < 5; i++) await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.querySelector('.js-promo')!.contains(document.activeElement))).toBe(true);
    await page.keyboard.press('Escape');
    await expect(page.locator('.js-promo')).toHaveClass(/hidden/);
    await expect(page.locator(sq('a7') + ' .piece')).toHaveCount(1);
    await expect(page.locator('.js-notation')).toHaveText('아직 둔 수가 없어요.');
    // 다시 시도하면 고를 수 있다 (초점이 창 안으로 옮겨진 뒤 Enter)
    await page.click(sq('a7'));
    await page.click(sq('a8'));
    await expect(page.locator(':focus')).toHaveAttribute('data-promo', 'q');
    await page.keyboard.press('Enter');
    await expect(page.locator('.js-notation')).toContainText('a8=Q');
  });
});

test.describe('움직임 줄이기', () => {
  test.use({ reducedMotion: 'reduce' });
  test('설정이 켜져 있으면 승리 색종이를 띄우지 않는다', async ({ page }) => {
    await fresh(page);
    await page.getByRole('button', { name: /둘이서/ }).click();
    for (const [f, t] of [['e2', 'e4'], ['e7', 'e5'], ['f1', 'c4'], ['b8', 'c6'], ['d1', 'h5'], ['g8', 'f6'], ['h5', 'f7']]) {
      await page.click(sq(f!));
      await page.click(sq(t!));
    }
    await expect(page.locator('.js-banner h2')).toHaveText('체크메이트! 🎉');
    await expect(page.locator('.confetti')).toHaveCount(0);
  });
});
