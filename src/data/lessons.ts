import type { PieceType } from '../engine/types';
import type { Localized } from '../i18n';

/** 레슨의 목표. 아이의 수 뒤에 판정한다. */
export type LessonGoal =
  /** 검은 말을 모두 잡기 (상대는 움직이지 않음) */
  | { kind: 'capture-all' }
  /** 흰 말 하나를 표시된 칸까지 보내기 */
  | { kind: 'reach'; square: string }
  /** 체크메이트 만들기 */
  | { kind: 'checkmate' }
  /** 체크에서 벗어나기 (합법인 수는 모두 벗어나는 수다) */
  | { kind: 'escape-check' }
  /** 캐슬링 하기 */
  | { kind: 'castle' }
  /** 폰 승격하기 */
  | { kind: 'promote' }
  /** 앙파상으로 잡기 */
  | { kind: 'en-passant' };

export interface Lesson {
  id: string;
  /** 목록에 보여줄 짧은 이름 */
  short: Localized;
  /** 말 배우기 레슨이면 그 말 (아이콘·문구용) */
  piece?: PieceType;
  /** 연습용 배치. 아이는 항상 흰색이다. */
  fen: string;
  title: Localized;
  /** 규칙 설명 */
  intro: Localized;
  /** 막혔을 때 보여줄 도움말 */
  tip: Localized;
  goal: LessonGoal;
  /** 상대의 대본: 내 n번째 수 뒤에 두는 수 (UCI). 없으면 상대는 움직이지 않는다. */
  opponentMoves?: string[];
}

const PIECE_LESSON = (piece: PieceType, short: Localized): Pick<Lesson, 'piece' | 'short' | 'goal'> => ({
  piece,
  short,
  goal: { kind: 'capture-all' },
});

export const LESSONS: Lesson[] = [
  {
    id: 'pawn',
    ...PIECE_LESSON('p', { ko: '폰', en: 'Pawn' }),
    fen: '8/8/8/8/8/2p2p1p/1P2P1P1/8 w - - 0 1',
    title: { ko: '폰 배우기', en: 'Learn the Pawn' },
    intro: {
      ko: '폰은 앞으로 한 칸 갑니다. 하지만 잡을 때는 대각선으로 잡아요. 첫 이동에서는 두 칸도 갈 수 있어요.',
      en: 'Pawns move forward one square, but they capture diagonally. On their very first move they may go two squares.',
    },
    tip: {
      ko: '검은 폰은 앞이 아니라 대각선 앞에 있어요. 대각선으로 잡아 보세요.',
      en: 'The black pawns are not straight ahead but diagonally in front. Capture them diagonally.',
    },
  },
  {
    id: 'rook',
    ...PIECE_LESSON('r', { ko: '룩', en: 'Rook' }),
    fen: '8/8/8/p3p3/8/8/8/R3p3 w - - 0 1',
    title: { ko: '룩 배우기', en: 'Learn the Rook' },
    intro: {
      ko: '룩은 가로와 세로로 원하는 만큼 멀리 갑니다. 대각선으로는 못 가요.',
      en: 'Rooks slide as far as you like in straight lines: up, down, left or right. Never diagonally.',
    },
    tip: {
      ko: '위로 쭉 올라가서 잡고, 그다음 옆으로 쭉 가 보세요.',
      en: 'Slide straight up to capture, then slide sideways.',
    },
  },
  {
    id: 'bishop',
    ...PIECE_LESSON('b', { ko: '비숍', en: 'Bishop' }),
    fen: '3p4/8/8/6p1/8/4p3/8/2B5 w - - 0 1',
    title: { ko: '비숍 배우기', en: 'Learn the Bishop' },
    intro: {
      ko: '비숍은 대각선으로만 움직입니다. 그래서 처음 있던 칸과 같은 색 칸에만 갈 수 있어요.',
      en: 'Bishops move only on diagonals, so they always stay on the same color of square they started on.',
    },
    tip: {
      ko: '검은 말 세 개가 모두 같은 색 칸에 있어요. 대각선을 따라가 보세요.',
      en: 'All three black pieces sit on the same color of square. Follow the diagonals.',
    },
  },
  {
    id: 'knight',
    ...PIECE_LESSON('n', { ko: '나이트', en: 'Knight' }),
    fen: '8/8/5p2/8/4p3/2p5/8/1N6 w - - 0 1',
    title: { ko: '나이트 배우기', en: 'Learn the Knight' },
    intro: {
      ko: '나이트는 ㄱ 자로 움직입니다. 두 칸 가고 옆으로 한 칸이에요. 다른 말을 뛰어넘을 수 있는 유일한 말이에요.',
      en: 'Knights move in an L shape: two squares one way, then one square to the side. They are the only piece that can jump over others.',
    },
    tip: {
      ko: '나이트를 누르면 갈 수 있는 칸에 점이 생겨요. 점이 찍힌 칸만 갈 수 있어요.',
      en: 'Tap the knight and dots appear where it can go. Only the dotted squares are allowed.',
    },
  },
  {
    id: 'queen',
    ...PIECE_LESSON('q', { ko: '퀸', en: 'Queen' }),
    fen: '4p3/8/8/3p3p/8/8/8/3Q4 w - - 0 1',
    title: { ko: '퀸 배우기', en: 'Learn the Queen' },
    intro: {
      ko: '퀸은 가장 힘이 센 말입니다. 룩처럼 가로·세로로, 비숍처럼 대각선으로 멀리 갈 수 있어요.',
      en: 'The queen is the strongest piece. She moves in straight lines like a rook and on diagonals like a bishop, as far as she likes.',
    },
    tip: {
      ko: '위로 갔다가, 옆으로 갔다가, 대각선으로 가 보세요.',
      en: 'Go up, then sideways, then along a diagonal.',
    },
  },
  {
    id: 'king',
    ...PIECE_LESSON('k', { ko: '킹', en: 'King' }),
    fen: '8/8/8/5p2/4p3/4p3/4p3/4K3 w - - 0 1',
    title: { ko: '킹 배우기', en: 'Learn the King' },
    intro: {
      ko: '킹은 어느 방향으로든 한 칸씩만 움직입니다. 그리고 상대가 공격하는 칸으로는 갈 수 없어요.',
      en: 'The king moves one square in any direction. He may never step onto a square the enemy attacks.',
    },
    tip: {
      ko: '상대 폰이 지키는 칸은 점이 안 생겨요. 지키는 폰을 먼저 잡아야 해요.',
      en: 'Squares guarded by a black pawn show no dot. Capture the guarding pawn first.',
    },
  },
  {
    id: 'escape-check',
    short: { ko: '체크 피하기', en: 'Escape check' },
    fen: '4r2k/8/8/1B6/8/2N5/8/4K3 w - - 0 1',
    title: { ko: '체크에서 벗어나기', en: 'Escaping Check' },
    intro: {
      ko: '검은 룩이 내 킹을 공격하고 있어요. 이게 체크예요. 체크를 당하면 반드시 벗어나야 해요. 방법은 세 가지: 킹이 피하기, 사이를 막기, 공격하는 말 잡기.',
      en: 'The black rook is attacking your king. That is check. When in check you must get out of it. There are three ways: move the king, block the attack, or capture the attacker.',
    },
    tip: {
      ko: '킹을 눌러 피할 칸을 보거나, 나이트로 e2 를 막거나, 비숍으로 룩을 잡아 보세요. 셋 다 정답이에요.',
      en: 'Tap the king to see escape squares, block on e2 with the knight, or capture the rook with the bishop. All three are correct.',
    },
    goal: { kind: 'escape-check' },
  },
  {
    id: 'castle',
    short: { ko: '캐슬링', en: 'Castling' },
    fen: 'r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1',
    title: { ko: '캐슬링 하기', en: 'Castling' },
    intro: {
      ko: '캐슬링은 킹과 룩을 한 번에 옮기는 특별한 수예요. 킹이 룩 쪽으로 두 칸 가면 룩이 킹을 뛰어넘어 옆에 앉아요. 킹과 룩이 한 번도 움직이지 않았고, 사이가 비어 있고, 킹이 체크가 아닐 때만 할 수 있어요.',
      en: 'Castling moves the king and a rook at once. The king steps two squares toward a rook, and the rook hops over to sit beside it. It is allowed only if neither piece has moved, the squares between are empty, and the king is not in check.',
    },
    tip: {
      ko: '킹을 누르면 두 칸 떨어진 곳에도 점이 생겨요. 어느 쪽이든 좋아요.',
      en: 'Tap the king and you will see dots two squares away. Either side works.',
    },
    goal: { kind: 'castle' },
  },
  {
    id: 'promote',
    short: { ko: '승격', en: 'Promotion' },
    fen: '4k3/1P6/8/8/8/8/8/4K3 w - - 0 1',
    title: { ko: '폰 승격', en: 'Pawn Promotion' },
    intro: {
      ko: '폰이 끝까지 가면 다른 말로 바뀌어요. 보통은 가장 센 퀸을 골라요. 폰이 하나만 남아도 승격하면 게임을 뒤집을 수 있어요.',
      en: 'When a pawn reaches the far end it turns into another piece. Most people choose the queen. Even one pawn can turn a game around by promoting.',
    },
    tip: {
      ko: '폰을 한 칸 앞으로 보내면 무엇으로 바꿀지 물어봐요.',
      en: 'Push the pawn one square forward and you will be asked what it becomes.',
    },
    goal: { kind: 'promote' },
  },
  {
    id: 'en-passant',
    short: { ko: '앙파상', en: 'En passant' },
    fen: '4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1',
    title: { ko: '앙파상', en: 'En Passant' },
    intro: {
      ko: '상대 폰이 방금 두 칸 뛰어서 내 폰 옆에 왔어요. 이때만 딱 한 번, 마치 한 칸만 온 것처럼 대각선으로 잡을 수 있어요. 이걸 앙파상이라고 해요.',
      en: 'The enemy pawn just jumped two squares and landed beside your pawn. Right now, and only now, you may capture it diagonally as if it had moved one square. This is called en passant.',
    },
    tip: {
      ko: '내 폰을 누르면 검은 폰 뒤쪽 칸에 점이 생겨요. 그 칸으로 가면 잡혀요.',
      en: 'Tap your pawn and a dot appears behind the black pawn. Move there to capture it.',
    },
    goal: { kind: 'en-passant' },
  },
  {
    id: 'checkmate',
    short: { ko: '체크메이트', en: 'Checkmate' },
    fen: '6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1',
    title: { ko: '체크메이트 만들기', en: 'Making Checkmate' },
    intro: {
      ko: '체크인데 피할 수도, 막을 수도, 잡을 수도 없으면 체크메이트예요. 게임이 끝나요. 검은 킹은 자기 폰에 둘러싸여 앞으로 못 나가요. 맨 위 줄을 공격하면 어떻게 될까요?',
      en: 'Check with no escape, no block and no capture is checkmate. The game ends. The black king is boxed in by its own pawns. What happens if you attack the top row?',
    },
    tip: {
      ko: '룩을 맨 위 줄로 올려 보세요.',
      en: 'Bring the rook up to the top row.',
    },
    goal: { kind: 'checkmate' },
  },
  {
    id: 'reach',
    short: { ko: '길 찾기', en: 'Find the path' },
    piece: 'n',
    fen: '8/8/8/8/8/8/8/1N6 w - - 0 1',
    title: { ko: '나이트로 길 찾기', en: 'Knight Path' },
    intro: {
      ko: '나이트를 초록색 칸까지 데려가 보세요. ㄱ 자로만 움직일 수 있어서 몇 번 뛰어야 할지 생각해야 해요.',
      en: 'Bring the knight to the green square. It only moves in L shapes, so plan how many jumps you need.',
    },
    tip: {
      ko: 'b1 에서 h8 까지는 다섯 번이면 갈 수 있어요. 가운데를 지나가면 빨라요.',
      en: 'From b1 to h8 takes five jumps. Going through the middle is quickest.',
    },
    goal: { kind: 'reach', square: 'h8' },
  },
];

export interface PieceGuide {
  type: PieceType;
  name: Localized;
  movement: Localized;
  value: Localized;
}

export const PIECE_GUIDE: PieceGuide[] = [
  {
    type: 'p',
    name: { ko: '폰', en: 'Pawn' },
    movement: {
      ko: '앞으로 한 칸 (첫 수는 두 칸), 잡을 때는 대각선',
      en: 'Forward one square (two on its first move); captures diagonally',
    },
    value: { ko: '1점', en: '1 point' },
  },
  {
    type: 'n',
    name: { ko: '나이트', en: 'Knight' },
    movement: {
      ko: 'ㄱ 자로 이동, 다른 말을 뛰어넘을 수 있어요',
      en: 'Moves in an L shape and can jump over other pieces',
    },
    value: { ko: '3점', en: '3 points' },
  },
  {
    type: 'b',
    name: { ko: '비숍', en: 'Bishop' },
    movement: { ko: '대각선으로 멀리', en: 'Along diagonals, as far as you like' },
    value: { ko: '3점', en: '3 points' },
  },
  {
    type: 'r',
    name: { ko: '룩', en: 'Rook' },
    movement: { ko: '가로·세로로 멀리', en: 'In straight lines, as far as you like' },
    value: { ko: '5점', en: '5 points' },
  },
  {
    type: 'q',
    name: { ko: '퀸', en: 'Queen' },
    movement: {
      ko: '가로·세로·대각선 모두 멀리',
      en: 'Straight lines and diagonals, as far as you like',
    },
    value: { ko: '9점', en: '9 points' },
  },
  {
    type: 'k',
    name: { ko: '킹', en: 'King' },
    movement: {
      ko: '어느 방향이든 한 칸. 잡히면 게임이 끝나요',
      en: 'One square in any direction. If it is trapped, the game is over',
    },
    value: { ko: '가장 소중해요', en: 'The most precious' },
  },
];

export interface Rule {
  term: Localized;
  text: Localized;
}

export const RULES: Rule[] = [
  {
    term: { ko: '체크', en: 'Check' },
    text: {
      ko: '내 킹이 공격받는 상태예요. 반드시 막거나 피해야 해요.',
      en: 'Your king is under attack. You must block it or move away.',
    },
  },
  {
    term: { ko: '체크메이트', en: 'Checkmate' },
    text: {
      ko: '체크를 막을 방법이 없으면 게임이 끝나요.',
      en: 'When there is no way to stop the check, the game ends.',
    },
  },
  {
    term: { ko: '캐슬링', en: 'Castling' },
    text: {
      ko: '킹과 룩을 한 번에 옮겨 킹을 안전하게 숨기는 특별한 수예요.',
      en: 'A special move that shifts the king and a rook at once to tuck the king away safely.',
    },
  },
  {
    term: { ko: '승격', en: 'Promotion' },
    text: {
      ko: '폰이 끝까지 가면 퀸처럼 더 센 말로 바뀌어요.',
      en: 'A pawn that reaches the far end turns into a stronger piece, usually a queen.',
    },
  },
  {
    term: { ko: '앙파상', en: 'En passant' },
    text: {
      ko: '상대 폰이 두 칸 뛰어 내 폰을 지나가면 바로 잡을 수 있어요.',
      en: 'If an enemy pawn jumps two squares past your pawn, you may capture it right away.',
    },
  },
];
