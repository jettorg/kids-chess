import { getLocale, t } from '../i18n';
import { trapFocus } from './focus';
import { recentErrors } from './errors';
import { decodeProgress, encodeProgress, mergeProgress } from './transfer';
import type { Progress } from './storage';

declare const __APP_VERSION__: string;
declare const __BUILD_ID__: string;

export const ISSUE_URL = 'https://github.com/jettorg/kids-chess/issues/new';

export interface HelpHost {
  readonly progress: Progress;
  applyProgress(progress: Progress): void;
}

/** 진단 정보 문자열 (개인정보 없음: 브라우저·화면·버전·최근 오류) */
export async function diagnostics(): Promise<string> {
  let sw = 'none';
  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      sw = reg?.active ? 'active' : reg ? 'registered' : 'none';
    }
  } catch {
    sw = 'unavailable';
  }
  let storage = 'ok';
  try {
    localStorage.setItem('kids-chess.probe', '1');
    localStorage.removeItem('kids-chess.probe');
  } catch {
    storage = 'blocked';
  }
  const lines = [
    `app: ${__APP_VERSION__} (${__BUILD_ID__})`,
    `locale: ${getLocale()} / ${navigator.language}`,
    `screen: ${window.innerWidth}x${window.innerHeight} @${window.devicePixelRatio}`,
    `standalone: ${matchMedia('(display-mode: standalone)').matches}`,
    `serviceWorker: ${sw}`,
    `storage: ${storage}`,
    `ua: ${navigator.userAgent}`,
  ];
  const errors = recentErrors();
  if (errors.length) {
    lines.push('recent errors:');
    for (const e of errors) lines.push(`  ${e.time} ${e.message}`);
  }
  return lines.join('\n');
}

export function showHelpDialog(host: HTMLElement, app: HelpHost): void {
  host.classList.remove('hidden');
  host.innerHTML = `
    <div class="card help-card" role="dialog" aria-modal="true" aria-labelledby="help-title">
      <button type="button" class="close-btn js-close" aria-label="${t('close')}">✕</button>
      <h2 id="help-title">${t('helpTitle')}</h2>

      <section>
        <h3>${t('transferTitle')}</h3>
        <p class="muted">${t('transferLead')}</p>
        <div class="code-row">
          <code class="code-box js-export-code"></code>
          <button type="button" class="chip js-copy">${t('copy')}</button>
        </div>
        <label class="field">
          <span>${t('importLabel')}</span>
          <textarea class="js-import" rows="2" placeholder="KC1.…"></textarea>
        </label>
        <div class="choice-row">
          <button type="button" class="chip js-import-btn">${t('importButton')}</button>
          <span class="muted js-import-result" role="status"></span>
        </div>
      </section>

      <section>
        <h3>${t('diagTitle')}</h3>
        <p class="muted">${t('diagLead')}</p>
        <pre class="diag js-diag">…</pre>
        <div class="choice-row">
          <button type="button" class="chip js-copy-diag">${t('copyDiag')}</button>
          <a class="chip link js-issue" target="_blank" rel="noopener">${t('reportIssue')}</a>
        </div>
      </section>
    </div>
  `;

  const card = host.firstElementChild as HTMLElement;
  const trap = trapFocus(card);
  const close = () => {
    host.classList.add('hidden');
    host.innerHTML = '';
    trap.release();
    document.removeEventListener('keydown', onKeydown, true);
  };
  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  };
  document.addEventListener('keydown', onKeydown, true);
  host.querySelector('.js-close')!.addEventListener('click', close);
  host.addEventListener('pointerdown', (event) => {
    if (event.target === host) close();
  });

  const code = encodeProgress(app.progress);
  host.querySelector('.js-export-code')!.textContent = code;
  host.querySelector('.js-copy')!.addEventListener('click', async () => {
    await copyText(code);
    (host.querySelector('.js-copy') as HTMLButtonElement).textContent = t('copied');
  });

  const importResult = host.querySelector<HTMLElement>('.js-import-result')!;
  host.querySelector('.js-import-btn')!.addEventListener('click', () => {
    const text = (host.querySelector('.js-import') as HTMLTextAreaElement).value;
    const incoming = decodeProgress(text);
    if (!incoming) {
      importResult.textContent = t('importInvalid');
      return;
    }
    app.applyProgress(mergeProgress(app.progress, incoming));
    importResult.textContent = t('importDone', incoming.puzzles.length, incoming.lessons.length);
    host.querySelector('.js-export-code')!.textContent = encodeProgress(app.progress);
  });

  const diag = host.querySelector<HTMLElement>('.js-diag')!;
  const issue = host.querySelector<HTMLAnchorElement>('.js-issue')!;
  void diagnostics().then((text) => {
    diag.textContent = text;
    const body = `\n\n---\n${text}`;
    issue.href = `${ISSUE_URL}?title=${encodeURIComponent('[버그] ')}&body=${encodeURIComponent(body)}`;
  });
  host.querySelector('.js-copy-diag')!.addEventListener('click', async () => {
    await copyText(diag.textContent ?? '');
    (host.querySelector('.js-copy-diag') as HTMLButtonElement).textContent = t('copied');
  });
}

async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // 클립보드가 막힌 환경: 사용자가 직접 드래그해 복사할 수 있도록 그대로 둔다.
  }
}
