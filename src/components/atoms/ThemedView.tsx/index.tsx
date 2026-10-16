import { useAppTheme } from '@/hooks/use-app-theme';
import { View } from 'react-native';
import { ThemedViewProps } from './types';

export function ThemedView({ style, lightColor, darkColor, type, ...otherProps }: ThemedViewProps) {
  const { colors } = useAppTheme();

  return <View style={[{ backgroundColor: colors[type ?? 'background'] }, style]} {...otherProps} />;
}
