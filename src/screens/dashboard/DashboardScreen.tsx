import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, Animated, Platform, StatusBar, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius, Shadow, IconBox } from '../../design-system/tokens';
import { Avatar } from '../../design-system/components/Avatar';
import { Badge, statusToVariant } from '../../design-system/components/Badge';
import { ProgressBar } from '../../design-system/components/Card';
import { currentUser, mockTasks, mockProjects, mockNotifications, mockAttendance, mockAnnouncements } from '../../data/mockData';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = (SCREEN_W - 16 * 2 - 10) / 2;

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const QUICK_ACTIONS = [
  { icon: 'time-outline' as const,        label: 'Check In',      color: '#34D399', route: '/(tabs)/attendance' },
  { icon: 'calendar-outline' as const,    label: 'Apply Leave',   color: '#FBBF24', route: '/leaves/apply' },
  { icon: 'receipt-outline' as const,     label: 'Expense',       color: '#4DA8DA', route: '/expenses' },
  { icon: 'people-outline' as const,      label: 'Directory',     color: '#56CCF2', route: '/employees' },
  { icon: 'bar-chart-outline' as const,   label: 'Payroll',       color: '#F87171', route: '/payroll' },
  { icon: 'chatbubbles-outline' as const, label: 'Chat',          color: '#2E86B5', route: '/(tabs)/chat' },
  { icon: 'person-add-outline' as const,  label: 'Add Lead',      color: '#34D399', route: '/leads/add' },
  { icon: 'megaphone-outline' as const,   label: 'Announcements', color: '#FF4D6D', route: '/announcements' },
];

const STATS = (pendingTasks: number, activeProjects: number, leaveBalance: number, attendance: string) => [
  { label: 'Pending Tasks',    value: pendingTasks,    icon: 'list-circle-outline' as const,  color: '#4DA8DA', route: '/(tabs)/tasks' },
  { label: 'Active Projects',  value: activeProjects,  icon: 'folder-open-outline' as const,  color: '#2E86B5', route: '/projects' },
  { label: 'Leave Balance',    value: leaveBalance,    icon: 'umbrella-outline' as const,     color: '#34D399', route: '/(tabs)/leaves' },
  { label: 'Attendance',       value: attendance,      icon: 'pulse-outline' as const,        color: '#FBBF24', route: '/(tabs)/attendance' },
];

function useElapsedTimer() {
  const [elapsed, setElapsed] = useState(52 * 60 + 47);
  useEffect(() => {
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function DashboardScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [checkedIn, setCheckedIn] = useState(true);
  const elapsedTime = useElapsedTimer();
  const scrollViewRef = useRef<ScrollView>(null);
  const onRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1200); };
  const unreadCount = mockNotifications.filter(n => !n.read).length;
  const today = mockAttendance[0];
  const pendingTasks = mockTasks.filter(t => t.status !== 'completed').length;
  const activeProjects = mockProjects.filter(p => p.status === 'active').length;
  const stats = STATS(pendingTasks, activeProjects, currentUser.leaveBalance.remaining.annual, '96%');

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── Header ── */}
      <LinearGradient colors={['#56CCF2', '#4DA8DA', '#2E86B5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.header}>
        {/* decorative circles */}
        <View style={s.hCircle1} />
        <View style={s.hCircle2} />
        <View style={s.hRow}>
          <View style={s.hLeft}>
            <Text style={s.hGreeting}>{getGreeting()} 👋</Text>
            <Text style={s.hName}>{currentUser.firstName}</Text>
            <Text style={s.hRole}>{currentUser.designation}</Text>
          </View>
          <View style={s.hRight}>
            <TouchableOpacity style={s.notifBtn} onPress={() => router.push('/notifications')}>
              <Ionicons name="notifications-outline" size={22} color="#fff" />
              {unreadCount > 0 && (
                <View style={s.notifDot}><Text style={s.notifDotTxt}>{unreadCount}</Text></View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/profile')} style={s.avatarWrap}>
              <Avatar name={currentUser.name} initials={currentUser.initials} size={42} />
              <View style={s.avatarOnline} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Attendance strip inside header */}
        <View style={s.attStrip}>
          <View style={s.attSlot}>
            <Ionicons name="log-in-outline" size={14} color="rgba(255,255,255,0.7)" />
            <Text style={s.attSlotLabel}>CHECK IN</Text>
            <Text style={s.attSlotVal}>{today.checkIn}</Text>
          </View>
          <View style={s.attDivider} />
          <View style={s.attSlot}>
            <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.7)" />
            <Text style={s.attSlotLabel}>WORKING</Text>
            <Text style={s.attSlotVal}>{elapsedTime.slice(0, 5)}</Text>
          </View>
          <View style={s.attDivider} />
          <View style={s.attSlot}>
            <Ionicons name="log-out-outline" size={14} color="rgba(255,255,255,0.7)" />
            <Text style={s.attSlotLabel}>CHECK OUT</Text>
            <Text style={[s.attSlotVal, { color: '#FCD34D' }]}>{today.checkOut}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* ── Body ── */}
      <ScrollView
        ref={scrollViewRef as any}
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >

        {/* Attendance Card */}
        <View style={s.attCard}>
          <View style={s.attCardStatus}>
            <View style={[s.attCardDot, { backgroundColor: checkedIn ? '#34D399' : '#9CA3AF' }]} />
            <Text style={s.attCardStatusTxt}>{checkedIn ? 'Currently Working' : 'Not Checked In'}</Text>
          </View>
          <TouchableOpacity
            style={[s.attCardBtn, { backgroundColor: checkedIn ? '#F87171' : '#34D399' }]}
            onPress={() => setCheckedIn(!checkedIn)}
            activeOpacity={0.85}
          >
            <Ionicons name={checkedIn ? 'log-out-outline' : 'log-in-outline'} size={16} color="#fff" />
            <Text style={s.attCardBtnTxt}>{checkedIn ? 'Check Out' : 'Check In'}</Text>
          </TouchableOpacity>

          {/* Week row */}
          <Text style={s.attCardWeekTitle}>This Week</Text>
          <View style={s.attCardWeekRow}>
            {WEEK_DAYS.map((day, i) => {
              const status = i === 0 ? 'active' : i === 5 || i === 6 ? 'weekend' : i === 4 ? 'absent' : 'present';
              const color = status === 'present' ? '#34D399' : status === 'active' ? '#4DA8DA' : status === 'absent' ? '#F87171' : '#D1D5DB';
              return (
                <View key={i} style={s.attCardDay}>
                  <Text style={s.attCardDayLabel}>{day}</Text>
                  <View style={[s.attCardDayDot, { backgroundColor: color }]}>
                    {status === 'active' && <View style={s.attCardDayPulse} />}
                  </View>
                </View>
              );
            })}
          </View>
          <View style={s.attCardLegend}>
            {([['Present', '#34D399'], ['Active', '#4DA8DA'], ['Absent', '#F87171'], ['Weekend', '#D1D5DB']] as [string, string][]).map(([label, color]) => (
              <View key={label} style={s.legendItem}>
                <View style={[s.legendDot, { backgroundColor: color }]} />
                <Text style={s.legendTxt}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={s.sectionTitle}>Quick Actions</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.qaRow}>
          {QUICK_ACTIONS.map((a, i) => (
            <TouchableOpacity key={i} style={s.qaItem} onPress={() => router.push(a.route as any)} activeOpacity={0.75}>
              <View style={s.qaCircle}>
                <Ionicons name={a.icon} size={22} color={a.color} />
              </View>
              <Text style={s.qaLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Stats Grid */}
        <View style={s.sectionRow}>
          <Text style={s.sectionTitle}>Overview</Text>
          <TouchableOpacity><Text style={s.seeAll}>See All</Text></TouchableOpacity>
        </View>
        <View style={s.statsGrid}>
          {stats.map((item, i) => (
            <TouchableOpacity key={i} style={[s.statCard, { width: CARD_W }]} onPress={() => router.push(item.route as any)} activeOpacity={0.82}>
              <View style={s.statIconBox}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={s.statValue}>{item.value}</Text>
              <Text style={s.statLabel} numberOfLines={1}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Announcements */}
        <View style={s.sectionRow}>
          <Text style={s.sectionTitle}>Announcements</Text>
          <View style={s.annHeaderRight}>
            <TouchableOpacity style={s.importBtn} onPress={() => router.push('/announcements')} activeOpacity={0.8}>
              <Ionicons name="cloud-upload-outline" size={13} color="#fff" />
              <Text style={s.importBtnText}>Import</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/announcements')}><Text style={s.seeAll}>View All</Text></TouchableOpacity>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 16 }}>
          {mockAnnouncements.slice(0, 4).map((a) => {
            const borderColor = a.priority === 'Urgent' ? '#FF4D6D' : a.priority === 'High' ? '#2563EB' : a.priority === 'Medium' ? '#F59E0B' : '#10B981';
            const iconBg      = a.priority === 'Urgent' ? '#FFE4EA' : a.priority === 'High' ? '#DBEAFE' : a.priority === 'Medium' ? '#FEF3C7' : '#D1FAE5';
            return (
              <TouchableOpacity key={a.id} style={[s.annCard, { borderTopColor: borderColor }]} onPress={() => router.push('/announcements')} activeOpacity={0.82}>
                <View style={s.annIcon}>
                  <Ionicons name="megaphone-outline" size={16} color={borderColor} />
                </View>
                <Text style={s.annTitle} numberOfLines={2}>{a.title}</Text>
                <View style={s.annDateRow}>
                  <Ionicons name="calendar-outline" size={10} color={Colors.gray400} />
                  <Text style={s.annDate}> {a.date}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={{ height: 110 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F3F4F6' },

  // Header
  header: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 10 : 54,
    paddingHorizontal: 16,
    paddingBottom: 20,
    overflow: 'hidden',
  },
  hCircle1: { position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(255,255,255,0.06)', top: -60, right: -40 },
  hCircle2: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.05)', bottom: -20, left: -20 },
  hRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
  hLeft: { flex: 1 },
  hGreeting: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '500', marginBottom: 3 },
  hName: { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: -0.4 },
  hRole: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  hRight: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 2 },
  notifBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  notifDot: { position: 'absolute', top: -1, right: -1, minWidth: 15, height: 15, borderRadius: 8, backgroundColor: '#F87171', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3, borderWidth: 1.5, borderColor: '#4DA8DA' },
  notifDotTxt: { fontSize: 8, color: '#fff', fontWeight: '800' },
  avatarWrap: { position: 'relative' },
  avatarOnline: { position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: 5, backgroundColor: '#34D399', borderWidth: 2, borderColor: '#4DA8DA' },

  // Attendance strip
  attStrip: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.13)', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  attSlot: { flex: 1, alignItems: 'center', gap: 3 },
  attSlotLabel: { fontSize: 9, color: 'rgba(255,255,255,0.6)', fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 2 },
  attSlotVal: { fontSize: 13, fontWeight: '800', color: '#fff', letterSpacing: -0.2 },
  attDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 2 },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 20, backgroundColor: '#F3F4F6' },

  // Section
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 6 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#163E57', letterSpacing: -0.2 },
  seeAll: { fontSize: 12, color: Colors.primary, fontWeight: '600' },

  // Quick Actions
  qaRow: { paddingBottom: 16, gap: 6 },
  qaItem: { alignItems: 'center', width: 64 },
  qaCircle: { width: IconBox.size, height: IconBox.size, borderRadius: IconBox.radius, backgroundColor: IconBox.bg, alignItems: 'center', justifyContent: 'center', marginBottom: 6, ...IconBox.shadow as any },
  qaLabel: { fontSize: 10, color: '#3A7399', fontWeight: '600', textAlign: 'center' },

  // Stats Grid
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 6 },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    ...Shadow.sm,
  },
  statIconBox: { width: IconBox.sizeSmall, height: IconBox.sizeSmall, borderRadius: IconBox.radius, backgroundColor: IconBox.bg, alignItems: 'center', justifyContent: 'center', marginBottom: 10, ...IconBox.shadow as any },
  statValue: { fontSize: 26, fontWeight: '800', color: '#163E57', letterSpacing: -0.5, lineHeight: 30 },
  statLabel: { fontSize: 11, color: '#5590B5', marginTop: 3, fontWeight: '500' },

  // Task Cards
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    ...Shadow.sm,
  },
  taskTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  taskPriorityDot: { width: 7, height: 7, borderRadius: 4, flexShrink: 0 },
  taskTitle: { flex: 1, fontSize: 14, fontWeight: '600', color: '#163E57' },
  taskProject: { fontSize: 11, color: '#78AECF', marginBottom: 8, marginLeft: 15 },
  taskProgressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  taskProgressTxt: { fontSize: 10, color: Colors.primary, fontWeight: '700', width: 28, textAlign: 'right' },
  taskBottom: { flexDirection: 'row', alignItems: 'center', marginLeft: 15 },
  taskDue: { fontSize: 11, color: '#78AECF' },

  // Project Cards
  projectCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    ...Shadow.sm,
  },
  projectTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  projectInfo: { flex: 1, marginRight: 10 },
  projectName: { fontSize: 14, fontWeight: '700', color: '#163E57' },
  projectClient: { fontSize: 11, color: '#78AECF', marginTop: 2 },
  projectPctBadge: { backgroundColor: Colors.primary + '12', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  projectPct: { fontSize: 13, fontWeight: '800', color: Colors.primary },
  projectBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  projectTasksRow: { flexDirection: 'row', alignItems: 'center' },
  projectTasks: { fontSize: 11, color: '#78AECF' },
  teamRow: { flexDirection: 'row' },
  moreMembers: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#C8E4F5', marginLeft: -7, alignItems: 'center', justifyContent: 'center' },
  moreTxt: { fontSize: 8, color: '#3A7399', fontWeight: '700' },

  // Attendance Card
  attCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    ...Shadow.sm,
  },
  attCardStatus: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 12 },
  attCardDot: { width: 8, height: 8, borderRadius: 4 },
  attCardStatusTxt: { fontSize: 13, fontWeight: '600', color: '#163E57' },
  attCardBtn: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', gap: 6, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 999, marginBottom: 16, ...Shadow.sm },
  attCardBtnTxt: { fontSize: 12, fontWeight: '700', color: '#fff' },
  attCardWeekTitle: { fontSize: 13, fontWeight: '700', color: '#163E57', marginBottom: 10 },
  attCardWeekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  attCardDay: { alignItems: 'center', gap: 6 },
  attCardDayLabel: { fontSize: 11, color: '#5590B5', fontWeight: '600' },
  attCardDayDot: { width: 28, height: 28, borderRadius: 14, position: 'relative' },
  attCardDayPulse: { position: 'absolute', top: -3, left: -3, right: -3, bottom: -3, borderRadius: 18, borderWidth: 2, borderColor: '#4DA8DA60' },
  attCardLegend: { flexDirection: 'row', justifyContent: 'space-around' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 7, height: 7, borderRadius: 4 },
  legendTxt: { fontSize: 11, color: '#5590B5' },

  // Announcements strip
  annCard: {
    width: 138,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginRight: 10,
    borderTopWidth: 3,
    ...Shadow.sm,
  },
  annIcon: { width: IconBox.sizeSmall, height: IconBox.sizeSmall, borderRadius: IconBox.radius, backgroundColor: IconBox.bg, alignItems: 'center', justifyContent: 'center', marginBottom: 8, ...IconBox.shadow as any },
  annTitle: { fontSize: 12, fontWeight: '700', color: '#163E57', marginBottom: 6, lineHeight: 16 },
  annDateRow: { flexDirection: 'row', alignItems: 'center' },
  annDate: { fontSize: 10, color: '#78AECF' },

  annHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  importBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.primary, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  importBtnText: { fontSize: 11, fontWeight: '700', color: '#fff' },
});
