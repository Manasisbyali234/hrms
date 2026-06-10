import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, Platform,
} from 'react-native';
import { Colors, Typography, Spacing, Shadow } from '../tokens';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  transparent?: boolean;
  light?: boolean;
  onBack?: () => void;
}

const BackIcon = ({ color = Colors.gray900 }: { color?: string }) => (
  <View style={headerStyles.backIcon}>
    <View style={[headerStyles.backArrow, { borderColor: color }]} />
    <View style={[headerStyles.backLine, { backgroundColor: color }]} />
  </View>
);

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  leftAction,
  rightAction,
  transparent = false,
  light = false,
  onBack,
}) => {
  const textColor = light ? Colors.white : Colors.gray900;

  return (
    <View style={[headerStyles.container, transparent && headerStyles.transparent, !transparent && Shadow.sm]}>
      <StatusBar
        barStyle={light ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <View style={headerStyles.row}>
        <View style={headerStyles.left}>
          {onBack ? (
            <TouchableOpacity onPress={onBack} style={headerStyles.backBtn} activeOpacity={0.7}>
              <BackIcon color={textColor} />
            </TouchableOpacity>
          ) : leftAction}
        </View>
        <View style={headerStyles.center}>
          <Text style={[headerStyles.title, { color: textColor }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[headerStyles.subtitle, { color: light ? 'rgba(255,255,255,0.8)' : Colors.gray500 }]}>
              {subtitle}
            </Text>
          )}
        </View>
        <View style={headerStyles.right}>{rightAction}</View>
      </View>
    </View>
  );
};

// ── Gradient-style header for key screens ─────────────────────────────────────
export const GradientHeader: React.FC<{ children: React.ReactNode; style?: object }> = ({ children, style }) => (
  <View style={[gradientStyles.container, style]}>
    <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
    {children}
  </View>
);

// ── Screen wrapper with safe area ─────────────────────────────────────────────
export const Screen: React.FC<{
  children: React.ReactNode;
  style?: object;
  bg?: string;
  edges?: Array<'top' | 'bottom' | 'left' | 'right'>;
}> = ({ children, style, bg = Colors.gray50 }) => (
  <SafeAreaView style={[screenStyles.safe, { backgroundColor: bg }]}>
    <View style={[screenStyles.content, style]}>{children}</View>
  </SafeAreaView>
);

const headerStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0,
    paddingHorizontal: Spacing[4],
    paddingBottom: 12,
    zIndex: 10,
  },
  transparent: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
  },
  left: {
    width: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    width: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: Typography.fontSize.xs,
    marginTop: 1,
  },
  backBtn: {
    padding: 4,
  },
  backIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 20,
    height: 20,
  },
  backArrow: {
    width: 9,
    height: 9,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: '45deg' }],
    marginRight: -2,
  },
  backLine: {
    width: 14,
    height: 2,
    borderRadius: 1,
  },
});

const gradientStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44,
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[5],
  },
});

const screenStyles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
