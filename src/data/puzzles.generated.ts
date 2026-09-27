/**
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

export const GENERATED_PUZZLES: GeneratedPuzzle[] = [
  {
    "id": "2sGwb",
    "fen": "6k1/5ppp/8/3pRn2/5P2/7r/K7/8 w - - 0 35",
    "solution": "e5e8",
    "rating": 399,
    "piece": "r"
  },
  {
    "id": "2uc9w",
    "fen": "4r2k/1p3ppp/p7/2p5/2P2q2/P1P1R3/1P2Q2P/3K4 w - - 1 26",
    "solution": "e3e8",
    "rating": 400,
    "piece": "r"
  },
  {
    "id": "2Ave9",
    "fen": "r1b2k1r/2q3p1/p1p2bpp/3p4/8/8/PPP1QPPP/RN2R1K1 w - - 0 16",
    "solution": "e2e8",
    "rating": 407,
    "piece": "q"
  },
  {
    "id": "1df0P",
    "fen": "5kn1/5pp1/7p/pB1pR3/P2PbP1K/7P/6r1/8 w - - 1 34",
    "solution": "e5e8",
    "rating": 419,
    "piece": "r"
  },
  {
    "id": "2wk6m",
    "fen": "rnbq1rk1/pp2bppp/1n2p3/3pP3/5P2/2PQ1N2/PPB3PP/RNB2RK1 w - - 3 12",
    "solution": "d3h7",
    "rating": 429,
    "piece": "q"
  },
  {
    "id": "352DO",
    "fen": "5k2/5ppp/2N5/2b2P2/2b1P3/2r5/6BP/3R3K w - - 0 33",
    "solution": "d1d8",
    "rating": 439,
    "piece": "r"
  },
  {
    "id": "1EIVp",
    "fen": "2R2r1k/q5np/8/p1p1p3/1pPpPp2/1P1P1P1P/P3N2K/8 w - - 0 45",
    "solution": "c8f8",
    "rating": 447,
    "piece": "r"
  },
  {
    "id": "1JwCq",
    "fen": "3r1rk1/p4ppp/2b5/1p6/4pPQ1/P1B1P1P1/1P4qP/R3KR2 w Q - 2 20",
    "solution": "g4g7",
    "rating": 455,
    "piece": "q"
  },
  {
    "id": "2Sbii",
    "fen": "r2q1rk1/p2n1pp1/1p2p2p/3pP1NP/3P1n2/2NQ4/PP3PP1/2R1R1K1 w - - 1 19",
    "solution": "d3h7",
    "rating": 464,
    "piece": "q"
  },
  {
    "id": "0nilP",
    "fen": "2k5/2pn1r2/pr5p/2Np2p1/P7/4RP2/1PP1K1PP/8 w - - 5 33",
    "solution": "e3e8",
    "rating": 473,
    "piece": "r"
  },
  {
    "id": "06Ql3",
    "fen": "4r1k1/5p1p/2r2bpB/p5P1/Pp1p3P/2p2K2/2P5/3RR3 w - - 0 36",
    "solution": "e1e8",
    "rating": 482,
    "piece": "r"
  },
  {
    "id": "1G2VZ",
    "fen": "r1b4k/p1p2p1r/1pn1qN2/3pp1PR/2B1P3/3P4/PPP2PP1/R3K3 w Q - 0 19",
    "solution": "h5h7",
    "rating": 488,
    "piece": "r"
  },
  {
    "id": "2nqtI",
    "fen": "r1b1Nk2/pp2np2/6p1/q3rpP1/3p2P1/BP5R/P6P/R5K1 w - - 2 27",
    "solution": "h3h8",
    "rating": 494,
    "piece": "r"
  },
  {
    "id": "0m6Sw",
    "fen": "r1b1k2r/p1p2ppp/1bp5/2q1P1B1/8/2N2N2/PP3nPP/R2Q1RK1 w kq - 0 14",
    "solution": "d1d8",
    "rating": 501,
    "piece": "q"
  },
  {
    "id": "2C50X",
    "fen": "5r1k/2q2ppp/2N5/p1Q5/4P3/2PP3P/Bn4P1/6K1 w - - 1 27",
    "solution": "c5f8",
    "rating": 509,
    "piece": "q"
  },
  {
    "id": "3JArb",
    "fen": "1k2r3/ppp2p1p/3b2p1/8/P2P4/1q6/1P1R1PPP/4R1K1 w - - 0 22",
    "solution": "e1e8",
    "rating": 516,
    "piece": "r"
  },
  {
    "id": "1PjaR",
    "fen": "2bk3r/5pp1/1q1p1n1p/1B6/8/4B3/PPP3P1/4R1K1 w - - 0 22",
    "solution": "e3b6",
    "rating": 523,
    "piece": "b"
  },
  {
    "id": "0qb4O",
    "fen": "r6r/3b1pkP/p1nq1np1/8/1pppp1pR/2P5/PP1QBPP1/2K2N1R w - - 0 24",
    "solution": "d2h6",
    "rating": 530,
    "piece": "q"
  },
  {
    "id": "2ZpDT",
    "fen": "r1b2knr/ppp2ppp/3b4/1B6/3P4/2N2P1q/PPP2K1P/R1BQR3 w - - 5 12",
    "solution": "e1e8",
    "rating": 538,
    "piece": "r"
  },
  {
    "id": "1V424",
    "fen": "2r2rk1/pp3ppp/8/4B3/3P2Q1/3q4/5PPP/5RK1 w - - 0 19",
    "solution": "g4g7",
    "rating": 547,
    "piece": "q"
  },
  {
    "id": "2K5rH",
    "fen": "3qr1k1/r3bppp/1pp1p3/p3B3/3P4/2P3QP/PP3PP1/R4RK1 w - - 4 19",
    "solution": "g3g7",
    "rating": 555,
    "piece": "q"
  },
  {
    "id": "34LxY",
    "fen": "2r3k1/p4ppp/4p3/3p1n2/3P4/4PP1P/1qQp1KP1/2R5 w - - 0 30",
    "solution": "c2c8",
    "rating": 564,
    "piece": "q"
  },
  {
    "id": "3imnH",
    "fen": "r1bqk2r/pp3p1p/2n1p1p1/2p3N1/2p2Q2/2P4P/P4PP1/bN2K2R w Kkq - 0 16",
    "solution": "f4f7",
    "rating": 573,
    "piece": "q"
  },
  {
    "id": "0e6ff",
    "fen": "8/7p/3rN1pk/4b3/2R5/6PK/7P/8 w - - 9 44",
    "solution": "c4h4",
    "rating": 581,
    "piece": "r"
  },
  {
    "id": "1k4vr",
    "fen": "k1b5/ppQ2ppp/2p5/B3P3/7P/P5P1/1PP2q2/2K5 w - - 1 23",
    "solution": "c7c8",
    "rating": 589,
    "piece": "q"
  },
  {
    "id": "3Pw67",
    "fen": "r4rk1/1p3pp1/p3p2p/2qpn1N1/P7/2PQP1P1/5PP1/R3K2R w KQ - 0 18",
    "solution": "d3h7",
    "rating": 598,
    "piece": "q"
  },
  {
    "id": "1G6tD",
    "fen": "r2qkb1r/pp3pp1/2n1p2p/3pP3/3p4/3BPQN1/PPP3PP/R4RK1 w kq - 0 13",
    "solution": "f3f7",
    "rating": 607,
    "piece": "q"
  },
  {
    "id": "2cDW4",
    "fen": "3qkbnr/p2npppp/8/6N1/8/5Q2/PP2KPPP/RN5r w k - 0 14",
    "solution": "f3f7",
    "rating": 617,
    "piece": "q"
  },
  {
    "id": "1ExaM",
    "fen": "1r4rk/1bbqn1pp/1pn1p3/p1p1PpN1/2Pp1P2/P2P2PP/1P2N1B1/1RBQ2RK w - - 5 18",
    "solution": "g5f7",
    "rating": 626,
    "piece": "n"
  },
  {
    "id": "34ZFq",
    "fen": "r2q1kr1/pp3p2/4p1p1/3pP1b1/3P2bp/P1N1PQ1P/1P4PN/5RK1 w - - 0 23",
    "solution": "f3f7",
    "rating": 635,
    "piece": "q"
  },
  {
    "id": "0fWCk",
    "fen": "r1bqk2r/pppp1ppp/8/4p3/2B1P1n1/5Q2/PPPP2PP/RNB1b2K w kq - 0 10",
    "solution": "f3f7",
    "rating": 642,
    "piece": "q"
  },
  {
    "id": "2qCdF",
    "fen": "r2qkb1r/pp3ppp/2bp4/4p3/2B5/2n1BQ2/PPP2PPP/R4RK1 w kq - 0 11",
    "solution": "f3f7",
    "rating": 650,
    "piece": "q"
  },
  {
    "id": "1nGAg",
    "fen": "rn3rk1/pp1b1ppp/q6B/4p3/2pP2Q1/2P5/P1P1NPPP/R4RK1 w - - 0 15",
    "solution": "g4g7",
    "rating": 655,
    "piece": "q"
  },
  {
    "id": "0MCYR",
    "fen": "1Q1q2k1/p4pr1/1p2bR2/6r1/8/3B4/P1P3P1/5R1K w - - 7 37",
    "solution": "b8d8",
    "rating": 660,
    "piece": "q"
  },
  {
    "id": "3CSRu",
    "fen": "rq4rk/1Np3bp/pnn3pN/4p3/3P2b1/2P3B1/PP3PPP/R3R1K1 w - - 0 21",
    "solution": "h6f7",
    "rating": 664,
    "piece": "n"
  },
  {
    "id": "2K46c",
    "fen": "r1bqkbnr/1p3ppp/p1np4/2p1p3/2B1P3/3PBQ2/PPP2PPP/RN2K1NR w KQkq - 0 6",
    "solution": "f3f7",
    "rating": 670,
    "piece": "q"
  },
  {
    "id": "3xWvC",
    "fen": "1k1N4/1p3Q2/1n4pp/p3p3/P3Pn2/2P2P1P/KP6/5q2 w - - 1 31",
    "solution": "f7b7",
    "rating": 677,
    "piece": "q"
  },
  {
    "id": "0wqe3",
    "fen": "4N1k1/p5P1/6K1/1Pr5/8/8/8/8 w - - 2 66",
    "solution": "e8f6",
    "rating": 683,
    "piece": "n"
  },
  {
    "id": "3NGbH",
    "fen": "3q1rk1/1r1nbppp/pn1pp3/1p4P1/3Q4/1P2N2P/PBP2P1N/R4RK1 w - - 1 18",
    "solution": "d4g7",
    "rating": 689,
    "piece": "q"
  },
  {
    "id": "0Qhfz",
    "fen": "r3k2r/pp1n1ppp/3Bp3/3p2Q1/3q4/P5PP/2P2P2/R4RK1 w kq - 0 18",
    "solution": "g5e7",
    "rating": 695,
    "piece": "q"
  },
  {
    "id": "2tN0c",
    "fen": "6k1/p1p1qpp1/1p6/8/8/2Q3RP/PP4PK/4r3 w - - 10 34",
    "solution": "c3g7",
    "rating": 702,
    "piece": "q"
  },
  {
    "id": "3HB0d",
    "fen": "r2k1bnr/ppp2pp1/3p2nq/1B1Pp3/4P1Q1/8/PPP2PPN/RN3RK1 w - - 1 13",
    "solution": "g4d7",
    "rating": 707,
    "piece": "q"
  },
  {
    "id": "09UfY",
    "fen": "8/1p2nppp/p2rk3/4p3/N3P3/4P3/PP4PP/5RK1 w - - 0 22",
    "solution": "a4c5",
    "rating": 712,
    "piece": "n"
  },
  {
    "id": "3eYcy",
    "fen": "r2q1b1r/3bk3/p1np1p1p/1p3p1Q/2B1P3/8/PPP1N1PP/R3K2R w KQ - 0 15",
    "solution": "h5f7",
    "rating": 717,
    "piece": "q"
  },
  {
    "id": "20jN5",
    "fen": "r2q1rk1/bpp2pp1/p2p3p/4nN2/1P2P1QP/2P5/P1B2PP1/R4RK1 w - - 1 21",
    "solution": "g4g7",
    "rating": 722,
    "piece": "q"
  },
  {
    "id": "2DTH6",
    "fen": "r1bq1k1r/ppp1b1pp/8/4p2B/8/1QN5/PPp2PPP/R3K2R w KQ - 0 14",
    "solution": "b3f7",
    "rating": 728,
    "piece": "q"
  },
  {
    "id": "0PWdh",
    "fen": "r1bqnrk1/2p3bp/1p1p4/pNnPp1N1/2P2p2/4B1P1/PPQ2PBP/R4RK1 w - - 0 15",
    "solution": "c2h7",
    "rating": 735,
    "piece": "q"
  },
  {
    "id": "1u7gZ",
    "fen": "4kb1r/pp3ppp/q3p3/n2RPnB1/r2P4/P1N2N2/5PPP/4K2R w Kk - 0 18",
    "solution": "d5d8",
    "rating": 741,
    "piece": "r"
  },
  {
    "id": "1eY4j",
    "fen": "7k/4r2p/1qp3pQ/p3Pp2/Pp6/1P2R2P/1P4P1/7K w - - 0 40",
    "solution": "h6f8",
    "rating": 748,
    "piece": "q"
  },
  {
    "id": "0DoAi",
    "fen": "4r1k1/ppp4p/3p2pP/5b2/3Q1P2/2N5/PPP3q1/2K4R w - - 0 26",
    "solution": "d4g7",
    "rating": 754,
    "piece": "q"
  },
  {
    "id": "14zZR",
    "fen": "3NQb1k/7p/2p3p1/4pp2/1p6/5bP1/4rqPK/8 w - - 4 37",
    "solution": "e8f8",
    "rating": 759,
    "piece": "q"
  },
  {
    "id": "3ef9I",
    "fen": "2kr3r/2pqnp1p/p2b1p1B/1p1Q4/6b1/1B3N2/PPP2PPP/R3R1K1 w - - 6 17",
    "solution": "d5a8",
    "rating": 764,
    "piece": "q"
  },
  {
    "id": "3UG9t",
    "fen": "8/8/6p1/P5rk/1K4p1/8/8/6R1 w - - 1 47",
    "solution": "g1h1",
    "rating": 770,
    "piece": "r"
  },
  {
    "id": "2hRza",
    "fen": "r6k/pppb1B1p/5q2/4Qp2/8/2P5/PP4PP/2K4R w - - 3 24",
    "solution": "e5f6",
    "rating": 776,
    "piece": "q"
  },
  {
    "id": "0BjJn",
    "fen": "r1b1r1k1/pp2nRpp/2p1P3/3n4/7q/BBQ5/P1PP2PP/3K4 w - - 4 22",
    "solution": "c3g7",
    "rating": 781,
    "piece": "q"
  },
  {
    "id": "3WuE6",
    "fen": "2kr3r/1p2bppp/p1p2n2/4B3/N3p3/1P6/P2PKPPP/2R4R w - - 0 18",
    "solution": "a4b6",
    "rating": 786,
    "piece": "n"
  },
  {
    "id": "18jvI",
    "fen": "r1bqkb1r/pp1ppppp/2n5/8/2BpP3/2P2Q2/PP3PPP/RNB1K2R w KQkq - 0 8",
    "solution": "f3f7",
    "rating": 790,
    "piece": "q"
  },
  {
    "id": "2UV1l",
    "fen": "r1b2rk1/ppq3p1/3bp3/5nNQ/3Ppp2/2P5/PP3PPP/R4RK1 w - - 2 17",
    "solution": "h5h7",
    "rating": 795,
    "piece": "q"
  },
  {
    "id": "2nFWH",
    "fen": "5R2/6pk/p1nq2Np/2p4Q/1p1pr3/1P6/P1Pb2PP/6K1 w - - 2 33",
    "solution": "f8h8",
    "rating": 800,
    "piece": "r"
  },
  {
    "id": "1VkFy",
    "fen": "r1bq1k1r/ppp3bp/2np1n2/3Bpp1Q/8/P1N3PP/1PPP1P2/R1B1K1NR w KQ - 4 10",
    "solution": "h5f7",
    "rating": 803,
    "piece": "q"
  },
  {
    "id": "1mxYb",
    "fen": "2b2r1k/7p/p1p1pN2/7Q/2P5/qr1B4/nR4PP/1K5R w - - 0 24",
    "solution": "h5h7",
    "rating": 808,
    "piece": "q"
  },
  {
    "id": "0EV0z",
    "fen": "2rq1kn1/1b2br1B/pn2p1Qp/1p1p4/3P4/2P4R/PP1N1PPP/R5K1 w - - 2 21",
    "solution": "g6g8",
    "rating": 812,
    "piece": "q"
  },
  {
    "id": "3cCxz",
    "fen": "r1bk2nr/3pbB1p/p5p1/1p6/3pPB2/3P1q2/PPQ2P2/R3K1R1 w Q - 0 17",
    "solution": "c2c7",
    "rating": 816,
    "piece": "q"
  },
  {
    "id": "3HMFQ",
    "fen": "r1bqkb1r/ppppp2p/1n3p2/8/2Bn4/8/PPPN1PPP/RNBQK2R w KQkq - 0 8",
    "solution": "d1h5",
    "rating": 820,
    "piece": "q"
  },
  {
    "id": "0VvRp",
    "fen": "7k/4Nrpp/b7/pp4N1/8/P2r4/1P4PP/R5K1 w - - 0 29",
    "solution": "g5f7",
    "rating": 826,
    "piece": "n"
  },
  {
    "id": "3WqAh",
    "fen": "5rk1/pp1R1pp1/2p3n1/6q1/2PQ4/1PB3pP/P4PK1/8 w - - 0 32",
    "solution": "d4g7",
    "rating": 830,
    "piece": "q"
  },
  {
    "id": "25YY8",
    "fen": "1k2r3/3R1P2/1r5p/6p1/2p5/3p4/2Pn2KP/8 w - - 0 36",
    "solution": "f7e8",
    "rating": 834,
    "piece": "q"
  },
  {
    "id": "0342j",
    "fen": "r2qkb1r/1b1pnppp/p3p3/n3P3/2p1N3/5N2/PPPPQPPP/R1B2RK1 w kq - 3 11",
    "solution": "e4d6",
    "rating": 838,
    "piece": "n"
  },
  {
    "id": "3TCuU",
    "fen": "rn1q1r1k/1b1p1p2/p3pP1p/1p6/6QP/1NNB2B1/PPP3p1/R3K1b1 w Q - 2 18",
    "solution": "g4g7",
    "rating": 842,
    "piece": "q"
  },
  {
    "id": "1TPIP",
    "fen": "r1b3nk/1q1p2pp/p1nB3N/1p2p3/4P3/2P5/P1P2PPP/R3K2R w KQ - 0 20",
    "solution": "h6f7",
    "rating": 846,
    "piece": "n"
  },
  {
    "id": "3ap8R",
    "fen": "8/1pQ3pk/p6p/3p4/2pB3K/2P3P1/P3qnP1/8 w - - 2 41",
    "solution": "c7g7",
    "rating": 851,
    "piece": "q"
  },
  {
    "id": "38s3E",
    "fen": "rn3rk1/pp2bp2/2p1pq1Q/6N1/2P5/8/PP3PPP/R4RK1 w - - 0 17",
    "solution": "h6h7",
    "rating": 855,
    "piece": "q"
  },
  {
    "id": "3pBk4",
    "fen": "r1bq1k2/p3np2/1pn2Npr/2b4Q/2Pp4/3B4/PP3PPP/RN3RK1 w - - 0 14",
    "solution": "h5h6",
    "rating": 859,
    "piece": "q"
  },
  {
    "id": "3XyZS",
    "fen": "r5rk/pp4pp/1q5N/5b2/8/7P/PP3PP1/3RR1K1 w - - 0 26",
    "solution": "h6f7",
    "rating": 865,
    "piece": "n"
  },
  {
    "id": "14oCZ",
    "fen": "k1r5/p1P2p2/4p3/7p/Q1Pq2p1/4R2P/P4PK1/8 w - - 1 34",
    "solution": "a4c6",
    "rating": 870,
    "piece": "q"
  },
  {
    "id": "0TWpm",
    "fen": "r2q1r2/1ppk1Bpn/p1np3p/4p3/PP2P3/1QPPPb1P/3N2P1/R4RK1 w - - 0 15",
    "solution": "b3e6",
    "rating": 873,
    "piece": "q"
  },
  {
    "id": "0cpsK",
    "fen": "r2q1b1r/pppk2pp/2n1bn2/6N1/8/1Q2P3/PP1P1PPP/RNB1K2R w KQ - 0 9",
    "solution": "b3e6",
    "rating": 877,
    "piece": "q"
  },
  {
    "id": "1vZJ4",
    "fen": "k2r3r/p1p5/2Ppq3/4pp1p/2P3bN/2NP2Pp/P2BPK2/1Q6 w - - 2 24",
    "solution": "b1b7",
    "rating": 881,
    "piece": "q"
  },
  {
    "id": "1CXtf",
    "fen": "4r1k1/2q2ppp/p7/8/Q1P5/P2b1P2/KP6/3R4 w - - 0 33",
    "solution": "a4e8",
    "rating": 885,
    "piece": "q"
  },
  {
    "id": "0n1AM",
    "fen": "6k1/4R3/r4pp1/p3r2p/1p3K2/7P/P5P1/2R5 w - - 0 35",
    "solution": "c1c8",
    "rating": 890,
    "piece": "r"
  },
  {
    "id": "3JNxG",
    "fen": "2r1brk1/pp1n2p1/1qnbp1P1/2ppp2Q/3P1P2/2P1PR2/PP1N3P/R1B3K1 w - - 0 17",
    "solution": "h5h7",
    "rating": 893,
    "piece": "q"
  },
  {
    "id": "28cab",
    "fen": "5rk1/pp1n3p/2pqN1pQ/3Pp3/2P5/8/PP2K2P/r7 w - - 0 26",
    "solution": "h6g7",
    "rating": 898,
    "piece": "q"
  },
  {
    "id": "2T8yU",
    "fen": "8/2q3p1/2pb3k/1p1p3p/1P1P1PP1/4PK2/3B4/1Q6 w - - 2 31",
    "solution": "g4g5",
    "rating": 902,
    "piece": "p"
  },
  {
    "id": "2jcs4",
    "fen": "8/8/7p/p2Q2p1/1bpp4/q1rk2P1/4RPKP/8 w - - 6 55",
    "solution": "d5e4",
    "rating": 906,
    "piece": "q"
  },
  {
    "id": "0Wse5",
    "fen": "3rqr1k/2p2p1n/p6P/1p2pp2/7P/2P1B1Q1/PP1N4/3R2K1 w - - 0 25",
    "solution": "g3g7",
    "rating": 910,
    "piece": "q"
  },
  {
    "id": "3vSuR",
    "fen": "8/8/P7/r6p/2Bb4/2p1k1K1/2R5/8 w - - 4 53",
    "solution": "c2e2",
    "rating": 914,
    "piece": "r"
  },
  {
    "id": "0C0te",
    "fen": "1r1qkbnr/p1pppp1p/np4p1/4N3/2PP4/PN1b1Q2/1P3PPP/R1B1K2R w KQk - 0 12",
    "solution": "f3f7",
    "rating": 917,
    "piece": "q"
  },
  {
    "id": "0RSn4",
    "fen": "rn3rk1/pp3ppp/2p1b3/q7/1b2QBn1/2N3P1/PP2NPB1/3RK2R w K - 3 14",
    "solution": "e4h7",
    "rating": 921,
    "piece": "q"
  },
  {
    "id": "3tLwa",
    "fen": "r4rk1/p1p2ppp/bp2p3/4n3/8/6B1/2Q2PPP/qB4K1 w - - 0 28",
    "solution": "c2h7",
    "rating": 925,
    "piece": "q"
  },
  {
    "id": "1SehU",
    "fen": "5r2/2r4p/1pbp2p1/1p4n1/1P3P1k/P1B5/7K/3B1R2 w - - 0 41",
    "solution": "c3e1",
    "rating": 929,
    "piece": "b"
  },
  {
    "id": "0JWYY",
    "fen": "r1bqkb1r/pp1pp1p1/5np1/2p4Q/8/8/PPPP2PP/RNB1K1NR w KQkq - 0 9",
    "solution": "h5g6",
    "rating": 934,
    "piece": "q"
  },
  {
    "id": "2aa9Q",
    "fen": "rn1qkb1r/pbppp1Bp/8/1B6/3P4/8/PPP4P/RN1QK1Nq w Qkq - 0 9",
    "solution": "d1h5",
    "rating": 938,
    "piece": "q"
  },
  {
    "id": "1NVyI",
    "fen": "3r3k/1R2R2p/6rP/p2Bn3/3p1p2/P2P2Pb/5P2/6K1 w - - 0 35",
    "solution": "e7h7",
    "rating": 942,
    "piece": "r"
  },
  {
    "id": "3rmXr",
    "fen": "2kr3r/p1pb1p1p/1p3p2/8/2pP4/2q1PQ2/P3BPPP/1R3K1R w - - 0 18",
    "solution": "f3a8",
    "rating": 945,
    "piece": "q"
  },
  {
    "id": "1Xaz7",
    "fen": "2rqkb1r/1p2p2p/p7/4N2n/P1BP4/8/1P4PP/n1B2RK1 w k - 0 19",
    "solution": "c4f7",
    "rating": 950,
    "piece": "b"
  },
  {
    "id": "3Km4n",
    "fen": "6R1/5p2/p3p2k/4r2p/P7/5r2/1P4R1/1K6 w - - 0 36",
    "solution": "g8h8",
    "rating": 954,
    "piece": "r"
  },
  {
    "id": "2r3bx",
    "fen": "4k1r1/p7/4pQ2/1pBb1p1p/8/2P3q1/PP5p/K2R4 w - - 0 45",
    "solution": "f6e7",
    "rating": 958,
    "piece": "q"
  },
  {
    "id": "0viN6",
    "fen": "r2q1r2/1b3pp1/pn3b1k/1ppp2N1/7P/2N1P3/PPQ2PP1/2R1K2R w K - 4 18",
    "solution": "c2h7",
    "rating": 961,
    "piece": "q"
  },
  {
    "id": "0aByV",
    "fen": "r1bq1rk1/1pp1nppp/p3pb2/1B1p4/3P4/P1P1PNP1/1PQN1PP1/R3K2R w KQ - 0 12",
    "solution": "c2h7",
    "rating": 965,
    "piece": "q"
  },
  {
    "id": "3m7LF",
    "fen": "1r6/2ppR3/2b2pkp/6p1/p1P2PP1/1P4K1/PB6/8 w - - 0 37",
    "solution": "f4f5",
    "rating": 969,
    "piece": "p"
  },
  {
    "id": "1Xgwz",
    "fen": "8/p1p2p2/2kpq1p1/6p1/2P3P1/PQ5r/KP6/8 w - - 0 34",
    "solution": "b3b5",
    "rating": 973,
    "piece": "q"
  },
  {
    "id": "15Lhh",
    "fen": "8/5p2/1p3rp1/p1p3Rp/P4k1P/1P1P4/2P2KP1/8 w - - 0 39",
    "solution": "g2g3",
    "rating": 976,
    "piece": "p"
  },
  {
    "id": "3YIhH",
    "fen": "3qk2n/p2b2p1/1p1Qpn2/3p2N1/1B1p1P2/P5P1/1P2r3/5K2 w - - 0 29",
    "solution": "d6f8",
    "rating": 980,
    "piece": "q"
  },
  {
    "id": "2ut4S",
    "fen": "r2q2k1/5pPp/8/p4QP1/8/P4N2/3p1r2/3n2KR w - - 0 33",
    "solution": "f5h7",
    "rating": 984,
    "piece": "q"
  },
  {
    "id": "20rdG",
    "fen": "r1br1k2/5p2/p5qP/3p2Q1/3R4/2Pp2P1/PP3P2/2K4R w - - 1 29",
    "solution": "g5d8",
    "rating": 987,
    "piece": "q"
  },
  {
    "id": "0Jpry",
    "fen": "r4rk1/5np1/p1R5/1p1p1B2/8/P1P4Q/1P1q1bP1/R6K w - - 0 33",
    "solution": "h3h7",
    "rating": 991,
    "piece": "q"
  },
  {
    "id": "344O5",
    "fen": "6r1/pp6/1nq3B1/4kp1Q/1bP1pp1B/1P5P/P4P2/3R2K1 w - - 3 32",
    "solution": "h5f5",
    "rating": 996,
    "piece": "q"
  },
  {
    "id": "1DrbU",
    "fen": "2k2b1r/pp1r2pp/2p1Rp2/3N4/3P4/7Q/PqP2PPP/R5K1 w - - 0 19",
    "solution": "e6e8",
    "rating": 1000,
    "piece": "r"
  },
  {
    "id": "0VO3O",
    "fen": "r4r1k/1p5p/p7/4pq2/P2p3P/1P1P2Q1/4K1R1/6R1 w - - 0 31",
    "solution": "g3g7",
    "rating": 1007,
    "piece": "q"
  },
  {
    "id": "43jPL",
    "fen": "5K2/2r4k/p4R2/1p2p1Pp/1P2b3/3p4/P7/8 w - - 0 47",
    "solution": "f6h6",
    "rating": 1015,
    "piece": "r"
  },
  {
    "id": "3g5g0",
    "fen": "r4kr1/3n1pb1/2qp3p/p2p1P2/3P1B2/2P5/P3QPp1/R3R1K1 w - - 0 23",
    "solution": "e2e7",
    "rating": 1022,
    "piece": "q"
  },
  {
    "id": "1YVoY",
    "fen": "r4r1k/ppp3pp/3pP3/2bq2N1/5p2/7P/P3BpP1/RQ3K1R w - - 2 24",
    "solution": "b1h7",
    "rating": 1029,
    "piece": "q"
  },
  {
    "id": "14lEk",
    "fen": "r1bqkb1r/pp3p1p/2n3p1/3n2N1/3p4/2P2Q2/PP3PPP/RNB1K2R w KQkq - 0 10",
    "solution": "f3f7",
    "rating": 1035,
    "piece": "q"
  },
  {
    "id": "06ORP",
    "fen": "2q4k/6p1/1p4Pp/8/2Qp4/2P4K/3r4/5R2 w - - 2 41",
    "solution": "c4c8",
    "rating": 1042,
    "piece": "q"
  },
  {
    "id": "2uzuk",
    "fen": "2R5/8/pr6/1k2K3/2R1P3/8/8/3r4 w - - 1 60",
    "solution": "c8c5",
    "rating": 1048,
    "piece": "r"
  },
  {
    "id": "3duY0",
    "fen": "r2q1brk/pbpn1p1p/1p1p1npQ/3Pp1N1/2P1P3/2NB4/PP3PPP/R1B1R1K1 w - - 3 15",
    "solution": "g5f7",
    "rating": 1053,
    "piece": "n"
  },
  {
    "id": "0ew3Q",
    "fen": "r4q1r/1bpnbQpk/p3Bn1p/1p6/3P1B2/2N5/PPP2PPP/R4RK1 w - - 5 16",
    "solution": "e6f5",
    "rating": 1061,
    "piece": "b"
  },
  {
    "id": "16cU4",
    "fen": "r3k2r/ppp2ppp/2q1p3/4P3/1b6/2N2Q2/PP4PP/3R1RK1 w kq - 1 17",
    "solution": "f3f7",
    "rating": 1067,
    "piece": "q"
  },
  {
    "id": "0bKjt",
    "fen": "3kr3/1b4p1/2p2p1p/p4B2/Pp1B1n2/1P6/5KPP/4R3 w - - 6 46",
    "solution": "d4b6",
    "rating": 1073,
    "piece": "b"
  },
  {
    "id": "3Wsgn",
    "fen": "R5nr/4nkp1/4Nb1p/5P2/8/1P6/3BK1PP/8 w - - 1 25",
    "solution": "a8f8",
    "rating": 1078,
    "piece": "r"
  },
  {
    "id": "0BaQL",
    "fen": "r2qr3/2p2p1k/p2p1P2/6QP/1np1P3/1P1P4/5P2/1K5R w - - 4 28",
    "solution": "g5g7",
    "rating": 1084,
    "piece": "q"
  },
  {
    "id": "36EwP",
    "fen": "1R6/8/8/8/8/2K5/k7/1r6 w - - 13 59",
    "solution": "b8a8",
    "rating": 1092,
    "piece": "r"
  },
  {
    "id": "0ETW8",
    "fen": "6rk/6pp/3NQn2/p2b4/Pp3q1P/3P4/1P3PP1/1K2R3 w - - 3 26",
    "solution": "d6f7",
    "rating": 1098,
    "piece": "n"
  },
  {
    "id": "0BX4A",
    "fen": "6kr/4bp2/q1np3Q/1p2pN2/4P3/n1P2N1P/5PP1/5RK1 w - - 4 26",
    "solution": "h6g7",
    "rating": 1105,
    "piece": "q"
  },
  {
    "id": "1VYPK",
    "fen": "6k1/ppq4p/2p4B/4bQ2/4p3/8/PP4r1/7K w - - 0 29",
    "solution": "f5f8",
    "rating": 1111,
    "piece": "q"
  },
  {
    "id": "01liD",
    "fen": "8/1pp2p2/p4qp1/2R4p/kP6/7P/5PP1/1R4K1 w - - 5 37",
    "solution": "c5a5",
    "rating": 1116,
    "piece": "r"
  },
  {
    "id": "0BQsf",
    "fen": "r7/2p5/1p1p4/p2P1kP1/2P1pP2/2Nr3q/PP2Q3/2K3R1 w - - 2 30",
    "solution": "e2e4",
    "rating": 1121,
    "piece": "q"
  },
  {
    "id": "2ethf",
    "fen": "r3n2k/ppp1q2p/3p4/4Pn1Q/2B2P2/8/PPP5/2K3R1 w - - 3 28",
    "solution": "g1g8",
    "rating": 1126,
    "piece": "r"
  },
  {
    "id": "3HoCE",
    "fen": "8/7p/2B5/5p1k/5B2/6PK/5r2/6r1 w - - 10 56",
    "solution": "c6e8",
    "rating": 1131,
    "piece": "b"
  },
  {
    "id": "1kDqg",
    "fen": "3b2k1/p1q3pp/1pQ2p2/4p3/5n2/P1N1B3/1PP3PP/7K w - - 4 31",
    "solution": "c6e8",
    "rating": 1136,
    "piece": "q"
  },
  {
    "id": "3cPGC",
    "fen": "rn1qkb1r/ppp1ppp1/5n1p/4N3/2B5/2N5/PPPP1PPP/R1Bb1RK1 w kq - 0 8",
    "solution": "c4f7",
    "rating": 1142,
    "piece": "b"
  },
  {
    "id": "3ijI2",
    "fen": "4r2k/pp2bp1p/5PpQ/8/4p3/7q/P4rPP/6RK w - - 0 30",
    "solution": "h6g7",
    "rating": 1147,
    "piece": "q"
  },
  {
    "id": "0gx7r",
    "fen": "r4r2/1pp4k/p2p3P/5q2/2n1N3/8/PPP3Q1/2K4R w - - 0 26",
    "solution": "g2g7",
    "rating": 1152,
    "piece": "q"
  },
  {
    "id": "1Z02S",
    "fen": "8/3R4/6kp/8/p2Bp1PK/P2n3P/5pr1/8 w - - 0 45",
    "solution": "d7g7",
    "rating": 1158,
    "piece": "r"
  },
  {
    "id": "099Bj",
    "fen": "r2q1bnr/3bk1pp/p3Pp2/3pP2Q/3p4/2N5/PPP3PP/R1B1K2R w KQ - 0 13",
    "solution": "h5f7",
    "rating": 1162,
    "piece": "q"
  },
  {
    "id": "3Ur0H",
    "fen": "rn1q1bnr/pppk1Bpp/8/8/3p4/1Q2Pb2/PP3PPP/RNB1K2R w KQ - 1 8",
    "solution": "b3e6",
    "rating": 1167,
    "piece": "q"
  },
  {
    "id": "3F29H",
    "fen": "8/6qp/4P1k1/8/p4Q1P/7K/1p6/8 w - - 2 58",
    "solution": "f4g5",
    "rating": 1172,
    "piece": "q"
  },
  {
    "id": "1bv52",
    "fen": "r2qkb1r/ppp1p3/2n1Pp1p/5P2/4p3/8/PPP4P/RN1QKB1R w KQkq - 0 13",
    "solution": "d1h5",
    "rating": 1177,
    "piece": "q"
  },
  {
    "id": "2Anej",
    "fen": "r1bq1rk1/p1p5/1p1p2p1/6P1/2P1Pp1Q/2b5/PPP2P2/2KR3R w - - 0 19",
    "solution": "h4h7",
    "rating": 1183,
    "piece": "q"
  },
  {
    "id": "0lgy1",
    "fen": "8/2p4p/1bR5/p5Pk/4N3/5P2/r2p4/7K w - - 0 41",
    "solution": "c6h6",
    "rating": 1191,
    "piece": "r"
  },
  {
    "id": "2ek54",
    "fen": "5r1k/1r3p1p/3p1qpQ/p6B/1PP2p2/7R/6PP/6K1 w - - 0 32",
    "solution": "h6f8",
    "rating": 1196,
    "piece": "q"
  },
  {
    "id": "0IU7W",
    "fen": "3k2r1/p2r4/4bp2/5N2/8/1P4Q1/q4PPP/5RK1 w - - 4 29",
    "solution": "g3b8",
    "rating": 1204,
    "piece": "q"
  },
  {
    "id": "3KzYi",
    "fen": "rn1q3r/p3bpkB/2p1b1p1/1p1nP3/3PN3/7Q/PP3PPP/R1B2RK1 w - - 0 17",
    "solution": "h3h6",
    "rating": 1215,
    "piece": "q"
  },
  {
    "id": "3Auze",
    "fen": "3N4/4R2p/5kpb/1b2p3/pB2pP2/P1P5/1P4rP/4K3 w - - 2 40",
    "solution": "e7f7",
    "rating": 1227,
    "piece": "r"
  },
  {
    "id": "13QZI",
    "fen": "r2q2kr/3b3p/p7/1p1pP2Q/2nP4/p1PB4/7P/RNb2RK1 w - - 0 19",
    "solution": "h5f7",
    "rating": 1238,
    "piece": "q"
  },
  {
    "id": "3kKtx",
    "fen": "8/p4p2/5b2/3p1Pn1/2k1p1B1/1NP3K1/PP6/8 w - - 5 41",
    "solution": "g4e2",
    "rating": 1248,
    "piece": "b"
  },
  {
    "id": "0yRiO",
    "fen": "r5rk/1pqb4/2nb1pQp/p2p4/3P4/2P2N1P/PP1N1PP1/3RR1K1 w - - 1 19",
    "solution": "g6h6",
    "rating": 1257,
    "piece": "q"
  },
  {
    "id": "1kOp8",
    "fen": "3rn2k/3qQ1pp/1p3p2/p7/3B2R1/8/5P1P/6K1 w - - 2 37",
    "solution": "e7f8",
    "rating": 1268,
    "piece": "q"
  },
  {
    "id": "1rSGO",
    "fen": "rk3b2/n4Q2/pp1pN3/3P4/2P5/4K1P1/P5qr/R1R5 w - - 2 27",
    "solution": "f7c7",
    "rating": 1277,
    "piece": "q"
  },
  {
    "id": "30In1",
    "fen": "4Q3/pp4pk/3b3p/3P2P1/2q4P/4BK2/P7/8 w - - 1 36",
    "solution": "g5g6",
    "rating": 1288,
    "piece": "p"
  }
];
