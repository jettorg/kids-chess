/**
 * 컴퓨터 상대 탐색을 화면과 다른 스레드에서 돌리는 Web Worker.
 * 메인 스레드가 멈추지 않으므로 더 깊은 탐색(4·5단계)이 가능하다.
 */
import type { PieceType } from '../engine/types';
import { parseFen } from '../engine/position';
import { chooseMove, suggestMove, type AiLevel } from './ai';

export interface AiRequest {
  id: number;
  kind: 'choose' | 'suggest';
  fen: string;
  level?: AiLevel;
}

export interface MoveRef {
  from: number;
  to: number;
  promotion?: PieceType;
}

export interface AiResponse {
  id: number;
  move: MoveRef | null;
  /** 탐색에 걸린 시간 (ms) */
  elapsed: number;
}

interface WorkerScope {
  onmessage: ((event: MessageEvent<AiRequest>) => void) | null;
  postMessage(message: AiResponse): void;
}

const scope = self as unknown as WorkerScope;

scope.onmessage = (event) => {
  const request = event.data;
  const started = performance.now();
  const pos = parseFen(request.fen);
  const move =
    request.kind === 'choose' ? chooseMove(pos, { level: request.level ?? 1 }) : suggestMove(pos);
  scope.postMessage({
    id: request.id,
    move: move ? { from: move.from, to: move.to, ...(move.promotion ? { promotion: move.promotion } : {}) } : null,
    elapsed: performance.now() - started,
  });
};
