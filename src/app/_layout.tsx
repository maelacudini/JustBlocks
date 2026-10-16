import { ThemeProvider } from '@/context/theme-provider';
import '@/global.css';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="game" />
      </Stack>
    </ThemeProvider>
  )
}
