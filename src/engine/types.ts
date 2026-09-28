/** 체스 규칙 엔진의 기본 타입 정의 */

export type Color = 'w' | 'b';

/** p=폰, n=나이트, b=비숍, r=룩, q=퀸, k=킹 */
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

export interface Piece {
  type: PieceType;
  color: Color;
}

/**
 * 칸 번호는 0..63.
 * index = rank * 8 + file 이며 file 0='a', rank 0='1'.
 * 즉 0=a1, 7=h1, 56=a8, 63=h8.
 */
export type Square = number;

export interface CastlingRights {
  wk: boolean;
  wq: boolean;
  bk: boolean;
  bq: boolean;
}

export interface Position {
  board: (Piece | null)[];
  turn: Color;
  castling: CastlingRights;
  /** 앙파상으로 잡을 수 있는 칸 (폰이 지나간 칸), 없으면 null */
  ep: Square | null;
  /** 50수 규칙용 반수 카운터 */
  halfmove: number;
  fullmove: number;
  /** Zobrist 해시 (하위 32비트) — makeMove/unmakeMove 가 증분 갱신한다 */
  hashLo: number;
  /** Zobrist 해시 (상위 32비트) */
  hashHi: number;
}

export interface Move {
  from: Square;
  to: Square;
  piece: PieceType;
  color: Color;
  /** 잡은 말의 종류 (앙파상 포함) */
  captured?: PieceType;
  /** 폰 승격 시 승격할 말 */
  promotion?: PieceType;
  /** 앙파상 여부 */
  enPassant?: boolean;
  /** 캐슬링 방향 */
  castle?: 'k' | 'q';
  /** 폰 두 칸 전진 */
  doublePawn?: boolean;
}

export type GameStatus =
  | { kind: 'playing'; check: boolean }
  | { kind: 'checkmate'; winner: Color }
  | { kind: 'stalemate' }
  | { kind: 'draw'; reason: 'fifty' | 'repetition' | 'material' };

export const WHITE: Color = 'w';
export const BLACK: Color = 'b';

export const PIECE_VALUE: Record<PieceType, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

