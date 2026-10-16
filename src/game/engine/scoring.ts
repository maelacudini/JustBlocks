/**
 * Scoring rules for JustBlocks.
 *
 * All scoring calculations are pure and independent of the UI.
 */

import { COMBO_BONUS_PER_EXTRA_LINE, POINTS_PER_CLEARED_LINE, POINTS_PER_PLACED_CELL } from "./const";

export interface MoveScore {
  /** Points awarded for this move. */
  readonly pointsEarned: number;

  /** Number of rows and columns cleared by this move. */
  readonly linesCleared: number;

  /** Zero for zero or one line; otherwise the number of lines cleared. */
  readonly comboLevel: number;
}

/**
 * Calculates the points earned from one successful piece placement.
 *
 * A row and a column each count as one cleared line. Intersections
 * do not affect line scoring because each completed line is scored once.
 */
export function calculateMoveScore(
  placedCellCount: number,
  clearedRowCount: number,
  clearedColumnCount: number,
): MoveScore {
  const linesCleared = clearedRowCount + clearedColumnCount;

  const comboLevel = linesCleared > 1 ? linesCleared : 0;

  const linePoints =
    linesCleared * POINTS_PER_CLEARED_LINE;

  const comboPoints =
    Math.max(0, linesCleared - 1) *
    COMBO_BONUS_PER_EXTRA_LINE;

  return {
    pointsEarned:
      placedCellCount * POINTS_PER_PLACED_CELL +
      linePoints +
      comboPoints,
    linesCleared,
    comboLevel,
  };
}