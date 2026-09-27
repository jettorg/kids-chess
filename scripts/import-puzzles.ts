/**
 * Lichess 퍼즐 데이터베이스(CC0) 에서 "흰색이 한 수로 체크메이트" 문제를 골라
 * src/data/puzzles.generated.ts 로 만든다.
 *
 *   npx tsx scripts/import-puzzles.ts <lichess_db_puzzle.csv> [개수=120] [최대레이팅=1300]
 *
 * CSV 는 https://database.lichess.org/lichess_db_puzzle.csv.zst 를 zstd 로 푼 것이다.
 * 전체 파일은 수 GB 이므로 앞부분만 잘라 써도 된다:
 *   curl -s https://database.lichess.org/lichess_db_puzzle.csv.zst | zstd -dc | head -n 400000 > puzzles.csv
 *
 * 고르는 기준
 *  - 테마에 mateIn1 이 있고, 상대(흑)의 첫 수를 둔 뒤 흰색 차례인 문제
 *  - 레이팅이 최대레이팅 이하, 인기도 85 이상, 플레이 300회 이상
 *  - 우리 엔진으로 정답 수를 두었을 때 실제로 체크메이트인지 검증 (틀리면 버림)
 *  - 레이팅 순으로 고르게 골라 쉬운 것에서 어려운 것으로 이어지게 함
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { Game, findMove, fromAlgebraic, parseFen, toFen } from '../src/engine';
import type { PieceType } from '../src/engine/types';

interface Candidate {
  id: string;
  fen: string;
  solution: string;
  rating: number;
  piece: PieceType;
  pieces: number;
}

const [csvPath, countArg, ratingArg] = process.argv.slice(2);
if (!csvPath) {
  console.error('사용법: npx tsx scripts/import-puzzles.ts <csv> [개수] [최대레이팅]');
  process.exit(1);
}
const wanted = Number(countArg ?? 120);
const maxRating = Number(ratingArg ?? 1300);

const lines = readFileSync(csvPath, 'utf8').split('\n');
const header = lines[0]!.split(',');
const col = (name: string) => header.indexOf(name);
const iFen = col('FEN');
const iMoves = col('Moves');
const iRating = col('Rating');
const iPop = col('Popularity');
const iPlays = col('NbPlays');
const iThemes = col('Themes');
const iId = col('PuzzleId');

const candidates: Candidate[] = [];
let rejected = 0;

for (const line of lines.slice(1)) {
  if (!line) continue;
  const cells = line.split(',');
  const themes = cells[iThemes] ?? '';
  if (!themes.split(' ').includes('mateIn1')) continue;
  const rating = Number(cells[iRating]);
  if (!(rating <= maxRating)) continue;
  if (Number(cells[iPop]) < 85 || Number(cells[iPlays]) < 300) continue;

  const startFen = cells[iFen]!;
  if (startFen.split(' ')[1] !== 'b') continue; // 흑이 먼저 두고 백이 메이트하는 문제만

  const [opponentMove, solution] = (cells[iMoves] ?? '').split(' ');
  if (!opponentMove || !solution) continue;

  try {
    const start = parseFen(startFen);
    const first = findMove(start, fromAlgebraic(opponentMove.slice(0, 2)), fromAlgebraic(opponentMove.slice(2, 4)),
      opponentMove[4] as PieceType | undefined);
    if (!first) { rejected++; continue; }
    const game = new Game(start);
    game.playMove(first);
    const fen = toFen(game.position);
    const mate = findMove(game.position, fromAlgebraic(solution.slice(0, 2)), fromAlgebraic(solution.slice(2, 4)),
      solution[4] as PieceType | undefined);
    if (!mate) { rejected++; continue; }
    const check = new Game(game.position);
    check.playMove(mate);
    if (check.status().kind !== 'checkmate') { rejected++; continue; }
    const pieces = game.position.board.filter(Boolean).length;
    candidates.push({ id: cells[iId]!, fen, solution: solution.slice(0, 4), rating, piece: mate.promotion ?? mate.piece, pieces });
  } catch {
    rejected++;
  }
}

candidates.sort((a, b) => a.rating - b.rating || a.pieces - b.pieces);

// 레이팅 순으로 고르게 뽑아 난이도가 서서히 올라가게 한다
const picked: Candidate[] = [];
if (candidates.length <= wanted) {
  picked.push(...candidates);
} else {
  const step = candidates.length / wanted;
  const seen = new Set<string>();
  for (let i = 0; i < wanted; i++) {
    const c = candidates[Math.floor(i * step)]!;
    if (seen.has(c.fen)) continue;
    seen.add(c.fen);
    picked.push(c);
  }
}

const out = `/**
 * 자동 생성 파일 — scripts/import-puzzles.ts 가 만든다. 직접 고치지 말 것.
 * 출처: Lichess 퍼즐 데이터베이스 (https://database.lichess.org, CC0 1.0)
 * 모두 "흰색이 한 수로 체크메이트" 문제이며 우리 엔진으로 정답을 검증했다.
 */
import type { PieceType } from '../engine/types';

export interface GeneratedPuzzle {
  /** Lichess 퍼즐 ID (https://lichess.org/training/<id>) */
  id: string;
  /** 흰색 차례인 배치 */
  fen: string;
  /** 정답 수 (from+to) */
  solution: string;
  /** Lichess 난이도 레이팅 */
  rating: number;
  /** 메이트를 만드는 말 — 힌트 문구에 쓴다 */
  piece: PieceType;
}

export const GENERATED_PUZZLES: GeneratedPuzzle[] = ${JSON.stringify(
  picked.map(({ id, fen, solution, rating, piece }) => ({ id, fen, solution, rating, piece })),
  null,
  2,
)};
`;

writeFileSync('src/data/puzzles.generated.ts', out);
const ratings = picked.map((p) => p.rating);
console.log(
  `후보 ${candidates.length}개 (엔진 검증 탈락 ${rejected}개) 중 ${picked.length}개 저장 → src/data/puzzles.generated.ts`,
);
console.log(`레이팅 범위 ${Math.min(...ratings)} ~ ${Math.max(...ratings)}`);
