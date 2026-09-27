import type { Move, Position } from './types';
import { FILES, fileOf, rankOf, toAlgebraic } from './position';
import { applyMove, generateLegalMoves, isInCheck } from './moves';

const LETTER: Record<string, string> = { p: '', n: 'N', b: 'B', r: 'R', q: 'Q', k: 'K' };

/**
 * 표준 대국 기보(SAN) 문자열을 만든다. 예: Nf3, exd5, O-O, Qh5#
 * pos 는 수를 두기 전의 배치여야 한다.
 */
export function toSan(pos: Position, move: Move, legalMoves?: Move[]): string {
  const next = applyMove(pos, move);
  const opponentInCheck = isInCheck(next, next.turn);
  const opponentHasMoves = generateLegalMoves(next).length > 0;
  const suffix = opponentInCheck ? (opponentHasMoves ? '+' : '#') : '';

  if (move.castle) {
    return (move.castle === 'k' ? 'O-O' : 'O-O-O') + suffix;
  }

  const target = toAlgebraic(move.to);

  if (move.piece === 'p') {
    let text: string;
    if (move.captured) {
      text = `${FILES[fileOf(move.from)]}x${target}`;
    } else {
      text = target;
    }
    if (move.promotion) text += `=${LETTER[move.promotion]}`;
    return text + suffix;
  }

  const all = legalMoves ?? generateLegalMoves(pos);
  const rivals = all.filter(
    (m) => m.piece === move.piece && m.to === move.to && m.from !== move.from,
  );

  let disambiguation = '';
  if (rivals.length > 0) {
    const sameFile = rivals.some((m) => fileOf(m.from) === fileOf(move.from));
    const sameRank = rivals.some((m) => rankOf(m.from) === rankOf(move.from));
    if (!sameFile) disambiguation = FILES[fileOf(move.from)]!;
    else if (!sameRank) disambiguation = String(rankOf(move.from) + 1);
    else disambiguation = toAlgebraic(move.from);
  }

  return `${LETTER[move.piece]}${disambiguation}${move.captured ? 'x' : ''}${target}${suffix}`;
}
