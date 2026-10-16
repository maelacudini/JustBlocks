import type { PieceShape } from './types';

export const BOARD_SIZE = 8;
export const PIECES_PER_TRAY = 3;
export const MAX_LIVES = 3;

export const POINTS_PER_PLACED_CELL = 1;
export const POINTS_PER_CLEARED_LINE = 10;
export const COMBO_BONUS_PER_EXTRA_LINE = 5;

/**
 * Canonical block shapes.
 *
 * Each coordinate is relative to the shape's top-left corner.
 * Pieces do not rotate in this initial ruleset.
 */
export const PIECE_SHAPES: readonly PieceShape[] = [
  { id: 'single', cells: [[0, 0]] },

  { id: 'domino-h', cells: [[0, 0], [0, 1]] },
  { id: 'domino-v', cells: [[0, 0], [1, 0]] },

  { id: 'trio-h', cells: [[0, 0], [0, 1], [0, 2]] },
  { id: 'trio-v', cells: [[0, 0], [1, 0], [2, 0]] },

  { id: 'square-2', cells: [
    [0, 0], [0, 1],
    [1, 0], [1, 1],
  ] },

  { id: 'line-4-h', cells: [[0, 0], [0, 1], [0, 2], [0, 3]] },
  { id: 'line-4-v', cells: [[0, 0], [1, 0], [2, 0], [3, 0]] },

  { id: 'l-trio', cells: [[0, 0], [1, 0], [1, 1]] },
  { id: 'l-trio-mirror', cells: [[0, 1], [1, 0], [1, 1]] },

  { id: 't-trio', cells: [[0, 0], [0, 1], [1, 0]] },
  { id: 'corner-4', cells: [[0, 0], [1, 0], [2, 0], [2, 1]] },

  { id: 'square-3', cells: [
    [0, 0], [0, 1], [0, 2],
    [1, 0], [1, 1], [1, 2],
    [2, 0], [2, 1], [2, 2],
  ] },
];

/** Fast lookup for engine operations. */
export const PIECE_SHAPE_BY_ID = new Map(
  PIECE_SHAPES.map((shape) => [shape.id, shape]),
);