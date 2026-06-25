import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Platform, StatusBar, useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IconBox } from '../../design-system/tokens';
import { useRouter } from 'expo-router';
import { mockAnnouncements } from '../../data/mockData';

const FILTERS = ['All', 'Policy', 'Event', 'Holiday', 'Urgent', 'General'] as const;

const PRIORITY_META: Record<string, { color: string; bg: string }> = {
  Low:    { color: '#10B981', bg: '#D1FAE5' },
  Medium: { color: '#F59E0B', bg: '#FEF3C7' },
  High:   { color: '#2563EB', bg: '#DBEAFE' },
  Urgent: { color: '#FF4D6D', bg: '#FFE4EA' },
};

const CATEGORY_META: Record<string, { color: string; bg: string }> = {
  Policy:  { color: '#2563EB', bg: '#EFF6FF' },
  Event:   { color: '#10B981', bg: '#ECFDF5' },
  Holiday: { color: '#F59E0B', bg: '#FFFBEB' },
  General: { color: '#6B7280', bg: '#F3F4F6' },
  Urgent:  { color: '#FF4D6D', bg: '#FFE4EA' },
};

const TOP_BORDER: Record<string, string> = {
  Low: '#10B981', Medium: '#F59E0B', High: '#2563EB', Urgent: '#FF4D6D',
};

const cardShadow = Platform.OS === 'web'
  ? { boxShadow: '0px 2px 10px rgba(0,0,0,0.07)' }
  : { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 3 };

function StatCard({ icon, iconBg, iconColor, label, value, cardWidth }: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconBg: string; iconColor: string; label: string; value: number | string; cardWidth: number;
}) {
  return (
    <View style={[st.statCard, { width: cardWidth }]}>
      <View style={st.statIconCircle}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <Text style={st.statLabel}>{label}</Text>
      <Text style={st.statValue}>{value}</Text>
    </View>
  );
}

function AnnouncementCard({ item, cardWidth }: { item: typeof mockAnnouncements[0]; cardWidth: number }) {
  const pm = PRIORITY_META[item.priority] ?? PRIORITY_META.Medium;
  const cm = CATEGORY_META[item.category] ?? CATEGORY_META.General;
  const topColor = TOP_BORDER[item.priority] ?? '#2563EB';

  return (
    <View style={[st.annCard, cardShadow, { borderTopColor: topColor, width: cardWidth }]}>
      <View style={st.annCardHeader}>
        <View style={st.annBadgeRow}>
          <View style={[st.badge, { backgroundColor: pm.bg }]}>
            <Text style={[st.badgeText, { color: pm.color }]}>{item.priority}</Text>
          </View>
          <View style={[st.badge, { backgroundColor: cm.bg }]}>
            <Text style={[st.badgeText, { color: cm.color }]}>{item.category}</Text>
          </View>
        </View>
        <View style={st.annIconCircle}>
          <Ionicons name="megaphone-outline" size={15} color="#2563EB" />
        </View>
      </View>

      <Text style={st.annTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={st.annDesc} numberOfLines={2}>{item.content}</Text>

      <View style={st.annDivider} />
      <View style={st.annFooter}>
        <View style={st.annMeta}>
          <View style={st.annMetaItem}>
            <Ionicons name="calendar-outline" size={11} color="#6B7280" />
            <Text style={st.annMetaText}>{item.date}</Text>
          </View>
          <View style={st.annMetaItem}>
            <Ionicons name="person-outline" size={11} color="#6B7280" />
            <Text style={st.annMetaText}>{item.author}</Text>
          </View>
        </View>
        <TouchableOpacity style={st.annActionBtn} activeOpacity={0.8}>
          <Ionicons name="arrow-forward" size={13} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AnnouncementsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const H_PAD = 16;
  const isTablet = width >= 700;

  // Stats: 2×2 grid on mobile, 4 in a row on tablet
  const statCols = isTablet ? 4 : 2;
  const statGap = 10;
  const statCardW = (width - H_PAD * 2 - statGap * (statCols - 1)) / statCols;

  // Announcement cards: 1 col on mobile, 2 on tablet
  const annCols = isTablet ? 2 : 1;
  const annGap = 14;
  const annCardW = (width - H_PAD * 2 - annGap * (annCols - 1)) / annCols;

  const filtered = useMemo(() => {
    return mockAnnouncements.filter(a => {
      const matchFilter =
        activeFilter === 'All' ||
        a.category === activeFilter ||
        a.priority === activeFilter;
      const matchSearch =
        search.trim() === '' ||
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.content.toLowerCase().includes(search.toLowerCase()) ||
        a.author.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [search, activeFilter]);

  const publishedThisMonth = mockAnnouncements.filter(a => a.date.includes('Jun')).length;
  const highPriority = mockAnnouncements.filter(a => a.priority === 'High' || a.priority === 'Urgent').length;

  const statCards = [
    { icon: 'megaphone-outline' as const, iconBg: '#EFF6FF', iconColor: '#2563EB', label: 'TOTAL',           value: mockAnnouncements.length },
    { icon: 'eye-outline'       as const, iconBg: '#ECFDF5', iconColor: '#10B981', label: 'VISIBLE RESULTS', value: filtered.length },
    { icon: 'flame-outline'     as const, iconBg: '#FFE4EA', iconColor: '#FF4D6D', label: 'HIGH PRIORITY',   value: highPriority },
    { icon: 'calendar-outline'  as const, iconBg: '#FFFBEB', iconColor: '#F59E0B', label: 'THIS MONTH',      value: publishedThisMonth },
  ];

  return (
    <View style={st.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={false} />

      {/* Header */}
      <View style={st.header}>
        <TouchableOpacity style={st.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={st.headerTitle}>Announcements</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={st.scroll}
        contentContainerStyle={[st.scrollContent, { paddingHorizontal: H_PAD }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Stats Grid — 2×2 on mobile, 1×4 on tablet */}
        <View style={[st.statsGrid, { gap: statGap }]}>
          {statCards.map((s, i) => (
            <StatCard key={i} {...s} cardWidth={statCardW} />
          ))}
        </View>

        {/* Search & Filters */}
        <View style={st.searchContainer}>
          <View style={st.searchBox}>
            <Ionicons name="search-outline" size={16} color="#6B7280" style={{ marginRight: 8 }} />
            <TextInput
              style={st.searchInput}
              placeholder="Search announcements..."
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close-circle" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.filterRow}>
            {FILTERS.map(f => (
              <TouchableOpacity
                key={f}
                style={[st.filterChip, activeFilter === f && st.filterChipActive]}
                onPress={() => setActiveFilter(f)}
                activeOpacity={0.75}
              >
                <Text style={[st.filterChipText, activeFilter === f && st.filterChipTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Announcement Cards */}
        {filtered.length === 0 ? (
          <View style={st.emptyState}>
            <Ionicons name="megaphone-outline" size={52} color="#E5E7EB" />
            <Text style={st.emptyText}>No announcements found</Text>
          </View>
        ) : (
          <View style={[st.cardsGrid, { gap: annGap }]}>
            {filtered.map(item => (
              <AnnouncementCard key={item.id} item={item} cardWidth={annCardW} />
            ))}
          </View>
        )}

        <View style={{ height: 110 }} />
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F9FAFB' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 10 : 54,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#111827', letterSpacing: -0.3 },

  scroll: { flex: 1 },
  scrollContent: { paddingTop: 18 },

  // Stats — wrapping 2-col grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 2px 8px rgba(0,0,0,0.06)' }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 }),
  },
  statIconCircle: {
    width: IconBox.sizeSmall, height: IconBox.sizeSmall, borderRadius: IconBox.radius,
    backgroundColor: IconBox.bg, alignItems: 'center', justifyContent: 'center',
    marginBottom: 10, ...IconBox.shadow as any,
  },
  statLabel: { fontSize: 9, fontWeight: '700', color: '#6B7280', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 },
  statValue: { fontSize: 24, fontWeight: '800', color: '#111827', letterSpacing: -0.5 },

  // Search
  searchContainer: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    marginBottom: 16,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 2px 8px rgba(0,0,0,0.05)' }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 1 }),
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 10,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#111827', padding: 0 },
  filterRow: { gap: 8, paddingBottom: 2 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1, borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  filterChipActive: { backgroundColor: '#111827', borderColor: '#111827' },
  filterChipText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  filterChipTextActive: { color: '#fff' },

  // Cards — wrapping grid
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  annCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderTopWidth: 4,
    padding: 14,
  },
  annCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  annBadgeRow: { flexDirection: 'row', gap: 5, flexWrap: 'wrap', flex: 1 },
  badge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 999 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  annIconCircle: {
    width: IconBox.sizeSmall, height: IconBox.sizeSmall, borderRadius: IconBox.radius,
    backgroundColor: IconBox.bg, alignItems: 'center', justifyContent: 'center',
    marginLeft: 6, flexShrink: 0, ...IconBox.shadow as any,
  },
  annTitle: { fontSize: 14, fontWeight: '700', color: '#2563EB', marginBottom: 5, lineHeight: 20 },
  annDesc: { fontSize: 12, color: '#6B7280', lineHeight: 18, marginBottom: 12 },
  annDivider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: 10 },
  annFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  annMeta: { gap: 5, flex: 1 },
  annMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  annMetaText: { fontSize: 11, color: '#6B7280', fontWeight: '500' },
  annActionBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#2563EB',
    alignItems: 'center', justifyContent: 'center',
    marginLeft: 8,
  },

  emptyState: { alignItems: 'center', paddingVertical: 64 },
  emptyText: { fontSize: 14, color: '#9CA3AF', marginTop: 12, fontWeight: '500' },
});
