import { useCallback, useRef } from 'react';
import {
  LayoutChangeEvent,
  StyleSheet,
  View,
} from 'react-native';

import { useAppTheme } from '@/context/theme-provider';
import { BOARD_SIZE, PIECE_SHAPE_BY_ID } from '@/game/engine/const';
import { Board } from '@/game/engine/types';
import { BoardMetrics, DragPreview } from '@/game/hooks/use-game';
import { BoardCell } from '../../atoms/BoardCell';

interface GameBoardProps {
  board: Board;
  dragPreview: DragPreview | null;
  activeShapeId?: string;
  onMeasure: (metrics: BoardMetrics) => void;
}

export function GameBoard({
  board,
  dragPreview,
  activeShapeId,
  onMeasure,
}: GameBoardProps) {
  const boardRef = useRef<View>(null);
  const { colors } = useAppTheme();

  const measureBoard = useCallback(() => {
    boardRef.current?.measureInWindow((x, y, width, height) => {
      onMeasure({
        x,
        y,
        width,
        height,
        cellSize: width / BOARD_SIZE,
      });
    });
  }, [onMeasure]);

  const handleLayout = useCallback(
    (_event: LayoutChangeEvent) => {
      // measureInWindow runs after layout and gives screen coordinates,
      // which can be compared with Gesture Handler's absoluteX/absoluteY.
      requestAnimationFrame(measureBoard);
    },
    [measureBoard],
  );

  const shape = activeShapeId
    ? PIECE_SHAPE_BY_ID.get(activeShapeId)
    : undefined;

  const previewCells = new Set<string>();

  if (dragPreview?.position && shape) {
    for (const [rowOffset, columnOffset] of shape.cells) {
      const row = dragPreview.position.row + rowOffset;
      const column = dragPreview.position.column + columnOffset;

      if (
        row >= 0 &&
        row < BOARD_SIZE &&
        column >= 0 &&
        column < BOARD_SIZE
      ) {
        previewCells.add(`${row},${column}`);
      }
    }
  }

  const previewValid =
    dragPreview?.position != null &&
    shape != null &&
    shape.cells.every(([rowOffset, columnOffset]) => {
      const row = dragPreview.position!.row + rowOffset;
      const column = dragPreview.position!.column + columnOffset;

      return (
        row >= 0 &&
        row < BOARD_SIZE &&
        column >= 0 &&
        column < BOARD_SIZE &&
        !board[row][column]
      );
    });

  return (
    <View
      ref={boardRef}
      onLayout={handleLayout}
      onTouchEnd={measureBoard}
      style={[
        styles.board,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      {board.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((occupied, columnIndex) => {
            const key = `${rowIndex},${columnIndex}`;

            return (
              <BoardCell
                key={key}
                occupied={occupied}
                preview={previewCells.has(key)}
                previewValid={Boolean(previewValid)}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    width: '100%',
    aspectRatio: 1,
    padding: 3,
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
});