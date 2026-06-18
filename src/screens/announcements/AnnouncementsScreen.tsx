import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../design-system/tokens';
import { Card, SectionHeader } from '../../design-system/components/Card';
import { Badge } from '../../design-system/components/Badge';
import { mockAnnouncements } from '../../data/mockData';

const CATEGORIES = ['All', 'Company', 'Policy', 'Event', 'Holiday'];

export default function AnnouncementsScreen() {
  const [category, setCategory] = useState('All');
  const filtered = category === 'All' ? mockAnnouncements : mockAnnouncements.filter(a => a.category === category);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={styles.header}>
        <View style={styles.headerCircle} />
        <Text style={styles.headerTitle}>Announcements</Text>
        <Text style={styles.headerSub}>{mockAnnouncements.length} company updates</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <SectionHeader title="Pinned" />
        {mockAnnouncements.filter(a => a.pinned).map(ann => (
          <TouchableOpacity key={ann.id} style={styles.pinnedCard} activeOpacity={0.85}>
            <View style={styles.pinnedHeader}>
              <Badge label={ann.category} variant="primary" />
              <Badge label={ann.priority} variant={ann.priority === 'high' ? 'danger' : 'warning'} />
              <Ionicons name="pin" size={14} color={Colors.primary} style={{ marginLeft: 'auto' }} />
            </View>
            <Text style={styles.pinnedTitle}>{ann.title}</Text>
            <Text style={styles.pinnedExcerpt} numberOfLines={2}>{ann.content}</Text>
            <View style={styles.pinnedFooter}>
              <Text style={styles.pinnedBy}>By {ann.author}</Text>
              <Text style={styles.pinnedDate}>{ann.date}</Text>
            </View>
            <View style={styles.readBar}>
              <View style={[styles.readFill, { width: `${(ann.readBy / ann.totalEmployees) * 100}%` }]} />
            </View>
            <Text style={styles.readCount}>{ann.readBy}/{ann.totalEmployees} read</Text>
          </TouchableOpacity>
        ))}

        <SectionHeader title="All Announcements" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity key={cat} style={[styles.filterTab, category === cat && styles.filterTabActive]} onPress={() => setCategory(cat)}>
              <Text style={[styles.filterText, category === cat && styles.filterTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filtered.map(ann => (
          <Card key={ann.id} onPress={() => {}}>
            <View style={styles.annHeader}>
              <Badge label={ann.category} variant="primary" />
              {ann.pinned && <Ionicons name="pin" size={14} color={Colors.primary} style={{ marginLeft: 8 }} />}
            </View>
            <Text style={styles.annTitle}>{ann.title}</Text>
            <Text style={styles.annExcerpt} numberOfLines={2}>{ann.content}</Text>
            <View style={styles.annFooter}>
              <View style={styles.annAuthor}>
                <View style={styles.annAuthorAvatar}>
                  <Text style={styles.annAuthorInitial}>{ann.author[0]}</Text>
                </View>
                <Text style={styles.annAuthorName}>{ann.author}</Text>
              </View>
              <View style={styles.annDateRow}>
                <Ionicons name="time-outline" size={12} color={Colors.gray400} />
                <Text style={styles.annDate}> {ann.date}</Text>
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
  headerCircle: { position: 'absolute', width: 240, height: 240, borderRadius: 120, backgroundColor: 'rgba(96,165,250,0.15)', top: -60, right: -40 },
  headerTitle: { fontSize: Typography.fontSize.xl, fontWeight: '800', color: Colors.white, marginBottom: 4 },
  headerSub: { fontSize: Typography.fontSize.sm, color: 'rgba(255,255,255,0.7)' },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing[4] },
  pinnedCard: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[4], marginBottom: Spacing[3], borderLeftWidth: 4, borderLeftColor: Colors.primary, ...Shadow.sm },
  pinnedHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  pinnedTitle: { fontSize: Typography.fontSize.md, fontWeight: '700', color: Colors.gray900, marginBottom: 6 },
  pinnedExcerpt: { fontSize: Typography.fontSize.sm, color: Colors.gray500, lineHeight: 20, marginBottom: 10 },
  pinnedFooter: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  pinnedBy: { fontSize: Typography.fontSize.xs, color: Colors.gray500 },
  pinnedDate: { fontSize: Typography.fontSize.xs, color: Colors.gray400 },
  readBar: { height: 4, backgroundColor: Colors.gray200, borderRadius: 2, overflow: 'hidden', marginBottom: 4 },
  readFill: { height: 4, backgroundColor: Colors.primary, borderRadius: 2 },
  readCount: { fontSize: Typography.fontSize.xs, color: Colors.gray400 },
  filterRow: { marginBottom: Spacing[3] },
  filterTab: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: Radius.full, marginRight: 8, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.gray200 },
  filterTabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: Typography.fontSize.xs, color: Colors.gray600, fontWeight: '600' },
  filterTextActive: { color: Colors.white },
  annHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  annTitle: { fontSize: Typography.fontSize.base, fontWeight: '700', color: Colors.gray900, marginBottom: 6 },
  annExcerpt: { fontSize: Typography.fontSize.sm, color: Colors.gray500, lineHeight: 20, marginBottom: 10 },
  annFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  annAuthor: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  annAuthorAvatar: { width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.overlayLight, alignItems: 'center', justifyContent: 'center' },
  annAuthorInitial: { fontSize: 11, fontWeight: '700', color: Colors.primary },
  annAuthorName: { fontSize: Typography.fontSize.xs, color: Colors.gray600 },
  annDateRow: { flexDirection: 'row', alignItems: 'center' },
  annDate: { fontSize: Typography.fontSize.xs, color: Colors.gray400 },
});
