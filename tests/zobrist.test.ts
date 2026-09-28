import { describe, expect, it } from 'vitest';
import {
  applyMove,
  computeHash,
  fromAlgebraic as sq,
  generateLegalMoves,
  hashKey,
  initialPosition,
  makeMove,
  parseFen,
  toFen,
  unmakeMove,
} from '../src/engine';
import type { Position } from '../src/engine/types';

function assertHashFresh(pos: Position, label: string): void {
  const fresh = computeHash(pos);
  expect(pos.hashLo, label).toBe(fresh.lo);
  expect(pos.hashHi, label).toBe(fresh.hi);
}

describe('Zobrist 해시', () => {
  it('FEN 을 읽으면 해시가 계산돼 있다', () => {
    const pos = parseFen('r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1');
    assertHashFresh(pos, 'kiwipete');
    expect(hashKey(pos)).toBeGreaterThan(0);
  });

  it('두었다 되돌리면 배치와 해시가 정확히 원래대로다', () => {
    const fens = [
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      'r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1',
      '8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1',
      'n1n5/PPPk4/8/8/8/8/4Kppp/5N1N b - - 0 1',
    ];
    for (const fen of fens) {
      const pos = parseFen(fen);
      const before = toFen(pos);
      for (const move of generateLegalMoves(pos)) {
        const undo = makeMove(pos, move);
        assertHashFresh(pos, `${fen} after ${move.from}-${move.to}`);
        unmakeMove(pos, move, undo);
        expect(toFen(pos), `${fen} undo ${move.from}-${move.to}`).toBe(before);
        assertHashFresh(pos, `${fen} undo hash`);
      }
    }
  });

  it('무작위로 200수를 두는 동안 증분 해시가 전체 계산과 항상 같다', () => {
    let pos = initialPosition();
    let seed = 12345;
    const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
    for (let i = 0; i < 200; i++) {
      const moves = generateLegalMoves(pos);
      if (moves.length === 0) break;
      const move = moves[Math.floor(rnd() * moves.length)]!;
      pos = applyMove(pos, move);
      assertHashFresh(pos, `ply ${i}`);
    }
  });

  it('다른 순서로 같은 배치에 이르면 해시가 같다', () => {
    const a = initialPosition();
    const b = initialPosition();
    const play = (pos: Position, from: string, to: string) => {
      const move = generateLegalMoves(pos).find((m) => m.from === sq(from) && m.to === sq(to))!;
      return applyMove(pos, move);
    };
    let p1 = play(a, 'g1', 'f3');
    p1 = play(p1, 'g8', 'f6');
    p1 = play(p1, 'b1', 'c3');
    p1 = play(p1, 'b8', 'c6');
    let p2 = play(b, 'b1', 'c3');
    p2 = play(p2, 'b8', 'c6');
    p2 = play(p2, 'g1', 'f3');
    p2 = play(p2, 'g8', 'f6');
    expect(toFen(p1)).toBe(toFen(p2));
    expect(hashKey(p1)).toBe(hashKey(p2));
  });

  it('차례·캐슬링 권리·앙파상이 다르면 해시가 다르다', () => {
    const a = parseFen('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');
    const b = parseFen('r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1');
    const c = parseFen('r3k2r/8/8/8/8/8/8/R3K2R w Kkq - 0 1');
    expect(hashKey(a)).not.toBe(hashKey(b));
    expect(hashKey(a)).not.toBe(hashKey(c));
    const d = parseFen('4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1');
    const e = parseFen('4k3/8/8/3pP3/8/8/8/4K3 w - - 0 1');
    expect(hashKey(d)).not.toBe(hashKey(e));
  });
});
