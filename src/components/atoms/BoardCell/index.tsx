import { useAppTheme } from '@/context/theme-provider';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

interface BoardCellProps {
  occupied: boolean;
  preview: boolean;
  previewValid: boolean;
}

export function BoardCell({
  occupied,
  preview,
  previewValid,
}: BoardCellProps) {
  const { colors } = useAppTheme();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(occupied ? 1 : preview ? 0.92 : 1, {
          duration: 140,
        }),
      },
    ],
    opacity: withTiming(occupied || preview ? 1 : 0.65, {
      duration: 140,
    }),
  }), [occupied, preview]);

  const backgroundColor = occupied
    ? colors.primary
    : preview
      ? previewValid
        ? colors.primary
        : '#E35D6A'
      : colors.card;

  return (
    <Animated.View
      style={[
        styles.cell,
        {
          backgroundColor,
          borderColor: colors.border,
        },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    margin: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 4,
  },
});