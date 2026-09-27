# Known Limitations and How to Address Them

[한국어](limitations.md)

As of 2026-09-27. After the production-readiness pass, these are the limitations that remain, with evidence and a concrete
remedy for each. Priority weighs how likely a child is to hit the problem against the cost of fixing it.

## At a glance

| # | Limitation | Impact | Effort | Priority |
| --- | --- | --- | --- | --- |
| 1 | Dialogs do not trap focus | Keyboard and screen-reader users | Low (half a day) | High |
| 2 | Not verified on a real iPad Safari | The primary device | Low (needs a device) | High |
| 3 | New versions apply silently on the next launch | One session on the old version | Low (half a day) | Medium |
| 4 | The search engine is slow (~30k nodes/s) | Owl reaches depth 4 in the middlegame | High (days) | Medium |
| 5 | Difficulty is a time budget, so strength varies by device | Weaker on slow tablets | Low (half a day) | Medium |
| 6 | Static evaluation is simple (material + square tables) | Odd quiet moves | Medium (1–2 days) | Medium |
| 7 | All puzzles are "White mates in one" | Little variety | Medium (1–2 days) | Medium |
| 8 | Only six lessons, all on piece movement | No lessons on check, castling, etc. | Medium (2–3 days) | Medium |
| 9 | Progress is stored per device only | Tablet and laptop do not share | Medium–High | Low |
| 10 | No motivation system (stars, badges, streaks) | Compared with commercial apps | Medium (2–3 days) | Low |
| 11 | E2E runs on Chromium only | Safari and Firefox regressions | Low (half a day) | Low |
| 12 | Reduced-motion preference is only partly honored | Motion-sensitive users | Low (an hour) | Low |
| 13 | GitHub Pages cannot set response headers | No multithreaded engine | Change host | Low |
| 14 | No error reporting | Field problems go unnoticed | Policy decision | Low |
| 15 | Three empty commits in history | Cosmetic | Low | Low |

## Details

### 1. Dialogs do not trap focus

**Symptom** — When the result banner or the promotion picker opens, keyboard focus does not move into it, and Tab escapes to the
covered page behind. Automated axe checks do not cover focus management, which is why the score is 100 while keyboard users still get stuck.

**Remedy** — In `src/ui/dialogs.ts`, focus the first button on open, cycle Tab and Shift+Tab inside the dialog, and restore the
previous focus on close. Add `role="dialog"`, `aria-modal="true"` and `aria-labelledby` to the container. Add an E2E test:
"when the promotion picker is open, Tab never leaves it".

### 2. Not verified on a real iPad Safari

**Symptom** — All verification ran in Chromium (desktop and emulated mobile viewports). iOS Safari only starts WebAudio inside a user
gesture, applies different storage rules to home-screen apps, and supports `dvh` only from iOS 15.4.

**Remedy** — Run this checklist once on a real device:
- Sound plays on the first tap (if not, call `ctx()` in `sound.ts` from the first pointerdown)
- After Add to Home Screen the app opens full screen and the bottom of the board is not cut off
- The app opens in airplane mode
- Progress survives more than a week of non-use (Safari may evict storage for ordinary sites after 7 days; home-screen apps are exempt)
- The page does not scroll while dragging a piece

For an App Store release, wrapping the same static files with Capacitor requires no code changes.

### 3. New versions apply silently on the next launch

**Symptom** — The service worker downloads a new build and applies it on the next launch. A page that was open during a deploy
keeps the old version, and users cannot tell a new one exists.

**Remedy** — In `src/main.ts`, listen for `registration.addEventListener('updatefound')`; when the new worker reaches `installed`,
show "New version available — reload" in the status line, or reload automatically when no game is in progress. `skipWaiting`
is already enabled, so a reload is enough.

### 4. The search engine is slow

**Symptom** — About 30k nodes per second. The Owl (3.5 s) reaches depth 5 in the opening but only depth 4 in a complex middlegame.
The cause is structural: `src/engine/moves.ts` copies the whole 64-square array for every move and tests legality by applying each move.

**Remedy** (largest gains first)
1. **Make/unmake** — mutate the position and undo from a stack instead of copying; typically 3–5× faster. The engine tests (perft included) are the safety net.
2. **Zobrist hashing** — key the transposition table with a 64-bit hash instead of a FEN string, which is currently built at every node.
3. **Better move ordering** — killer moves and history heuristics buy roughly one extra ply in the same time.
4. **Pseudo-legal generation** — check king safety only when a move is actually made.
5. Together these give about two more plies at the same budget. Beyond that requires a bitboard rewrite, which is overkill for a children's app.

An alternative is to attach Stockfish WASM for the top level only. It is a ~10 MB download, and the multithreaded build is blocked by item 13 on GitHub Pages; even the single-threaded build is far stronger than the current engine.

### 5. Difficulty is a time budget, so strength varies by device

**Symptom** — Bear gets 1.5 s and Owl 3.5 s. A fast laptop searches deeper than a slow tablet, so the same "Owl" plays at different strengths.

**Remedy** — Change `LEVEL_SEARCH` in `src/ai/ai.ts` from time to a node budget. `SearchContext` already counts nodes; replace `checkTime`
with a budget check. Response time then varies by device but strength does not. A middle ground is a one-second benchmark on first
launch that calibrates the node budget.

### 6. Static evaluation is simple

**Symptom** — Only material and piece-square bonuses. In quiet positions with nothing to capture it plays odd moves such as a6.
Thanks to quiescence it punishes mistakes well, but it shows no plan.

**Remedy** — Add mobility (number of legal moves), king safety (pawn shield), pawn structure (isolated and doubled pawn penalties) and
passed-pawn bonuses. Replace the square tables with published values such as PeSTO and interpolate between opening and endgame.
A self-play test in `tests/` that compares win rates with each term toggled prevents regressions. A ten-move opening book fixes opening variety.

### 7. All puzzles are "White mates in one"

**Symptom** — All 156 puzzles share one type, because `scripts/import-puzzles.ts` filters out puzzles where Black moves and anything longer
than one move. They also come from the first 400k rows of the Lichess dump, so the sample is not random.

**Remedy**
- **Black-to-move puzzles** — flip the board so the child's side is at the bottom. Add a `side` field and set `flipped` in `startPuzzle`.
- **Mate in two** — the `Moves` column contains the opponent's reply. After the child's first move, the app plays the reply and checks
  that the second move mates. Where several replies exist, verify with the engine that every reply allows mate (the same approach as
  `isForcedMateInTwo` in `tests/search.test.ts`).
- **Themed sets** — use the Themes column (fork, pin, hangingPiece) for "win a free piece" and "fork" sets.
- **Sampling** — add a `--sample` option that streams the whole file and takes a random sample.
- **Adaptive difficulty** — raise the target rating after consecutive solves and lower it after misses; store it in progress.

### 8. Only six lessons, all on piece movement

**Symptom** — The Learn screen supports a single goal: capture every black piece with one piece type. Escaping check, castling, en passant,
promotion and basic mating patterns exist only as text in the piece guide.

**Remedy** — Extend the lesson format in `src/data/lessons.ts` with goal types: `capture-all` (current), `reach` (get to a square),
`escape-check`, `checkmate`, `castle`. Allow a scripted opponent (`opponentMoves`) so rules that need an opponent move, such as en passant,
can be taught. Branch on the goal type in `checkLessonDone` in `app.ts`. Short step-by-step speech-bubble explanations suit children best.

### 9. Progress is stored per device only

**Symptom** — Settings, progress and solved puzzles live in localStorage. Puzzles solved on the tablet do not appear on the laptop, and
clearing browser data erases them.

**Remedy** (cheapest first)
1. **Export/import** — export progress as a short code or file and paste it on another device. No server, no privacy concerns.
2. **Family-code sync** — store progress in Supabase or Firebase under a "family code". No login needed, but anyone with the code can read it.
3. **Accounts** — a service for children brings child-privacy regulation (parental consent for under-14s in Korea, COPPA elsewhere), so tread carefully.

### 10. No motivation system

**Symptom** — Lessons and puzzles only show a completion mark. Commercial children's apps use stars, badges, streaks and progress bars to keep kids going.

**Remedy** — Award three stars for solving without a hint, two after one hint, one after showing the answer, and add a "My record" screen
next to the piece guide. localStorage is enough. A daily goal such as "three puzzles today" has the largest effect.

### 11. E2E runs on Chromium only

**Symptom** — `playwright.config.ts` defines a Chromium project only. Safari (WebKit) and Firefox differences, especially `dvh`,
service workers and pointer events, are not caught automatically.

**Remedy** — Add a `webkit` project and install it in CI. Since run time doubles, restrict WebKit to layout, PWA and interaction tests with
`grep`. To catch visual regressions, store baseline screenshots of the Play, Learn and Puzzle screens with `toHaveScreenshot`.

### 12. Reduced-motion preference is only partly honored

**Symptom** — The check pulse and the shake respect `prefers-reduced-motion`, but the win confetti and the sliding piece animation do not.

**Remedy** — Skip both when `matchMedia('(prefers-reduced-motion: reduce)').matches`, at the top of `confetti.ts` and in `animateLastMove` in `board.ts`.

### 13. GitHub Pages cannot set response headers

**Symptom** — Without COOP/COEP headers there is no `SharedArrayBuffer`, so a multithreaded Stockfish or shared memory between workers is
impossible. With no server there are no accounts or leaderboards either.

**Remedy** — Move to Cloudflare Pages or Vercel when needed. Both set headers on static files and host private repositories for free.
`base: './'` means the move needs no code changes.

### 14. No error reporting

**Symptom** — Errors in the field go unnoticed. The app deliberately sends no data anywhere.

**Remedy** — For a children's app the default should stay "collect nothing". If it becomes necessary, an opt-in error log with no personal
data (stack trace and app version only) behind a parental consent switch is the right shape. Simpler: an issue link in the README and a help
screen that lets the user copy diagnostics (browser, version, last error).

### 15. Three empty commits in history

**Symptom** — Empty commits (`a7b741e`, `6906b84`, `2b2af97`) created to re-trigger deploys while resolving Pages permissions.

**Remedy** — In a single-maintainer repository, `git rebase -i e75bcab` to drop them followed by `git push --force-with-lease`. This rewrites
published history, so avoid it once others have cloned. Leaving them changes nothing functionally.

## Tools used for verification

- Lighthouse 13 (mobile profile): Performance 100, Accessibility 100, Best Practices 100, SEO 100
- axe-core 4.10: zero violations on all four screens
- 65 Vitest unit tests and 32 Playwright E2E tests, run in CI before every deploy
- Offline: verified by actually stopping the preview server, then loading the page and playing the computer
- Engine throughput: about 30k nodes per second on an Apple Silicon Mac
