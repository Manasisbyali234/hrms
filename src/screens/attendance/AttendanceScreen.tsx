import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, StatusBar, TextInput, Modal, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius, Shadow, IconBox } from '../../design-system/tokens';
import { mockEmployees, mockAttendance } from '../../data/mockData';

const { width: SW } = Dimensions.get('window');
const isSmall = SW < 380;

// Responsive sizing constants
const STICKY_W = isSmall ? 108 : 140;
const DAY_W    = isSmall ? 36  : 44;
const CELL_SZ  = isSmall ? 22  : 26;
const CARD_PAD = isSmall ? 8   : 12;
const ICON_SZ  = isSmall ? 30  : 36;

// ─── Types ────────────────────────────────────────────────────────────────────
type TabId = 'monthly' | 'daily';
type AttendanceStatus = 'present' | 'absent' | 'weekend' | 'holiday' | 'active' | 'late';

// ─── Constants ────────────────────────────────────────────────────────────────
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const SHIFTS = ['All Shifts', 'Morning', 'Evening', 'Night', 'General'];
const DAY_NAMES = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
const AVATAR_COLORS = ['#4DA8DA','#34D399','#FBBF24','#F87171','#A78BFA','#EC4899','#56CCF2'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getDayName(year: number, month: number, day: number) {
  return DAY_NAMES[new Date(year, month, day).getDay()];
}

function isWeekend(year: number, month: number, day: number) {
  const d = new Date(year, month, day).getDay();
  return d === 0 || d === 6;
}

function getEmployeeMonthStatus(empId: string, year: number, month: number): Record<number, AttendanceStatus> {
  const days = getDaysInMonth(year, month);
  const result: Record<number, AttendanceStatus> = {};
  for (let d = 1; d <= days; d++) {
    if (isWeekend(year, month, d)) { result[d] = 'weekend'; continue; }
    const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    if (empId === 'MM-003') {
      const rec = mockAttendance.find(r => r.date === dateStr);
      if (rec) { result[d] = rec.status as AttendanceStatus; continue; }
    }
    const seed = (empId.charCodeAt(empId.length - 1) + d) % 10;
    result[d] = seed < 8 ? 'present' : 'absent';
  }
  return result;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SummaryCard({ icon, iconBg, count, label }: {
  icon: string; iconBg: string; count: number | string; label: string;
}) {
  return (
    <View style={[summaryStyles.card, Shadow.sm]}>
      <View style={summaryStyles.iconBox}>
        <Ionicons name={icon as any} size={isSmall ? 15 : 18} color={iconBg} />
      </View>
      <Text style={summaryStyles.count}>{count}</Text>
      <Text style={summaryStyles.label}>{label}</Text>
    </View>
  );
}

const summaryStyles = StyleSheet.create({
  card: {
    width: '48%', backgroundColor: Colors.white, borderRadius: Radius.md,
    padding: 14, alignItems: 'center', gap: 6,
    borderWidth: 1, borderColor: Colors.gray100,
  },
  iconBox: {
    width: ICON_SZ, height: ICON_SZ, borderRadius: IconBox.radius,
    backgroundColor: IconBox.bg, alignItems: 'center', justifyContent: 'center',
    ...IconBox.shadow as any,
  },
  count: { fontSize: isSmall ? 16 : 20, fontWeight: '800', color: Colors.gray900 },
  label: { fontSize: 8, fontWeight: '700', color: Colors.gray500, letterSpacing: 0.5, textTransform: 'uppercase', textAlign: 'center' },
});

function StatusCell({ status }: { status: AttendanceStatus }) {
  if (status === 'weekend' || status === 'holiday') {
    return (
      <View style={cellStyles.wrapper}>
        <View style={cellStyles.weekend} />
      </View>
    );
  }
  const isPresent = status === 'present' || status === 'active';
  const late = status === 'late';
  const bg   = late ? '#FEF3C7' : isPresent ? '#D1FAE5' : '#FEE2E2';
  const col  = late ? '#D97706' : isPresent ? '#059669' : '#DC2626';
  const icon = late ? 'time'    : isPresent ? 'checkmark' : 'close';
  return (
    <View style={cellStyles.wrapper}>
      <View style={[cellStyles.pill, { backgroundColor: bg }]}>
        <Ionicons name={icon as any} size={isSmall ? 10 : 12} color={col} />
      </View>
    </View>
  );
}

const cellStyles = StyleSheet.create({
  wrapper: { width: DAY_W, height: 44, alignItems: 'center', justifyContent: 'center' },
  pill: {
    width: CELL_SZ, height: CELL_SZ, borderRadius: 6,
    alignItems: 'center', justifyContent: 'center',
  },
  weekend: { width: 14, height: 2, borderRadius: 1, backgroundColor: Colors.gray300 },
});

// ─── Dropdown Modal ───────────────────────────────────────────────────────────
function DropdownModal({ visible, options, selected, onSelect, onClose }: {
  visible: boolean; options: string[]; selected: string;
  onSelect: (v: string) => void; onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={dropStyles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={[dropStyles.sheet, Shadow.lg]}>
          {options.map(opt => (
            <TouchableOpacity key={opt} style={dropStyles.item} onPress={() => { onSelect(opt); onClose(); }}>
              <Text style={[dropStyles.itemText, opt === selected && dropStyles.itemSelected]}>{opt}</Text>
              {opt === selected && <Ionicons name="checkmark" size={16} color={Colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const dropStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', paddingHorizontal: 32 },
  sheet: { backgroundColor: Colors.white, borderRadius: Radius.lg, overflow: 'hidden' },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  itemText: { fontSize: Typography.fontSize.sm, color: Colors.gray700 },
  itemSelected: { fontWeight: '700', color: Colors.primary },
});

// ─── Daily Report Tab ─────────────────────────────────────────────────────────
function DailyReportTab() {
  const today = new Date();
  const records = mockAttendance.slice(0, 5);
  return (
    <View style={{ paddingTop: 12 }}>
      <Text style={dailyStyles.title}>
        {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
      </Text>
      {records.map((r, i) => {
        const emp = mockEmployees.find(e => e.id === 'MM-003');
        const isPresent = r.status === 'present' || r.status === 'active';
        return (
          <View key={i} style={[dailyStyles.row, Shadow.sm]}>
            <View style={[dailyStyles.avatar, { backgroundColor: AVATAR_COLORS[0] }]}>
              <Text style={dailyStyles.avatarText}>{emp?.initials ?? 'VM'}</Text>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={dailyStyles.name} numberOfLines={1}>{emp?.name ?? 'Venil Mottana'}</Text>
              <Text style={dailyStyles.time} numberOfLines={1}>{r.checkIn} → {r.checkOut}</Text>
            </View>
            <View style={[dailyStyles.badge, { backgroundColor: isPresent ? Colors.successLight : Colors.dangerLight }]}>
              <Text style={[dailyStyles.badgeText, { color: isPresent ? Colors.success : Colors.danger }]}>
                {isPresent ? 'Present' : r.status.charAt(0).toUpperCase() + r.status.slice(1)}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const dailyStyles = StyleSheet.create({
  title: { fontSize: Typography.fontSize.sm, fontWeight: '600', color: Colors.gray600, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: Radius.lg, padding: isSmall ? 10 : 14, marginBottom: 10, gap: isSmall ? 8 : 12, borderWidth: 1, borderColor: Colors.gray100 },
  avatar: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarText: { fontSize: Typography.fontSize.sm, fontWeight: '700', color: '#fff' },
  name: { fontSize: Typography.fontSize.sm, fontWeight: '700', color: Colors.gray900 },
  time: { fontSize: Typography.fontSize.xs, color: Colors.gray500, marginTop: 2 },
  badge: { paddingHorizontal: isSmall ? 7 : 10, paddingVertical: 4, borderRadius: Radius.full, flexShrink: 0 },
  badgeText: { fontSize: Typography.fontSize.xs, fontWeight: '700' },
});

// ─── Monthly Overview Tab ─────────────────────────────────────────────────────
function MonthlyOverviewTab({ year, month }: { year: number; month: number }) {
  const [search, setSearch] = useState('');
  const [shift, setShift] = useState(SHIFTS[0]);
  const [showShiftDrop, setShowShiftDrop] = useState(false);

  const days = getDaysInMonth(year, month);
  const dayNumbers = Array.from({ length: days }, (_, i) => i + 1);

  const filtered = useMemo(() =>
    mockEmployees.filter(e => e.name.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Filters */}
      <View style={[matrixStyles.filterCard, Shadow.sm]}>
        <View style={matrixStyles.filterRow}>
          <View style={matrixStyles.searchBox}>
            <Ionicons name="search-outline" size={15} color={Colors.gray400} />
            <TextInput
              style={matrixStyles.searchInput}
              placeholder="Search employee..."
              placeholderTextColor={Colors.gray400}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity style={matrixStyles.dropdown} onPress={() => setShowShiftDrop(true)} activeOpacity={0.8}>
            <Text style={matrixStyles.dropText} numberOfLines={1}>{shift}</Text>
            <Ionicons name="chevron-down" size={13} color={Colors.gray500} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Matrix Table */}
      <View style={[matrixStyles.tableCard, Shadow.sm]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={false}>
          <View>
            {/* Header row */}
            <View style={matrixStyles.headerRow}>
              <View style={matrixStyles.stickyCol}>
                <Text style={matrixStyles.headerEmpText}>EMPLOYEE</Text>
              </View>
              {dayNumbers.map(d => (
                <View key={d} style={[matrixStyles.dayCol, isWeekend(year, month, d) && matrixStyles.weekendCol]}>
                  <Text style={[matrixStyles.dayName, isWeekend(year, month, d) && matrixStyles.weekendText]}>
                    {getDayName(year, month, d)}
                  </Text>
                  <Text style={[matrixStyles.dayNum, isWeekend(year, month, d) && matrixStyles.weekendText]}>
                    {String(d).padStart(2, '0')}
                  </Text>
                </View>
              ))}
            </View>

            {/* Employee rows */}
            <ScrollView style={{ maxHeight: 360 }} showsVerticalScrollIndicator={false} nestedScrollEnabled>
              {filtered.map((emp, idx) => {
                const statuses = getEmployeeMonthStatus(emp.id, year, month);
                return (
                  <View key={emp.id} style={[matrixStyles.dataRow, idx % 2 === 0 && matrixStyles.rowEven]}>
                    <View style={matrixStyles.stickyCol}>
                      <View style={[matrixStyles.empAvatar, { backgroundColor: AVATAR_COLORS[idx % AVATAR_COLORS.length] }]}>
                        <Text style={matrixStyles.empAvatarText}>{emp.initials}</Text>
                      </View>
                      <Text style={matrixStyles.empName} numberOfLines={1}>{emp.name}</Text>
                    </View>
                    {dayNumbers.map(d => (
                      <View key={d} style={[matrixStyles.dayCol, isWeekend(year, month, d) && matrixStyles.weekendCol]}>
                        <StatusCell status={statuses[d] ?? 'absent'} />
                      </View>
                    ))}
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </ScrollView>
      </View>

      <DropdownModal
        visible={showShiftDrop}
        options={SHIFTS}
        selected={shift}
        onSelect={setShift}
        onClose={() => setShowShiftDrop(false)}
      />
    </View>
  );
}

const matrixStyles = StyleSheet.create({
  filterCard: {
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    padding: 12, marginBottom: 12,
    borderWidth: 1, borderColor: Colors.gray100,
  },
  filterRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.gray50, borderRadius: Radius.md,
    paddingHorizontal: 10, height: 38, gap: 6,
    borderWidth: 1, borderColor: Colors.gray200,
  },
  searchInput: { flex: 1, fontSize: Typography.fontSize.sm, color: Colors.gray900, height: 38 },
  dropdown: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.gray50, borderRadius: Radius.md,
    paddingHorizontal: isSmall ? 8 : 12, height: 38,
    minWidth: isSmall ? 88 : 108,
    borderWidth: 1, borderColor: Colors.gray200,
  },
  dropText: { flex: 1, fontSize: isSmall ? 11 : Typography.fontSize.sm, color: Colors.gray700, fontWeight: '600' },

  tableCard: {
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.gray100, overflow: 'hidden',
  },
  headerRow: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderBottomWidth: 1.5, borderBottomColor: Colors.gray200 },
  dataRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  rowEven: { backgroundColor: '#F7FBFF' },

  stickyCol: {
    width: STICKY_W, paddingHorizontal: isSmall ? 8 : 10, paddingVertical: 0,
    height: 44, flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRightWidth: 1, borderRightColor: Colors.gray200,
    backgroundColor: Colors.white,
  },
  headerEmpText: { fontSize: 9, fontWeight: '700', color: Colors.gray600, letterSpacing: 0.7 },

  dayCol: { width: DAY_W, alignItems: 'center', justifyContent: 'center', paddingVertical: 6 },
  weekendCol: { backgroundColor: '#F8FAFC' },
  dayName: { fontSize: 7, fontWeight: '700', color: Colors.gray500, letterSpacing: 0.4, textTransform: 'uppercase' },
  dayNum: { fontSize: isSmall ? 10 : 11, fontWeight: '800', color: Colors.gray800, marginTop: 1 },
  weekendText: { color: Colors.gray400 },

  empAvatar: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  empAvatarText: { fontSize: 9, fontWeight: '700', color: '#fff' },
  empName: { flex: 1, fontSize: isSmall ? 10 : 11, fontWeight: '600', color: Colors.gray900 },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function AttendanceScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('monthly');
  const [selectedMonth, setSelectedMonth] = useState(5);
  const [selectedYear] = useState(2025);
  const [showMonthDrop, setShowMonthDrop] = useState(false);

  const totalEmployees = mockEmployees.length;
  const workingDays = useMemo(() => {
    const days = getDaysInMonth(selectedYear, selectedMonth);
    let count = 0;
    for (let d = 1; d <= days; d++) if (!isWeekend(selectedYear, selectedMonth, d)) count++;
    return count;
  }, [selectedYear, selectedMonth]);

  const totalPresent = mockEmployees.reduce((sum, emp) => {
    const statuses = getEmployeeMonthStatus(emp.id, selectedYear, selectedMonth);
    return sum + Object.values(statuses).filter(s => s === 'present' || s === 'active').length;
  }, 0);

  const totalAbsent = mockEmployees.reduce((sum, emp) => {
    const statuses = getEmployeeMonthStatus(emp.id, selectedYear, selectedMonth);
    return sum + Object.values(statuses).filter(s => s === 'absent').length;
  }, 0);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <LinearGradient colors={['#56CCF2', '#4DA8DA']} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.blob} />
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Attendance</Text>
          <TouchableOpacity
            style={styles.monthBtn}
            onPress={() => setShowMonthDrop(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.monthBtnText}>{MONTHS[selectedMonth].slice(0, 3)} {selectedYear}</Text>
            <Ionicons name="chevron-down" size={13} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <View style={styles.curve} />
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tabs */}
        <View style={styles.tabBar}>
          {(['monthly', 'daily'] as TabId[]).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'monthly' ? 'Monthly Overview' : 'Daily Report'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          <SummaryCard icon="people" iconBg="#4DA8DA" count={totalEmployees} label="Total Employees" />
          <SummaryCard icon="close-circle" iconBg="#F87171" count={totalAbsent} label="Absent Days" />
          <SummaryCard icon="checkmark-circle" iconBg="#34D399" count={totalPresent} label="Present Days" />
          <SummaryCard icon="briefcase" iconBg="#FBBF24" count={workingDays} label="Working Days" />
        </View>

        {/* Tab Content */}
        {activeTab === 'monthly'
          ? <MonthlyOverviewTab year={selectedYear} month={selectedMonth} />
          : <DailyReportTab />
        }

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Month Dropdown */}
      <DropdownModal
        visible={showMonthDrop}
        options={MONTHS}
        selected={MONTHS[selectedMonth]}
        onSelect={v => setSelectedMonth(MONTHS.indexOf(v))}
        onClose={() => setShowMonthDrop(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  header: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 52,
    paddingHorizontal: Spacing[4],
    paddingBottom: 46,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute', width: 220, height: 220, borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.10)', top: -70, right: -40,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: Typography.fontSize.lg, fontWeight: '800', color: Colors.white },
  monthBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 6,
    paddingHorizontal: isSmall ? 8 : 12,
    borderRadius: Radius.full, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  monthBtnText: { fontSize: isSmall ? 11 : Typography.fontSize.sm, fontWeight: '700', color: Colors.white },
  curve: { position: 'absolute', bottom: -1, left: 0, right: 0, height: 36, backgroundColor: Colors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28 },

  scroll: { flex: 1, marginTop: -24 },
  scrollContent: { paddingHorizontal: isSmall ? 12 : Spacing[4], paddingTop: 16, paddingBottom: 40 },

  tabBar: { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: Radius.lg, padding: 4, marginBottom: 14, borderWidth: 1, borderColor: Colors.gray100, ...Shadow.sm as any },
  tab: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: Radius.md },
  tabActive: { borderBottomWidth: 3, borderBottomColor: Colors.primary, backgroundColor: Colors.overlayLight },
  tabText: { fontSize: isSmall ? 11 : Typography.fontSize.sm, fontWeight: '600', color: Colors.gray500 },
  tabTextActive: { color: Colors.primary },

  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
});
