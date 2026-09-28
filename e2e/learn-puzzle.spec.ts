import { expect, test } from '@playwright/test';
import { PUZZLES } from '../src/data/puzzles';
import { fresh, move, sq, status } from './helpers';

/** 퍼즐 번호를 저장해 두고 새로 연다 (앱은 마지막 퍼즐을 기억한다) */
async function openPuzzle(page: import('@playwright/test').Page, index: number) {
  await fresh(page);
  await page.evaluate((i) => {
    localStorage.setItem('kids-chess.progress.v1', JSON.stringify({ lessons: [], puzzles: [], puzzleIndex: i }));
  }, index);
  await page.reload();
  await page.waitForSelector('.board .square');
  await page.getByRole('button', { name: '퍼즐' }).click();
  await page.waitForTimeout(200);
}

const uciSquares = (uci: string) => [uci.slice(0, 2), uci.slice(2, 4)] as const;

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
    await openPuzzle(page, 0);
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

test.describe('여러 종류의 퍼즐', () => {
  test('두 수 메이트: 첫 수 뒤 상대가 자동으로 응수하고 두 번째 수로 끝난다', async ({ page }) => {
    const index = PUZZLES.findIndex((p) => p.theme === 'mate2' && p.line.every((m) => m.length === 4));
    expect(index).toBeGreaterThan(0);
    const puzzle = PUZZLES[index]!;
    await openPuzzle(page, index);
    await expect(status(page)).toContainText('두 수로 체크메이트');
    const [f1, t1] = uciSquares(puzzle.line[0]!);
    await move(page, f1, t1);
    await expect(status(page)).toContainText('좋아요');
    await expect(status(page)).toContainText('두 수로 체크메이트', { timeout: 5000 });
    const [f2, t2] = uciSquares(puzzle.line[2]!);
    await move(page, f2, t2);
    await expect(page.locator('.js-banner h2')).toHaveText('체크메이트! 정답이에요 🎉');
  });

  test('흑이 푸는 문제는 판이 뒤집혀 검은 말이 아래에 온다', async ({ page }) => {
    const index = PUZZLES.findIndex((p) => p.side === 'b' && p.theme === 'mate1' && p.line[0]!.length === 4);
    expect(index).toBeGreaterThan(0);
    const puzzle = PUZZLES[index]!;
    await openPuzzle(page, index);
    await expect(status(page)).toContainText('검은색 차례예요');
    await expect(page.locator('.board .square').first()).toHaveAttribute('data-sq', '7');
    const [f, t] = uciSquares(puzzle.line[0]!);
    await move(page, f, t);
    await expect(page.locator('.js-banner h2')).toHaveText('체크메이트! 정답이에요 🎉');
  });

  test('전술 문제에서 정답이 아닌 수는 되돌리고, 종류 필터가 목록을 바꾼다', async ({ page }) => {
    await openPuzzle(page, 0);
    await page.getByRole('button', { name: '포크', exact: true }).click();
    await page.waitForTimeout(200);
    await expect(status(page)).toContainText('가장 좋은 수');
    await expect(page.locator('.panel h2').nth(1)).toContainText('문제 1 /');
    const forks = PUZZLES.filter((p) => p.theme === 'fork');
    await expect(page.locator('.panel h2').nth(1)).toContainText(`/ ${forks.length}`);
    // 정답 보여주기 → 힌트 표시
    await page.getByRole('button', { name: /정답 보여주기/ }).click();
    await expect(page.locator('.board .square.hint-to')).toHaveCount(1);
  });

  test('마지막으로 보던 퍼즐을 기억한다', async ({ page }) => {
    await openPuzzle(page, 12);
    await expect(page.locator('.panel h2').first()).toContainText('13.');
  });
});
