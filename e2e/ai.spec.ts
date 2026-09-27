import { expect, test } from '@playwright/test';
import { fresh, move, notation, sq, status } from './helpers';

test.describe('컴퓨터 상대', () => {
  test('병아리가 응수하고, 되돌리기는 내 차례까지 되돌린다', async ({ page }) => {
    await fresh(page);
    await page.getByRole('button', { name: /병아리/ }).click();
    await move(page, 'e2', 'e4');
    await expect(notation(page)).toHaveText(/^1\. e4 \S+$/);
    await page.getByRole('button', { name: /되돌리기/ }).click();
    await expect(notation(page)).toHaveText('아직 둔 수가 없어요.');
  });

  test('내가 검은색이면 컴퓨터가 먼저 둔다', async ({ page }) => {
    await fresh(page);
    await page.getByRole('button', { name: /병아리/ }).click();
    await page.locator('.js-colors button', { hasText: '검은색' }).click();
    await expect(notation(page)).toHaveText(/^1\. \S+$/);
    // 판이 뒤집혀 검은 말이 아래에 온다
    await expect(page.locator('.board .square').first()).toHaveAttribute('data-sq', '7');
  });

  test('부엉이(5)는 Worker 에서 생각하고 화면은 멈추지 않는다', async ({ page }) => {
    await fresh(page);
    await page.getByRole('button', { name: /부엉이/ }).click();
    await page.evaluate(() => {
      const w = window as unknown as { __gaps: number[]; __run: boolean };
      w.__gaps = [];
      w.__run = true;
      let last = performance.now();
      const tick = (t: number) => {
        w.__gaps.push(t - last);
        last = t;
        if (w.__run) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    await move(page, 'e2', 'e4');
    await expect(status(page)).toContainText('생각');
    await expect(status(page)).not.toContainText('생각', { timeout: 10_000 });
    const maxGap = await page.evaluate(() => {
      const w = window as unknown as { __gaps: number[]; __run: boolean };
      w.__run = false;
      return Math.max(...w.__gaps);
    });
    expect(maxGap).toBeLessThan(400);
    await expect(notation(page)).toHaveText(/^1\. e4 \S+$/);
  });

  test('생각하는 동안 새 게임을 누르면 늦게 온 수를 버린다', async ({ page }) => {
    await fresh(page);
    await page.getByRole('button', { name: /부엉이/ }).click();
    await move(page, 'd2', 'd4');
    await expect(status(page)).toContainText('생각');
    await page.getByRole('button', { name: /새 게임/ }).click();
    await page.waitForTimeout(4500);
    await expect(notation(page)).toHaveText('아직 둔 수가 없어요.');
    await expect(page.locator('.board .piece')).toHaveCount(32);
  });

  test('힌트는 비동기로 표시된다', async ({ page }) => {
    await fresh(page);
    await page.getByRole('button', { name: /둘이서/ }).click();
    await page.getByRole('button', { name: /힌트/ }).click();
    await expect(page.locator('.board .square.hint-to')).toHaveCount(1, { timeout: 8000 });
  });
});
