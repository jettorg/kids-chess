import { defineConfig, type Plugin } from 'vitest/config';

/** 캐시 이름용 짧은 해시 (FNV-1a). Node 타입 없이도 동작한다. */
function shortHash(text: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}

/** public/ 에 있어서 번들 목록에 잡히지 않는, 오프라인에도 필요한 파일들 */
const STATIC_PRECACHE = [
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/icon-180.png',
];

/**
 * 빌드 결과물 목록으로 Service Worker(sw.js) 를 만든다.
 * 자산 파일명에 해시가 붙으므로 캐시 이름도 목록의 해시로 정해, 새 빌드마다
 * 이전 캐시가 자동으로 정리된다.
 */
function serviceWorkerPlugin(): Plugin {
  return {
    name: 'kids-chess-service-worker',
    apply: 'build',
    generateBundle(_options, bundle) {
      const built = Object.keys(bundle)
        .filter((file) => !file.endsWith('.map'))
        .map((file) => `./${file}`);
      const precache = ['./', ...built, ...STATIC_PRECACHE];
      const version = shortHash(precache.join('\n'));
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: serviceWorkerSource(precache, version) });
    },
  };
}

function serviceWorkerSource(precache: string[], version: string): string {
  return `// 자동 생성 파일 — vite.config.ts 의 serviceWorkerPlugin 이 만든다.
const CACHE = 'kids-chess-${version}';
const PRECACHE = ${JSON.stringify(precache)};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('kids-chess-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // 페이지 요청: 네트워크 우선, 끊겨 있으면 담아 둔 페이지
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put('./', copy));
          return response;
        })
        .catch(() => caches.match('./', { ignoreVary: true })),
    );
    return;
  }

  // 자산 요청: 캐시 우선 (파일명에 해시가 있어 오래된 캐시를 줄 일이 없다)
  // ignoreVary: 서버가 Vary: Origin 을 붙이면 페이지의 모듈 요청(Origin 헤더 있음)이
  // 미리 담아둔 항목(Origin 없음)과 매칭되지 않아 오프라인에서 실패한다.
  event.respondWith(
    caches.match(request, { ignoreVary: true }).then(
      (hit) =>
        hit ||
        fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        }),
    ),
  );
});
`;
}

export default defineConfig({
  base: './',
  plugins: [serviceWorkerPlugin()],
  build: { outDir: 'dist', target: 'es2022' },
  test: { environment: 'node', include: ['tests/**/*.test.ts'] },
});
