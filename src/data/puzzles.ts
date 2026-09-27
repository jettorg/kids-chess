import type { Localized } from '../i18n';
import type { PieceType } from '../engine/types';
import { GENERATED_PUZZLES } from './puzzles.generated';

export interface Puzzle {
  id: string;
  title: Localized;
  fen: string;
  /** 정답 예시 (from+to). 다른 체크메이트 수도 정답으로 인정한다. */
  solution: string;
  hint: Localized;
  /** Lichess 난이도 레이팅 (가져온 문제만) */
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

/** 직접 만든 입문 문제 6개. 모두 "흰색이 한 수로 체크메이트". */
export const HANDMADE_PUZZLES: Puzzle[] = [
  {
    id: 'backrank',
    title: { ko: '1. 마지막 줄 공격', en: '1. Back-Rank Attack' },
    fen: '6k1/5ppp/8/8/8/8/8/R6K w - - 0 1',
    solution: 'a1a8',
    hint: {
      ko: '검은 킹 앞은 자기 폰으로 막혀 있어요. 맨 위 줄을 노려보세요.',
      en: 'The black king is boxed in by its own pawns. Aim at the top row.',
    },
  },
  {
    id: 'queen-backrank',
    title: { ko: '2. 퀸으로 마무리', en: '2. Queen Finisher' },
    fen: '6k1/5ppp/8/8/8/8/5PPP/4Q1K1 w - - 0 1',
    solution: 'e1e8',
    hint: {
      ko: '퀸도 룩처럼 세로로 쭉 갈 수 있어요.',
      en: 'The queen can slide straight up, just like a rook.',
    },
  },
  {
    id: 'two-rooks',
    title: { ko: '3. 룩 두 개로', en: '3. Two Rooks' },
    fen: '7k/R7/8/8/8/8/8/1R5K w - - 0 1',
    solution: 'b1b8',
    hint: {
      ko: '한 룩이 아래 줄을 막고 있어요. 다른 룩을 맨 위 줄로 올려 보세요.',
      en: 'One rook already seals the row below. Bring the other rook up to the top row.',
    },
  },
  {
    id: 'queen-corner',
    title: { ko: '4. 킹과 퀸의 합동 작전', en: '4. King and Queen Team Up' },
    fen: '6k1/8/6K1/8/8/8/8/7Q w - - 0 1',
    solution: 'h1a8',
    hint: {
      ko: '내 킹이 이미 상대 킹의 도망길을 막고 있어요. 퀸은 킹 옆에 두면 잡히니 멀리서 노려보세요.',
      en: 'Your king already blocks the escape squares. A queen next to the enemy king gets captured, so strike from far away.',
    },
  },
  {
    id: 'smothered',
    title: { ko: '5. 나이트의 기습', en: '5. Knight Ambush' },
    fen: '6rk/6pp/8/6N1/8/8/8/K7 w - - 0 1',
    solution: 'g5f7',
    hint: {
      ko: '검은 킹은 자기 말들에 둘러싸여 있어요. 나이트는 뛰어넘을 수 있어요.',
      en: 'The black king is smothered by its own pieces. Knights can jump over them.',
    },
  },
  {
    id: 'scholars',
    title: { ko: '6. 네 수 메이트', en: '6. Four-Move Mate' },
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 4 4',
    solution: 'f3f7',
    hint: {
      ko: 'f7 폰은 킹만 지키고 있어요. 그런데 내 비숍이 f7 을 보고 있네요.',
      en: 'Only the king guards the f7 pawn, and your bishop is watching f7 too.',
    },
  },
];

/**
 * 전체 문제: 입문 6개 뒤에 Lichess 에서 가져온 문제가 쉬운 순으로 이어진다.
 * 가져온 문제는 scripts/import-puzzles.ts 로 다시 만들 수 있다.
 */
export const PUZZLES: Puzzle[] = [
  ...HANDMADE_PUZZLES,
  ...GENERATED_PUZZLES.map((g, i) => {
    const n = HANDMADE_PUZZLES.length + i + 1;
    return {
      id: `lichess-${g.id}`,
      title: { ko: `${n}. 퍼즐`, en: `${n}. Puzzle` },
      fen: g.fen,
      solution: g.solution,
      hint: PIECE_HINT[g.piece],
      rating: g.rating,
      source: 'lichess' as const,
    };
  }),
];
