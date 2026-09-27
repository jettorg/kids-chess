# Our Chess (Kids Chess)

[한국어](README.md)

A chess game to play with your child. It runs in any web browser with nothing to install and no account.
Once opened, it keeps working without an internet connection.

**Play now: https://jettorg.github.io/kids-chess/**

On a tablet, use **Add to Home Screen** in Safari or Chrome to run it like an app.

## Running locally

```bash
npm install
npm run dev          # http://localhost:5173
npm run dev:host     # also reachable from a tablet on the same Wi-Fi
```

Verification:

```bash
npm test             # engine, search and content unit tests (Vitest)
npm run test:e2e     # build, then real-browser tests (Playwright)
npm run test:all     # both
npm run typecheck
npm run build        # static files in dist/ (service worker included)
```

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`: unit tests → build → browser E2E, and only then
publishes to GitHub Pages. If anything fails, nothing is deployed.

`dist/` is plain static files, so it can be hosted anywhere. `base: './'` in `vite.config.ts` keeps it working under a sub-path.

## Four screens

| Screen | What it does |
| --- | --- |
| Play | Two players taking turns, or play the computer (five levels) |
| Learn | Practice one piece at a time (the opponent never moves) |
| Puzzles | 156 checkmate-in-one problems, easiest first |
| Pieces | How each piece moves, its value, and the special rules |

## Languages

Korean and English are supported. On first load the language follows the browser setting, and the
**한국어 | English** toggle in the top bar switches it at any time. The choice is saved on the device.

UI strings live in `src/i18n/ko.ts` and `src/i18n/en.ts`. Both files must share the same keys to compile,
so a missing translation is caught by the type checker. Longer content such as lessons, puzzles and the
piece guide is kept in `src/data/` as `{ ko, en }` pairs.

## Built for kids

- **The board grows to fit the screen**: no fixed size caps; the board takes whatever space is left. On a portrait iPad it uses nearly the full width. During a game the captured-piece trays are reserved up front so the board never resizes on the first capture.
- **Legal move highlights**: tap a piece and dots show where it can go; capturable pieces get a red ring. A child can play without knowing the rules yet.
- **Wrong moves**: the square gives a gentle shake and a low tone. Nothing that feels like scolding.
- **Check indicator**: the endangered king's square pulses red.
- **Five difficulty levels**: 🐣 Chick (random) → 🐶 Puppy (captures when it can) → 🦊 Fox → 🐻 Bear → 🦉 Owl. A child can beat the Chick; the Owl searches for 3.5 seconds.
- **The screen never freezes**: the search runs in a Web Worker, so the page stays smooth while the computer thinks.
- **Hints**: the search finds a good move and shows it in blue.
- **Undo**: against the computer, one undo rewinds until it is your turn again.
- **Promotion picker**: when a pawn reaches the end, choose with picture buttons.
- **Sound**: short WebAudio effects with no audio files. Can be muted.
- **Keyboard play**: Tab into the board, move with the arrow keys, pick with Enter. Every square has a label like "e4, white pawn, can move here", so screen readers work too.
- **Big touch targets and readable contrast**: every button is at least 44px and text contrast meets WCAG AA.
- **Settings fold away during play**: after the first move the opponent and color settings collapse into a one-line summary so the board stays the focus.
- **Tap or drag**: tap-tap and drag-and-drop both work.

## Adding puzzles

Puzzles are 6 hand-made starters plus 150 imported from the Lichess puzzle database (CC0). Imported puzzles
are verified with our own engine (the solution really is checkmate) and ordered by difficulty.

```bash
curl -s https://database.lichess.org/lichess_db_puzzle.csv.zst | zstd -dc | head -n 400000 > puzzles.csv
npx tsx scripts/import-puzzles.ts puzzles.csv 150 1300     # count, max rating
```

## Structure

```
src/
  engine/     chess rules (fully separated from the UI, no DOM dependency)
    types.ts      piece, square and move types
    position.ts   coordinates, FEN read/write
    moves.ts      move generation, attack detection, applying moves
    status.ts     checkmate, stalemate and draw detection
    san.ts        move notation (Nf3, exd5, O-O, Qh5#)
    game.ts       a single game: history, notation, undo
  ai/
    ai.ts         move selection: alpha-beta + quiescence + iterative deepening + transposition table
    worker.ts     the Web Worker that runs the search
    client.ts     the app-facing client (falls back to the main thread without Worker support)
  i18n/       string dictionaries (ko.ts, en.ts) and locale selection
  ui/
    app.ts        screens, game flow, computer opponent, results
    panels.ts     the side panels (play, learn, puzzles) and the piece guide
    dialogs.ts    result banner and promotion picker
    board.ts      board rendering, pointer and keyboard input, accessibility labels
    storage.ts    settings, progress and saved game (localStorage)
    pieces.ts     piece artwork (hand-drawn SVG, no external images)
    sound.ts      WebAudio effects
    confetti.ts   win celebration
    ko.ts         Korean particle handling ("폰으로" / "나이트로")
  data/       lessons, puzzles (hand-made + imported), piece guide
scripts/
  make-icons.mjs        app icons and the share image
  import-puzzles.ts     Lichess puzzle import
e2e/          Playwright browser tests
tests/        Vitest unit tests
```

The only dependencies are Vite, TypeScript, Vitest, Playwright (tests) and tsx (scripts).
No chess library, no piece images, no audio files.

## Rules coverage

Normal moves and captures, castling on both sides, en passant, all four pawn promotions, check, checkmate,
stalemate, and the three draw rules (fifty-move rule, threefold repetition, insufficient material). The full standard rule set.

Correctness is verified with perft: the starting position to depth 4 (197,281), Kiwipete to depth 3 (97,862),
plus en passant and promotion edge-case positions all match the published counts.

## Offline and storage

A service worker (`sw.js`, generated at build time) precaches the page and its assets, so the app opens
without a connection after the first visit. New releases take effect on the next launch.

Settings, language, the game in progress, and lesson/puzzle completion are kept in the browser's localStorage.
Nothing is sent to a server.

## Credits

- Puzzles: [Lichess puzzle database](https://database.lichess.org) (CC0 1.0)
