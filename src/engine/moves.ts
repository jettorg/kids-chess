import type { CastlingRights, Color, Move, Piece, PieceType, Position, Square } from './types';
import {
  clonePosition,
  fileOf,
  findKing,
  onBoard,
  opposite,
  rankOf,
  squareAt,
} from './position';
import {
  SIDE_HASH_HI,
  SIDE_HASH_LO,
  castleHashHi,
  castleHashLo,
  epHashHi,
  epHashLo,
  pieceHashHi,
  pieceHashLo,
} from './zobrist';

type Delta = readonly [number, number];

const KNIGHT_DELTAS: readonly Delta[] = [
  [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2],
];
const BISHOP_DELTAS: readonly Delta[] = [[1, 1], [1, -1], [-1, -1], [-1, 1]];
const ROOK_DELTAS: readonly Delta[] = [[0, 1], [1, 0], [0, -1], [-1, 0]];
const KING_DELTAS: readonly Delta[] = [...BISHOP_DELTAS, ...ROOK_DELTAS];
const QUEEN_DELTAS: readonly Delta[] = KING_DELTAS;

const PROMOTION_CHOICES: readonly PieceType[] = ['q', 'r', 'b', 'n'];

function pawnStep(color: Color): number {
  return color === 'w' ? 1 : -1;
}

function pawnStartRank(color: Color): number {
  return color === 'w' ? 1 : 6;
}

function promotionRank(color: Color): number {
  return color === 'w' ? 7 : 0;
}

/** sq 칸이 by 색에게 공격받고 있는지 확인한다. */
export function isSquareAttacked(pos: Position, sq: Square, by: Color): boolean {
  const file = fileOf(sq);
  const rank = rankOf(sq);

  // 폰 공격: by 색 폰은 자기 진행 방향으로 대각선을 공격하므로
  // sq 를 공격하는 폰은 sq 의 진행 반대쪽 대각선에 있다.
  const pawnRank = rank - pawnStep(by);
  for (const df of [-1, 1]) {
    const f = file + df;
    if (!onBoard(f, pawnRank)) continue;
    const p = pos.board[squareAt(f, pawnRank)];
    if (p && p.color === by && p.type === 'p') return true;
  }

  // 나이트
  for (const [df, dr] of KNIGHT_DELTAS) {
    const f = file + df;
    const r = rank + dr;
    if (!onBoard(f, r)) continue;
    const p = pos.board[squareAt(f, r)];
    if (p && p.color === by && p.type === 'n') return true;
  }

  // 킹
  for (const [df, dr] of KING_DELTAS) {
    const f = file + df;
    const r = rank + dr;
    if (!onBoard(f, r)) continue;
    const p = pos.board[squareAt(f, r)];
    if (p && p.color === by && p.type === 'k') return true;
  }

  // 직선/대각선 슬라이딩 (룩·비숍·퀸)
  const slide = (deltas: readonly Delta[], types: readonly PieceType[]) => {
    for (const [df, dr] of deltas) {
      let f = file + df;
      let r = rank + dr;
      while (onBoard(f, r)) {
        const p = pos.board[squareAt(f, r)];
        if (p) {
          if (p.color === by && types.includes(p.type)) return true;
          break;
        }
        f += df;
        r += dr;
      }
    }
    return false;
  };

  if (slide(ROOK_DELTAS, ['r', 'q'])) return true;
  if (slide(BISHOP_DELTAS, ['b', 'q'])) return true;

  return false;
}

/** color 쪽 킹이 체크 상태인가? (킹이 없는 연습용 배치에서는 false) */
export function isInCheck(pos: Position, color: Color): boolean {
  const king = findKing(pos, color);
  if (king === null) return false;
  return isSquareAttacked(pos, king, opposite(color));
}

function addPawnMoves(pos: Position, from: Square, piece: Piece, out: Move[]): void {
  const color = piece.color;
  const step = pawnStep(color);
  const file = fileOf(from);
  const rank = rankOf(from);
  const promoRank = promotionRank(color);

  // 한 칸 전진
  const oneRank = rank + step;
  if (onBoard(file, oneRank)) {
    const one = squareAt(file, oneRank);
    if (!pos.board[one]) {
      if (oneRank === promoRank) {
        for (const promotion of PROMOTION_CHOICES) {
          out.push({ from, to: one, piece: 'p', color, promotion });
        }
      } else {
        out.push({ from, to: one, piece: 'p', color });
      }

      // 두 칸 전진
      if (rank === pawnStartRank(color)) {
        const twoRank = rank + step * 2;
        const two = squareAt(file, twoRank);
        if (!pos.board[two]) {
          out.push({ from, to: two, piece: 'p', color, doublePawn: true });
        }
      }
    }
  }

  // 대각선 잡기 + 앙파상
  for (const df of [-1, 1]) {
    const f = file + df;
    if (!onBoard(f, oneRank)) continue;
    const target = squareAt(f, oneRank);
    const occupant = pos.board[target];
    if (occupant && occupant.color !== color) {
      if (oneRank === promoRank) {
        for (const promotion of PROMOTION_CHOICES) {
          out.push({ from, to: target, piece: 'p', color, captured: occupant.type, promotion });
        }
      } else {
        out.push({ from, to: target, piece: 'p', color, captured: occupant.type });
      }
    } else if (!occupant && pos.ep === target) {
      out.push({ from, to: target, piece: 'p', color, captured: 'p', enPassant: true });
    }
  }
}

function addStepMoves(
  pos: Position,
  from: Square,
  piece: Piece,
  deltas: readonly Delta[],
  out: Move[],
): void {
  const file = fileOf(from);
  const rank = rankOf(from);
  for (const [df, dr] of deltas) {
    const f = file + df;
    const r = rank + dr;
    if (!onBoard(f, r)) continue;
    const to = squareAt(f, r);
    const occupant = pos.board[to];
    if (occupant && occupant.color === piece.color) continue;
    out.push({
      from,
      to,
      piece: piece.type,
      color: piece.color,
      ...(occupant ? { captured: occupant.type } : {}),
    });
  }
}

function addSlideMoves(
  pos: Position,
  from: Square,
  piece: Piece,
  deltas: readonly Delta[],
  out: Move[],
): void {
  const file = fileOf(from);
  const rank = rankOf(from);
  for (const [df, dr] of deltas) {
    let f = file + df;
    let r = rank + dr;
    while (onBoard(f, r)) {
      const to = squareAt(f, r);
      const occupant = pos.board[to];
      if (occupant) {
        if (occupant.color !== piece.color) {
          out.push({ from, to, piece: piece.type, color: piece.color, captured: occupant.type });
        }
        break;
      }
      out.push({ from, to, piece: piece.type, color: piece.color });
      f += df;
      r += dr;
    }
  }
}

interface CastleSpec {
  king: Square;
  rook: Square;
  /** 비어 있어야 하는 칸 */
  empty: readonly Square[];
  /** 공격받지 않아야 하는 칸 (킹이 지나가거나 도착하는 칸) */
  safe: readonly Square[];
  side: 'k' | 'q';
}

const CASTLE_SPECS: Record<Color, readonly CastleSpec[]> = {
  w: [
    { king: 4, rook: 7, empty: [5, 6], safe: [4, 5, 6], side: 'k' },
    { king: 4, rook: 0, empty: [1, 2, 3], safe: [4, 3, 2], side: 'q' },
  ],
  b: [
    { king: 60, rook: 63, empty: [61, 62], safe: [60, 61, 62], side: 'k' },
    { king: 60, rook: 56, empty: [57, 58, 59], safe: [60, 59, 58], side: 'q' },
  ],
};

function hasRight(pos: Position, color: Color, side: 'k' | 'q'): boolean {
  if (color === 'w') return side === 'k' ? pos.castling.wk : pos.castling.wq;
  return side === 'k' ? pos.castling.bk : pos.castling.bq;
}

function addCastleMoves(pos: Position, color: Color, out: Move[]): void {
  const enemy = opposite(color);
  for (const spec of CASTLE_SPECS[color]) {
    if (!hasRight(pos, color, spec.side)) continue;
    const king = pos.board[spec.king];
    const rook = pos.board[spec.rook];
    if (!king || king.type !== 'k' || king.color !== color) continue;
    if (!rook || rook.type !== 'r' || rook.color !== color) continue;
    if (spec.empty.some((sq) => pos.board[sq])) continue;
    if (spec.safe.some((sq) => isSquareAttacked(pos, sq, enemy))) continue;
    out.push({
      from: spec.king,
      to: spec.safe[spec.safe.length - 1]!,
      piece: 'k',
      color,
      castle: spec.side,
    });
  }
}

/** 킹 안전성을 검사하지 않은 수 목록 */
export function generatePseudoMoves(pos: Position, color: Color = pos.turn, from?: Square): Move[] {
  const out: Move[] = [];
  const squares = from === undefined ? null : [from];
  const list = squares ?? Array.from({ length: 64 }, (_, i) => i);

  for (const sq of list) {
    const piece = pos.board[sq];
    if (!piece || piece.color !== color) continue;
    switch (piece.type) {
      case 'p':
        addPawnMoves(pos, sq, piece, out);
        break;
      case 'n':
        addStepMoves(pos, sq, piece, KNIGHT_DELTAS, out);
        break;
      case 'b':
        addSlideMoves(pos, sq, piece, BISHOP_DELTAS, out);
        break;
      case 'r':
        addSlideMoves(pos, sq, piece, ROOK_DELTAS, out);
        break;
      case 'q':
        addSlideMoves(pos, sq, piece, QUEEN_DELTAS, out);
        break;
      case 'k':
        addStepMoves(pos, sq, piece, KING_DELTAS, out);
        break;
    }
  }

  if (from === undefined || pos.board[from]?.type === 'k') {
    addCastleMoves(pos, color, out);
  }

  return out;
}

/**
 * 실제로 둘 수 있는 수 (킹이 잡히는 수를 제외).
 * 후보마다 배치를 복사하지 않고, 한 번 복사한 배치에서 두었다 되돌리며 검사한다.
 */
export function generateLegalMoves(pos: Position, from?: Square): Move[] {
  const color = pos.turn;
  const scratch = clonePosition(pos);
  const out: Move[] = [];
  for (const move of generatePseudoMoves(pos, color, from)) {
    const undo = makeMove(scratch, move);
    if (!isInCheck(scratch, color)) out.push(move);
    unmakeMove(scratch, move, undo);
  }
  return out;
}

function clearCastlingForSquare(castling: CastlingRights, sq: Square): void {
  if (sq === 0) castling.wq = false;
  else if (sq === 7) castling.wk = false;
  else if (sq === 56) castling.bq = false;
  else if (sq === 63) castling.bk = false;
}

/** unmakeMove 가 배치를 되돌리는 데 필요한 정보 */
export interface Undo {
  moved: Piece;
  captured: Piece | null;
  capturedSq: Square;
  castling: CastlingRights;
  ep: Square | null;
  halfmove: number;
  fullmove: number;
  hashLo: number;
  hashHi: number;
}

/**
 * 수를 배치에 직접 적용한다 (원본이 바뀜). 탐색처럼 수를 많이 둘 때 복사 비용을 없앤다.
 * Zobrist 해시를 증분으로 갱신한다. 되돌리려면 unmakeMove 에 반환값을 넘긴다.
 */
export function makeMove(pos: Position, move: Move): Undo {
  const board = pos.board;
  const moved = board[move.from];
  if (!moved) throw new Error(`출발 칸이 비어 있습니다: ${move.from}`);
  const color = moved.color;

  const undo: Undo = {
    moved,
    captured: null,
    capturedSq: move.to,
    castling: { ...pos.castling },
    ep: pos.ep,
    halfmove: pos.halfmove,
    fullmove: pos.fullmove,
    hashLo: pos.hashLo,
    hashHi: pos.hashHi,
  };

  let lo = pos.hashLo ^ castleHashLo(pos.castling) ^ epHashLo(pos.ep) ^ SIDE_HASH_LO;
  let hi = pos.hashHi ^ castleHashHi(pos.castling) ^ epHashHi(pos.ep) ^ SIDE_HASH_HI;

  // 잡기 (앙파상은 도착 칸이 아니라 지나간 폰의 칸)
  const capturedSq = move.enPassant ? squareAt(fileOf(move.to), rankOf(move.from)) : move.to;
  const captured = board[capturedSq];
  if (captured) {
    undo.captured = captured;
    undo.capturedSq = capturedSq;
    board[capturedSq] = null;
    lo ^= pieceHashLo(captured, capturedSq);
    hi ^= pieceHashHi(captured, capturedSq);
  }

  // 말 옮기기 (승격이면 새 말)
  board[move.from] = null;
  lo ^= pieceHashLo(moved, move.from);
  hi ^= pieceHashHi(moved, move.from);
  const placed: Piece = move.promotion ? { type: move.promotion, color } : moved;
  board[move.to] = placed;
  lo ^= pieceHashLo(placed, move.to);
  hi ^= pieceHashHi(placed, move.to);

  // 캐슬링이면 룩도 옮긴다: 킹사이드는 킹의 왼쪽, 퀸사이드는 킹의 오른쪽에 놓인다.
  if (move.castle) {
    const spec = CASTLE_SPECS[color].find((s) => s.side === move.castle)!;
    const rook = board[spec.rook]!;
    const rookTarget = move.castle === 'k' ? move.to - 1 : move.to + 1;
    board[spec.rook] = null;
    board[rookTarget] = rook;
    lo ^= pieceHashLo(rook, spec.rook) ^ pieceHashLo(rook, rookTarget);
    hi ^= pieceHashHi(rook, spec.rook) ^ pieceHashHi(rook, rookTarget);
  }

  // 캐슬링 권리 갱신
  if (moved.type === 'k') {
    if (color === 'w') {
      pos.castling.wk = false;
      pos.castling.wq = false;
    } else {
      pos.castling.bk = false;
      pos.castling.bq = false;
    }
  }
  clearCastlingForSquare(pos.castling, move.from);
  clearCastlingForSquare(pos.castling, move.to);

  // 앙파상 대상 칸, 50수 규칙, 수 번호, 차례
  pos.ep = move.doublePawn ? squareAt(fileOf(move.from), (rankOf(move.from) + rankOf(move.to)) / 2) : null;
  pos.halfmove = move.piece === 'p' || captured ? 0 : pos.halfmove + 1;
  if (color === 'b') pos.fullmove += 1;
  pos.turn = opposite(color);

  pos.hashLo = lo ^ castleHashLo(pos.castling) ^ epHashLo(pos.ep);
  pos.hashHi = hi ^ castleHashHi(pos.castling) ^ epHashHi(pos.ep);
  return undo;
}

/** makeMove 를 되돌린다. */
export function unmakeMove(pos: Position, move: Move, undo: Undo): void {
  const board = pos.board;
  const color = undo.moved.color;
  board[move.from] = undo.moved;
  board[move.to] = null;
  if (undo.captured) board[undo.capturedSq] = undo.captured;
  if (move.castle) {
    const spec = CASTLE_SPECS[color].find((s) => s.side === move.castle)!;
    const rookTarget = move.castle === 'k' ? move.to - 1 : move.to + 1;
    board[spec.rook] = board[rookTarget];
    board[rookTarget] = null;
  }
  pos.castling = undo.castling;
  pos.ep = undo.ep;
  pos.halfmove = undo.halfmove;
  pos.fullmove = undo.fullmove;
  pos.turn = color;
  pos.hashLo = undo.hashLo;
  pos.hashHi = undo.hashHi;
}

/** 수를 적용한 새 Position 을 반환한다 (원본은 바뀌지 않음). */
export function applyMove(pos: Position, move: Move): Position {
  const next = clonePosition(pos);
  makeMove(next, move);
  return next;
}

/** from→to 에 해당하는 합법 수를 찾는다 (승격 지정 가능). */
export function findMove(
  pos: Position,
  from: Square,
  to: Square,
  promotion?: PieceType,
): Move | null {
  const candidates = generateLegalMoves(pos, from).filter((m) => m.to === to);
  if (candidates.length === 0) return null;
  if (promotion) {
    return candidates.find((m) => m.promotion === promotion) ?? null;
  }
  return candidates[0]!;
}

export function movesEqual(a: Move, b: Move): boolean {
  return a.from === b.from && a.to === b.to && a.promotion === b.promotion;
}
