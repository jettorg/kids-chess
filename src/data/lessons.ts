import type { PieceType } from '../engine/types';
import type { Localized } from '../i18n';

export interface Lesson {
  id: string;
  piece: PieceType;
  /** 연습용 배치. 아이는 항상 흰색이고 검은 말은 움직이지 않는다. */
  fen: string;
  title: Localized;
  /** 말의 움직임 설명 */
  intro: Localized;
  /** 막혔을 때 보여줄 도움말 */
  tip: Localized;
}

export const LESSONS: Lesson[] = [
  {
    id: 'pawn',
    piece: 'p',
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
    piece: 'r',
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
    piece: 'b',
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
    piece: 'n',
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
    piece: 'q',
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
    piece: 'k',
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
