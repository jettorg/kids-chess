# Known Limitations and How to Address Them

[한국어](limitations.md)

Of the 15 limitations found in the 2026-09-27 review, 11 were resolved on 2026-09-28.
Below: what was done (with measurements), what remains, and how to address the rest.

## Resolved (2026-09-28)

| # | Limitation | What was done | Verified by |
| --- | --- | --- | --- |
| 1 | Dialogs did not trap focus | `ui/focus.ts`: focus moves inside on open, Tab/Shift+Tab cycle handled directly, restored on close. `role=dialog`, `aria-modal`. Promotion picker cancels with Esc | 3 E2E tests, Chromium and WebKit |
| 3 | New versions applied silently | Service-worker update watcher shows "A new version is ready — Reload now". Checks on visibility and every 30 min | Verified with a real rebuild |
| 4 | Slow search engine | make/unmake, Zobrist hashing, pseudo-legal generation with lazy legality, killer/history ordering | 30k → 130k–220k nodes/s; middlegame depth 5 from 11 s to 1.1 s |
| 5 | Strength varied by device | Levels use node budgets (Bear 200k, Owl 600k); time is only a safety net. Partial results of an unfinished depth are used | Bear and Owl reach different depths and choose different moves |
| 6 | Simple static evaluation | PeSTO tables (opening/endgame blend) + pawn structure (passed, doubled, isolated) + a 3-move opening book | First reply a6 → d5/Nc6 |
| 7 | Only one puzzle type | Solution-line format, automatic opponent replies, Black-to-move (board flipped), five themes, 266 puzzles, adaptive recommendations | Import script verifies every line with the engine |
| 8 | Only piece-movement lessons | Seven goal types (capture, reach, checkmate, escape check, castle, promote, en passant), scripted opponents, 12 lessons | Unit tests + 6 E2E tests |
| 9 | Progress stored per device | ❔ → export/import a `KC1.…` code; merged as a union | E2E with a second browser context |
| 11 | E2E on Chromium only | WebKit project (excluding AI timing and visual tests); 8 visual-regression baselines (local) | Both browsers run in CI |
| 12 | Reduced motion partly honored | Confetti and the sliding piece also respect `prefers-reduced-motion` | E2E |
| 14 | No error reporting | Still collects nothing. ❔ → diagnostics (version, build, browser, service worker, last 5 errors) with copy and a GitHub issue link | E2E |

A bug found along the way: at the root, a cut-off upper bound equal to the best score was treated as a tie, so a move that
did not force mate could be chosen. Root children are now searched with an `alpha-1` window.

## Remaining

| # | Limitation | Impact | Effort |
| --- | --- | --- | --- |
| 2 | Not verified on a real iPad Safari | The primary device | Low (needs a device) |
| 10 | No motivation system (stars, badges, streaks) | Compared with commercial apps | Medium (2–3 days) |
| 13 | GitHub Pages cannot set response headers | No multithreaded engine | Change host |
| 15 | Three empty commits in history | Cosmetic | Low |
| 16 | Visual regression runs locally (macOS) only | CI cannot catch layout changes | Medium |
| 17 | The engine is still a plain JS array engine | Owl reaches depth 5 in complex middlegames | High |

### 2. Not verified on a real iPad Safari

**Symptom** — Everything was verified in Chromium and WebKit (the desktop Safari engine). Real iOS Safari starts WebAudio
only inside a user gesture and applies different storage rules to home-screen apps. WebKit E2E catches engine differences,
but iOS-specific behavior remains unverified.

**Remedy** — Run this checklist once on a real device:
- Sound plays on the first tap (if not, call `ctx()` in `sound.ts` from the first pointerdown)
- After Add to Home Screen the app opens full screen and the bottom of the board is not cut off
- The app opens in airplane mode
- Progress survives more than a week of non-use (home-screen apps are exempt from the 7-day rule)
- The page does not scroll while dragging a piece
- "Copy" in the ❔ dialog works (iOS clipboard permissions are strict)

For an App Store release, wrapping the same static files with Capacitor requires no code changes.

### 10. No motivation system

**Symptom** — Lessons and puzzles only show completion marks and a recommended difficulty. Commercial children's apps use
stars, badges, streaks and progress bars to keep kids going.

**Remedy** — Award three stars for solving without a hint, two after one hint, one after showing the answer, and add a
"My record" screen. Include it in the transfer code. A daily goal such as "three puzzles today" has the largest effect.

### 13. GitHub Pages cannot set response headers

**Symptom** — Without COOP/COEP headers there is no `SharedArrayBuffer`, so a multithreaded Stockfish or shared memory
between workers is impossible. With no server there are no accounts or leaderboards either.

**Remedy** — Move to Cloudflare Pages or Vercel when needed. `base: './'` means the move needs no code changes.

### 15. Three empty commits in history

**Symptom** — Empty commits (`a7b741e`, `6906b84`, `2b2af97`) created to re-trigger deploys while resolving Pages permissions.

**Remedy** — In a single-maintainer repository, `git rebase -i e75bcab` to drop them followed by `git push --force-with-lease`.
This rewrites published history, so avoid it once others have cloned.

### 16. Visual regression runs locally only

**Symptom** — The baselines in `e2e/visual.spec.ts` are for macOS Chromium. Linux CI renders fonts differently, so the same
baselines cannot be used; the tests run only with `VISUAL=1`.

**Remedy** — Either generate Linux baselines once in CI with `--update-snapshots` and commit them, or run the visual tests
locally in the same Docker image CI uses (`mcr.microsoft.com/playwright`). The latter is easier to maintain.

### 17. The engine is still a plain JS array engine

**Symptom** — 130k–220k nodes per second. In complex middlegames the Owl (600k nodes) reaches depth 5. Plenty for children,
not enough to beat adults.

**Remedy** — Next steps: (1) cache king squares to avoid scanning for the king in `isInCheck`, (2) a capture-only generator
for quiescence, (3) repetition detection by Zobrist key. Beyond that it is a bitboard rewrite, or attaching single-threaded
Stockfish WASM to the top level only.

## Tools used for verification

- Lighthouse 13 (mobile): Performance 100, Accessibility 100, Best Practices 100, SEO 100 (live site, 2026-09-27)
- axe-core 4.10: zero violations on all four screens
- 75 Vitest unit tests (perft validates make/unmake; incremental Zobrist hashes checked against full recomputation)
- Playwright E2E: 47 on Chromium + 42 on WebKit, plus 8 visual baselines (local)
- Offline: verified by actually stopping the preview server, then loading the page and playing the computer
- Engine throughput: 130k–220k nodes per second on an Apple Silicon Mac
