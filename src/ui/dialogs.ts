import type { Color, PieceType } from '../engine/types';
import { t } from '../i18n';
import { pieceSvg } from './pieces';
import { celebrate } from './confetti';

export interface BannerAction {
  label: string;
  action: () => void;
}

/** 결과 창 (체크메이트, 레슨 완료, 퍼즐 정답 …) */
export class Banner {
  constructor(private host: HTMLElement, private partyHost: HTMLElement) {
    // 배경을 눌러도, Esc 를 눌러도 닫힌다 (아이가 갇히지 않도록).
    host.addEventListener('pointerdown', (event) => {
      if (event.target === host) this.hide();
    });
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') this.hide();
    });
  }

  show(title: string, detail: string, actions: BannerAction[], party = false): void {
    this.host.classList.remove('hidden');
    this.host.innerHTML = `
      <div class="card banner-card">
        <button type="button" class="close-btn js-close" aria-label="${t('close')}">✕</button>
        <h2>${title}</h2>
        <p>${detail}</p>
        <div class="banner-actions"></div>
      </div>
    `;
    this.host.querySelector('.js-close')!.addEventListener('click', () => this.hide());
    const actionHost = this.host.querySelector('.banner-actions')!;
    for (const item of actions) {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'primary';
      el.textContent = item.label;
      el.addEventListener('click', () => {
        this.hide();
        item.action();
      });
      actionHost.appendChild(el);
    }
    if (party) celebrate(this.partyHost);
  }

  hide(): void {
    this.host.classList.add('hidden');
    this.host.innerHTML = '';
  }
}

/** 폰 승격 선택 창. 고르면 onChoose 가 불린다. */
export function showPromotionDialog(host: HTMLElement, color: Color, onChoose: (type: PieceType) => void): void {
  const choices: PieceType[] = ['q', 'r', 'b', 'n'];
  host.classList.remove('hidden');
  host.innerHTML = `
    <div class="card promo-card">
      <h2>${t('promoTitle')}</h2>
      <p>${t('promoText')}</p>
      <div class="promo-choices">
        ${choices
          .map(
            (type) => `
          <button type="button" data-promo="${type}">
            ${pieceSvg({ type, color })}
            <span>${t('piece', type)}</span>
          </button>`,
          )
          .join('')}
      </div>
    </div>
  `;
  host.querySelectorAll<HTMLButtonElement>('button[data-promo]').forEach((el) => {
    el.addEventListener('click', () => {
      host.classList.add('hidden');
      host.innerHTML = '';
      onChoose(el.dataset.promo as PieceType);
    });
  });
}
