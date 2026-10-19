
import { useCallback, useRef, useState } from 'react';

import { PIECE_SHAPE_BY_ID } from '../engine/const';
import {
  createNewGame,
  placePiece,
  refreshTray,
} from '../engine/game-engine';
import type { GameState, Position } from '../engine/types';

export interface BoardMetrics {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly cellSize: number;
}

export interface DragPreview {
  readonly pieceId: string;
  readonly position: Position | null;
}

/**
 * Connects the game engine to React state and drag-and-drop interactions.
 *
 * The engine handles game rules and move validation. This hook manages
 * React state, board measurements, and drag interactions.
 */
export function useGame() {
  const [state, setState] = useState<GameState>(() =>
    createNewGame(),
  );

  // Initialized once; updated only by event handlers.
  const stateRef = useRef<GameState>(state);

  const [boardMetrics, setBoardMetrics] =
    useState<BoardMetrics | null>(null);

  const [dragPreview, setDragPreview] =
    useState<DragPreview | null>(null);

  const dragPreviewRef = useRef<DragPreview | null>(null);

  /**
   * Synchronizes the ref and React state after a game action.
   * Call this from event handlers, never during render.
   */
  const commitState = useCallback((nextState: GameState) => {
    stateRef.current = nextState;
    setState(nextState);
  }, []);

  /**
   * Updates the drag preview and its synchronous ref.
   */
  const setPreview = useCallback(
    (preview: DragPreview | null) => {
      dragPreviewRef.current = preview;
      setDragPreview(preview);
    },
    [],
  );

  const updateBoardMetrics = useCallback(
    (metrics: BoardMetrics) => {
      setBoardMetrics(metrics);
    },
    [],
  );

  const startDrag = useCallback(
    (pieceId: string) => {
      setPreview({ pieceId, position: null });
    },
    [setPreview],
  );


  const updateDrag = useCallback(
    (
      pieceId: string,
      absoluteX: number,
      absoluteY: number,
    ) => {
      if (!boardMetrics || boardMetrics.cellSize <= 0) {
        setPreview({ pieceId, position: null });
        return;
      }

      const { x, y, width, height, cellSize } = boardMetrics;

      // Only calculate a placement while the finger is over the board.
      const insideBoard =
        absoluteX >= x &&
        absoluteX < x + width &&
        absoluteY >= y &&
        absoluteY < y + height;

      if (!insideBoard) {
        setPreview({ pieceId, position: null });
        return;
      }

      // Find the dimensions of the piece being dragged.
      const piece = stateRef.current.tray.find(
        (item) => item.id === pieceId,
      );

      const shape = piece
        ? PIECE_SHAPE_BY_ID.get(piece.shapeId)
        : undefined;

      if (!shape || shape.cells.length === 0) {
        setPreview({ pieceId, position: null });
        return;
      }

      const rows =
        Math.max(...shape.cells.map(([row]) => row)) + 1;

      const columns =
        Math.max(...shape.cells.map(([, column]) => column)) + 1;

      // Offset by half the piece's size so its center follows the finger.
      const relativeX = absoluteX - x - (columns * cellSize) / 2;
      const relativeY = absoluteY - y - (rows * cellSize) / 2;

      const position: Position = {
        row: Math.floor(relativeY / cellSize),
        column: Math.floor(relativeX / cellSize),
      };

      setPreview({ pieceId, position });
    },
    [boardMetrics, setPreview],
  );

  const finishDrag = useCallback(
    (pieceId: string) => {
      const preview = dragPreviewRef.current;

      if (
        preview?.pieceId === pieceId &&
        preview.position !== null
      ) {
        const result = placePiece(
          stateRef.current,
          pieceId,
          preview.position,
        );

        if (result.ok) {
          commitState(result.state);
        }
      }

      setPreview(null);
    },
    [commitState, setPreview],
  );

  const cancelDrag = useCallback(() => {
    setPreview(null);
  }, [setPreview]);

  const restart = useCallback(() => {
    const nextState = createNewGame();

    commitState(nextState);
    setPreview(null);
  }, [commitState, setPreview]);

  const spendLife = useCallback(() => {
    const result = refreshTray(stateRef.current);

    commitState(result.state);
    setPreview(null);
  }, [commitState, setPreview]);

  const previewShape = dragPreview
    ? PIECE_SHAPE_BY_ID.get(
        state.tray.find(
          (piece) => piece.id === dragPreview.pieceId,
        )?.shapeId ?? '',
      )
    : undefined;

  return {
    state,
    boardMetrics,
    dragPreview,
    previewShape,
    updateBoardMetrics,
    startDrag,
    updateDrag,
    finishDrag,
    cancelDrag,
    restart,
    spendLife,
  };
}
