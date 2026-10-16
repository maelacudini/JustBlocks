import { ThemedText } from "@/components/atoms/ThemedText";
import { ThemedView } from "@/components/atoms/ThemedView";

export default function Index() {
  return (
    <ThemedView style={{
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    }}>
      <ThemedText>Game</ThemedText>
    </ThemedView>
  );
}
