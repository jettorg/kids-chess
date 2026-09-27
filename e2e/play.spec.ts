import { expect, test } from '@playwright/test';
import { fresh, move, notation, sq, status, twoPlayers } from './helpers';

test.describe('대국', () => {
  test('판과 말이 그려지고 합법 수가 표시된다', async ({ page }) => {
    await fresh(page);
    await expect(page.locator('.board .square')).toHaveCount(64);
    await expect(page.locator('.board .piece')).toHaveCount(32);
    await expect(status(page)).toHaveText('흰색 차례예요');
    await page.click(sq('e2'));
    await expect(page.locator('.board .square.selected')).toHaveCount(1);
    await expect(page.locator('.board .square.dest')).toHaveCount(2);
  });

  test('둘이서 두기, 되돌리기, 잡은 말 트레이', async ({ page }) => {
    await fresh(page);
    await twoPlayers(page);
    await move(page, 'e2', 'e4');
    await move(page, 'd7', 'd5');
    await move(page, 'e4', 'd5');
    await expect(notation(page)).toHaveText('1. e4 d5 2. exd5');
    await expect(page.locator('.tray .piece')).toHaveCount(1);
    await page.getByRole('button', { name: /되돌리기/ }).click();
    await expect(notation(page)).toHaveText('1. e4 d5');
    await expect(page.locator('.tray .piece')).toHaveCount(0);
  });

  test('첫 수를 두면 설정 카드가 접히고 다시 펼 수 있다', async ({ page }) => {
    await fresh(page);
    await twoPlayers(page);
    await expect(page.locator('.js-opponents')).toHaveCount(1);
    await move(page, 'e2', 'e4');
    await expect(page.locator('.js-opponents')).toHaveCount(0);
    await expect(page.locator('.panel .summary')).toContainText('둘이서');
    await page.locator('.js-toggle-settings').click();
    await expect(page.locator('.js-opponents')).toHaveCount(1);
  });

  test('잘못된 수는 거부된다', async ({ page }) => {
    await fresh(page);
    await twoPlayers(page);
    await move(page, 'e2', 'e5');
    await expect(notation(page)).toHaveText('아직 둔 수가 없어요.');
    await expect(page.locator('.board .piece')).toHaveCount(32);
  });

  test('캐슬링과 승격 선택', async ({ page }) => {
    await fresh(page);
    await page.evaluate(() => {
      localStorage.setItem('kids-chess.settings.v1', JSON.stringify({ sound: false, coords: true, opponent: 'human', playerColor: 'w', flipped: false }));
      localStorage.setItem('kids-chess.game.v1', JSON.stringify({ start: 'r3k2r/P7/8/8/8/8/8/R3K2R w KQkq - 0 1', moves: [] }));
    });
    await page.reload();
    await page.waitForSelector('.board .square');
    await move(page, 'e1', 'g1');
    await expect(notation(page)).toHaveText('1. O-O');
    await move(page, 'e8', 'c8');
    await expect(notation(page)).toHaveText('1. O-O O-O-O');
    await page.click(sq('a7'));
    await page.click(sq('a8'));
    await expect(page.locator('.promo-card')).toBeVisible();
    await page.locator('button[data-promo="n"]').click();
    await expect(notation(page)).toContainText('a8=N');
  });

  test('스칼라 메이트로 끝나면 결과 창과 축하 효과', async ({ page }) => {
    await fresh(page);
    await twoPlayers(page);
    for (const [f, t] of [['e2', 'e4'], ['e7', 'e5'], ['f1', 'c4'], ['b8', 'c6'], ['d1', 'h5'], ['g8', 'f6'], ['h5', 'f7']]) {
      await move(page, f!, t!);
    }
    await expect(page.locator('.js-banner h2')).toHaveText('체크메이트! 🎉');
    await expect(page.locator('.confetti')).toHaveCount(1);
    await expect(status(page)).toContainText('체크메이트');
    await page.locator('.js-banner .js-close').click();
    await expect(page.locator('.js-banner')).toHaveClass(/hidden/);
  });

  test('새로고침해도 진행 중인 판이 유지된다', async ({ page }) => {
    await fresh(page);
    await twoPlayers(page);
    await move(page, 'g1', 'f3');
    await page.reload();
    await page.waitForSelector('.board .square');
    await expect(notation(page)).toHaveText('1. Nf3');
  });
});
