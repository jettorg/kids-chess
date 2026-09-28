/**
 * Lichess 퍼즐 데이터베이스(CC0) 에서 아이용 문제를 골라 src/data/puzzles.generated.ts 로 만든다.
 *
 *   npx tsx scripts/import-puzzles.ts <csv> [--mate1=100] [--mate2=60] [--fork=40] [--pin=20] [--hanging=40]
 *                                          [--max-rating=1600] [--seed=7]
 *
 * CSV 는 https://database.lichess.org/lichess_db_puzzle.csv.zst 를 zstd 로 푼 것이다. 전체 파일은
 * 수 GB 이므로 앞부분만 잘라 써도 된다:
 *   curl -s https://database.lichess.org/lichess_db_puzzle.csv.zst | zstd -dc | head -n 400000 > puzzles.csv
 *
 * 고르는 기준
 *  - 테마: mateIn1, mateIn2, fork, pin, hangingPiece. 한 문제가 여러 테마면 앞쪽 우선.
 *  - 정답 수열이 3수(플레이어-상대-플레이어) 이하인 것만. 흑이 푸는 문제도 포함한다(판을 뒤집어 보여줌).
 *  - 레이팅이 최대치 이하, 인기도 85 이상, 플레이 300회 이상.
 *  - 우리 엔진으로 정답 수열이 모두 합법이고, 메이트 문제는 마지막 수가 실제 체크메이트인지 검증.
 *  - 테마별로 레이팅 순으로 고르게 뽑아 쉬운 것에서 어려운 것으로 이어지게 함. 표본은 고정 시드.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { Game, findMove, fromAlgebraic, parseFen, toFen } from '../src/engine';
import type { Color, PieceType } from '../src/engine/types';

type Theme = 'mate1' | 'mate2' | 'fork' | 'pin' | 'hanging';
const THEME_ORDER: Theme[] = ['mate1', 'mate2', 'fork', 'hanging', 'pin'];
const THEME_TAG: Record<Theme, string> = { mate1: 'mateIn1', mate2: 'mateIn2', fork: 'fork', pin: 'pin', hanging: 'hangingPiece' };

interface Candidate {
  id: string;
  theme: Theme;
  side: Color;
  fen: string;
  line: string[];
  rating: number;
  piece: PieceType;
}

const args = process.argv.slice(2);
const csvPath = args.find((a) => !a.startsWith('--'));
if (!csvPath) {
  console.error('사용법: npx tsx scripts/import-puzzles.ts <csv> [--mate1=100 --mate2=60 --fork=40 --pin=20 --hanging=40 --max-rating=1600 --seed=7]');
  process.exit(1);
}
const option = (name: string, fallback: number): number => {
  const raw = args.find((a) => a.startsWith(`--${name}=`));
  return raw ? Number(raw.split('=')[1]) : fallback;
};
const wanted: Record<Theme, number> = {
  mate1: option('mate1', 100),
  mate2: option('mate2', 60),
  fork: option('fork', 40),
  pin: option('pin', 20),
  hanging: option('hanging', 40),
};
const maxRating = option('max-rating', 1600);
let seed = option('seed', 7) | 0;
const random = () => {
  seed ^= seed << 13;
  seed ^= seed >>> 17;
  seed ^= seed << 5;
  return ((seed >>> 0) % 1_000_000) / 1_000_000;
};

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

const uciMove = (pos: ReturnType<typeof parseFen>, uci: string) =>
  findMove(pos, fromAlgebraic(uci.slice(0, 2)), fromAlgebraic(uci.slice(2, 4)), uci[4] as PieceType | undefined);

const candidates: Record<Theme, Candidate[]> = { mate1: [], mate2: [], fork: [], pin: [], hanging: [] };
let rejected = 0;

for (const row of lines.slice(1)) {
  if (!row) continue;
  const cells = row.split(',');
  const tags = new Set((cells[iThemes] ?? '').split(' '));
  const theme = THEME_ORDER.find((t) => tags.has(THEME_TAG[t]));
  if (!theme) continue;
  const rating = Number(cells[iRating]);
  if (!(rating <= maxRating)) continue;
  if (Number(cells[iPop]) < 85 || Number(cells[iPlays]) < 300) continue;

  const [opponentMove, ...line] = (cells[iMoves] ?? '').split(' ');
  if (!opponentMove || line.length === 0 || line.length > 3 || line.length % 2 === 0) continue;
  if (theme === 'mate1' && line.length !== 1) continue;
  if (theme === 'mate2' && line.length !== 3) continue;

  try {
    const start = parseFen(cells[iFen]!);
    const first = uciMove(start, opponentMove);
    if (!first) throw new Error('첫 수 불법');
    const game = new Game(start);
    game.playMove(first);
    const fen = toFen(game.position);
    const side = game.position.turn;
    let piece: PieceType | null = null;
    for (const uci of line) {
      const move = uciMove(game.position, uci);
      if (!move) throw new Error(`수열 불법: ${uci}`);
      piece ??= move.promotion ?? move.piece;
      game.playMove(move);
    }
    if ((theme === 'mate1' || theme === 'mate2') && game.status().kind !== 'checkmate') throw new Error('메이트 아님');
    candidates[theme].push({ id: cells[iId]!, theme, side, fen, line, rating, piece: piece! });
  } catch {
    rejected++;
  }
}

// 테마별로 레이팅 순 정렬 뒤, 무작위 시작점에서 고르게 뽑는다 (같은 배치 중복 제외)
const picked: Candidate[] = [];
for (const theme of THEME_ORDER) {
  const pool = candidates[theme].sort((a, b) => a.rating - b.rating);
  const count = Math.min(wanted[theme], pool.length);
  if (count === 0) continue;
  const step = pool.length / count;
  const offset = random() * step;
  const seen = new Set<string>();
  for (let i = 0; i < count; i++) {
    const c = pool[Math.min(pool.length - 1, Math.floor(offset + i * step))]!;
    if (seen.has(c.fen)) continue;
    seen.add(c.fen);
    picked.push(c);
  }
}

const out = `/**
 * 자동 생성 파일 — scripts/import-puzzles.ts 가 만든다. 직접 고치지 말 것.
 * 출처: Lichess 퍼즐 데이터베이스 (https://database.lichess.org, CC0 1.0)
 * 정답 수열은 우리 엔진으로 검증했다 (합법성, 메이트 문제는 실제 체크메이트).
 */
import type { Color, PieceType } from '../engine/types';

export type GeneratedTheme = 'mate1' | 'mate2' | 'fork' | 'pin' | 'hanging';

export interface GeneratedPuzzle {
  /** Lichess 퍼즐 ID (https://lichess.org/training/<id>) */
  id: string;
  theme: GeneratedTheme;
  /** 푸는 쪽 */
  side: Color;
  /** 푸는 쪽 차례인 배치 */
  fen: string;
  /** 정답 수열 (UCI): 내 수, 상대 응수, 내 수 … */
  line: string[];
  /** Lichess 난이도 레이팅 */
  rating: number;
  /** 첫 정답 수를 두는 말 — 힌트 문구에 쓴다 */
  piece: PieceType;
}

export const GENERATED_PUZZLES: GeneratedPuzzle[] = ${JSON.stringify(
  picked.map(({ id, theme, side, fen, line, rating, piece }) => ({ id, theme, side, fen, line, rating, piece })),
  null,
  2,
)};
`;

writeFileSync('src/data/puzzles.generated.ts', out);
const summary = THEME_ORDER.map((t) => `${t} ${picked.filter((p) => p.theme === t).length}/${candidates[t].length}`).join(', ');
console.log(`저장 ${picked.length}개 (엔진 검증 탈락 ${rejected}개) → src/data/puzzles.generated.ts`);
console.log(`테마별 선택/후보: ${summary}`);
console.log(`흑 차례 문제: ${picked.filter((p) => p.side === 'b').length}개`);
