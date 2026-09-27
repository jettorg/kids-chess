export interface Puzzle {
  id: string;
  title: string;
  fen: string;
  /** 정답 예시 (from+to). 다른 체크메이트 수도 정답으로 인정한다. */
  solution: string;
  hint: string;
}

/** 모두 "흰색이 한 수로 체크메이트" 문제 */
export const PUZZLES: Puzzle[] = [
  {
    id: 'backrank',
    title: '1. 마지막 줄 공격',
    fen: '6k1/5ppp/8/8/8/8/8/R6K w - - 0 1',
    solution: 'a1a8',
    hint: '검은 킹 앞은 자기 폰으로 막혀 있어요. 맨 위 줄을 노려보세요.',
  },
  {
    id: 'queen-backrank',
    title: '2. 퀸으로 마무리',
    fen: '6k1/5ppp/8/8/8/8/5PPP/4Q1K1 w - - 0 1',
    solution: 'e1e8',
    hint: '퀸도 룩처럼 세로로 쭉 갈 수 있어요.',
  },
  {
    id: 'two-rooks',
    title: '3. 룩 두 개로',
    fen: '7k/R7/8/8/8/8/8/1R5K w - - 0 1',
    solution: 'b1b8',
    hint: '한 룩이 아래 줄을 막고 있어요. 다른 룩을 맨 위 줄로 올려 보세요.',
  },
  {
    id: 'queen-corner',
    title: '4. 킹과 퀸의 합동 작전',
    fen: '6k1/8/6K1/8/8/8/8/7Q w - - 0 1',
    solution: 'h1a8',
    hint: '내 킹이 이미 상대 킹의 도망길을 막고 있어요. 퀸은 킹 옆에 두면 잡히니 멀리서 노려보세요.',
  },
  {
    id: 'smothered',
    title: '5. 나이트의 기습',
    fen: '6rk/6pp/8/6N1/8/8/8/K7 w - - 0 1',
    solution: 'g5f7',
    hint: '검은 킹은 자기 말들에 둘러싸여 있어요. 나이트는 뛰어넘을 수 있어요.',
  },
  {
    id: 'scholars',
    title: '6. 네 수 메이트',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 4 4',
    solution: 'f3f7',
    hint: 'f7 폰은 킹만 지키고 있어요. 그런데 내 비숍이 f7 을 보고 있네요.',
  },
];
