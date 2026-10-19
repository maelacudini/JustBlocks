import { ThemeProvider } from '@/context/theme-provider';
import '@/global.css';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="game" />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}
