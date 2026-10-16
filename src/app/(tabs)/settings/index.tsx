import { ThemedView } from "@/components/atoms/ThemedView";
import { SettingsPanel } from "@/components/organisms/SettingsPanel";

export default function Index() {
  return (
    <ThemedView 
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24
      }}
    >
      <SettingsPanel />
    </ThemedView>
  );
}
