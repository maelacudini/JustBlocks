import { DEFAULT_SETTINGS } from '@/app/(tabs)/settings/const';
import {
  loadAppSettings,
  saveAppSettings,
} from '@/app/(tabs)/settings/repository';
import { AppSettings } from '@/app/(tabs)/settings/types';
import { useCallback, useEffect, useState } from 'react';

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadSettings() {
      const savedSettings = await loadAppSettings();

      if (isActive) {
        setSettings(savedSettings);
        setIsLoaded(true);
      }
    }

    void loadSettings();

    return () => {
      isActive = false;
    };
  }, []);

  const updateSetting = useCallback(
    async <K extends keyof AppSettings>(
      key: K,
      value: AppSettings[K],
    ) => {
      const updatedSettings = {
        ...settings,
        [key]: value,
      };

      setSettings(updatedSettings);

      try {
        await saveAppSettings(updatedSettings);
      } catch (error) {
        console.error('Failed to save app settings:', error);
      }
    },
    [settings],
  );

  const setSoundEnabled = useCallback(
    (enabled: boolean) =>
      updateSetting('soundEnabled', enabled),
    [updateSetting],
  );

  const setVibrationEnabled = useCallback(
    (enabled: boolean) =>
      updateSetting('vibrationEnabled', enabled),
    [updateSetting],
  );

  return {
    settings,
    isLoaded,
    setSoundEnabled,
    setVibrationEnabled
  };
}