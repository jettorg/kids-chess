/**
 * 앱 아이콘과 공유용 이미지를 만든다. 말 그림은 src/ui/pieces.ts 의 나이트와 같다.
 *   node scripts/make-icons.mjs
 * 결과: public/icons/icon-192.png, icon-512.png, icon-maskable-512.png, icon-180.png, og-1200x630.png
 */
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const KNIGHT =
  '<path d="M33 84c0-20 5-30 17-38-7 1-14 6-19 4-5-2-3-9 2-14 7-7 15-11 22-13l3-7c13 6 20 19 21 34 1 14-2 22-4 27-1 4-1 7-1 11z"/>' +
  '<circle cx="58" cy="31" r="3.4" class="detail"/>' +
  '<path d="M23 84h54a3 3 0 0 1 3 3v5a2 2 0 0 1-2 2H22a2 2 0 0 1-2-2v-5a3 3 0 0 1 3-3z"/>';

const STYLE = `
  body { margin: 0; background: transparent; }
  .icon { position: relative; display: grid; place-items: center; background: #fdf6ec; overflow: hidden; }
  .icon.round { border-radius: 22%; }
  .icon::before { content: ''; position: absolute; inset: -40%; background: radial-gradient(circle at 30% 20%, #f6e7d2, #fdf6ec 60%); }
  svg { position: relative; }
  svg * { fill: #fffdf7; stroke: #4a3526; stroke-width: 3.4; stroke-linejoin: round; stroke-linecap: round; paint-order: stroke fill; }
  svg .detail { fill: #4a3526; stroke: none; }
  .og { width: 1200px; height: 630px; display: flex; align-items: center; gap: 48px; padding: 0 96px; box-sizing: border-box;
        background: radial-gradient(circle at 20% -10%, #f6e7d2, #fdf6ec 60%); font-family: -apple-system, 'Apple SD Gothic Neo', system-ui, sans-serif; color: #3c2a1e; }
  .og h1 { font-size: 92px; margin: 0 0 12px; letter-spacing: -2px; }
  .og p { font-size: 40px; margin: 0; color: #7a6152; }
`;

function iconHtml(size, { round, scale }) {
  const svgSize = Math.round(size * scale);
  return `<style>${STYLE}</style><div class="icon ${round ? 'round' : ''}" style="width:${size}px;height:${size}px">
    <svg viewBox="0 0 100 100" width="${svgSize}" height="${svgSize}">${KNIGHT}</svg></div>`;
}

function ogHtml() {
  return `<style>${STYLE}</style><div class="og">
    <svg viewBox="0 0 100 100" width="360" height="360">${KNIGHT}</svg>
    <div><h1>우리 체스</h1><p>아이와 함께 두는 체스 · Chess to play with your child</p></div></div>`;
}

await mkdir('public/icons', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });

const jobs = [
  ['icon-192.png', 192, iconHtml(192, { round: true, scale: 0.8 })],
  ['icon-512.png', 512, iconHtml(512, { round: true, scale: 0.8 })],
  ['icon-180.png', 180, iconHtml(180, { round: false, scale: 0.8 })],
  // maskable: 플랫폼이 가장자리를 잘라내므로 말을 안쪽 안전 영역에 작게 둔다
  ['icon-maskable-512.png', 512, iconHtml(512, { round: false, scale: 0.6 })],
];
for (const [name, size, html] of jobs) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(html);
  await page.screenshot({ path: `public/icons/${name}`, omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
  console.log('made', name);
}
await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(ogHtml());
await page.screenshot({ path: 'public/icons/og-1200x630.png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
console.log('made og-1200x630.png');
await browser.close();
