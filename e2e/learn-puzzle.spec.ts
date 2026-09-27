import { expect, test } from '@playwright/test';
import { fresh, move, sq, status } from './helpers';

test.describe('배우기와 퍼즐', () => {
  test('폰 레슨: 목표 칸 표시, 잡으면 줄어든다', async ({ page }) => {
    await fresh(page);
    await page.getByRole('button', { name: '배우기' }).click();
    await expect(status(page)).toHaveText('폰으로 검은 말 3개를 잡아 보세요.');
    await expect(page.locator('.board .square.target')).toHaveCount(3);
    await move(page, 'b2', 'c3');
    await expect(status(page)).toHaveText('폰으로 검은 말 2개를 잡아 보세요.');
    await move(page, 'e2', 'f3');
    await move(page, 'g2', 'h3');
    await expect(page.locator('.js-banner h2')).toHaveText('다 잡았어요! 🎉');
  });

  test('퍼즐: 정답이면 결과 창, 오답이면 되돌린다', async ({ page }) => {
    await fresh(page);
    await page.getByRole('button', { name: '퍼즐' }).click();
    await expect(status(page)).toHaveText('흰색 차례예요. 한 수로 체크메이트!');
    await move(page, 'a1', 'a2');
    await expect(status(page)).toContainText('아직 체크메이트가 아니에요');
    await page.waitForTimeout(1400);
    await expect(page.locator(sq('a1') + ' .piece')).toHaveCount(1);
    await move(page, 'a1', 'a8');
    await expect(page.locator('.js-banner h2')).toHaveText('체크메이트! 정답이에요 🎉');
  });

  test('말 도감에 말 6종과 규칙이 있다', async ({ page }) => {
    await fresh(page);
    await page.getByRole('button', { name: '말 도감' }).click();
    await expect(page.locator('.guide-card')).toHaveCount(6);
    await expect(page.locator('.guide-rules li')).toHaveCount(5);
  });
});
