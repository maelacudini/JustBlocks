import { PIECE_SHAPES } from './const';
import { clearCompletedLines } from './line-clears';
import { getLegalPlacements, placePiece } from './placement';
import type { Board, PieceInstance, Position } from './types';

/** Encodes a board for memoization during search. */
function boardKey(board: Board): string {
  return board.map((row) => row.map(Number).join('')).join('/');
}

/**
 * Returns true when all supplied pieces can be placed in some order.
 *
 * This is a simulation only: it never changes the real game state.
 * The search accounts for lines clearing between placements.
 */
export function hasPlayableSequence(
  startingBoard: Board,
  pieces: readonly PieceInstance[],
): boolean {
  const failedStates = new Set<string>();

  function search(board: Board, remaining: number[]): boolean {
    if (remaining.length === 0) return true;

    const key = `${boardKey(board)}|${remaining.join(',')}`;

    if (failedStates.has(key)) return false;

    for (const pieceIndex of remaining) {
      const piece = pieces[pieceIndex];
      const positions: Position[] = getLegalPlacements(board, piece);

      for (const position of positions) {
        const placedBoard = placePiece(board, piece, position);
        if (!placedBoard) continue;

        const { board: clearedBoard } =
          clearCompletedLines(placedBoard);

        const nextRemaining = remaining.filter(
          (index) => index !== pieceIndex,
        );

        if (search(clearedBoard, nextRemaining)) {
          return true;
        }
      }
    }

    failedStates.add(key);
    return false;
  }

  return search(
    startingBoard,
    pieces.map((_, index) => index),
  );
}

/**
 * Generates a tray that has a valid sequence, or returns null if
 * no candidate is found within the attempt limit.
 *
 * Inject `rng` in tests to make generation reproducible.
 */
export function generateFairTray(
  board: Board,
  batchId: string,
  rng: () => number = Math.random,
  maxAttempts = 128,
): PieceInstance[] | null {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const candidate: PieceInstance[] = Array.from(
      { length: 3 },
      (_, index) => {
        const shapeIndex = Math.floor(rng() * PIECE_SHAPES.length);
        const shape = PIECE_SHAPES[shapeIndex];

        return {
          id: `${batchId}-${index}`,
          shapeId: shape.id,
        };
      },
    );

    if (hasPlayableSequence(board, candidate)) {
      return candidate;
    }
  }

  // Never return an unvalidated set. The caller must handle this
  // result explicitly rather than silently issuing impossible pieces.
  return null;
}