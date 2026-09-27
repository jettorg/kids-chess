# Our Chess (Kids Chess)

[한국어](README.md)

A chess game to play with your child. It runs in any web browser with nothing to install and no account.

**Play now: https://jettorg.github.io/kids-chess/**

## Running locally

```bash
npm install
npm run dev          # http://localhost:5173
npm run dev:host     # also reachable from a tablet on the same Wi-Fi
```

Build and verify:

```bash
npm run build      # static files in dist/ (includes the tsc check)
npm test           # rules engine, AI and content tests
npm run typecheck
```

`dist/` is plain static files, so it can be hosted anywhere. `base: './'` in `vite.config.ts` keeps it working under a sub-path.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which tests, builds and publishes to GitHub Pages. If a test fails, nothing is deployed.

## Languages

Korean and English are supported. On first load the language follows the browser setting, and the **한국어 | English** toggle in the top bar switches it at any time. The choice is saved on the device.

UI strings live in `src/i18n/ko.ts` and `src/i18n/en.ts`. Both files must share the same keys to compile, so a missing translation is caught by the type checker. Longer content such as lessons, puzzles and the piece guide is kept in `src/data/` as `{ ko, en }` pairs.

## Four screens

| Screen | What it does |
| --- | --- |
| Play | Two players taking turns, or play against the computer |
| Learn | Practice one piece at a time (the opponent never moves) |
| Puzzles | Six checkmate-in-one problems |
| Pieces | How each piece moves, its value, and the special rules |

## Built for kids

- **The board grows to fit the screen**: no fixed size caps; the board takes whatever space is left. On a portrait iPad it uses nearly the full width. During a game the captured-piece trays are reserved up front so the board never resizes on the first capture.
- **Legal move highlights**: tap a piece and dots show where it can go; capturable pieces get a red ring. A child can play without knowing the rules yet.
- **Wrong moves**: the square gives a gentle shake and a low tone. Nothing that feels like scolding.
- **Check indicator**: the endangered king's square pulses red.
- **Three difficulty levels**: 🐣 Chick (random) → 🐶 Puppy (captures when it can) → 🦊 Fox (3-ply search). A child can beat the Chick.
- **Hints**: a 3-ply search finds a good move and shows it in blue.
- **Undo**: against the computer, one undo rewinds until it is your turn again.
- **Promotion picker**: when a pawn reaches the end, choose with picture buttons.
- **Sound**: short WebAudio effects with no audio files. Can be muted.
- **Big touch targets**: every button is at least 44px, comfortable for fingers on a tablet.
- **Settings fold away during play**: after the first move the opponent and color settings collapse into a one-line summary so the board stays the focus. A Change button reopens them.
- **Tap or drag**: tap-tap and drag-and-drop both work.

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
  ai/ai.ts    move selection per difficulty (alpha-beta search)
  i18n/       string dictionaries (ko.ts, en.ts) and locale selection
  ui/         screens
    board.ts      board rendering and interaction
                  board size comes from the --board budget in style.css
    app.ts        screens, modes, persistence
    pieces.ts     piece artwork (hand-drawn SVG, no external images)
    sound.ts      WebAudio effects
    confetti.ts   win celebration
    ko.ts         Korean particle handling ("폰으로" / "나이트로")
  data/       lessons, puzzles and the piece guide (with per-language text)
tests/        engine, AI and content tests
```

The only dependencies are Vite, TypeScript and Vitest. No chess library, no piece images, no audio files.

## Rules coverage

Normal moves and captures, castling on both sides, en passant, all four pawn promotions, check, checkmate, stalemate, and the three draw rules (fifty-move rule, threefold repetition, insufficient material). The full standard rule set.

Correctness is verified with perft: the starting position to depth 4 (197,281), Kiwipete to depth 3 (97,862), plus en passant and promotion edge-case positions all match the published counts.

## Storage

Settings, language, the game in progress, and lesson/puzzle completion are kept in the browser's localStorage. Nothing is sent to a server.

## Ideas for later

- More lessons (escaping check, castling practice, pawn promotion practice)
- Harder puzzles (mate in two, winning free pieces)
- Move the computer's search into a Web Worker to allow stronger levels
- Export games as PGN
- Offline play (Service Worker)
