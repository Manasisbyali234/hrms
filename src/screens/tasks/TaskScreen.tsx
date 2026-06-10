import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../design-system/tokens';
import { Card, SectionHeader, ProgressBar } from '../../design-system/components/Card';
import { Badge, statusToVariant } from '../../design-system/components/Badge';
import { mockTasks } from '../../data/mockData';

type Status = 'todo' | 'in-progress' | 'completed';

const KANBAN_COLUMNS: { status: Status; label: string; color: string; iconName: React.ComponentProps<typeof Ionicons>['name'] }[] = [
  { status: 'todo',        label: 'To Do',      color: Colors.gray400,  iconName: 'bookmark-outline' },
  { status: 'in-progress', label: 'In Progress', color: Colors.primary,  iconName: 'flash-outline' },
  { status: 'completed',   label: 'Done',        color: Colors.success,  iconName: 'checkmark-circle-outline' },
];

export default function TaskScreen() {
  const router = useRouter();
  const [view, setView] = useState<'kanban' | 'list'>('list');

  const byStatus = (status: Status) => mockTasks.filter(t => t.status === status);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <View style={styles.header}>
        <View style={styles.headerCircle} />
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>My Tasks</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={[styles.viewToggle, view === 'kanban' && styles.viewToggleActive]} onPress={() => setView('kanban')}>
              <Ionicons name="grid-outline" size={18} color={view === 'kanban' ? Colors.primary : Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.viewToggle, view === 'list' && styles.viewToggleActive]} onPress={() => setView('list')}>
              <Ionicons name="list-outline" size={18} color={view === 'list' ? Colors.primary : Colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNum}>{byStatus('todo').length}</Text>
            <Text style={styles.summaryLabel}>To Do</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNum}>{byStatus('in-progress').length}</Text>
            <Text style={styles.summaryLabel}>In Progress</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNum}>{byStatus('completed').length}</Text>
            <Text style={styles.summaryLabel}>Completed</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNum}>{mockTasks.length}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {view === 'list' ? (
          // List View
          <>
            {KANBAN_COLUMNS.map(col => (
              byStatus(col.status).length > 0 && (
                <View key={col.status}>
                  <View style={styles.columnHeader}>
                    <View style={[styles.columnDot, { backgroundColor: col.color }]} />
                    <Ionicons name={col.iconName} size={15} color={col.color} style={{ marginRight: 4 }} />
                    <Text style={styles.columnTitle}>{col.label}</Text>
                    <View style={[styles.columnCount, { backgroundColor: col.color + '20' }]}>
                      <Text style={[styles.columnCountText, { color: col.color }]}>{byStatus(col.status).length}</Text>
                    </View>
                  </View>
                  {byStatus(col.status).map(task => (
                    <Card key={task.id} onPress={() => router.push(`/tasks/${task.id}` as any)}>
                      <View style={styles.taskHeader}>
                        <Text style={styles.taskTitle} numberOfLines={2}>{task.title}</Text>
                        <Badge
                          label={task.priority}
                          variant={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'neutral'}
                        />
                      </View>
                      <View style={styles.taskProjectRow}>
                        <Ionicons name="folder-outline" size={12} color={Colors.gray500} />
                        <Text style={styles.taskProject}> {task.project}</Text>
                      </View>
                      <View style={styles.taskFooter}>
                        <View style={styles.taskDueRow}>
                          <Ionicons name="calendar-outline" size={12} color={Colors.gray400} />
                          <Text style={styles.taskDue}> Due {task.dueDate}</Text>
                        </View>
                        <Badge label={task.status.replace('-', ' ')} variant={statusToVariant[task.status] || 'neutral'} />
                      </View>
                      {task.progress > 0 && (
                        <View style={{ marginTop: 10 }}>
                          <View style={styles.progressHeader}>
                            <Text style={styles.progressLabel}>Progress</Text>
                            <Text style={styles.progressValue}>{task.progress}%</Text>
                          </View>
                          <ProgressBar
                            progress={task.progress}
                            color={task.status === 'completed' ? Colors.success : Colors.primary}
                          />
                        </View>
                      )}
                    </Card>
                  ))}
                </View>
              )
            ))}
          </>
        ) : (
          // Kanban View (horizontal scroll per column)
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {KANBAN_COLUMNS.map(col => (
              <View key={col.status} style={styles.kanbanColumn}>
                <View style={[styles.kanbanHeader, { backgroundColor: col.color + '15', borderTopColor: col.color }]}>
                <Text style={[styles.kanbanTitle, { color: col.color }]}>
                    <Ionicons name={col.iconName} size={13} color={col.color} /> {col.label}
                  </Text>
                  <View style={[styles.kanbanCount, { backgroundColor: col.color }]}>
                    <Text style={styles.kanbanCountText}>{byStatus(col.status).length}</Text>
                  </View>
                </View>
                {byStatus(col.status).map(task => (
                  <Card key={task.id} style={styles.kanbanCard} onPress={() => {}}>
                    <Text style={styles.kanbanTaskTitle} numberOfLines={2}>{task.title}</Text>
                    <View style={styles.kanbanProjectRow}>
                    <Ionicons name="folder-outline" size={11} color={Colors.gray500} />
                    <Text style={styles.kanbanProject} numberOfLines={1}> {task.project}</Text>
                  </View>
                    <View style={styles.kanbanFooter}>
                      <Badge label={task.priority} variant={task.priority === 'high' ? 'danger' : 'warning'} />
                      <Text style={styles.kanbanDue}>{task.dueDate.split('-').slice(1).join('/')}</Text>
                    </View>
                  </Card>
                ))}
              </View>
            ))}
          </ScrollView>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },

  header: {
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 56,
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[5],
    overflow: 'hidden',
  },
  headerCircle: {
    position: 'absolute', width: 240, height: 240, borderRadius: 120,
    backgroundColor: 'rgba(96,165,250,0.15)', top: -60, right: -40,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing[4] },
  headerTitle: { fontSize: Typography.fontSize.xl, fontWeight: '800', color: Colors.white },
  headerRight: { flexDirection: 'row', gap: 8 },
  viewToggle: {
    padding: 8, borderRadius: Radius.sm,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  viewToggleActive: { backgroundColor: Colors.white },

  summary: {
    flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: Radius.lg, paddingVertical: 12,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryNum: { fontSize: Typography.fontSize['2xl'], fontWeight: '800', color: Colors.white },
  summaryLabel: { fontSize: Typography.fontSize.xs, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  summaryDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },

  scroll: { flex: 1 },
  scrollContent: { padding: Spacing[4] },

  columnHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginTop: 8 },
  columnDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  columnTitle: { fontSize: Typography.fontSize.base, fontWeight: '700', color: Colors.gray900, flex: 1 },
  columnCount: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full },
  columnCountText: { fontSize: Typography.fontSize.xs, fontWeight: '700' },

  taskHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 },
  taskTitle: { flex: 1, fontSize: Typography.fontSize.base, fontWeight: '700', color: Colors.gray900, marginRight: 8 },
  taskProjectRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  taskProject: { fontSize: Typography.fontSize.xs, color: Colors.gray500 },
  taskDueRow: { flexDirection: 'row', alignItems: 'center' },
  taskFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  taskDue: { fontSize: Typography.fontSize.xs, color: Colors.gray400 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  progressLabel: { fontSize: Typography.fontSize.xs, color: Colors.gray500 },
  progressValue: { fontSize: Typography.fontSize.xs, color: Colors.primary, fontWeight: '700' },

  // Kanban
  kanbanColumn: { width: 220, marginRight: 12 },
  kanbanHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderRadius: Radius.md, borderTopWidth: 3, padding: 10, marginBottom: 8,
  },
  kanbanTitle: { fontSize: Typography.fontSize.sm, fontWeight: '700' },
  kanbanCount: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  kanbanCountText: { fontSize: Typography.fontSize.xs, color: Colors.white, fontWeight: '700' },
  kanbanCard: { marginBottom: 8, padding: 12 },
  kanbanTaskTitle: { fontSize: Typography.fontSize.sm, fontWeight: '600', color: Colors.gray900, marginBottom: 6 },
  kanbanProjectRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  kanbanProject: { fontSize: Typography.fontSize.xs, color: Colors.gray500 },
  kanbanFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  kanbanDue: { fontSize: Typography.fontSize.xs, color: Colors.gray400 },

  // FAB
  fab: {
    position: 'absolute', right: 20, bottom: 100,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    ...Shadow.lg,
  },
  fabText: {},
});
