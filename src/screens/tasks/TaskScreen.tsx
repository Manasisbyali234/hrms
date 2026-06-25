import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, StatusBar, TextInput, useWindowDimensions,
  Modal, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow, IconBox } from '../../design-system/tokens';
import { ProgressBar } from '../../design-system/components/Card';
import { Badge, statusToVariant } from '../../design-system/components/Badge';
import { mockTasks } from '../../data/mockData';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];
type Status   = 'todo' | 'in-progress' | 'completed' | 'paused';
type ViewMode = 'list' | 'grid' | 'table' | 'calendar';

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

const PRIORITY_BADGE: Record<string, { bg: string; text: string }> = {
  high:   { bg: '#FEE2E2', text: '#DC2626' },
  medium: { bg: '#FEF3C7', text: '#D97706' },
  low:    { bg: '#D1FAE5', text: '#059669' },
};

const STATUS_BADGE: Record<string, { bg: string; text: string }> = {
  completed:    { bg: '#D1FAE5', text: '#059669' },
  'in-progress':{ bg: '#DBEAFE', text: '#1D4ED8' },
  todo:         { bg: '#F3F4F6', text: '#6B7280' },
  paused:       { bg: '#FEF3C7', text: '#D97706' },
};

const TABLE_COLS = [
  { key: 'sl',       label: 'SL NO',        w: 60  },
  { key: 'details',  label: 'TASK DETAILS',  w: 200 },
  { key: 'priority', label: 'PRIORITY',      w: 100 },
  { key: 'team',     label: 'TEAM',          w: 110 },
  { key: 'timeline', label: 'TIMELINE',      w: 160 },
  { key: 'status',   label: 'STATUS',        w: 120 },
  { key: 'time',     label: 'TIME SPENT',    w: 130 },
  { key: 'actions',  label: 'ACTIONS',       w: 200 },
];

type TaskItem = (typeof mockTasks)[0];

// ── View Modal ───────────────────────────────────────────────
function ViewModal({ task, onClose }: { task: TaskItem; onClose: () => void }) {
  const stat = STATUS_BADGE[task.status] ?? STATUS_BADGE.todo;
  const pri  = PRIORITY_BADGE[task.priority] ?? PRIORITY_BADGE.low;
  const ts   = task.timeSpent;
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={mo.overlay}>
        <View style={mo.sheet}>
          <View style={mo.sheetHeader}>
            <Text style={mo.sheetTitle}>Task Details</Text>
            <TouchableOpacity onPress={onClose} style={mo.closeBtn}>
              <Ionicons name="close" size={20} color={Colors.gray600} />
            </TouchableOpacity>
          </View>

          <Text style={mo.label}>PROJECT</Text>
          <Text style={mo.value}>{task.project}</Text>

          <Text style={mo.label}>TASK TITLE</Text>
          <Text style={[mo.value, { fontWeight: '700', fontSize: 15, color: Colors.gray900 }]}>{task.title}</Text>

          <View style={mo.row}>
            <View style={mo.half}>
              <Text style={mo.label}>PRIORITY</Text>
              <View style={[mo.pill, { backgroundColor: pri.bg }]}>
                <Text style={[mo.pillTxt, { color: pri.text }]}>{task.priority.toUpperCase()}</Text>
              </View>
            </View>
            <View style={mo.half}>
              <Text style={mo.label}>STATUS</Text>
              <View style={[mo.pill, { backgroundColor: stat.bg }]}>
                <Text style={[mo.pillTxt, { color: stat.text }]}>
                  {task.status === 'in-progress' ? 'IN PROGRESS' : task.status.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>

          <View style={mo.row}>
            <View style={mo.half}>
              <Text style={mo.label}>START DATE</Text>
              <Text style={mo.value}>{task.startDate}</Text>
            </View>
            <View style={mo.half}>
              <Text style={mo.label}>DUE DATE</Text>
              <Text style={mo.value}>{task.dueDate}</Text>
            </View>
          </View>

          <Text style={mo.label}>TIME SPENT</Text>
          <Text style={mo.value}>
            {ts.days > 0 || ts.hours > 0 || ts.minutes > 0
              ? `${ts.days}d ${ts.hours}h ${ts.minutes}m`
              : '—'}
          </Text>

          <Text style={mo.label}>TEAM</Text>
          <View style={mo.avatarRow}>
            {(task.team ?? []).map((m: { initials: string; color: string }, i: number) => (
              <View key={i} style={[mo.avatar, { backgroundColor: m.color }]}>
                <Text style={mo.avatarTxt}>{m.initials}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={mo.doneBtn} onPress={onClose}>
            <Text style={mo.doneTxt}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ── Edit Modal ───────────────────────────────────────────────
function EditModal({ task, onSave, onClose }: {
  task: TaskItem;
  onSave: (updated: TaskItem) => void;
  onClose: () => void;
}) {
  const [title,    setTitle]    = useState(task.title);
  const [priority, setPriority] = useState(task.priority);
  const [status,   setStatus]   = useState(task.status);

  const PRIS = ['high', 'medium', 'low'];
  const STATS: Status[] = ['todo', 'in-progress', 'completed', 'paused'];

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={mo.overlay}>
        <View style={mo.sheet}>
          <View style={mo.sheetHeader}>
            <Text style={mo.sheetTitle}>Edit Task</Text>
            <TouchableOpacity onPress={onClose} style={mo.closeBtn}>
              <Ionicons name="close" size={20} color={Colors.gray600} />
            </TouchableOpacity>
          </View>

          <Text style={mo.label}>TASK TITLE</Text>
          <TextInput
            style={mo.input}
            value={title}
            onChangeText={setTitle}
            placeholderTextColor={Colors.gray400}
          />

          <Text style={mo.label}>PRIORITY</Text>
          <View style={mo.optRow}>
            {PRIS.map(p => {
              const cfg = PRIORITY_BADGE[p];
              const active = priority === p;
              return (
                <TouchableOpacity
                  key={p}
                  style={[mo.optBtn, active && { backgroundColor: cfg.bg, borderColor: cfg.text }]}
                  onPress={() => setPriority(p)}
                >
                  <Text style={[mo.optTxt, active && { color: cfg.text, fontWeight: '700' }]}>
                    {p.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={mo.label}>STATUS</Text>
          <View style={mo.optRow}>
            {STATS.map(st => {
              const cfg = STATUS_BADGE[st];
              const active = status === st;
              const lbl = st === 'in-progress' ? 'IN PROGRESS' : st.toUpperCase();
              return (
                <TouchableOpacity
                  key={st}
                  style={[mo.optBtn, active && { backgroundColor: cfg.bg, borderColor: cfg.text }]}
                  onPress={() => setStatus(st)}
                >
                  <Text style={[mo.optTxt, active && { color: cfg.text, fontWeight: '700' }]}>{lbl}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={mo.btnRow}>
            <TouchableOpacity style={mo.cancelBtn} onPress={onClose}>
              <Text style={mo.cancelTxt}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={mo.saveBtn}
              onPress={() => onSave({ ...task, title: title.trim() || task.title, priority, status })}
            >
              <Text style={mo.saveTxt}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const mo = StyleSheet.create({
  overlay:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet:       { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 10 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  sheetTitle:  { fontSize: 17, fontWeight: '700', color: Colors.gray900 },
  closeBtn:    { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center' },
  label:       { fontSize: 9, fontWeight: '700', color: Colors.gray400, letterSpacing: 0.8, marginTop: 4 },
  value:       { fontSize: 13, color: Colors.gray700, marginTop: 2 },
  row:         { flexDirection: 'row', gap: 16 },
  half:        { flex: 1, gap: 4 },
  pill:        { borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', marginTop: 4 },
  pillTxt:     { fontSize: 10, fontWeight: '700', letterSpacing: 0.4 },
  avatarRow:   { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 4 },
  avatar:      { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  avatarTxt:   { fontSize: 10, fontWeight: '700', color: Colors.white },
  doneBtn:     { backgroundColor: Colors.primary, borderRadius: Radius.md, paddingVertical: 12, alignItems: 'center', marginTop: 8 },
  doneTxt:     { fontSize: 14, fontWeight: '700', color: Colors.white },
  input:       { borderWidth: 1, borderColor: Colors.gray200, borderRadius: Radius.md, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, color: Colors.gray900, backgroundColor: Colors.gray50 },
  optRow:      { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optBtn:      { borderWidth: 1, borderColor: Colors.gray200, borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: Colors.gray50 },
  optTxt:      { fontSize: 10, fontWeight: '600', color: Colors.gray600 },
  btnRow:      { flexDirection: 'row', gap: 10, marginTop: 8 },
  cancelBtn:   { flex: 1, borderWidth: 1, borderColor: Colors.gray200, borderRadius: Radius.md, paddingVertical: 12, alignItems: 'center' },
  cancelTxt:   { fontSize: 14, fontWeight: '600', color: Colors.gray600 },
  saveBtn:     { flex: 2, backgroundColor: Colors.primary, borderRadius: Radius.md, paddingVertical: 12, alignItems: 'center' },
  saveTxt:     { fontSize: 14, fontWeight: '700', color: Colors.white },
});

// ── TableRow with action buttons ─────────────────────────────

function TableRow({ task, index, onView, onEdit, onDelete, onStatusChange }: {
  task: TaskItem;
  index: number;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: Status) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const pri  = PRIORITY_BADGE[task.priority] ?? PRIORITY_BADGE.low;
  const stat = STATUS_BADGE[task.status]     ?? STATUS_BADGE.todo;
  const ts   = task.timeSpent;

  const canPlay  = task.status === 'todo' || task.status === 'paused';
  const canPause = task.status === 'in-progress';
  const canStop  = task.status === 'in-progress' || task.status === 'paused';

  return (
    <View
      style={[tr.row, hovered && tr.rowHover, index % 2 === 1 && tr.rowAlt]}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
    >
      {/* SL No */}
      <View style={[tr.cell, { width: TABLE_COLS[0].w }]}>
        <Text style={tr.sl}>{String(index + 1).padStart(2, '0')}</Text>
      </View>

      {/* Task Details */}
      <View style={[tr.cell, { width: TABLE_COLS[1].w }]}>
        <Text style={tr.project}>{task.project.toUpperCase()}</Text>
        <Text style={tr.title} numberOfLines={2}>{task.title}</Text>
      </View>

      {/* Priority */}
      <View style={[tr.cell, { width: TABLE_COLS[2].w }]}>
        <View style={[tr.pill, { backgroundColor: pri.bg }]}>
          <Text style={[tr.pillText, { color: pri.text }]}>{task.priority.toUpperCase()}</Text>
        </View>
      </View>

      {/* Team */}
      <View style={[tr.cell, { width: TABLE_COLS[3].w }]}>
        <View style={tr.avatarRow}>
          {(task.team ?? []).slice(0, 3).map((m: { initials: string; color: string }, i: number) => (
            <View key={i} style={[tr.avatar, { backgroundColor: m.color, marginLeft: i > 0 ? -8 : 0, zIndex: 10 - i }]}>
              <Text style={tr.avatarText}>{m.initials}</Text>
            </View>
          ))}
          {(task.team?.length ?? 0) > 3 && (
            <View style={[tr.avatar, { backgroundColor: Colors.gray300, marginLeft: -8, zIndex: 0 }]}>
              <Text style={tr.avatarText}>+{task.team!.length - 3}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Timeline */}
      <View style={[tr.cell, { width: TABLE_COLS[4].w }]}>
        <View style={tr.timelineBox}>
          <View style={tr.timelineRow}>
            <View style={[tr.timelineDot, { backgroundColor: Colors.primary }]} />
            <Text style={tr.timelineDate}>{task.startDate}</Text>
          </View>
          <View style={tr.timelineLine} />
          <View style={tr.timelineRow}>
            <View style={[tr.timelineDot, { backgroundColor: Colors.danger }]} />
            <Text style={tr.timelineDate}>{task.dueDate}</Text>
          </View>
        </View>
      </View>

      {/* Status */}
      <View style={[tr.cell, { width: TABLE_COLS[5].w }]}>
        <View style={[tr.pill, { backgroundColor: stat.bg }]}>
          <Text style={[tr.pillText, { color: stat.text }]}>
            {task.status === 'in-progress' ? 'IN PROGRESS' : task.status.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Time Spent */}
      <View style={[tr.cell, { width: TABLE_COLS[6].w }]}>
        {ts.days > 0 || ts.hours > 0 || ts.minutes > 0 ? (
          <View style={tr.timeSpentBox}>
            {ts.days > 0 && (
              <View style={tr.timeUnit}>
                <Text style={tr.timeVal}>{ts.days}</Text>
                <Text style={tr.timeLabel}>Days</Text>
              </View>
            )}
            {ts.hours > 0 && (
              <View style={tr.timeUnit}>
                <Text style={tr.timeVal}>{ts.hours}</Text>
                <Text style={tr.timeLabel}>Hrs</Text>
              </View>
            )}
            {ts.minutes > 0 && (
              <View style={tr.timeUnit}>
                <Text style={tr.timeVal}>{ts.minutes}</Text>
                <Text style={tr.timeLabel}>Min</Text>
              </View>
            )}
          </View>
        ) : (
          <Text style={tr.timeNone}>—</Text>
        )}
      </View>

      {/* Actions */}
      <View style={[tr.cell, { width: TABLE_COLS[7].w }]}>
        <View style={tr.actionsRow}>
          {/* View */}
          <TouchableOpacity
            style={[tr.actionBtn, { backgroundColor: '#EFF6FF' }]}
            onPress={onView}
            hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
          >
            <Ionicons name="eye-outline" size={14} color="#3B82F6" />
          </TouchableOpacity>

          {/* Play — start / resume */}
          {canPlay && (
            <TouchableOpacity
              style={[tr.actionBtn, { backgroundColor: '#DCFCE7' }]}
              onPress={() => onStatusChange('in-progress')}
              hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
            >
              <Ionicons name="play" size={13} color="#16A34A" />
            </TouchableOpacity>
          )}

          {/* Pause */}
          {canPause && (
            <TouchableOpacity
              style={[tr.actionBtn, { backgroundColor: '#FEF9C3' }]}
              onPress={() => onStatusChange('paused')}
              hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
            >
              <Ionicons name="pause" size={13} color="#CA8A04" />
            </TouchableOpacity>
          )}

          {/* Stop / End */}
          {canStop && (
            <TouchableOpacity
              style={[tr.actionBtn, { backgroundColor: '#FEE2E2' }]}
              onPress={() => onStatusChange('completed')}
              hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
            >
              <Ionicons name="stop" size={13} color="#DC2626" />
            </TouchableOpacity>
          )}

          {/* Edit */}
          <TouchableOpacity
            style={[tr.actionBtn, { backgroundColor: Colors.warningLight }]}
            onPress={onEdit}
            hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
          >
            <Ionicons name="create-outline" size={14} color={Colors.warning} />
          </TouchableOpacity>

          {/* Delete */}
          <TouchableOpacity
            style={[tr.actionBtn, { backgroundColor: Colors.dangerLight }]}
            onPress={onDelete}
            hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
          >
            <Ionicons name="trash-outline" size={14} color={Colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const TOTAL_W = TABLE_COLS.reduce((s, c) => s + c.w, 0);

function TaskTable({ tasks: initialTasks, onView, onEdit, onDelete, onStatusChange }: {
  tasks: typeof mockTasks;
  onView: (task: TaskItem) => void;
  onEdit: (task: TaskItem) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Status) => void;
}) {
  return (
    <View style={tbl.card}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ width: TOTAL_W }}>
          <View style={tbl.header}>
            {TABLE_COLS.map(col => (
              <View key={col.key} style={[tbl.hCell, { width: col.w }]}>
                <Text style={tbl.hText}>{col.label}</Text>
              </View>
            ))}
          </View>
          {initialTasks.map((task, i) => (
            <TableRow
              key={task.id}
              task={task}
              index={i}
              onView={() => onView(task)}
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task.id)}
              onStatusChange={(status) => onStatusChange(task.id, status)}
            />
          ))}
          {initialTasks.length === 0 && (
            <View style={tbl.empty}>
              <Ionicons name="layers-outline" size={32} color={Colors.gray300} />
              <Text style={tbl.emptyText}>No tasks found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const tbl = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: Spacing[4],
    ...Shadow.md,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: Colors.gray50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  hCell: { paddingHorizontal: 12, justifyContent: 'center' },
  hText: { fontSize: 10, fontWeight: '700', color: Colors.gray500, letterSpacing: 0.8 },
  empty: { alignItems: 'center', paddingVertical: 40, gap: 10 },
  emptyText: { fontSize: Typography.fontSize.sm, color: Colors.gray400 },
});

const tr = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
    alignItems: 'center',
  },
  rowAlt:   { backgroundColor: Colors.gray50 + '80' },
  rowHover: { backgroundColor: Colors.overlayLight },
  cell: { paddingHorizontal: 12, justifyContent: 'center' },

  sl:       { fontSize: 12, fontWeight: '700', color: Colors.gray400 },
  project:  { fontSize: 9,  fontWeight: '700', color: Colors.primary, letterSpacing: 0.6, marginBottom: 3 },
  title:    { fontSize: 12, fontWeight: '700', color: Colors.gray900, lineHeight: 17 },

  pill:     { borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  pillText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },

  avatarRow: { flexDirection: 'row', alignItems: 'center' },
  avatar:    { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.white },
  avatarText:{ fontSize: 9, fontWeight: '700', color: Colors.white },

  timelineBox: { gap: 4 },
  timelineRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timelineDot: { width: 7, height: 7, borderRadius: 4 },
  timelineLine:{ width: 1, height: 10, backgroundColor: Colors.gray300, marginLeft: 3 },
  timelineDate:{ fontSize: 11, color: Colors.gray600, fontWeight: '500' },

  timeSpentBox:{ flexDirection: 'row', gap: 8, alignItems: 'flex-end' },
  timeUnit:    { alignItems: 'center', gap: 1 },
  timeVal:     { fontSize: 13, fontWeight: '700', color: Colors.gray900 },
  timeLabel:   { fontSize: 9,  fontWeight: '600', color: Colors.gray400, letterSpacing: 0.3 },
  timeNone:    { fontSize: 14, color: Colors.gray300, fontWeight: '600' },

  actionsRow:  { flexDirection: 'row', gap: 5, alignItems: 'center', flexWrap: 'nowrap' },
  actionBtn:   { width: 28, height: 28, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
});

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
  timeBox:     { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: Colors.gray50, borderRadius: Radius.full, paddingHorizontal: 7, paddingVertical: 3 },
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
    padding: 14, ...Shadow.sm,
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

  const [viewMode, setViewMode]       = useState<ViewMode>('list');
  const [search, setSearch]           = useState('');
  const [priority, setPriority]       = useState('All');
  const [status, setStatus]           = useState('All');
  const [project, setProject]         = useState('All Projects');
  const [showPriDrop, setShowPriDrop] = useState(false);
  const [showStaDrop, setShowStaDrop] = useState(false);
  const [showPrjDrop, setShowPrjDrop] = useState(false);
  const [tasks, setTasks]             = useState<typeof mockTasks>(mockTasks);
  const [viewTask, setViewTask]       = useState<TaskItem | null>(null);
  const [editTask, setEditTask]       = useState<TaskItem | null>(null);

  const handleStatusChange = (id: string, st: Status) =>
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: st } : t));

  const handleSave = (updated: TaskItem) => {
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    setEditTask(null);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => setTasks(prev => prev.filter(t => t.id !== id)) },
      ],
    );
  };

  const closeAll = () => { setShowPriDrop(false); setShowStaDrop(false); setShowPrjDrop(false); };

  const byStatus = (s: Status) => tasks.filter(t => t.status === s);
  const statCounts: Record<string, number> = {
    total:         tasks.length,
    'in-progress': byStatus('in-progress').length,
    completed:     byStatus('completed').length,
    overdue:       tasks.filter(t => t.status !== 'completed' && new Date(t.dueDate) < new Date()).length,
  };

  const filteredTasks = tasks.filter(t => {
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

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* ── Header ── */}
      <View style={s.header}>
        <View style={s.headerTop}>
          <View>
            <Text style={s.pageTitle}>My Tasks</Text>
            <Text style={s.pageSubtitle}>{tasks.length} tasks assigned to you</Text>
          </View>
          {/* Segmented toggle */}
          <View style={s.segmented}>
            {([
              { mode: 'list',     icon: 'list-outline'     as IoniconName, label: 'List'     },
              { mode: 'grid',     icon: 'grid-outline'     as IoniconName, label: 'Grid'     },
              { mode: 'table',    icon: 'apps-outline'     as IoniconName, label: 'Table'    },
              { mode: 'calendar', icon: 'calendar-outline' as IoniconName, label: 'Calendar' },
            ] as { mode: ViewMode; icon: IoniconName; label: string }[]).map(({ mode, icon, label }) => (
              <TouchableOpacity
                key={mode}
                style={[s.segBtn, viewMode === mode && s.segBtnActive]}
                onPress={() => setViewMode(mode)}
              >
                <Ionicons
                  name={icon}
                  size={14}
                  color={viewMode === mode ? Colors.white : Colors.gray500}
                />
                {!isSmall && (
                  <Text style={[s.segBtnText, viewMode === mode && s.segBtnTextActive]}>
                    {label}
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
            <View key={card.key} style={[s.statCard, s.statCardOverdue]}>
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
          </View>

          {/* Add Task — full-width on mobile */}
          <TouchableOpacity style={s.addBtn} activeOpacity={0.85}>
            <Ionicons name="add" size={16} color={Colors.white} />
            <Text style={s.addBtnText}>Add Task</Text>
          </TouchableOpacity>
        </View>

        {/* ── Content ── */}
        {filteredTasks.length === 0 ? (
          <View style={s.empty}>
            <Ionicons name="search-outline" size={40} color={Colors.gray300} />
            <Text style={s.emptyText}>No tasks match your filters</Text>
          </View>
        ) : viewMode === 'calendar' ? (
          <View style={s.calendarPlaceholder}>
            <Ionicons name="calendar-outline" size={48} color={Colors.gray300} />
            <Text style={s.emptyText}>Calendar view coming soon</Text>
          </View>
        ) : viewMode === 'table' ? (
          <TaskTable
            tasks={filteredTasks}
            onView={setViewTask}
            onEdit={setEditTask}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        ) : viewMode === 'grid' ? (
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
        ) : (
          <View>
            {filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onPress={() => router.push(`/tasks/${task.id}` as any)}
              />
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {viewTask && <ViewModal task={viewTask} onClose={() => setViewTask(null)} />}
      {editTask && <EditModal task={editTask} onSave={handleSave} onClose={() => setEditTask(null)} />}
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
    flexShrink: 1,
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
    ...Shadow.sm,
  },
  statCardOverdue: {},
  statIcon: {
    width: IconBox.size, height: IconBox.size, borderRadius: IconBox.radius,
    backgroundColor: IconBox.bg, alignItems: 'center', justifyContent: 'center',
    marginBottom: 8, ...IconBox.shadow as any,
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
    gap: 10,
    ...Shadow.sm,
    zIndex: 10,
  },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.gray50, borderRadius: Radius.md,
    paddingHorizontal: 12, paddingVertical: 9,
  },
  searchInput: {
    flex: 1, fontSize: Typography.fontSize.sm,
    color: Colors.gray900, padding: 0,
  },
  dropRow: {
    flexDirection: 'row', alignItems: 'center',
    flexWrap: 'wrap', gap: 8, zIndex: 10,
  },
  viewSwitcher: { display: 'none' as any },
  viewBtn:       { padding: 8 },
  viewBtnActive: {},

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
