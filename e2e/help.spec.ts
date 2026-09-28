import { expect, test } from '@playwright/test';
import { fresh, move } from './helpers';

test.describe('기록 옮기기와 진단', () => {
  test('내보낸 코드를 다른 기기(새 컨텍스트)에서 가져오면 기록이 합쳐진다', async ({ page, browser }) => {
    await fresh(page);
    // 레슨 하나를 끝내 기록을 만든다
    await page.getByRole('button', { name: '배우기' }).click();
    for (const [f, t] of [['b2', 'c3'], ['e2', 'f3'], ['g2', 'h3']] as const) await move(page, f, t);
    await expect(page.locator('.js-banner h2')).toHaveText('다 잡았어요! 🎉');
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: '도움과 설정' }).click();
    await expect(page.locator('.help-card[role="dialog"]')).toBeVisible();
    const code = (await page.locator('.js-export-code').textContent())!.trim();
    expect(code).toMatch(/^KC1\./);
    await expect(page.locator('.js-diag')).toContainText('app: 0.2.0');
    await expect(page.locator('.js-issue')).toHaveAttribute('href', /github\.com\/jettorg\/kids-chess\/issues\/new/);

    // 다른 기기
    const other = await browser.newContext({ locale: 'ko-KR' });
    const page2 = await other.newPage();
    await fresh(page2);
    await page2.getByRole('button', { name: '도움과 설정' }).click();
    await page2.locator('.js-import').fill(code);
    await page2.locator('.js-import-btn').click();
    await expect(page2.locator('.js-import-result')).toContainText('레슨 1개');
    await page2.keyboard.press('Escape');
    await page2.getByRole('button', { name: '배우기' }).click();
    await expect(page2.locator('.js-lesson-list button').first()).toContainText('✅');
    await other.close();
  });

  test('잘못된 코드는 거부하고, Esc 와 초점 가두기가 동작한다', async ({ page }) => {
    await fresh(page);
    await page.getByRole('button', { name: '도움과 설정' }).click();
    await page.locator('.js-import').fill('hello');
    await page.locator('.js-import-btn').click();
    await expect(page.locator('.js-import-result')).toContainText('올바르지 않아요');
    for (let i = 0; i < 8; i++) await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.querySelector('.js-help-overlay')!.contains(document.activeElement))).toBe(true);
    await page.keyboard.press('Escape');
    await expect(page.locator('.js-help-overlay')).toHaveClass(/hidden/);
  });
});
