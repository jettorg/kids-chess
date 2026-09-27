import type { PieceType } from '../engine/types';

export interface Lesson {
  id: string;
  title: string;
  piece: PieceType;
  /** 연습용 배치. 아이는 항상 흰색이고 검은 말은 움직이지 않는다. */
  fen: string;
  /** 말의 움직임 설명 */
  intro: string;
  /** 막혔을 때 보여줄 도움말 */
  tip: string;
}

export const LESSONS: Lesson[] = [
  {
    id: 'pawn',
    title: '폰 배우기',
    piece: 'p',
    fen: '8/8/8/8/8/2p2p1p/1P2P1P1/8 w - - 0 1',
    intro: '폰은 앞으로 한 칸 갑니다. 하지만 잡을 때는 대각선으로 잡아요. 첫 이동에서는 두 칸도 갈 수 있어요.',
    tip: '검은 폰은 앞이 아니라 대각선 앞에 있어요. 대각선으로 잡아 보세요.',
  },
  {
    id: 'rook',
    title: '룩 배우기',
    piece: 'r',
    fen: '8/8/8/p3p3/8/8/8/R3p3 w - - 0 1',
    intro: '룩은 가로와 세로로 원하는 만큼 멀리 갑니다. 대각선으로는 못 가요.',
    tip: '위로 쭉 올라가서 잡고, 그다음 옆으로 쭉 가 보세요.',
  },
  {
    id: 'bishop',
    title: '비숍 배우기',
    piece: 'b',
    fen: '3p4/8/8/6p1/8/4p3/8/2B5 w - - 0 1',
    intro: '비숍은 대각선으로만 움직입니다. 그래서 처음 있던 칸과 같은 색 칸에만 갈 수 있어요.',
    tip: '검은 말 세 개가 모두 같은 색 칸에 있어요. 대각선을 따라가 보세요.',
  },
  {
    id: 'knight',
    title: '나이트 배우기',
    piece: 'n',
    fen: '8/8/5p2/8/4p3/2p5/8/1N6 w - - 0 1',
    intro: '나이트는 ㄱ 자로 움직입니다. 두 칸 가고 옆으로 한 칸이에요. 다른 말을 뛰어넘을 수 있는 유일한 말이에요.',
    tip: '나이트를 누르면 갈 수 있는 칸에 점이 생겨요. 점이 찍힌 칸만 갈 수 있어요.',
  },
  {
    id: 'queen',
    title: '퀸 배우기',
    piece: 'q',
    fen: '4p3/8/8/3p3p/8/8/8/3Q4 w - - 0 1',
    intro: '퀸은 가장 힘이 센 말입니다. 룩처럼 가로·세로로, 비숍처럼 대각선으로 멀리 갈 수 있어요.',
    tip: '위로 갔다가, 옆으로 갔다가, 대각선으로 가 보세요.',
  },
  {
    id: 'king',
    title: '킹 배우기',
    piece: 'k',
    fen: '8/8/8/5p2/4p3/4p3/4p3/4K3 w - - 0 1',
    intro: '킹은 어느 방향으로든 한 칸씩만 움직입니다. 그리고 상대가 공격하는 칸으로는 갈 수 없어요.',
    tip: '상대 폰이 지키는 칸은 점이 안 생겨요. 지키는 폰을 먼저 잡아야 해요.',
  },
];

export interface PieceGuide {
  type: PieceType;
  name: string;
  movement: string;
  value: string;
}

export const PIECE_GUIDE: PieceGuide[] = [
  { type: 'p', name: '폰', movement: '앞으로 한 칸 (첫 수는 두 칸), 잡을 때는 대각선', value: '1점' },
  { type: 'n', name: '나이트', movement: 'ㄱ 자로 이동, 다른 말을 뛰어넘을 수 있어요', value: '3점' },
  { type: 'b', name: '비숍', movement: '대각선으로 멀리', value: '3점' },
  { type: 'r', name: '룩', movement: '가로·세로로 멀리', value: '5점' },
  { type: 'q', name: '퀸', movement: '가로·세로·대각선 모두 멀리', value: '9점' },
  { type: 'k', name: '킹', movement: '어느 방향이든 한 칸. 잡히면 게임이 끝나요', value: '가장 소중해요' },
];
