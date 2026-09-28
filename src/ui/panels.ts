import type { Color, Move } from '../engine/types';
import { Game, fromAlgebraic } from '../engine';
import { AI_LEVELS } from '../ai/ai';
import { LESSONS, PIECE_GUIDE, RULES } from '../data/lessons';
import { PUZZLES, type PuzzleTheme } from '../data/puzzles';
import { L, t } from '../i18n';
import { pieceIcon } from './pieces';
import { play } from './sound';
import { button } from './dom';
import type { Opponent, Progress, Settings } from './storage';

/** 패널이 앱에서 읽고 부르는 것들. App 이 구현한다. */
export interface PanelHost {
  readonly settings: Settings;
  readonly progress: Progress;
  readonly game: Game;
  readonly thinking: boolean;
  readonly hintPending: boolean;
  settingsOpen: boolean;
  readonly lessonIndex: number;
  readonly puzzleIndex: number;
  readonly puzzleTheme: PuzzleTheme | 'all';
  readonly puzzleBusy: boolean;
  readonly lessonBusy: boolean;
  visiblePuzzles(): number[];
  setPuzzleTheme(theme: PuzzleTheme | 'all'): void;
  recommendedPuzzleIndex(): number;
  currentPuzzleAnswer(): string | null;
  interactiveColor(): Color | null;
  saveSettings(): void;
  newGame(): void;
  undo(): void;
  showHint(): void;
  setHint(move: Move | null): void;
  startLesson(index: number): void;
  startPuzzle(index: number): void;
  render(): void;
  renderPanel(): void;
}

/** 접힌 설정 카드에 보여줄 한 줄 요약 */
function opponentSummary(settings: Settings): string {
  if (settings.opponent === 'human') return t('humanSummary');
  return t('aiSummary', t(`level${settings.opponent}`), settings.playerColor);
}

export function renderPlayPanel(host: PanelHost, panel: HTMLElement): void {
  const { settings, game } = host;
  const settingsBody = host.settingsOpen
    ? '<div class="choice-row js-opponents"></div><div class="js-color-row"></div>'
    : `<p class="summary">${opponentSummary(settings)}</p>`;
  panel.innerHTML = `
    <div class="card">
      <div class="card-head">
        <h2>${t('opponent')}</h2>
        <button type="button" class="ghost js-toggle-settings">${host.settingsOpen ? t('collapse') : t('change')}</button>
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
    host.settingsOpen = !host.settingsOpen;
    host.renderPanel();
  });

  const opponents = panel.querySelector<HTMLElement>('.js-opponents');
  const makeOpponentButton = (value: Opponent, label: string, hint: string) => {
    if (!opponents) return;
    const el = button(
      label,
      () => {
        settings.opponent = value;
        host.saveSettings();
        host.newGame();
      },
      settings.opponent === value ? 'chip active' : 'chip',
    );
    el.title = hint;
    opponents.appendChild(el);
  };
  makeOpponentButton('human', t('human'), t('humanHint'));
  for (const level of AI_LEVELS) {
    makeOpponentButton(level, t(`level${level}`), t(`level${level}Hint`));
  }

  const colorRow = panel.querySelector<HTMLElement>('.js-color-row');
  if (colorRow && settings.opponent !== 'human') {
    colorRow.innerHTML = `<h3>${t('myColor')}</h3><div class="choice-row js-colors"></div>`;
    const colors = colorRow.querySelector<HTMLElement>('.js-colors')!;
    for (const color of ['w', 'b'] as Color[]) {
      colors.appendChild(
        button(
          color === 'w' ? t('whiteFirst') : t('blackSecond'),
          () => {
            settings.playerColor = color;
            settings.flipped = color === 'b';
            host.saveSettings();
            host.newGame();
          },
          settings.playerColor === color ? 'chip active' : 'chip',
        ),
      );
    }
    const p = document.createElement('p');
    p.className = 'muted';
    p.textContent = t(`level${settings.opponent}Hint`);
    colorRow.appendChild(p);
  }

  const controls = panel.querySelector<HTMLElement>('.js-controls')!;
  controls.appendChild(button(t('newGame'), () => host.newGame(), 'chip'));
  const undoButton = button(t('undo'), () => host.undo(), 'chip');
  undoButton.disabled = game.moveCount === 0 || host.thinking;
  controls.appendChild(undoButton);
  const hintButton = button(host.hintPending ? '⏳' : t('hint'), () => host.showHint(), 'chip');
  hintButton.disabled = host.interactiveColor() === null || host.hintPending;
  controls.appendChild(hintButton);
  controls.appendChild(
    button(
      t('flip'),
      () => {
        settings.flipped = !settings.flipped;
        host.saveSettings();
        host.render();
      },
      'chip',
    ),
  );
  controls.appendChild(
    button(
      settings.coords ? t('hideCoords') : t('showCoords'),
      () => {
        settings.coords = !settings.coords;
        host.saveSettings();
        host.render();
      },
      'chip',
    ),
  );

  panel.querySelector<HTMLElement>('.js-notation')!.textContent = game.notation() || t('noMoves');
}

export function renderLearnPanel(host: PanelHost, panel: HTMLElement): void {
  const lesson = LESSONS[host.lessonIndex]!;
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
  controls.appendChild(button(t('restart'), () => host.startLesson(host.lessonIndex), 'chip'));
  const undoButton = button(t('undo'), () => host.undo(), 'chip');
  undoButton.disabled = host.game.moveCount === 0 || host.lessonBusy;
  controls.appendChild(undoButton);
  const helpButton = button(t('help'), () => host.showHint(), 'chip');
  helpButton.disabled = host.lessonBusy;
  controls.appendChild(helpButton);

  const list = panel.querySelector<HTMLElement>('.js-lesson-list')!;
  LESSONS.forEach((item, index) => {
    const done = host.progress.lessons.includes(item.id);
    list.appendChild(
      button(
        `${done ? '✅ ' : ''}${L(item.short)}`,
        () => host.startLesson(index),
        index === host.lessonIndex ? 'chip active' : 'chip',
      ),
    );
  });
}

const THEMES: (PuzzleTheme | 'all')[] = ['all', 'mate1', 'mate2', 'fork', 'hanging', 'pin'];

function themeLabel(theme: PuzzleTheme | 'all'): string {
  switch (theme) {
    case 'all':
      return t('themeAll');
    case 'mate1':
      return t('themeMate1');
    case 'mate2':
      return t('themeMate2');
    case 'fork':
      return t('themeFork');
    case 'hanging':
      return t('themeHanging');
    case 'pin':
      return t('themePin');
  }
}

export function renderPuzzlePanel(host: PanelHost, panel: HTMLElement): void {
  const { progress, puzzleIndex } = host;
  const puzzle = PUZZLES[puzzleIndex]!;
  const solved = progress.puzzles.includes(puzzle.id);
  const visible = host.visiblePuzzles();
  const position = visible.indexOf(puzzleIndex);
  const task =
    puzzle.theme === 'mate1'
      ? t('puzzleTaskMate1', puzzle.side)
      : puzzle.theme === 'mate2'
        ? t('puzzleTaskMate2', puzzle.side)
        : t('puzzleTaskTactic', puzzle.side);
  const solvedInView = visible.filter((i) => progress.puzzles.includes(PUZZLES[i]!.id)).length;

  panel.innerHTML = `
    <div class="card">
      <div class="card-head">
        <h2>${solved ? '✅ ' : ''}${L(puzzle.title)} · ${themeLabel(puzzle.theme)}</h2>
        ${puzzle.rating ? `<span class="muted">${t('puzzleRating', puzzle.rating)}</span>` : ''}
      </div>
      <p>${task}</p>
      <div class="choice-row js-puzzle-controls"></div>
      <p class="muted js-puzzle-hint hidden">${L(puzzle.hint)}</p>
    </div>
    <div class="card">
      <h2>${t('puzzleCounter', position + 1, visible.length)}</h2>
      <div class="choice-row js-puzzle-nav"></div>
      <h3>${t('themeLabel')}</h3>
      <div class="choice-row js-puzzle-themes"></div>
      <p class="muted">${t('puzzleProgress', solvedInView, visible.length)}</p>
      ${puzzle.source === 'lichess' ? `<p class="muted">${t('lichessCredit')}</p>` : ''}
    </div>
  `;

  const controls = panel.querySelector<HTMLElement>('.js-puzzle-controls')!;
  controls.appendChild(button(t('restart'), () => host.startPuzzle(puzzleIndex), 'chip'));
  controls.appendChild(
    button(
      t('showHint'),
      () => {
        panel.querySelector('.js-puzzle-hint')?.classList.remove('hidden');
        play('star');
      },
      'chip',
    ),
  );
  const answerButton = button(
    t('showAnswer'),
    () => {
      const answer = host.currentPuzzleAnswer();
      if (!answer) return;
      const from = fromAlgebraic(answer.slice(0, 2));
      const to = fromAlgebraic(answer.slice(2, 4));
      host.setHint(host.game.legalMoves(from).find((m) => m.to === to) ?? null);
      play('star');
      host.render();
    },
    'chip',
  );
  answerButton.disabled = host.puzzleBusy;
  controls.appendChild(answerButton);

  const nav = panel.querySelector<HTMLElement>('.js-puzzle-nav')!;
  const prev = button(t('prevPuzzle'), () => host.startPuzzle(visible[position - 1]!), 'chip');
  prev.disabled = position <= 0;
  nav.appendChild(prev);
  const next = button(t('nextPuzzleShort'), () => host.startPuzzle(visible[position + 1]!), 'chip');
  next.disabled = position < 0 || position >= visible.length - 1;
  nav.appendChild(next);
  const recommended = host.recommendedPuzzleIndex();
  const jump = button(t('recommended'), () => host.startPuzzle(recommended), 'chip');
  jump.disabled = recommended < 0;
  nav.appendChild(jump);

  const themes = panel.querySelector<HTMLElement>('.js-puzzle-themes')!;
  for (const theme of THEMES) {
    themes.appendChild(
      button(themeLabel(theme), () => host.setPuzzleTheme(theme), host.puzzleTheme === theme ? 'chip active' : 'chip'),
    );
  }
}

export function renderGuide(guide: HTMLElement): void {
  guide.innerHTML = `
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
