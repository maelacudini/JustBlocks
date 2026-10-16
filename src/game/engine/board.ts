import { BOARD_SIZE } from './const';
import { type Board } from './types';

/** Creates a fresh, empty square board. */
export function createEmptyBoard(): Board {
  return Array.from(
    { length: BOARD_SIZE },
    () => Array<boolean>(BOARD_SIZE).fill(false),
  );
}

/** Copies every row to avoid mutating a previous game state. */
export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

/** Returns the number of occupied cells on the board. */
export function countOccupiedCells(board: Board): number {
  return board.reduce(
    (total, row) => total + row.filter(Boolean).length,
    0,
  );
}