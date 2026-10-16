import { BOARD_SIZE, PIECE_SHAPE_BY_ID } from './const';
import { type Board, type PieceInstance, type Position } from './types';

/**
 * Checks whether every block cell fits within the board
 * and overlaps no occupied cell.
 */
export function canPlacePiece(
  board: Board,
  piece: PieceInstance,
  position: Position,
): boolean {
  const shape = PIECE_SHAPE_BY_ID.get(piece.shapeId);

  if (!shape) return false;

  return shape.cells.every(([rowOffset, columnOffset]) => {
    const row = position.row + rowOffset;
    const column = position.column + columnOffset;

    return (
      row >= 0 &&
      row < BOARD_SIZE &&
      column >= 0 &&
      column < BOARD_SIZE &&
      board[row][column] === false
    );
  });
}

/**
 * Returns a new board with the piece placed.
 * Returns `null` if the move is illegal.
 */
export function placePiece(
  board: Board,
  piece: PieceInstance,
  position: Position,
): Board | null {
  if (!canPlacePiece(board, piece, position)) {
    return null;
  }

  const shape = PIECE_SHAPE_BY_ID.get(piece.shapeId);
  if (!shape) return null;

  const nextBoard = board.map((row) => [...row]);

  for (const [rowOffset, columnOffset] of shape.cells) {
    nextBoard[position.row + rowOffset][position.column + columnOffset] = true;
  }

  return nextBoard;
}

/** Lists every legal top-left position for a piece. */
export function getLegalPlacements(
  board: Board,
  piece: PieceInstance,
): Position[] {
  const legalPositions: Position[] = [];

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let column = 0; column < BOARD_SIZE; column += 1) {
      const position = { row, column };

      if (canPlacePiece(board, piece, position)) {
        legalPositions.push(position);
      }
    }
  }

  return legalPositions;
}