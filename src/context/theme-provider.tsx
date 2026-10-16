
import { COLORS, STORAGE_KEY } from "@/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  Appearance,
  Platform,
  useColorScheme,
} from "react-native";


export type ThemePreference = "system" | "light" | "dark";

type ThemeContextValue = {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  isDark: boolean;
  colors: typeof COLORS.light | typeof COLORS.dark;
  ready: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Provides a persistent app-wide theme preference. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadPreference() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);

        if (
          saved === "system" ||
          saved === "light" ||
          saved === "dark"
        ) {
          if (active) setPreferenceState(saved);
        }
      } catch (error) {
        console.warn("Could not load theme preference.", error);
      } finally {
        if (active) setReady(true);
      }
    }

    void loadPreference();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!ready || Platform.OS === "web") return;

    Appearance.setColorScheme(
      preference === "system" ? "unspecified" : preference
    );
  }, [preference, ready]);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);

    void AsyncStorage.setItem(STORAGE_KEY, next).catch((error) => {
      console.warn("Could not save theme preference.", error);
    });
  }, []);

  const isDark =
    preference === "system"
      ? systemScheme === "dark"
      : preference === "dark";

  const value = useMemo(
    () => ({
      preference,
      setPreference,
      isDark,
      colors: isDark ? COLORS['dark'] : COLORS['light'],
      ready,
    }),
    [preference, setPreference, isDark, ready]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/** Reads the active theme and its preference controls. */
export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useAppTheme must be used inside ThemeProvider.");
  }

  return context;
}
