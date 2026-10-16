import { useAppTheme } from '@/context/theme-provider';
import { MAX_LIVES } from '@/game/engine/const';
import { StyleSheet, Text, View } from 'react-native';

interface LivesIndicatorProps {
  lives: number;
}

export function LivesIndicator({ lives }: LivesIndicatorProps) {
  const { colors } = useAppTheme();

  return (
    <View
      accessibilityLabel={`${lives} of ${MAX_LIVES} lives remaining`}
      style={styles.container}
    >
      {Array.from({ length: MAX_LIVES }, (_, index) => {
        const active = index < lives;

        return (
          <Text
            key={index}
            style={[
              styles.heart,
              { color: active ? '#E35D6A' : colors.mutedForeground },
            ]}
          >
            {active ? '♥' : '♡'}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  heart: {
    fontSize: 22,
    fontWeight: '700',
  },
});