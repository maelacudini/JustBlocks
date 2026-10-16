import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

import { PieceInstance, PieceShape } from '@/game/engine/types';
import { PieceCell } from '../../atoms/PieceCell';

interface PiecePreviewProps {
  piece: PieceInstance;
  shape: PieceShape;
  disabled?: boolean;
  onDragStart: (pieceId: string) => void;
  onDrag: (
    pieceId: string,
    absoluteX: number,
    absoluteY: number,
  ) => void;
  onDragEnd: (pieceId: string) => void;
  onDragCancel: () => void;
}

const CELL_SIZE = 18;
const CELL_GAP = 3;

export function PiecePreview({
  piece,
  shape,
  disabled = false,
  onDragStart,
  onDrag,
  onDragEnd,
  onDragCancel,
}: PiecePreviewProps) {
  const rows = Math.max(...shape.cells.map(([row]) => row)) + 1;
  const columns =
    Math.max(...shape.cells.map(([, column]) => column)) + 1;

  const filledCells = useMemo(
    () => new Set(shape.cells.map(([row, column]) => `${row},${column}`)),
    [shape],
  );

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(!disabled)
        .minDistance(3)
        .runOnJS(true)
        .onBegin(() => onDragStart(piece.id))
        .onUpdate((event) =>
          onDrag(piece.id, event.absoluteX, event.absoluteY),
        )
        .onEnd(() => onDragEnd(piece.id))
        .onFinalize((_event, success) => {
          if (!success) onDragCancel();
        }),
    [
      disabled,
      onDrag,
      onDragCancel,
      onDragEnd,
      onDragStart,
      piece.id,
    ],
  );

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={gesture}>
      <View
        accessibilityRole="button"
        accessibilityLabel={`Drag piece ${piece.shapeId}`}
        style={[
          styles.preview,
          {
            width: columns * (CELL_SIZE + CELL_GAP),
            height: rows * (CELL_SIZE + CELL_GAP),
            opacity: disabled ? 0.4 : 1,
          },
        ]}
      >
        {Array.from({ length: rows }, (_, row) => (
          <View key={row} style={styles.row}>
            {Array.from({ length: columns }, (_, column) => (
              <PieceCell
                key={`${row}-${column}`}
                filled={filledCells.has(`${row},${column}`)}
                size={CELL_SIZE}
              />
            ))}
          </View>
        ))}
      </View>
    </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  preview: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: CELL_GAP,
    padding: 4,
  },
  row: {
    flexDirection: 'row',
    gap: CELL_GAP,
  },
});