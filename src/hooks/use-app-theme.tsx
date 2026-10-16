
import { COLORS } from "@/constants/theme";
import { useColorScheme } from "react-native";

export function useAppTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return {
    isDark,
    colorScheme: isDark ? "dark" : "light",
    colors: isDark ? COLORS['dark'] : COLORS['light'],
  };
}
