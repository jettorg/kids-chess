import { describe, expect, it } from 'vitest';
import {
  Game,
  applyMove,
  findMove,
  fromAlgebraic as sq,
  generateLegalMoves,
  hasInsufficientMaterial,
  initialPosition,
  isInCheck,
  parseFen,
  toAlgebraic,
  toFen,
  toSan,
} from '../src/engine';

/** 특정 배치에서 나오는 합법 수의 개수 */
function count(fen: string): number {
  return generateLegalMoves(parseFen(fen)).length;
}

/** 깊이별 수 세기 (perft) — 규칙 전체의 정확성을 검증한다 */
function perft(fenOrPos: string, depth: number): number {
  const pos = typeof fenOrPos === 'string' ? parseFen(fenOrPos) : fenOrPos;
  const walk = (p: ReturnType<typeof parseFen>, d: number): number => {
    const moves = generateLegalMoves(p);
    if (d === 1) return moves.length;
    let total = 0;
    for (const m of moves) total += walk(applyMove(p, m), d - 1);
    return total;
  };
  if (depth === 0) return 1;
  return walk(pos, depth);
}

describe('좌표 변환', () => {
  it('a1 은 0, h8 은 63', () => {
    expect(sq('a1')).toBe(0);
    expect(sq('h1')).toBe(7);
    expect(sq('a8')).toBe(56);
    expect(sq('h8')).toBe(63);
    expect(toAlgebraic(0)).toBe('a1');
    expect(toAlgebraic(63)).toBe('h8');
  });

  it('FEN 을 읽고 다시 써도 같다', () => {
    const fen = 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 4 4';
    expect(toFen(parseFen(fen))).toBe(fen);
  });

  it('초기 배치 FEN', () => {
    expect(toFen(initialPosition())).toBe(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    );
  });
});

describe('기본 이동 규칙', () => {
  it('초기 배치에서 20수', () => {
    expect(count('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')).toBe(20);
  });

  it('빈 보드 중앙 나이트는 8수', () => {
    expect(count('8/8/8/3N4/8/8/8/8 w - - 0 1')).toBe(8);
  });

  it('모서리 나이트는 2수', () => {
    expect(count('8/8/8/8/8/8/8/N7 w - - 0 1')).toBe(2);
  });

  it('빈 보드 중앙 퀸은 27수', () => {
    expect(count('8/8/8/3Q4/8/8/8/8 w - - 0 1')).toBe(27);
  });

  it('아군 말은 넘어가거나 잡을 수 없다', () => {
    // a1 룩 앞뒤가 아군으로 막혀 있으면 움직일 수 없다.
    expect(count('8/8/8/8/8/8/P7/RN6 w - - 0 1')).toBeGreaterThan(0);
    const moves = generateLegalMoves(parseFen('8/8/8/8/8/8/P7/RN6 w - - 0 1'));
    expect(moves.filter((m) => m.from === sq('a1'))).toHaveLength(0);
  });
});

describe('폰 규칙', () => {
  it('두 칸 전진과 대각선 잡기', () => {
    const pos = parseFen('8/8/8/8/8/3p4/4P3/8 w - - 0 1');
    const moves = generateLegalMoves(pos, sq('e2'));
    const targets = moves.map((m) => toAlgebraic(m.to)).sort();
    expect(targets).toEqual(['d3', 'e3', 'e4']);
  });

  it('앙파상으로 잡을 수 있다', () => {
    const pos = parseFen('8/8/8/3pP3/8/8/8/8 w - d6 0 1');
    const move = findMove(pos, sq('e5'), sq('d6'));
    expect(move).not.toBeNull();
    expect(move!.enPassant).toBe(true);
    const after = applyMove(pos, move!);
    expect(after.board[sq('d5')]).toBeNull();
    expect(after.board[sq('d6')]?.type).toBe('p');
  });

  it('두 칸 전진 후에만 앙파상 칸이 생긴다', () => {
    const pos = parseFen('8/8/8/8/8/8/4P3/8 w - - 0 1');
    const two = findMove(pos, sq('e2'), sq('e4'))!;
    expect(applyMove(pos, two).ep).toBe(sq('e3'));
    const one = findMove(pos, sq('e2'), sq('e3'))!;
    expect(applyMove(pos, one).ep).toBeNull();
  });

  it('승격은 네 가지 선택지를 만든다', () => {
    const pos = parseFen('8/4P3/8/8/8/8/8/8 w - - 0 1');
    const moves = generateLegalMoves(pos, sq('e7'));
    expect(moves).toHaveLength(4);
    expect(moves.map((m) => m.promotion).sort()).toEqual(['b', 'n', 'q', 'r']);
  });

  it('퀸으로 승격하면 보드에 퀸이 놓인다', () => {
    const pos = parseFen('8/4P3/8/8/8/8/8/8 w - - 0 1');
    const after = applyMove(pos, findMove(pos, sq('e7'), sq('e8'), 'q')!);
    expect(after.board[sq('e8')]).toEqual({ type: 'q', color: 'w' });
  });
});

describe('캐슬링', () => {
  it('양쪽 캐슬링이 가능하다', () => {
    const pos = parseFen('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');
    const castles = generateLegalMoves(pos, sq('e1')).filter((m) => m.castle);
    expect(castles.map((m) => m.castle).sort()).toEqual(['k', 'q']);
  });

  it('킹사이드 캐슬링 후 킹 g1, 룩 f1', () => {
    const pos = parseFen('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');
    const after = applyMove(pos, findMove(pos, sq('e1'), sq('g1'))!);
    expect(after.board[sq('g1')]?.type).toBe('k');
    expect(after.board[sq('f1')]?.type).toBe('r');
    expect(after.board[sq('h1')]).toBeNull();
    expect(after.castling.wk).toBe(false);
    expect(after.castling.wq).toBe(false);
  });

  it('퀸사이드 캐슬링 후 킹 c1, 룩 d1', () => {
    const pos = parseFen('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');
    const after = applyMove(pos, findMove(pos, sq('e1'), sq('c1'))!);
    expect(after.board[sq('c1')]?.type).toBe('k');
    expect(after.board[sq('d1')]?.type).toBe('r');
  });

  it('체크 중에는 캐슬링할 수 없다', () => {
    const pos = parseFen('r3k2r/8/8/8/8/8/4r3/R3K2R w KQkq - 0 1');
    expect(generateLegalMoves(pos, sq('e1')).filter((m) => m.castle)).toHaveLength(0);
  });

  it('킹이 지나가는 칸이 공격받으면 캐슬링할 수 없다', () => {
    const pos = parseFen('r3k2r/8/8/8/8/8/5r2/R3K2R w KQkq - 0 1');
    const castles = generateLegalMoves(pos, sq('e1')).filter((m) => m.castle);
    expect(castles.map((m) => m.castle)).toEqual(['q']);
  });

  it('사이에 말이 있으면 캐슬링할 수 없다', () => {
    const pos = parseFen('r3k2r/8/8/8/8/8/8/R3KB1R w KQkq - 0 1');
    expect(generateLegalMoves(pos, sq('e1')).filter((m) => m.castle).map((m) => m.castle)).toEqual(['q']);
  });

  it('룩이 잡히면 그쪽 캐슬링 권리가 사라진다', () => {
    const pos = parseFen('r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1');
    const after = applyMove(pos, findMove(pos, sq('a8'), sq('a1'))!);
    expect(after.castling.wq).toBe(false);
    expect(after.castling.wk).toBe(true);
  });
});

describe('체크와 핀', () => {
  it('핀된 말은 움직일 수 없다', () => {
    // e1 킹, e2 나이트, e8 룩 → 나이트는 핀되어 움직일 수 없다.
    const pos = parseFen('4r3/8/8/8/8/8/4N3/4K3 w - - 0 1');
    expect(generateLegalMoves(pos, sq('e2'))).toHaveLength(0);
  });

  it('체크를 막거나 피하는 수만 허용된다', () => {
    const pos = parseFen('4r3/8/8/8/8/8/8/4K3 w - - 0 1');
    expect(isInCheck(pos, 'w')).toBe(true);
    const targets = generateLegalMoves(pos).map((m) => toAlgebraic(m.to)).sort();
    expect(targets).toEqual(['d1', 'd2', 'f1', 'f2']);
  });

  it('킹은 상대 킹 옆으로 갈 수 없다', () => {
    const pos = parseFen('8/8/8/3k4/8/8/8/8 b - - 0 1');
    expect(generateLegalMoves(pos, sq('d5'))).toHaveLength(8);
    const withEnemy = parseFen('8/8/3K4/8/3k4/8/8/8 b - - 0 1');
    const targets = generateLegalMoves(withEnemy, sq('d4')).map((m) => toAlgebraic(m.to)).sort();
    expect(targets).toEqual(['c3', 'c4', 'd3', 'e3', 'e4']);
  });
});

describe('승패 판정', () => {
  it('백랭크 메이트를 체크메이트로 판정한다', () => {
    const game = new Game(parseFen('6k1/5ppp/8/8/8/8/8/R6K w - - 0 1'));
    game.move(sq('a1'), sq('a8'));
    const status = game.status();
    expect(status.kind).toBe('checkmate');
    expect(status.kind === 'checkmate' && status.winner).toBe('w');
  });

  it('스칼라 메이트를 체크메이트로 판정한다', () => {
    const game = new Game(
      parseFen('r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 4 4'),
    );
    game.move(sq('f3'), sq('f7'));
    expect(game.status().kind).toBe('checkmate');
  });

  it('스테일메이트를 판정한다', () => {
    const pos = parseFen('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1');
    const game = new Game(pos);
    expect(game.status().kind).toBe('stalemate');
  });

  it('기물 부족 무승부를 판정한다', () => {
    expect(hasInsufficientMaterial(parseFen('8/8/4k3/8/8/3K4/8/8 w - - 0 1'))).toBe(true);
    expect(hasInsufficientMaterial(parseFen('8/8/4k3/8/8/3K1N2/8/8 w - - 0 1'))).toBe(true);
    expect(hasInsufficientMaterial(parseFen('8/8/4k3/8/8/3K1R2/8/8 w - - 0 1'))).toBe(false);
    expect(hasInsufficientMaterial(parseFen('8/8/4k3/8/8/3K1P2/8/8 w - - 0 1'))).toBe(false);
  });

  it('50수 규칙 무승부를 판정한다', () => {
    const pos = parseFen('8/8/4k3/8/8/3K1R2/8/8 w - - 100 80');
    expect(new Game(pos).status()).toEqual({ kind: 'draw', reason: 'fifty' });
  });

  it('3회 동형 반복 무승부를 판정한다', () => {
    const game = new Game(parseFen('4k2r/8/8/8/8/8/8/R3K3 w - - 0 1'));
    // 룩을 왕복시켜 같은 배치를 3번 만든다.
    for (let i = 0; i < 2; i++) {
      game.move(sq('a1'), sq('a2'));
      game.move(sq('h8'), sq('h7'));
      game.move(sq('a2'), sq('a1'));
      game.move(sq('h7'), sq('h8'));
    }
    expect(game.status()).toEqual({ kind: 'draw', reason: 'repetition' });
  });
});

describe('되돌리기', () => {
  it('되돌리면 이전 배치로 정확히 돌아간다', () => {
    const game = new Game();
    const before = game.fen();
    game.move(sq('e2'), sq('e4'));
    game.move(sq('e7'), sq('e5'));
    expect(game.moveCount).toBe(2);
    game.undoMany(2);
    expect(game.fen()).toBe(before);
    expect(game.moveCount).toBe(0);
    expect(game.undo()).toBe(false);
  });

  it('앙파상도 정확히 되돌린다', () => {
    const game = new Game(parseFen('4k3/2p5/8/3P4/8/8/8/4K3 b - - 0 1'));
    const before = game.fen();
    game.move(sq('c7'), sq('c5'));
    game.move(sq('d5'), sq('c6'));
    expect(game.position.board[sq('c5')]).toBeNull();
    game.undoMany(2);
    expect(game.fen()).toBe(before);
    expect(game.position.board[sq('c7')]?.type).toBe('p');
  });
});

describe('기보 표기(SAN)', () => {
  it('일반 수와 잡기', () => {
    const pos = initialPosition();
    expect(toSan(pos, findMove(pos, sq('e2'), sq('e4'))!)).toBe('e4');
    expect(toSan(pos, findMove(pos, sq('g1'), sq('f3'))!)).toBe('Nf3');
  });

  it('캐슬링 표기', () => {
    const pos = parseFen('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');
    expect(toSan(pos, findMove(pos, sq('e1'), sq('g1'))!)).toBe('O-O');
    expect(toSan(pos, findMove(pos, sq('e1'), sq('c1'))!)).toBe('O-O-O');
  });

  it('체크와 체크메이트 기호', () => {
    const mate = parseFen('6k1/5ppp/8/8/8/8/8/R6K w - - 0 1');
    expect(toSan(mate, findMove(mate, sq('a1'), sq('a8'))!)).toBe('Ra8#');
    const check = parseFen('6k1/5pp1/8/8/8/8/8/R6K w - - 0 1');
    expect(toSan(check, findMove(check, sq('a1'), sq('a8'))!)).toBe('Ra8+');
  });

  it('같은 말이 겹칠 때 구분 표기', () => {
    const pos = parseFen('8/8/8/8/8/8/8/R6R w - - 0 1');
    expect(toSan(pos, findMove(pos, sq('a1'), sq('d1'))!)).toBe('Rad1');
    const ranks = parseFen('R7/8/8/8/8/8/8/R3K3 w - - 0 1');
    expect(toSan(ranks, findMove(ranks, sq('a1'), sq('a4'))!)).toBe('R1a4');
  });

  it('폰 잡기와 승격 표기', () => {
    const pos = parseFen('8/8/8/3p4/4P3/8/8/8 w - - 0 1');
    expect(toSan(pos, findMove(pos, sq('e4'), sq('d5'))!)).toBe('exd5');
    const promo = parseFen('8/4P3/8/8/8/8/8/8 w - - 0 1');
    expect(toSan(promo, findMove(promo, sq('e7'), sq('e8'), 'n')!)).toBe('e8=N');
  });
});

describe('perft (규칙 전체 정확성)', () => {
  const start = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  it('초기 배치 depth 1~4', () => {
    expect(perft(start, 1)).toBe(20);
    expect(perft(start, 2)).toBe(400);
    expect(perft(start, 3)).toBe(8902);
    expect(perft(start, 4)).toBe(197281);
  });

  it('Kiwipete depth 1~3', () => {
    const fen = 'r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1';
    expect(perft(fen, 1)).toBe(48);
    expect(perft(fen, 2)).toBe(2039);
    expect(perft(fen, 3)).toBe(97862);
  });

  it('앙파상·승격 특수 배치', () => {
    const ep = '8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1';
    expect(perft(ep, 1)).toBe(14);
    expect(perft(ep, 2)).toBe(191);
    expect(perft(ep, 3)).toBe(2812);

    const promo = 'n1n5/PPPk4/8/8/8/8/4Kppp/5N1N b - - 0 1';
    expect(perft(promo, 1)).toBe(24);
    expect(perft(promo, 2)).toBe(496);
    expect(perft(promo, 3)).toBe(9483);
  });
});
