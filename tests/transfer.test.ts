import { describe, expect, it } from 'vitest';
import { decodeProgress, encodeProgress, mergeProgress } from '../src/ui/transfer';

describe('기록 전송 코드', () => {
  const progress = { lessons: ['pawn', 'rook'], puzzles: ['backrank', 'lichess-001KR'], puzzleIndex: 7, puzzleTarget: 610 };

  it('인코딩한 코드를 다시 읽으면 같다', () => {
    const code = encodeProgress(progress);
    expect(code.startsWith('KC1.')).toBe(true);
    expect(code).not.toMatch(/[+/=\s]/);
    expect(decodeProgress(code)).toEqual(progress);
  });

  it('공백이 붙어도 읽고, 손상되면 거부한다', () => {
    const code = encodeProgress(progress);
    expect(decodeProgress(`  ${code}\n`)).toEqual(progress);
    const tampered = code.slice(0, 10) + (code[10] === 'A' ? 'B' : 'A') + code.slice(11);
    expect(decodeProgress(tampered)).toBeNull();
    expect(decodeProgress('hello')).toBeNull();
    expect(decodeProgress('KC1.abc.def')).toBeNull();
  });

  it('두 기록을 합치면 합집합·높은 목표·가져온 위치', () => {
    const merged = mergeProgress(
      { lessons: ['pawn'], puzzles: ['a', 'b'], puzzleIndex: 3, puzzleTarget: 500 },
      { lessons: ['rook'], puzzles: ['b', 'c'], puzzleIndex: 9, puzzleTarget: 460 },
    );
    expect(merged.lessons.sort()).toEqual(['pawn', 'rook']);
    expect(merged.puzzles.sort()).toEqual(['a', 'b', 'c']);
    expect(merged.puzzleIndex).toBe(9);
    expect(merged.puzzleTarget).toBe(500);
  });
});
