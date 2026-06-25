import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar, TextInput, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow, IconBox } from '../../design-system/tokens';
import { Badge } from '../../design-system/components/Badge';
import { Avatar } from '../../design-system/components/Avatar';
import { mockLeaves, mockEmployees } from '../../data/mockData';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];
type Tab = 'requests' | 'holidays';
type StatusFilter = 'all' | 'approved' | 'pending' | 'rejected';

// Enhanced mock data for manager view
const enhancedLeaves = mockLeaves.map((leave, i) => ({
  ...leave,
  employee: mockEmployees[i % mockEmployees.length],
  manager: mockEmployees[0],
}));

const stats = [
  { label: 'Total Leave Requests', value: 28, icon: 'document-text-outline' as IoniconName, color: '#4DA8DA', bg: '#E8F6FC' },
  { label: 'Approved Leaves', value: 18, icon: 'checkmark-circle-outline' as IoniconName, color: '#34D399', bg: '#D1FAE5' },
  { label: 'Rejected Leaves', value: 3, icon: 'close-circle-outline' as IoniconName, color: '#F87171', bg: '#FEE2E2' },
  { label: 'Pending Approval', value: 7, icon: 'time-outline' as IoniconName, color: '#FBBF24', bg: '#FEF3C7' },
];

const getLeaveIcon = (type: string): IoniconName => {
  if (type.includes('Sick')) return 'medical-outline';
  if (type.includes('Casual')) return 'cafe-outline';
  return 'sunny-outline';
};

const fmt = (d: string) => new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' });

export default function LeavesManagementScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 600;
  const [activeTab, setActiveTab] = useState<Tab>('requests');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');

  const filtered = enhancedLeaves.filter(l => {
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    const matchSearch = search === '' ||
      l.employee.name.toLowerCase().includes(search.toLowerCase()) ||
      l.type.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={s.header}>
        <Text style={s.pageTitle}>Employees Leave Management</Text>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Summary Cards */}
        <View style={s.statsGrid}>
          {stats.map((item, i) => (
            <View key={i} style={[s.statCard, Shadow.sm]}>
              <View style={[s.statIconBox, { backgroundColor: item.bg }]}>
                <Ionicons name={item.icon} size={24} color={item.color} />
              </View>
              <Text style={s.statValue}>{item.value}</Text>
              <Text style={s.statLabel}>{item.label.toUpperCase()}</Text>
            </View>
          ))}
        </View>

        {/* Navigation Tabs */}
        <View style={s.tabsRow}>
          <TouchableOpacity
            style={[s.tab, activeTab === 'requests' && s.tabActive]}
            onPress={() => setActiveTab('requests')}
          >
            <Text style={[s.tabText, activeTab === 'requests' && s.tabTextActive]}>Leave Requests</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.tab, activeTab === 'holidays' && s.tabActive]}
            onPress={() => setActiveTab('holidays')}
          >
            <Text style={[s.tabText, activeTab === 'holidays' && s.tabTextActive]}>Holidays</Text>
          </TouchableOpacity>
        </View>

        {/* Content Card */}
        {activeTab === 'requests' && (
          <View style={[s.contentCard, Shadow.sm]}>
            {/* Section Header */}
            <View style={s.contentHeader}>
              <View>
                <Text style={s.contentTitle}>Leave Requests</Text>
                <Text style={s.contentSubtitle}>Manage all employee leave applications</Text>
              </View>
            </View>

            {/* Toolbar */}
            <View style={[s.toolbar, isMobile && s.toolbarMobile]}>
              <View style={[s.searchBox, isMobile && s.searchBoxFull]}>
                <Ionicons name="search-outline" size={18} color={Colors.gray400} />
                <TextInput
                  style={s.searchInput}
                  placeholder="Search employee or type..."
                  placeholderTextColor={Colors.gray400}
                  value={search}
                  onChangeText={setSearch}
                />
              </View>
              <View style={[s.toolbarRow, isMobile && s.toolbarRowFull]}>
                <View style={s.filterDropdown}>
                  <Ionicons name="funnel-outline" size={16} color={Colors.gray600} />
                  <Text style={s.filterText}>{statusFilter === 'all' ? 'Status' : statusFilter}</Text>
                  <Ionicons name="chevron-down-outline" size={16} color={Colors.gray600} />
                </View>
                <TouchableOpacity style={[s.applyBtn, isMobile && s.applyBtnFlex]} onPress={() => router.push('/leaves/apply')} activeOpacity={0.85}>
                  <Ionicons name="add-circle" size={18} color="#fff" />
                  <Text style={s.applyBtnText}>Apply Leave</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Filter Pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterPills}>
              {(['all', 'approved', 'pending', 'rejected'] as StatusFilter[]).map(f => (
                <TouchableOpacity
                  key={f}
                  style={[s.filterPill, statusFilter === f && s.filterPillActive]}
                  onPress={() => setStatusFilter(f)}
                >
                  <Text style={[s.filterPillText, statusFilter === f && s.filterPillTextActive]}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Table / Cards */}
            {filtered.length > 0 ? (
              isMobile ? (
                <View style={s.cardList}>
                  {filtered.map(leave => {
                    const statusColor = leave.status === 'approved' ? Colors.success :
                      leave.status === 'rejected' ? Colors.danger : Colors.warning;
                    return (
                      <View key={leave.id} style={[s.leaveCard, { borderLeftColor: statusColor }]}>
                        <View style={s.leaveCardTop}>
                          <View style={s.leaveCardLeft}>
                            <Avatar name={leave.employee.name} initials={leave.employee.initials} size={36} />
                            <View style={s.empInfo}>
                              <Text style={s.empName}>{leave.employee.name}</Text>
                              <Text style={s.empRole}>{leave.employee.designation}</Text>
                            </View>
                          </View>
                          <Badge
                            label={leave.status}
                            variant={leave.status === 'approved' ? 'success' : leave.status === 'rejected' ? 'danger' : 'warning'}
                            dot
                          />
                        </View>
                        <View style={s.leaveCardMid}>
                          <View style={s.typeRow}>
                            <View style={[s.typeIcon, { backgroundColor: statusColor + '15' }]}>
                              <Ionicons name={getLeaveIcon(leave.type)} size={13} color={statusColor} />
                            </View>
                            <Text style={s.typeText}>{leave.type}</Text>
                          </View>
                          <Text style={s.reasonText} numberOfLines={1}>{leave.reason}</Text>
                        </View>
                        <View style={s.leaveCardBottom}>
                          <View style={s.dateRow}>
                            <Ionicons name="calendar-outline" size={12} color={Colors.primary} />
                            <Text style={s.dateText}>{fmt(leave.from)} → {fmt(leave.to)}</Text>
                          </View>
                          <View style={[s.daysBadge, { backgroundColor: statusColor + '12' }]}>
                            <Text style={[s.daysText, { color: statusColor }]}>{leave.days}d</Text>
                          </View>
                          <View style={s.cardActions}>
                            <TouchableOpacity style={[s.actionBtn, s.viewBtn]}>
                              <Ionicons name="eye-outline" size={15} color={Colors.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[s.actionBtn, s.editBtn]}>
                              <Ionicons name="create-outline" size={15} color={Colors.warning} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[s.actionBtn, s.deleteBtn]}>
                              <Ionicons name="trash-outline" size={15} color={Colors.danger} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : (
              <View style={s.table}>
                {/* Table Header */}
                <View style={s.tableHeader}>
                  <Text style={[s.th, s.thEmployee]}>EMPLOYEE</Text>
                  <Text style={[s.th, s.thType]}>TYPE & REASON</Text>
                  <Text style={[s.th, s.thTimeline]}>TIMELINE</Text>
                  <Text style={[s.th, s.thManager]}>MANAGER</Text>
                  <Text style={[s.th, s.thStatus]}>STATUS</Text>
                  <Text style={[s.th, s.thActions]}>ACTIONS</Text>
                </View>

                {/* Table Rows */}
                {filtered.map(leave => {
                  const statusColor = leave.status === 'approved' ? Colors.success :
                    leave.status === 'rejected' ? Colors.danger : Colors.warning;
                  return (
                    <View key={leave.id} style={s.tableRow}>
                      {/* Employee */}
                      <View style={s.tdEmployee}>
                        <Avatar name={leave.employee.name} initials={leave.employee.initials} size={36} />
                        <View style={s.empInfo}>
                          <Text style={s.empName}>{leave.employee.name}</Text>
                          <Text style={s.empRole}>{leave.employee.designation}</Text>
                        </View>
                      </View>

                      {/* Type & Reason */}
                      <View style={s.tdType}>
                        <View style={s.typeRow}>
                          <View style={[s.typeIcon, { backgroundColor: statusColor + '15' }]}>
                            <Ionicons name={getLeaveIcon(leave.type)} size={14} color={statusColor} />
                          </View>
                          <Text style={s.typeText}>{leave.type}</Text>
                        </View>
                        <Text style={s.reasonText} numberOfLines={1}>{leave.reason}</Text>
                      </View>

                      {/* Timeline */}
                      <View style={s.tdTimeline}>
                        <View style={s.dateRow}>
                          <Ionicons name="calendar-outline" size={13} color={Colors.primary} />
                          <Text style={s.dateText}>{fmt(leave.from)}</Text>
                        </View>
                        <View style={s.dateRow}>
                          <Ionicons name="arrow-forward-outline" size={13} color={Colors.gray400} />
                          <Text style={s.dateText}>{fmt(leave.to)}</Text>
                        </View>
                        <View style={[s.daysBadge, { backgroundColor: statusColor + '12' }]}>
                          <Text style={[s.daysText, { color: statusColor }]}>{leave.days}d</Text>
                        </View>
                      </View>

                      {/* Manager */}
                      <View style={s.tdManager}>
                        <Avatar name={leave.manager.name} initials={leave.manager.initials} size={28} />
                        <Text style={s.managerName} numberOfLines={1}>{leave.manager.name.split(' ')[0]}</Text>
                      </View>

                      {/* Status */}
                      <View style={s.tdStatus}>
                        <Badge
                          label={leave.status}
                          variant={leave.status === 'approved' ? 'success' : leave.status === 'rejected' ? 'danger' : 'warning'}
                          dot
                        />
                      </View>

                      {/* Actions */}
                      <View style={s.tdActions}>
                        <TouchableOpacity style={[s.actionBtn, s.viewBtn]}>
                          <Ionicons name="eye-outline" size={16} color={Colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[s.actionBtn, s.editBtn]}>
                          <Ionicons name="create-outline" size={16} color={Colors.warning} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[s.actionBtn, s.deleteBtn]}>
                          <Ionicons name="trash-outline" size={16} color={Colors.danger} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
              )
            ) : (
              <View style={s.emptyState}>
                <View style={s.emptyIconBox}>
                  <Ionicons name="document-text-outline" size={48} color={Colors.gray300} />
                </View>
                <Text style={s.emptyTitle}>No Leave Requests Found</Text>
                <Text style={s.emptySub}>Start by applying for a leave or adjust your filters</Text>
                <TouchableOpacity style={s.emptyBtn} onPress={() => router.push('/leaves/apply')}>
                  <Ionicons name="add-circle-outline" size={18} color="#fff" />
                  <Text style={s.emptyBtnText}>Apply Leave</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {activeTab === 'holidays' && (
          <View style={[s.contentCard, Shadow.sm]}>
            <View style={s.emptyState}>
              <View style={s.emptyIconBox}>
                <Ionicons name="calendar-outline" size={48} color={Colors.gray300} />
              </View>
              <Text style={s.emptyTitle}>Holidays Calendar</Text>
              <Text style={s.emptySub}>View company holidays and observances</Text>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  // Header
  header: {
    backgroundColor: Colors.white,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 16 : 56,
    paddingHorizontal: 24,
    paddingBottom: 20,
    ...Shadow.sm,
  },
  pageTitle: { fontSize: 22, fontWeight: '800', color: Colors.gray900, letterSpacing: -0.5 },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 24 },

  // Stats Grid
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 24 },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  statIconBox: {
    width: 52,
    height: 52,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: { fontSize: 28, fontWeight: '800', color: Colors.gray900, lineHeight: 32, marginBottom: 4 },
  statLabel: { fontSize: 10, fontWeight: '700', color: Colors.gray500, textAlign: 'center', letterSpacing: 0.5 },

  // Tabs
  tabsRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.gray200,
    alignItems: 'center',
  },
  tabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabText: { fontSize: 14, fontWeight: '700', color: Colors.gray600 },
  tabTextActive: { color: Colors.white },

  // Content Card
  contentCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 20, marginBottom: 24 },
  contentHeader: { marginBottom: 20 },
  contentTitle: { fontSize: 18, fontWeight: '800', color: Colors.gray900, marginBottom: 4 },
  contentSubtitle: { fontSize: 13, color: Colors.gray500 },

  // Toolbar
  toolbar: { flexDirection: 'row', gap: 10, marginBottom: 16, flexWrap: 'wrap' },
  toolbarMobile: { flexDirection: 'column' },
  toolbarRow: { flexDirection: 'row', gap: 10 },
  toolbarRowFull: { width: '100%' },
  searchBox: {
    flex: 1,
    minWidth: 200,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  searchBoxFull: { width: '100%', minWidth: 0 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.gray900 },
  filterDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  filterText: { fontSize: 13, fontWeight: '600', color: Colors.gray600 },
  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
    ...Shadow.sm,
  },
  applyBtnFlex: { flex: 1, justifyContent: 'center' },
  applyBtnText: { fontSize: 13, fontWeight: '700', color: Colors.white },

  // Filter Pills
  filterPills: { marginBottom: 20, flexGrow: 0 },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: Colors.gray100,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  filterPillActive: { backgroundColor: Colors.overlayLight, borderColor: Colors.primary },
  filterPillText: { fontSize: 12, fontWeight: '600', color: Colors.gray600 },
  filterPillTextActive: { color: Colors.primary },

  // Table
  table: { borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: Colors.gray200 },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.gray50,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  th: { fontSize: 10, fontWeight: '800', color: Colors.gray600, letterSpacing: 0.5 },
  thEmployee: { flex: 2 },
  thType: { flex: 2 },
  thTimeline: { flex: 2 },
  thManager: { flex: 1.2 },
  thStatus: { flex: 1.2 },
  thActions: { flex: 1.5 },

  tableRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
    alignItems: 'center',
  },

  // Table Cells
  tdEmployee: { flex: 2, flexDirection: 'row', alignItems: 'center', gap: 10 },
  empInfo: { flex: 1 },
  empName: { fontSize: 13, fontWeight: '700', color: Colors.gray900 },
  empRole: { fontSize: 11, color: Colors.gray500, marginTop: 2 },

  tdType: { flex: 2, gap: 4 },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  typeIcon: { width: 24, height: 24, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  typeText: { fontSize: 12, fontWeight: '700', color: Colors.gray900 },
  reasonText: { fontSize: 11, color: Colors.gray500 },

  tdTimeline: { flex: 2, gap: 3 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dateText: { fontSize: 11, color: Colors.gray700, fontWeight: '500' },
  daysBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 2 },
  daysText: { fontSize: 11, fontWeight: '700' },

  tdManager: { flex: 1.2, flexDirection: 'row', alignItems: 'center', gap: 6 },
  managerName: { fontSize: 11, fontWeight: '600', color: Colors.gray700 },

  tdStatus: { flex: 1.2 },

  tdActions: { flex: 1.5, flexDirection: 'row', gap: 6 },
  actionBtn: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  viewBtn: { backgroundColor: Colors.primary + '12' },
  editBtn: { backgroundColor: Colors.warning + '12' },
  deleteBtn: { backgroundColor: Colors.danger + '12' },

  // Mobile Card List
  cardList: { gap: 10 },
  leaveCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: Colors.gray100,
    gap: 10,
  },
  leaveCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  leaveCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  leaveCardMid: { gap: 3 },
  leaveCardBottom: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  cardActions: { flexDirection: 'row', gap: 6, marginLeft: 'auto' },

  // Empty State
  emptyState: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 24 },
  emptyIconBox: { marginBottom: 16, opacity: 0.6 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.gray700, marginBottom: 8 },
  emptySub: { fontSize: 14, color: Colors.gray500, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
    ...Shadow.md,
  },
  emptyBtnText: { fontSize: 14, fontWeight: '700', color: Colors.white },
});
