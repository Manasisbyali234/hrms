import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../design-system/tokens';
import { Card, ProgressBar } from '../../design-system/components/Card';
import { Badge, statusToVariant } from '../../design-system/components/Badge';
import { Avatar } from '../../design-system/components/Avatar';
import { mockProjects } from '../../data/mockData';

export default function ProjectsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'active' | 'on-hold'>('all');
  const filtered = filter === 'all' ? mockProjects : mockProjects.filter(p => p.status === filter);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={styles.header}>
        <View style={styles.headerCircle} />
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Projects</Text>
        <Text style={styles.headerSub}>{mockProjects.length} total projects</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}><Text style={styles.statNum}>{mockProjects.filter(p => p.status === 'active').length}</Text><Text style={styles.statLabel}>Active</Text></View>
          <View style={styles.statBox}><Text style={styles.statNum}>{mockProjects.filter(p => p.status === 'on-hold').length}</Text><Text style={styles.statLabel}>On Hold</Text></View>
          <View style={styles.statBox}><Text style={styles.statNum}>{mockProjects.reduce((a, p) => a + p.tasksCompleted, 0)}</Text><Text style={styles.statLabel}>Tasks Done</Text></View>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {(['all', 'active', 'on-hold'] as const).map(f => (
            <TouchableOpacity key={f} style={[styles.filterTab, filter === f && styles.filterTabActive]} onPress={() => setFilter(f)}>
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f === 'all' ? 'All Projects' : f === 'active' ? 'Active' : 'On Hold'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filtered.map(project => (
          <Card key={project.id} onPress={() => router.push(`/projects/${project.id}` as any)} elevated>
            <View style={styles.projectHeader}>
              <View style={styles.projectIconBox}>
                <Ionicons name="folder-open-outline" size={22} color={Colors.primary} />
              </View>
              <View style={styles.projectMeta}>
                <Text style={styles.projectName}>{project.name}</Text>
                <Text style={styles.projectClient}>Client: {project.client}</Text>
              </View>
              <Badge label={project.status} variant={statusToVariant[project.status] || 'neutral'} />
            </View>
            <Text style={styles.projectDesc} numberOfLines={2}>{project.description}</Text>
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Progress</Text>
                <Text style={[styles.progressValue, { color: project.progress > 75 ? Colors.success : project.progress > 40 ? Colors.primary : Colors.warning }]}>
                  {project.progress}%
                </Text>
              </View>
              <ProgressBar progress={project.progress} color={project.progress > 75 ? Colors.success : project.progress > 40 ? Colors.primary : Colors.warning} height={8} />
            </View>
            <View style={styles.projectDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="checkmark-circle-outline" size={14} color={Colors.gray500} />
                <Text style={styles.detailText}> {project.tasksCompleted}/{project.tasksTotal} tasks</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="calendar-outline" size={14} color={Colors.gray500} />
                <Text style={styles.detailText}> Due {project.endDate}</Text>
              </View>
              <Badge label={project.priority} variant={project.priority === 'high' ? 'danger' : 'warning'} />
            </View>
            <View style={styles.teamSection}>
              <Text style={styles.teamLabel}>Team</Text>
              <View style={styles.teamAvatars}>
                {project.team.slice(0, 4).map((t, i) => (
                  <Avatar key={i} initials={t} size={28} style={{ marginLeft: i > 0 ? -10 : 0 }} />
                ))}
                {project.team.length > 4 && (
                  <View style={styles.moreMembersBox}>
                    <Text style={styles.moreMembersText}>+{project.team.length - 4}</Text>
                  </View>
                )}
              </View>
            </View>
          </Card>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { backgroundColor: Colors.primary, paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 56, paddingHorizontal: Spacing[4], paddingBottom: Spacing[5], overflow: 'hidden' },
  headerCircle: { position: 'absolute', width: 280, height: 280, borderRadius: 140, backgroundColor: 'rgba(96,165,250,0.15)', top: -80, right: -60 },
  backBtn: { marginBottom: 8 },
  headerTitle: { fontSize: Typography.fontSize.xl, fontWeight: '800', color: Colors.white, marginBottom: 4 },
  headerSub: { fontSize: Typography.fontSize.sm, color: 'rgba(255,255,255,0.7)', marginBottom: Spacing[4] },
  statsRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: Radius.lg, paddingVertical: 12 },
  statBox: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: Typography.fontSize['2xl'], fontWeight: '800', color: Colors.white },
  statLabel: { fontSize: Typography.fontSize.xs, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing[4] },
  filterRow: { marginBottom: Spacing[3] },
  filterTab: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: Radius.full, marginRight: 8, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.gray200 },
  filterTabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: Typography.fontSize.sm, color: Colors.gray600, fontWeight: '600' },
  filterTextActive: { color: Colors.white },
  projectHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  projectIconBox: { width: 44, height: 44, borderRadius: Radius.md, backgroundColor: Colors.overlayLight, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  projectMeta: { flex: 1 },
  projectName: { fontSize: Typography.fontSize.base, fontWeight: '700', color: Colors.gray900 },
  projectClient: { fontSize: Typography.fontSize.xs, color: Colors.gray500, marginTop: 2 },
  projectDesc: { fontSize: Typography.fontSize.sm, color: Colors.gray500, lineHeight: 20, marginBottom: 14 },
  progressSection: { marginBottom: 14 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: Typography.fontSize.xs, color: Colors.gray500 },
  progressValue: { fontSize: Typography.fontSize.sm, fontWeight: '700' },
  projectDetails: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  detailItem: { flexDirection: 'row', alignItems: 'center' },
  detailText: { fontSize: Typography.fontSize.xs, color: Colors.gray600 },
  teamSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  teamLabel: { fontSize: Typography.fontSize.xs, color: Colors.gray500, fontWeight: '600' },
  teamAvatars: { flexDirection: 'row' },
  moreMembersBox: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.gray200, marginLeft: -10, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.white },
  moreMembersText: { fontSize: 9, color: Colors.gray600, fontWeight: '700' },
});
