import { createEmptyBoard } from './board';
import {
  MAX_LIVES,
  PIECES_PER_TRAY,
  PIECE_SHAPE_BY_ID,
} from './const';
import { generateFairTray } from './fairness';
import { clearCompletedLines } from './line-clears';
import {
  canPlacePiece,
  getLegalPlacements,
  placePiece as placePieceOnBoard,
} from './placement';
import { calculateMoveScore } from './scoring';

import type { Board, GameActionError, GameActionResult, GameState, PieceInstance, Position } from './types';
/**
 * Creates a new game with an empty board and a validated starting tray.
 *
 * @param rng Optional random-number generator, useful for deterministic tests.
 */
export function createNewGame(
  rng: () => number = Math.random,
): GameState {
  const board = createEmptyBoard();

  const tray = generateFairTray(
    board,
    'tray-0',
    rng,
  );

  if (!tray || tray.length !== PIECES_PER_TRAY) {
    throw new Error(
      'Unable to generate a valid starting tray.',
    );
  }

  return {
    board,
    tray,
    score: 0,
    lives: MAX_LIVES,
    status: 'playing',
    lastMove: null,
    nextBatchNumber: 1,
  };
}

/** Returns true if at least one tray piece has a legal placement. */
export function hasAnyLegalMove(
  board: Board,
  tray: readonly PieceInstance[],
): boolean {
  return tray.some(
    (piece) => getLegalPlacements(board, piece).length > 0,
  );
}

/**
 * Checks whether the current tray has any playable pieces.
 *
 * If none can be played, the game asks for a tray refresh when lives
 * remain, or ends the game when no lives remain.
 */
export function checkGameOver(state: GameState): GameState {
  if (state.status !== 'playing') {
    return state;
  }

  if (hasAnyLegalMove(state.board, state.tray)) {
    return state;
  }

  return {
    ...state,
    status: state.lives > 0 ? 'needs-refresh' : 'game-over',
  };
}

function failed(
  state: GameState,
  reason: GameActionError,
): GameActionResult {
  return { ok: false, state, reason };
}

/**
 * Places one piece from the current tray.
 *
 * Invalid actions leave the existing state unchanged.
 * Completed rows and columns clear simultaneously.
 * A new validated tray is generated after all three pieces are used.
 */
export function placePiece(
  state: GameState,
  pieceId: string,
  position: Position,
  rng: () => number = Math.random,
): GameActionResult {
  if (state.status === 'game-over') {
    return failed(state, 'game-over');
  }

  if (state.status !== 'playing') {
    return failed(state, 'game-not-playing');
  }

  const piece = state.tray.find(
    (candidate) => candidate.id === pieceId,
  );

  if (!piece) {
    return failed(state, 'piece-not-found');
  }

  if (!canPlacePiece(state.board, piece, position)) {
    return failed(state, 'invalid-placement');
  }

  const shape = PIECE_SHAPE_BY_ID.get(piece.shapeId);

  // canPlacePiece already checks the shape, but keep this guard
  // so the engine remains safe if shape data changes in the future.
  if (!shape) {
    return failed(state, 'invalid-placement');
  }

  const placedBoard = placePieceOnBoard(
    state.board,
    piece,
    position,
  );

  if (!placedBoard) {
    return failed(state, 'invalid-placement');
  }

  const clearResult = clearCompletedLines(placedBoard);

  const moveScore = calculateMoveScore(
    shape.cells.length,
    clearResult.clearedRows.length,
    clearResult.clearedColumns.length,
  );

  const remainingPieces = state.tray.filter(
    (candidate) => candidate.id !== pieceId,
  );

  const nextState: GameState = {
    ...state,
    board: clearResult.board,
    tray: remainingPieces,
    score: state.score + moveScore.pointsEarned,
    lastMove: {
      pieceId,
      position,
      clearedRows: clearResult.clearedRows,
      clearedColumns: clearResult.clearedColumns,
      clearedCellCount: clearResult.clearedCellCount,
      linesCleared: moveScore.linesCleared,
      comboLevel: moveScore.comboLevel,
      pointsEarned: moveScore.pointsEarned,
    },
  };

  // Only generate a new tray after the current tray is fully consumed.
  if (remainingPieces.length === 0) {
    const nextTray = generateFairTray(
      clearResult.board,
      `tray-${state.nextBatchNumber}`,
      rng,
    );

    if (
      !nextTray ||
      nextTray.length !== PIECES_PER_TRAY
    ) {
      // Do not issue an unvalidated tray.
      return {
        ok: true,
        state: {
          ...nextState,
          tray: [],
          status: 'game-over',
        },
      };
    }

    return {
      ok: true,
      state: {
        ...nextState,
        tray: nextTray,
        nextBatchNumber: state.nextBatchNumber + 1,
      },
    };
  }

  return {
    ok: true,
    state: checkGameOver(nextState),
  };
}

/**
 * Spends one life and replaces the current tray with a validated tray.
 *
 * This action is only available when the current tray has no legal moves.
 * A life is deducted only after a replacement tray has been generated.
 */
export function refreshTray(
  state: GameState,
  rng: () => number = Math.random,
): GameActionResult {
  if (state.status === 'game-over') {
    return failed(state, 'game-over');
  }

  if (state.status !== 'needs-refresh') {
    return failed(state, 'refresh-not-needed');
  }

  if (state.lives <= 0) {
    return {
      ok: false,
      state: { ...state, status: 'game-over' },
      reason: 'no-lives',
    };
  }

  const tray = generateFairTray(
    state.board,
    `tray-${state.nextBatchNumber}`,
    rng,
  );

  if (
    !tray ||
    tray.length !== PIECES_PER_TRAY
  ) {
    // Do not charge a life for a tray we could not issue.
    return {
      ok: false,
      state: { ...state, status: 'game-over' },
      reason: 'no-fair-tray',
    };
  }

  return {
    ok: true,
    state: {
      ...state,
      tray,
      lives: state.lives - 1,
      status: 'playing',
      lastMove: null,
      nextBatchNumber: state.nextBatchNumber + 1,
    },
  };
}