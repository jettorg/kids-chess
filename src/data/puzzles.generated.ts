/**
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

export const GENERATED_PUZZLES: GeneratedPuzzle[] = [
  {
    "id": "42fIO",
    "theme": "mate1",
    "side": "b",
    "fen": "5r1k/2q3pp/R3Q3/1pp5/3pP3/1PPP1n2/1P3P2/2B2R1K b - - 1 24",
    "line": [
      "c7h2"
    ],
    "rating": 400,
    "piece": "q"
  },
  {
    "id": "0pxwm",
    "theme": "mate1",
    "side": "b",
    "fen": "8/8/8/7P/3R4/1kr3P1/p7/K7 b - - 1 54",
    "line": [
      "c3c1"
    ],
    "rating": 422,
    "piece": "r"
  },
  {
    "id": "352DO",
    "theme": "mate1",
    "side": "w",
    "fen": "5k2/5ppp/2N5/2b2P2/2b1P3/2r5/6BP/3R3K w - - 0 33",
    "line": [
      "d1d8"
    ],
    "rating": 439,
    "piece": "r"
  },
  {
    "id": "20BS0",
    "theme": "mate1",
    "side": "b",
    "fen": "r4rk1/p1p1qppp/1p6/n2P2N1/6Q1/2N5/PPPP1PPP/R1B3K1 b - - 0 13",
    "line": [
      "e7e1"
    ],
    "rating": 454,
    "piece": "q"
  },
  {
    "id": "36TkE",
    "theme": "mate1",
    "side": "b",
    "fen": "N2k3r/pp2qppp/8/3P4/5PP1/1B2b3/P5P1/R4Q1K b - - 1 22",
    "line": [
      "e7h4"
    ],
    "rating": 470,
    "piece": "q"
  },
  {
    "id": "15v6B",
    "theme": "mate1",
    "side": "w",
    "fen": "r1bq1rk1/4nppp/p3p3/np2P3/2pP4/2PQ1NP1/P1B2P1P/R1B1K2R w KQ - 0 14",
    "line": [
      "d3h7"
    ],
    "rating": 484,
    "piece": "q"
  },
  {
    "id": "0FSGo",
    "theme": "mate1",
    "side": "b",
    "fen": "5r2/6p1/6Rp/3k4/1P1P4/4n1P1/1B5P/6K1 b - - 0 41",
    "line": [
      "f8f1"
    ],
    "rating": 494,
    "piece": "r"
  },
  {
    "id": "0DUcv",
    "theme": "mate1",
    "side": "b",
    "fen": "r3k2r/4npp1/p2q2p1/1p1p4/3Np3/2P5/PP2QPPP/R1B2RK1 b kq - 1 18",
    "line": [
      "d6h2"
    ],
    "rating": 507,
    "piece": "q"
  },
  {
    "id": "0Fwwz",
    "theme": "mate1",
    "side": "w",
    "fen": "r2q1rk1/p1nn2p1/1pp1p2p/3pPp1N/3P1b2/P1N3Q1/1PP2PP1/R3R1K1 w - - 0 18",
    "line": [
      "g3g7"
    ],
    "rating": 519,
    "piece": "q"
  },
  {
    "id": "02gPh",
    "theme": "mate1",
    "side": "b",
    "fen": "4r1k1/pp4pp/2pb1p1B/3p4/3P2Q1/1P5P/P1P2PP1/4N1K1 b - - 0 30",
    "line": [
      "e8e1"
    ],
    "rating": 532,
    "piece": "r"
  },
  {
    "id": "0xdUM",
    "theme": "mate1",
    "side": "b",
    "fen": "8/3B4/1R2PkbK/4r3/8/8/8/8 b - - 0 43",
    "line": [
      "e5h5"
    ],
    "rating": 546,
    "piece": "r"
  },
  {
    "id": "2AFX8",
    "theme": "mate1",
    "side": "b",
    "fen": "8/1p6/p4k2/2PKpp2/1P5r/5PRP/P6P/8 b - - 4 38",
    "line": [
      "h4d4"
    ],
    "rating": 560,
    "piece": "r"
  },
  {
    "id": "3tWGs",
    "theme": "mate1",
    "side": "w",
    "fen": "r4rk1/3nbppp/bq2p3/pp1pP1N1/1n1P1B2/1B1Q3P/PP1N1PP1/R2R2K1 w - - 3 18",
    "line": [
      "d3h7"
    ],
    "rating": 574,
    "piece": "q"
  },
  {
    "id": "3FX8S",
    "theme": "mate1",
    "side": "w",
    "fen": "r4rk1/pbqn1pp1/1p1pp2p/1Pn5/N3P3/2QP4/1BP1BPPP/R1b1N1K1 w - - 0 17",
    "line": [
      "c3g7"
    ],
    "rating": 588,
    "piece": "q"
  },
  {
    "id": "3bHXC",
    "theme": "mate1",
    "side": "b",
    "fen": "r3k2r/ppp2ppp/2nbp1b1/3p1q2/3Pn2N/2P1P1P1/PP1N1PBP/R1BQK2R b KQkq - 4 12",
    "line": [
      "f5f2"
    ],
    "rating": 604,
    "piece": "q"
  },
  {
    "id": "1dcsn",
    "theme": "mate1",
    "side": "w",
    "fen": "r1b2r1k/ppp2ppp/5B2/3qp3/1QnP4/2P2N2/P4PPP/R4RK1 w - - 1 15",
    "line": [
      "b4f8"
    ],
    "rating": 622,
    "piece": "q"
  },
  {
    "id": "1zBbJ",
    "theme": "mate1",
    "side": "b",
    "fen": "6QR/8/5k1K/8/1p6/1P1r4/P7/8 b - - 0 56",
    "line": [
      "d3h3"
    ],
    "rating": 636,
    "piece": "r"
  },
  {
    "id": "1tYeA",
    "theme": "mate1",
    "side": "w",
    "fen": "3r2k1/5ppp/2R5/8/4P3/1qb2P1P/3R2P1/6K1 w - - 0 34",
    "line": [
      "d2d8"
    ],
    "rating": 650,
    "piece": "r"
  },
  {
    "id": "11C70",
    "theme": "mate1",
    "side": "w",
    "fen": "5k2/1p5P/2p1KP2/2P5/8/8/8/q7 w - - 0 54",
    "line": [
      "h7h8q"
    ],
    "rating": 658,
    "piece": "q"
  },
  {
    "id": "34gd6",
    "theme": "mate1",
    "side": "w",
    "fen": "r4rk1/pppqb1p1/2bp3p/5pN1/3Q2nP/1P2P3/PBP1NPP1/2KR3R w - - 1 14",
    "line": [
      "d4g7"
    ],
    "rating": 668,
    "piece": "q"
  },
  {
    "id": "0xq2U",
    "theme": "mate1",
    "side": "b",
    "fen": "6Q1/1kp5/1p1b1N2/p2P4/2p5/Pq5P/1P3PP1/R1B3K1 b - - 0 30",
    "line": [
      "b3d1"
    ],
    "rating": 679,
    "piece": "q"
  },
  {
    "id": "2nMMB",
    "theme": "mate1",
    "side": "b",
    "fen": "6k1/5p2/1p2p2p/p2pB1p1/3PP3/PPq5/6PP/4Q1K1 b - - 0 32",
    "line": [
      "c3e1"
    ],
    "rating": 689,
    "piece": "q"
  },
  {
    "id": "1suBd",
    "theme": "mate1",
    "side": "b",
    "fen": "rn2k1nr/pp3ppp/1q1p4/8/4P1b1/2N1BN2/PPP1KbPP/R2Q1B1R b kq - 3 8",
    "line": [
      "b6e3"
    ],
    "rating": 699,
    "piece": "q"
  },
  {
    "id": "1muuV",
    "theme": "mate1",
    "side": "w",
    "fen": "r2qr1k1/1np2ppn/p2p3p/1p2pN2/4P2P/2PP2Q1/PPB2PP1/R1b1R1K1 w - - 0 18",
    "line": [
      "g3g7"
    ],
    "rating": 709,
    "piece": "q"
  },
  {
    "id": "23iSC",
    "theme": "mate1",
    "side": "w",
    "fen": "r1b2qk1/p2n1rpp/2p1p3/b2pPp1Q/5P2/2PB3R/PP2N1PP/R1B4K w - - 5 18",
    "line": [
      "h5h7"
    ],
    "rating": 719,
    "piece": "q"
  },
  {
    "id": "0noTN",
    "theme": "mate1",
    "side": "b",
    "fen": "r4rk1/ppp2ppp/8/8/5Q2/1P1P1bNq/1PP2P1P/R3R1K1 b - - 0 19",
    "line": [
      "h3g2"
    ],
    "rating": 729,
    "piece": "q"
  },
  {
    "id": "2eFJA",
    "theme": "mate1",
    "side": "b",
    "fen": "3r2k1/p5pp/2B3p1/2P1b3/1P1p1q2/3Q3P/1N3PP1/4RRK1 b - - 4 25",
    "line": [
      "f4h2"
    ],
    "rating": 740,
    "piece": "q"
  },
  {
    "id": "2i5g2",
    "theme": "mate1",
    "side": "w",
    "fen": "8/6pk/1qnpr2p/1p3Np1/1Pp1PP1P/2Q1R1K1/2P5/8 w - - 0 36",
    "line": [
      "c3g7"
    ],
    "rating": 750,
    "piece": "q"
  },
  {
    "id": "2DhU6",
    "theme": "mate1",
    "side": "b",
    "fen": "K7/1P2kp2/2n1p1p1/3pP2p/2nP1P1P/2N2NP1/8/8 b - - 2 51",
    "line": [
      "c4b6"
    ],
    "rating": 760,
    "piece": "n"
  },
  {
    "id": "3wO9o",
    "theme": "mate1",
    "side": "b",
    "fen": "1r2k2r/5ppp/3p2q1/1pp5/4b3/1BN2P2/PP1Q1P1P/R4R1K b k - 2 18",
    "line": [
      "e4f3"
    ],
    "rating": 769,
    "piece": "b"
  },
  {
    "id": "0H12k",
    "theme": "mate1",
    "side": "w",
    "fen": "8/1p3p2/p2R4/1b2kN2/2p1PpP1/4K1P1/1n6/8 w - - 0 49",
    "line": [
      "g3f4"
    ],
    "rating": 779,
    "piece": "p"
  },
  {
    "id": "0bJWf",
    "theme": "mate1",
    "side": "b",
    "fen": "7k/1p3pp1/p3p2p/4P3/2qR1PP1/P7/1P1Q3P/7K b - - 0 32",
    "line": [
      "c4f1"
    ],
    "rating": 788,
    "piece": "q"
  },
  {
    "id": "1yb7P",
    "theme": "mate1",
    "side": "w",
    "fen": "7k/pp3p1p/4bp2/P1Q5/4PP2/5KP1/3q2BP/2r5 w - - 0 35",
    "line": [
      "c5f8"
    ],
    "rating": 796,
    "piece": "q"
  },
  {
    "id": "27Qeo",
    "theme": "mate1",
    "side": "w",
    "fen": "2rk3r/ppp3pp/8/3NQp1q/6n1/3P4/PPP2PP1/R4RK1 w - - 4 18",
    "line": [
      "e5e7"
    ],
    "rating": 803,
    "piece": "q"
  },
  {
    "id": "0lpOo",
    "theme": "mate1",
    "side": "w",
    "fen": "4rk2/6p1/2p4p/p6Q/Pp1bq3/1B4PP/1PP2P2/6K1 w - - 2 33",
    "line": [
      "h5f7"
    ],
    "rating": 811,
    "piece": "q"
  },
  {
    "id": "3KcdZ",
    "theme": "mate1",
    "side": "b",
    "fen": "r1b1k2r/1pqp1pp1/p1n1p3/7p/1PPNP1n1/P1NB3P/3Q1PP1/R1B2RK1 b kq - 0 14",
    "line": [
      "c7h2"
    ],
    "rating": 818,
    "piece": "q"
  },
  {
    "id": "00pHb",
    "theme": "mate1",
    "side": "w",
    "fen": "r6k/4qp1p/p4NrQ/1p2p3/3pP3/1P1P3P/1PP3P1/5RK1 w - - 3 24",
    "line": [
      "h6h7"
    ],
    "rating": 827,
    "piece": "q"
  },
  {
    "id": "0hKtO",
    "theme": "mate1",
    "side": "w",
    "fen": "6rk/pbpB2bp/1p4pN/5p1n/4NP2/2P3Pq/PP3P2/3R2K1 w - - 0 26",
    "line": [
      "h6f7"
    ],
    "rating": 834,
    "piece": "n"
  },
  {
    "id": "1Ty0f",
    "theme": "mate1",
    "side": "b",
    "fen": "2r1k2r/1p1nNpp1/p2p4/Q3pP2/2q1n2p/1N2B2P/PPP3P1/2KR3R b k - 0 17",
    "line": [
      "c4c2"
    ],
    "rating": 841,
    "piece": "q"
  },
  {
    "id": "43YQc",
    "theme": "mate1",
    "side": "w",
    "fen": "6k1/6pb/5p2/3p1P1Q/1Pp1P2P/2q5/r7/2B2RK1 w - - 0 42",
    "line": [
      "h5e8"
    ],
    "rating": 847,
    "piece": "q"
  },
  {
    "id": "2v5Ex",
    "theme": "mate1",
    "side": "b",
    "fen": "4k1r1/5p2/2b1p3/pp1qPn2/3p1PP1/P2B3P/1P2QB1K/4R3 b - - 1 34",
    "line": [
      "d5g2"
    ],
    "rating": 855,
    "piece": "q"
  },
  {
    "id": "3UuiB",
    "theme": "mate1",
    "side": "b",
    "fen": "r1b1k2r/ppqp1ppp/4p3/2b3B1/3NP1n1/1BN5/PP3PPP/2RQ1RK1 b kq - 0 11",
    "line": [
      "c7h2"
    ],
    "rating": 862,
    "piece": "q"
  },
  {
    "id": "2fmar",
    "theme": "mate1",
    "side": "w",
    "fen": "r1bq1rk1/pp1nnpb1/2p1p2Q/3pN3/3P4/2NBP3/PPP2PPP/R3K2R w KQ - 1 12",
    "line": [
      "h6h7"
    ],
    "rating": 870,
    "piece": "q"
  },
  {
    "id": "03WIh",
    "theme": "mate1",
    "side": "w",
    "fen": "5rk1/pp3pp1/2np3p/q2prQNP/8/PPp1P3/2P2PP1/R2K3R w - - 2 19",
    "line": [
      "f5h7"
    ],
    "rating": 878,
    "piece": "q"
  },
  {
    "id": "3pUej",
    "theme": "mate1",
    "side": "w",
    "fen": "rn1q2rk/ppp3pp/3b1n1N/8/3P4/2N5/PP3PPP/R1B2RK1 w - - 0 17",
    "line": [
      "h6f7"
    ],
    "rating": 884,
    "piece": "n"
  },
  {
    "id": "3DIOb",
    "theme": "mate1",
    "side": "b",
    "fen": "1r4r1/p1p1kp2/2B1p3/7p/1PbP3q/2P3P1/P4K2/R3Q2R b - - 0 23",
    "line": [
      "h4g3"
    ],
    "rating": 892,
    "piece": "q"
  },
  {
    "id": "266Qr",
    "theme": "mate1",
    "side": "w",
    "fen": "4r1k1/5pPp/p2p3q/1p1P3Q/1P2p3/2P3P1/1P1b3P/5RK1 w - - 0 29",
    "line": [
      "h5f7"
    ],
    "rating": 900,
    "piece": "q"
  },
  {
    "id": "1wFMv",
    "theme": "mate1",
    "side": "b",
    "fen": "2k5/pp3pp1/2p1p1p1/8/3PQ3/2PN4/PP4qr/2K1R3 b - - 4 23",
    "line": [
      "g2c2"
    ],
    "rating": 906,
    "piece": "q"
  },
  {
    "id": "2Tm5J",
    "theme": "mate1",
    "side": "b",
    "fen": "1k5r/ppq3pp/2p2p2/2N4r/3P4/1R3P2/PP2QPK1/5R2 b - - 4 24",
    "line": [
      "c7h2"
    ],
    "rating": 912,
    "piece": "q"
  },
  {
    "id": "14v8P",
    "theme": "mate1",
    "side": "b",
    "fen": "8/2k2p2/4p3/p2pP1p1/P1pP2PP/2P2pK1/2RQ1P2/7q b - - 2 41",
    "line": [
      "h1g2"
    ],
    "rating": 919,
    "piece": "q"
  },
  {
    "id": "3jSpC",
    "theme": "mate1",
    "side": "w",
    "fen": "r1bqkbnr/pp1p3p/2nPp3/2p1P1p1/5B2/8/PPP2PPP/RN1QKB1R w KQkq - 0 9",
    "line": [
      "d1h5"
    ],
    "rating": 925,
    "piece": "q"
  },
  {
    "id": "3Q9Ag",
    "theme": "mate1",
    "side": "b",
    "fen": "5rk1/p1Q1b3/3p3p/P2Pp2q/4Prp1/2PR1N1P/B2N3K/6R1 b - - 1 27",
    "line": [
      "h5h3"
    ],
    "rating": 932,
    "piece": "q"
  },
  {
    "id": "1Vgvh",
    "theme": "mate1",
    "side": "w",
    "fen": "5rk1/1p3pp1/2p1b2p/p5q1/1nP1Q3/6NP/PP3PP1/1B1rR1K1 w - - 0 27",
    "line": [
      "e4h7"
    ],
    "rating": 939,
    "piece": "q"
  },
  {
    "id": "24YvH",
    "theme": "mate1",
    "side": "w",
    "fen": "r2qkb1r/pp1nnpp1/4p2p/1N1pP2P/2pP2P1/2PB1Q2/PP3P2/R1B1K2R w KQkq - 0 14",
    "line": [
      "b5d6"
    ],
    "rating": 945,
    "piece": "n"
  },
  {
    "id": "0yJQV",
    "theme": "mate1",
    "side": "b",
    "fen": "5rk1/5ppp/R5q1/1p2Q3/4P3/2P2P2/5r1P/R6K b - - 0 26",
    "line": [
      "g6g2"
    ],
    "rating": 952,
    "piece": "q"
  },
  {
    "id": "0f9JL",
    "theme": "mate1",
    "side": "w",
    "fen": "k5r1/pR6/3b1p1p/1p5r/8/R6P/P4PP1/6K1 w - - 0 35",
    "line": [
      "a3a7"
    ],
    "rating": 959,
    "piece": "r"
  },
  {
    "id": "0b3JR",
    "theme": "mate1",
    "side": "w",
    "fen": "r1b1kb1r/pppp1ppp/2N5/4P3/2B4q/8/PPP3PP/RNBn1RK1 w kq - 0 9",
    "line": [
      "c4f7"
    ],
    "rating": 965,
    "piece": "b"
  },
  {
    "id": "38jjh",
    "theme": "mate1",
    "side": "w",
    "fen": "5r2/p1q4k/6R1/1bp5/4r3/1P1P4/2P1QPK1/8 w - - 0 32",
    "line": [
      "e2h5"
    ],
    "rating": 970,
    "piece": "q"
  },
  {
    "id": "3j1QK",
    "theme": "mate1",
    "side": "w",
    "fen": "6rk/2p4p/1p6/pP1n4/P2q1PrQ/4p2P/6PK/1B2R3 w - - 0 38",
    "line": [
      "h4h7"
    ],
    "rating": 976,
    "piece": "q"
  },
  {
    "id": "0kFl6",
    "theme": "mate1",
    "side": "b",
    "fen": "rn1qkbnr/pp3ppp/2p5/7P/8/1P2Pp1P/PBPP4/RN1QKB1R b KQkq - 0 9",
    "line": [
      "d8h4"
    ],
    "rating": 983,
    "piece": "q"
  },
  {
    "id": "2fLsM",
    "theme": "mate1",
    "side": "w",
    "fen": "5r2/p4pk1/1p2r2p/4nQ2/3p4/3Bb3/PP4PP/5R1K w - - 17 34",
    "line": [
      "f5h7"
    ],
    "rating": 989,
    "piece": "q"
  },
  {
    "id": "298aQ",
    "theme": "mate1",
    "side": "w",
    "fen": "r1bq4/pp2n1pk/2n1Nr2/b2p4/3P1PQ1/2P5/P5PP/RNB1K2R w KQ - 1 15",
    "line": [
      "g4g7"
    ],
    "rating": 996,
    "piece": "q"
  },
  {
    "id": "1BndQ",
    "theme": "mate1",
    "side": "w",
    "fen": "2kr2nr/p2pq2p/1pp2p2/2b3p1/4PB2/1B1Q4/PPP2PPP/R4RK1 w - g6 0 14",
    "line": [
      "d3a6"
    ],
    "rating": 1005,
    "piece": "q"
  },
  {
    "id": "3OspO",
    "theme": "mate1",
    "side": "b",
    "fen": "r1b2rk1/ppppqppp/2n5/2bNnP2/2P1PB2/P5P1/1P2N2P/R2QKB1R b KQ - 2 12",
    "line": [
      "e5f3"
    ],
    "rating": 1017,
    "piece": "n"
  },
  {
    "id": "3aLW9",
    "theme": "mate1",
    "side": "w",
    "fen": "r3n1k1/pp5p/1qn3rB/3p2Q1/3P4/2P5/PP5P/R4RK1 w - - 3 24",
    "line": [
      "f1f8"
    ],
    "rating": 1028,
    "piece": "r"
  },
  {
    "id": "3bnvA",
    "theme": "mate1",
    "side": "b",
    "fen": "1R1q1rk1/6p1/1Q1p2bp/3Np3/2P5/3P1PKP/4r3/1R6 b - - 1 33",
    "line": [
      "d8g5"
    ],
    "rating": 1040,
    "piece": "q"
  },
  {
    "id": "2eZTC",
    "theme": "mate1",
    "side": "w",
    "fen": "r3r1k1/p4pPp/1b6/8/1P2P3/P4Q2/2q3PP/R1q2R1K w - - 0 25",
    "line": [
      "f3f7"
    ],
    "rating": 1050,
    "piece": "q"
  },
  {
    "id": "02chE",
    "theme": "mate1",
    "side": "b",
    "fen": "r4rk1/1p4p1/2pp3p/p1bPp3/2P1Pp2/2N4K/PP2Bq2/R4Q1R b - - 1 26",
    "line": [
      "f2g3"
    ],
    "rating": 1063,
    "piece": "q"
  },
  {
    "id": "12fqc",
    "theme": "mate1",
    "side": "w",
    "fen": "r1b2r1k/pp2bpp1/2qp4/4p1Nn/2B5/7P/PPQ2PP1/R1B2RK1 w - - 5 18",
    "line": [
      "c2h7"
    ],
    "rating": 1073,
    "piece": "q"
  },
  {
    "id": "1GdaA",
    "theme": "mate1",
    "side": "w",
    "fen": "8/8/2Q4p/4P1bk/1p1P2p1/4P1q1/6N1/6K1 w - - 6 43",
    "line": [
      "c6e8"
    ],
    "rating": 1082,
    "piece": "q"
  },
  {
    "id": "12848",
    "theme": "mate1",
    "side": "w",
    "fen": "rn2kbnr/p1p1pp1p/1p6/8/6Q1/2N3P1/PP1PPPqP/R1B1K2R w KQkq - 0 11",
    "line": [
      "g4c8"
    ],
    "rating": 1094,
    "piece": "q"
  },
  {
    "id": "1n1Im",
    "theme": "mate1",
    "side": "w",
    "fen": "4qk2/p3r2p/4P1p1/4Qp2/4pP2/3p4/P5PP/3R1K2 w - - 5 35",
    "line": [
      "e5h8"
    ],
    "rating": 1104,
    "piece": "q"
  },
  {
    "id": "1Ynhd",
    "theme": "mate1",
    "side": "w",
    "fen": "r7/p3Q3/1p4p1/5r2/1P5R/5k2/P4q1P/7K w - - 8 37",
    "line": [
      "e7e4"
    ],
    "rating": 1113,
    "piece": "q"
  },
  {
    "id": "0Anr4",
    "theme": "mate1",
    "side": "b",
    "fen": "r2k1b2/ppp3p1/2npP2r/3N3B/3PP2q/6p1/PPP3P1/R2Q1RK1 b - - 3 16",
    "line": [
      "h4h2"
    ],
    "rating": 1122,
    "piece": "q"
  },
  {
    "id": "1O6uU",
    "theme": "mate1",
    "side": "w",
    "fen": "rn2kb1r/pQp1pppp/2q2n2/6N1/4p3/2N5/PPPP1PPP/R1B1K2R w KQkq - 1 9",
    "line": [
      "b7c8"
    ],
    "rating": 1130,
    "piece": "q"
  },
  {
    "id": "3wQRE",
    "theme": "mate1",
    "side": "b",
    "fen": "r3kb1r/ppq2pp1/2n1pnp1/1B1p4/3P4/P1N1P3/1P1B1PPP/R2Q1RK1 b kq - 4 12",
    "line": [
      "c7h2"
    ],
    "rating": 1138,
    "piece": "q"
  },
  {
    "id": "3TLNc",
    "theme": "mate1",
    "side": "w",
    "fen": "8/8/8/p4R2/1p6/k7/P5r1/1K6 w - - 12 61",
    "line": [
      "f5a5"
    ],
    "rating": 1146,
    "piece": "r"
  },
  {
    "id": "3A06n",
    "theme": "mate1",
    "side": "b",
    "fen": "7Q/8/p2p4/4p2b/8/4BqR1/PPP2P1k/2KR4 b - - 2 31",
    "line": [
      "f3d1"
    ],
    "rating": 1154,
    "piece": "q"
  },
  {
    "id": "2rho6",
    "theme": "mate1",
    "side": "b",
    "fen": "3r1rk1/6p1/2p2q2/1p6/pP2R1Q1/P6P/2P5/2K3R1 b - - 1 41",
    "line": [
      "f6a1"
    ],
    "rating": 1162,
    "piece": "q"
  },
  {
    "id": "2bozQ",
    "theme": "mate1",
    "side": "b",
    "fen": "6k1/Q7/6r1/8/4P2K/1P1P4/1PP3P1/5r2 b - - 2 35",
    "line": [
      "f1h1"
    ],
    "rating": 1170,
    "piece": "r"
  },
  {
    "id": "14up9",
    "theme": "mate1",
    "side": "w",
    "fen": "3rk3/p6R/5pN1/P1n1p3/8/2P1P3/2K5/8 w - - 1 40",
    "line": [
      "h7e7"
    ],
    "rating": 1179,
    "piece": "r"
  },
  {
    "id": "1N0QS",
    "theme": "mate1",
    "side": "b",
    "fen": "2rqk2r/p4ppp/2P2p2/1p6/1bp5/4PQ2/1P2KPPP/R1B2B1R b k - 2 15",
    "line": [
      "d8d3"
    ],
    "rating": 1190,
    "piece": "q"
  },
  {
    "id": "3mzwC",
    "theme": "mate1",
    "side": "w",
    "fen": "5rk1/3Q4/1p3Ppp/1P6/2P3R1/6P1/5PKP/1q2r3 w - - 2 52",
    "line": [
      "d7g7"
    ],
    "rating": 1201,
    "piece": "q"
  },
  {
    "id": "133g2",
    "theme": "mate1",
    "side": "w",
    "fen": "r2qbb1r/ppp3pp/3p1k2/4pP1Q/4P3/2N5/PPP3PP/R3KB1R w KQ - 2 12",
    "line": [
      "c3d5"
    ],
    "rating": 1221,
    "piece": "n"
  },
  {
    "id": "3JPhS",
    "theme": "mate1",
    "side": "b",
    "fen": "5k2/ppp2p2/3q4/8/2B3Q1/7K/PP3RP1/3r4 b - - 7 34",
    "line": [
      "d1h1"
    ],
    "rating": 1238,
    "piece": "r"
  },
  {
    "id": "2a8Yj",
    "theme": "mate1",
    "side": "b",
    "fen": "r1b1Q1rk/p1p5/7p/1p3pqQ/4p3/2P4P/PP4P1/3R1RK1 b - - 0 24",
    "line": [
      "g5g2"
    ],
    "rating": 1254,
    "piece": "q"
  },
  {
    "id": "00O9q",
    "theme": "mate1",
    "side": "w",
    "fen": "5r2/5p2/4nP1k/4N1p1/8/6P1/6K1/R7 w - - 2 79",
    "line": [
      "a1h1"
    ],
    "rating": 1272,
    "piece": "r"
  },
  {
    "id": "1w21I",
    "theme": "mate1",
    "side": "w",
    "fen": "r3rN1k/pbpq2pn/1p1bB2p/n7/3P4/2P5/PP3PPP/R1B1R1K1 w - - 0 19",
    "line": [
      "f8g6"
    ],
    "rating": 1290,
    "piece": "n"
  },
  {
    "id": "16I1V",
    "theme": "mate1",
    "side": "w",
    "fen": "r1bq3r/ppp2B1p/3b1n1k/4Q1p1/3PP3/8/PPP3PP/RNB3K1 w - - 0 14",
    "line": [
      "e5g5"
    ],
    "rating": 1308,
    "piece": "q"
  },
  {
    "id": "3pm6P",
    "theme": "mate1",
    "side": "w",
    "fen": "3Q4/1q4kp/6p1/2p5/8/8/6PP/1q3RK1 w - - 1 39",
    "line": [
      "d8f8"
    ],
    "rating": 1327,
    "piece": "q"
  },
  {
    "id": "07AfM",
    "theme": "mate1",
    "side": "b",
    "fen": "R7/8/2p2kp1/4n3/P1P1PK2/r6P/3N2P1/8 b - - 8 39",
    "line": [
      "g6g5"
    ],
    "rating": 1347,
    "piece": "p"
  },
  {
    "id": "2y84c",
    "theme": "mate1",
    "side": "w",
    "fen": "r1bq1b1r/pppn1kpp/8/1n1Pp3/6Q1/2PP4/PP3PPP/RNB1K2R w KQ - 0 11",
    "line": [
      "g4e6"
    ],
    "rating": 1368,
    "piece": "q"
  },
  {
    "id": "3qObZ",
    "theme": "mate1",
    "side": "b",
    "fen": "5rk1/5p1p/R5p1/3Qb3/8/1BP2PqP/1P4P1/6K1 b - - 2 28",
    "line": [
      "g3e1"
    ],
    "rating": 1391,
    "piece": "q"
  },
  {
    "id": "3kinB",
    "theme": "mate1",
    "side": "b",
    "fen": "2r1r1k1/pb3pbp/3N2p1/8/4qP2/Q7/PP2BPPP/3R1RK1 b - - 2 23",
    "line": [
      "e4g2"
    ],
    "rating": 1415,
    "piece": "q"
  },
  {
    "id": "055Yq",
    "theme": "mate1",
    "side": "b",
    "fen": "5k2/p4P2/1p6/2pR4/B1P3rp/8/PP1prRPb/5K2 b - - 1 40",
    "line": [
      "e2e1"
    ],
    "rating": 1439,
    "piece": "r"
  },
  {
    "id": "0wh8S",
    "theme": "mate1",
    "side": "b",
    "fen": "r5k1/ppp2ppp/8/1B1P1qB1/1n6/1NN5/PP4PP/2K1Q3 b - - 0 21",
    "line": [
      "f5c2"
    ],
    "rating": 1464,
    "piece": "q"
  },
  {
    "id": "2q0AL",
    "theme": "mate1",
    "side": "b",
    "fen": "r1b1kb1r/pppp1pp1/8/3P3p/5P1q/2N4P/PPPKBnP1/R1B1Q2R b kq - 4 13",
    "line": [
      "h4f4"
    ],
    "rating": 1486,
    "piece": "q"
  },
  {
    "id": "1lYt5",
    "theme": "mate1",
    "side": "w",
    "fen": "4Q3/8/3p1p2/3P1k2/2p1q1p1/6P1/5P2/6K1 w - - 2 50",
    "line": [
      "e8h5"
    ],
    "rating": 1511,
    "piece": "q"
  },
  {
    "id": "2fnG4",
    "theme": "mate1",
    "side": "w",
    "fen": "5rk1/6p1/p3p1np/1p1pQ3/7n/1P6/PBP2qPP/4RB1K w - - 2 33",
    "line": [
      "e5g7"
    ],
    "rating": 1552,
    "piece": "q"
  },
  {
    "id": "1V0jj",
    "theme": "mate1",
    "side": "w",
    "fen": "r1b3k1/1ppqr3/3p2pQ/3P3p/p1P1P2p/P2B3P/1P4PK/5R2 w - - 0 27",
    "line": [
      "f1f8"
    ],
    "rating": 1595,
    "piece": "r"
  },
  {
    "id": "43oxn",
    "theme": "mate2",
    "side": "w",
    "fen": "6k1/1p3ppb/p1p4p/5P2/1P3KP1/7P/1PB1r3/3R4 w - - 2 31",
    "line": [
      "d1d8",
      "e2e8",
      "d8e8"
    ],
    "rating": 400,
    "piece": "r"
  },
  {
    "id": "3FGa4",
    "theme": "mate2",
    "side": "b",
    "fen": "6k1/p7/1p2pq1p/3pN1p1/3P4/2P5/PPB4Q/1K3R2 b - - 0 54",
    "line": [
      "f6f1",
      "c2d1",
      "f1d1"
    ],
    "rating": 458,
    "piece": "q"
  },
  {
    "id": "3C58t",
    "theme": "mate2",
    "side": "b",
    "fen": "3r2k1/4bpp1/p3p2p/4P3/1p2QB2/2P5/1P3PPP/N5K1 b - - 0 26",
    "line": [
      "d8d1",
      "e4e1",
      "d1e1"
    ],
    "rating": 505,
    "piece": "r"
  },
  {
    "id": "0ezOU",
    "theme": "mate2",
    "side": "w",
    "fen": "2r3k1/p4ppb/5q1p/2p1Q3/6P1/1P4BP/P3R2K/8 w - - 0 37",
    "line": [
      "e5e8",
      "c8e8",
      "e2e8"
    ],
    "rating": 552,
    "piece": "q"
  },
  {
    "id": "3eAv8",
    "theme": "mate2",
    "side": "b",
    "fen": "1k1r4/pbp4p/1p4p1/4ppN1/1P6/P1P1P3/3r1PPP/1R1R2K1 b - - 0 24",
    "line": [
      "d2d1",
      "b1d1",
      "d8d1"
    ],
    "rating": 607,
    "piece": "r"
  },
  {
    "id": "3pfMF",
    "theme": "mate2",
    "side": "b",
    "fen": "1k2r3/pp6/2p1qp2/8/3P2P1/2P2Q1p/P4P1P/1R4K1 b - - 0 33",
    "line": [
      "e6e1",
      "b1e1",
      "e8e1"
    ],
    "rating": 664,
    "piece": "q"
  },
  {
    "id": "0Cujp",
    "theme": "mate2",
    "side": "w",
    "fen": "2k5/pppr1ppp/6b1/6B1/1bPp4/8/PP2RPPP/6K1 w - - 2 20",
    "line": [
      "e2e8",
      "d7d8",
      "e8d8"
    ],
    "rating": 704,
    "piece": "r"
  },
  {
    "id": "3HnG1",
    "theme": "mate2",
    "side": "w",
    "fen": "6k1/6r1/2p3Np/3n3P/1P2r3/5RP1/5PK1/8 w - - 0 38",
    "line": [
      "f3f8",
      "g8h7",
      "f8h8"
    ],
    "rating": 740,
    "piece": "r"
  },
  {
    "id": "2vsSb",
    "theme": "mate2",
    "side": "b",
    "fen": "8/1kp5/p2r4/3P1Q2/r7/6PK/6B1/8 b - - 5 53",
    "line": [
      "d6h6",
      "f5h5",
      "h6h5"
    ],
    "rating": 779,
    "piece": "r"
  },
  {
    "id": "3ci1S",
    "theme": "mate2",
    "side": "b",
    "fen": "5r2/p1R3pk/7p/4B3/5n2/8/PP4PP/6K1 b - - 1 26",
    "line": [
      "f4e2",
      "g1h1",
      "f8f1"
    ],
    "rating": 807,
    "piece": "n"
  },
  {
    "id": "1P7pY",
    "theme": "mate2",
    "side": "b",
    "fen": "4k3/4b2Q/4p1p1/p7/8/1P1b4/P7/K3R3 b - - 7 46",
    "line": [
      "e7f6",
      "e1e5",
      "f6e5"
    ],
    "rating": 829,
    "piece": "b"
  },
  {
    "id": "28eOV",
    "theme": "mate2",
    "side": "b",
    "fen": "3q1k1r/pp2Rppp/8/2p5/Q7/8/PPP2PPP/R1B3K1 b - - 0 18",
    "line": [
      "d8d1",
      "e7e1",
      "d1e1"
    ],
    "rating": 850,
    "piece": "q"
  },
  {
    "id": "1oJzE",
    "theme": "mate2",
    "side": "b",
    "fen": "5rk1/pp1q1r2/2n3Np/2p3p1/2PpB3/1P1P2Pb/P2Q3P/4RRK1 b - - 3 24",
    "line": [
      "f7f1",
      "e1f1",
      "f8f1"
    ],
    "rating": 870,
    "piece": "r"
  },
  {
    "id": "3logj",
    "theme": "mate2",
    "side": "w",
    "fen": "1r3r1k/1p4pp/2b5/p3b3/8/P1Nq4/1PB2RPP/5RK1 w - - 0 25",
    "line": [
      "f2f8",
      "b8f8",
      "f1f8"
    ],
    "rating": 886,
    "piece": "r"
  },
  {
    "id": "3xmzA",
    "theme": "mate2",
    "side": "w",
    "fen": "7r/6R1/1kp5/6p1/2PP1pb1/2P1p2P/7K/5B2 w - - 0 38",
    "line": [
      "c4c5",
      "b6a5",
      "g7a7"
    ],
    "rating": 902,
    "piece": "p"
  },
  {
    "id": "3gLbJ",
    "theme": "mate2",
    "side": "w",
    "fen": "r1b5/1p2q1kB/3p4/p2p3Q/5P1N/7P/PP1n2P1/6K1 w - - 0 29",
    "line": [
      "h5g6",
      "g7h8",
      "g6g8"
    ],
    "rating": 915,
    "piece": "q"
  },
  {
    "id": "0mj7L",
    "theme": "mate2",
    "side": "w",
    "fen": "4r1k1/pb2rRp1/1p1q3p/8/8/2P5/P4QPP/1B3RK1 w - - 1 33",
    "line": [
      "f7f8",
      "e8f8",
      "f2f8"
    ],
    "rating": 929,
    "piece": "r"
  },
  {
    "id": "1GRlR",
    "theme": "mate2",
    "side": "w",
    "fen": "2kr2nr/pp1npq2/2p3p1/2P2p1p/3b1B1P/3B1QN1/PP3PP1/R4RK1 w - - 0 17",
    "line": [
      "f3c6",
      "b7c6",
      "d3a6"
    ],
    "rating": 942,
    "piece": "q"
  },
  {
    "id": "0Zkqq",
    "theme": "mate2",
    "side": "b",
    "fen": "1Q6/8/7p/8/8/P6P/6P1/3q1k1K b - - 0 60",
    "line": [
      "f1f2",
      "h1h2",
      "d1g1"
    ],
    "rating": 954,
    "piece": "k"
  },
  {
    "id": "1cdFq",
    "theme": "mate2",
    "side": "w",
    "fen": "2k5/1p1R2pp/p1p5/P1P5/1q6/2r1P3/5PPP/3RK3 w - - 2 34",
    "line": [
      "d7d8",
      "c8c7",
      "d1d7"
    ],
    "rating": 964,
    "piece": "r"
  },
  {
    "id": "25god",
    "theme": "mate2",
    "side": "w",
    "fen": "6k1/5ppp/4p1q1/8/3P1P1n/2P2Q1R/1r4PP/5K2 w - - 2 37",
    "line": [
      "f3a8",
      "b2b8",
      "a8b8"
    ],
    "rating": 973,
    "piece": "q"
  },
  {
    "id": "071tn",
    "theme": "mate2",
    "side": "b",
    "fen": "2k5/1bp5/1pnpp2q/pB4b1/P1NPP3/2P2Rp1/1P2Q1P1/3R2K1 b - - 2 28",
    "line": [
      "h6h2",
      "g1f1",
      "h2h1"
    ],
    "rating": 983,
    "piece": "q"
  },
  {
    "id": "2qHjU",
    "theme": "mate2",
    "side": "w",
    "fen": "4rk1r/pp3p1p/6p1/q2P1b2/8/P1P3P1/4QPBP/R1B3K1 w - - 0 22",
    "line": [
      "c1h6",
      "f8g8",
      "e2e8"
    ],
    "rating": 991,
    "piece": "b"
  },
  {
    "id": "3X6qa",
    "theme": "mate2",
    "side": "w",
    "fen": "6k1/p1p1q1p1/1p1p2P1/3Pp2Q/2P5/1P5P/P5K1/5r2 w - - 0 30",
    "line": [
      "h5h7",
      "g8f8",
      "h7h8"
    ],
    "rating": 1004,
    "piece": "q"
  },
  {
    "id": "16YP9",
    "theme": "mate2",
    "side": "b",
    "fen": "rnb1kb1r/p4ppp/1p3q2/1Pp1N3/Q2Pn3/6N1/PB1P1PPP/R3KB1R b KQkq - 3 12",
    "line": [
      "f6f2",
      "e1d1",
      "f2d2"
    ],
    "rating": 1022,
    "piece": "q"
  },
  {
    "id": "35Z59",
    "theme": "mate2",
    "side": "b",
    "fen": "5r1k/ppp3p1/8/5q2/3Q4/5pP1/PPP2P2/R6K b - - 0 34",
    "line": [
      "f5h3",
      "h1g1",
      "h3g2"
    ],
    "rating": 1038,
    "piece": "q"
  },
  {
    "id": "28Gl4",
    "theme": "mate2",
    "side": "w",
    "fen": "7k/p3R3/1p2N1pK/7p/8/6r1/5r2/8 w - - 0 43",
    "line": [
      "e7e8",
      "f2f8",
      "e8f8"
    ],
    "rating": 1055,
    "piece": "r"
  },
  {
    "id": "25MJ9",
    "theme": "mate2",
    "side": "b",
    "fen": "r3k3/p4p1p/2p1p3/2pp3Q/P4q2/1PN5/2PP1PrP/R3K2R b KQq - 1 15",
    "line": [
      "f4f2",
      "e1d1",
      "f2d2"
    ],
    "rating": 1070,
    "piece": "q"
  },
  {
    "id": "0zZsK",
    "theme": "mate2",
    "side": "b",
    "fen": "5Q2/7p/1p3pq1/p6k/7n/2P3P1/PP5P/3R3K b - - 0 31",
    "line": [
      "g6e4",
      "h1g1",
      "e4g2"
    ],
    "rating": 1084,
    "piece": "q"
  },
  {
    "id": "2TCTm",
    "theme": "mate2",
    "side": "b",
    "fen": "k1NQ4/p5p1/8/3p4/8/7p/P6P/3qRK2 b - - 3 45",
    "line": [
      "d1f3",
      "f1g1",
      "f3g2"
    ],
    "rating": 1097,
    "piece": "q"
  },
  {
    "id": "3wB8T",
    "theme": "mate2",
    "side": "w",
    "fen": "7r/p5k1/1rn1p3/q1p3NB/4NP2/1p1P2P1/PPP5/1K5R w - - 0 30",
    "line": [
      "g5e6",
      "g7g8",
      "e4f6"
    ],
    "rating": 1109,
    "piece": "n"
  },
  {
    "id": "0DSi5",
    "theme": "mate2",
    "side": "w",
    "fen": "2R5/pp3ppk/7p/4p1PP/3bP2N/P4P2/KPP2q2/7r w - - 0 31",
    "line": [
      "g5g6",
      "f7g6",
      "h5g6"
    ],
    "rating": 1121,
    "piece": "p"
  },
  {
    "id": "2p3yV",
    "theme": "mate2",
    "side": "w",
    "fen": "r3k3/ppp1bp2/2n2Qrp/8/1qP3B1/3P4/P4PPP/R3R1K1 w q - 1 20",
    "line": [
      "f6h8",
      "g6g8",
      "h8g8"
    ],
    "rating": 1130,
    "piece": "q"
  },
  {
    "id": "2Seu9",
    "theme": "mate2",
    "side": "w",
    "fen": "1k1r4/1b5R/4pp1P/8/3P1P2/2Q2P1K/q7/3q4 w - - 6 47",
    "line": [
      "c3c7",
      "b8a7",
      "c7b7"
    ],
    "rating": 1140,
    "piece": "q"
  },
  {
    "id": "31Prd",
    "theme": "mate2",
    "side": "b",
    "fen": "3r4/8/R7/5N2/4PpkP/8/5P1P/6K1 b - - 0 32",
    "line": [
      "d8d1",
      "g1g2",
      "f4f3"
    ],
    "rating": 1149,
    "piece": "r"
  },
  {
    "id": "3QJmo",
    "theme": "mate2",
    "side": "w",
    "fen": "8/p5Qp/1b1kBr2/2p2P2/8/P6P/3p2P1/2q2RK1 w - - 8 39",
    "line": [
      "g7d7",
      "d6e5",
      "d7d5"
    ],
    "rating": 1158,
    "piece": "q"
  },
  {
    "id": "2h9SJ",
    "theme": "mate2",
    "side": "b",
    "fen": "1r5r/p6p/2Q1R1pk/3p4/3P2P1/K1P1R3/P4q1P/8 b - - 3 29",
    "line": [
      "f2b2",
      "a3a4",
      "b2a2"
    ],
    "rating": 1167,
    "piece": "q"
  },
  {
    "id": "1rC5O",
    "theme": "mate2",
    "side": "w",
    "fen": "4r1k1/pR4pp/8/1p1p4/3P4/P4QP1/6KP/4q3 w - - 0 30",
    "line": [
      "f3f7",
      "g8h8",
      "f7g7"
    ],
    "rating": 1176,
    "piece": "q"
  },
  {
    "id": "2T9FD",
    "theme": "mate2",
    "side": "w",
    "fen": "7r/5pb1/p2Rp1p1/kp6/6P1/N1P5/PP5P/6K1 w - - 1 30",
    "line": [
      "b2b4",
      "a5a4",
      "d6a6"
    ],
    "rating": 1185,
    "piece": "p"
  },
  {
    "id": "0zLtO",
    "theme": "mate2",
    "side": "b",
    "fen": "Q7/6pk/2p1p3/2PpP2p/3Pp3/4q1rP/1B4P1/4Q1RK b - - 2 34",
    "line": [
      "g3h3",
      "g2h3",
      "e3h3"
    ],
    "rating": 1195,
    "piece": "r"
  },
  {
    "id": "2bcLu",
    "theme": "mate2",
    "side": "w",
    "fen": "4rk2/p2r4/1p4Qp/2pP4/1b2P3/4R1P1/q4PKP/8 w - - 1 30",
    "line": [
      "e3f3",
      "d7f7",
      "g6f7"
    ],
    "rating": 1209,
    "piece": "r"
  },
  {
    "id": "2X20i",
    "theme": "mate2",
    "side": "b",
    "fen": "8/p6k/5p1p/1b3Nb1/1P2P1P1/1B3P2/P1r1n1K1/3R3R b - - 3 36",
    "line": [
      "e2f4",
      "g2g3",
      "c2g2"
    ],
    "rating": 1229,
    "piece": "n"
  },
  {
    "id": "2AZYV",
    "theme": "mate2",
    "side": "b",
    "fen": "6k1/8/pp2p1pb/2q1p3/P3B2r/2P2P2/1PQ3P1/3R1K2 b - - 9 35",
    "line": [
      "h4h1",
      "f1e2",
      "c5e3"
    ],
    "rating": 1248,
    "piece": "r"
  },
  {
    "id": "31Xo4",
    "theme": "mate2",
    "side": "b",
    "fen": "8/4r2k/6p1/1bQP1n2/8/2P5/6PP/6K1 b - - 2 44",
    "line": [
      "e7e1",
      "g1f2",
      "e1f1"
    ],
    "rating": 1264,
    "piece": "r"
  },
  {
    "id": "1hrcb",
    "theme": "mate2",
    "side": "b",
    "fen": "1r1rb1k1/4n2R/p1p3pQ/2Np1p2/3PnN2/qP6/P1B2PP1/1K2R3 b - - 12 29",
    "line": [
      "e4c3",
      "b1a1",
      "a3a2"
    ],
    "rating": 1280,
    "piece": "n"
  },
  {
    "id": "1KZsL",
    "theme": "mate2",
    "side": "b",
    "fen": "3rr2k/1pQ2Bp1/1pp4p/8/1P2P2n/5PNb/P4qPP/5RRK b - - 2 28",
    "line": [
      "h3g2",
      "g1g2",
      "f2g2"
    ],
    "rating": 1297,
    "piece": "b"
  },
  {
    "id": "1lWUK",
    "theme": "mate2",
    "side": "w",
    "fen": "4r2k/2q2pb1/p2p3p/1p3P2/2n4Q/P3p3/1PP4R/3r2RK w - - 0 35",
    "line": [
      "h4h6",
      "g7h6",
      "h2h6"
    ],
    "rating": 1313,
    "piece": "q"
  },
  {
    "id": "0qlNM",
    "theme": "mate2",
    "side": "w",
    "fen": "2r5/1bp2r1k/3p2Rp/3Pp2P/1q2P3/1P3P2/P7/1K4Q1 w - - 4 34",
    "line": [
      "g6h6",
      "h7h6",
      "g1g6"
    ],
    "rating": 1331,
    "piece": "r"
  },
  {
    "id": "2Mslw",
    "theme": "mate2",
    "side": "w",
    "fen": "6k1/5pp1/p7/1p3N2/2p1n2P/4P1P1/q4P2/3Q2K1 w - - 2 41",
    "line": [
      "f5e7",
      "g8h7",
      "d1h5"
    ],
    "rating": 1347,
    "piece": "n"
  },
  {
    "id": "1ByL6",
    "theme": "mate2",
    "side": "b",
    "fen": "1Q6/P4pkp/4p1p1/2bpP3/5PK1/4r3/6PP/8 b - - 1 35",
    "line": [
      "h7h5",
      "g4g5",
      "c5e7"
    ],
    "rating": 1365,
    "piece": "p"
  },
  {
    "id": "1Spy6",
    "theme": "mate2",
    "side": "b",
    "fen": "4Rnk1/5pp1/1p5p/8/p6q/Q4P1P/PPBr2P1/6K1 b - - 2 34",
    "line": [
      "h4f2",
      "g1h2",
      "f2g2"
    ],
    "rating": 1384,
    "piece": "q"
  },
  {
    "id": "3RJOH",
    "theme": "mate2",
    "side": "b",
    "fen": "1R6/5pk1/3n2p1/1B2N2p/P4P1K/6P1/1r6/8 b - - 7 42",
    "line": [
      "b2h2",
      "h4g5",
      "f7f6"
    ],
    "rating": 1404,
    "piece": "r"
  },
  {
    "id": "3p5Uv",
    "theme": "mate2",
    "side": "b",
    "fen": "7Q/3kbppp/3pp3/6q1/1P4n1/5P2/P4P1P/R1B2RK1 b - - 0 20",
    "line": [
      "g4e3",
      "g1h1",
      "g5g2"
    ],
    "rating": 1424,
    "piece": "n"
  },
  {
    "id": "3gJ0H",
    "theme": "mate2",
    "side": "w",
    "fen": "r1b4k/pp3qpp/5p2/2p1b3/2B5/2N2P2/PPP3PP/2KR4 w - - 0 20",
    "line": [
      "d1d8",
      "f7e8",
      "d8e8"
    ],
    "rating": 1444,
    "piece": "r"
  },
  {
    "id": "3aCU5",
    "theme": "mate2",
    "side": "w",
    "fen": "1rb1rbk1/5pp1/p6p/4q3/Ppn1N3/3Q3P/1P2N1P1/1B3RK1 w - - 0 25",
    "line": [
      "e4f6",
      "g7f6",
      "d3h7"
    ],
    "rating": 1463,
    "piece": "n"
  },
  {
    "id": "1yWng",
    "theme": "mate2",
    "side": "w",
    "fen": "6rk/4PQpp/p7/4q3/1P6/P7/4r1PP/5RK1 w - - 1 33",
    "line": [
      "f7g8",
      "h8g8",
      "f1f8"
    ],
    "rating": 1487,
    "piece": "q"
  },
  {
    "id": "0aYGu",
    "theme": "mate2",
    "side": "w",
    "fen": "r5rk/pp2qR2/2b3QB/4P3/2pP3b/2P5/PP5P/R5K1 w - - 3 25",
    "line": [
      "h6g7",
      "g8g7",
      "g6g7"
    ],
    "rating": 1511,
    "piece": "b"
  },
  {
    "id": "35OL8",
    "theme": "mate2",
    "side": "b",
    "fen": "6rk/p6p/4p2r/2pp1p2/5P2/2P2QqP/PP3RP1/6RK b - - 0 28",
    "line": [
      "h6h3",
      "g2h3",
      "g3g1"
    ],
    "rating": 1535,
    "piece": "r"
  },
  {
    "id": "2E3gP",
    "theme": "mate2",
    "side": "b",
    "fen": "7k/pb3Qp1/7p/1p6/1P2n2q/P4P2/B3R1P1/2r2NK1 b - - 4 29",
    "line": [
      "c1f1",
      "g1f1",
      "h4h1"
    ],
    "rating": 1560,
    "piece": "r"
  },
  {
    "id": "1avjy",
    "theme": "mate2",
    "side": "w",
    "fen": "5rk1/5Rp1/7p/4N3/1PQP4/4q2P/6PK/2q5 w - - 0 30",
    "line": [
      "f7f8",
      "g8f8",
      "c4f7"
    ],
    "rating": 1586,
    "piece": "r"
  },
  {
    "id": "1fMM7",
    "theme": "fork",
    "side": "w",
    "fen": "8/4r1k1/4B3/5PK1/6P1/8/8/8 w - - 2 63",
    "line": [
      "f5f6",
      "g7f8",
      "f6e7"
    ],
    "rating": 598,
    "piece": "p"
  },
  {
    "id": "14CMV",
    "theme": "fork",
    "side": "b",
    "fen": "r2q1rk1/pbp2ppp/1p1np3/4N3/2PP4/PBn1P1Q1/1B3PPP/R4RK1 b - - 4 16",
    "line": [
      "c3e2",
      "g1h1",
      "e2g3"
    ],
    "rating": 688,
    "piece": "n"
  },
  {
    "id": "33vlB",
    "theme": "fork",
    "side": "w",
    "fen": "8/5p2/1PN1p2p/7P/8/1r3k2/3K4/8 w - - 3 40",
    "line": [
      "c6d4",
      "f3e4",
      "d4b3"
    ],
    "rating": 735,
    "piece": "n"
  },
  {
    "id": "1ZW3n",
    "theme": "fork",
    "side": "b",
    "fen": "8/1p6/2p1k1n1/4pp2/P7/4K1N1/1PP2P2/8 b - - 1 40",
    "line": [
      "f5f4",
      "e3e4",
      "f4g3"
    ],
    "rating": 789,
    "piece": "p"
  },
  {
    "id": "0eVai",
    "theme": "fork",
    "side": "b",
    "fen": "8/1b6/pp1pk1p1/2p1n1P1/1PP1PK2/P7/1B4B1/8 b - - 6 46",
    "line": [
      "e5d3",
      "f4e3",
      "d3b2"
    ],
    "rating": 807,
    "piece": "n"
  },
  {
    "id": "1DSDV",
    "theme": "fork",
    "side": "b",
    "fen": "8/p4p1p/5k2/1N1b2p1/8/P5P1/1P2KP1P/8 b - - 5 32",
    "line": [
      "d5c4",
      "e2e3",
      "c4b5"
    ],
    "rating": 825,
    "piece": "b"
  },
  {
    "id": "0Tbws",
    "theme": "fork",
    "side": "b",
    "fen": "3Q4/p2P1rk1/2R2ppp/8/5P2/1P6/P1P3qP/1K5R b - - 0 32",
    "line": [
      "g2h1",
      "b1b2",
      "h1c6"
    ],
    "rating": 845,
    "piece": "q"
  },
  {
    "id": "3HfJX",
    "theme": "fork",
    "side": "w",
    "fen": "r4q1k/bpp3p1/p1np3p/4p3/4PN2/1BP5/PP3PPK/R2bR3 w - - 0 21",
    "line": [
      "f4g6",
      "h8h7",
      "g6f8"
    ],
    "rating": 862,
    "piece": "n"
  },
  {
    "id": "2LnkA",
    "theme": "fork",
    "side": "b",
    "fen": "6k1/2q4p/6p1/r1N1pp2/1NnP4/2P1P1PP/2Q3K1/2R5 b - - 0 31",
    "line": [
      "c4e3",
      "g2h2",
      "e3c2"
    ],
    "rating": 881,
    "piece": "n"
  },
  {
    "id": "3yQ9a",
    "theme": "fork",
    "side": "b",
    "fen": "8/1R3b2/8/5p2/7P/1p2k3/1P4K1/8 b - - 9 54",
    "line": [
      "f7d5",
      "g2h3",
      "d5b7"
    ],
    "rating": 898,
    "piece": "b"
  },
  {
    "id": "1HelM",
    "theme": "fork",
    "side": "b",
    "fen": "8/p5kp/2p3p1/3n4/5pK1/2P2P2/PP5P/3R4 b - - 1 29",
    "line": [
      "d5e3",
      "g4f4",
      "e3d1"
    ],
    "rating": 913,
    "piece": "n"
  },
  {
    "id": "20yev",
    "theme": "fork",
    "side": "b",
    "fen": "r5k1/1p1nqp1p/3p2p1/3P4/3BP3/3Q4/PP3P1P/2R3K1 b - - 1 26",
    "line": [
      "e7g5",
      "g1f1",
      "g5c1"
    ],
    "rating": 926,
    "piece": "q"
  },
  {
    "id": "3QZXE",
    "theme": "fork",
    "side": "w",
    "fen": "r3kbnr/pp1bpppp/8/1q1NP3/3n4/8/PPPB1PPP/R2QK2R w KQkq - 0 10",
    "line": [
      "d5c7",
      "e8d8",
      "c7b5"
    ],
    "rating": 941,
    "piece": "n"
  },
  {
    "id": "3D2gs",
    "theme": "fork",
    "side": "w",
    "fen": "8/6k1/8/8/3N2B1/4p1qP/8/7K w - - 4 42",
    "line": [
      "d4f5",
      "g7f6",
      "f5g3"
    ],
    "rating": 956,
    "piece": "n"
  },
  {
    "id": "1IWA5",
    "theme": "fork",
    "side": "w",
    "fen": "rn1q2k1/p1p3bp/1p1p2p1/3np3/8/1P2PrP1/PBPQ1P1P/R4RK1 w - - 0 14",
    "line": [
      "d2d5",
      "f3f7",
      "d5a8"
    ],
    "rating": 970,
    "piece": "q"
  },
  {
    "id": "1d9Lp",
    "theme": "fork",
    "side": "b",
    "fen": "r2q4/ppp2kb1/3p1n2/4p1B1/3nP3/2NPQ3/PPP2P2/R3K2R b KQ - 1 16",
    "line": [
      "d4c2",
      "e1d2",
      "c2e3"
    ],
    "rating": 982,
    "piece": "n"
  },
  {
    "id": "2i1KZ",
    "theme": "fork",
    "side": "w",
    "fen": "r1b1k2r/1pp1qppp/p2p1n2/n2Pp3/2P1P3/P4N2/3N1PPP/R2QKB1R w KQkq - 0 10",
    "line": [
      "d1a4",
      "f6d7",
      "a4a5"
    ],
    "rating": 994,
    "piece": "q"
  },
  {
    "id": "1yaf4",
    "theme": "fork",
    "side": "b",
    "fen": "8/3Q2bk/p1P2qp1/4p2p/3p3P/1Pr3P1/P3RPK1/3R4 b - - 2 39",
    "line": [
      "f6f3",
      "g2g1",
      "f3e2"
    ],
    "rating": 1012,
    "piece": "q"
  },
  {
    "id": "2wPvz",
    "theme": "fork",
    "side": "b",
    "fen": "r5k1/pp3Rpp/2bNp3/4P1q1/3P1n2/1P4QP/P4BP1/6K1 b - - 2 26",
    "line": [
      "f4e2",
      "g1h2",
      "e2g3"
    ],
    "rating": 1035,
    "piece": "n"
  },
  {
    "id": "0UAX1",
    "theme": "fork",
    "side": "b",
    "fen": "r4rk1/pbNnqpbp/1p3np1/3Pp1B1/2P1P3/3B1N2/PP4PP/R2Q1RK1 b - - 0 13",
    "line": [
      "e7c5",
      "g1h1",
      "c5c7"
    ],
    "rating": 1056,
    "piece": "q"
  },
  {
    "id": "2TU5M",
    "theme": "fork",
    "side": "w",
    "fen": "r1bqk2r/ppp3pp/5nn1/4ppN1/1b6/2N5/PPP1QPPP/R1B1KB1R w KQkq - 2 10",
    "line": [
      "e2b5",
      "c8d7",
      "b5b4"
    ],
    "rating": 1075,
    "piece": "q"
  },
  {
    "id": "0uNiJ",
    "theme": "fork",
    "side": "w",
    "fen": "5b1r/1p4p1/pN1k3p/2p5/3pp3/5P1P/PP1r2P1/1RR3K1 w - - 0 23",
    "line": [
      "b6c4",
      "d6c6",
      "c4d2"
    ],
    "rating": 1095,
    "piece": "n"
  },
  {
    "id": "1ltBH",
    "theme": "fork",
    "side": "b",
    "fen": "8/2R4p/6pk/6b1/2Br4/1P4K1/2P5/8 b - - 6 42",
    "line": [
      "g5f4",
      "g3f3",
      "f4c7"
    ],
    "rating": 1113,
    "piece": "b"
  },
  {
    "id": "39QU2",
    "theme": "fork",
    "side": "b",
    "fen": "r1b2rk1/ppppqpp1/2n4p/8/2PP4/1QPBPN2/P5PP/R4RK1 b - - 0 12",
    "line": [
      "e7e3",
      "f1f2",
      "e3d3"
    ],
    "rating": 1128,
    "piece": "q"
  },
  {
    "id": "35xkc",
    "theme": "fork",
    "side": "w",
    "fen": "r2qr2k/p1p4p/1pQ2pp1/3P4/2P4P/2B1P3/PP3Kn1/6R1 w - - 0 23",
    "line": [
      "c3f6",
      "h8g8",
      "f6d8"
    ],
    "rating": 1142,
    "piece": "b"
  },
  {
    "id": "2W0wG",
    "theme": "fork",
    "side": "w",
    "fen": "2r5/pp1k4/4p3/6Q1/q2P4/4PPp1/4B2P/4K3 w - - 1 29",
    "line": [
      "e2b5",
      "a4b5",
      "g5b5"
    ],
    "rating": 1157,
    "piece": "b"
  },
  {
    "id": "0EsAV",
    "theme": "fork",
    "side": "b",
    "fen": "8/2k5/p1p5/2PnN3/1P2R1K1/P7/8/5r2 b - - 0 60",
    "line": [
      "d5f6",
      "g4h3",
      "f6e4"
    ],
    "rating": 1173,
    "piece": "n"
  },
  {
    "id": "0MAix",
    "theme": "fork",
    "side": "b",
    "fen": "3R4/pp3k2/2p5/5q1p/7R/1P3PK1/P4P2/8 b - - 7 33",
    "line": [
      "f5g5",
      "g3h3",
      "g5d8"
    ],
    "rating": 1189,
    "piece": "q"
  },
  {
    "id": "3X3TJ",
    "theme": "fork",
    "side": "b",
    "fen": "8/6k1/3N3p/2pb4/3b4/1P1B1PK1/r5P1/4R3 b - - 0 40",
    "line": [
      "d4f2",
      "g3f4",
      "f2e1"
    ],
    "rating": 1208,
    "piece": "b"
  },
  {
    "id": "1JB2L",
    "theme": "fork",
    "side": "b",
    "fen": "4R3/p2r2k1/2p4p/1p4pn/6KP/1B6/PPP2P2/8 b - - 3 36",
    "line": [
      "h5f6",
      "g4f5",
      "f6e8"
    ],
    "rating": 1237,
    "piece": "n"
  },
  {
    "id": "3myek",
    "theme": "fork",
    "side": "w",
    "fen": "rn2k2r/p1p2ppp/1p1b4/3P3q/4b3/P5P1/1P2N2P/R1BQKB1R w KQkq - 1 13",
    "line": [
      "d1a4",
      "e8d8",
      "a4e4"
    ],
    "rating": 1267,
    "piece": "q"
  },
  {
    "id": "2JwB4",
    "theme": "fork",
    "side": "b",
    "fen": "2kr4/1bp4R/p1p1p3/3p2Q1/3P4/2P2qP1/PP3P2/R3K3 b Q - 0 21",
    "line": [
      "f3e4",
      "g5e3",
      "e4h7"
    ],
    "rating": 1297,
    "piece": "q"
  },
  {
    "id": "1XGVo",
    "theme": "fork",
    "side": "w",
    "fen": "8/1p6/p1p3p1/P1P3Pp/2kP1P2/4KN2/8/1b6 w - - 5 52",
    "line": [
      "f3d2",
      "c4b4",
      "d2b1"
    ],
    "rating": 1324,
    "piece": "n"
  },
  {
    "id": "0B8iU",
    "theme": "fork",
    "side": "b",
    "fen": "2kr1b1r/pp5p/2n1bp2/6p1/2P1n3/PP2BN1P/K2NBPP1/R6R b - - 2 17",
    "line": [
      "e4c3",
      "a2b2",
      "c3e2"
    ],
    "rating": 1355,
    "piece": "n"
  },
  {
    "id": "2GcZK",
    "theme": "fork",
    "side": "b",
    "fen": "2k5/1p2bp1p/p1p3p1/8/4NPK1/4P3/PP3P1P/8 b - - 3 29",
    "line": [
      "f7f5",
      "g4f3",
      "f5e4"
    ],
    "rating": 1384,
    "piece": "p"
  },
  {
    "id": "2VleG",
    "theme": "fork",
    "side": "b",
    "fen": "r2qbr1k/2p1bppp/p7/1p2N3/4P1Q1/3P3P/PPP3P1/R1B2RK1 b - - 2 15",
    "line": [
      "d8d4",
      "g1h1",
      "d4e5"
    ],
    "rating": 1414,
    "piece": "q"
  },
  {
    "id": "1fn1X",
    "theme": "fork",
    "side": "w",
    "fen": "2r2r2/2P3k1/4pqPp/p1QpN3/Pp1P4/4PPp1/2R5/6K1 w - - 1 45",
    "line": [
      "e5d7",
      "f6g6",
      "d7f8"
    ],
    "rating": 1450,
    "piece": "n"
  },
  {
    "id": "1xTBZ",
    "theme": "fork",
    "side": "w",
    "fen": "r3k1nr/ppp1nppp/8/2bP4/5p1q/5P2/PPP1QN1P/R1B1KB1R w KQkq - 5 11",
    "line": [
      "e2b5",
      "c7c6",
      "b5c5"
    ],
    "rating": 1489,
    "piece": "q"
  },
  {
    "id": "0R4Nt",
    "theme": "fork",
    "side": "w",
    "fen": "1r1qk2r/p1p3pp/Bn3p2/2b1p3/2P5/3P2Pb/PP3P2/RNBQR1K1 w k - 3 14",
    "line": [
      "d1h5",
      "g7g6",
      "h5h3"
    ],
    "rating": 1530,
    "piece": "q"
  },
  {
    "id": "0J8xi",
    "theme": "fork",
    "side": "b",
    "fen": "r3k2r/pp3ppp/2p1p3/2bq4/6Q1/1NPn1N2/PP3PPP/R1B2K1R b kq - 2 13",
    "line": [
      "d3f2",
      "g4d4",
      "c5d4"
    ],
    "rating": 1570,
    "piece": "n"
  },
  {
    "id": "0zs91",
    "theme": "hanging",
    "side": "w",
    "fen": "r3k2r/pbppqppp/1p2pn2/8/2Pn4/P4NP1/1P1NPPBP/R2Q1RK1 w kq - 0 10",
    "line": [
      "f3d4",
      "b7g2",
      "g1g2"
    ],
    "rating": 781,
    "piece": "n"
  },
  {
    "id": "20CSj",
    "theme": "hanging",
    "side": "b",
    "fen": "8/8/4K1k1/3P3p/6p1/5R2/8/8 b - - 1 64",
    "line": [
      "g4f3",
      "d5d6",
      "f3f2"
    ],
    "rating": 843,
    "piece": "p"
  },
  {
    "id": "0XVo4",
    "theme": "hanging",
    "side": "w",
    "fen": "r3kb1r/2pq1ppp/p7/1p2n3/6b1/2NPBN2/PPP3PP/R2Q1RK1 w kq - 0 13",
    "line": [
      "f3e5",
      "g4d1",
      "e5d7"
    ],
    "rating": 900,
    "piece": "n"
  },
  {
    "id": "1jN9k",
    "theme": "hanging",
    "side": "b",
    "fen": "rn3rk1/pp3pp1/4bq1p/2bN4/8/3BPN2/PP3PPP/R2Q1RK1 b - - 0 12",
    "line": [
      "e6d5",
      "d3h7",
      "g8h7"
    ],
    "rating": 937,
    "piece": "b"
  },
  {
    "id": "23raC",
    "theme": "hanging",
    "side": "w",
    "fen": "2r5/3kbpp1/p3p2p/1p1p3P/1P1r1BP1/2P3R1/P3KP2/2R5 w - - 0 26",
    "line": [
      "c3d4",
      "c8c1",
      "f4c1"
    ],
    "rating": 965,
    "piece": "p"
  },
  {
    "id": "2AWgj",
    "theme": "hanging",
    "side": "b",
    "fen": "8/5ppp/Pn1k1p2/8/2BP4/5P2/5P1P/5K2 b - - 4 30",
    "line": [
      "b6c4",
      "a6a7",
      "c4b6"
    ],
    "rating": 982,
    "piece": "n"
  },
  {
    "id": "3rZmN",
    "theme": "hanging",
    "side": "b",
    "fen": "r4rk1/pR3pp1/7p/3p4/q1NQ4/3B4/P4PPP/3R2K1 b - - 0 27",
    "line": [
      "a4d1",
      "d3f1",
      "d1d4"
    ],
    "rating": 1007,
    "piece": "q"
  },
  {
    "id": "1SHjH",
    "theme": "hanging",
    "side": "b",
    "fen": "2R5/2r2ppk/2p4p/Q1Pp1q2/3P4/7P/5PP1/1R4K1 b - - 0 46",
    "line": [
      "f5b1",
      "g1h2",
      "c7c8"
    ],
    "rating": 1037,
    "piece": "q"
  },
  {
    "id": "3UdyC",
    "theme": "hanging",
    "side": "b",
    "fen": "r3r1k1/1pqn2p1/p1n1bP1p/3p4/P1p2B2/2P2N1P/1PB2PP1/R2QR1K1 b - - 0 19",
    "line": [
      "c7f4",
      "e1e6",
      "e8e6"
    ],
    "rating": 1064,
    "piece": "q"
  },
  {
    "id": "2Vym0",
    "theme": "hanging",
    "side": "b",
    "fen": "8/p5r1/1pp1k3/4p3/8/P3BQ2/6P1/1q2N1KR b - - 0 43",
    "line": [
      "b1e1",
      "f3f1",
      "e1e3"
    ],
    "rating": 1091,
    "piece": "q"
  },
  {
    "id": "3lUKl",
    "theme": "hanging",
    "side": "b",
    "fen": "8/5pk1/p3N2b/P2pPp1p/3PbQnP/q5P1/3B1P2/4N1K1 b - - 0 34",
    "line": [
      "f7e6",
      "f4h6",
      "g4h6"
    ],
    "rating": 1108,
    "piece": "p"
  },
  {
    "id": "3LYmc",
    "theme": "hanging",
    "side": "b",
    "fen": "5rk1/1p2qrp1/p4n1p/2Q1p3/4N3/2P5/PP3PPP/R4RK1 b - - 0 22",
    "line": [
      "f6e4",
      "c5e7",
      "f7e7"
    ],
    "rating": 1126,
    "piece": "n"
  },
  {
    "id": "1bZWV",
    "theme": "hanging",
    "side": "w",
    "fen": "5rk1/3n1pbp/q2p2p1/2pP2N1/1p2nPb1/1P6/PB1Q2PP/R4RK1 w - - 0 22",
    "line": [
      "g5e4",
      "g7b2",
      "d2b2"
    ],
    "rating": 1143,
    "piece": "n"
  },
  {
    "id": "2WzLQ",
    "theme": "hanging",
    "side": "w",
    "fen": "r7/p3kp2/4p3/BPbR1p2/7r/6p1/2P2P2/4R1K1 w - - 0 33",
    "line": [
      "d5c5",
      "g3f2",
      "g1f2"
    ],
    "rating": 1158,
    "piece": "r"
  },
  {
    "id": "3AaBl",
    "theme": "hanging",
    "side": "b",
    "fen": "1r5k/1P4p1/B1q2p1p/n7/7P/6P1/1Q5K/2R5 b - - 4 45",
    "line": [
      "c6a6",
      "c1c8",
      "b8c8"
    ],
    "rating": 1172,
    "piece": "q"
  },
  {
    "id": "0Y1ul",
    "theme": "hanging",
    "side": "w",
    "fen": "r2q1r1k/pp5p/1n3p2/2p3p1/4N1R1/3Q3P/PP3bP1/R1B3K1 w - - 0 23",
    "line": [
      "e4f2",
      "d8d3",
      "f2d3"
    ],
    "rating": 1190,
    "piece": "n"
  },
  {
    "id": "1N4nq",
    "theme": "hanging",
    "side": "w",
    "fen": "r5k1/1bp2ppp/p7/1p6/1P1q4/P3rP2/2Q2nPP/R2R1N1K w - - 2 23",
    "line": [
      "c2f2",
      "d4a1",
      "d1a1"
    ],
    "rating": 1207,
    "piece": "q"
  },
  {
    "id": "1JEvY",
    "theme": "hanging",
    "side": "b",
    "fen": "r1b1k1nr/pp3p1p/2npp3/1B6/4P3/2q2NQ1/P1P2PPP/R1BK3R b kq - 1 11",
    "line": [
      "c3a1",
      "b5c6",
      "b7c6"
    ],
    "rating": 1228,
    "piece": "q"
  },
  {
    "id": "0sW0n",
    "theme": "hanging",
    "side": "w",
    "fen": "r2q1rk1/1p4pp/p3p2b/3pn3/5P2/P1NQPR2/1P2B2P/R5K1 w - - 0 22",
    "line": [
      "f4e5",
      "f8f3",
      "e2f3"
    ],
    "rating": 1244,
    "piece": "p"
  },
  {
    "id": "0RzQL",
    "theme": "hanging",
    "side": "w",
    "fen": "8/4kppp/2K5/3nPp2/6P1/7P/6N1/8 w - - 0 38",
    "line": [
      "c6d5",
      "f5g4",
      "h3g4"
    ],
    "rating": 1266,
    "piece": "k"
  },
  {
    "id": "1WeKd",
    "theme": "hanging",
    "side": "b",
    "fen": "8/5b2/1R5p/4bpk1/4p1n1/1PB2NP1/P7/4K3 b - - 8 48",
    "line": [
      "e4f3",
      "c3e5",
      "g4e5"
    ],
    "rating": 1284,
    "piece": "p"
  },
  {
    "id": "3kbi7",
    "theme": "hanging",
    "side": "w",
    "fen": "3R4/7p/6b1/8/2pn2P1/1k6/1P6/2K5 w - - 11 47",
    "line": [
      "d8d4",
      "c4c3",
      "b2c3"
    ],
    "rating": 1302,
    "piece": "r"
  },
  {
    "id": "3kpoS",
    "theme": "hanging",
    "side": "b",
    "fen": "r2qk2r/1p3ppp/p1N2b2/2Pp1p2/1P3P2/2N5/P1P2PPP/1R1QK2R b Kkq - 0 13",
    "line": [
      "f6c3",
      "e1f1",
      "b7c6"
    ],
    "rating": 1323,
    "piece": "b"
  },
  {
    "id": "2y4u4",
    "theme": "hanging",
    "side": "w",
    "fen": "4rrk1/p6p/1p4p1/2p5/P1P1R2n/2BP3P/2P3K1/4R3 w - - 5 34",
    "line": [
      "e4h4",
      "e8e1",
      "c3e1"
    ],
    "rating": 1341,
    "piece": "r"
  },
  {
    "id": "3fdPp",
    "theme": "hanging",
    "side": "b",
    "fen": "2r2rk1/pp3ppp/2nqb3/2bp2B1/4N3/P4N1P/1PP2PP1/R2Q1RK1 b - - 4 14",
    "line": [
      "d5e4",
      "d1d6",
      "c5d6"
    ],
    "rating": 1353,
    "piece": "p"
  },
  {
    "id": "0tuAG",
    "theme": "hanging",
    "side": "w",
    "fen": "2r3k1/4q1pp/pr2pn2/P2p1p2/1P6/4PN2/2R2PPP/1R4K1 w - - 0 29",
    "line": [
      "c2c8",
      "f6e8",
      "a5b6"
    ],
    "rating": 1372,
    "piece": "r"
  },
  {
    "id": "0RNyo",
    "theme": "hanging",
    "side": "w",
    "fen": "2kr1b1r/pppqnppp/8/3Nn3/2P1P1b1/P2p1N2/1P3PPP/R1BQKB1R w KQ - 0 12",
    "line": [
      "f3e5",
      "g4d1",
      "e5d7"
    ],
    "rating": 1385,
    "piece": "n"
  },
  {
    "id": "3Azbd",
    "theme": "hanging",
    "side": "b",
    "fen": "4rrk1/pp4q1/2pb2p1/3b2N1/3P1BPQ/2P2P1P/P7/4RRK1 b - - 0 27",
    "line": [
      "d6f4",
      "e1e8",
      "f8e8"
    ],
    "rating": 1400,
    "piece": "b"
  },
  {
    "id": "1bGhN",
    "theme": "hanging",
    "side": "b",
    "fen": "2rqr1k1/1p3p1p/2p1Rp2/3n2p1/P1PP4/1PQB1NPP/6P1/3R2K1 b - - 0 27",
    "line": [
      "d5c3",
      "e6e8",
      "d8e8"
    ],
    "rating": 1418,
    "piece": "n"
  },
  {
    "id": "2LuXX",
    "theme": "hanging",
    "side": "b",
    "fen": "1r6/1p3p1k/p1Bbb1p1/8/8/4B1P1/P3PP1P/1R4K1 b - - 0 27",
    "line": [
      "b7c6",
      "b1b8",
      "d6b8"
    ],
    "rating": 1431,
    "piece": "p"
  },
  {
    "id": "0LsB9",
    "theme": "hanging",
    "side": "w",
    "fen": "r1bq1rk1/pp3ppp/2p2n2/8/2B5/1PN1P3/PB3PPb/R2Q1RK1 w - - 0 13",
    "line": [
      "g1h2",
      "f6g4",
      "h2g1"
    ],
    "rating": 1449,
    "piece": "k"
  },
  {
    "id": "0Enqy",
    "theme": "hanging",
    "side": "b",
    "fen": "3r1rk1/ppp2ppn/3Rb2p/8/2P5/1Pb4P/PBQ2PP1/4R1K1 b - - 0 19",
    "line": [
      "c3e1",
      "d6d8",
      "f8d8"
    ],
    "rating": 1465,
    "piece": "b"
  },
  {
    "id": "2jmA2",
    "theme": "hanging",
    "side": "w",
    "fen": "8/4p1bk/p7/8/5Q2/p4P2/2P3P1/2q2K2 w - - 0 42",
    "line": [
      "f4c1",
      "a3a2",
      "c2c3"
    ],
    "rating": 1483,
    "piece": "q"
  },
  {
    "id": "0GwUY",
    "theme": "hanging",
    "side": "b",
    "fen": "4r3/pp4bk/2r3pp/1q2p3/P1R1P3/1N5P/1P2Q1P1/2R4K b - a3 0 28",
    "line": [
      "b5b3",
      "c4c6",
      "b7c6"
    ],
    "rating": 1500,
    "piece": "q"
  },
  {
    "id": "1a9Ly",
    "theme": "hanging",
    "side": "b",
    "fen": "2r2rk1/pbqnppbp/Bpp2np1/1N6/3P4/1P2PN2/PB2QPPP/2R2RK1 b - - 7 13",
    "line": [
      "b7a6",
      "b5c7",
      "a6e2"
    ],
    "rating": 1516,
    "piece": "b"
  },
  {
    "id": "0ITA9",
    "theme": "hanging",
    "side": "w",
    "fen": "8/p1r2k2/3P4/1pP1RB2/1K4P1/8/4p3/1r6 w - - 1 55",
    "line": [
      "f5b1",
      "e2e1q",
      "e5e1"
    ],
    "rating": 1533,
    "piece": "b"
  },
  {
    "id": "1AerM",
    "theme": "hanging",
    "side": "w",
    "fen": "Q6r/p4k1p/4p3/2b2nq1/3p4/7P/PP3PP1/R3K2R w KQ - 0 21",
    "line": [
      "a8h8",
      "c5b4",
      "e1f1"
    ],
    "rating": 1548,
    "piece": "q"
  },
  {
    "id": "06yUK",
    "theme": "hanging",
    "side": "w",
    "fen": "r4rk1/1p2bppp/p1bp1n2/3Np3/P1P1P3/3q2P1/1B3PBP/R2R2K1 w - - 0 18",
    "line": [
      "d5e7",
      "g8h8",
      "d1d3"
    ],
    "rating": 1565,
    "piece": "n"
  },
  {
    "id": "3AhLp",
    "theme": "hanging",
    "side": "w",
    "fen": "1k1r2r1/1pp1qppp/p1b1pn2/1N6/1nB1N3/bP3P2/P1PP2QP/BK1R3R w - - 0 17",
    "line": [
      "b5a3",
      "f6e4",
      "f3e4"
    ],
    "rating": 1585,
    "piece": "n"
  },
  {
    "id": "1vEkI",
    "theme": "hanging",
    "side": "w",
    "fen": "2r3k1/1p3pp1/p6p/7P/Q2N2n1/5q2/P3rP2/4R1K1 w - - 0 29",
    "line": [
      "d4f3",
      "e2e1",
      "f3e1"
    ],
    "rating": 1600,
    "piece": "n"
  },
  {
    "id": "14PeS",
    "theme": "pin",
    "side": "w",
    "fen": "8/6pk/1p5p/5q2/P5R1/2P1p2P/1P3PB1/6K1 w - - 0 36",
    "line": [
      "g2e4",
      "g7g6",
      "e4f5"
    ],
    "rating": 905,
    "piece": "b"
  },
  {
    "id": "2ipKc",
    "theme": "pin",
    "side": "b",
    "fen": "r1b1kbnr/2qp1ppp/p3p3/1p6/3QPP2/2NB4/PPP3PP/R1B2RK1 b kq - 3 9",
    "line": [
      "f8c5",
      "c1e3",
      "c5d4"
    ],
    "rating": 984,
    "piece": "b"
  },
  {
    "id": "1oo5Y",
    "theme": "pin",
    "side": "b",
    "fen": "8/R2p4/p2nk3/1p6/1P2P3/2r2PK1/P2R4/8 b - - 8 49",
    "line": [
      "d6e4",
      "g3g2",
      "e4d2"
    ],
    "rating": 1030,
    "piece": "n"
  },
  {
    "id": "2Fra3",
    "theme": "pin",
    "side": "b",
    "fen": "rn2kb1r/pp3ppp/4p2n/2ppP2P/3P1qP1/2P2PB1/PP3K2/1R1Q1BNR b kq - 3 15",
    "line": [
      "h6g4",
      "f2g2",
      "g4e3"
    ],
    "rating": 1073,
    "piece": "n"
  },
  {
    "id": "3AWyQ",
    "theme": "pin",
    "side": "w",
    "fen": "r3k2r/2p2pp1/3p3p/pp1P1b2/3p4/P3qP1P/1PP3B1/RK1Q3R w kq - 0 18",
    "line": [
      "h1e1",
      "e8g8",
      "e1e3"
    ],
    "rating": 1106,
    "piece": "r"
  },
  {
    "id": "3fiUX",
    "theme": "pin",
    "side": "b",
    "fen": "4r1k1/ppp2r1p/5B1Q/6p1/6P1/5K2/1PP5/8 b - - 4 28",
    "line": [
      "f7f6",
      "h6f6",
      "e8f8"
    ],
    "rating": 1136,
    "piece": "r"
  },
  {
    "id": "1nfDS",
    "theme": "pin",
    "side": "w",
    "fen": "1r2r3/3n1pkp/p4npN/8/2Pq4/1P3BQ1/P5PP/R1B4K w - - 1 23",
    "line": [
      "h6f5",
      "g7g8",
      "f5d4"
    ],
    "rating": 1161,
    "piece": "n"
  },
  {
    "id": "1I1Tk",
    "theme": "pin",
    "side": "w",
    "fen": "5r2/p1R2rbk/bp4pp/4p3/1B2Q3/PN1p1qP1/5PKP/2R5 w - - 0 28",
    "line": [
      "e4f3",
      "f7f3",
      "b4f8"
    ],
    "rating": 1184,
    "piece": "q"
  },
  {
    "id": "00cy1",
    "theme": "pin",
    "side": "w",
    "fen": "2rknb2/3q1pp1/p1pP3r/1pQ1P3/5P1p/1P4P1/PB4K1/3R4 w - - 0 28",
    "line": [
      "c5b6",
      "e8c7",
      "d6c7"
    ],
    "rating": 1211,
    "piece": "q"
  },
  {
    "id": "353I0",
    "theme": "pin",
    "side": "b",
    "fen": "3r2k1/pb3pp1/4p2p/2n3q1/1Q6/P3PN2/4BPPP/2R3K1 b - - 3 26",
    "line": [
      "b7f3",
      "e2f3",
      "c5d3"
    ],
    "rating": 1253,
    "piece": "b"
  },
  {
    "id": "348cZ",
    "theme": "pin",
    "side": "b",
    "fen": "r1b1k2r/pp3ppp/2n5/2bqp3/8/2Q2N2/PPP1BPPP/R1B1K2R b KQkq - 3 10",
    "line": [
      "c5b4",
      "e1g1",
      "b4c3"
    ],
    "rating": 1288,
    "piece": "b"
  },
  {
    "id": "2sEY6",
    "theme": "pin",
    "side": "w",
    "fen": "2k3r1/pb3p1p/2q1p3/P1p4Q/6r1/4P1P1/1P3P1P/2R2RK1 w - - 2 26",
    "line": [
      "c1c5",
      "g4c4",
      "c5c6"
    ],
    "rating": 1320,
    "piece": "r"
  },
  {
    "id": "3443p",
    "theme": "pin",
    "side": "w",
    "fen": "r1b1r3/pp2bkpp/2p2q2/3p4/8/2P1R3/P1Q2PPP/RNB3K1 w - - 2 16",
    "line": [
      "e3f3",
      "f6f3",
      "g2f3"
    ],
    "rating": 1356,
    "piece": "r"
  },
  {
    "id": "0S9Tp",
    "theme": "pin",
    "side": "w",
    "fen": "1r6/2Rr1kbp/p2q2p1/1pR2p2/1B2p3/P5P1/1P3P1P/5QK1 w - - 4 37",
    "line": [
      "c5f5",
      "g6f5",
      "b4d6"
    ],
    "rating": 1385,
    "piece": "r"
  },
  {
    "id": "0TrkB",
    "theme": "pin",
    "side": "b",
    "fen": "4r1k1/1b4b1/p3qnN1/4Q2p/2p4P/P1N3R1/1PP3p1/4R1K1 b - - 0 28",
    "line": [
      "e6b6",
      "e1e3",
      "e8e5"
    ],
    "rating": 1416,
    "piece": "q"
  },
  {
    "id": "0yquU",
    "theme": "pin",
    "side": "b",
    "fen": "4k2r/4ppb1/1p4rq/1PpPP3/p4p2/P2Q3B/1P3PP1/2R1R1K1 b k - 2 30",
    "line": [
      "h6h3",
      "d3h3",
      "h8h3"
    ],
    "rating": 1452,
    "piece": "q"
  },
  {
    "id": "0Wuxw",
    "theme": "pin",
    "side": "b",
    "fen": "1k3r1r/pp2b1p1/2q5/1Q5p/P2PN2P/2P2P2/5K2/1R5R b - - 0 33",
    "line": [
      "c6e4",
      "b5e5",
      "e4e5"
    ],
    "rating": 1489,
    "piece": "q"
  },
  {
    "id": "3KID3",
    "theme": "pin",
    "side": "w",
    "fen": "2r2rk1/5pp1/p4qnp/1pp1p2R/6R1/P2PP3/BPP3Q1/4K3 w - - 4 31",
    "line": [
      "g4g6",
      "f6g6",
      "g2g6"
    ],
    "rating": 1529,
    "piece": "r"
  },
  {
    "id": "267wS",
    "theme": "pin",
    "side": "w",
    "fen": "rn3r1k/pp3p1p/2pb1q2/3p1bp1/5N2/1BP1B1Q1/P4PPP/R3R1K1 w - g6 0 15",
    "line": [
      "e3d4",
      "f6d4",
      "c3d4"
    ],
    "rating": 1564,
    "piece": "b"
  },
  {
    "id": "0Nk6W",
    "theme": "pin",
    "side": "w",
    "fen": "b4k1r/5pp1/4p2p/2q5/2P3n1/1P4P1/P1N2P1P/R1BR2K1 w - - 0 23",
    "line": [
      "c1a3",
      "c5a3",
      "c2a3"
    ],
    "rating": 1595,
    "piece": "b"
  }
];
