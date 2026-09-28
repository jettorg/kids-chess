/**
 * 대화상자 초점 관리. 창이 열리면 초점을 안으로 옮기고, Tab 이 창 밖으로
 * 나가지 않게 하며, 닫히면 원래 자리로 되돌린다.
 */

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

export interface FocusTrap {
  release(): void;
}

export function trapFocus(container: HTMLElement, initial?: HTMLElement | null): FocusTrap {
  const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const focusables = () => Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));

  // Tab 이동을 브라우저에 맡기지 않고 직접 한다. 사파리는 기본 설정에서 Tab 으로 버튼을
  // 건너뛰므로, 맡기면 초점이 창 밖으로 새어 나간다.
  const onKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;
    const items = focusables();
    if (items.length === 0) return;
    event.preventDefault();
    const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const index = active ? items.indexOf(active) : -1;
    const step = event.shiftKey ? -1 : 1;
    const next = index < 0 ? (event.shiftKey ? items.length - 1 : 0) : (index + step + items.length) % items.length;
    items[next]!.focus();
  };

  document.addEventListener('keydown', onKeydown, true);
  // 클릭으로 열린 경우 브라우저가 mousedown 기본 동작으로 눌린 요소에 초점을 주는데,
  // 그 동작은 이벤트 핸들러 뒤에 일어나므로 한 틱 뒤에 창 안으로 초점을 옮긴다.
  let released = false;
  setTimeout(() => {
    if (!released) (initial ?? focusables()[0])?.focus();
  }, 0);

  return {
    release() {
      released = true;
      document.removeEventListener('keydown', onKeydown, true);
      previous?.focus();
    },
  };
}

/** 사용자가 움직임을 줄여 달라고 했는가 (OS 접근성 설정) */
export function prefersReducedMotion(): boolean {
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}
