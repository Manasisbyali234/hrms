import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Radius, Shadow, Spacing } from '../tokens';

interface CardProps {
  children: React.ReactNode;
  style?: object;
  onPress?: () => void;
  elevated?: boolean;
  padding?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  elevated = false,
  padding = Spacing[4],
}) => {
  const content = (
    <View style={[styles.card, elevated ? Shadow.md : Shadow.sm, { padding }, style]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
};

// ── KPI Widget ───────────────────────────────────────────────────────────────
interface KPIWidgetProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg?: string;
  sub?: string;
  onPress?: () => void;
  style?: object;
}

export const KPIWidget: React.FC<KPIWidgetProps> = ({
  label, value, icon, iconBg = Colors.overlayLight, sub, onPress, style,
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={[styles.kpiCard, Shadow.sm, !style && { flex: 1 }, style]}>
    <View style={[styles.kpiIcon, { backgroundColor: iconBg }]}>{icon}</View>
    <View style={styles.kpiText}>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiLabel} numberOfLines={1}>{label}</Text>
      {sub && <Text style={styles.kpiSub}>{sub}</Text>}
    </View>
  </TouchableOpacity>
);

// ── Section Header ────────────────────────────────────────────────────────────
interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, actionLabel, onAction }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {actionLabel && (
      <TouchableOpacity onPress={onAction}>
        <Text style={styles.sectionAction}>{actionLabel}</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ── Divider ───────────────────────────────────────────────────────────────────
export const Divider: React.FC<{ style?: object }> = ({ style }) => (
  <View style={[styles.divider, style]} />
);

// ── ProgressBar ───────────────────────────────────────────────────────────────
interface ProgressBarProps {
  progress: number; // 0–100
  color?: string;
  height?: number;
  style?: object;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = Colors.primary,
  height = 6,
  style,
  showLabel = false,
}) => (
  <View style={style}>
    {showLabel && (
      <Text style={styles.progressLabel}>{progress}%</Text>
    )}
    <View style={[styles.progressTrack, { height }]}>
      <View
        style={[
          styles.progressFill,
          { width: `${Math.min(100, Math.max(0, progress))}%`, backgroundColor: color, height },
        ]}
      />
    </View>
  </View>
);

// ── Empty State ───────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, subtitle, action }) => (
  <View style={styles.emptyState}>
    {icon && <View style={styles.emptyIcon}>{icon}</View>}
    <Text style={styles.emptyTitle}>{title}</Text>
    {subtitle && <Text style={styles.emptySub}>{subtitle}</Text>}
    {action && <View style={{ marginTop: 20 }}>{action}</View>}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    marginBottom: Spacing[3],
    borderWidth: 1,
    borderColor: Colors.gray100,
  },
  kpiCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    margin: 4,
    borderWidth: 1,
    borderColor: Colors.gray100,
    gap: 10,
  },
  kpiIcon: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  kpiText: {
    flex: 1,
  },
  kpiValue: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '800',
    color: Colors.gray900,
    lineHeight: 22,
  },
  kpiLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.gray500,
    marginTop: 2,
  },
  kpiSub: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary,
    marginTop: 1,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[3],
    marginTop: Spacing[2],
  },
  sectionTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    color: Colors.gray900,
  },
  sectionAction: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray100,
    marginVertical: Spacing[2],
  },
  progressTrack: {
    backgroundColor: Colors.gray200,
    borderRadius: Radius.full,
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    borderRadius: Radius.full,
  },
  progressLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.gray600,
    textAlign: 'right',
    marginBottom: 4,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    marginBottom: 20,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.gray700,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySub: {
    fontSize: Typography.fontSize.base,
    color: Colors.gray500,
    textAlign: 'center',
    lineHeight: 22,
  },
});
