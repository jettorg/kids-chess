import type { Color, GameStatus, Move, PieceType, Position, Square } from './types';
import { clonePosition, initialPosition, positionKey, toFen } from './position';
import { computeHash } from './zobrist';
import { applyMove, findMove, generateLegalMoves, isInCheck } from './moves';
import { gameStatus } from './status';
import { toSan } from './san';

export interface GameOptions {
  /** 연습 모드: 항상 이 색의 차례를 유지한다 (상대는 움직이지 않음) */
  singleSide?: Color | null;
}

export interface CapturedSummary {
  /** 흰색이 잡은 검은 말들 */
  byWhite: PieceType[];
  /** 검은색이 잡은 흰 말들 */
  byBlack: PieceType[];
}

/** 한 판의 진행 상태와 기보, 되돌리기를 관리한다. */
export class Game {
  private positions: Position[];
  private history: Move[] = [];
  private sanHistory: string[] = [];
  private options: GameOptions;

  constructor(start: Position = initialPosition(), options: GameOptions = {}) {
    this.positions = [clonePosition(start)];
    this.options = options;
  }

  get position(): Position {
    return this.positions[this.positions.length - 1]!;
  }

  get turn(): Color {
    return this.position.turn;
  }

  get moveCount(): number {
    return this.history.length;
  }

  get moves(): readonly Move[] {
    return this.history;
  }

  get sans(): readonly string[] {
    return this.sanHistory;
  }

  get lastMove(): Move | null {
    return this.history[this.history.length - 1] ?? null;
  }

  legalMoves(from?: Square): Move[] {
    return generateLegalMoves(this.position, from);
  }

  /** 해당 칸에서 갈 수 있는 목표 칸 목록 (아이용 하이라이트에 사용) */
  destinations(from: Square): Move[] {
    return this.legalMoves(from);
  }

  isCheck(): boolean {
    return isInCheck(this.position, this.turn);
  }

  /** 현재 배치가 기보 전체에서 몇 번 등장했는지 */
  repetitions(): number {
    const key = positionKey(this.position);
    let count = 0;
    for (const pos of this.positions) {
      if (positionKey(pos) === key) count++;
    }
    return count;
  }

  status(): GameStatus {
    return gameStatus(this.position, { repetitions: this.repetitions() });
  }

  /** from→to 로 수를 둔다. 불가능하면 null 을 반환한다. */
  move(from: Square, to: Square, promotion?: PieceType): Move | null {
    const move = findMove(this.position, from, to, promotion);
    if (!move) return null;
    return this.playMove(move);
  }

  /** 이미 생성된 Move 객체를 적용한다. */
  playMove(move: Move): Move {
    const before = this.position;
    const san = toSan(before, move);
    let after = applyMove(before, move);
    if (this.options.singleSide) {
      after = { ...after, turn: this.options.singleSide };
      const hash = computeHash(after);
      after.hashLo = hash.lo;
      after.hashHi = hash.hi;
    }
    this.positions.push(after);
    this.history.push(move);
    this.sanHistory.push(san);
    return move;
  }

  /** 마지막 수를 되돌린다. 되돌릴 수가 없으면 false. */
  undo(): boolean {
    if (this.history.length === 0) return false;
    this.positions.pop();
    this.history.pop();
    this.sanHistory.pop();
    return true;
  }

  /** count 개의 수를 되돌린다 (컴퓨터 대국에서 2수 되돌리기용). */
  undoMany(count: number): number {
    let done = 0;
    while (done < count && this.undo()) done++;
    return done;
  }

  captured(): CapturedSummary {
    const byWhite: PieceType[] = [];
    const byBlack: PieceType[] = [];
    for (const move of this.history) {
      if (!move.captured) continue;
      if (move.color === 'w') byWhite.push(move.captured);
      else byBlack.push(move.captured);
    }
    return { byWhite, byBlack };
  }

  fen(): string {
    return toFen(this.position);
  }

  /** 1. e4 e5 2. Nf3 ... 형태의 기보 문자열 */
  notation(): string {
    const out: string[] = [];
    const startsWithBlack = this.positions[0]!.turn === 'b';
    let moveNumber = this.positions[0]!.fullmove;
    for (let i = 0; i < this.sanHistory.length; i++) {
      const isWhiteMove = startsWithBlack ? i % 2 === 1 : i % 2 === 0;
      if (isWhiteMove) out.push(`${moveNumber}.`);
      else if (i === 0) out.push(`${moveNumber}...`);
      out.push(this.sanHistory[i]!);
      if (!isWhiteMove) moveNumber++;
    }
    return out.join(' ');
  }

  /** 저장·복원을 위한 직렬화 */
  serialize(): { start: string; moves: { from: number; to: number; promotion?: PieceType }[] } {
    return {
      start: toFen(this.positions[0]!),
      moves: this.history.map((m) => ({
        from: m.from,
        to: m.to,
        ...(m.promotion ? { promotion: m.promotion } : {}),
      })),
    };
  }
}
