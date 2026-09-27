import type { Color, GameStatus, Position } from './types';
import { fileOf, opposite, rankOf } from './position';
import { generateLegalMoves, isInCheck } from './moves';

/** 킹만 남았거나 한쪽에 마이너 피스 하나만 남아 체크메이트가 불가능한 배치인가? */
export function hasInsufficientMaterial(pos: Position): boolean {
  const pieces: { color: Color; type: string; light: boolean }[] = [];
  for (let sq = 0; sq < 64; sq++) {
    const p = pos.board[sq];
    if (!p) continue;
    if (p.type === 'p' || p.type === 'r' || p.type === 'q') return false;
    if (p.type === 'k') continue;
    pieces.push({ color: p.color, type: p.type, light: (fileOf(sq) + rankOf(sq)) % 2 === 1 });
  }

  // 킹 대 킹
  if (pieces.length === 0) return true;
  // 킹 + 마이너 피스 하나
  if (pieces.length === 1) return true;
  // 킹 + 비숍 대 킹 + 비숍 (같은 색 칸)
  if (pieces.length === 2) {
    const [a, b] = pieces as [typeof pieces[0], typeof pieces[0]];
    if (a.type === 'b' && b.type === 'b' && a.color !== b.color && a.light === b.light) return true;
  }
  return false;
}

export interface StatusOptions {
  /** 현재 배치가 기록상 몇 번째로 등장했는지 (3 이상이면 3회 반복 무승부) */
  repetitions?: number;
}

export function gameStatus(pos: Position, options: StatusOptions = {}): GameStatus {
  const check = isInCheck(pos, pos.turn);
  const moves = generateLegalMoves(pos);

  if (moves.length === 0) {
    if (check) return { kind: 'checkmate', winner: opposite(pos.turn) };
    return { kind: 'stalemate' };
  }

  if (hasInsufficientMaterial(pos)) return { kind: 'draw', reason: 'material' };
  if ((options.repetitions ?? 0) >= 3) return { kind: 'draw', reason: 'repetition' };
  if (pos.halfmove >= 100) return { kind: 'draw', reason: 'fifty' };

  return { kind: 'playing', check };
}

export function isGameOver(status: GameStatus): boolean {
  return status.kind !== 'playing';
}
