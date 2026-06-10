import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../design-system/tokens';
import { Card, SectionHeader, KPIWidget } from '../../design-system/components/Card';
import { Badge, statusToVariant } from '../../design-system/components/Badge';
import { Button } from '../../design-system/components/Button';
import { mockLeaves, currentUser } from '../../data/mockData';

const LEAVE_TYPES = [
  { label: 'Annual Leave', iconName: 'sunny-outline' as const, total: currentUser.leaveBalance.annual, used: currentUser.leaveBalance.annual - currentUser.leaveBalance.remaining.annual, color: Colors.primary },
  { label: 'Sick Leave', iconName: 'medical-outline' as const, total: currentUser.leaveBalance.sick, used: currentUser.leaveBalance.sick - currentUser.leaveBalance.remaining.sick, color: Colors.danger },
  { label: 'Casual Leave', iconName: 'cafe-outline' as const, total: currentUser.leaveBalance.casual, used: currentUser.leaveBalance.casual - currentUser.leaveBalance.remaining.casual, color: Colors.accent },
];

export default function LeaveScreen() {
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filtered = filterStatus === 'all' ? mockLeaves : mockLeaves.filter(l => l.status === filterStatus);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <LinearGradient
        colors={['#2563EB', '#1D4ED8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        {/* Title Row */}
        <View style={styles.headerTitleRow}>
          <View style={styles.headerIconBox}>
            <Ionicons name="calendar-outline" size={20} color={Colors.white} />
          </View>
          <Text style={styles.headerTitle}>Leave Management</Text>
        </View>

        {/* Subtitle */}
        <Text style={styles.headerSub}>Manage your leave requests and balances</Text>

        {/* Apply Leave Button */}
        <TouchableOpacity
          style={styles.applyBtn}
          onPress={() => router.push('/leaves/apply')}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={18} color={Colors.primary} />
          <Text style={styles.applyBtnText}>Apply Leave</Text>
        </TouchableOpacity>

        {/* Balance Chips */}
        <View style={styles.chipsRow}>
          {[
            { label: 'Annual', value: currentUser.leaveBalance.remaining.annual },
            { label: 'Sick', value: currentUser.leaveBalance.remaining.sick },
            { label: 'Casual', value: currentUser.leaveBalance.remaining.casual },
          ].map((chip) => (
            <View key={chip.label} style={styles.chip}>
              <Text style={styles.chipValue}>{chip.value}</Text>
              <Text style={styles.chipLabel}>{chip.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Leave Balance Cards */}
        <SectionHeader title="Leave Balance" />
        <View style={styles.balanceRow}>
          {LEAVE_TYPES.map((lt) => {
            const remaining = lt.total - lt.used;
            const pct = (remaining / lt.total) * 100;
            return (
              <View key={lt.label} style={[styles.balanceCard, Shadow.sm]}>
                <View style={[styles.balanceIconBox, { backgroundColor: lt.color + '15' }]}>
                  <Ionicons name={lt.iconName} size={22} color={lt.color} />
                </View>
                <Text style={[styles.balanceValue, { color: lt.color }]}>{remaining}</Text>
                <Text style={styles.balanceLabel}>{lt.label.split(' ')[0]}</Text>
                <Text style={styles.balanceTotal}>of {lt.total} days</Text>
                <View style={styles.balanceTrack}>
                  <View style={[styles.balanceFill, { width: `${pct}%`, backgroundColor: lt.color }]} />
                </View>
              </View>
            );
          })}
        </View>

        {/* Upcoming Leaves */}
        <Card style={{ backgroundColor: Colors.overlayLight }}>
          <View style={styles.upcomingRow}>
            <View style={styles.upcomingTitleRow}>
              <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
              <Text style={styles.upcomingTitle}> Upcoming Leave</Text>
            </View>
            <Badge label="Pending" variant="warning" />
          </View>
          <Text style={styles.upcomingDates}>Jun 10 – Jun 12, 2025 (3 days)</Text>
          <Text style={styles.upcomingReason}>Family vacation — Annual Leave</Text>
        </Card>

        {/* Filter Tabs */}
        <SectionHeader title="Leave History" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {(['all', 'pending', 'approved', 'rejected'] as const).map(status => (
            <TouchableOpacity
              key={status}
              style={[styles.filterTab, filterStatus === status && styles.filterTabActive]}
              onPress={() => setFilterStatus(status)}
            >
              <Text style={[styles.filterText, filterStatus === status && styles.filterTextActive]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Leave List */}
        {filtered.map(leave => (
          <Card key={leave.id} onPress={() => router.push('/leaves/apply')}>
            <View style={styles.leaveHeader}>
              <View style={styles.leaveIconBox}>
                <Ionicons
                  name={leave.type.includes('Sick') ? 'medical-outline' : leave.type.includes('Casual') ? 'cafe-outline' : 'sunny-outline'}
                  size={20} color={Colors.primary}
                />
              </View>
              <View style={styles.leaveInfo}>
                <Text style={styles.leaveType}>{leave.type}</Text>
                <Text style={styles.leaveDates}>
                  {new Date(leave.from).toLocaleDateString('en', { month: 'short', day: 'numeric' })} –{' '}
                  {new Date(leave.to).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
                </Text>
                <Text style={styles.leaveDays}>{leave.days} day{leave.days > 1 ? 's' : ''}</Text>
              </View>
              <Badge label={leave.status} variant={statusToVariant[leave.status] || 'neutral'} />
            </View>
            <View style={styles.leaveReason}>
              <Text style={styles.leaveReasonLabel}>Reason: </Text>
              <Text style={styles.leaveReasonText}>{leave.reason}</Text>
            </View>
            <Text style={styles.leaveApplied}>Applied on: {leave.appliedOn}</Text>
          </Card>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },

  header: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 56,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  headerIconBox: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: Typography.fontSize.xs,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 14,
    marginLeft: 46,
  },
  applyBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.white, borderRadius: Radius.full,
    paddingHorizontal: 20, height: 48,
    gap: 6, ...Shadow.md, marginBottom: 16,
  },
  applyBtnText: { fontSize: Typography.fontSize.sm, fontWeight: '700', color: Colors.primary },
  chipsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  chip: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  chipValue: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '800',
    color: Colors.white,
    lineHeight: 22,
  },
  chipLabel: {
    fontSize: Typography.fontSize.xs,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
    marginTop: 1,
  },

  scroll: { flex: 1 },
  scrollContent: { padding: Spacing[4] },

  balanceRow: { flexDirection: 'row', gap: Spacing[3], marginBottom: Spacing[4] },
  balanceCard: {
    flex: 1, backgroundColor: Colors.white,
    borderRadius: Radius.lg, padding: Spacing[3],
    alignItems: 'center',
  },
  balanceIconBox: { width: 42, height: 42, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  balanceValue: { fontSize: Typography.fontSize['2xl'], fontWeight: '800' },
  balanceLabel: { fontSize: Typography.fontSize.xs, color: Colors.gray700, fontWeight: '600', marginTop: 2 },
  balanceTotal: { fontSize: Typography.fontSize.xs, color: Colors.gray400, marginBottom: 8 },
  balanceTrack: { width: '100%', height: 4, backgroundColor: Colors.gray200, borderRadius: 2, overflow: 'hidden' },
  balanceFill: { height: 4, borderRadius: 2 },

  upcomingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  upcomingTitleRow: { flexDirection: 'row', alignItems: 'center' },
  upcomingTitle: { fontSize: Typography.fontSize.base, fontWeight: '700', color: Colors.primary },
  upcomingDates: { fontSize: Typography.fontSize.sm, fontWeight: '600', color: Colors.gray900, marginBottom: 4 },
  upcomingReason: { fontSize: Typography.fontSize.xs, color: Colors.gray500 },

  filterRow: { marginBottom: Spacing[3] },
  filterTab: {
    paddingHorizontal: 16, paddingVertical: 7,
    borderRadius: Radius.full, marginRight: 8,
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.gray200,
  },
  filterTabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: Typography.fontSize.sm, color: Colors.gray600, fontWeight: '600' },
  filterTextActive: { color: Colors.white },

  leaveHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  leaveIconBox: {
    width: 40, height: 40, borderRadius: Radius.md,
    backgroundColor: Colors.overlayLight, alignItems: 'center',
    justifyContent: 'center', marginRight: 12,
  },

  leaveInfo: { flex: 1 },
  leaveType: { fontSize: Typography.fontSize.base, fontWeight: '700', color: Colors.gray900 },
  leaveDates: { fontSize: Typography.fontSize.xs, color: Colors.gray500, marginTop: 2 },
  leaveDays: { fontSize: Typography.fontSize.xs, color: Colors.primary, fontWeight: '600', marginTop: 1 },
  leaveReason: { flexDirection: 'row', marginBottom: 4 },
  leaveReasonLabel: { fontSize: Typography.fontSize.xs, color: Colors.gray500 },
  leaveReasonText: { flex: 1, fontSize: Typography.fontSize.xs, color: Colors.gray700 },
  leaveApplied: { fontSize: Typography.fontSize.xs, color: Colors.gray400 },
});
