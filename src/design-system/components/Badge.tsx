import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Radius, Spacing } from '../tokens';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  style?: object;
}

const variantConfig: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  success:  { bg: Colors.successLight, text: Colors.successDark, dot: Colors.success },
  warning:  { bg: Colors.warningLight, text: Colors.warningDark, dot: Colors.warning },
  danger:   { bg: Colors.dangerLight,  text: Colors.dangerDark,  dot: Colors.danger },
  info:     { bg: Colors.infoLight,    text: Colors.info,        dot: Colors.info },
  primary:  { bg: Colors.overlayLight, text: Colors.primary,     dot: Colors.primary },
  neutral:  { bg: Colors.gray100,      text: Colors.gray600,     dot: Colors.gray500 },
};

export const statusToVariant: Record<string, BadgeVariant> = {
  active: 'success', present: 'success', approved: 'success', paid: 'success', completed: 'success', won: 'success',
  pending: 'warning', 'in-progress': 'info', 'on-hold': 'warning', negotiation: 'warning', proposal: 'info', qualified: 'primary',
  absent: 'danger', rejected: 'danger', overdue: 'danger', lost: 'danger',
  late: 'warning', weekend: 'neutral', draft: 'neutral', todo: 'neutral', new: 'info', working: 'success',
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'sm',
  dot = false,
  style,
}) => {
  const config = variantConfig[variant];
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: config.bg },
        isSmall ? styles.sm : styles.md,
        style,
      ]}
    >
      {dot && (
        <View style={[styles.dot, { backgroundColor: config.dot }]} />
      )}
      <Text style={[styles.text, { color: config.text }, isSmall ? styles.textSm : styles.textMd]}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: Radius.full,
  },
  sm: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  md: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  textSm: { fontSize: 10 },
  textMd: { fontSize: 12 },
});
