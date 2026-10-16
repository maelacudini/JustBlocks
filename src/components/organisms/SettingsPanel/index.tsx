import { ThemedText } from '@/components/atoms/ThemedText';
import { SettingRow } from '@/components/molecules/SettingRow';
import { useAppTheme } from '@/context/theme-provider';
import { useAppSettings } from '@/hooks/use-app-settings';
import { ActivityIndicator, View } from 'react-native';

export function SettingsPanel() {
  const {
    settings,
    isLoaded,
    setSoundEnabled,
    setVibrationEnabled,
  } = useAppSettings();

  const { colors, isDark, setPreference} = useAppTheme();

  if (!isLoaded) {
    return (
      <View style={{maxWidth: 800, width: '100%', marginHorizontal: 'auto'}}>
        <ActivityIndicator
          color={colors.primary}
          accessibilityLabel="Loading settings"
        />
      </View>
    );
  }

  return (
    <View style={{maxWidth: 800, width: '100%', marginHorizontal: 'auto', display: 'flex', flexDirection: 'column', gap: 40}}>
      <ThemedText type="title">
        Preferences
      </ThemedText>

      <View style={{display: 'flex', flexDirection: 'column', gap: 24}}>
        <SettingRow
          title='Sound effects'
          description='Play sounds during gameplay.'
          value={settings.soundEnabled}
          onValueChange={setSoundEnabled}
        />

        <SettingRow
          title='Vibration'
          description='Vibrate when blocks are placed or lines clear.'
          value={settings.vibrationEnabled}
          onValueChange={setVibrationEnabled}
        />

        <SettingRow
          title='Dark mode'
          description='Enable or disable dark mode.'
          value={isDark}
          onValueChange={(enabled) =>
            setPreference(enabled ? 'dark' : 'light')
          }
        />
      </View>
    </View>
  );
}