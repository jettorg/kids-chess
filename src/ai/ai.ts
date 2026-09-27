import type { Color, Move, PieceType, Position } from '../engine/types';
import { PIECE_VALUE } from '../engine/types';
import { applyMove, generateLegalMoves, isInCheck, isSquareAttacked } from '../engine/moves';
import { opposite } from '../engine/position';

/** 1=병아리(아주 쉬움), 2=강아지(쉬움), 3=여우(보통) */
export type AiLevel = 1 | 2 | 3;

export const AI_LEVELS: { level: AiLevel; label: string; hint: string }[] = [
  { level: 1, label: '🐣 병아리', hint: '아무 데나 두어요. 처음 배울 때 좋아요.' },
  { level: 2, label: '🐶 강아지', hint: '잡을 수 있으면 잡아요.' },
  { level: 3, label: '🦊 여우', hint: '몇 수 앞을 봐요. 제법 잘 둬요.' },
];

const MATE_SCORE = 100000;

// 칸별 가산점 (백 기준, a1 = index 0). 중앙을 선호하게 만든다.
const PAWN_PST = [
  0, 0, 0, 0, 0, 0, 0, 0,
  5, 10, 10, -20, -20, 10, 10, 5,
  5, -5, -10, 0, 0, -10, -5, 5,
  0, 0, 0, 20, 20, 0, 0, 0,
  5, 5, 10, 25, 25, 10, 5, 5,
  10, 10, 20, 30, 30, 20, 10, 10,
  50, 50, 50, 50, 50, 50, 50, 50,
  0, 0, 0, 0, 0, 0, 0, 0,
];

const KNIGHT_PST = [
  -50, -40, -30, -30, -30, -30, -40, -50,
  -40, -20, 0, 5, 5, 0, -20, -40,
  -30, 5, 10, 15, 15, 10, 5, -30,
  -30, 0, 15, 20, 20, 15, 0, -30,
  -30, 5, 15, 20, 20, 15, 5, -30,
  -30, 0, 10, 15, 15, 10, 0, -30,
  -40, -20, 0, 0, 0, 0, -20, -40,
  -50, -40, -30, -30, -30, -30, -40, -50,
];

const BISHOP_PST = [
  -20, -10, -10, -10, -10, -10, -10, -20,
  -10, 5, 0, 0, 0, 0, 5, -10,
  -10, 10, 10, 10, 10, 10, 10, -10,
  -10, 0, 10, 10, 10, 10, 0, -10,
  -10, 5, 5, 10, 10, 5, 5, -10,
  -10, 0, 5, 10, 10, 5, 0, -10,
  -10, 0, 0, 0, 0, 0, 0, -10,
  -20, -10, -10, -10, -10, -10, -10, -20,
];

const ROOK_PST = [
  0, 0, 0, 5, 5, 0, 0, 0,
  -5, 0, 0, 0, 0, 0, 0, -5,
  -5, 0, 0, 0, 0, 0, 0, -5,
  -5, 0, 0, 0, 0, 0, 0, -5,
  -5, 0, 0, 0, 0, 0, 0, -5,
  -5, 0, 0, 0, 0, 0, 0, -5,
  5, 10, 10, 10, 10, 10, 10, 5,
  0, 0, 0, 0, 0, 0, 0, 0,
];

const QUEEN_PST = [
  -20, -10, -10, -5, -5, -10, -10, -20,
  -10, 0, 5, 0, 0, 0, 0, -10,
  -10, 5, 5, 5, 5, 5, 0, -10,
  0, 0, 5, 5, 5, 5, 0, -5,
  -5, 0, 5, 5, 5, 5, 0, -5,
  -10, 0, 5, 5, 5, 5, 0, -10,
  -10, 0, 0, 0, 0, 0, 0, -10,
  -20, -10, -10, -5, -5, -10, -10, -20,
];

const KING_PST = [
  20, 30, 10, 0, 0, 10, 30, 20,
  20, 20, 0, 0, 0, 0, 20, 20,
  -10, -20, -20, -20, -20, -20, -20, -10,
  -20, -30, -30, -40, -40, -30, -30, -20,
  -30, -40, -40, -50, -50, -40, -40, -30,
  -30, -40, -40, -50, -50, -40, -40, -30,
  -30, -40, -40, -50, -50, -40, -40, -30,
  -30, -40, -40, -50, -50, -40, -40, -30,
];

const PST: Record<PieceType, number[]> = {
  p: PAWN_PST,
  n: KNIGHT_PST,
  b: BISHOP_PST,
  r: ROOK_PST,
  q: QUEEN_PST,
  k: KING_PST,
};

/** 배치를 color 관점의 점수로 평가한다 (양수면 color 가 유리). */
export function evaluate(pos: Position, color: Color): number {
  let score = 0;
  for (let sq = 0; sq < 64; sq++) {
    const piece = pos.board[sq];
    if (!piece) continue;
    const mirrored = piece.color === 'w' ? sq : sq ^ 56;
    const value = (piece.type === 'k' ? 0 : PIECE_VALUE[piece.type]) + PST[piece.type][mirrored]!;
    score += piece.color === color ? value : -value;
  }
  return score;
}

/** 잡기·승격을 먼저 보도록 수를 정렬한다 (알파베타 가지치기 효율 향상). */
function orderMoves(moves: Move[]): Move[] {
  return moves.slice().sort((a, b) => scoreMoveForOrdering(b) - scoreMoveForOrdering(a));
}

function scoreMoveForOrdering(move: Move): number {
  let score = 0;
  if (move.captured) score += 10 * PIECE_VALUE[move.captured] - PIECE_VALUE[move.piece];
  if (move.promotion) score += PIECE_VALUE[move.promotion];
  if (move.castle) score += 50;
  return score;
}

interface SearchResult {
  move: Move | null;
  score: number;
}

function negamax(
  pos: Position,
  depth: number,
  alpha: number,
  beta: number,
  rootColor: Color,
): number {
  const moves = generateLegalMoves(pos);
  if (moves.length === 0) {
    if (isInCheck(pos, pos.turn)) {
      // 체크메이트: 빨리 끝나는 메이트를 더 높게 평가한다.
      return pos.turn === rootColor ? -MATE_SCORE - depth : MATE_SCORE + depth;
    }
    return 0; // 스테일메이트
  }
  if (depth === 0) {
    return evaluate(pos, rootColor);
  }

  const maximizing = pos.turn === rootColor;
  let best = maximizing ? -Infinity : Infinity;
  let a = alpha;
  let b = beta;

  for (const move of orderMoves(moves)) {
    const score = negamax(applyMove(pos, move), depth - 1, a, b, rootColor);
    if (maximizing) {
      if (score > best) best = score;
      if (best > a) a = best;
    } else {
      if (score < best) best = score;
      if (best < b) b = best;
    }
    if (b <= a) break;
  }
  return best;
}

/** 알파베타 탐색으로 최선의 수를 찾는다. */
export function searchBestMove(pos: Position, depth: number, random = Math.random): SearchResult {
  const moves = generateLegalMoves(pos);
  if (moves.length === 0) return { move: null, score: 0 };

  const rootColor = pos.turn;
  let bestScore = -Infinity;
  let bestMoves: Move[] = [];

  for (const move of orderMoves(moves)) {
    const score = negamax(applyMove(pos, move), depth - 1, -Infinity, Infinity, rootColor);
    if (score > bestScore + 1e-9) {
      bestScore = score;
      bestMoves = [move];
    } else if (Math.abs(score - bestScore) < 1e-9) {
      bestMoves.push(move);
    }
  }

  const pick = bestMoves[Math.floor(random() * bestMoves.length)] ?? bestMoves[0]!;
  return { move: pick, score: bestScore };
}

/** 1수만 보는 욕심쟁이 선택: 잡을 수 있으면 잡고, 공짜로 잡히는 자리는 피한다. */
function greedyMove(pos: Position, random: () => number): Move | null {
  const moves = generateLegalMoves(pos);
  if (moves.length === 0) return null;
  const me = pos.turn;
  const enemy = opposite(me);

  let bestScore = -Infinity;
  let best: Move[] = [];
  for (const move of moves) {
    const after = applyMove(pos, move);
    let score = move.captured ? PIECE_VALUE[move.captured] : 0;
    if (move.promotion) score += PIECE_VALUE[move.promotion];
    // 상대가 바로 잡을 수 있는 자리면 감점
    if (isSquareAttacked(after, move.to, enemy)) score -= PIECE_VALUE[move.promotion ?? move.piece] * 0.9;
    // 체크는 보너스, 메이트는 최우선
    if (isInCheck(after, enemy)) {
      score += 30;
      if (generateLegalMoves(after).length === 0) score += MATE_SCORE;
    }
    score += random() * 10; // 같은 점수면 매번 다르게 두도록
    if (score > bestScore) {
      bestScore = score;
      best = [move];
    } else if (score === bestScore) {
      best.push(move);
    }
  }
  return best[Math.floor(random() * best.length)] ?? best[0]!;
}

/** 아무 수나 고르되, 한 수 메이트는 놓치지 않는다. */
function randomMove(pos: Position, random: () => number): Move | null {
  const moves = generateLegalMoves(pos);
  if (moves.length === 0) return null;
  return moves[Math.floor(random() * moves.length)] ?? moves[0]!;
}

export interface ChooseOptions {
  level: AiLevel;
  random?: () => number;
}

/** 난이도에 맞는 컴퓨터의 수를 고른다. */
export function chooseMove(pos: Position, options: ChooseOptions): Move | null {
  const random = options.random ?? Math.random;
  switch (options.level) {
    case 1:
      return randomMove(pos, random);
    case 2:
      return greedyMove(pos, random);
    case 3:
      return searchBestMove(pos, 3, random).move;
  }
}

/** 힌트용: 아이에게 추천할 좋은 수 */
export function suggestMove(pos: Position): Move | null {
  return searchBestMove(pos, 3, () => 0.5).move;
}
