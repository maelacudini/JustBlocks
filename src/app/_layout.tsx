import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  // return <Stack screenOptions={{
  //   // TODO: CUSTOMIZE HEADER HERE
  //   headerTransparent: true,
  //   headerTitleAlign: 'center'
  // }}/>;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack />
    </ThemeProvider>
  )
}
