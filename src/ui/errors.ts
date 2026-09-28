/**
 * 화면에서 난 오류를 기억해 두었다가 진단 정보에 보여준다.
 * 어디로도 보내지 않는다. 사용자가 직접 복사해 신고할 때만 쓰인다.
 */

const KEY = 'kids-chess.errors.v1';
const LIMIT = 5;

export interface CapturedError {
  time: string;
  message: string;
}

let captured: CapturedError[] = [];

function persist(): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(captured));
  } catch {
    // 저장이 막혀 있어도 메모리에는 남는다.
  }
}

export function recordError(message: string): void {
  captured = [...captured.slice(-(LIMIT - 1)), { time: new Date().toISOString(), message: message.slice(0, 300) }];
  persist();
}

export function recentErrors(): CapturedError[] {
  return captured;
}

export function installErrorCapture(): void {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) captured = (JSON.parse(raw) as CapturedError[]).slice(-LIMIT);
  } catch {
    captured = [];
  }
  window.addEventListener('error', (event) => recordError(`${event.message} @ ${event.filename?.split('/').pop() ?? '?'}:${event.lineno}`));
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason instanceof Error ? event.reason.message : String(event.reason);
    recordError(`unhandled: ${reason}`);
  });
}
