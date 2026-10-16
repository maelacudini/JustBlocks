import { useAppTheme } from '@/hooks/use-app-theme';
import { Text } from 'react-native';
import styles from './styles';
import { ThemedTextProps } from './types';

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const { colors } = useAppTheme();

  return (
    <Text
      style={[
        { color: colors[themeColor ?? 'foreground'] },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'linkPrimary' && styles.linkPrimary,
        type === 'code' && styles.code,
        style,
      ]}
      {...rest}
    />
  );
}
