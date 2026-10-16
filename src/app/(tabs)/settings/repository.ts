import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_SETTINGS, SETTINGS_STORAGE_KEY } from './const';
import { AppSettings } from './types';

export async function loadAppSettings(): Promise<AppSettings> {
  try {
    const storedSettings = await AsyncStorage.getItem(
      SETTINGS_STORAGE_KEY,
    );

    if (!storedSettings) {
      return DEFAULT_SETTINGS;
    }

    const parsed: unknown = JSON.parse(storedSettings);

    if (!parsed || typeof parsed !== 'object') {
      return DEFAULT_SETTINGS;
    }

    const saved = parsed as Partial<AppSettings>;

    return {
      soundEnabled:
        typeof saved.soundEnabled === 'boolean'
          ? saved.soundEnabled
          : DEFAULT_SETTINGS.soundEnabled,
      vibrationEnabled:
        typeof saved.vibrationEnabled === 'boolean'
          ? saved.vibrationEnabled
          : DEFAULT_SETTINGS.vibrationEnabled,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveAppSettings(
  settings: AppSettings,
): Promise<void> {
  await AsyncStorage.setItem(
    SETTINGS_STORAGE_KEY,
    JSON.stringify(settings),
  );
}