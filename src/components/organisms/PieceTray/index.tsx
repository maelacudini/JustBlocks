import { StyleSheet, View } from 'react-native';

import { PIECE_SHAPE_BY_ID } from '@/game/engine/const';
import { PieceInstance } from '@/game/engine/types';
import { PiecePreview } from '../../molecules/PiecePreview';

interface PieceTrayProps {
  pieces: readonly PieceInstance[];
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

export function PieceTray({
  pieces,
  disabled = false,
  onDragStart,
  onDrag,
  onDragEnd,
  onDragCancel,
}: PieceTrayProps) {
  return (
    <View style={styles.tray}>
      {pieces.map((piece) => {
        const shape = PIECE_SHAPE_BY_ID.get(piece.shapeId);

        if (!shape) return null;

        return (
          <View key={piece.id} style={styles.slot}>
            <PiecePreview
              piece={piece}
              shape={shape}
              disabled={disabled}
              onDragStart={onDragStart}
              onDrag={onDrag}
              onDragEnd={onDragEnd}
              onDragCancel={onDragCancel}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tray: {
    minHeight: 110,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: 8,
  },
  slot: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});