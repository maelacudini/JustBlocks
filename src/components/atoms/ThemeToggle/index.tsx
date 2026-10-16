
import {
  useAppTheme,
  type ThemePreference,
} from "@/context/theme-provider";
import { Pressable, StyleSheet, Text, View } from "react-native";

const options: {
  value: ThemePreference;
  label: string;
  icon: string;
}[] = [
  { value: "system", label: "System", icon: "◐" },
  { value: "light", label: "Light", icon: "☀" },
  { value: "dark", label: "Dark", icon: "☾" },
];

/** Three-way selector for system, light, or dark appearance. */
export function ThemeToggle() {
  const { preference, setPreference, colors, ready } = useAppTheme();

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel="Appearance"
      style={[
        styles.container,
        { backgroundColor: colors.muted },
      ]}
    >
      {options.map((option) => {
        const selected = preference === option.value;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityLabel={option.label}
            accessibilityState={{ checked: selected, disabled: !ready }}
            disabled={!ready}
            onPress={() => setPreference(option.value)}
            style={[
              styles.option,
              selected && [
                styles.selected,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ],
            ]}
          >
            <Text
              style={[
                styles.icon,
                { color: selected ? colors.primary : colors.mutedForeground },
              ]}
            >
              {option.icon}
            </Text>

            <Text
              style={{
                color: colors.foreground,
                fontWeight: selected ? "600" : "400",
                fontSize: 13,
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  option: {
    flex: 1,
    minHeight: 76,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selected: {
    borderWidth: 1,
  },
  icon: {
    fontSize: 22,
  },
});
