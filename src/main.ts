import './style.css';
import { App } from './ui/app';

const root = document.getElementById('root');
const app = root ? new App(root) : null;

// 오프라인 실행: 빌드 때 만들어지는 sw.js 가 페이지와 자산을 미리 담아 둔다.
// 개발 서버에서는 캐시가 헷갈리게 하므로 프로덕션에서만 등록한다.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js');
      watchForUpdates(registration);
    } catch {
      // 등록에 실패해도 온라인에서는 그대로 동작한다.
    }
  });
}

/** 새 서비스 워커가 설치되면 "새 버전" 안내를 띄운다. 화면이 다시 보일 때와 30분마다 확인한다. */
function watchForUpdates(registration: ServiceWorkerRegistration): void {
  const announce = (worker: ServiceWorker) => {
    worker.addEventListener('statechange', () => {
      // 처음 설치(controller 없음)는 새 버전이 아니다.
      if (worker.state === 'installed' && navigator.serviceWorker.controller) app?.notifyUpdate();
    });
  };
  if (registration.waiting && navigator.serviceWorker.controller) app?.notifyUpdate();
  registration.addEventListener('updatefound', () => {
    if (registration.installing) announce(registration.installing);
  });
  const check = () => void registration.update().catch(() => undefined);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') check();
  });
  setInterval(check, 30 * 60 * 1000);
}
