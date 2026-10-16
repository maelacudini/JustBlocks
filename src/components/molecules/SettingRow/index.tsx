import { ThemedSwitch } from '@/components/atoms/ThemedSwitch';
import { ThemedText } from '@/components/atoms/ThemedText';
import { View } from 'react-native';
import styles from './styles';
import { SettingRowProps } from './types';

export function SettingRow({
  title,
  description,
  value,
  onValueChange,
  disabled = false,
  style,
  ...rest
}: SettingRowProps) {
  return (
    <View style={[styles.container, style]} {...rest}>
      <View style={styles.textContainer}>
        <ThemedText type="default">
          {title}
        </ThemedText>

        <ThemedText type="small" themeColor="mutedForeground">
          {description}
        </ThemedText>
      </View>

      <ThemedSwitch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        accessibilityLabel={title}
        accessibilityHint={description}
      />
    </View>
  );
}