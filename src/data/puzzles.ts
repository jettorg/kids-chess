import type { Localized } from '../i18n';
import type { Color, PieceType } from '../engine/types';
import { GENERATED_PUZZLES, type GeneratedTheme } from './puzzles.generated';

export type PuzzleTheme = GeneratedTheme;

export interface Puzzle {
  id: string;
  title: Localized;
  theme: PuzzleTheme;
  /** 푸는 쪽. 검은색이면 판을 뒤집어 보여준다. */
  side: Color;
  /** 푸는 쪽 차례인 배치 */
  fen: string;
  /** 정답 수열 (UCI): 내 수, 상대 응수, 내 수 … 상대 응수는 앱이 자동으로 둔다. */
  line: string[];
  /** 마지막 수가 체크메이트인 문제. 정답과 다른 수라도 메이트면 인정한다. */
  mateAtEnd: boolean;
  hint: Localized;
  /** Lichess 난이도 레이팅 (가져온 문제만). 직접 만든 입문 문제는 없음. */
  rating?: number;
  source?: 'lichess';
}

/** 메이트를 만드는 말에 따라 붙이는 힌트 */
const PIECE_HINT: Record<PieceType, Localized> = {
  q: { ko: '퀸으로 끝내 보세요.', en: 'Finish it with the queen.' },
  r: { ko: '룩을 써 보세요.', en: 'Use a rook.' },
  b: { ko: '비숍의 대각선을 따라가 보세요.', en: "Look along the bishop's diagonal." },
  n: { ko: '나이트가 뛰어들 자리를 찾아보세요.', en: 'Find where the knight can jump in.' },
  p: { ko: '폰이 끝내요! 승격도 생각해 보세요.', en: 'A pawn finishes it. Think about promotion.' },
  k: { ko: '킹도 도울 수 있어요.', en: 'Even the king can help.' },
};

const THEME_HINT: Record<Exclude<PuzzleTheme, 'mate1' | 'mate2'>, Localized> = {
  fork: { ko: '한 수로 상대 말 두 개를 동시에 공격해 보세요.', en: 'Attack two enemy pieces at once with one move.' },
  pin: { ko: '움직이면 뒤에 있는 큰 말이 잡히는 말을 찾아보세요.', en: 'Find a piece that cannot move without exposing a bigger one behind it.' },
  hanging: { ko: '아무도 지켜주지 않는 상대 말을 찾아보세요.', en: 'Look for an enemy piece that nobody is protecting.' },
};

/** 직접 만든 입문 문제 6개. 모두 "흰색이 한 수로 체크메이트". */
export const HANDMADE_PUZZLES: Puzzle[] = [
  {
    id: 'backrank',
    title: { ko: '1. 마지막 줄 공격', en: '1. Back-Rank Attack' },
    theme: 'mate1',
    side: 'w',
    fen: '6k1/5ppp/8/8/8/8/8/R6K w - - 0 1',
    line: ['a1a8'],
    mateAtEnd: true,
    hint: {
      ko: '검은 킹 앞은 자기 폰으로 막혀 있어요. 맨 위 줄을 노려보세요.',
      en: 'The black king is boxed in by its own pawns. Aim at the top row.',
    },
  },
  {
    id: 'queen-backrank',
    title: { ko: '2. 퀸으로 마무리', en: '2. Queen Finisher' },
    theme: 'mate1',
    side: 'w',
    fen: '6k1/5ppp/8/8/8/8/5PPP/4Q1K1 w - - 0 1',
    line: ['e1e8'],
    mateAtEnd: true,
    hint: {
      ko: '퀸도 룩처럼 세로로 쭉 갈 수 있어요.',
      en: 'The queen can slide straight up, just like a rook.',
    },
  },
  {
    id: 'two-rooks',
    title: { ko: '3. 룩 두 개로', en: '3. Two Rooks' },
    theme: 'mate1',
    side: 'w',
    fen: '7k/R7/8/8/8/8/8/1R5K w - - 0 1',
    line: ['b1b8'],
    mateAtEnd: true,
    hint: {
      ko: '한 룩이 아래 줄을 막고 있어요. 다른 룩을 맨 위 줄로 올려 보세요.',
      en: 'One rook already seals the row below. Bring the other rook up to the top row.',
    },
  },
  {
    id: 'queen-corner',
    title: { ko: '4. 킹과 퀸의 합동 작전', en: '4. King and Queen Team Up' },
    theme: 'mate1',
    side: 'w',
    fen: '6k1/8/6K1/8/8/8/8/7Q w - - 0 1',
    line: ['h1a8'],
    mateAtEnd: true,
    hint: {
      ko: '내 킹이 이미 상대 킹의 도망길을 막고 있어요. 퀸은 킹 옆에 두면 잡히니 멀리서 노려보세요.',
      en: 'Your king already blocks the escape squares. A queen next to the enemy king gets captured, so strike from far away.',
    },
  },
  {
    id: 'smothered',
    title: { ko: '5. 나이트의 기습', en: '5. Knight Ambush' },
    theme: 'mate1',
    side: 'w',
    fen: '6rk/6pp/8/6N1/8/8/8/K7 w - - 0 1',
    line: ['g5f7'],
    mateAtEnd: true,
    hint: {
      ko: '검은 킹은 자기 말들에 둘러싸여 있어요. 나이트는 뛰어넘을 수 있어요.',
      en: 'The black king is smothered by its own pieces. Knights can jump over them.',
    },
  },
  {
    id: 'scholars',
    title: { ko: '6. 네 수 메이트', en: '6. Four-Move Mate' },
    theme: 'mate1',
    side: 'w',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 4 4',
    line: ['f3f7'],
    mateAtEnd: true,
    hint: {
      ko: 'f7 폰은 킹만 지키고 있어요. 그런데 내 비숍이 f7 을 보고 있네요.',
      en: 'Only the king guards the f7 pawn, and your bishop is watching f7 too.',
    },
  },
];

/**
 * 전체 문제: 입문 6개 뒤에 Lichess 에서 가져온 문제가 테마별·쉬운 순으로 이어진다.
 * 가져온 문제는 scripts/import-puzzles.ts 로 다시 만들 수 있다.
 */
export const PUZZLES: Puzzle[] = [
  ...HANDMADE_PUZZLES,
  ...GENERATED_PUZZLES.map((g, i) => {
    const n = HANDMADE_PUZZLES.length + i + 1;
    const mate = g.theme === 'mate1' || g.theme === 'mate2';
    return {
      id: `lichess-${g.id}`,
      title: { ko: `${n}. 퍼즐`, en: `${n}. Puzzle` },
      theme: g.theme,
      side: g.side,
      fen: g.fen,
      line: g.line,
      mateAtEnd: mate,
      hint: mate ? PIECE_HINT[g.piece] : THEME_HINT[g.theme as Exclude<PuzzleTheme, 'mate1' | 'mate2'>],
      rating: g.rating,
      source: 'lichess' as const,
    };
  }),
];

/** 입문 문제는 레이팅이 없으므로 추천 계산에서 이 값으로 본다 */
export const HANDMADE_RATING = 400;

export function puzzleRating(puzzle: Puzzle): number {
  return puzzle.rating ?? HANDMADE_RATING;
}
