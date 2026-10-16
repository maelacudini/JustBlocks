import { BOARD_SIZE } from './const';
import { type Board, type LineClearResult } from './types';

/**
 * Clears every completed row and column in a single operation.
 *
 * The input board is not mutated. Intersections between cleared rows
 * and columns are counted only once in `clearedCellCount`.
 */
export function clearCompletedLines(board: Board): LineClearResult {
  const clearedRows = board
    .map((row, index) => row.every(Boolean) ? index : -1)
    .filter((index) => index !== -1);

  const clearedColumns: number[] = [];

  for (let column = 0; column < BOARD_SIZE; column += 1) {
    let isComplete = true;

    for (let row = 0; row < BOARD_SIZE; row += 1) {
      if (!board[row][column]) {
        isComplete = false;
        break;
      }
    }

    if (isComplete) clearedColumns.push(column);
  }

  const rowsToClear = new Set(clearedRows);
  const columnsToClear = new Set(clearedColumns);
  let clearedCellCount = 0;

  const nextBoard = board.map((row, rowIndex) =>
    row.map((occupied, columnIndex) => {
      const shouldClear =
        rowsToClear.has(rowIndex) ||
        columnsToClear.has(columnIndex);

      if (shouldClear && occupied) {
        clearedCellCount += 1;
        return false;
      }

      return occupied;
    }),
  );

  return {
    board: nextBoard,
    clearedRows,
    clearedColumns,
    clearedCellCount,
  };
}