import { expect, test } from '@playwright/test';
import { preview, type PreviewServer } from 'vite';
import { fresh, move, notation } from './helpers';

/** 미리보기 서버를 확실히 내린다 (열린 연결까지 끊음). */
async function stop(server: PreviewServer): Promise<void> {
  server.httpServer.closeAllConnections?.();
  await new Promise<void>((resolve) => server.httpServer.close(() => resolve()));
}

test.describe('PWA 와 오프라인', () => {
  test('매니페스트, 아이콘, 서비스 워커가 제공된다', async ({ page, request }) => {
    await fresh(page);
    const manifest = await request.get('/manifest.webmanifest');
    expect(manifest.status()).toBe(200);
    const json = await manifest.json();
    expect(json.icons.length).toBeGreaterThanOrEqual(3);
    for (const icon of json.icons) expect((await request.get('/' + icon.src)).status(), icon.src).toBe(200);
    expect((await request.get('/sw.js')).status()).toBe(200);
    expect((await request.get('/icons/og-1200x630.png')).status()).toBe(200);
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
  });

  // Playwright 의 setOffline 은 서비스 워커의 요청까지 막지 못하므로,
  // 전용 서버를 띄웠다가 실제로 내려서 진짜 오프라인 상황을 만든다.
  test('한 번 연 뒤에는 서버가 없어도 열리고 컴퓨터와 둘 수 있다', async ({ browser }) => {
    const server = await preview({ preview: { port: 4174, strictPort: true }, logLevel: 'silent' });
    const context = await browser.newContext({ locale: 'ko-KR' });
    const page = await context.newPage();
    try {
      await page.goto('http://localhost:4174/');
      await page.waitForSelector('.board .square');
      await page.evaluate(() => navigator.serviceWorker.ready);
      await page.waitForFunction(async () => {
        const keys = await caches.keys();
        if (keys.length === 0) return false;
        const cache = await caches.open(keys[0]!);
        return (await cache.keys()).length >= 8;
      }, null, { timeout: 15_000 });

      // keep-alive 연결이 남아 있으면 close() 가 끝나지 않으므로 연결을 먼저 끊는다.
      await stop(server);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForSelector('.board .square');
      await expect(page.locator('.board .piece')).toHaveCount(32);
      await page.getByRole('button', { name: /병아리/ }).click();
      await move(page, 'e2', 'e4');
      await expect(notation(page)).toHaveText(/^1\. e4 \S+$/);
      // 주소를 직접 쳐서 들어와도 열린다
      await page.goto('http://localhost:4174/?direct=1', { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('.board .square');
    } finally {
      await context.close();
      await stop(server).catch(() => undefined);
    }
  });
});
