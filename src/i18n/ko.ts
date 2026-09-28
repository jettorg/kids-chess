import type { Color, PieceType } from '../engine/types';
import { eul, euro } from '../ui/ko';

const PIECE: Record<PieceType, string> = { p: '폰', n: '나이트', b: '비숍', r: '룩', q: '퀸', k: '킹' };
const COLOR: Record<Color, string> = { w: '흰색', b: '검은색' };

/** 한국어 문구. 이 객체의 형태가 다른 언어 사전의 기준(타입)이 된다. */
export const ko = {
  appTitle: '우리 체스 — 아이와 함께 두는 체스',
  brand: '♞ 우리 체스',
  tabPlay: '대국',
  tabLearn: '배우기',
  tabPuzzle: '퍼즐',
  tabGuide: '말 도감',
  soundToggle: '소리 켜기/끄기',
  languageLabel: '언어',
  boardLabel: '체스판',
  close: '닫기',
  updateAvailable: '새 버전이 있어요.',
  reloadNow: '지금 새로고침',
  later: '나중에',
  squareEmpty: '빈 칸',
  squareSelected: '선택됨',
  squareCanMove: '이동 가능',
  squareCanCapture: '잡을 수 있음',
  pieceWithColor: (color: Color, type: PieceType) => `${COLOR[color]} ${PIECE[type]}`,
  navLabel: '화면 선택',

  piece: (type: PieceType) => PIECE[type],
  color: (color: Color) => COLOR[color],

  // 상태 문구
  turn: (color: Color) => `${COLOR[color]} 차례예요`,
  check: (color: Color) => `체크! ${COLOR[color]} 차례예요. 킹을 지켜요.`,
  checkmateStatus: (winner: Color) => `체크메이트! ${COLOR[winner]} 승리 🎉`,
  stalemateStatus: '스테일메이트 — 무승부예요.',
  drawStatus: '무승부예요.',
  thinking: '컴퓨터가 생각하고 있어요…',
  learnStatus: (piece: PieceType, left: number) => `${euro(PIECE[piece])} 검은 말 ${left}개를 잡아 보세요.`,
  learnDoneStatus: (title: string) => `${title} 완료!`,
  learnStuck: '더 움직일 곳이 없어요. 되돌리기나 다시 하기를 눌러 보세요.',
  puzzleStatus: '흰색 차례예요. 한 수로 체크메이트!',
  puzzleSolvedStatus: '정답! 다음 문제로 가볼까요?',
  puzzleWrong: '아직 체크메이트가 아니에요. 다시 해볼까요?',

  // 결과 창
  mateTitleWin: '체크메이트! 🎉',
  mateTitle: '체크메이트!',
  mateDetail: (winner: Color) => `${COLOR[winner]}이 이겼어요.`,
  stalemateTitle: '스테일메이트예요',
  stalemateDetail: '둘 곳이 없지만 체크도 아니에요. 그래서 무승부!',
  drawTitle: '무승부예요',
  drawDetail: (reason: 'fifty' | 'repetition' | 'material') =>
    ({
      fifty: '50수 동안 아무것도 잡히지 않아서 무승부가 되었어요.',
      repetition: '같은 모양이 세 번 나와서 무승부가 되었어요.',
      material: '체크메이트를 만들 말이 부족해서 무승부가 되었어요.',
    })[reason],
  playAgain: '한 판 더!',
  lessonDoneTitle: '다 잡았어요! 🎉',
  lessonDoneDetail: (title: string) => `${eul(title)} 마쳤어요.`,
  goPuzzles: '퍼즐 풀어보기',
  nextLesson: '다음 배우기',
  retry: '다시 하기',
  puzzleDoneTitle: '체크메이트! 정답이에요 🎉',
  puzzleDoneDetail: '킹이 도망갈 곳도, 막을 방법도 없어요.',
  goPlay: '대국하러 가기',
  nextPuzzle: '다음 문제',

  // 승격
  promoTitle: '폰이 끝까지 갔어요!',
  promoText: '무엇으로 바꿀까요? 보통은 가장 센 퀸을 골라요.',

  // 대국 패널
  opponent: '상대',
  collapse: '접기',
  change: '바꾸기',
  humanSummary: '👨‍👧 둘이서 번갈아 두기',
  aiSummary: (label: string, color: Color) => `${label} · 내 말은 ${COLOR[color]}`,
  human: '👨‍👧 둘이서',
  humanHint: '한 화면에서 번갈아 둡니다.',
  level1: '🐣 병아리',
  level1Hint: '아무 데나 두어요. 처음 배울 때 좋아요.',
  level2: '🐶 강아지',
  level2Hint: '잡을 수 있으면 잡아요.',
  level3: '🦊 여우',
  level3Hint: '몇 수 앞을 봐요. 제법 잘 둬요.',
  level4: '🐻 곰',
  level4Hint: '더 멀리 봐요. 실수하면 바로 잡아요.',
  level5: '🦉 부엉이',
  level5Hint: '가장 세요. 어른도 진지하게 둬야 해요.',
  myColor: '내 색',
  whiteFirst: '⚪ 흰색 (먼저)',
  blackSecond: '⚫ 검은색 (나중)',
  helpers: '도움 버튼',
  newGame: '🔄 새 게임',
  undo: '↩️ 되돌리기',
  hint: '💡 힌트',
  flip: '🔃 판 뒤집기',
  hideCoords: '🔡 좌표 숨기기',
  showCoords: '🔡 좌표 보기',
  notation: '기보',
  noMoves: '아직 둔 수가 없어요.',

  // 배우기 패널
  restart: '🔄 다시 하기',
  help: '💡 도움말',
  pickPiece: '배울 말 고르기',

  // 퍼즐 패널
  puzzleTask: '흰색 차례예요. <strong>한 수로 체크메이트</strong>를 만들어 보세요.',
  showHint: '💬 힌트 보기',
  showAnswer: '💡 정답 보여주기',
  pickPuzzle: '문제 고르기',
  puzzleProgress: (done: number, total: number) => `${done} / ${total} 문제를 풀었어요.`,
  puzzleCounter: (n: number, total: number) => `문제 ${n} / ${total}`,
  prevPuzzle: '◀ 이전',
  nextPuzzleShort: '다음 ▶',
  nextUnsolved: '⭐ 안 푼 문제',
  puzzleRating: (rating: number) => `난이도 ${rating}`,
  lichessCredit: 'Lichess 퍼즐 데이터베이스(CC0)에서 가져온 문제예요.',

  // 도감
  guideTitle: '말 도감',
  guideLead: '말마다 움직이는 방법이 달라요. 점수는 말이 얼마나 힘이 센지 알려줘요.',
  rulesTitle: '꼭 알아두면 좋은 규칙',
};
