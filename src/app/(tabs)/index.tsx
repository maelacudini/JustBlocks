import { ThemedText } from '@/components/atoms/ThemedText';
import { ThemedView } from '@/components/atoms/ThemedView';
import { Link } from 'expo-router';

export default function Index() {
  return (
    <ThemedView style={{
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    }}>
      <ThemedText>Just Blocks</ThemedText>
      <Link href="/game">
        <ThemedText type='link'>
          Play the game
        </ThemedText>
      </Link>
    </ThemedView>
  );
}
