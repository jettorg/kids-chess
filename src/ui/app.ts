import type { Color, Move, PieceType, Square } from '../engine/types';
import { Game, findKing, initialPosition, parseFen } from '../engine';
import { AiClient } from '../ai/client';
import type { MoveRef } from '../ai/worker';
import { LESSONS } from '../data/lessons';
import { PUZZLES, puzzleRating, type PuzzleTheme } from '../data/puzzles';
import { fromAlgebraic, toAlgebraic } from '../engine/position';
import { L, LOCALES, getLocale, setLocale, t, type Locale } from '../i18n';
import { BoardView } from './board';
import { pieceSvg } from './pieces';
import { isSoundEnabled, play, setSoundEnabled } from './sound';
import { Banner, showPromotionDialog } from './dialogs';
import { renderGuide, renderLearnPanel, renderPlayPanel, renderPuzzlePanel, type PanelHost } from './panels';
import {
  DEFAULT_SETTINGS,
  PROGRESS_KEY,
  SAVE_KEY,
  SETTINGS_KEY,
  load,
  save,
  type Progress,
  type SavedGame,
  type Settings,
} from './storage';

type Screen = 'play' | 'learn' | 'puzzle' | 'guide';

/** 컴퓨터가 너무 즉답하면 기계적으로 느껴지므로 최소한 이만큼은 "생각하는" 것처럼 보이게 한다 */
const MIN_THINK_MS = 320;

/**
 * 앱 전체를 조율한다: 화면 전환, 한 판의 진행, 컴퓨터 상대, 배우기·퍼즐 판정.
 * 오른쪽 패널의 그리기는 panels.ts, 결과 창과 승격 창은 dialogs.ts 에 있다.
 */
export class App implements PanelHost {
  settings: Settings;
  progress: Progress;
  game: Game = new Game();
  thinking = false;
  hintPending = false;
  /** 대국 화면의 설정 카드를 펼쳐 둘지 (첫 수를 두면 접힌다) */
  settingsOpen = true;
  lessonIndex = 0;
  puzzleIndex = 0;
  /** 퍼즐 화면에서 보여줄 문제 종류 (전체 또는 한 테마) */
  puzzleTheme: PuzzleTheme | 'all' = 'all';
  /** 상대 응수를 자동으로 두는 중 */
  puzzleBusy = false;

  private screen: Screen = 'play';
  private board: BoardView;
  private banner: Banner;
  private selected: Square | null = null;
  private hint: Move | null = null;
  private pendingPromotion: { from: Square; to: Square } | null = null;
  private puzzleSolved = false;
  /** 정답 수열에서 다음에 내가 둘 수의 위치 (0, 2, 4 …) */
  private puzzleStep = 0;
  /** 상태 줄에 잠시 보여줄 안내 (사전 키로 저장해 언어를 바꿔도 맞게 보이도록) */
  private message: 'learnStuck' | 'puzzleWrong' | 'puzzleWrongLine' | null = null;

  /** 탐색은 Web Worker 에서 돈다. 세대 번호로 늦게 도착한 결과를 버린다. */
  private ai = new AiClient();
  private aiGeneration = 0;

  private el: {
    app: HTMLElement;
    brand: HTMLElement;
    tabs: HTMLElement;
    lang: HTMLElement;
    soundBtn: HTMLButtonElement;
    boardHost: HTMLElement;
    status: HTMLElement;
    trayTop: HTMLElement;
    trayBottom: HTMLElement;
    panel: HTMLElement;
    guide: HTMLElement;
    promo: HTMLElement;
    banner: HTMLElement;
    toast: HTMLElement;
  };

  constructor(root: HTMLElement) {
    this.settings = load(SETTINGS_KEY, DEFAULT_SETTINGS);
    this.progress = load(PROGRESS_KEY, { lessons: [], puzzles: [] } as Progress);
    this.puzzleIndex = Math.max(0, Math.min(this.progress.puzzleIndex ?? 0, PUZZLES.length - 1));
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
                `<button type="button" data-locale="${l.code}" aria-label="${l.label} ${l.code.toUpperCase()}">` +
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
        <div class="toast js-toast hidden" role="status"></div>
      </div>
    `;

    const q = <T extends HTMLElement>(selector: string): T => root.querySelector<T>(selector)!;
    this.el = {
      app: q('.app'),
      brand: q('.js-brand'),
      tabs: q('.tabs'),
      lang: q('.js-lang'),
      soundBtn: q<HTMLButtonElement>('.js-sound'),
      boardHost: q('.js-board'),
      status: q('.js-status'),
      trayTop: q('.js-tray-top'),
      trayBottom: q('.js-tray-bottom'),
      panel: q('.js-panel'),
      guide: q('.js-guide'),
      promo: q('.js-promo'),
      banner: q('.js-banner'),
      toast: q('.js-toast'),
    };

    this.board = new BoardView(this.el.boardHost, {
      onPick: (sq) => this.pick(sq),
      onMoveAttempt: (from, to) => this.tryMove(from, to),
      onCancel: () => {
        this.selected = null;
        this.render();
      },
    });
    this.banner = new Banner(this.el.banner, this.el.app);

    this.bindChrome();
    this.restoreGame();
    this.renderChrome();
    renderGuide(this.el.guide);
    this.render();
  }

  // ───────────────────────── 화면 전환과 상단 바 ─────────────────────────

  private bindChrome(): void {
    this.el.tabs.addEventListener('click', (event) => {
      const el = (event.target as HTMLElement).closest<HTMLElement>('button[data-screen]');
      if (el) this.setScreen(el.dataset.screen as Screen);
    });

    this.el.lang.addEventListener('click', (event) => {
      const el = (event.target as HTMLElement).closest<HTMLElement>('button[data-locale]');
      if (!el) return;
      const locale = el.dataset.locale as Locale;
      if (locale === getLocale()) return;
      setLocale(locale);
      this.banner.hide();
      this.renderChrome();
      renderGuide(this.el.guide);
      this.render();
    });

    this.el.soundBtn.addEventListener('click', () => {
      this.settings.sound = !this.settings.sound;
      setSoundEnabled(this.settings.sound);
      this.saveSettings();
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
    this.el.tabs.querySelectorAll<HTMLElement>('button[data-screen]').forEach((el) => {
      el.textContent = tabLabels[el.dataset.screen as Screen];
    });
    this.el.tabs.setAttribute('aria-label', t('navLabel'));
    this.el.lang.setAttribute('aria-label', t('languageLabel'));
    this.el.lang.querySelectorAll<HTMLElement>('button[data-locale]').forEach((el) => {
      const active = el.dataset.locale === getLocale();
      el.classList.toggle('active', active);
      el.setAttribute('aria-pressed', String(active));
    });
    this.el.soundBtn.setAttribute('aria-label', t('soundToggle'));
    this.board.setLabel(t('boardLabel'));
  }

  private setScreen(screen: Screen): void {
    if (this.screen === screen) return;
    this.cancelThinking();
    this.screen = screen;
    this.selected = null;
    this.hint = null;
    this.message = null;
    this.banner.hide();
    if (screen === 'learn') this.startLesson(this.lessonIndex);
    else if (screen === 'puzzle') this.startPuzzle(this.puzzleIndex);
    else if (screen === 'play') this.restoreGame();
    this.render();
  }

  saveSettings(): void {
    save(SETTINGS_KEY, this.settings);
  }

  /** 새 버전이 준비됐을 때 (main.ts 의 서비스 워커 감시가 부른다) */
  notifyUpdate(): void {
    const toast = this.el.toast;
    toast.classList.remove('hidden');
    toast.innerHTML = `<span>${t('updateAvailable')}</span>`;
    const reload = document.createElement('button');
    reload.type = 'button';
    reload.className = 'chip';
    reload.textContent = t('reloadNow');
    reload.addEventListener('click', () => location.reload());
    toast.appendChild(reload);
    const later = document.createElement('button');
    later.type = 'button';
    later.className = 'ghost';
    later.textContent = t('later');
    later.addEventListener('click', () => toast.classList.add('hidden'));
    toast.appendChild(later);
  }

  // ───────────────────────── 게임 생성 ─────────────────────────

  private restoreGame(): void {
    const saved = load<SavedGame>(SAVE_KEY, {});
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
    this.cancelThinking();
    this.maybeAiMove();
  }

  newGame(): void {
    this.cancelThinking();
    this.game = new Game(initialPosition());
    this.selected = null;
    this.hint = null;
    this.message = null;
    this.banner.hide();
    this.persistGame();
    this.render();
    this.maybeAiMove();
  }

  private persistGame(): void {
    if (this.screen !== 'play') return;
    save(SAVE_KEY, this.game.serialize());
  }

  startLesson(index: number): void {
    this.cancelThinking();
    this.lessonIndex = Math.max(0, Math.min(index, LESSONS.length - 1));
    const lesson = LESSONS[this.lessonIndex]!;
    this.game = new Game(parseFen(lesson.fen), { singleSide: 'w' });
    this.selected = null;
    this.hint = null;
    this.message = null;
    this.banner.hide();
    this.render();
  }

  startPuzzle(index: number): void {
    this.cancelThinking();
    this.puzzleIndex = Math.max(0, Math.min(index, PUZZLES.length - 1));
    const puzzle = PUZZLES[this.puzzleIndex]!;
    this.game = new Game(parseFen(puzzle.fen));
    this.selected = null;
    this.hint = null;
    this.puzzleSolved = false;
    this.puzzleBusy = false;
    this.puzzleStep = 0;
    this.message = null;
    this.progress.puzzleIndex = this.puzzleIndex;
    save(PROGRESS_KEY, this.progress);
    this.banner.hide();
    this.render();
  }

  /** 현재 필터에 해당하는 퍼즐 번호 목록 */
  visiblePuzzles(): number[] {
    const out: number[] = [];
    PUZZLES.forEach((p, i) => {
      if (this.puzzleTheme === 'all' || p.theme === this.puzzleTheme) out.push(i);
    });
    return out;
  }

  setPuzzleTheme(theme: PuzzleTheme | 'all'): void {
    this.puzzleTheme = theme;
    const visible = this.visiblePuzzles();
    if (!visible.includes(this.puzzleIndex)) this.startPuzzle(visible[0] ?? 0);
    else this.render();
  }

  /** 안 푼 문제 중 목표 난이도에 가장 가까운 것 (없으면 -1) */
  recommendedPuzzleIndex(): number {
    const target = this.progress.puzzleTarget ?? 450;
    let best = -1;
    let bestGap = Infinity;
    for (const i of this.visiblePuzzles()) {
      const puzzle = PUZZLES[i]!;
      if (i === this.puzzleIndex || this.progress.puzzles.includes(puzzle.id)) continue;
      const gap = Math.abs(puzzleRating(puzzle) - target);
      if (gap < bestGap) {
        bestGap = gap;
        best = i;
      }
    }
    return best;
  }

  /** 풀면 목표 난이도를 올리고 틀리면 내린다 */
  private adjustPuzzleTarget(delta: number): void {
    const current = this.progress.puzzleTarget ?? 450;
    this.progress.puzzleTarget = Math.max(300, Math.min(2000, current + delta));
    save(PROGRESS_KEY, this.progress);
  }

  // ───────────────────────── 조작 ─────────────────────────

  /** 지금 아이(또는 사람)가 만질 수 있는 색 */
  interactiveColor(): Color | null {
    if (this.thinking || this.pendingPromotion) return null;
    if (this.screen === 'guide') return null;
    if (this.screen === 'learn') return 'w';
    if (this.screen === 'puzzle') return this.puzzleSolved || this.puzzleBusy ? null : PUZZLES[this.puzzleIndex]!.side;
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
      if (this.game.position.board[from]) {
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
      showPromotionDialog(
        this.el.promo,
        this.game.turn,
        (promotion: PieceType) => {
          const pending = this.pendingPromotion;
          this.pendingPromotion = null;
          const move = pending
            ? this.game.legalMoves(pending.from).find((m) => m.to === pending.to && m.promotion === promotion)
            : undefined;
          if (move) this.commitMove(move);
          else this.render();
        },
        () => {
          // Esc 로 취소: 폰은 제자리에 남고 다시 고를 수 있다.
          this.pendingPromotion = null;
          this.render();
        },
      );
      return;
    }

    this.commitMove(options[0]!);
  }

  private commitMove(move: Move): void {
    this.cancelThinking();
    this.game.playMove(move);
    if (this.screen === 'play') this.settingsOpen = false;
    this.selected = null;
    this.hint = null;
    this.message = null;

    if (move.castle) play('castle');
    else if (move.captured) play(this.screen === 'learn' ? 'star' : 'capture');
    else play('move');

    this.render();
    this.afterMove(move);
  }

  private afterMove(move: Move): void {
    if (this.screen === 'learn') {
      this.checkLessonDone();
      return;
    }
    if (this.screen === 'puzzle') {
      this.checkPuzzleAnswer(move);
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

  undo(): void {
    if (this.screen === 'puzzle') {
      this.startPuzzle(this.puzzleIndex);
      return;
    }
    if (this.screen === 'learn') {
      this.game.undo();
      this.selected = null;
      this.banner.hide();
      this.render();
      return;
    }

    if (this.game.moveCount === 0) return;
    this.cancelThinking();
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
    this.banner.hide();
    this.persistGame();
    this.render();
    // 컴퓨터가 선인 첫 수까지 되돌렸다면 컴퓨터가 다시 시작한다.
    this.maybeAiMove();
  }

  // ───────────────────────── 컴퓨터 상대와 힌트 ─────────────────────────

  /** 진행 중인 탐색 결과를 무시하게 한다 (새 게임, 되돌리기, 화면 전환 시) */
  private cancelThinking(): void {
    this.aiGeneration++;
    this.thinking = false;
    this.hintPending = false;
  }

  private maybeAiMove(): void {
    if (this.screen !== 'play') return;
    if (this.settings.opponent === 'human') return;
    if (this.game.status().kind !== 'playing') return;
    if (this.game.turn === this.settings.playerColor) return;

    const level = this.settings.opponent;
    const generation = ++this.aiGeneration;
    this.thinking = true;
    this.render();
    const started = performance.now();
    void this.ai.choose(this.game.position, level).then((ref) => {
      if (generation !== this.aiGeneration) return; // 그사이 새 게임·되돌리기가 있었음
      const wait = Math.max(0, MIN_THINK_MS - (performance.now() - started));
      setTimeout(() => {
        if (generation !== this.aiGeneration) return;
        this.thinking = false;
        const move = this.resolveMove(ref);
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
      }, wait);
    });
  }

  /** Worker 가 돌려준 좌표를 현재 배치의 합법 수로 바꾼다. 배치가 바뀌었으면 null. */
  private resolveMove(ref: MoveRef | null): Move | null {
    if (!ref) return null;
    return this.game.legalMoves(ref.from).find((m) => m.to === ref.to && m.promotion === ref.promotion) ?? null;
  }

  showHint(): void {
    if (this.interactiveColor() === null || this.hintPending) return;
    if (this.screen === 'learn') {
      // 연습 모드는 탐색 없이 잡는 수를 바로 알려준다.
      const move = this.game.legalMoves().find((m) => m.captured) ?? this.game.legalMoves()[0] ?? null;
      if (move) this.presentHint(move);
      return;
    }
    const generation = this.aiGeneration;
    this.hintPending = true;
    this.render();
    void this.ai.suggest(this.game.position).then((ref) => {
      if (generation !== this.aiGeneration) return; // 그사이 수를 두었거나 화면이 바뀜
      this.hintPending = false;
      const move = this.resolveMove(ref);
      if (move) this.presentHint(move);
      else this.render();
    });
  }

  setHint(move: Move | null): void {
    this.hint = move;
  }

  /** 퍼즐에서 지금 둘 정답 수 (UCI) */
  currentPuzzleAnswer(): string | null {
    const puzzle = PUZZLES[this.puzzleIndex]!;
    return puzzle.line[this.puzzleStep] ?? null;
  }

  private presentHint(move: Move): void {
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

  // ───────────────────────── 결과 판정 ─────────────────────────

  private announceEnd(): void {
    const status = this.game.status();
    if (status.kind === 'checkmate') {
      const winnerIsPlayer =
        this.settings.opponent === 'human' || status.winner === this.settings.playerColor;
      play('win');
      this.banner.show(
        winnerIsPlayer ? t('mateTitleWin') : t('mateTitle'),
        t('mateDetail', status.winner),
        [{ label: t('playAgain'), action: () => this.newGame() }],
        true,
      );
    } else if (status.kind === 'stalemate') {
      this.banner.show(t('stalemateTitle'), t('stalemateDetail'), [{ label: t('playAgain'), action: () => this.newGame() }]);
    } else if (status.kind === 'draw') {
      this.banner.show(t('drawTitle'), t('drawDetail', status.reason), [{ label: t('playAgain'), action: () => this.newGame() }]);
    }
  }

  private remainingTargets(): Square[] {
    const out: Square[] = [];
    for (let sq = 0; sq < 64; sq++) {
      const piece = this.game.position.board[sq];
      if (piece && piece.color === 'b') out.push(sq);
    }
    return out;
  }

  private checkLessonDone(): void {
    if (this.remainingTargets().length > 0) {
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
    this.banner.show(
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

  private checkPuzzleAnswer(move: Move): void {
    const puzzle = PUZZLES[this.puzzleIndex]!;
    const step = this.puzzleStep;
    const isLast = step >= puzzle.line.length - 1;
    const mated = this.game.status().kind === 'checkmate';
    const uci = toAlgebraic(move.from) + toAlgebraic(move.to) + (move.promotion ?? '');
    // 마지막 수가 메이트인 문제는 다른 메이트 수도 인정한다. 중간 수는 정답 수열과 같아야 한다.
    const correct = isLast && puzzle.mateAtEnd ? mated : uci === puzzle.line[step] || (isLast && mated);

    if (!correct) {
      this.adjustPuzzleTarget(-25);
      this.message = puzzle.mateAtEnd && isLast ? 'puzzleWrong' : 'puzzleWrongLine';
      this.render();
      setTimeout(() => {
        if (this.screen !== 'puzzle' || this.puzzleSolved) return;
        this.game.undo();
        this.selected = null;
        this.message = null;
        this.render();
      }, 1100);
      return;
    }

    if (!isLast) {
      // 상대 응수를 잠시 뒤 자동으로 둔다.
      this.puzzleBusy = true;
      this.render();
      const generation = this.aiGeneration;
      setTimeout(() => {
        if (generation !== this.aiGeneration || this.screen !== 'puzzle') return;
        const reply = puzzle.line[step + 1]!;
        const replyMove = this.game
          .legalMoves(fromAlgebraic(reply.slice(0, 2)))
          .find((m) => m.to === fromAlgebraic(reply.slice(2, 4)) && (m.promotion ?? '') === (reply[4] ?? ''));
        if (replyMove) {
          this.game.playMove(replyMove);
          play(replyMove.captured ? 'capture' : 'move');
        }
        this.puzzleStep = step + 2;
        this.puzzleBusy = false;
        this.render();
      }, 550);
      return;
    }

    this.puzzleSolved = true;
    if (!this.progress.puzzles.includes(puzzle.id)) {
      this.progress.puzzles.push(puzzle.id);
      this.adjustPuzzleTarget(40);
    }
    play('win');
    const visible = this.visiblePuzzles();
    const next = visible.find((i) => i > this.puzzleIndex);
    this.banner.show(
      t('puzzleDoneTitle'),
      t('puzzleDoneDetail'),
      next === undefined
        ? [{ label: t('goPlay'), action: () => this.setScreen('play') }]
        : [{ label: t('nextPuzzle'), action: () => this.startPuzzle(next) }],
      true,
    );
    this.render();
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
      if (this.puzzleSolved) return t('puzzleSolvedStatus');
      if (this.puzzleBusy) return t('puzzleGood');
      const puzzle = PUZZLES[this.puzzleIndex]!;
      if (puzzle.theme === 'mate1') return t('puzzleStatusMate1', puzzle.side);
      if (puzzle.theme === 'mate2') return t('puzzleStatusMate2', puzzle.side);
      return t('puzzleStatusTactic', puzzle.side);
    }
    if (this.thinking) return t('thinking');

    const status = this.game.status();
    if (status.kind === 'checkmate') return t('checkmateStatus', status.winner);
    if (status.kind === 'stalemate') return t('stalemateStatus');
    if (status.kind === 'draw') return t('drawStatus');
    return status.check ? t('check', this.game.turn) : t('turn', this.game.turn);
  }

  render(): void {
    this.el.app.dataset.screen = this.screen;
    this.el.tabs.querySelectorAll<HTMLElement>('button[data-screen]').forEach((el) => {
      const active = el.dataset.screen === this.screen;
      el.classList.toggle('active', active);
      if (active) el.setAttribute('aria-current', 'page');
      else el.removeAttribute('aria-current');
    });
    this.el.app.classList.toggle('with-coords', this.settings.coords);
    this.el.soundBtn.textContent = isSoundEnabled() ? '🔊' : '🔈';
    this.el.soundBtn.classList.toggle('muted', !isSoundEnabled());

    const status = this.game.status();
    const checkSquare =
      this.screen !== 'learn' && (status.kind === 'checkmate' || (status.kind === 'playing' && status.check))
        ? findKing(this.game.position, this.game.turn)
        : null;

    // 퍼즐은 푸는 쪽이 아래로 오도록 판을 돌린다 (설정의 뒤집기와 별개)
    const flipped = this.screen === 'puzzle' ? PUZZLES[this.puzzleIndex]!.side === 'b' : this.settings.flipped;
    this.board.render({
      position: this.game.position,
      flipped,
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
    // 비어 있으면 빈 문자열 — CSS 의 .tray:empty 가 높이를 0 으로 만든다.
    const tray = (taken: PieceType[], color: Color) =>
      taken
        .slice()
        .sort()
        .map((type) => pieceSvg({ type, color }, 'tray-piece'))
        .join('');
    // 아래쪽 플레이어가 잡은 말을 아래 트레이에 보여준다.
    if (this.settings.flipped) {
      this.el.trayTop.innerHTML = tray(byWhite, 'b');
      this.el.trayBottom.innerHTML = tray(byBlack, 'w');
    } else {
      this.el.trayTop.innerHTML = tray(byBlack, 'w');
      this.el.trayBottom.innerHTML = tray(byWhite, 'b');
    }
  }

  renderPanel(): void {
    const panel = this.el.panel;
    if (this.screen === 'guide') panel.innerHTML = '';
    else if (this.screen === 'learn') renderLearnPanel(this, panel);
    else if (this.screen === 'puzzle') renderPuzzlePanel(this, panel);
    else renderPlayPanel(this, panel);
  }
}
