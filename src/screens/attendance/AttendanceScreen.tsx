import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, StatusBar, FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../design-system/tokens';
import { Card, SectionHeader, ProgressBar, KPIWidget } from '../../design-system/components/Card';
import { Badge, statusToVariant } from '../../design-system/components/Badge';
import { Button } from '../../design-system/components/Button';
import { ScreenHeader } from '../../design-system/components/Header';
import { mockAttendance, currentUser } from '../../data/mockData';

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function AttendanceScreen() {
  const router = useRouter();
  const [checkedIn, setCheckedIn] = useState(true);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Gradient Header */}
      <View style={styles.header}>
        <View style={styles.headerBg} />
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Attendance</Text>
          <TouchableOpacity onPress={() => router.push('/attendance/calendar')}>
            <Ionicons name="calendar-outline" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.checkWidget}>
          <View style={styles.checkStatus}>
            <View style={[styles.statusDot, { backgroundColor: checkedIn ? Colors.success : Colors.gray400 }]} />
            <Text style={styles.statusText}>{checkedIn ? 'Currently Working' : 'Not Checked In'}</Text>
          </View>
          <TouchableOpacity
            style={[styles.mainCheckBtn, { backgroundColor: checkedIn ? Colors.danger : Colors.success }]}
            onPress={() => setCheckedIn(!checkedIn)} activeOpacity={0.85}
          >
            <Ionicons name={checkedIn ? 'log-out-outline' : 'log-in-outline'} size={22} color={Colors.white} />
            <Text style={styles.mainCheckText}>{checkedIn ? 'Check Out' : 'Check In'}</Text>
          </TouchableOpacity>
        </View>

        {/* Today Stats */}
        <View style={styles.todayStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>09:18</Text>
            <Text style={styles.statLabel}>Check In</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.warningLight }]}>--:--</Text>
            <Text style={styles.statLabel}>Check Out</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>00:52</Text>
            <Text style={styles.statLabel}>Working</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Week Overview */}
        <Card>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.weekRow}>
            {WEEK_DAYS.map((day, i) => {
              const status = i === 0 ? 'active' : i === 5 || i === 6 ? 'weekend' : i === 4 ? 'absent' : 'present';
              const color = status === 'present' ? Colors.success : status === 'active' ? Colors.primary : status === 'absent' ? Colors.danger : Colors.gray300;
              return (
                <View key={i} style={styles.weekDay}>
                  <Text style={styles.weekDayLabel}>{day}</Text>
                  <View style={[styles.weekDayDot, { backgroundColor: color }]}>
                    {status === 'active' && <View style={styles.weekDayPulse} />}
                  </View>
                </View>
              );
            })}
          </View>
          <View style={styles.weekLegend}>
            {[['Present', Colors.success], ['Active', Colors.primary], ['Absent', Colors.danger], ['Weekend', Colors.gray300]].map(([label, color]) => (
              <View key={label} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: color as string }]} />
                <Text style={styles.legendText}>{label}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Monthly KPIs */}
        <SectionHeader title="June 2025" />
        <View style={styles.kpiRow}>
          <KPIWidget label="Present" value="18" icon={<Ionicons name="checkmark-circle-outline" size={18} color={Colors.success} />} iconBg={Colors.successLight} />
          <KPIWidget label="Absent" value="1" icon={<Ionicons name="close-circle-outline" size={18} color={Colors.danger} />} iconBg={Colors.dangerLight} />
          <KPIWidget label="Late" value="2" icon={<Ionicons name="alarm-outline" size={18} color={Colors.warning} />} iconBg={Colors.warningLight} />
          <KPIWidget label="WFH" value="3" icon={<Ionicons name="home-outline" size={18} color={Colors.accent} />} iconBg={Colors.infoLight} />
        </View>

        {/* Working Hours Card */}
        <Card>
          <SectionHeader title="Avg. Working Hours" />
          {[
            { label: 'Today', hours: '00:52', max: 9, done: 0.1 },
            { label: 'This Week', hours: '42:15', max: 45, done: 93.9 },
            { label: 'This Month', hours: '156:30', max: 180, done: 87 },
          ].map(({ label, hours, done }) => (
            <View key={label} style={styles.hoursRow}>
              <View style={styles.hoursInfo}>
                <Text style={styles.hoursLabel}>{label}</Text>
                <Text style={styles.hoursValue}>{hours}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <ProgressBar progress={done} color={done > 80 ? Colors.success : Colors.warning} />
              </View>
            </View>
          ))}
        </Card>

        {/* Attendance History */}
        <SectionHeader title="Recent History" actionLabel="View All" onAction={() => router.push('/attendance/history')} />
        {mockAttendance.slice(0, 5).map((record, i) => (
          <Card key={i} onPress={() => router.push('/attendance/history')}>
            <View style={styles.historyRow}>
              <View style={styles.historyDate}>
                <Text style={styles.historyDateNum}>{record.date.split('-')[2]}</Text>
                <Text style={styles.historyDateMonth}>
                  {new Date(record.date).toLocaleDateString('en', { month: 'short' })}
                </Text>
              </View>
              <View style={styles.historyInfo}>
                <View style={styles.historyTimeRow}>
                  <View style={styles.historyTimeItem}>
                    <Ionicons name="arrow-up-circle-outline" size={13} color={Colors.success} />
                    <Text style={styles.historyTime}> {record.checkIn}</Text>
                  </View>
                  <View style={styles.historyTimeItem}>
                    <Ionicons name="arrow-down-circle-outline" size={13} color={Colors.danger} />
                    <Text style={styles.historyTime}> {record.checkOut}</Text>
                  </View>
                </View>
                <View style={styles.historyMeta}>
                  <View style={styles.historyTimeItem}>
                    <Ionicons name="time-outline" size={12} color={Colors.gray500} />
                    <Text style={styles.historyHours}> {record.hours}</Text>
                  </View>
                  <View style={styles.historyTimeItem}>
                    <Ionicons name="location-outline" size={12} color={Colors.gray500} />
                    <Text style={styles.historyLocation}> {record.location}</Text>
                  </View>
                </View>
              </View>
              <Badge label={record.status} variant={statusToVariant[record.status] || 'neutral'} />
            </View>
          </Card>
        ))}

        {/* Regularization CTA */}
        <Card style={{ backgroundColor: Colors.overlayLight }}>
          <View style={styles.regularRow}>
            <View>
              <Text style={styles.regularTitle}>Missing Attendance?</Text>
              <Text style={styles.regularSub}>Submit a regularization request</Text>
            </View>
            <Button title="Apply" variant="primary" size="sm" onPress={() => {}} />
          </View>
        </Card>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },

  header: {
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 52,
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[4],
    overflow: 'hidden',
  },
  headerBg: {
    position: 'absolute', width: 260, height: 260, borderRadius: 130,
    backgroundColor: 'rgba(96,165,250,0.12)', top: -80, right: -50,
  },
  headerTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: Spacing[3],
  },
  headerTitle: { fontSize: Typography.fontSize.lg, fontWeight: '800', color: Colors.white, letterSpacing: -0.3 },

  checkWidget: { alignItems: 'center', marginBottom: Spacing[4] },
  checkStatus: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  statusText: { fontSize: Typography.fontSize.sm, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },

  mainCheckBtn: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 36, paddingVertical: 15,
    borderRadius: Radius.full, gap: 8, ...Shadow.md,
    minHeight: 52,
  },
  mainCheckText: { fontSize: Typography.fontSize.base, fontWeight: '700', color: Colors.white },

  todayStats: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: Radius.lg, paddingVertical: 12 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: Typography.fontSize.lg, fontWeight: '700', color: Colors.white },
  statLabel: { fontSize: Typography.fontSize.xs, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },

  scroll: { flex: 1 },
  scrollContent: { padding: Spacing[4] },

  sectionTitle: { fontSize: Typography.fontSize.base, fontWeight: '700', color: Colors.gray900, marginBottom: 16 },

  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  weekDay: { alignItems: 'center', gap: 8 },
  weekDayLabel: { fontSize: Typography.fontSize.xs, color: Colors.gray500, fontWeight: '600' },
  weekDayDot: { width: 32, height: 32, borderRadius: 16, position: 'relative' },
  weekDayPulse: {
    position: 'absolute', top: -3, left: -3, right: -3, bottom: -3,
    borderRadius: 20, borderWidth: 2, borderColor: Colors.primary + '60',
  },
  weekLegend: { flexDirection: 'row', justifyContent: 'space-around' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: Typography.fontSize.xs, color: Colors.gray500 },

  kpiRow: { flexDirection: 'row', marginBottom: Spacing[3] },

  hoursRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  hoursInfo: { width: 110 },
  hoursLabel: { fontSize: Typography.fontSize.xs, color: Colors.gray500, marginBottom: 2 },
  hoursValue: { fontSize: Typography.fontSize.sm, fontWeight: '700', color: Colors.gray900 },

  historyRow: { flexDirection: 'row', alignItems: 'center' },
  historyDate: {
    width: 44, height: 44, borderRadius: Radius.md,
    backgroundColor: Colors.overlayLight, alignItems: 'center',
    justifyContent: 'center', marginRight: 12,
  },
  historyDateNum: { fontSize: Typography.fontSize.md, fontWeight: '700', color: Colors.primary },
  historyDateMonth: { fontSize: Typography.fontSize.xs, color: Colors.primary },
  historyInfo: { flex: 1 },
  historyTimeRow: { flexDirection: 'row', gap: 12, marginBottom: 4 },
  historyTimeItem: { flexDirection: 'row', alignItems: 'center' },
  historyTime: { fontSize: Typography.fontSize.xs, color: Colors.gray700, fontWeight: '600' },
  historyMeta: { flexDirection: 'row', gap: 12 },
  historyHours: { fontSize: Typography.fontSize.xs, color: Colors.gray500 },
  historyLocation: { fontSize: Typography.fontSize.xs, color: Colors.gray500 },

  regularRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  regularTitle: { fontSize: Typography.fontSize.base, fontWeight: '700', color: Colors.primary },
  regularSub: { fontSize: Typography.fontSize.xs, color: Colors.gray600, marginTop: 2 },
});
