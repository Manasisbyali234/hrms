// MetroMindz HRMS — Design Tokens
export const Colors = {
  // Primary Brand — smooth sky blue
  primary: '#4DA8DA',
  primaryLight: '#82C4E8',
  primaryDark: '#2E86B5',
  primaryGradientStart: '#56CCF2',
  primaryGradientEnd: '#4DA8DA',

  // Accent — soft cyan
  accent: '#56CCF2',
  accentLight: '#B3E8F8',

  // Semantic
  success: '#34D399',
  successLight: '#D1FAE5',
  successDark: '#059669',

  warning: '#FBBF24',
  warningLight: '#FEF3C7',
  warningDark: '#D97706',

  danger: '#F87171',
  dangerLight: '#FEE2E2',
  dangerDark: '#DC2626',

  info: '#56CCF2',
  infoLight: '#E8F7FD',

  // Neutrals — light blue-tinted whites
  white: '#FFFFFF',
  black: '#1A2A3A',
  gray50:  '#F0F8FF',
  gray100: '#E1F0FA',
  gray200: '#C8E4F5',
  gray300: '#A0C8E8',
  gray400: '#78AECF',
  gray500: '#5590B5',
  gray600: '#3A7399',
  gray700: '#255878',
  gray800: '#163E57',
  gray900: '#0D2638',

  // Background
  background: '#F3F4F6',
  cardBg: '#FFFFFF',

  // kept for compat
  dark: '#1B4F72',
  darkCard: '#1F618D',
  darkBorder: '#2E86C1',

  // Special
  checkIn: '#34D399',
  checkOut: '#F87171',
  overlay: 'rgba(77,168,218,0.4)',
  overlayLight: 'rgba(77,168,218,0.08)',

  // Status
  active: '#34D399',
  pending: '#FBBF24',
  rejected: '#F87171',
  approved: '#34D399',
  draft: '#78AECF',
};

export const Typography = {
  fontFamily: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semiBold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
    extraBold: 'Inter_800ExtraBold',
  },
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 19,
    xl: 22,
    '2xl': 26,
    '3xl': 30,
    '4xl': 34,
    '5xl': 42,
  },
  lineHeight: {
    tight: 1.3,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const Spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
};

export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

import { Platform } from 'react-native';

export const Shadow = {
  sm: Platform.OS === 'web'
    ? { boxShadow: '0px 2px 6px rgba(77,168,218,0.08)' }
    : { shadowColor: '#4DA8DA', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 },
  md: Platform.OS === 'web'
    ? { boxShadow: '0px 4px 14px rgba(77,168,218,0.14)' }
    : { shadowColor: '#4DA8DA', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.14, shadowRadius: 14, elevation: 5 },
  lg: Platform.OS === 'web'
    ? { boxShadow: '0px 8px 24px rgba(46,134,181,0.18)' }
    : { shadowColor: '#2E86B5', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.18, shadowRadius: 24, elevation: 10 },
};

export const BOTTOM_NAV_HEIGHT = 68;
export const HEADER_HEIGHT = 56;
export const STATUS_BAR_HEIGHT = 44;
export const MIN_TOUCH_TARGET = 44;

// ── Unified Icon Container ────────────────────────────────────────────────────
// One icon background style, one icon size system, used across the entire app.
export const IconBox = {
  bg: '#F1F5F9',
  size: 44,
  sizeSmall: 36,
  sizeLarge: 52,
  radius: 999,
  shadow: Platform.OS === 'web'
    ? { boxShadow: '0px 1px 4px rgba(0,0,0,0.07)' }
    : { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 },
} as const;

// Icon color palette — matches Quick Actions reference
export const IconColors = {
  checkIn:       '#34D399',
  leave:         '#FBBF24',
  expense:       '#4DA8DA',
  directory:     '#56CCF2',
  payroll:       '#F87171',
  chat:          '#2E86B5',
  addLead:       '#34D399',
  announcements: '#FF4D6D',
  tasks:         '#4DA8DA',
  projects:      '#2E86B5',
  profile:       '#56CCF2',
  settings:      '#78AECF',
  notifications: '#F87171',
} as const;
