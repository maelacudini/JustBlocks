import { ThemedText } from '@/components/atoms/ThemedText.tsx';
import { ThemedView } from '@/components/atoms/ThemedView.tsx';
import styles from "./styles";

export default function Index() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>Homepage</ThemedText>
    </ThemedView>
  );
}
