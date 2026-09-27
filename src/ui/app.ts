import type { Color, Move, PieceType, Square } from '../engine/types';
import { Game, findKing, fromAlgebraic, initialPosition, parseFen } from '../engine';
import { AI_LEVELS, chooseMove, suggestMove, type AiLevel } from '../ai/ai';
import { LESSONS, PIECE_GUIDE, RULES } from '../data/lessons';
import { PUZZLES } from '../data/puzzles';
import { L, LOCALES, getLocale, setLocale, t, type Locale } from '../i18n';
import { BoardView } from './board';
import { pieceIcon, pieceSvg } from './pieces';
import { celebrate } from './confetti';
import { isSoundEnabled, play, setSoundEnabled } from './sound';

type Screen = 'play' | 'learn' | 'puzzle' | 'guide';
type Opponent = 'human' | AiLevel;

interface Settings {
  sound: boolean;
  coords: boolean;
  opponent: Opponent;
  playerColor: Color;
  flipped: boolean;
}

interface Progress {
  lessons: string[];
  puzzles: string[];
}

const SETTINGS_KEY = 'kids-chess.settings.v1';
const PROGRESS_KEY = 'kids-chess.progress.v1';
const SAVE_KEY = 'kids-chess.game.v1';

const DEFAULT_SETTINGS: Settings = {
  sound: true,
  coords: true,
  opponent: 1,
  playerColor: 'w',
  flipped: false,
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...(JSON.parse(raw) as T) };
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 저장이 막혀 있어도 게임은 계속된다.
  }
}

export class App {
  private settings: Settings;
  private progress: Progress;
  private screen: Screen = 'play';

  private game: Game = new Game();
  private board: BoardView;
  private selected: Square | null = null;
  private hint: Move | null = null;
  private thinking = false;
  private pendingPromotion: { from: Square; to: Square } | null = null;

  /** 대국 화면의 설정 카드를 펼쳐 둘지 (첫 수를 두면 접힌다) */
  private settingsOpen = true;

  private lessonIndex = 0;
  private puzzleIndex = 0;
  private puzzleSolved = false;
  /** 상태 줄에 잠시 보여줄 안내 (사전 키로 저장해 언어를 바꿔도 맞게 보이도록) */
  private message: 'learnStuck' | 'puzzleWrong' | null = null;

  private el: {
    app: HTMLElement;
    brand: HTMLElement;
    tabs: HTMLElement;
    lang: HTMLElement;
    soundBtn: HTMLButtonElement;
    stage: HTMLElement;
    boardHost: HTMLElement;
    status: HTMLElement;
    trayTop: HTMLElement;
    trayBottom: HTMLElement;
    panel: HTMLElement;
    guide: HTMLElement;
    promo: HTMLElement;
    banner: HTMLElement;
  };

  constructor(root: HTMLElement) {
    this.settings = load(SETTINGS_KEY, DEFAULT_SETTINGS);
    this.progress = load(PROGRESS_KEY, { lessons: [], puzzles: [] } as Progress);
    setSoundEnabled(this.settings.sound);

    root.innerHTML = `
      <div class="app" data-screen="play">
        <header class="topbar">
          <h1 class="brand js-brand"></h1>
          <nav class="tabs js-tabs">
            <button type="button" data-screen="play"></button>
            <button type="button" data-screen="learn"></button>
            <button type="button" data-screen="puzzle"></button>
            <button type="button" data-screen="guide"></button>
          </nav>
          <div class="lang-toggle js-lang" role="group">
            ${LOCALES.map(
              (l) =>
                `<button type="button" data-locale="${l.code}" aria-label="${l.label}">` +
                `<span class="lang-full">${l.label}</span><span class="lang-short" aria-hidden="true">${l.code.toUpperCase()}</span></button>`,
            ).join('')}
          </div>
          <button type="button" class="icon-btn js-sound">🔊</button>
        </header>
        <main class="layout">
          <section class="stage">
            <p class="status js-status" role="status"></p>
            <div class="tray js-tray-top"></div>
            <div class="board-host js-board"></div>
            <div class="tray js-tray-bottom"></div>
          </section>
          <aside class="panel js-panel"></aside>
          <section class="guide js-guide"></section>
        </main>
        <div class="overlay js-promo hidden"></div>
        <div class="overlay js-banner hidden"></div>
      </div>
    `;

    const q = <T extends HTMLElement>(selector: string): T => root.querySelector<T>(selector)!;
    this.el = {
      app: q('.app'),
      brand: q('.js-brand'),
      tabs: q('.tabs'),
      lang: q('.js-lang'),
      soundBtn: q<HTMLButtonElement>('.js-sound'),
      stage: q('.stage'),
      boardHost: q('.js-board'),
      status: q('.js-status'),
      trayTop: q('.js-tray-top'),
      trayBottom: q('.js-tray-bottom'),
      panel: q('.js-panel'),
      guide: q('.js-guide'),
      promo: q('.js-promo'),
      banner: q('.js-banner'),
    };

    this.board = new BoardView(this.el.boardHost, {
      onPick: (sq) => this.pick(sq),
      onMoveAttempt: (from, to) => this.tryMove(from, to),
      onCancel: () => {
        this.selected = null;
        this.render();
      },
    });

    this.bindChrome();
    this.bindBannerDismiss();
    this.restoreGame();
    this.renderChrome();
    this.renderGuide();
    this.render();
  }

  // ───────────────────────── 화면 전환과 상단 바 ─────────────────────────

  private bindChrome(): void {
    this.el.tabs.addEventListener('click', (event) => {
      const button = (event.target as HTMLElement).closest<HTMLElement>('button[data-screen]');
      if (!button) return;
      this.setScreen(button.dataset.screen as Screen);
    });

    this.el.lang.addEventListener('click', (event) => {
      const button = (event.target as HTMLElement).closest<HTMLElement>('button[data-locale]');
      if (!button) return;
      const locale = button.dataset.locale as Locale;
      if (locale === getLocale()) return;
      setLocale(locale);
      this.hideBanner();
      this.renderChrome();
      this.renderGuide();
      this.render();
    });

    this.el.soundBtn.addEventListener('click', () => {
      this.settings.sound = !this.settings.sound;
      setSoundEnabled(this.settings.sound);
      save(SETTINGS_KEY, this.settings);
      if (this.settings.sound) play('star');
      this.render();
    });
  }

  /** 언어에 따라 달라지는 상단 바 문구들 */
  private renderChrome(): void {
    document.title = t('appTitle');
    document.documentElement.lang = getLocale();
    this.el.brand.textContent = t('brand');
    const tabLabels: Record<Screen, string> = {
      play: t('tabPlay'),
      learn: t('tabLearn'),
      puzzle: t('tabPuzzle'),
      guide: t('tabGuide'),
    };
    this.el.tabs.querySelectorAll<HTMLElement>('button[data-screen]').forEach((button) => {
      button.textContent = tabLabels[button.dataset.screen as Screen];
    });
    this.el.tabs.setAttribute('aria-label', t('navLabel'));
    this.el.lang.setAttribute('aria-label', t('languageLabel'));
    this.el.lang.querySelectorAll<HTMLElement>('button[data-locale]').forEach((button) => {
      const active = button.dataset.locale === getLocale();
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    this.el.soundBtn.setAttribute('aria-label', t('soundToggle'));
    this.board.setLabel(t('boardLabel'));
  }

  private setScreen(screen: Screen): void {
    if (this.screen === screen) return;
    this.screen = screen;
    this.selected = null;
    this.hint = null;
    this.message = null;
    this.hideBanner();
    if (screen === 'learn') this.startLesson(this.lessonIndex);
    else if (screen === 'puzzle') this.startPuzzle(this.puzzleIndex);
    else if (screen === 'play') this.restoreGame();
    this.render();
  }

  // ───────────────────────── 게임 생성 ─────────────────────────

  private restoreGame(): void {
    const saved = load<{ start?: string; moves?: { from: number; to: number; promotion?: PieceType }[] }>(
      SAVE_KEY,
      {},
    );
    this.game = new Game(initialPosition());
    if (saved.start && saved.moves) {
      try {
        const restored = new Game(parseFen(saved.start));
        for (const m of saved.moves) {
          if (!restored.move(m.from, m.to, m.promotion)) throw new Error('saved move is illegal');
        }
        this.game = restored;
      } catch {
        this.game = new Game(initialPosition());
      }
    }
    this.selected = null;
    this.hint = null;
    this.maybeAiMove();
  }

  private newGame(): void {
    this.game = new Game(initialPosition());
    this.selected = null;
    this.hint = null;
    this.message = null;
    this.hideBanner();
    this.persistGame();
    this.render();
    this.maybeAiMove();
  }

  private persistGame(): void {
    if (this.screen !== 'play') return;
    save(SAVE_KEY, this.game.serialize());
  }

  private startLesson(index: number): void {
    this.lessonIndex = Math.max(0, Math.min(index, LESSONS.length - 1));
    const lesson = LESSONS[this.lessonIndex]!;
    this.game = new Game(parseFen(lesson.fen), { singleSide: 'w' });
    this.selected = null;
    this.hint = null;
    this.message = null;
    this.hideBanner();
    this.render();
  }

  private startPuzzle(index: number): void {
    this.puzzleIndex = Math.max(0, Math.min(index, PUZZLES.length - 1));
    const puzzle = PUZZLES[this.puzzleIndex]!;
    this.game = new Game(parseFen(puzzle.fen));
    this.selected = null;
    this.hint = null;
    this.puzzleSolved = false;
    this.message = null;
    this.hideBanner();
    this.render();
  }

  // ───────────────────────── 조작 ─────────────────────────

  /** 지금 아이(또는 사람)가 만질 수 있는 색 */
  private interactiveColor(): Color | null {
    if (this.thinking || this.pendingPromotion) return null;
    if (this.screen === 'guide') return null;
    if (this.screen === 'learn') return 'w';
    if (this.screen === 'puzzle') return this.puzzleSolved ? null : 'w';
    if (this.game.status().kind !== 'playing') return null;
    if (this.settings.opponent === 'human') return this.game.turn;
    return this.game.turn === this.settings.playerColor ? this.game.turn : null;
  }

  private pick(sq: Square): void {
    if (this.selected === sq) {
      this.selected = null;
    } else {
      this.selected = sq;
      this.hint = null;
    }
    this.render();
  }

  private tryMove(from: Square, to: Square): void {
    if (this.interactiveColor() === null) return;
    const options = this.game.legalMoves(from).filter((m) => m.to === to);
    if (options.length === 0) {
      const piece = this.game.position.board[from];
      if (piece) {
        play('nope');
        this.board.shake(to);
      }
      this.selected = null;
      this.render();
      return;
    }

    if (options.length > 1 && options.every((m) => m.promotion)) {
      this.pendingPromotion = { from, to };
      this.selected = null;
      this.render();
      this.showPromotionDialog();
      return;
    }

    this.commitMove(options[0]!);
  }

  private commitMove(move: Move): void {
    this.game.playMove(move);
    if (this.screen === 'play') this.settingsOpen = false;
    this.selected = null;
    this.hint = null;
    this.message = null;

    if (move.castle) play('castle');
    else if (move.captured) play(this.screen === 'learn' ? 'star' : 'capture');
    else play('move');

    this.render();
    this.afterMove();
  }

  private afterMove(): void {
    if (this.screen === 'learn') {
      this.checkLessonDone();
      return;
    }
    if (this.screen === 'puzzle') {
      this.checkPuzzleAnswer();
      return;
    }

    this.persistGame();
    const status = this.game.status();
    if (status.kind === 'playing') {
      if (status.check) play('check');
      this.maybeAiMove();
      return;
    }
    this.announceEnd();
  }

  private maybeAiMove(): void {
    if (this.screen !== 'play') return;
    if (this.settings.opponent === 'human') return;
    if (this.game.status().kind !== 'playing') return;
    if (this.game.turn === this.settings.playerColor) return;

    const level = this.settings.opponent;
    this.thinking = true;
    this.render();
    // 탐색이 화면을 멈추지 않도록 한 프레임 뒤에 실행한다.
    setTimeout(() => {
      const move = chooseMove(this.game.position, { level });
      this.thinking = false;
      if (!move) {
        this.render();
        return;
      }
      this.game.playMove(move);
      if (move.captured) play('capture');
      else play('move');
      this.persistGame();
      const status = this.game.status();
      this.render();
      if (status.kind === 'playing') {
        if (status.check) play('check');
      } else {
        this.announceEnd();
      }
    }, 320);
  }

  private undo(): void {
    if (this.screen === 'puzzle') {
      this.startPuzzle(this.puzzleIndex);
      return;
    }
    if (this.screen === 'learn') {
      this.game.undo();
      this.selected = null;
      this.hideBanner();
      this.render();
      return;
    }

    if (this.game.moveCount === 0) return;
    if (this.settings.opponent === 'human') {
      this.game.undo();
    } else {
      // 컴퓨터와 둘 때는 내 차례가 돌아올 때까지 되돌린다.
      while (this.game.undo()) {
        if (this.game.turn === this.settings.playerColor) break;
      }
    }
    this.selected = null;
    this.hint = null;
    this.message = null;
    this.hideBanner();
    this.persistGame();
    this.render();
    // 컴퓨터가 선인 첫 수까지 되돌렸다면 컴퓨터가 다시 시작한다.
    this.maybeAiMove();
  }

  private showHint(): void {
    if (this.interactiveColor() === null) return;
    const move = this.screen === 'puzzle' || this.screen === 'play'
      ? suggestMove(this.game.position)
      : this.game.legalMoves().find((m) => m.captured) ?? this.game.legalMoves()[0] ?? null;
    if (!move) return;
    this.hint = move;
    this.selected = null;
    play('star');
    this.render();
    setTimeout(() => {
      if (this.hint === move) {
        this.hint = null;
        this.render();
      }
    }, 4000);
  }

  // ───────────────────────── 승격 대화상자 ─────────────────────────

  private showPromotionDialog(): void {
    const color = this.game.turn;
    const choices: PieceType[] = ['q', 'r', 'b', 'n'];
    this.el.promo.classList.remove('hidden');
    this.el.promo.innerHTML = `
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
    this.el.promo.querySelectorAll<HTMLButtonElement>('button[data-promo]').forEach((button) => {
      button.addEventListener('click', () => {
        const promotion = button.dataset.promo as PieceType;
        const pending = this.pendingPromotion;
        this.pendingPromotion = null;
        this.el.promo.classList.add('hidden');
        this.el.promo.innerHTML = '';
        if (!pending) return;
        const move = this.game.legalMoves(pending.from).find(
          (m) => m.to === pending.to && m.promotion === promotion,
        );
        if (move) this.commitMove(move);
        else this.render();
      });
    });
  }

  // ───────────────────────── 결과 안내 ─────────────────────────

  private announceEnd(): void {
    const status = this.game.status();
    let title = '';
    let detail = '';
    let party = false;

    if (status.kind === 'checkmate') {
      const winnerIsPlayer =
        this.settings.opponent === 'human' || status.winner === this.settings.playerColor;
      title = winnerIsPlayer ? t('mateTitleWin') : t('mateTitle');
      detail = t('mateDetail', status.winner);
      party = true;
    } else if (status.kind === 'stalemate') {
      title = t('stalemateTitle');
      detail = t('stalemateDetail');
    } else if (status.kind === 'draw') {
      title = t('drawTitle');
      detail = t('drawDetail', status.reason);
    } else {
      return;
    }

    if (party) play('win');
    this.showBanner(title, detail, [{ label: t('playAgain'), action: () => this.newGame() }], party);
  }

  private showBanner(
    title: string,
    detail: string,
    actions: { label: string; action: () => void }[],
    party = false,
  ): void {
    this.el.banner.classList.remove('hidden');
    this.el.banner.innerHTML = `
      <div class="card banner-card">
        <button type="button" class="close-btn js-close" aria-label="${t('close')}">✕</button>
        <h2>${title}</h2>
        <p>${detail}</p>
        <div class="banner-actions"></div>
      </div>
    `;
    this.el.banner.querySelector('.js-close')!.addEventListener('click', () => this.hideBanner());
    const host = this.el.banner.querySelector('.banner-actions')!;
    for (const item of actions) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'primary';
      button.textContent = item.label;
      button.addEventListener('click', () => {
        this.hideBanner();
        item.action();
      });
      host.appendChild(button);
    }
    if (party) celebrate(this.el.app);
  }

  /** 배경을 눌러도 결과 창이 닫히게 한다 (아이가 갇히지 않도록). */
  private bindBannerDismiss(): void {
    this.el.banner.addEventListener('pointerdown', (event) => {
      if (event.target === this.el.banner) this.hideBanner();
    });
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') this.hideBanner();
    });
  }

  private hideBanner(): void {
    this.el.banner.classList.add('hidden');
    this.el.banner.innerHTML = '';
  }

  // ───────────────────────── 배우기 ─────────────────────────

  private remainingTargets(): Square[] {
    const out: Square[] = [];
    for (let sq = 0; sq < 64; sq++) {
      const piece = this.game.position.board[sq];
      if (piece && piece.color === 'b') out.push(sq);
    }
    return out;
  }

  private checkLessonDone(): void {
    const left = this.remainingTargets();
    if (left.length > 0) {
      if (this.game.legalMoves().length === 0) {
        this.message = 'learnStuck';
        this.render();
      }
      return;
    }
    const lesson = LESSONS[this.lessonIndex]!;
    if (!this.progress.lessons.includes(lesson.id)) {
      this.progress.lessons.push(lesson.id);
      save(PROGRESS_KEY, this.progress);
    }
    play('win');
    const isLast = this.lessonIndex >= LESSONS.length - 1;
    this.showBanner(
      t('lessonDoneTitle'),
      t('lessonDoneDetail', L(lesson.title)),
      isLast
        ? [{ label: t('goPuzzles'), action: () => this.setScreen('puzzle') }]
        : [
            { label: t('nextLesson'), action: () => this.startLesson(this.lessonIndex + 1) },
            { label: t('retry'), action: () => this.startLesson(this.lessonIndex) },
          ],
      true,
    );
    this.render();
  }

  // ───────────────────────── 퍼즐 ─────────────────────────

  private checkPuzzleAnswer(): void {
    const status = this.game.status();
    if (status.kind === 'checkmate') {
      this.puzzleSolved = true;
      const puzzle = PUZZLES[this.puzzleIndex]!;
      if (!this.progress.puzzles.includes(puzzle.id)) {
        this.progress.puzzles.push(puzzle.id);
        save(PROGRESS_KEY, this.progress);
      }
      play('win');
      const isLast = this.puzzleIndex >= PUZZLES.length - 1;
      this.showBanner(
        t('puzzleDoneTitle'),
        t('puzzleDoneDetail'),
        isLast
          ? [{ label: t('goPlay'), action: () => this.setScreen('play') }]
          : [{ label: t('nextPuzzle'), action: () => this.startPuzzle(this.puzzleIndex + 1) }],
        true,
      );
      this.render();
      return;
    }

    // 정답이 아니면 잠시 보여준 뒤 되돌린다.
    this.message = 'puzzleWrong';
    this.render();
    setTimeout(() => {
      if (this.screen !== 'puzzle' || this.puzzleSolved) return;
      this.game.undo();
      this.selected = null;
      this.render();
    }, 1100);
  }

  // ───────────────────────── 그리기 ─────────────────────────

  private statusText(): string {
    if (this.message) return t(this.message);
    if (this.screen === 'learn') {
      const lesson = LESSONS[this.lessonIndex]!;
      const left = this.remainingTargets().length;
      return left === 0 ? t('learnDoneStatus', L(lesson.title)) : t('learnStatus', lesson.piece, left);
    }
    if (this.screen === 'puzzle') {
      return this.puzzleSolved ? t('puzzleSolvedStatus') : t('puzzleStatus');
    }
    if (this.thinking) return t('thinking');

    const status = this.game.status();
    if (status.kind === 'checkmate') return t('checkmateStatus', status.winner);
    if (status.kind === 'stalemate') return t('stalemateStatus');
    if (status.kind === 'draw') return t('drawStatus');
    return status.check ? t('check', this.game.turn) : t('turn', this.game.turn);
  }

  private render(): void {
    this.el.app.dataset.screen = this.screen;
    this.el.tabs.querySelectorAll<HTMLElement>('button[data-screen]').forEach((button) => {
      const active = button.dataset.screen === this.screen;
      button.classList.toggle('active', active);
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    this.el.app.classList.toggle('with-coords', this.settings.coords);
    this.el.soundBtn.textContent = isSoundEnabled() ? '🔊' : '🔈';
    this.el.soundBtn.classList.toggle('muted', !isSoundEnabled());

    const status = this.game.status();
    const checkSquare =
      this.screen !== 'learn' &&
      (status.kind === 'checkmate' || (status.kind === 'playing' && status.check))
        ? findKing(this.game.position, this.game.turn)
        : null;

    this.board.render({
      position: this.game.position,
      flipped: this.settings.flipped,
      selected: this.selected,
      destinations: this.selected === null ? [] : this.game.legalMoves(this.selected),
      lastMove: this.game.lastMove,
      checkSquare,
      hint: this.hint,
      targets: this.screen === 'learn' ? this.remainingTargets() : [],
      interactiveColor: this.interactiveColor(),
      showCoords: this.settings.coords,
    });

    this.el.status.textContent = this.statusText();
    this.el.status.classList.toggle('alert', status.kind === 'playing' && status.check && this.screen === 'play');
    this.renderTrays();
    this.renderPanel();
  }

  private renderTrays(): void {
    if (this.screen !== 'play') {
      this.el.trayTop.innerHTML = '';
      this.el.trayBottom.innerHTML = '';
      return;
    }
    const { byWhite, byBlack } = this.game.captured();
    const bottomColor = this.settings.flipped ? 'b' : 'w';
    // 비어 있으면 빈 문자열 — CSS 의 .tray:empty 가 높이를 0 으로 만든다.
    const tray = (taken: PieceType[], color: Color) =>
      taken
        .slice()
        .sort()
        .map((type) => pieceSvg({ type, color }, 'tray-piece'))
        .join('');
    // 아래쪽 플레이어가 잡은 말을 아래 트레이에 보여준다.
    if (bottomColor === 'w') {
      this.el.trayTop.innerHTML = tray(byBlack, 'w');
      this.el.trayBottom.innerHTML = tray(byWhite, 'b');
    } else {
      this.el.trayTop.innerHTML = tray(byWhite, 'b');
      this.el.trayBottom.innerHTML = tray(byBlack, 'w');
    }
  }

  private renderPanel(): void {
    if (this.screen === 'guide') {
      this.el.panel.innerHTML = '';
      return;
    }
    if (this.screen === 'learn') {
      this.renderLearnPanel();
      return;
    }
    if (this.screen === 'puzzle') {
      this.renderPuzzlePanel();
      return;
    }
    this.renderPlayPanel();
  }

  private button(label: string, onClick: () => void, className = ''): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.textContent = label;
    button.addEventListener('click', onClick);
    return button;
  }

  /** 접힌 설정 카드에 보여줄 한 줄 요약 */
  private opponentSummary(): string {
    if (this.settings.opponent === 'human') return t('humanSummary');
    return t('aiSummary', t(`level${this.settings.opponent}`), this.settings.playerColor);
  }

  private renderPlayPanel(): void {
    const panel = this.el.panel;
    const settingsBody = this.settingsOpen
      ? '<div class="choice-row js-opponents"></div><div class="js-color-row"></div>'
      : `<p class="summary">${this.opponentSummary()}</p>`;
    panel.innerHTML = `
      <div class="card">
        <div class="card-head">
          <h2>${t('opponent')}</h2>
          <button type="button" class="ghost js-toggle-settings">${
            this.settingsOpen ? t('collapse') : t('change')
          }</button>
        </div>
        ${settingsBody}
      </div>
      <div class="card">
        <h2>${t('helpers')}</h2>
        <div class="choice-row js-controls"></div>
      </div>
      <div class="card">
        <h2>${t('notation')}</h2>
        <p class="notation js-notation"></p>
      </div>
    `;

    panel.querySelector<HTMLButtonElement>('.js-toggle-settings')!.addEventListener('click', () => {
      this.settingsOpen = !this.settingsOpen;
      this.renderPanel();
    });

    const opponents = panel.querySelector<HTMLElement>('.js-opponents');
    const makeOpponentButton = (value: Opponent, label: string, hint: string) => {
      if (!opponents) return;
      const button = this.button(label, () => {
        this.settings.opponent = value;
        save(SETTINGS_KEY, this.settings);
        this.newGame();
      }, this.settings.opponent === value ? 'chip active' : 'chip');
      button.title = hint;
      opponents.appendChild(button);
    };
    makeOpponentButton('human', t('human'), t('humanHint'));
    for (const level of AI_LEVELS) {
      makeOpponentButton(level, t(`level${level}`), t(`level${level}Hint`));
    }

    const colorRow = panel.querySelector<HTMLElement>('.js-color-row');
    if (colorRow && this.settings.opponent !== 'human') {
      colorRow.innerHTML = `<h3>${t('myColor')}</h3><div class="choice-row js-colors"></div>`;
      const colors = colorRow.querySelector<HTMLElement>('.js-colors')!;
      for (const color of ['w', 'b'] as Color[]) {
        colors.appendChild(
          this.button(
            color === 'w' ? t('whiteFirst') : t('blackSecond'),
            () => {
              this.settings.playerColor = color;
              this.settings.flipped = color === 'b';
              save(SETTINGS_KEY, this.settings);
              this.newGame();
            },
            this.settings.playerColor === color ? 'chip active' : 'chip',
          ),
        );
      }
      const p = document.createElement('p');
      p.className = 'muted';
      p.textContent = t(`level${this.settings.opponent}Hint`);
      colorRow.appendChild(p);
    }

    const controls = panel.querySelector<HTMLElement>('.js-controls')!;
    controls.appendChild(this.button(t('newGame'), () => this.newGame(), 'chip'));
    const undoButton = this.button(t('undo'), () => this.undo(), 'chip');
    undoButton.disabled = this.game.moveCount === 0 || this.thinking;
    controls.appendChild(undoButton);
    const hintButton = this.button(t('hint'), () => this.showHint(), 'chip');
    hintButton.disabled = this.interactiveColor() === null;
    controls.appendChild(hintButton);
    controls.appendChild(
      this.button(t('flip'), () => {
        this.settings.flipped = !this.settings.flipped;
        save(SETTINGS_KEY, this.settings);
        this.render();
      }, 'chip'),
    );
    controls.appendChild(
      this.button(
        this.settings.coords ? t('hideCoords') : t('showCoords'),
        () => {
          this.settings.coords = !this.settings.coords;
          save(SETTINGS_KEY, this.settings);
          this.render();
        },
        'chip',
      ),
    );

    const notation = panel.querySelector<HTMLElement>('.js-notation')!;
    notation.textContent = this.game.notation() || t('noMoves');
  }

  private renderLearnPanel(): void {
    const lesson = LESSONS[this.lessonIndex]!;
    const panel = this.el.panel;
    panel.innerHTML = `
      <div class="card">
        <h2>${L(lesson.title)}</h2>
        <p>${L(lesson.intro)}</p>
        <p class="muted">${L(lesson.tip)}</p>
        <div class="choice-row js-lesson-controls"></div>
      </div>
      <div class="card">
        <h2>${t('pickPiece')}</h2>
        <div class="choice-row js-lesson-list"></div>
      </div>
    `;

    const controls = panel.querySelector<HTMLElement>('.js-lesson-controls')!;
    controls.appendChild(this.button(t('restart'), () => this.startLesson(this.lessonIndex), 'chip'));
    const undoButton = this.button(t('undo'), () => this.undo(), 'chip');
    undoButton.disabled = this.game.moveCount === 0;
    controls.appendChild(undoButton);
    controls.appendChild(this.button(t('help'), () => this.showHint(), 'chip'));

    const list = panel.querySelector<HTMLElement>('.js-lesson-list')!;
    LESSONS.forEach((item, index) => {
      const done = this.progress.lessons.includes(item.id);
      const button = this.button(
        `${done ? '✅ ' : ''}${t('piece', item.piece)}`,
        () => this.startLesson(index),
        index === this.lessonIndex ? 'chip active' : 'chip',
      );
      list.appendChild(button);
    });
  }

  private renderPuzzlePanel(): void {
    const puzzle = PUZZLES[this.puzzleIndex]!;
    const panel = this.el.panel;
    panel.innerHTML = `
      <div class="card">
        <h2>${L(puzzle.title)}</h2>
        <p>${t('puzzleTask')}</p>
        <div class="choice-row js-puzzle-controls"></div>
        <p class="muted js-puzzle-hint hidden">${L(puzzle.hint)}</p>
      </div>
      <div class="card">
        <h2>${t('pickPuzzle')}</h2>
        <div class="choice-row js-puzzle-list"></div>
        <p class="muted">${t('puzzleProgress', this.progress.puzzles.length, PUZZLES.length)}</p>
      </div>
    `;

    const controls = panel.querySelector<HTMLElement>('.js-puzzle-controls')!;
    controls.appendChild(
      this.button(t('restart'), () => this.startPuzzle(this.puzzleIndex), 'chip'),
    );
    controls.appendChild(
      this.button(t('showHint'), () => {
        panel.querySelector('.js-puzzle-hint')?.classList.remove('hidden');
        play('star');
      }, 'chip'),
    );
    controls.appendChild(
      this.button(t('showAnswer'), () => {
        const from = fromAlgebraic(puzzle.solution.slice(0, 2));
        const to = fromAlgebraic(puzzle.solution.slice(2, 4));
        this.hint = this.game.legalMoves(from).find((m) => m.to === to) ?? null;
        play('star');
        this.render();
      }, 'chip'),
    );

    const list = panel.querySelector<HTMLElement>('.js-puzzle-list')!;
    PUZZLES.forEach((item, index) => {
      const done = this.progress.puzzles.includes(item.id);
      list.appendChild(
        this.button(
          `${done ? '✅ ' : ''}${index + 1}`,
          () => this.startPuzzle(index),
          index === this.puzzleIndex ? 'chip active' : 'chip',
        ),
      );
    });
  }

  private renderGuide(): void {
    this.el.guide.innerHTML = `
      <h2 class="guide-title">${t('guideTitle')}</h2>
      <p class="guide-lead">${t('guideLead')}</p>
      <div class="guide-grid">
        ${PIECE_GUIDE.map(
          (item) => `
          <article class="card guide-card">
            <div class="guide-icons">${pieceIcon(item.type, 'w')}${pieceIcon(item.type, 'b')}</div>
            <h3>${L(item.name)}</h3>
            <p>${L(item.movement)}</p>
            <p class="muted">${L(item.value)}</p>
          </article>`,
        ).join('')}
      </div>
      <div class="card guide-rules">
        <h3>${t('rulesTitle')}</h3>
        <ul>
          ${RULES.map((rule) => `<li><strong>${L(rule.term)}</strong>: ${L(rule.text)}</li>`).join('')}
        </ul>
      </div>
    `;
  }
}
