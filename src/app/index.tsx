import { ThemedText } from '@/components/atoms/ThemedText.tsx';
import { ThemedView } from '@/components/atoms/ThemedView.tsx';
import { Link } from 'expo-router';
import styles from "./styles";

export default function Index() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>Homepage</ThemedText>
      <Link href='/game'>
        <ThemedText>
          Game
        </ThemedText>
      </Link>
      <Link href='/settings'>
        <ThemedText>
          Settings
        </ThemedText>
      </Link>
    </ThemedView>
  );
}
