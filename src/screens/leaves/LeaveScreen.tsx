import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow, IconBox } from '../../design-system/tokens';
import { SectionHeader } from '../../design-system/components/Card';
import { Badge, statusToVariant } from '../../design-system/components/Badge';
import { mockLeaves, currentUser } from '../../data/mockData';

// ── Circular Progress Ring ────────────────────────────────────────────────────
function RingProgress({ value, total, color, size = 64 }: { value: number; total: number; color: string; size?: number }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const progress = total > 0 ? (value / total) * circ : 0;
  return (
    <Svg width={size} height={size}>
      <Circle cx={size / 2} cy={size / 2} r={r} stroke={color + '22'} strokeWidth={7} fill="none" />
      <Circle
        cx={size / 2} cy={size / 2} r={r}
        stroke={color} strokeWidth={7} fill="none"
        strokeDasharray={`${progress} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90, ${size / 2}, ${size / 2})`}
      />
    </Svg>
  );
}

// ── Leave type config ─────────────────────────────────────────────────────────
const LEAVE_TYPES = [
  {
    label: 'Annual', icon: 'sunny-outline' as const,
    total: currentUser.leaveBalance.annual,
    remaining: currentUser.leaveBalance.remaining.annual,
    color: Colors.primary,
  },
  {
    label: 'Sick', icon: 'medical-outline' as const,
    total: currentUser.leaveBalance.sick,
    remaining: currentUser.leaveBalance.remaining.sick,
    color: Colors.danger,
  },
  {
    label: 'Casual', icon: 'cafe-outline' as const,
    total: currentUser.leaveBalance.casual,
    remaining: currentUser.leaveBalance.remaining.casual,
    color: Colors.accent,
  },
];

const LEAVE_ICON: Record<string, 'medical-outline' | 'cafe-outline' | 'sunny-outline'> = {
  'Sick Leave': 'medical-outline',
  'Casual Leave': 'cafe-outline',
};

const FILTERS = ['all', 'pending', 'approved', 'rejected'] as const;

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en', { month: 'short', day: 'numeric' });
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function LeaveScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<typeof FILTERS[number]>('all');

  const filtered = filter === 'all' ? mockLeaves : mockLeaves.filter(l => l.status === filter);

  const totalRemaining =
    currentUser.leaveBalance.remaining.annual +
    currentUser.leaveBalance.remaining.sick +
    currentUser.leaveBalance.remaining.casual;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── Header ── */}
      <LinearGradient colors={['#56CCF2', '#4DA8DA', '#2E86B5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        {/* decorative blobs */}
        <View style={styles.blobTopRight} />
        <View style={styles.blobBottomLeft} />

        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerEyebrow}>LEAVE MANAGEMENT</Text>
            <Text style={styles.headerTitle}>My Leaves</Text>
          </View>
          <TouchableOpacity style={styles.applyBtn} onPress={() => router.push('/leaves/apply')} activeOpacity={0.85}>
            <Ionicons name="add" size={16} color={Colors.primary} />
            <Text style={styles.applyBtnText}>Apply</Text>
          </TouchableOpacity>
        </View>

        {/* Balance summary strip */}
        <View style={styles.summaryStrip}>
          <View style={styles.summaryMain}>
            <Text style={styles.summaryValue}>{totalRemaining}</Text>
            <Text style={styles.summaryLabel}>Days Available</Text>
          </View>
          <View style={styles.summaryDivider} />
          {LEAVE_TYPES.map(lt => (
            <View key={lt.label} style={styles.summaryItem}>
              <View style={styles.summaryItemDot}>
                <View style={[styles.summaryDot, { backgroundColor: Colors.white }]} />
              </View>
              <Text style={styles.summaryItemValue}>{lt.remaining}</Text>
              <Text style={styles.summaryItemLabel}>{lt.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── Balance Cards ── */}
        <SectionHeader title="Leave Balance" />
        <View style={styles.balanceRow}>
          {LEAVE_TYPES.map(lt => (
            <View key={lt.label} style={[styles.balanceCard, Shadow.sm]}>
              <View style={styles.ringWrap}>
                <RingProgress value={lt.remaining} total={lt.total} color={lt.color} size={62} />
                <View style={styles.ringCenter}>
                  <Ionicons name={lt.icon} size={16} color={lt.color} />
                </View>
              </View>
              <Text style={[styles.balanceValue, { color: lt.color }]}>{lt.remaining}</Text>
              <Text style={styles.balanceLabel}>{lt.label}</Text>
              <Text style={styles.balanceOf}>{lt.total - lt.remaining} used</Text>
            </View>
          ))}
        </View>

        {/* ── Upcoming Leave ── */}
        <View style={[styles.upcomingCard, Shadow.sm]}>
          <View style={[styles.upcomingAccent, { backgroundColor: Colors.warning }]} />
          <View style={styles.upcomingBody}>
            <View style={styles.upcomingTop}>
              <View style={styles.upcomingIconWrap}>
                <Ionicons name="calendar" size={16} color={Colors.warning} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.upcomingType}>Upcoming Leave</Text>
                <Text style={styles.upcomingDates}>Jun 10 – Jun 12, 2025</Text>
              </View>
              <Badge label="Pending" variant="warning" dot />
            </View>
            <View style={styles.upcomingMeta}>
              <View style={styles.metaPill}>
                <Ionicons name="sunny-outline" size={11} color={Colors.primary} />
                <Text style={styles.metaPillText}>Annual Leave</Text>
              </View>
              <View style={styles.metaPill}>
                <Ionicons name="time-outline" size={11} color={Colors.gray500} />
                <Text style={styles.metaPillText}>3 days</Text>
              </View>
              <View style={styles.metaPill}>
                <Ionicons name="person-outline" size={11} color={Colors.gray500} />
                <Text style={styles.metaPillText}>Family vacation</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── History ── */}
        <SectionHeader title="Leave History" />

        {/* Filter Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterTab, filter === f && styles.filterTabActive]}
              onPress={() => setFilter(f)}
            >
              {filter === f && <View style={styles.filterDot} />}
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Leave Cards */}
        {filtered.map(leave => {
          const iconName = LEAVE_ICON[leave.type] ?? 'sunny-outline';
          const variant = statusToVariant[leave.status] ?? 'neutral';
          const accentColor =
            leave.status === 'approved' ? Colors.success :
            leave.status === 'rejected' ? Colors.danger : Colors.warning;
          return (
            <TouchableOpacity key={leave.id} style={[styles.leaveCard, Shadow.sm]} onPress={() => router.push('/leaves/apply')} activeOpacity={0.85}>
              <View style={[styles.leaveAccent, { backgroundColor: accentColor }]} />
              <View style={styles.leaveBody}>
                <View style={styles.leaveTop}>
                  <View style={styles.leaveIconBox}>
                    <Ionicons name={iconName} size={18} color={accentColor} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.leaveType}>{leave.type}</Text>
                    <Text style={styles.leaveReason} numberOfLines={1}>{leave.reason}</Text>
                  </View>
                  <Badge label={leave.status} variant={variant} dot />
                </View>

                <View style={styles.leaveMeta}>
                  <View style={styles.leaveDatePill}>
                    <Ionicons name="calendar-outline" size={11} color={Colors.primary} />
                    <Text style={styles.leaveDateText}>{fmt(leave.from)} – {fmt(leave.to)}</Text>
                  </View>
                  <View style={[styles.leaveDayPill, { backgroundColor: accentColor + '15' }]}>
                    <Text style={[styles.leaveDayText, { color: accentColor }]}>{leave.days}d</Text>
                  </View>
                </View>

                <Text style={styles.leaveApplied}>Applied {leave.appliedOn}</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 110 }} />
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  // Header
  header: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 12 : 58,
    paddingHorizontal: 20,
    paddingBottom: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  blobTopRight: {
    position: 'absolute', top: -40, right: -40,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  blobBottomLeft: {
    position: 'absolute', bottom: -30, left: -30,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  headerTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 },
  headerEyebrow: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.6)', letterSpacing: 1.5, marginBottom: 3 },
  headerTitle: { fontSize: Typography.fontSize['2xl'], fontWeight: '800', color: Colors.white, letterSpacing: -0.5 },
  applyBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.white, borderRadius: Radius.full,
    paddingHorizontal: 16, paddingVertical: 10, ...Shadow.md,
  },
  applyBtnText: { fontSize: Typography.fontSize.sm, fontWeight: '700', color: Colors.primary },

  // Summary strip
  summaryStrip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: Radius.lg, paddingVertical: 14, paddingHorizontal: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)',
    gap: 0,
  },
  summaryMain: { alignItems: 'center', marginRight: 16 },
  summaryValue: { fontSize: Typography.fontSize['2xl'], fontWeight: '800', color: Colors.white, lineHeight: 28 },
  summaryLabel: { fontSize: 10, color: 'rgba(255,255,255,0.75)', textAlign: 'center', marginTop: 2, fontWeight: '500' },
  summaryDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.3)', marginRight: 16 },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryItemDot: { marginBottom: 3 },
  summaryDot: { width: 5, height: 5, borderRadius: 3 },
  summaryItemValue: { fontSize: Typography.fontSize.lg, fontWeight: '800', color: Colors.white, lineHeight: 22 },
  summaryItemLabel: { fontSize: 10, color: 'rgba(255,255,255,0.75)', marginTop: 2, fontWeight: '600' },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },

  // Balance Cards
  balanceRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  balanceCard: {
    flex: 1, backgroundColor: Colors.white,
    borderRadius: Radius.lg, paddingVertical: 16,
    alignItems: 'center',
  },
  ringWrap: { position: 'relative', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  ringCenter: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  balanceValue: { fontSize: Typography.fontSize.xl, fontWeight: '800', lineHeight: 24 },
  balanceLabel: { fontSize: Typography.fontSize.xs, color: Colors.gray700, fontWeight: '600', marginTop: 2 },
  balanceOf: { fontSize: 10, color: Colors.gray400, marginTop: 1 },

  // Upcoming Card
  upcomingCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    marginBottom: 16,
    overflow: 'hidden',
  },
  upcomingAccent: { width: 4 },
  upcomingBody: { flex: 1, padding: 14 },
  upcomingTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  upcomingIconWrap: {
    width: IconBox.sizeSmall, height: IconBox.sizeSmall, borderRadius: IconBox.radius,
    backgroundColor: IconBox.bg, alignItems: 'center', justifyContent: 'center',
    ...IconBox.shadow as any,
  },
  upcomingType: { fontSize: Typography.fontSize.sm, fontWeight: '700', color: Colors.gray900 },
  upcomingDates: { fontSize: Typography.fontSize.xs, color: Colors.gray500, marginTop: 1 },
  upcomingMeta: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  metaPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.gray100, borderRadius: Radius.full,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  metaPillText: { fontSize: 10, color: Colors.gray600, fontWeight: '500' },

  // Filter
  filterRow: { marginBottom: 12 },
  filterTab: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: Radius.full, marginRight: 8,
    backgroundColor: Colors.white,
    borderWidth: 1, borderColor: Colors.gray200,
  },
  filterTabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.8)' },
  filterText: { fontSize: Typography.fontSize.sm, color: Colors.gray600, fontWeight: '600' },
  filterTextActive: { color: Colors.white },

  // Leave Card
  leaveCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg, marginBottom: 10,
    overflow: 'hidden',
  },
  leaveAccent: { width: 4 },
  leaveBody: { flex: 1, padding: 14 },
  leaveTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  leaveIconBox: { width: IconBox.sizeSmall, height: IconBox.sizeSmall, borderRadius: IconBox.radius, backgroundColor: IconBox.bg, alignItems: 'center', justifyContent: 'center', ...IconBox.shadow as any },
  leaveType: { fontSize: Typography.fontSize.base, fontWeight: '700', color: Colors.gray900 },
  leaveReason: { fontSize: Typography.fontSize.xs, color: Colors.gray400, marginTop: 1 },
  leaveMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  leaveDatePill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.overlayLight, borderRadius: Radius.full,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  leaveDateText: { fontSize: 10, color: Colors.primary, fontWeight: '600' },
  leaveDayPill: { borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  leaveDayText: { fontSize: 10, fontWeight: '700' },
  leaveApplied: { fontSize: 10, color: Colors.gray400 },
});
