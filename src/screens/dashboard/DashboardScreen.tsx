import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, Animated, Platform, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../design-system/tokens';
import { Avatar } from '../../design-system/components/Avatar';
import { Badge, statusToVariant } from '../../design-system/components/Badge';
import { Card, KPIWidget, SectionHeader, ProgressBar } from '../../design-system/components/Card';
import { currentUser, mockTasks, mockProjects, mockNotifications, mockAttendance } from '../../data/mockData';

const QUICK_ACTIONS = [
  { name: 'time-outline' as const, label: 'Check In', color: Colors.success, route: '/(tabs)/attendance' },
  { name: 'calendar-outline' as const, label: 'Apply Leave', color: Colors.warning, route: '/leaves/apply' },
  { name: 'receipt-outline' as const, label: 'Expense', color: Colors.accent, route: '/expenses' },
  { name: 'checkmark-circle-outline' as const, label: 'My Tasks', color: Colors.primary, route: '/(tabs)/tasks' },
  { name: 'people-outline' as const, label: 'Directory', color: '#8B5CF6', route: '/employees' },
  { name: 'chatbubbles-outline' as const, label: 'Chat', color: '#06B6D4', route: '/(tabs)/chat' },
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

export default function DashboardScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'projects'>('overview');
  const elapsedTime = useElapsedTimer();
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerHeight = scrollY.interpolate({ inputRange: [0, 100], outputRange: [0, -20], extrapolate: 'clamp' });
  const onRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1200); };
  const unreadCount = mockNotifications.filter(n => !n.read).length;
  const today = mockAttendance[0];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <Animated.View style={[styles.header, { transform: [{ translateY: headerHeight }] }]}>
        <View style={styles.headerCircle1} />
        <View style={styles.headerCircle2} />
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Good Morning</Text>
            <Text style={styles.userName}>{currentUser.name}</Text>
            <Text style={styles.userRole}>{currentUser.designation}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/notifications')}>
              <Ionicons name="notifications-outline" size={24} color={Colors.white} />
              {unreadCount > 0 && (
                <View style={styles.badge}><Text style={styles.badgeText}>{unreadCount}</Text></View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/profile')}>
              <Avatar name={currentUser.name} initials={currentUser.initials} size={44} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabRow}>
          {(['overview', 'tasks', 'projects'] as const).map(tab => (
            <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scroll} contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        {/* Attendance Card */}
        <Card elevated style={styles.attendanceCard}>
          <View style={styles.attendanceHeader}>
            <View>
              <Text style={styles.attendanceDayLabel}>THURSDAY, JUN 4</Text>
              <Text style={styles.attendanceTitle}>Attendance</Text>
            </View>
            <Badge label={today.status === 'active' ? 'WORKING' : today.status} variant={statusToVariant[today.status]} dot />
          </View>
          <View style={styles.timerSection}>
            <View style={styles.timerRing}>
              <Text style={styles.timerLabel}>ELAPSED</Text>
              <Text style={styles.timerValue}>{elapsedTime.slice(0, 5)}</Text>
              <Text style={styles.timerSec}>{elapsedTime.slice(-2)}s</Text>
            </View>
          </View>
          <View style={styles.checkInRow}>
            <View style={styles.checkItem}>
              <View style={[styles.checkDot, { backgroundColor: Colors.success }]} />
              <Text style={styles.checkLabel}>CHECK IN</Text>
              <Text style={styles.checkTime}>{today.checkIn}</Text>
            </View>
            <View style={styles.checkDivider} />
            <View style={styles.checkItem}>
              <View style={[styles.checkDot, { backgroundColor: Colors.warning }]} />
              <Text style={styles.checkLabel}>CHECK OUT</Text>
              <Text style={[styles.checkTime, { color: Colors.warning }]}>{today.checkOut}</Text>
            </View>
          </View>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={13} color={Colors.gray500} />
            <Text style={styles.locationTag}> Office Location • Checked In</Text>
          </View>
          <TouchableOpacity style={styles.checkOutBtn} onPress={() => router.push('/(tabs)/attendance')}>
            <Ionicons name="log-out-outline" size={16} color={Colors.danger} />
            <Text style={styles.checkOutBtnText}>Check Out Now</Text>
          </TouchableOpacity>
        </Card>

        {/* Quick Actions */}
        <SectionHeader title="Quick Actions" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickActions}>
          {QUICK_ACTIONS.map((action, i) => (
            <TouchableOpacity key={i} style={styles.quickAction} onPress={() => router.push(action.route as any)} activeOpacity={0.8}>
              <View style={[styles.quickActionIcon, { backgroundColor: action.color + '18' }]}>
                <Ionicons name={action.name} size={24} color={action.color} />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* KPI Widgets */}
        <SectionHeader title="Overview" actionLabel="See All" onAction={() => {}} />
        <View style={styles.kpiRow}>
          <KPIWidget label="Pending Tasks" value={mockTasks.filter(t => t.status !== 'completed').length}
            icon={<Ionicons name="list-outline" size={20} color={Colors.primary} />}
            iconBg={Colors.overlayLight} sub="Due this week" onPress={() => router.push('/(tabs)/tasks')} />
          <KPIWidget label="Active Projects" value={mockProjects.filter(p => p.status === 'active').length}
            icon={<Ionicons name="folder-outline" size={20} color={Colors.accent} />}
            iconBg={Colors.infoLight} sub="In progress" onPress={() => router.push('/projects')} />
          <KPIWidget label="Leave Balance" value={currentUser.leaveBalance.remaining.annual}
            icon={<Ionicons name="umbrella-outline" size={20} color={Colors.success} />}
            iconBg={Colors.successLight} sub="Days left" onPress={() => router.push('/(tabs)/leaves')} />
        </View>
        <View style={styles.kpiRow}>
          <KPIWidget label="Notifications" value={unreadCount}
            icon={<Ionicons name="notifications-outline" size={20} color={Colors.warning} />}
            iconBg={Colors.warningLight} sub="Unread" onPress={() => router.push('/notifications')} />
          <KPIWidget label="Expense Claims" value="₹5,050"
            icon={<Ionicons name="wallet-outline" size={20} color={Colors.danger} />}
            iconBg={Colors.dangerLight} sub="Pending" onPress={() => router.push('/expenses')} />
          <KPIWidget label="Attendance" value="96%"
            icon={<Ionicons name="time-outline" size={20} color={Colors.primary} />}
            iconBg={Colors.overlayLight} sub="This month" onPress={() => router.push('/(tabs)/attendance')} />
        </View>

        {/* Recent Tasks */}
        <SectionHeader title="My Tasks" actionLabel="View All" onAction={() => router.push('/(tabs)/tasks')} />
        {mockTasks.slice(0, 3).map(task => (
          <Card key={task.id} onPress={() => router.push(`/tasks/${task.id}` as any)}>
            <View style={styles.taskRow}>
              <View style={styles.taskLeft}>
                <Text style={styles.taskTitle} numberOfLines={1}>{task.title}</Text>
                <Text style={styles.taskProject}>{task.project}</Text>
                <View style={styles.taskMeta}>
                  <Badge label={task.priority} variant={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'neutral'} />
                  <View style={styles.taskDueRow}>
                    <Ionicons name="calendar-outline" size={11} color={Colors.gray400} />
                    <Text style={styles.taskDue}> {task.dueDate}</Text>
                  </View>
                </View>
              </View>
              <Badge label={task.status.replace('-', ' ')} variant={statusToVariant[task.status] || 'neutral'} />
            </View>
            {task.progress > 0 && <ProgressBar progress={task.progress} style={{ marginTop: 10 }} color={task.status === 'completed' ? Colors.success : Colors.primary} />}
          </Card>
        ))}

        {/* Active Projects */}
        <SectionHeader title="Active Projects" actionLabel="View All" onAction={() => router.push('/projects')} />
        {mockProjects.filter(p => p.status === 'active').map(project => (
          <Card key={project.id} onPress={() => router.push(`/projects/${project.id}` as any)}>
            <View style={styles.projectRow}>
              <View style={styles.projectInfo}>
                <Text style={styles.projectName} numberOfLines={1}>{project.name}</Text>
                <Text style={styles.projectClient}>{project.client}</Text>
              </View>
              <Text style={styles.projectProgress}>{project.progress}%</Text>
            </View>
            <ProgressBar progress={project.progress} style={{ marginTop: 8 }}
              color={project.progress > 75 ? Colors.success : project.progress > 40 ? Colors.primary : Colors.warning} showLabel={false} />
            <View style={styles.projectFooter}>
              <View style={styles.projectTasksRow}>
                <Ionicons name="checkmark-circle-outline" size={13} color={Colors.gray500} />
                <Text style={styles.projectTasks}> {project.tasksCompleted}/{project.tasksTotal} tasks</Text>
              </View>
              <View style={styles.teamAvatars}>
                {project.team.slice(0, 3).map((t, i) => (
                  <Avatar key={i} initials={t} size={24} style={{ marginLeft: i > 0 ? -8 : 0 }} />
                ))}
                {project.team.length > 3 && (
                  <View style={styles.moreMembers}><Text style={styles.moreMembersText}>+{project.team.length - 3}</Text></View>
                )}
              </View>
            </View>
          </Card>
        ))}

        {/* Announcements */}
        <SectionHeader title="Recent Announcements" actionLabel="View All" onAction={() => router.push('/announcements')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.announcementsRow}>
          {[
            { iconName: 'business-outline' as const, title: 'Q2 Town Hall', date: 'Jun 15', color: Colors.primary },
            { iconName: 'document-text-outline' as const, title: 'New Leave Policy', date: 'Jul 1', color: Colors.accent },
            { iconName: 'people-outline' as const, title: 'Team Outing', date: 'Jun 21', color: Colors.success },
          ].map((a, i) => (
            <TouchableOpacity key={i} style={[styles.announcementCard, { borderTopColor: a.color }]} onPress={() => router.push('/announcements')}>
              <View style={[styles.annIconBox, { backgroundColor: a.color + '15' }]}>
                <Ionicons name={a.iconName} size={20} color={a.color} />
              </View>
              <Text style={styles.announcementTitle}>{a.title}</Text>
              <Text style={styles.announcementDate}>{a.date}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ height: 100 }} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 52,
    paddingHorizontal: Spacing[4], paddingBottom: 14, overflow: 'hidden', zIndex: 10,
  },
  headerCircle1: { position: 'absolute', width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(96,165,250,0.12)', top: -80, right: -50 },
  headerCircle2: { position: 'absolute', width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(30,64,175,0.18)', bottom: -30, left: -30 },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  greeting: { fontSize: Typography.fontSize.xs, color: 'rgba(255,255,255,0.65)', marginBottom: 2, letterSpacing: 0.3 },
  userName: { fontSize: Typography.fontSize.lg, fontWeight: '800', color: Colors.white, letterSpacing: -0.3 },
  userRole: { fontSize: Typography.fontSize.xs, color: 'rgba(255,255,255,0.55)', marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: { position: 'relative', padding: 6, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: Radius.md, minWidth: 36, minHeight: 36, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: -2, right: -2, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: Colors.danger, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: Colors.primary, paddingHorizontal: 3 },
  badgeText: { fontSize: 9, color: Colors.white, fontWeight: '700' },
  tabRow: { marginHorizontal: -4 },
  tab: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: Radius.full, marginHorizontal: 3 },
  tabActive: { backgroundColor: 'rgba(255,255,255,0.22)' },
  tabText: { fontSize: Typography.fontSize.sm, color: 'rgba(255,255,255,0.55)', fontWeight: '600' },
  tabTextActive: { color: Colors.white, fontWeight: '700' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing[4], paddingTop: Spacing[4] },
  attendanceCard: { marginBottom: Spacing[4], padding: Spacing[4] },
  attendanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  attendanceDayLabel: { fontSize: Typography.fontSize.xs, color: Colors.gray500, letterSpacing: 0.8, fontWeight: '600', textTransform: 'uppercase' },
  attendanceTitle: { fontSize: Typography.fontSize.md, fontWeight: '700', color: Colors.gray900, marginTop: 2 },
  timerSection: { alignItems: 'center', marginBottom: 14 },
  timerRing: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: Colors.primary + '30', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary + '08' },
  timerLabel: { fontSize: 9, color: Colors.gray500, letterSpacing: 1.2, fontWeight: '700', textTransform: 'uppercase' },
  timerValue: { fontSize: Typography.fontSize['2xl'], fontWeight: '800', color: Colors.primary, letterSpacing: -1 },
  timerSec: { fontSize: Typography.fontSize.xs, color: Colors.gray400, marginTop: 1 },
  checkInRow: { flexDirection: 'row', marginBottom: 10 },
  checkItem: { flex: 1, alignItems: 'center' },
  checkDot: { width: 7, height: 7, borderRadius: 4, marginBottom: 4 },
  checkLabel: { fontSize: 10, color: Colors.gray500, letterSpacing: 0.8, fontWeight: '600', textTransform: 'uppercase', marginBottom: 2 },
  checkTime: { fontSize: Typography.fontSize.md, fontWeight: '700', color: Colors.gray900 },
  checkDivider: { width: 1, backgroundColor: Colors.gray200, marginVertical: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  locationTag: { fontSize: Typography.fontSize.xs, color: Colors.gray500 },
  checkOutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: Colors.dangerLight, borderRadius: Radius.md, paddingVertical: 12, borderWidth: 1, borderColor: Colors.danger + '30' },
  checkOutBtnText: { fontSize: Typography.fontSize.sm, fontWeight: '700', color: Colors.danger },
  quickActions: { marginBottom: Spacing[4] },
  quickAction: { alignItems: 'center', marginRight: 14, minWidth: 60 },
  quickActionIcon: { width: 50, height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  quickActionLabel: { fontSize: Typography.fontSize.xs, color: Colors.gray600, fontWeight: '600', textAlign: 'center' },
  kpiRow: { flexDirection: 'row', marginBottom: Spacing[2] },
  taskRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  taskLeft: { flex: 1, marginRight: 8 },
  taskTitle: { fontSize: Typography.fontSize.base, fontWeight: '600', color: Colors.gray900, marginBottom: 2 },
  taskProject: { fontSize: Typography.fontSize.xs, color: Colors.gray500, marginBottom: 6 },
  taskMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  taskDueRow: { flexDirection: 'row', alignItems: 'center' },
  taskDue: { fontSize: Typography.fontSize.xs, color: Colors.gray400 },
  projectRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  projectInfo: { flex: 1 },
  projectName: { fontSize: Typography.fontSize.base, fontWeight: '700', color: Colors.gray900 },
  projectClient: { fontSize: Typography.fontSize.xs, color: Colors.gray500, marginTop: 2 },
  projectProgress: { fontSize: Typography.fontSize.lg, fontWeight: '700', color: Colors.primary },
  projectFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  projectTasksRow: { flexDirection: 'row', alignItems: 'center' },
  projectTasks: { fontSize: Typography.fontSize.xs, color: Colors.gray500 },
  teamAvatars: { flexDirection: 'row' },
  moreMembers: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.gray200, marginLeft: -8, alignItems: 'center', justifyContent: 'center' },
  moreMembersText: { fontSize: 9, color: Colors.gray600, fontWeight: '700' },
  announcementsRow: { marginBottom: Spacing[4] },
  announcementCard: { width: 140, backgroundColor: Colors.white, borderRadius: Radius.md, padding: Spacing[3], marginRight: Spacing[3], borderTopWidth: 3, ...Shadow.sm },
  annIconBox: { width: 36, height: 36, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  announcementTitle: { fontSize: Typography.fontSize.sm, fontWeight: '700', color: Colors.gray900, marginBottom: 4 },
  announcementDate: { fontSize: Typography.fontSize.xs, color: Colors.gray500 },
});
