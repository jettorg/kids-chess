import type { Piece, Position } from './types';

/**
 * Zobrist 해시. 배치마다 거의 고유한 번호를 붙여 전치 테이블의 키로 쓴다.
 * JS 비트 연산이 32비트라 lo/hi 두 정수를 따로 XOR 한다.
 * 표는 고정 시드로 만들어 실행할 때마다 같다.
 */

function xorshift(seed: number): () => number {
  let x = seed | 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return x | 0;
  };
}

const next = xorshift(0x9e3779b9);
const fill = (n: number): Int32Array => {
  const out = new Int32Array(n);
  for (let i = 0; i < n; i++) out[i] = next();
  return out;
};

/** [말 12종 × 64칸] */
const PIECE_LO = fill(12 * 64);
const PIECE_HI = fill(12 * 64);
const SIDE_LO = next();
const SIDE_HI = next();
/** wk, wq, bk, bq */
const CASTLE_LO = fill(4);
const CASTLE_HI = fill(4);
/** 앙파상 파일 a~h */
const EP_LO = fill(8);
const EP_HI = fill(8);

const TYPE_INDEX = { p: 0, n: 1, b: 2, r: 3, q: 4, k: 5 } as const;

export function pieceIndex(piece: Piece): number {
  return (piece.color === 'w' ? 0 : 6) + TYPE_INDEX[piece.type];
}

export function pieceHashLo(piece: Piece, sq: number): number {
  return PIECE_LO[pieceIndex(piece) * 64 + sq]!;
}

export function pieceHashHi(piece: Piece, sq: number): number {
  return PIECE_HI[pieceIndex(piece) * 64 + sq]!;
}

export function castleHashLo(c: Position['castling']): number {
  return (c.wk ? CASTLE_LO[0]! : 0) ^ (c.wq ? CASTLE_LO[1]! : 0) ^ (c.bk ? CASTLE_LO[2]! : 0) ^ (c.bq ? CASTLE_LO[3]! : 0);
}

export function castleHashHi(c: Position['castling']): number {
  return (c.wk ? CASTLE_HI[0]! : 0) ^ (c.wq ? CASTLE_HI[1]! : 0) ^ (c.bk ? CASTLE_HI[2]! : 0) ^ (c.bq ? CASTLE_HI[3]! : 0);
}

export function epHashLo(ep: number | null): number {
  return ep === null ? 0 : EP_LO[ep & 7]!;
}

export function epHashHi(ep: number | null): number {
  return ep === null ? 0 : EP_HI[ep & 7]!;
}

export const SIDE_HASH_LO = SIDE_LO;
export const SIDE_HASH_HI = SIDE_HI;

/** 배치 전체를 훑어 해시를 처음부터 계산한다 (FEN 을 읽을 때, 검증할 때). */
export function computeHash(pos: Position): { lo: number; hi: number } {
  let lo = 0;
  let hi = 0;
  for (let sq = 0; sq < 64; sq++) {
    const piece = pos.board[sq];
    if (!piece) continue;
    lo ^= pieceHashLo(piece, sq);
    hi ^= pieceHashHi(piece, sq);
  }
  if (pos.turn === 'b') {
    lo ^= SIDE_LO;
    hi ^= SIDE_HI;
  }
  lo ^= castleHashLo(pos.castling);
  hi ^= castleHashHi(pos.castling);
  lo ^= epHashLo(pos.ep);
  hi ^= epHashHi(pos.ep);
  return { lo, hi };
}

/** Map 의 키로 쓸 53비트 정수 (hi 의 위 21비트 + lo 32비트) */
export function hashKey(pos: Position): number {
  return (pos.hashHi >>> 11) * 4294967296 + (pos.hashLo >>> 0);
}
