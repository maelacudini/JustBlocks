import { ThemedText } from "@/components/atoms/ThemedText.tsx";
import { ThemedView } from "@/components/atoms/ThemedView.tsx";

export default function Index() {
  return (
    <ThemedView style={{
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    }}>
      <ThemedText>Settings</ThemedText>
    </ThemedView>
  );
}
