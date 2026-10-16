import { Platform } from 'react-native';

export const COLORS = {
  light: {
    background: '#FFFFFF',
    foreground: '#09090B',
    card: '#FFFFFF',
    cardForeground: '#09090B',
    popover: '#FFFFFF',
    popoverForeground: '#09090B',
    primary: '#8E51FF',
    primaryForeground: '#F5F3FF',
    secondary: '#F4F4F5',
    secondaryForeground: '#18181B',
    muted: '#F4F4F5',
    mutedForeground: '#71717B',
    accent: '#F4F4F5',
    accentForeground: '#18181B',
    destructive: '#E7000B',
    border: '#E4E4E7',
    input: '#E4E4E7',
    ring: '#8E51FF',
    sidebar: '#FAFAFA',
    sidebarForeground: '#09090B',
    sidebarPrimary: '#8E51FF',
    sidebarPrimaryForeground: '#F5F3FF',
    sidebarAccent: '#F4F4F5',
    sidebarAccentForeground: '#18181B',
    sidebarBorder: '#E4E4E7',
    sidebarRing: '#8E51FF',
  },
  dark: {
    background: '#09090B',
    foreground: '#FAFAFA',
    card: '#18181B',
    cardForeground: '#FAFAFA',
    popover: '#18181B',
    popoverForeground: '#FAFAFA',
    primary: '#7F22FE',
    primaryForeground: '#F5F3FF',
    secondary: '#27272A',
    secondaryForeground: '#FAFAFA',
    muted: '#27272A',
    mutedForeground: '#9F9FA9',
    accent: '#27272A',
    accentForeground: '#FAFAFA',
    destructive: '#FF6467',
    border: '#FFFFFF1A',
    input: '#FFFFFF26',
    ring: '#7F22FE',
    sidebar: '#18181B',
    sidebarForeground: '#FAFAFA',
    sidebarPrimary: '#7F22FE',
    sidebarPrimaryForeground: '#F5F3FF',
    sidebarAccent: '#27272A',
    sidebarAccentForeground: '#FAFAFA',
    sidebarBorder: '#FFFFFF1A',
    sidebarRing: '#7F22FE',
  },
} as const;

export type ThemeColor = keyof typeof COLORS.light & keyof typeof COLORS.dark;

export const FONTS = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const STORAGE_KEY = "justblocks.theme";
