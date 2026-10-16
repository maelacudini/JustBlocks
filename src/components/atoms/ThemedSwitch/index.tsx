import { useAppTheme } from '@/context/theme-provider';
import { Switch } from 'react-native';
import styles from './styles';
import { ThemedSwitchProps } from './types';

export function ThemedSwitch({
  value,
  onValueChange,
  style,
  disabled,
  ...rest
}: ThemedSwitchProps) {
  const { colors } = useAppTheme();

  return (
    <Switch
      accessibilityRole="switch"
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{
        false: colors.muted,
        true: colors.muted,
      }}
      thumbColor={colors.mutedForeground}
      ios_backgroundColor={colors.muted}
      style={[styles.container, style]}
      {...rest}
    />
  );
}