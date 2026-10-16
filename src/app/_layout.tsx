import { TabLayout } from '@/components/organisms/TabLayout';
import { ThemeProvider } from '@/context/theme-provider';
import '@/global.css';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <TabLayout />
    </ThemeProvider>
  )
}
