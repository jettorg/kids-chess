import type { Piece, PieceType } from '../engine/types';

/**
 * 말 그림은 모두 직접 그린 SVG 경로다 (외부 이미지·라이선스 없음).
 * viewBox 는 0 0 100 100 이며 아이가 보기 쉽게 두툼하게 그렸다.
 */

/** 모든 말이 공통으로 딛고 서는 받침대 */
const PLINTH =
  '<path d="M23 84h54a3 3 0 0 1 3 3v5a2 2 0 0 1-2 2H22a2 2 0 0 1-2-2v-5a3 3 0 0 1 3-3z"/>';

/** 받침대 위의 목받이 */
const COLLAR = '<path d="M28 71h44l4 11H24z"/>';

const SHAPES: Record<PieceType, string> = {
  p: `
    <circle cx="50" cy="28" r="14"/>
    <path d="M37 43h26l-4 13q9 10 11 26H30q2-16 11-26z"/>
    ${PLINTH}
  `,
  r: `
    <path d="M26 18h12v9h8v-9h8v9h8v-9h12v24l-7 6v24H33V48l-7-6z"/>
    ${COLLAR}
    ${PLINTH}
  `,
  n: `
    <path d="M33 84c0-20 5-30 17-38-7 1-14 6-19 4-5-2-3-9 2-14 7-7 15-11 22-13l3-7c13 6 20 19 21 34 1 14-2 22-4 27-1 4-1 7-1 11z"/>
    <circle cx="58" cy="31" r="3.4" class="detail"/>
    ${PLINTH}
  `,
  b: `
    <circle cx="50" cy="15" r="6"/>
    <path d="M50 22c13 12 18 24 18 33 0 8-6 13-18 15-12-2-18-7-18-15 0-9 5-21 18-33z"/>
    <path d="M50 37v17M41 46h18" class="detail-line"/>
    ${COLLAR}
    ${PLINTH}
  `,
  q: `
    <path d="M25 71 20 30l13 15 8-21 9 19 9-19 8 21 13-15-5 41z"/>
    <circle cx="20" cy="26" r="5.5"/>
    <circle cx="41" cy="18" r="5.5"/>
    <circle cx="59" cy="18" r="5.5"/>
    <circle cx="80" cy="26" r="5.5"/>
    <circle cx="50" cy="13" r="5.5"/>
    ${COLLAR}
    ${PLINTH}
  `,
  k: `
    <path d="M45 5h10v8h8v9h-8v9h-10v-9h-8v-9h8z"/>
    <path d="M28 71c-7-27 4-37 22-37s29 10 22 37z"/>
    <path d="M32 53h36a3.5 3.5 0 0 1 0 7H32a3.5 3.5 0 0 1 0-7z" class="detail"/>
    ${COLLAR}
    ${PLINTH}
  `,
};

/** 말 하나의 SVG 문자열 */
export function pieceSvg(piece: Piece, extraClass = ''): string {
  return `<svg class="piece piece-${piece.color} ${extraClass}" viewBox="0 0 100 100" aria-hidden="true">${SHAPES[piece.type]}</svg>`;
}

/** 안내 카드용 (색 지정) */
export function pieceIcon(type: PieceType, color: 'w' | 'b' = 'w'): string {
  return pieceSvg({ type, color }, 'piece-icon');
}
