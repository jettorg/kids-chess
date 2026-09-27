import type { Color, Move, Position, Square } from '../engine/types';
import { FILES, fileOf, rankOf, squareAt, toAlgebraic } from '../engine/position';
import { pieceSvg } from './pieces';

export interface BoardRenderState {
  position: Position;
  /** 검은색이 아래로 오도록 뒤집기 */
  flipped: boolean;
  selected: Square | null;
  /** 선택한 말이 갈 수 있는 수들 */
  destinations: Move[];
  lastMove: Move | null;
  /** 체크 상태인 킹의 칸 */
  checkSquare: Square | null;
  /** 힌트로 보여줄 수 */
  hint: Move | null;
  /** 배우기 모드에서 잡아야 하는 칸 */
  targets: Square[];
  /** 아이가 만질 수 있는 색 (null 이면 조작 불가) */
  interactiveColor: Color | null;
  showCoords: boolean;
}

export interface BoardCallbacks {
  /** 빈 칸이나 상대 말을 눌렀을 때: 이동 시도 */
  onMoveAttempt(from: Square, to: Square): void;
  /** 내 말을 눌렀을 때 */
  onPick(sq: Square): void;
  /** 보드 밖을 눌렀을 때 */
  onCancel(): void;
}

const DRAG_THRESHOLD = 6;

export class BoardView {
  private board: HTMLElement;
  private ranks: HTMLElement;
  private files: HTMLElement;
  private squares = new Array<HTMLElement>(64);
  private state: BoardRenderState | null = null;
  private renderedFlipped: boolean | null = null;
  private animatedMoveKey: string | null = null;

  private dragFrom: Square | null = null;
  private dragging = false;
  private startX = 0;
  private startY = 0;
  private ghost: HTMLElement | null = null;

  constructor(private root: HTMLElement, private callbacks: BoardCallbacks) {
    this.root.classList.add('board-wrap');
    this.root.innerHTML = `
      <div class="ranks" aria-hidden="true"></div>
      <div class="board" role="grid" aria-label="체스판"></div>
      <div class="files" aria-hidden="true"></div>
    `;
    this.ranks = this.root.querySelector('.ranks')!;
    this.files = this.root.querySelector('.files')!;
    this.board = this.root.querySelector('.board')!;

    for (let sq = 0; sq < 64; sq++) {
      const el = document.createElement('div');
      const light = (fileOf(sq) + rankOf(sq)) % 2 === 1;
      el.className = `square ${light ? 'light' : 'dark'}`;
      el.dataset.sq = String(sq);
      el.setAttribute('role', 'gridcell');
      el.setAttribute('aria-label', toAlgebraic(sq));
      el.innerHTML = '<div class="piece-slot"></div><div class="dot"></div>';
      this.squares[sq] = el;
    }

    this.bindPointer();
  }

  private squareFromEvent(event: PointerEvent): Square | null {
    const el = document.elementFromPoint(event.clientX, event.clientY);
    const squareEl = el?.closest<HTMLElement>('.square');
    if (!squareEl || !this.board.contains(squareEl)) return null;
    return Number(squareEl.dataset.sq);
  }

  private bindPointer(): void {
    this.board.addEventListener('pointerdown', (event: PointerEvent) => {
      if (event.button !== 0) return;
      const state = this.state;
      if (!state) return;
      const target = (event.target as HTMLElement).closest<HTMLElement>('.square');
      if (!target) return;
      const sq = Number(target.dataset.sq);
      const piece = state.position.board[sq];

      if (piece && state.interactiveColor && piece.color === state.interactiveColor) {
        this.callbacks.onPick(sq);
        this.beginDrag(sq, event);
      } else if (state.selected !== null) {
        this.callbacks.onMoveAttempt(state.selected, sq);
      }
    });

    window.addEventListener('pointermove', (event: PointerEvent) => {
      if (this.dragFrom === null) return;
      const dx = event.clientX - this.startX;
      const dy = event.clientY - this.startY;
      if (!this.dragging && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      this.dragging = true;
      event.preventDefault();
      this.squares[this.dragFrom]!.classList.add('dragging');
      if (this.ghost) {
        this.ghost.style.visibility = 'visible';
        this.ghost.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
      }
    }, { passive: false });

    window.addEventListener('pointerup', (event: PointerEvent) => {
      const from = this.dragFrom;
      const wasDragging = this.dragging;
      this.endDrag();
      if (from === null || !wasDragging) return;
      const to = this.squareFromEvent(event);
      if (to === null) {
        this.callbacks.onCancel();
        return;
      }
      if (to !== from) this.callbacks.onMoveAttempt(from, to);
    });

    window.addEventListener('pointercancel', () => this.endDrag());
  }

  private beginDrag(sq: Square, event: PointerEvent): void {
    this.dragFrom = sq;
    this.dragging = false;
    this.startX = event.clientX;
    this.startY = event.clientY;
    const piece = this.state?.position.board[sq];
    if (!piece) return;
    const ghost = document.createElement('div');
    ghost.className = 'drag-ghost';
    ghost.style.width = `${this.squares[sq]!.clientWidth}px`;
    ghost.style.height = `${this.squares[sq]!.clientHeight}px`;
    ghost.style.visibility = 'hidden';
    ghost.innerHTML = pieceSvg(piece);
    document.body.appendChild(ghost);
    this.ghost = ghost;
  }

  private endDrag(): void {
    if (this.dragFrom !== null) this.squares[this.dragFrom]!.classList.remove('dragging');
    this.ghost?.remove();
    this.ghost = null;
    this.dragFrom = null;
    this.dragging = false;
  }

  /** 뒤집기 상태에 맞춰 칸 순서와 좌표 라벨을 다시 배치한다. */
  private layout(flipped: boolean): void {
    if (this.renderedFlipped === flipped) return;
    this.renderedFlipped = flipped;
    const order: HTMLElement[] = [];
    for (let row = 0; row < 8; row++) {
      const rank = flipped ? row : 7 - row;
      for (let col = 0; col < 8; col++) {
        const file = flipped ? 7 - col : col;
        order.push(this.squares[squareAt(file, rank)]!);
      }
    }
    this.board.replaceChildren(...order);

    const rankLabels = Array.from({ length: 8 }, (_, row) => (flipped ? row + 1 : 8 - row));
    this.ranks.innerHTML = rankLabels.map((r) => `<span>${r}</span>`).join('');
    const fileLabels = Array.from({ length: 8 }, (_, col) => FILES[flipped ? 7 - col : col]);
    this.files.innerHTML = fileLabels.map((f) => `<span>${f}</span>`).join('');
  }

  render(state: BoardRenderState): void {
    const previous = this.state;
    this.state = state;
    this.layout(state.flipped);
    this.root.classList.toggle('show-coords', state.showCoords);

    const destinationSquares = new Map<Square, Move>();
    for (const move of state.destinations) destinationSquares.set(move.to, move);
    const targetSet = new Set(state.targets);

    for (let sq = 0; sq < 64; sq++) {
      const el = this.squares[sq]!;
      const piece = state.position.board[sq];
      const slot = el.firstElementChild as HTMLElement;
      const nextHtml = piece ? pieceSvg(piece) : '';
      if (slot.dataset.key !== `${piece?.color ?? ''}${piece?.type ?? ''}`) {
        slot.innerHTML = nextHtml;
        slot.dataset.key = `${piece?.color ?? ''}${piece?.type ?? ''}`;
      }

      const move = destinationSquares.get(sq);
      el.classList.toggle('selected', state.selected === sq);
      el.classList.toggle('dest', move !== undefined);
      el.classList.toggle('dest-capture', move !== undefined && (Boolean(move.captured) || Boolean(piece)));
      el.classList.toggle('last-from', state.lastMove?.from === sq);
      el.classList.toggle('last-to', state.lastMove?.to === sq);
      el.classList.toggle('check', state.checkSquare === sq);
      el.classList.toggle('hint-from', state.hint?.from === sq);
      el.classList.toggle('hint-to', state.hint?.to === sq);
      el.classList.toggle('target', targetSet.has(sq));
      const movable =
        state.interactiveColor !== null && piece?.color === state.interactiveColor;
      el.classList.toggle('movable', movable);
    }

    this.animateLastMove(previous, state);
  }

  /** 마지막 수를 부드럽게 미끄러지듯 보여준다. */
  private animateLastMove(previous: BoardRenderState | null, state: BoardRenderState): void {
    const move = state.lastMove;
    if (!move) {
      this.animatedMoveKey = null;
      return;
    }
    const key = `${state.position.halfmove}:${state.position.fullmove}:${move.from}-${move.to}-${move.promotion ?? ''}`;
    if (key === this.animatedMoveKey) return;
    this.animatedMoveKey = key;
    // 되돌리기처럼 수가 줄어든 경우에는 애니메이션하지 않는다.
    if (previous?.lastMove && previous.lastMove.from === move.from && previous.lastMove.to === move.to) return;

    const fromEl = this.squares[move.from]!;
    const toEl = this.squares[move.to]!;
    const piece = toEl.firstElementChild as HTMLElement | null;
    if (!piece) return;
    const a = fromEl.getBoundingClientRect();
    const b = toEl.getBoundingClientRect();
    const dx = a.left - b.left;
    const dy = a.top - b.top;
    if (dx === 0 && dy === 0) return;
    piece.style.transition = 'none';
    piece.style.transform = `translate(${dx}px, ${dy}px)`;
    requestAnimationFrame(() => {
      piece.style.transition = 'transform 160ms ease-out';
      piece.style.transform = '';
    });
  }

  /** 잘못된 수를 두면 살짝 흔들어 알려준다. */
  shake(sq: Square): void {
    const el = this.squares[sq];
    if (!el) return;
    el.classList.remove('shake');
    void el.offsetWidth;
    el.classList.add('shake');
    setTimeout(() => el.classList.remove('shake'), 400);
  }
}
