import type { CastlingRights, Color, Piece, PieceType, Position, Square } from './types';

export const FILES = 'abcdefgh';

export function fileOf(sq: Square): number {
  return sq & 7;
}

export function rankOf(sq: Square): number {
  return sq >> 3;
}

export function squareAt(file: number, rank: number): Square {
  return rank * 8 + file;
}

export function onBoard(file: number, rank: number): boolean {
  return file >= 0 && file < 8 && rank >= 0 && rank < 8;
}

/** 0 -> 'a1' */
export function toAlgebraic(sq: Square): string {
  return FILES[fileOf(sq)] + String(rankOf(sq) + 1);
}

/** 'a1' -> 0 */
export function fromAlgebraic(name: string): Square {
  const file = FILES.indexOf(name[0]!.toLowerCase());
  const rank = Number(name[1]) - 1;
  if (file < 0 || rank < 0 || rank > 7) throw new Error(`잘못된 칸 이름: ${name}`);
  return squareAt(file, rank);
}

export function opposite(color: Color): Color {
  return color === 'w' ? 'b' : 'w';
}

export function emptyBoard(): (Piece | null)[] {
  return new Array<Piece | null>(64).fill(null);
}

export function clonePosition(pos: Position): Position {
  return {
    board: pos.board.slice(),
    turn: pos.turn,
    castling: { ...pos.castling },
    ep: pos.ep,
    halfmove: pos.halfmove,
    fullmove: pos.fullmove,
  };
}

export function findKing(pos: Position, color: Color): Square | null {
  for (let sq = 0; sq < 64; sq++) {
    const p = pos.board[sq];
    if (p && p.type === 'k' && p.color === color) return sq;
  }
  return null;
}

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export function initialPosition(): Position {
  return parseFen(START_FEN);
}

function pieceFromChar(ch: string): Piece {
  const color: Color = ch === ch.toUpperCase() ? 'w' : 'b';
  return { type: ch.toLowerCase() as PieceType, color };
}

function charFromPiece(p: Piece): string {
  return p.color === 'w' ? p.type.toUpperCase() : p.type;
}

/**
 * FEN 문자열을 Position 으로 변환한다.
 * 보드 부분만 넘기면 나머지는 기본값(백 차례, 캐슬링 없음)을 쓴다.
 */
export function parseFen(fen: string): Position {
  const parts = fen.trim().split(/\s+/);
  const boardPart = parts[0]!;
  const board = emptyBoard();
  const rows = boardPart.split('/');
  if (rows.length !== 8) throw new Error(`FEN 보드는 8줄이어야 합니다: ${boardPart}`);

  // FEN 은 8랭크부터 내려온다.
  for (let row = 0; row < 8; row++) {
    const rank = 7 - row;
    let file = 0;
    for (const ch of rows[row]!) {
      if (ch >= '1' && ch <= '8') {
        file += Number(ch);
      } else {
        if (file > 7) throw new Error(`FEN 줄이 너무 깁니다: ${rows[row]}`);
        board[squareAt(file, rank)] = pieceFromChar(ch);
        file++;
      }
    }
    if (file !== 8) throw new Error(`FEN 줄 길이가 8이 아닙니다: ${rows[row]}`);
  }

  const turn: Color = parts[1] === 'b' ? 'b' : 'w';
  const rightsText = parts[2] ?? '-';
  const castling: CastlingRights = {
    wk: rightsText.includes('K'),
    wq: rightsText.includes('Q'),
    bk: rightsText.includes('k'),
    bq: rightsText.includes('q'),
  };
  const epText = parts[3] ?? '-';
  const ep = epText && epText !== '-' ? fromAlgebraic(epText) : null;
  const halfmove = Number(parts[4] ?? 0) || 0;
  const fullmove = Number(parts[5] ?? 1) || 1;

  return { board, turn, castling, ep, halfmove, fullmove };
}

export function toFen(pos: Position): string {
  const rows: string[] = [];
  for (let rank = 7; rank >= 0; rank--) {
    let row = '';
    let gap = 0;
    for (let file = 0; file < 8; file++) {
      const p = pos.board[squareAt(file, rank)];
      if (!p) {
        gap++;
      } else {
        if (gap) row += String(gap);
        gap = 0;
        row += charFromPiece(p);
      }
    }
    if (gap) row += String(gap);
    rows.push(row);
  }
  const rights =
    (pos.castling.wk ? 'K' : '') +
    (pos.castling.wq ? 'Q' : '') +
    (pos.castling.bk ? 'k' : '') +
    (pos.castling.bq ? 'q' : '');
  return [
    rows.join('/'),
    pos.turn,
    rights || '-',
    pos.ep === null ? '-' : toAlgebraic(pos.ep),
    String(pos.halfmove),
    String(pos.fullmove),
  ].join(' ');
}

/** 3회 동형 반복 판정을 위한 키 (기물 배치 + 차례 + 캐슬링 권리 + 앙파상) */
export function positionKey(pos: Position): string {
  const f = toFen(pos).split(' ');
  return f.slice(0, 4).join(' ');
}
