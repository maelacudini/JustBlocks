import { useAppTheme } from '@/context/theme-provider';
import { StyleSheet, View } from 'react-native';

interface PieceCellProps {
  filled: boolean;
  size: number;
}

export function PieceCell({ filled, size }: PieceCellProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.cell,
        {
          width: size,
          height: size,
          backgroundColor: filled ? colors.primary : 'transparent',
          borderColor: filled ? colors.primary : 'transparent',
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  cell: {
    borderWidth: 1,
    borderRadius: 3,
  },
});