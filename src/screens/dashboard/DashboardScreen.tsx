import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, Animated, Platform, StatusBar, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../design-system/tokens';
import { Avatar } from '../../design-system/components/Avatar';
import { Badge, statusToVariant } from '../../design-system/components/Badge';
import { ProgressBar } from '../../design-system/components/Card';
import { currentUser, mockTasks, mockProjects, mockNotifications, mockAttendance } from '../../data/mockData';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = (SCREEN_W - 16 * 2 - 10) / 2;

const QUICK_ACTIONS = [
  { icon: 'time-outline' as const,              label: 'Check In',    color: '#34D399', bg: '#D1FAE5', route: '/(tabs)/attendance' },
  { icon: 'calendar-outline' as const,          label: 'Apply Leave', color: '#FBBF24', bg: '#FEF3C7', route: '/leaves/apply' },
  { icon: 'receipt-outline' as const,           label: 'Expense',     color: '#4DA8DA', bg: '#E1F0FA', route: '/expenses' },
  { icon: 'people-outline' as const,            label: 'Directory',   color: '#56CCF2', bg: '#E8F7FD', route: '/employees' },
  { icon: 'bar-chart-outline' as const,         label: 'Payroll',     color: '#F87171', bg: '#FEE2E2', route: '/payroll' },
  { icon: 'chatbubbles-outline' as const,       label: 'Chat',        color: '#2E86B5', bg: '#C8E4F5', route: '/(tabs)/chat' },
];

const STATS = (pendingTasks: number, activeProjects: number, leaveBalance: number, attendance: string) => [
  { label: 'Pending Tasks',    value: pendingTasks,    icon: 'list-circle-outline' as const,  color: '#4DA8DA', bg: '#E1F0FA', route: '/(tabs)/tasks' },
  { label: 'Active Projects',  value: activeProjects,  icon: 'folder-open-outline' as const,  color: '#2E86B5', bg: '#C8E4F5', route: '/projects' },
  { label: 'Leave Balance',    value: leaveBalance,    icon: 'umbrella-outline' as const,     color: '#34D399', bg: '#D1FAE5', route: '/(tabs)/leaves' },
  { label: 'Attendance',       value: attendance,      icon: 'pulse-outline' as const,        color: '#FBBF24', bg: '#FEF3C7', route: '/(tabs)/attendance' },
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
  const elapsedTime = useElapsedTimer();
  const scrollViewRef = useRef<ScrollView>(null);
  const myTasksY = useRef(0);
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

        {/* Quick Actions */}
        <Text style={s.sectionTitle}>Quick Actions</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.qaRow}>
          {QUICK_ACTIONS.map((a, i) => (
            <TouchableOpacity key={i} style={s.qaItem} onPress={() => router.push(a.route as any)} activeOpacity={0.75}>
              <View style={[s.qaCircle, { backgroundColor: a.bg }]}>
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
              <View style={[s.statIconBox, { backgroundColor: item.bg }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={s.statValue}>{item.value}</Text>
              <Text style={s.statLabel} numberOfLines={1}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* My Tasks */}
        <View
          style={s.sectionRow}
          onLayout={(e) => { myTasksY.current = e.nativeEvent.layout.y; }}
        >
          <Text style={s.sectionTitle}>My Tasks</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/tasks')}><Text style={s.seeAll}>View All</Text></TouchableOpacity>
        </View>
        {mockTasks.filter(t => t.status !== 'completed').slice(0, 3).map(task => (
          <TouchableOpacity key={task.id} style={s.taskCard} onPress={() => router.push(`/tasks/${task.id}` as any)} activeOpacity={0.82}>
            <View style={s.taskTop}>
              <View style={[s.taskPriorityDot, {
                backgroundColor: task.priority === 'high' ? Colors.danger : task.priority === 'medium' ? Colors.warning : Colors.gray400
              }]} />
              <Text style={s.taskTitle} numberOfLines={1}>{task.title}</Text>
              <Badge
                label={task.status.replace('-', ' ')}
                variant={statusToVariant[task.status] || 'neutral'}
                size="sm"
              />
            </View>
            <Text style={s.taskProject}>{task.project}</Text>
            {task.progress > 0 && (
              <View style={s.taskProgressRow}>
                <ProgressBar
                  progress={task.progress}
                  style={{ flex: 1 }}
                  height={5}
                  color={Colors.primary}
                />
                <Text style={s.taskProgressTxt}>{task.progress}%</Text>
              </View>
            )}
            <View style={s.taskBottom}>
              <Ionicons name="calendar-outline" size={11} color={Colors.gray400} />
              <Text style={s.taskDue}> Due {task.dueDate}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Active Projects */}
        <View style={s.sectionRow}>
          <Text style={s.sectionTitle}>Projects</Text>
          <TouchableOpacity onPress={() => router.push('/projects')}><Text style={s.seeAll}>View All</Text></TouchableOpacity>
        </View>
        {mockProjects.filter(p => p.status === 'active').map(project => (
          <TouchableOpacity key={project.id} style={s.projectCard} onPress={() => router.push(`/projects/${project.id}` as any)} activeOpacity={0.82}>
            <View style={s.projectTop}>
              <View style={s.projectInfo}>
                <Text style={s.projectName} numberOfLines={1}>{project.name}</Text>
                <Text style={s.projectClient}>{project.client}</Text>
              </View>
              <View style={s.projectPctBadge}>
                <Text style={s.projectPct}>{project.progress}%</Text>
              </View>
            </View>
            <ProgressBar
              progress={project.progress}
              style={{ marginTop: 10, marginBottom: 8 }}
              height={5}
              color={project.progress > 75 ? Colors.success : project.progress > 40 ? Colors.primary : Colors.warning}
            />
            <View style={s.projectBottom}>
              <View style={s.projectTasksRow}>
                <Ionicons name="checkmark-done-outline" size={12} color={Colors.gray400} />
                <Text style={s.projectTasks}> {project.tasksCompleted}/{project.tasksTotal} tasks</Text>
              </View>
              <View style={s.teamRow}>
                {project.team.slice(0, 3).map((t, i) => (
                  <Avatar key={i} initials={t} size={22} style={{ marginLeft: i > 0 ? -7 : 0 }} />
                ))}
                {project.team.length > 3 && (
                  <View style={s.moreMembers}><Text style={s.moreTxt}>+{project.team.length - 3}</Text></View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Announcements */}
        <View style={s.sectionRow}>
          <Text style={s.sectionTitle}>Announcements</Text>
          <TouchableOpacity onPress={() => router.push('/announcements')}><Text style={s.seeAll}>View All</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 16 }}>
          {[
            { icon: 'megaphone-outline' as const, title: 'Q2 Town Hall', date: 'Jun 15', color: '#4DA8DA', bg: '#E1F0FA' },
            { icon: 'document-text-outline' as const, title: 'New Leave Policy', date: 'Jul 1', color: '#2E86B5', bg: '#C8E4F5' },
            { icon: 'people-circle-outline' as const, title: 'Team Outing', date: 'Jun 21', color: '#34D399', bg: '#D1FAE5' },
          ].map((a, i) => (
            <TouchableOpacity key={i} style={[s.annCard, { borderTopColor: a.color }]} onPress={() => router.push('/announcements')} activeOpacity={0.82}>
              <View style={[s.annIcon, { backgroundColor: a.bg }]}>
                <Ionicons name={a.icon} size={18} color={a.color} />
              </View>
              <Text style={s.annTitle} numberOfLines={2}>{a.title}</Text>
              <View style={s.annDateRow}>
                <Ionicons name="calendar-outline" size={10} color={Colors.gray400} />
                <Text style={s.annDate}> {a.date}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ height: 110 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#EEF6FC' },

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
  scrollContent: { paddingHorizontal: 16, paddingTop: 20, backgroundColor: '#EEF6FC' },

  // Section
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 6 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#163E57', letterSpacing: -0.2 },
  seeAll: { fontSize: 12, color: Colors.primary, fontWeight: '600' },

  // Quick Actions
  qaRow: { paddingBottom: 16, gap: 6 },
  qaItem: { alignItems: 'center', width: 64 },
  qaCircle: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginBottom: 6, ...Shadow.sm },
  qaLabel: { fontSize: 10, color: '#3A7399', fontWeight: '600', textAlign: 'center' },

  // Stats Grid
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 6 },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: '#C8E4F5',
  },
  statIconBox: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  statValue: { fontSize: 26, fontWeight: '800', color: '#163E57', letterSpacing: -0.5, lineHeight: 30 },
  statLabel: { fontSize: 11, color: '#5590B5', marginTop: 3, fontWeight: '500' },

  // Task Cards
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: '#C8E4F5',
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
    borderWidth: 1,
    borderColor: '#C8E4F5',
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

  // Announcements
  annCard: {
    width: 138,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginRight: 10,
    borderTopWidth: 3,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: '#C8E4F5',
  },
  annIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  annTitle: { fontSize: 12, fontWeight: '700', color: '#163E57', marginBottom: 6, lineHeight: 16 },
  annDateRow: { flexDirection: 'row', alignItems: 'center' },
  annDate: { fontSize: 10, color: '#78AECF' },
});
