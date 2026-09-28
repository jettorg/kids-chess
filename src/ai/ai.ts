import type { Color, Move, PieceType, Position } from '../engine/types';
import { PIECE_VALUE } from '../engine/types';
import {
  applyMove,
  findMove,
  generateLegalMoves,
  generatePseudoMoves,
  isInCheck,
  isSquareAttacked,
  makeMove,
  unmakeMove,
} from '../engine/moves';
import { clonePosition, fileOf, fromAlgebraic, initialPosition, opposite, positionKey, rankOf } from '../engine/position';
import { computeHash, hashKey } from '../engine/zobrist';

/** 1=병아리, 2=강아지, 3=여우, 4=곰, 5=부엉이 */
export type AiLevel = 1 | 2 | 3 | 4 | 5;

/** 난이도 목록. 이름과 설명은 i18n 사전의 level1/level1Hint … 키에 있다. */
export const AI_LEVELS: readonly AiLevel[] = [1, 2, 3, 4, 5];

const MATE_SCORE = 100000;
/** 정지 탐색이 잡기 사슬을 따라가는 최대 깊이 */
const MAX_QUIESCE_DEPTH = 8;
const MAX_PLY = 64;
const TABLE_LIMIT = 300_000;

// ───────────────────────── 평가: PeSTO 표 (Ronald Friederich, 공개) ─────────────────────────
// 표는 백 기준이고 첫 칸이 a8 이다. 백 말은 sq ^ 56, 흑 말은 sq 로 읽는다.

const MG_VALUE: Record<PieceType, number> = { p: 82, n: 337, b: 365, r: 477, q: 1025, k: 0 };
const EG_VALUE: Record<PieceType, number> = { p: 94, n: 281, b: 297, r: 512, q: 936, k: 0 };
const PHASE_INC: Record<PieceType, number> = { p: 0, n: 1, b: 1, r: 2, q: 4, k: 0 };

const MG_PAWN = [
  0, 0, 0, 0, 0, 0, 0, 0, 98, 134, 61, 95, 68, 126, 34, -11, -6, 7, 26, 31, 65, 56, 25, -20, -14, 13, 6, 21, 23, 12, 17, -23,
  -27, -2, -5, 12, 17, 6, 10, -25, -26, -4, -4, -10, 3, 3, 33, -12, -35, -1, -20, -23, -15, 24, 38, -22, 0, 0, 0, 0, 0, 0, 0, 0,
];
const EG_PAWN = [
  0, 0, 0, 0, 0, 0, 0, 0, 178, 173, 158, 134, 147, 132, 165, 187, 94, 100, 85, 67, 56, 53, 82, 84, 32, 24, 13, 5, -2, 4, 17, 17,
  13, 9, -3, -7, -7, -8, 3, -1, 4, 7, -6, 1, 0, -5, -1, -8, 13, 8, 8, 10, 13, 0, 2, -7, 0, 0, 0, 0, 0, 0, 0, 0,
];
const MG_KNIGHT = [
  -167, -89, -34, -49, 61, -97, -15, -107, -73, -41, 72, 36, 23, 62, 7, -17, -47, 60, 37, 65, 84, 129, 73, 44, -9, 17, 19, 53, 37, 69, 18, 22,
  -13, 4, 16, 13, 28, 19, 21, -8, -23, -9, 12, 10, 19, 17, 25, -16, -29, -53, -12, -3, -1, 18, -14, -19, -105, -21, -58, -33, -17, -28, -19, -23,
];
const EG_KNIGHT = [
  -58, -38, -13, -28, -31, -27, -63, -99, -25, -8, -25, -2, -9, -25, -24, -52, -24, -20, 10, 9, -1, -9, -19, -41, -17, 3, 22, 22, 22, 11, 8, -18,
  -18, -6, 16, 25, 16, 17, 4, -18, -23, -3, -1, 15, 10, -3, -20, -22, -42, -20, -10, -5, -2, -20, -23, -44, -29, -51, -23, -15, -22, -18, -50, -64,
];
const MG_BISHOP = [
  -29, 4, -82, -37, -25, -42, 7, -8, -26, 16, -18, -13, 30, 59, 18, -47, -16, 37, 43, 40, 35, 50, 37, -2, -4, 5, 19, 50, 37, 37, 7, -2,
  -6, 13, 13, 26, 34, 12, 10, 4, 0, 15, 15, 15, 14, 27, 18, 10, 4, 15, 16, 0, 7, 21, 33, 1, -33, -3, -14, -21, -13, -12, -39, -21,
];
const EG_BISHOP = [
  -14, -21, -11, -8, -7, -9, -17, -24, -8, -4, 7, -12, -3, -13, -4, -14, 2, -8, 0, -1, -2, 6, 0, 4, -3, 9, 12, 9, 14, 10, 3, 2,
  -6, 3, 13, 19, 7, 10, -3, -9, -12, -3, 8, 10, 13, 3, -7, -15, -14, -18, -7, -1, 4, -9, -15, -27, -23, -9, -23, -5, -9, -16, -5, -17,
];
const MG_ROOK = [
  32, 42, 32, 51, 63, 9, 31, 43, 27, 32, 58, 62, 80, 67, 26, 44, -5, 19, 26, 36, 17, 45, 61, 16, -24, -11, 7, 26, 24, 35, -8, -20,
  -36, -26, -12, -1, 9, -7, 6, -23, -45, -25, -16, -17, 3, 0, -5, -33, -44, -16, -20, -9, -1, 11, -6, -71, -19, -13, 1, 17, 16, 7, -37, -26,
];
const EG_ROOK = [
  13, 10, 18, 15, 12, 12, 8, 5, 11, 13, 13, 11, -3, 3, 8, 3, 7, 7, 7, 5, 4, -3, -5, -3, 4, 3, 13, 1, 2, 1, -1, 2,
  3, 5, 8, 4, -5, -6, -8, -11, -4, 0, -5, -1, -7, -12, -8, -16, -6, -6, 0, 2, -9, -9, -11, -3, -9, 2, 3, -1, -5, -13, 4, -20,
];
const MG_QUEEN = [
  -28, 0, 29, 12, 59, 44, 43, 45, -24, -39, -5, 1, -16, 57, 28, 54, -13, -17, 7, 8, 29, 56, 47, 57, -27, -27, -16, -16, -1, 17, -2, 1,
  -9, -26, -9, -10, -2, -4, 3, -3, -14, 2, -11, -2, -5, 2, 14, 5, -35, -8, 11, 2, 8, 15, -3, 1, -1, -18, -9, 10, -15, -25, -31, -50,
];
const EG_QUEEN = [
  -9, 22, 22, 27, 27, 19, 10, 20, -17, 20, 32, 41, 58, 25, 30, 0, -20, 6, 9, 49, 47, 35, 19, 9, 3, 22, 24, 45, 57, 40, 57, 36,
  -18, 28, 19, 47, 31, 34, 39, 23, -16, -27, 15, 6, 9, 17, 10, 5, -22, -23, -30, -16, -16, -23, -36, -32, -33, -28, -22, -43, -5, -32, -20, -41,
];
const MG_KING = [
  -65, 23, 16, -15, -56, -34, 2, 13, 29, -1, -20, -7, -8, -4, -38, -29, -9, 24, 2, -16, -20, 6, 22, -22, -17, -20, -12, -27, -30, -25, -14, -36,
  -49, -1, -27, -39, -46, -44, -33, -51, -14, -14, -22, -46, -44, -30, -15, -27, 1, 7, -8, -64, -43, -16, 9, 8, -15, 36, 12, -54, 8, -28, 24, 14,
];
const EG_KING = [
  -74, -35, -18, -18, -11, 15, 4, -17, -12, 17, 14, 17, 17, 38, 23, 11, 10, 17, 23, 15, 20, 45, 44, 13, -8, 22, 24, 27, 26, 33, 26, 3,
  -18, -4, 21, 24, 27, 23, 9, -11, -19, -3, 11, 21, 23, 16, 7, -9, -27, -11, 4, 13, 14, 4, -5, -17, -53, -34, -21, -11, -28, -14, -24, -43,
];

const MG_TABLE: Record<PieceType, number[]> = { p: MG_PAWN, n: MG_KNIGHT, b: MG_BISHOP, r: MG_ROOK, q: MG_QUEEN, k: MG_KING };
const EG_TABLE: Record<PieceType, number[]> = { p: EG_PAWN, n: EG_KNIGHT, b: EG_BISHOP, r: EG_ROOK, q: EG_QUEEN, k: EG_KING };

/** 통과 폰 가산 (백 기준 랭크 0~7) — 종반에 더 크게 */
const PASSED_MG = [0, 4, 6, 12, 22, 40, 70, 0];
const PASSED_EG = [0, 10, 16, 28, 48, 80, 130, 0];
const DOUBLED_PENALTY = 12;
const ISOLATED_PENALTY = 14;

/**
 * 백 관점의 평가 점수 (양수면 백 유리). 재료와 칸 점수를 초반/종반 표로 섞고,
 * 폰 구조(통과·중복·고립)를 더한다.
 */
function evaluateWhite(pos: Position): number {
  let mg = 0;
  let eg = 0;
  let phase = 0;
  // 파일별 폰 정보: 백/흑 폰 개수, 백 폰 최대 랭크, 흑 폰 최소 랭크
  const wPawnCount = new Int8Array(8);
  const bPawnCount = new Int8Array(8);
  const wPawnSq: number[] = [];
  const bPawnSq: number[] = [];

  for (let sq = 0; sq < 64; sq++) {
    const piece = pos.board[sq];
    if (!piece) continue;
    const index = piece.color === 'w' ? sq ^ 56 : sq;
    const sign = piece.color === 'w' ? 1 : -1;
    mg += sign * (MG_VALUE[piece.type] + MG_TABLE[piece.type][index]!);
    eg += sign * (EG_VALUE[piece.type] + EG_TABLE[piece.type][index]!);
    phase += PHASE_INC[piece.type];
    if (piece.type === 'p') {
      if (piece.color === 'w') {
        wPawnCount[fileOf(sq)]!++;
        wPawnSq.push(sq);
      } else {
        bPawnCount[fileOf(sq)]!++;
        bPawnSq.push(sq);
      }
    }
  }

  // 폰 구조
  for (let f = 0; f < 8; f++) {
    const w = wPawnCount[f]!;
    const b = bPawnCount[f]!;
    if (w > 1) {
      mg -= DOUBLED_PENALTY * (w - 1);
      eg -= DOUBLED_PENALTY * (w - 1);
    }
    if (b > 1) {
      mg += DOUBLED_PENALTY * (b - 1);
      eg += DOUBLED_PENALTY * (b - 1);
    }
    const wNeighbors = (f > 0 ? wPawnCount[f - 1]! : 0) + (f < 7 ? wPawnCount[f + 1]! : 0);
    const bNeighbors = (f > 0 ? bPawnCount[f - 1]! : 0) + (f < 7 ? bPawnCount[f + 1]! : 0);
    if (w > 0 && wNeighbors === 0) {
      mg -= ISOLATED_PENALTY * w;
      eg -= ISOLATED_PENALTY * w;
    }
    if (b > 0 && bNeighbors === 0) {
      mg += ISOLATED_PENALTY * b;
      eg += ISOLATED_PENALTY * b;
    }
  }
  for (const sq of wPawnSq) {
    const f = fileOf(sq);
    const r = rankOf(sq);
    let passed = true;
    for (const other of bPawnSq) {
      if (Math.abs(fileOf(other) - f) <= 1 && rankOf(other) > r) {
        passed = false;
        break;
      }
    }
    if (passed) {
      mg += PASSED_MG[r]!;
      eg += PASSED_EG[r]!;
    }
  }
  for (const sq of bPawnSq) {
    const f = fileOf(sq);
    const r = rankOf(sq);
    let passed = true;
    for (const other of wPawnSq) {
      if (Math.abs(fileOf(other) - f) <= 1 && rankOf(other) < r) {
        passed = false;
        break;
      }
    }
    if (passed) {
      mg -= PASSED_MG[7 - r]!;
      eg -= PASSED_EG[7 - r]!;
    }
  }

  const mgPhase = Math.min(phase, 24);
  return Math.round((mg * mgPhase + eg * (24 - mgPhase)) / 24);
}

/** 배치를 color 관점의 점수로 평가한다 (양수면 color 가 유리). */
export function evaluate(pos: Position, color: Color): number {
  const white = evaluateWhite(pos);
  return color === 'w' ? white : -white;
}

// ───────────────────────── 탐색 ─────────────────────────

interface TableEntry {
  depth: number;
  score: number;
  /** exact=정확, lower=실제값은 이 이상, upper=실제값은 이 이하 */
  flag: 'exact' | 'lower' | 'upper';
  bestFrom: number;
  bestTo: number;
}

interface SearchContext {
  nodes: number;
  aborted: boolean;
  deadline: number | null;
  maxNodes: number | null;
  now: () => number;
  noTable: boolean;
  /** 같은 배치를 다시 만나면 이전 결과와 최선수를 재활용한다 */
  table: Map<number, TableEntry>;
  /** 킬러 무브: 같은 깊이에서 가지치기를 일으킨 조용한 수 (2개 × 깊이) */
  killers: Int32Array;
  /** 히스토리: 색 × from × to 별로 가지치기 기여도 */
  history: Int32Array;
}

function checkBudget(ctx: SearchContext): void {
  if (ctx.maxNodes !== null && ctx.nodes >= ctx.maxNodes) ctx.aborted = true;
  else if (ctx.deadline !== null && (ctx.nodes & 511) === 0 && ctx.now() >= ctx.deadline) ctx.aborted = true;
}

function tableStore(ctx: SearchContext, key: number, entry: TableEntry): void {
  if (ctx.noTable) return;
  if (ctx.table.size >= TABLE_LIMIT) ctx.table.clear();
  const existing = ctx.table.get(key);
  if (!existing || existing.depth <= entry.depth) ctx.table.set(key, entry);
}

/** 메이트 점수. 루트에서 가까운 메이트일수록 크게. */
function mateScore(sideToMoveIsRoot: boolean, ply: number): number {
  return sideToMoveIsRoot ? -(MATE_SCORE - ply) : MATE_SCORE - ply;
}

/** 메이트 점수인가 (100수 이내의 메이트) */
function isMateScore(score: number): boolean {
  return Math.abs(score) >= MATE_SCORE - 100;
}

function moveCode(move: Move): number {
  return move.from * 64 + move.to + 1;
}

function historyIndex(color: Color, move: Move): number {
  return (color === 'w' ? 0 : 4096) + move.from * 64 + move.to;
}

/** 수 정렬 점수: 전치 테이블 최선수 → 잡기(MVV-LVA) → 승격 → 킬러 → 히스토리 */
function orderScore(move: Move, color: Color, ctx: SearchContext, ply: number, hint: TableEntry | undefined): number {
  if (hint && move.from === hint.bestFrom && move.to === hint.bestTo) return 1_000_000_000;
  let score = 0;
  if (move.captured) score = 1_000_000 + 10 * PIECE_VALUE[move.captured] - PIECE_VALUE[move.piece];
  if (move.promotion) score += 500_000 + PIECE_VALUE[move.promotion];
  if (score > 0) return score;
  const code = moveCode(move);
  if (ctx.killers[ply * 2] === code) return 900_000;
  if (ctx.killers[ply * 2 + 1] === code) return 800_000;
  return ctx.history[historyIndex(color, move)]!;
}

function orderMoves(moves: Move[], color: Color, ctx: SearchContext, ply: number, hint: TableEntry | undefined): Move[] {
  const scored = moves.map((move) => ({ move, score: orderScore(move, color, ctx, ply, hint) }));
  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.move);
}

function rememberCutoff(ctx: SearchContext, move: Move, color: Color, ply: number, depth: number): void {
  if (move.captured || move.promotion) return;
  const code = moveCode(move);
  if (ctx.killers[ply * 2] !== code) {
    ctx.killers[ply * 2 + 1] = ctx.killers[ply * 2]!;
    ctx.killers[ply * 2] = code;
  }
  ctx.history[historyIndex(color, move)] += depth * depth;
}

/**
 * 정지 탐색. 탐색 깊이가 다한 자리에서 잡기와 승격만 계속 따라가,
 * "잡았더니 바로 되잡히는" 수를 좋은 수로 착각하지 않게 한다.
 * 배치는 두었다 되돌리며(make/unmake) 탐색한다.
 */
function quiesce(pos: Position, alpha: number, beta: number, rootColor: Color, ctx: SearchContext, qDepth: number, ply: number): number {
  ctx.nodes++;
  checkBudget(ctx);
  if (ctx.aborted) return 0;

  const mover = pos.turn;
  const maximizing = mover === rootColor;
  const inCheck = isInCheck(pos, mover);

  let best: number;
  let candidates: Move[];
  if (inCheck) {
    // 체크 중이면 가만히 있을 수 없으므로 모든 수를 본다.
    best = maximizing ? -Infinity : Infinity;
    candidates = generatePseudoMoves(pos, mover);
  } else {
    // 가만히 있어도 되는 점수(stand pat)를 기준으로 잡기만 검토한다.
    best = evaluate(pos, rootColor);
    if (qDepth >= MAX_QUIESCE_DEPTH) return best;
    if (maximizing) {
      if (best >= beta) return best;
      if (best > alpha) alpha = best;
    } else {
      if (best <= alpha) return best;
      if (best < beta) beta = best;
    }
    candidates = generatePseudoMoves(pos, mover).filter((m) => m.captured || m.promotion);
  }

  let legal = 0;
  for (const move of orderMoves(candidates, mover, ctx, ply, undefined)) {
    const undo = makeMove(pos, move);
    if (isInCheck(pos, mover)) {
      unmakeMove(pos, move, undo);
      continue;
    }
    legal++;
    const score = quiesce(pos, alpha, beta, rootColor, ctx, qDepth + 1, ply + 1);
    unmakeMove(pos, move, undo);
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
  if (inCheck && legal === 0) return mateScore(maximizing, ply);
  return best;
}

function search(pos: Position, depth: number, alpha: number, beta: number, rootColor: Color, ctx: SearchContext, ply: number): number {
  ctx.nodes++;
  checkBudget(ctx);
  if (ctx.aborted) return 0;
  if (depth === 0) return quiesce(pos, alpha, beta, rootColor, ctx, 0, ply);

  const key = hashKey(pos);
  const cached = ctx.table.get(key);
  if (cached && cached.depth >= depth) {
    if (cached.flag === 'exact') return cached.score;
    if (cached.flag === 'lower' && cached.score >= beta) return cached.score;
    if (cached.flag === 'upper' && cached.score <= alpha) return cached.score;
  }

  const mover = pos.turn;
  const maximizing = mover === rootColor;
  const alphaOrig = alpha;
  const betaOrig = beta;
  let best = maximizing ? -Infinity : Infinity;
  let bestMove: Move | null = null;
  let legal = 0;

  for (const move of orderMoves(generatePseudoMoves(pos, mover), mover, ctx, ply, cached)) {
    const undo = makeMove(pos, move);
    if (isInCheck(pos, mover)) {
      unmakeMove(pos, move, undo);
      continue;
    }
    legal++;
    const score = search(pos, depth - 1, alpha, beta, rootColor, ctx, ply + 1);
    unmakeMove(pos, move, undo);
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
    if (beta <= alpha) {
      rememberCutoff(ctx, move, mover, ply, depth);
      break;
    }
  }

  if (legal === 0) {
    return isInCheck(pos, mover) ? mateScore(maximizing, ply) : 0;
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
  /** 이 노드 수를 넘으면 마지막으로 끝낸 깊이의 답을 쓴다 — 기기 속도와 무관하게 세기가 같다 */
  maxNodes?: number;
  /** 테스트용 시계 */
  now?: () => number;
  /** 진단용: 전치 테이블을 쓰지 않는다 */
  noTable?: boolean;
}

export interface SearchResult {
  move: Move | null;
  score: number;
  /** 실제로 끝까지 탐색한 깊이 */
  depth: number;
  nodes: number;
}

interface RootResult {
  move: Move;
  score: number;
  /** 예산이 다해 끝까지 못 본 깊이의 결과 (완료한 루트 수들 중 최선) */
  partial: boolean;
}

function searchRoot(
  pos: Position,
  depth: number,
  ordered: Move[],
  rootColor: Color,
  ctx: SearchContext,
  random: () => number,
): RootResult | null {
  let bestScore = -Infinity;
  let bestMoves: Move[] = [];
  let alpha = -Infinity;
  for (const move of ordered) {
    const undo = makeMove(pos, move);
    // 창을 alpha-1 로 살짝 넓힌다. 그래야 alpha 와 같은 점수가 잘린 상한값이 아니라
    // 정확한 값으로 나와, 동점 후보 목록에 진짜 동점만 들어간다. (점수는 모두 정수)
    const score = search(pos, depth - 1, alpha === -Infinity ? alpha : alpha - 1, Infinity, rootColor, ctx, 1);
    unmakeMove(pos, move, undo);
    if (ctx.aborted) {
      // 이전 깊이의 최선수를 맨 먼저 보므로, 완료한 수가 하나라도 있으면
      // 그중 최선은 이전 깊이 결과보다 나쁘지 않다.
      if (bestMoves.length === 0) return null;
      return { move: bestMoves[Math.floor(random() * bestMoves.length)]!, score: bestScore, partial: true };
    }
    if (score > bestScore + 1e-9) {
      bestScore = score;
      bestMoves = [move];
      if (score > alpha) alpha = score;
    } else if (Math.abs(score - bestScore) < 1e-9) {
      bestMoves.push(move);
    }
  }
  const pick = bestMoves[Math.floor(random() * bestMoves.length)] ?? bestMoves[0]!;
  return { move: pick, score: bestScore, partial: false };
}

/**
 * 반복 심화 알파베타 탐색. 깊이 1부터 maxDepth 까지 차례로 탐색하고,
 * 시간·노드 예산이 있으면 예산 안에 끝낸 가장 깊은 결과를 쓴다.
 */
export function searchBestMove(
  position: Position,
  maxDepth: number,
  random: () => number = Math.random,
  options: SearchOptions = {},
): SearchResult {
  const moves = generateLegalMoves(position);
  if (moves.length === 0) return { move: null, score: 0, depth: 0, nodes: 0 };

  // 탐색은 복사본을 두었다 되돌리며 진행한다. 해시는 처음부터 다시 계산해 둔다.
  const pos = clonePosition(position);
  const hash = computeHash(pos);
  pos.hashLo = hash.lo;
  pos.hashHi = hash.hi;

  const now = options.now ?? (() => (typeof performance !== 'undefined' ? performance.now() : Date.now()));
  const ctx: SearchContext = {
    nodes: 0,
    aborted: false,
    deadline: options.timeMs !== undefined ? now() + options.timeMs : null,
    maxNodes: options.maxNodes ?? null,
    now,
    noTable: options.noTable ?? false,
    table: new Map(),
    killers: new Int32Array(MAX_PLY * 2),
    history: new Int32Array(2 * 64 * 64),
  };

  const rootColor = pos.turn;
  let ordered = orderMoves(moves, rootColor, ctx, 0, undefined);
  let best: SearchResult = { move: ordered[0]!, score: 0, depth: 0, nodes: 0 };

  for (let depth = 1; depth <= maxDepth; depth++) {
    const result = searchRoot(pos, depth, ordered, rootColor, ctx, random);
    if (!result) break;
    if (result.partial) {
      // 예산이 다했지만 이 깊이에서 끝까지 본 수가 있다면 그 수를 쓴다.
      best = { move: result.move, score: result.score, depth: best.depth, nodes: ctx.nodes };
      break;
    }
    best = { move: result.move, score: result.score, depth, nodes: ctx.nodes };
    // 다음 깊이에서는 방금 찾은 최선수를 먼저 보아 가지치기를 돕는다.
    ordered = [result.move, ...ordered.filter((m) => m !== result.move)];
    // 메이트를 찾았으면 더 깊이 볼 이유가 없다.
    if (isMateScore(result.score)) break;
  }
  return best;
}

// ───────────────────────── 오프닝 북 ─────────────────────────

/** 흔한 첫 수들. 배치 키 → 후보 수(UCI). 같은 초반만 반복하지 않게 한다. */
const BOOK_LINES: string[][] = [
  ['e2e4'], ['d2d4'], ['g1f3'], ['c2c4'],
  ['e2e4', 'e7e5'], ['e2e4', 'c7c5'], ['e2e4', 'e7e6'], ['e2e4', 'c7c6'],
  ['d2d4', 'd7d5'], ['d2d4', 'g8f6'], ['d2d4', 'e7e6'],
  ['g1f3', 'd7d5'], ['g1f3', 'g8f6'], ['c2c4', 'e7e5'], ['c2c4', 'g8f6'],
  ['e2e4', 'e7e5', 'g1f3'], ['e2e4', 'e7e5', 'f1c4'], ['e2e4', 'e7e5', 'b1c3'],
  ['e2e4', 'c7c5', 'g1f3'], ['e2e4', 'c7c5', 'b1c3'],
  ['d2d4', 'd7d5', 'c2c4'], ['d2d4', 'd7d5', 'g1f3'], ['d2d4', 'g8f6', 'c2c4'], ['d2d4', 'g8f6', 'g1f3'],
  ['e2e4', 'e7e5', 'g1f3', 'b8c6'], ['e2e4', 'e7e5', 'g1f3', 'g8f6'],
  ['d2d4', 'd7d5', 'c2c4', 'e7e6'], ['d2d4', 'd7d5', 'c2c4', 'c7c6'],
];

const BOOK: Map<string, string[]> = (() => {
  const book = new Map<string, string[]>();
  for (const line of BOOK_LINES) {
    let pos = initialPosition();
    for (let i = 0; i < line.length; i++) {
      const uci = line[i]!;
      const key = positionKey(pos);
      const list = book.get(key) ?? [];
      if (!list.includes(uci)) list.push(uci);
      book.set(key, list);
      const move = findMove(pos, fromAlgebraic(uci.slice(0, 2)), fromAlgebraic(uci.slice(2, 4)));
      if (!move) break;
      pos = applyMove(pos, move);
    }
  }
  return book;
})();

function bookMove(pos: Position, random: () => number): Move | null {
  if (pos.fullmove > 3) return null;
  const options = BOOK.get(positionKey(pos));
  if (!options || options.length === 0) return null;
  const uci = options[Math.floor(random() * options.length)]!;
  return findMove(pos, fromAlgebraic(uci.slice(0, 2)), fromAlgebraic(uci.slice(2, 4)));
}

// ───────────────────────── 난이도 ─────────────────────────

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

/**
 * 난이도별 탐색 예산. 노드 수로 정해 기기 속도와 무관하게 세기가 같고,
 * 시간 한도는 아주 느린 기기에서 너무 오래 기다리지 않게 하는 안전장치다.
 */
export const LEVEL_SEARCH: Record<3 | 4 | 5, { maxDepth: number; maxNodes: number; timeMs: number }> = {
  3: { maxDepth: 3, maxNodes: 40_000, timeMs: 2_000 },
  4: { maxDepth: 7, maxNodes: 200_000, timeMs: 6_000 },
  5: { maxDepth: 10, maxNodes: 600_000, timeMs: 12_000 },
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
      const fromBook = bookMove(pos, random);
      if (fromBook) return fromBook;
      const cfg = LEVEL_SEARCH[options.level];
      return searchBestMove(pos, cfg.maxDepth, random, { maxNodes: cfg.maxNodes, timeMs: cfg.timeMs }).move;
    }
  }
}

/** 힌트용: 아이에게 추천할 좋은 수 */
export function suggestMove(pos: Position): Move | null {
  return searchBestMove(pos, 5, () => 0.5, { maxNodes: 80_000, timeMs: 3_000 }).move;
}
