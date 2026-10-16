/**
 * Core types for JustBlocks.
 *
 * These types deliberately contain no React Native or UI dependencies.
 */

/** A cell offset relative to the piece's top-left corner. */
export type CellOffset = readonly [row: number, column: number];

/** A stable identifier for a piece shape. */
export type PieceShapeId = string;

/**
 * Defines a piece's geometry.
 * Visual appearance belongs to the skin system, not the engine.
 */
export interface PieceShape {
  readonly id: PieceShapeId;
  readonly cells: readonly CellOffset[];
}

/** A particular piece instance shown in the tray. */
export interface PieceInstance {
  readonly id: string;
  readonly shapeId: PieceShapeId;
}

/** `true` means occupied; `false` means empty. */
export type Board = boolean[][];

export interface Position {
  readonly row: number;
  readonly column: number;
}

export interface LineClearResult {
  readonly board: Board;
  readonly clearedRows: readonly number[];
  readonly clearedColumns: readonly number[];
  /** Number of distinct cells removed, counting row/column intersections once. */
  readonly clearedCellCount: number;
}

/** Current phase of the game. */
export type GameStatus =
  | 'playing'
  | 'needs-refresh'
  | 'game-over';

/** Information about the most recently successful move. */
export interface LastMove {
  readonly pieceId: string;
  readonly position: Position;
  readonly clearedRows: readonly number[];
  readonly clearedColumns: readonly number[];
  readonly clearedCellCount: number;
  readonly linesCleared: number;
  readonly comboLevel: number;
  readonly pointsEarned: number;
}

/** Complete, serializable state for one game session. */
export interface GameState {
  readonly board: Board;
  readonly tray: readonly PieceInstance[];
  readonly score: number;
  readonly lives: number;
  readonly status: GameStatus;
  readonly lastMove: LastMove | null;

  /**
   * ID assigned to the next tray that will be generated.
   * Used to keep piece instance IDs unique within the session.
   */
  readonly nextBatchNumber: number;
}

/** Reasons a requested game action can fail. */
export type GameActionError =
  | 'game-over'
  | 'refresh-not-needed'
  | 'no-lives'
  | 'piece-not-found'
  | 'invalid-placement'
  | 'no-fair-tray'
  | 'game-not-playing';

/** Result returned by a game action. */
export type GameActionResult =
  | {
      readonly ok: true;
      readonly state: GameState;
    }
  | {
      readonly ok: false;
      readonly state: GameState;
      readonly reason: GameActionError;
    };