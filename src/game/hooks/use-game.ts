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
  /** Distance between the starting edges of adjacent board cells. */
  readonly cellPitch: number;
  /** Visible cell size, excluding its margins. */
  readonly cellSize: number;
}

export interface DragPreview {
  readonly pieceId: string;
  readonly position: Position | null;
}

export interface DragPoint {
  readonly pieceId: string;
  readonly x: number;
  readonly y: number;
}

const FLOATING_GAP = 40;

export function useGame() {
  const [state, setState] = useState<GameState>(() => createNewGame());
  const stateRef = useRef(state);

  const [boardMetrics, setBoardMetrics] =
    useState<BoardMetrics | null>(null);
  const [dragPreview, setDragPreview] =
    useState<DragPreview | null>(null);
  const [dragPoint, setDragPoint] =
    useState<DragPoint | null>(null);

  const dragPreviewRef = useRef<DragPreview | null>(null);

  const commitState = useCallback((nextState: GameState) => {
    stateRef.current = nextState;
    setState(nextState);
  }, []);

  const setPreview = useCallback((preview: DragPreview | null) => {
    dragPreviewRef.current = preview;
    setDragPreview(preview);
  }, []);

  const clearDrag = useCallback(() => {
    setPreview(null);
    setDragPoint(null);
  }, [setPreview]);

  const updateBoardMetrics = useCallback((metrics: BoardMetrics) => {
    setBoardMetrics(metrics);
  }, []);

  const startDrag = useCallback((pieceId: string) => {
    setPreview({ pieceId, position: null });
  }, [setPreview]);

  const updateDrag = useCallback((
    pieceId: string,
    absoluteX: number,
    absoluteY: number,
  ) => {
    const currentState = stateRef.current;
    const piece = currentState.tray.find(item => item.id === pieceId);
    const shape = piece
      ? PIECE_SHAPE_BY_ID.get(piece.shapeId)
      : undefined;

    if (!shape || !boardMetrics || boardMetrics.cellPitch <= 0) {
      setDragPoint({ pieceId, x: absoluteX, y: absoluteY });
      setPreview({ pieceId, position: null });
      return;
    }

    const rows = Math.max(...shape.cells.map(([row]) => row)) + 1;
    const columns =
      Math.max(...shape.cells.map(([, column]) => column)) + 1;

    // Center the piece horizontally and keep it above the finger.
    const floatingLeft = absoluteX - (columns * boardMetrics.cellPitch) / 2;
    const floatingTop =
      absoluteY - rows * boardMetrics.cellPitch - FLOATING_GAP;

    setDragPoint({ pieceId, x: absoluteX, y: absoluteY });

    // Snap the floating piece's top-left corner to the board grid.
    const position: Position = {
      row: Math.floor(
        (floatingTop - boardMetrics.y) / boardMetrics.cellPitch,
      ),
      column: Math.floor(
        (floatingLeft - boardMetrics.x) / boardMetrics.cellPitch,
      ),
    };

    setPreview({ pieceId, position });
  }, [boardMetrics, setPreview]);

  const finishDrag = useCallback((pieceId: string) => {
    const preview = dragPreviewRef.current;

    if (preview?.pieceId === pieceId && preview.position !== null) {
      const currentState = stateRef.current;
      const piece = currentState.tray.find(item => item.id === pieceId);
      const shape = piece
        ? PIECE_SHAPE_BY_ID.get(piece.shapeId)
        : undefined;

      // Only commit a move when every cell is inside the board
      // and currently unoccupied.
      const position = preview.position;
      const valid = Boolean(shape) && shape!.cells.every(
        ([rowOffset, columnOffset]) => {
          const row = position.row + rowOffset;
          const column = position.column + columnOffset;

          return (
            row >= 0 &&
            row < currentState.board.length &&
            column >= 0 &&
            column < currentState.board[row].length &&
            !currentState.board[row][column]
          );
        },
      );

      if (valid) {
        const result = placePiece(currentState, pieceId, position);
        if (result.ok) commitState(result.state);
      }
    }

    clearDrag();
  }, [clearDrag, commitState]);

  const cancelDrag = useCallback(() => {
    clearDrag();
  }, [clearDrag]);

  const restart = useCallback(() => {
    commitState(createNewGame());
    clearDrag();
  }, [clearDrag, commitState]);

  const spendLife = useCallback(() => {
    const result = refreshTray(stateRef.current);
    commitState(result.state);
    clearDrag();
  }, [clearDrag, commitState]);

  const previewShape = dragPreview
    ? PIECE_SHAPE_BY_ID.get(
        state.tray.find(piece => piece.id === dragPreview.pieceId)
          ?.shapeId ?? '',
      )
    : undefined;

  return {
    state,
    boardMetrics,
    dragPreview,
    dragPoint,
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