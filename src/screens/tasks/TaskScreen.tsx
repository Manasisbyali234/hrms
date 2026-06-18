import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, StatusBar, TextInput, useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../design-system/tokens';
import { ProgressBar } from '../../design-system/components/Card';
import { Badge, statusToVariant } from '../../design-system/components/Badge';
import { mockTasks } from '../../data/mockData';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];
type Status   = 'todo' | 'in-progress' | 'completed';
type ViewMode = 'table' | 'calendar';
type ListMode = 'list' | 'grid';

const STAT_CARDS: {
  key: string; label: string;
  icon: IoniconName; iconBg: string; iconColor: string;
}[] = [
  { key: 'total',        label: 'TOTAL',      icon: 'layers-outline',           iconBg: '#E8F4FD', iconColor: Colors.primary },
  { key: 'in-progress',  label: 'IN PROGRESS',icon: 'flash-outline',            iconBg: '#FEF3C7', iconColor: Colors.warning },
  { key: 'completed',    label: 'DONE',        icon: 'checkmark-circle-outline', iconBg: '#D1FAE5', iconColor: Colors.success },
  { key: 'overdue',      label: 'OVERDUE',     icon: 'alert-circle-outline',     iconBg: '#FEE2E2', iconColor: Colors.danger  },
];

const PRIORITY_OPTIONS = ['All', 'High', 'Medium', 'Low'];
const STATUS_OPTIONS   = ['All', 'To Do', 'In Progress', 'Completed'];
const PROJECT_OPTIONS  = ['All Projects', 'HRMS Mobile App', 'MMNext Platform'];

const PRIORITY_VARIANT: Record<string, 'danger' | 'warning' | 'neutral'> = {
  high: 'danger', medium: 'warning', low: 'neutral',
};

const ACTION_BTNS: { icon: IoniconName; color: string; bg: string }[] = [
  { icon: 'eye-outline',    color: Colors.primary, bg: Colors.overlayLight },
  { icon: 'create-outline', color: Colors.warning,  bg: Colors.warningLight },
  { icon: 'trash-outline',  color: Colors.danger,   bg: Colors.dangerLight  },
];

function getOverdueCount() {
  const today = new Date();
  return mockTasks.filter(t => t.status !== 'completed' && new Date(t.dueDate) < today).length;
}

function formatTimeSpent(ts: (typeof mockTasks)[0]['timeSpent']) {
  if (ts.days > 0)    return `${ts.days}d ${ts.hours}h`;
  if (ts.hours > 0)   return `${ts.hours}h ${ts.minutes}m`;
  if (ts.minutes > 0) return `${ts.minutes}m`;
  return '—';
}

// ── Dropdown ────────────────────────────────────────────────
function Dropdown({
  value, options, open, onToggle, onSelect, alignRight,
}: {
  value: string; options: string[]; open: boolean;
  onToggle: () => void; onSelect: (o: string) => void; alignRight?: boolean;
}) {
  return (
    <View style={dd.wrapper}>
      <TouchableOpacity style={dd.btn} onPress={onToggle} activeOpacity={0.75}>
        <Text style={dd.btnText} numberOfLines={1}>{value}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={12} color={Colors.gray500} />
      </TouchableOpacity>
      {open && (
        <View style={[dd.menu, alignRight && dd.menuRight]}>
          {options.map(o => (
            <TouchableOpacity key={o} style={dd.item} onPress={() => onSelect(o)} activeOpacity={0.7}>
              <Text style={[dd.itemText, value === o && dd.itemActive]}>{o}</Text>
              {value === o && <Ionicons name="checkmark" size={13} color={Colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const dd = StyleSheet.create({
  wrapper:   { position: 'relative', zIndex: 20 },
  btn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.gray50, borderRadius: Radius.md,
    paddingHorizontal: 10, paddingVertical: 8,
    borderWidth: 1, borderColor: Colors.gray200,
    minWidth: 72,
  },
  btnText:   { fontSize: Typography.fontSize.xs, color: Colors.gray700, fontWeight: '500', flex: 1 },
  menu: {
    position: 'absolute', top: 38, left: 0,
    minWidth: 140, backgroundColor: Colors.white,
    borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.gray200,
    zIndex: 9999, elevation: 20,
    ...Shadow.md,
  },
  menuRight: { left: 'auto' as any, right: 0 },
  item:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 11 },
  itemText:  { fontSize: Typography.fontSize.sm, color: Colors.gray700 },
  itemActive:{ color: Colors.primary, fontWeight: '700' },
});

// ── Task Card (list mode) ────────────────────────────────────
function TaskCard({ task, onPress }: { task: (typeof mockTasks)[0]; onPress: () => void }) {
  const isOverdue = task.status !== 'completed' && new Date(task.dueDate) < new Date();
  return (
    <TouchableOpacity style={tc.card} onPress={onPress} activeOpacity={0.82}>
      {/* Top row: title + priority badge */}
      <View style={tc.topRow}>
        <Text style={tc.title} numberOfLines={2}>{task.title}</Text>
        <Badge label={task.priority} variant={PRIORITY_VARIANT[task.priority] ?? 'neutral'} dot />
      </View>

      {/* Project */}
      <View style={tc.metaRow}>
        <Ionicons name="folder-outline" size={11} color={Colors.gray400} />
        <Text style={tc.metaText} numberOfLines={1}> {task.project}</Text>
      </View>

      {/* Progress */}
      {task.progress > 0 && (
        <View style={tc.progressWrap}>
          <ProgressBar
            progress={task.progress}
            color={task.status === 'completed' ? Colors.success : Colors.primary}
          />
          <Text style={tc.progressPct}>{task.progress}%</Text>
        </View>
      )}

      {/* Bottom row: status | due | time | actions */}
      <View style={tc.bottomRow}>
        <Badge label={task.status.replace('-', ' ')} variant={statusToVariant[task.status] ?? 'neutral'} dot />

        <View style={tc.metaRow}>
          <Ionicons name="flag-outline" size={11} color={isOverdue ? Colors.danger : Colors.gray400} />
          <Text style={[tc.metaText, isOverdue && { color: Colors.danger }]}> {task.dueDate}</Text>
        </View>

        <View style={tc.timeBox}>
          <Ionicons name="time-outline" size={11} color={Colors.gray500} />
          <Text style={tc.timeText}>{formatTimeSpent(task.timeSpent)}</Text>
        </View>

        <View style={tc.actions}>
          {ACTION_BTNS.map((btn, i) => (
            <TouchableOpacity
              key={i}
              style={[tc.actionBtn, { backgroundColor: btn.bg }]}
              onPress={onPress}
              hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
            >
              <Ionicons name={btn.icon} size={13} color={btn.color} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const tc = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.gray100,
    gap: 8,
    ...Shadow.sm,
  },
  topRow:      { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  title:       { flex: 1, fontSize: Typography.fontSize.sm, fontWeight: '700', color: Colors.gray900, lineHeight: 19 },
  metaRow:     { flexDirection: 'row', alignItems: 'center' },
  metaText:    { fontSize: 11, color: Colors.gray400 },
  progressWrap:{ gap: 4 },
  progressPct: { fontSize: 10, color: Colors.primary, fontWeight: '700', textAlign: 'right' },
  bottomRow:   { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginTop: 2 },
  timeBox:     { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: Colors.gray50, borderRadius: Radius.full, paddingHorizontal: 7, paddingVertical: 3, borderWidth: 1, borderColor: Colors.gray200 },
  timeText:    { fontSize: 10, fontWeight: '600', color: Colors.gray600 },
  actions:     { flexDirection: 'row', gap: 6, marginLeft: 'auto' },
  actionBtn:   { width: 26, height: 26, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
});

// ── Grid Card ────────────────────────────────────────────────
function GridCard({ task, onPress, cardWidth }: { task: (typeof mockTasks)[0]; onPress: () => void; cardWidth: number }) {
  return (
    <TouchableOpacity style={[gc.card, { width: cardWidth }]} onPress={onPress} activeOpacity={0.85}>
      <View style={gc.topRow}>
        <Badge label={task.priority} variant={PRIORITY_VARIANT[task.priority] ?? 'neutral'} />
        <Badge label={task.status.replace('-', ' ')} variant={statusToVariant[task.status] ?? 'neutral'} />
      </View>
      <Text style={gc.title} numberOfLines={2}>{task.title}</Text>
      <View style={gc.metaRow}>
        <Ionicons name="folder-outline" size={11} color={Colors.gray500} />
        <Text style={gc.meta} numberOfLines={1}> {task.project}</Text>
      </View>
      {task.progress > 0 && (
        <View style={{ marginTop: 8, gap: 4 }}>
          <ProgressBar progress={task.progress} color={task.status === 'completed' ? Colors.success : Colors.primary} />
          <Text style={gc.pct}>{task.progress}%</Text>
        </View>
      )}
      <View style={gc.dueRow}>
        <Ionicons name="calendar-outline" size={11} color={Colors.gray400} />
        <Text style={gc.due}> {task.dueDate}</Text>
      </View>
    </TouchableOpacity>
  );
}

const gc = StyleSheet.create({
  card: {
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    padding: 14, borderWidth: 1, borderColor: Colors.gray100, ...Shadow.sm,
  },
  topRow:  { flexDirection: 'row', gap: 6, marginBottom: 8, flexWrap: 'wrap' },
  title:   { fontSize: Typography.fontSize.sm, fontWeight: '700', color: Colors.gray900, lineHeight: 19, marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  meta:    { fontSize: 11, color: Colors.gray400 },
  pct:     { fontSize: 10, color: Colors.primary, fontWeight: '700', textAlign: 'right' },
  dueRow:  { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  due:     { fontSize: 11, color: Colors.gray400 },
});

// ── Main Screen ──────────────────────────────────────────────
export default function TaskScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 400;

  const [viewMode, setViewMode]       = useState<ViewMode>('table');
  const [listMode, setListMode]       = useState<ListMode>('list');
  const [search, setSearch]           = useState('');
  const [priority, setPriority]       = useState('All');
  const [status, setStatus]           = useState('All');
  const [project, setProject]         = useState('All Projects');
  const [showPriDrop, setShowPriDrop] = useState(false);
  const [showStaDrop, setShowStaDrop] = useState(false);
  const [showPrjDrop, setShowPrjDrop] = useState(false);

  const closeAll = () => { setShowPriDrop(false); setShowStaDrop(false); setShowPrjDrop(false); };

  const byStatus = (s: Status) => mockTasks.filter(t => t.status === s);
  const statCounts: Record<string, number> = {
    total:         mockTasks.length,
    'in-progress': byStatus('in-progress').length,
    completed:     byStatus('completed').length,
    overdue:       getOverdueCount(),
  };

  const filteredTasks = mockTasks.filter(t => {
    const matchSearch   = !search || t.title.toLowerCase().includes(search.toLowerCase());
    const matchPriority = priority === 'All' || t.priority === priority.toLowerCase();
    const matchStatus   =
      status === 'All' ||
      (status === 'To Do'       && t.status === 'todo') ||
      (status === 'In Progress' && t.status === 'in-progress') ||
      (status === 'Completed'   && t.status === 'completed');
    const matchProject = project === 'All Projects' || t.project === project;
    return matchSearch && matchPriority && matchStatus && matchProject;
  });

  // grid card width: 2 columns with gap
  const GRID_GAP  = 10;
  const PADDING   = Spacing[4] * 2;
  const gridCardW = (width - PADDING - GRID_GAP) / 2;

  // table width for horizontal scroll
  const MIN_TABLE_W = 720;
  const tableW = Math.max(width - PADDING, MIN_TABLE_W);

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* ── Header ── */}
      <View style={s.header}>
        <View style={s.headerTop}>
          <View>
            <Text style={s.pageTitle}>My Tasks</Text>
            <Text style={s.pageSubtitle}>{mockTasks.length} tasks assigned to you</Text>
          </View>
          {/* Segmented toggle */}
          <View style={s.segmented}>
            {(['table', 'calendar'] as ViewMode[]).map(mode => (
              <TouchableOpacity
                key={mode}
                style={[s.segBtn, viewMode === mode && s.segBtnActive]}
                onPress={() => setViewMode(mode)}
              >
                <Ionicons
                  name={mode === 'table' ? 'list-outline' : 'calendar-outline'}
                  size={14}
                  color={viewMode === mode ? Colors.white : Colors.gray500}
                />
                {!isSmall && (
                  <Text style={[s.segBtnText, viewMode === mode && s.segBtnTextActive]}>
                    {mode === 'table' ? 'Table' : 'Calendar'}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={closeAll}
      >
        {/* ── Stats 2×2 grid ── */}
        <View style={s.statsGrid}>
          {STAT_CARDS.map(card => (
            <View key={card.key} style={s.statCard}>
              <View style={[s.statIcon, { backgroundColor: card.iconBg }]}>
                <Ionicons name={card.icon} size={20} color={card.iconColor} />
              </View>
              <Text style={s.statLabel}>{card.label}</Text>
              <Text style={s.statValue}>{statCounts[card.key]}</Text>
            </View>
          ))}
        </View>

        {/* ── Filter Bar ── */}
        <View style={s.filterBar}>
          {/* Search */}
          <View style={s.searchBox}>
            <Ionicons name="search-outline" size={16} color={Colors.gray400} />
            <TextInput
              style={s.searchInput}
              placeholder="Search tasks..."
              placeholderTextColor={Colors.gray400}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close-circle" size={16} color={Colors.gray400} />
              </TouchableOpacity>
            )}
          </View>

          {/* Dropdowns row */}
          <View style={s.dropRow}>
            <Dropdown
              value={priority} options={PRIORITY_OPTIONS} open={showPriDrop}
              onToggle={() => { setShowPriDrop(v => !v); setShowStaDrop(false); setShowPrjDrop(false); }}
              onSelect={o => { setPriority(o); setShowPriDrop(false); }}
            />
            <Dropdown
              value={status} options={STATUS_OPTIONS} open={showStaDrop}
              onToggle={() => { setShowStaDrop(v => !v); setShowPriDrop(false); setShowPrjDrop(false); }}
              onSelect={o => { setStatus(o); setShowStaDrop(false); }}
            />
            <Dropdown
              value={project === 'All Projects' ? 'Project' : project.split(' ')[0]}
              options={PROJECT_OPTIONS} open={showPrjDrop} alignRight
              onToggle={() => { setShowPrjDrop(v => !v); setShowPriDrop(false); setShowStaDrop(false); }}
              onSelect={o => { setProject(o); setShowPrjDrop(false); }}
            />

            {/* Spacer */}
            <View style={{ flex: 1 }} />

            {/* View switcher */}
            <View style={s.viewSwitcher}>
              <TouchableOpacity
                style={[s.viewBtn, listMode === 'list' && s.viewBtnActive]}
                onPress={() => setListMode('list')}
              >
                <Ionicons name="list-outline" size={16} color={listMode === 'list' ? Colors.primary : Colors.gray400} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.viewBtn, listMode === 'grid' && s.viewBtnActive]}
                onPress={() => setListMode('grid')}
              >
                <Ionicons name="grid-outline" size={16} color={listMode === 'grid' ? Colors.primary : Colors.gray400} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Add Task — full-width on mobile */}
          <TouchableOpacity style={s.addBtn} activeOpacity={0.85}>
            <Ionicons name="add" size={16} color={Colors.white} />
            <Text style={s.addBtnText}>Add Task</Text>
          </TouchableOpacity>
        </View>

        {/* ── Content ── */}
        {viewMode === 'table' ? (
          filteredTasks.length === 0 ? (
            <View style={s.empty}>
              <Ionicons name="search-outline" size={40} color={Colors.gray300} />
              <Text style={s.emptyText}>No tasks match your filters</Text>
            </View>
          ) : listMode === 'list' ? (
            /* Card list — fully mobile responsive */
            <View>
              {filteredTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onPress={() => router.push(`/tasks/${task.id}` as any)}
                />
              ))}
            </View>
          ) : (
            /* Grid — 2 columns */
            <View style={s.gridContainer}>
              {filteredTasks.map(task => (
                <GridCard
                  key={task.id}
                  task={task}
                  cardWidth={gridCardW}
                  onPress={() => router.push(`/tasks/${task.id}` as any)}
                />
              ))}
            </View>
          )
        ) : (
          <View style={s.calendarPlaceholder}>
            <Ionicons name="calendar-outline" size={48} color={Colors.gray300} />
            <Text style={s.emptyText}>Calendar view coming soon</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Header
  header: {
    backgroundColor: Colors.white,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 56,
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
    ...Shadow.sm,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  pageTitle:    { fontSize: Typography.fontSize.xl, fontWeight: '800', color: Colors.gray900 },
  pageSubtitle: { fontSize: Typography.fontSize.xs, color: Colors.gray500, marginTop: 2 },

  segmented: {
    flexDirection: 'row',
    backgroundColor: Colors.gray100,
    borderRadius: Radius.lg,
    padding: 3,
  },
  segBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 7,
    borderRadius: Radius.md,
  },
  segBtnActive:     { backgroundColor: Colors.primary, ...Shadow.sm },
  segBtnText:       { fontSize: Typography.fontSize.xs, fontWeight: '600', color: Colors.gray500 },
  segBtnTextActive: { color: Colors.white },

  scroll:        { flex: 1 },
  scrollContent: { padding: Spacing[4] },

  // Stats — 2×2 grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: Spacing[4],
  },
  statCard: {
    width: '47.5%',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.gray100,
    ...Shadow.sm,
  },
  statIcon: {
    width: 40, height: 40, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 10, fontWeight: '700', color: Colors.gray500,
    letterSpacing: 0.5, marginBottom: 2,
  },
  statValue: {
    fontSize: Typography.fontSize['2xl'], fontWeight: '800', color: Colors.gray900,
  },

  // Filter bar
  filterBar: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing[3],
    marginBottom: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.gray100,
    gap: 10,
    ...Shadow.sm,
    zIndex: 10,
  },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.gray50, borderRadius: Radius.md,
    paddingHorizontal: 12, paddingVertical: 9,
    borderWidth: 1, borderColor: Colors.gray200,
  },
  searchInput: {
    flex: 1, fontSize: Typography.fontSize.sm,
    color: Colors.gray900, padding: 0,
  },
  dropRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 8, zIndex: 10,
  },
  viewSwitcher: {
    flexDirection: 'row', backgroundColor: Colors.gray50,
    borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.gray200,
    overflow: 'hidden',
  },
  viewBtn:       { padding: 8 },
  viewBtnActive: { backgroundColor: Colors.primaryLight + '30' },

  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: Colors.primary,
    borderRadius: Radius.md, paddingVertical: 10,
    ...Shadow.sm,
  },
  addBtnText: { fontSize: Typography.fontSize.sm, fontWeight: '700', color: Colors.white },

  // Grid
  gridContainer: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10,
  },

  // Empty / Calendar
  empty: { alignItems: 'center', paddingVertical: 56, gap: 12 },
  emptyText: { fontSize: Typography.fontSize.sm, color: Colors.gray400 },
  calendarPlaceholder: { alignItems: 'center', paddingVertical: 64, gap: 16 },
});
