
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
 * The engine remains responsible for validating moves and updating
 * the game. This hook only coordinates UI state and engine actions.
 */
export function useGame() {
  const [state, setState] = useState<GameState>(() =>
    createNewGame(),
  );

  const stateRef = useRef(state);
  stateRef.current = state;

  const [boardMetrics, setBoardMetrics] =
    useState<BoardMetrics | null>(null);

  const [dragPreview, setDragPreview] =
    useState<DragPreview | null>(null);

  const dragPreviewRef = useRef<DragPreview | null>(null);

  /**
   * Updates the visible drag preview and its synchronous ref.
   * The ref lets finishDrag read the latest position without
   * relying on a potentially stale React closure.
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

      const insideBoard =
        absoluteX >= x &&
        absoluteX < x + width &&
        absoluteY >= y &&
        absoluteY < y + height;

      if (!insideBoard) {
        setPreview({ pieceId, position: null });
        return;
      }

      const position: Position = {
        row: Math.floor((absoluteY - y) / cellSize),
        column: Math.floor((absoluteX - x) / cellSize),
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
          stateRef.current = result.state;
          setState(result.state);
        }
      }

      setPreview(null);
    },
    [setPreview],
  );

  const cancelDrag = useCallback(() => {
    setPreview(null);
  }, [setPreview]);

  const restart = useCallback(() => {
    const nextState = createNewGame();

    stateRef.current = nextState;
    setState(nextState);
    setPreview(null);
  }, [setPreview]);

  const spendLife = useCallback(() => {
    const result = refreshTray(stateRef.current);

    stateRef.current = result.state;
    setState(result.state);
    setPreview(null);
  }, [setPreview]);

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
