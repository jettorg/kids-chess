import { describe, expect, it } from 'vitest';
import { Game, applyMove, fromAlgebraic as sq, generateLegalMoves, parseFen } from '../src/engine';
import { chooseMove, searchBestMove } from '../src/ai/ai';

describe('정지 탐색 (지평선 효과 방지)', () => {
  // d5 폰은 e6 폰이 지킨다. 깊이 1 정적 평가만 보면 Qxd5 가 +100 처럼 보이지만
  // 되잡히면 퀸을 잃는다. 정지 탐색은 이를 알아채야 한다.
  const fen = '4k3/8/4p3/3p4/8/8/8/3QK3 w - - 0 1';

  it('지켜진 폰을 퀸으로 잡지 않는다', () => {
    const result = searchBestMove(parseFen(fen), 1, () => 0.5);
    expect(result.move).not.toBeNull();
    expect(result.move!.to).not.toBe(sq('d5'));
  });

  it('폰 하나를 공짜로 얻은 것처럼 계산하지 않는다', () => {
    const pos = parseFen(fen);
    // 백은 퀸(900) 대 폰 둘(200) 로 약 +700 앞서 있다. Qxd5 를 공짜 폰으로 착각하면
    // +800 근처가 나오고, 되잡기를 알아채면 조용한 수의 +700 근처가 나온다.
    const result = searchBestMove(pos, 1, () => 0.5);
    expect(result.score).toBeGreaterThan(500);
    expect(result.score).toBeLessThan(790);
    // 반대로 Qxd5 뒤 흑 차례에서 흑은 되잡아 앞서야 한다 (흑 관점 양수)
    const capture = generateLegalMoves(pos).find((m) => m.to === sq('d5') && m.piece === 'q')!;
    const after = applyMove(pos, capture);
    expect(searchBestMove(after, 1, () => 0.5).score).toBeGreaterThan(0);
  });
});

describe('반복 심화', () => {
  const middlegame = 'r2q1rk1/pp2bppp/2n1bn2/2pp4/3P4/2N1PN2/PPQ1BPPP/R1B2RK1 w - - 0 10';

  it('시간 예산 안에 합법 수를 돌려준다', () => {
    const pos = parseFen(middlegame);
    const t0 = performance.now();
    const result = searchBestMove(pos, 12, () => 0.5, { timeMs: 150 });
    const elapsed = performance.now() - t0;
    expect(result.move).not.toBeNull();
    expect(generateLegalMoves(pos).some((m) => m.from === result.move!.from && m.to === result.move!.to)).toBe(true);
    expect(result.depth).toBeGreaterThanOrEqual(1);
    // 예산을 크게 넘기지 않는다 (마지막 노드 묶음 처리 여유 포함)
    expect(elapsed).toBeLessThan(150 + 400);
  });

  it('시간이 넉넉하면 더 깊이 본다', () => {
    const pos = parseFen(middlegame);
    const fast = searchBestMove(pos, 12, () => 0.5, { timeMs: 30 });
    const slow = searchBestMove(pos, 12, () => 0.5, { timeMs: 600 });
    expect(slow.depth).toBeGreaterThanOrEqual(fast.depth);
    expect(slow.nodes).toBeGreaterThan(fast.nodes);
  });

  it('가짜 시계로도 예산을 지킨다', () => {
    let clock = 0;
    const now = () => (clock += 1); // 노드 확인마다 1ms 씩 흐르는 시계
    const result = searchBestMove(parseFen(middlegame), 12, () => 0.5, { timeMs: 50, now });
    expect(result.move).not.toBeNull();
    expect(result.depth).toBeLessThan(12);
  });

  it('한 수 메이트를 찾으면 더 깊이 가지 않는다', () => {
    const result = searchBestMove(parseFen('6k1/5ppp/8/8/8/8/8/R6K w - - 0 1'), 8, () => 0.5);
    expect(result.depth).toBe(1);
    expect(result.score).toBeGreaterThan(50000);
  });
});

describe('새 난이도', () => {
  it('곰(4)·부엉이(5)도 합법 수를 낸다', () => {
    const pos = parseFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    for (const level of [4, 5] as const) {
      const move = chooseMove(pos, { level, random: () => 0.5 });
      expect(move, `level ${level}`).not.toBeNull();
      expect(generateLegalMoves(pos).some((m) => m.from === move!.from && m.to === move!.to)).toBe(true);
    }
  }, 20000);

  /** 어떤 응수에도 다음 수에 메이트가 있는지 완전 탐색으로 확인한다 */
  function isForcedMateInTwo(afterFirstMove: Game): boolean {
    const replies = afterFirstMove.legalMoves();
    if (replies.length === 0) return afterFirstMove.status().kind === 'checkmate';
    return replies.every((reply) => {
      const g2 = new Game(afterFirstMove.position);
      g2.playMove(reply);
      return g2.legalMoves().some((m) => {
        const g3 = new Game(g2.position);
        g3.playMove(m);
        return g3.status().kind === 'checkmate';
      });
    });
  }

  it('부엉이(5)는 두 수 메이트를 찾는다', () => {
    // 백 Kf6 Qb2, 흑 Kg8. 1.Qb7! 다음 …Kh8 2.Qg7# / …Kf8 2.Qf7#. 한 수 메이트는 없다.
    const start = parseFen('6k1/8/5K2/8/8/8/1Q6/8 w - - 0 1');
    const mateInOne = generateLegalMoves(start).some((m) => {
      const g = new Game(start);
      g.playMove(m);
      return g.status().kind === 'checkmate';
    });
    expect(mateInOne).toBe(false);

    const game = new Game(start);
    const move = chooseMove(game.position, { level: 5, random: () => 0.5 })!;
    game.playMove(move);
    expect(isForcedMateInTwo(game)).toBe(true);
  }, 20000);
});
