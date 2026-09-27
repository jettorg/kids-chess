import type { Color, Move, PieceType, Position } from '../engine/types';
import { PIECE_VALUE } from '../engine/types';
import { applyMove, generateLegalMoves, isInCheck, isSquareAttacked } from '../engine/moves';
import { opposite, positionKey } from '../engine/position';

/** 1=병아리, 2=강아지, 3=여우, 4=곰, 5=부엉이 */
export type AiLevel = 1 | 2 | 3 | 4 | 5;

/** 난이도 목록. 이름과 설명은 i18n 사전의 level1/level1Hint … 키에 있다. */
export const AI_LEVELS: readonly AiLevel[] = [1, 2, 3, 4, 5];

const MATE_SCORE = 100000;
/** 정지 탐색이 잡기 사슬을 따라가는 최대 깊이 */
const MAX_QUIESCE_DEPTH = 8;

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

function scoreMoveForOrdering(move: Move): number {
  let score = 0;
  // 값싼 말로 비싼 말을 잡는 수를 먼저 본다 (MVV-LVA)
  if (move.captured) score += 10 * PIECE_VALUE[move.captured] - PIECE_VALUE[move.piece];
  if (move.promotion) score += PIECE_VALUE[move.promotion];
  if (move.castle) score += 50;
  return score;
}

/** 잡기·승격을 먼저 보도록 수를 정렬한다 (알파베타 가지치기 효율 향상). */
function orderMoves(moves: Move[]): Move[] {
  return moves.slice().sort((a, b) => scoreMoveForOrdering(b) - scoreMoveForOrdering(a));
}

/** 전치 테이블 항목. 점수는 항상 루트 색 관점이라 노드 종류와 무관하게 비교할 수 있다. */
interface TableEntry {
  depth: number;
  score: number;
  /** exact=정확, lower=실제값은 이 이상, upper=실제값은 이 이하 */
  flag: 'exact' | 'lower' | 'upper';
  bestFrom: number;
  bestTo: number;
}

const TABLE_LIMIT = 200_000;

interface SearchContext {
  nodes: number;
  aborted: boolean;
  deadline: number | null;
  now: () => number;
  /** 같은 배치를 다시 만나면 이전 결과와 최선수를 재활용한다 */
  table: Map<string, TableEntry>;
}

function tableStore(ctx: SearchContext, key: string, entry: TableEntry): void {
  if (ctx.table.size >= TABLE_LIMIT) ctx.table.clear();
  const existing = ctx.table.get(key);
  if (!existing || existing.depth <= entry.depth) ctx.table.set(key, entry);
}

/** 전치 테이블의 최선수를 맨 앞으로 옮긴다 (가지치기가 훨씬 빨라진다). */
function orderWithHint(moves: Move[], hint: TableEntry | undefined): Move[] {
  const ordered = orderMoves(moves);
  if (!hint) return ordered;
  const index = ordered.findIndex((m) => m.from === hint.bestFrom && m.to === hint.bestTo);
  if (index > 0) {
    const [best] = ordered.splice(index, 1);
    ordered.unshift(best!);
  }
  return ordered;
}

function checkTime(ctx: SearchContext): void {
  if (ctx.deadline !== null && (ctx.nodes & 511) === 0 && ctx.now() >= ctx.deadline) {
    ctx.aborted = true;
  }
}

function terminalScore(pos: Position, depth: number, rootColor: Color): number {
  if (isInCheck(pos, pos.turn)) {
    // 체크메이트: 빨리 끝나는 메이트를 더 높게 평가한다.
    return pos.turn === rootColor ? -MATE_SCORE - depth : MATE_SCORE + depth;
  }
  return 0; // 스테일메이트
}

/**
 * 정지 탐색. 탐색 깊이가 다한 자리에서 잡기와 승격만 계속 따라가,
 * "잡았더니 바로 되잡히는" 수를 좋은 수로 착각하지 않게 한다.
 */
function quiesce(
  pos: Position,
  alpha: number,
  beta: number,
  rootColor: Color,
  ctx: SearchContext,
  qDepth: number,
): number {
  ctx.nodes++;
  checkTime(ctx);
  if (ctx.aborted) return 0;

  const moves = generateLegalMoves(pos);
  if (moves.length === 0) return terminalScore(pos, 0, rootColor);

  const maximizing = pos.turn === rootColor;
  const inCheck = isInCheck(pos, pos.turn);

  let best: number;
  let candidates: Move[];
  if (inCheck || qDepth >= MAX_QUIESCE_DEPTH) {
    // 체크 중이면 가만히 있을 수 없으므로 모든 수를 본다.
    // 깊이 한도에 닿으면 정적 평가로 마무리한다.
    if (!inCheck) return evaluate(pos, rootColor);
    best = maximizing ? -Infinity : Infinity;
    candidates = moves;
  } else {
    // 가만히 있어도 되는 점수(stand pat)를 기준으로 잡기만 검토한다.
    best = evaluate(pos, rootColor);
    if (maximizing) {
      if (best >= beta) return best;
      if (best > alpha) alpha = best;
    } else {
      if (best <= alpha) return best;
      if (best < beta) beta = best;
    }
    candidates = moves.filter((m) => m.captured || m.promotion);
  }

  for (const move of orderMoves(candidates)) {
    const score = quiesce(applyMove(pos, move), alpha, beta, rootColor, ctx, qDepth + 1);
    if (ctx.aborted) return 0;
    if (maximizing) {
      if (score > best) best = score;
      if (best > alpha) alpha = best;
    } else {
      if (score < best) best = score;
      if (best < beta) beta = best;
    }
    if (beta <= alpha) break;
  }
  return best;
}

function search(
  pos: Position,
  depth: number,
  alpha: number,
  beta: number,
  rootColor: Color,
  ctx: SearchContext,
): number {
  ctx.nodes++;
  checkTime(ctx);
  if (ctx.aborted) return 0;

  const moves = generateLegalMoves(pos);
  if (moves.length === 0) return terminalScore(pos, depth, rootColor);
  if (depth === 0) return quiesce(pos, alpha, beta, rootColor, ctx, 0);

  const key = positionKey(pos);
  const cached = ctx.table.get(key);
  if (cached && cached.depth >= depth) {
    if (cached.flag === 'exact') return cached.score;
    if (cached.flag === 'lower' && cached.score >= beta) return cached.score;
    if (cached.flag === 'upper' && cached.score <= alpha) return cached.score;
  }

  const alphaOrig = alpha;
  const betaOrig = beta;
  const maximizing = pos.turn === rootColor;
  let best = maximizing ? -Infinity : Infinity;
  let bestMove: Move | null = null;

  for (const move of orderWithHint(moves, cached)) {
    const score = search(applyMove(pos, move), depth - 1, alpha, beta, rootColor, ctx);
    if (ctx.aborted) return 0;
    if (maximizing) {
      if (score > best) {
        best = score;
        bestMove = move;
      }
      if (best > alpha) alpha = best;
    } else {
      if (score < best) {
        best = score;
        bestMove = move;
      }
      if (best < beta) beta = best;
    }
    if (beta <= alpha) break;
  }

  if (bestMove) {
    const flag = best <= alphaOrig ? 'upper' : best >= betaOrig ? 'lower' : 'exact';
    tableStore(ctx, key, { depth, score: best, flag, bestFrom: bestMove.from, bestTo: bestMove.to });
  }
  return best;
}

export interface SearchOptions {
  /** 이 시간이 지나면 마지막으로 끝낸 깊이의 답을 쓴다 (반복 심화) */
  timeMs?: number;
  /** 테스트용 시계 */
  now?: () => number;
}

export interface SearchResult {
  move: Move | null;
  score: number;
  /** 실제로 끝까지 탐색한 깊이 */
  depth: number;
  nodes: number;
}

function searchRoot(
  pos: Position,
  depth: number,
  ordered: Move[],
  rootColor: Color,
  ctx: SearchContext,
  random: () => number,
): { move: Move; score: number } | null {
  let bestScore = -Infinity;
  let bestMoves: Move[] = [];
  let alpha = -Infinity;
  for (const move of ordered) {
    const score = search(applyMove(pos, move), depth - 1, alpha, Infinity, rootColor, ctx);
    if (ctx.aborted) return null;
    if (score > bestScore + 1e-9) {
      bestScore = score;
      bestMoves = [move];
      if (score > alpha) alpha = score;
    } else if (Math.abs(score - bestScore) < 1e-9) {
      bestMoves.push(move);
    }
  }
  const pick = bestMoves[Math.floor(random() * bestMoves.length)] ?? bestMoves[0]!;
  return { move: pick, score: bestScore };
}

/**
 * 반복 심화 알파베타 탐색. 깊이 1부터 maxDepth 까지 차례로 탐색하고,
 * 시간 예산이 있으면 예산 안에 끝낸 가장 깊은 결과를 쓴다.
 */
export function searchBestMove(
  pos: Position,
  maxDepth: number,
  random: () => number = Math.random,
  options: SearchOptions = {},
): SearchResult {
  const moves = generateLegalMoves(pos);
  if (moves.length === 0) return { move: null, score: 0, depth: 0, nodes: 0 };

  const now = options.now ?? (() => (typeof performance !== 'undefined' ? performance.now() : Date.now()));
  const ctx: SearchContext = {
    nodes: 0,
    aborted: false,
    deadline: options.timeMs !== undefined ? now() + options.timeMs : null,
    now,
    table: new Map(),
  };

  const rootColor = pos.turn;
  let ordered = orderMoves(moves);
  let best: SearchResult = { move: ordered[0]!, score: 0, depth: 0, nodes: 0 };

  for (let depth = 1; depth <= maxDepth; depth++) {
    const result = searchRoot(pos, depth, ordered, rootColor, ctx, random);
    if (!result || ctx.aborted) break;
    best = { move: result.move, score: result.score, depth, nodes: ctx.nodes };
    // 다음 깊이에서는 방금 찾은 최선수를 먼저 보아 가지치기를 돕는다.
    ordered = [result.move, ...ordered.filter((m) => m !== result.move)];
    // 메이트를 찾았으면 더 깊이 볼 이유가 없다.
    if (Math.abs(result.score) >= MATE_SCORE) break;
  }
  return best;
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

function randomMove(pos: Position, random: () => number): Move | null {
  const moves = generateLegalMoves(pos);
  if (moves.length === 0) return null;
  return moves[Math.floor(random() * moves.length)] ?? moves[0]!;
}

export interface ChooseOptions {
  level: AiLevel;
  random?: () => number;
}

/** 난이도별 탐색 설정. 시간 예산은 기기가 느려도 응답이 늦어지지 않게 한다. */
const LEVEL_SEARCH: Record<3 | 4 | 5, { maxDepth: number; timeMs: number }> = {
  3: { maxDepth: 3, timeMs: 900 },
  4: { maxDepth: 6, timeMs: 1500 },
  5: { maxDepth: 9, timeMs: 3500 },
};

/** 난이도에 맞는 컴퓨터의 수를 고른다. */
export function chooseMove(pos: Position, options: ChooseOptions): Move | null {
  const random = options.random ?? Math.random;
  switch (options.level) {
    case 1:
      return randomMove(pos, random);
    case 2:
      return greedyMove(pos, random);
    case 3:
    case 4:
    case 5: {
      const cfg = LEVEL_SEARCH[options.level];
      return searchBestMove(pos, cfg.maxDepth, random, { timeMs: cfg.timeMs }).move;
    }
  }
}

/** 힌트용: 아이에게 추천할 좋은 수 */
export function suggestMove(pos: Position): Move | null {
  return searchBestMove(pos, 4, () => 0.5, { timeMs: 1200 }).move;
}
