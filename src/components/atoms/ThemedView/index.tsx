import { useAppTheme } from '@/hooks/use-app-theme';
import { View } from 'react-native';
import type { ThemedViewProps } from './types';

export function ThemedView({
  style,
  type = 'background',
  ...otherProps
}: ThemedViewProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        { backgroundColor: colors[type] },
        style,
      ]}
      {...otherProps}
    />
  );
}