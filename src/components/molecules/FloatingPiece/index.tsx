import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/context/theme-provider';
import { PieceShape } from '@/game/engine/types';

interface FloatingPieceProps {
  shape: PieceShape;
  cellSize: number;
  cellPitch: number;
  left: number;
  top: number;
}

export function FloatingPiece({
  shape,
  cellSize,
  cellPitch,
  left,
  top,
}: FloatingPieceProps) {
  const { colors } = useAppTheme();

  const rows = Math.max(...shape.cells.map(([row]) => row)) + 1;
  const columns =
    Math.max(...shape.cells.map(([, column]) => column)) + 1;

  const filledCells = new Set(
    shape.cells.map(([row, column]) => `${row},${column}`),
  );

  return (
    <View
      pointerEvents="none"
      style={[
        styles.piece,
        {
          left,
          top,
          width: columns * cellPitch,
          height: rows * cellPitch,
        },
      ]}
    >
      {Array.from({ length: rows }, (_, row) => (
        <View key={row} style={styles.row}>
          {Array.from({ length: columns }, (_, column) => (
            <View
              key={`${row}-${column}`}
              style={{
                width: cellPitch,
                height: cellPitch,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {filledCells.has(`${row},${column}`) && (
                <View
                  style={[
                    styles.cell,
                    {
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: colors.primary,
                      borderColor: colors.border,
                    },
                  ]}
                />
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    zIndex: 1000,
    elevation: 20,
    opacity: 1,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 4,
  },
});