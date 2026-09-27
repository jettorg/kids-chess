import './style.css';
import { App } from './ui/app';

const root = document.getElementById('root');
if (root) new App(root);

// 오프라인 실행: 빌드 때 만들어지는 sw.js 가 페이지와 자산을 미리 담아 둔다.
// 개발 서버에서는 캐시가 헷갈리게 하므로 프로덕션에서만 등록한다.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // 등록에 실패해도 온라인에서는 그대로 동작한다.
    });
  });
}
