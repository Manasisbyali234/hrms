// MetroMindz HRMS — Design Tokens
export const Colors = {
  // Primary Brand
  primary: '#2563EB',
  primaryLight: '#60A5FA',
  primaryDark: '#1E40AF',
  primaryGradientStart: '#2563EB',
  primaryGradientEnd: '#60A5FA',

  // Accent
  accent: '#3B82F6',
  accentLight: '#BFDBFE',

  // Semantic
  success: '#10B981',
  successLight: '#D1FAE5',
  successDark: '#065F46',

  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  warningDark: '#92400E',

  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  dangerDark: '#991B1B',

  info: '#3B82F6',
  infoLight: '#EFF6FF',

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  gray50:  '#F8FAFC',
  gray100: '#F1F5F9',
  gray200: '#E2E8F0',
  gray300: '#CBD5E1',
  gray400: '#94A3B8',
  gray500: '#64748B',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1E293B',
  gray900: '#1F2937',

  // Background
  background: '#F8FAFC',
  cardBg: '#FFFFFF',

  // Dark mode background
  dark: '#0F172A',
  darkCard: '#1E293B',
  darkBorder: '#334155',

  // Special
  checkIn: '#10B981',
  checkOut: '#EF4444',
  overlay: 'rgba(0,0,0,0.5)',
  overlayLight: 'rgba(37,99,235,0.08)',

  // Status
  active: '#10B981',
  pending: '#F59E0B',
  rejected: '#EF4444',
  approved: '#10B981',
  draft: '#64748B',
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

export const Shadow = {
  sm: {
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 5,
  },
  lg: {
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
};

export const BOTTOM_NAV_HEIGHT = 68;
export const HEADER_HEIGHT = 56;
export const STATUS_BAR_HEIGHT = 44;
export const MIN_TOUCH_TARGET = 44;
