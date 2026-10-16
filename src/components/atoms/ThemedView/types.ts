import { ThemeColor } from '@/constants/theme';
import { type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: ThemeColor;
};