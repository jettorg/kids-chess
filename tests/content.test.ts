import { describe, expect, it } from 'vitest';
import {
  Game,
  applyMove,
  findMove,
  fromAlgebraic,
  generateLegalMoves,
  parseFen,
} from '../src/engine';
import { chooseMove, searchBestMove, suggestMove } from '../src/ai/ai';
import { LESSONS } from '../src/data/lessons';
import { HANDMADE_PUZZLES, PUZZLES } from '../src/data/puzzles';
import { GENERATED_PUZZLES } from '../src/data/puzzles.generated';
import { eul, euro } from '../src/ui/ko';

function parseUci(text: string): { from: number; to: number } {
  return { from: fromAlgebraic(text.slice(0, 2)), to: fromAlgebraic(text.slice(2, 4)) };
}

function isMate(fen: string, uci: string): boolean {
  const pos = parseFen(fen);
  const { from, to } = parseUci(uci);
  const move = findMove(pos, from, to);
  if (!move) return false;
  const game = new Game(pos);
  game.playMove(move);
  return game.status().kind === 'checkmate';
}

/** 검은 말이 모두 잡힐 수 있는지 너비 우선으로 확인한다 (연습 모드: 흰색만 움직임) */
function lessonSolvable(fen: string, maxDepth = 14): boolean {
  const start = parseFen(fen);
  const countBlack = (pos: ReturnType<typeof parseFen>) =>
    pos.board.filter((p) => p && p.color === 'b').length;

  const seen = new Set<string>();
  let frontier = [start];
  for (let depth = 0; depth < maxDepth; depth++) {
    const next: ReturnType<typeof parseFen>[] = [];
    for (const pos of frontier) {
      if (countBlack(pos) === 0) return true;
      for (const move of generateLegalMoves(pos)) {
        const after = applyMove(pos, move);
        // 연습 모드에서는 항상 흰색 차례가 유지된다.
        after.turn = 'w';
        const key = after.board.map((p) => (p ? (p.color === 'w' ? p.type.toUpperCase() : p.type) : '.')).join('');
        if (seen.has(key)) continue;
        seen.add(key);
        next.push(after);
      }
    }
    if (next.length === 0) break;
    frontier = next;
  }
  return frontier.some((pos) => countBlack(pos) === 0);
}

describe('배우기 레슨', () => {
  it('모든 레슨의 배치를 읽을 수 있다', () => {
    for (const lesson of LESSONS) {
      expect(() => parseFen(lesson.fen), lesson.id).not.toThrow();
    }
  });

  it('각 레슨에는 흰 말 한 종류와 잡을 검은 말이 있다', () => {
    for (const lesson of LESSONS) {
      const pos = parseFen(lesson.fen);
      const white = pos.board.filter((p) => p && p.color === 'w');
      const black = pos.board.filter((p) => p && p.color === 'b');
      expect(white.length, lesson.id).toBeGreaterThan(0);
      expect(black.length, lesson.id).toBeGreaterThan(0);
      expect(new Set(white.map((p) => p!.type)).size, lesson.id).toBe(1);
      expect(white[0]!.type, lesson.id).toBe(lesson.piece);
    }
  });

  it('레슨은 첫 수부터 막히지 않는다', () => {
    for (const lesson of LESSONS) {
      expect(generateLegalMoves(parseFen(lesson.fen)).length, lesson.id).toBeGreaterThan(0);
    }
  });

  it('모든 레슨은 검은 말을 전부 잡아 끝낼 수 있다', () => {
    for (const lesson of LESSONS) {
      expect(lessonSolvable(lesson.fen), lesson.id).toBe(true);
    }
  });
});

describe('한 수 메이트 퍼즐', () => {
  it('제시된 정답이 실제로 체크메이트다', () => {
    for (const puzzle of PUZZLES) {
      expect(isMate(puzzle.fen, puzzle.solution), puzzle.id).toBe(true);
    }
  });

  it('시작 배치에서 흰색이 아직 체크메이트를 당하지 않았다', () => {
    for (const puzzle of PUZZLES) {
      const game = new Game(parseFen(puzzle.fen));
      expect(game.status().kind, puzzle.id).toBe('playing');
      expect(game.turn, puzzle.id).toBe('w');
    }
  });

  it('힌트 탐색이 한 수 메이트를 찾아낸다', () => {
    for (const puzzle of PUZZLES) {
      const move = suggestMove(parseFen(puzzle.fen));
      expect(move, puzzle.id).not.toBeNull();
      const game = new Game(parseFen(puzzle.fen));
      game.playMove(move!);
      expect(game.status().kind, puzzle.id).toBe('checkmate');
    }
  });
});

describe('컴퓨터 상대', () => {
  const start = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  it('모든 난이도가 합법적인 수를 낸다', () => {
    for (const level of [1, 2, 3] as const) {
      const pos = parseFen(start);
      const move = chooseMove(pos, { level, random: () => 0.42 });
      expect(move, `level ${level}`).not.toBeNull();
      expect(
        generateLegalMoves(pos).some((m) => m.from === move!.from && m.to === move!.to),
        `level ${level}`,
      ).toBe(true);
    }
  });

  it('둘 곳이 없으면 null 을 낸다', () => {
    const mated = parseFen('R5k1/5ppp/8/8/8/8/8/7K b - - 0 1');
    for (const level of [1, 2, 3] as const) {
      expect(chooseMove(mated, { level, random: () => 0 }), `level ${level}`).toBeNull();
    }
  });

  it('강아지(2단계)는 공짜 말을 잡는다', () => {
    // d5 의 검은 퀸은 아무도 지키지 않는다. 흰 나이트가 잡아야 한다.
    const pos = parseFen('4k3/8/8/3q4/8/4N3/8/4K3 w - - 0 1');
    const move = chooseMove(pos, { level: 2, random: () => 0.5 });
    expect(move?.captured).toBe('q');
  });

  it('여우(3단계)는 한 수 메이트를 놓치지 않는다', () => {
    const game = new Game(parseFen('6k1/5ppp/8/8/8/8/8/R6K w - - 0 1'));
    const move = chooseMove(game.position, { level: 3, random: () => 0.5 });
    game.playMove(move!);
    expect(game.status().kind).toBe('checkmate');
  });

  it('여우(3단계)는 공짜로 퀸을 내주지 않는다', () => {
    // 흰 퀸이 d5, 검은 폰 c6 이 d5 를 노린다. 퀸을 지키거나 피해야 한다.
    const pos = parseFen('4k3/8/2p5/3Q4/8/8/8/4K3 w - - 0 1');
    const move = chooseMove(pos, { level: 3, random: () => 0.5 })!;
    const after = applyMove(pos, move);
    const lostQueen =
      after.board.filter((p) => p && p.color === 'w' && p.type === 'q').length === 0;
    expect(lostQueen).toBe(false);
    // 퀸이 폰에게 잡히는 자리에 남아 있지 않아야 한다.
    const blackBest = searchBestMove(after, 1, () => 0.5).move;
    expect(blackBest?.captured).not.toBe('q');
  });

  it('탐색이 두 수 앞 외통을 점수로 알아본다', () => {
    const result = searchBestMove(parseFen('6k1/5ppp/8/8/8/8/8/R6K w - - 0 1'), 3);
    expect(result.score).toBeGreaterThan(50000);
  });
});

describe('한글 조사', () => {
  it('받침에 맞는 으로/로 를 고른다', () => {
    expect(euro('폰')).toBe('폰으로');
    expect(euro('룩')).toBe('룩으로');
    expect(euro('비숍')).toBe('비숍으로');
    expect(euro('퀸')).toBe('퀸으로');
    expect(euro('킹')).toBe('킹으로');
    expect(euro('나이트')).toBe('나이트로');
    expect(euro('연필')).toBe('연필로');
  });

  it('받침에 맞는 을/를 을 고른다', () => {
    expect(eul('폰 배우기')).toBe('폰 배우기를');
    expect(eul('룩')).toBe('룩을');
  });
});

describe('가져온 퍼즐', () => {
  it('입문 6개 뒤에 이어지고 ID 가 겹치지 않는다', () => {
    expect(PUZZLES.length).toBe(HANDMADE_PUZZLES.length + GENERATED_PUZZLES.length);
    expect(GENERATED_PUZZLES.length).toBeGreaterThanOrEqual(100);
    expect(new Set(PUZZLES.map((p) => p.id)).size).toBe(PUZZLES.length);
  });

  it('난이도가 쉬운 순으로 정렬돼 있다', () => {
    for (let i = 1; i < GENERATED_PUZZLES.length; i++) {
      expect(GENERATED_PUZZLES[i]!.rating).toBeGreaterThanOrEqual(GENERATED_PUZZLES[i - 1]!.rating);
    }
  });

  it('모두 흰색 차례이고 힌트가 메이트 말과 맞는다', () => {
    for (const g of GENERATED_PUZZLES) {
      const pos = parseFen(g.fen);
      expect(pos.turn, g.id).toBe('w');
      const { from, to } = parseUci(g.solution);
      const move = findMove(pos, from, to);
      expect(move, g.id).not.toBeNull();
      expect(move!.promotion ?? move!.piece, g.id).toBe(g.piece);
    }
  });
});
