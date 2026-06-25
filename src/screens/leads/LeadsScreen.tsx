import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, StatusBar, RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Shadow } from '../../design-system/tokens';
import { mockLeads, Lead } from '../../data/mockData';

const STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
  New:         { color: '#4DA8DA', bg: '#E1F0FA' },
  Qualified:   { color: '#34D399', bg: '#D1FAE5' },
  Proposal:    { color: '#FBBF24', bg: '#FEF3C7' },
  Negotiation: { color: '#F87171', bg: '#FEE2E2' },
  Won:         { color: '#059669', bg: '#A7F3D0' },
  Lost:        { color: '#9CA3AF', bg: '#F3F4F6' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { color: Colors.gray500, bg: Colors.gray100 };
  return (
    <View style={[s.badge, { backgroundColor: cfg.bg }]}>
      <Text style={[s.badgeTxt, { color: cfg.color }]}>{status}</Text>
    </View>
  );
}

function LeadCard({ lead }: { lead: Lead }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = lead.fullName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <View style={s.card}>
      <View style={s.cardTop}>
        <View style={s.avatar}>
          <Text style={s.avatarTxt}>{initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.cardName} numberOfLines={1}>{lead.fullName}</Text>
          <View style={s.metaRow}>
            <Ionicons name="call-outline" size={11} color={Colors.gray400} />
            <Text style={s.metaTxt}>{lead.mobile}</Text>
          </View>
        </View>
        <StatusBadge status={lead.status} />
      </View>

      <View style={s.chips}>
        <View style={s.chip}>
          <Ionicons name="pricetag-outline" size={11} color={Colors.primary} />
          <Text style={s.chipTxt}>{lead.leadType}</Text>
        </View>
        <View style={s.chip}>
          <Ionicons name="person-outline" size={11} color={Colors.gray500} />
          <Text style={s.chipTxt} numberOfLines={1}>{lead.assignedTo}</Text>
        </View>
        <View style={s.chip}>
          <Ionicons name="calendar-outline" size={11} color={Colors.gray500} />
          <Text style={s.chipTxt}>{lead.createdAt}</Text>
        </View>
      </View>

      <View style={s.actions}>
        {[
          { icon: 'call' as const,         label: 'Call',      color: '#34D399' },
          { icon: 'create-outline' as const, label: 'Edit',    color: Colors.primary },
          { icon: 'alarm-outline' as const,  label: 'Follow-up', color: '#FBBF24' },
        ].map((a, i) => (
          <React.Fragment key={a.label}>
            {i > 0 && <View style={s.actionDiv} />}
            <TouchableOpacity style={s.actionBtn}>
              <Ionicons name={a.icon} size={15} color={a.color} />
              <Text style={[s.actionTxt, { color: a.color }]}>{a.label}</Text>
            </TouchableOpacity>
          </React.Fragment>
        ))}
        <View style={s.actionDiv} />
        <TouchableOpacity style={s.actionBtn} onPress={() => setMenuOpen(v => !v)}>
          <Ionicons name="ellipsis-horizontal" size={15} color={Colors.gray500} />
          <Text style={[s.actionTxt, { color: Colors.gray500 }]}>More</Text>
        </TouchableOpacity>
      </View>

      {menuOpen && (
        <View style={s.menu}>
          {['View Details', 'Send Email', 'Convert to Deal', 'Delete'].map(item => (
            <TouchableOpacity key={item} style={s.menuItem} onPress={() => setMenuOpen(false)}>
              <Text style={[s.menuTxt, item === 'Delete' && { color: Colors.danger }]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const FILTERS = ['All', 'New', 'Qualified', 'Proposal', 'Negotiation'];

export default function LeadsScreen() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('All');

  const onRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000); };
  const displayed = filter === 'All' ? leads : leads.filter(l => l.status === filter);

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <LinearGradient colors={['#56CCF2', '#4DA8DA', '#2E86B5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.header}>
        <View style={s.hCircle} />
        <View style={s.hRow}>
          <TouchableOpacity onPress={() => router.back()} style={s.hBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={s.hTitle}>Leads</Text>
          <TouchableOpacity style={s.hBtn}>
            <Ionicons name="search-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={s.hStats}>
          {[
            { label: 'Total',  value: leads.length },
            { label: 'New',    value: leads.filter(l => l.status === 'New').length },
            { label: 'Active', value: leads.filter(l => !['Won','Lost'].includes(l.status)).length },
          ].map((st, i) => (
            <View key={i} style={s.hStatItem}>
              <Text style={s.hStatVal}>{st.value}</Text>
              <Text style={s.hStatLabel}>{st.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* Quick Actions */}
        <Text style={s.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity
          style={s.addBtn}
          onPress={() => router.push('/leads/add' as any)}
          activeOpacity={0.85}
        >
          <LinearGradient colors={['#56CCF2', '#4DA8DA']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.addGrad}>
            <View style={s.addIconCircle}>
              <Ionicons name="person-add" size={22} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.addTitle}>Add Lead</Text>
              <Text style={s.addSub}>Create a new lead record</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
          </LinearGradient>
        </TouchableOpacity>

        <View style={s.qaRow}>
          {[
            { icon: 'funnel-outline' as const,      label: 'Filter', color: '#4DA8DA', bg: '#E1F0FA' },
            { icon: 'download-outline' as const,    label: 'Export', color: '#34D399', bg: '#D1FAE5' },
            { icon: 'stats-chart-outline' as const, label: 'Report', color: '#FBBF24', bg: '#FEF3C7' },
          ].map(a => (
            <TouchableOpacity key={a.label} style={s.qaItem} activeOpacity={0.75}>
              <View style={[s.qaIcon, { backgroundColor: a.bg }]}>
                <Ionicons name={a.icon} size={18} color={a.color} />
              </View>
              <Text style={s.qaLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterRow}>
          {FILTERS.map(f => (
            <TouchableOpacity key={f} style={[s.filterChip, filter === f && s.filterChipActive]} onPress={() => setFilter(f)}>
              <Text style={[s.filterChipTxt, filter === f && s.filterChipTxtActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Leads */}
        <Text style={s.sectionTitle}>Leads ({displayed.length})</Text>
        {displayed.map(lead => <LeadCard key={lead.id} lead={lead} />)}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={s.fab} onPress={() => router.push('/leads/add' as any)} activeOpacity={0.85}>
        <LinearGradient colors={['#56CCF2', '#2E86B5']} style={s.fabGrad}>
          <Ionicons name="add" size={26} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 10 : 54,
    paddingHorizontal: 16, paddingBottom: 20, overflow: 'hidden',
  },
  hCircle: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.06)', top: -50, right: -30 },
  hRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  hBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  hTitle: { flex: 1, fontSize: 20, fontWeight: '800', color: '#fff', letterSpacing: -0.3, marginLeft: 12 },
  hStats: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.13)', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  hStatItem: { flex: 1, alignItems: 'center' },
  hStatVal: { fontSize: 20, fontWeight: '800', color: '#fff' },
  hStatLabel: { fontSize: 10, color: 'rgba(255,255,255,0.65)', fontWeight: '600', marginTop: 2 },

  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.gray900, marginBottom: 12 },

  addBtn: { borderRadius: 16, overflow: 'hidden', marginBottom: 10, ...Shadow.md },
  addGrad: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  addIconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  addTitle: { fontSize: 15, fontWeight: '700', color: '#fff' },
  addSub: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 2 },

  qaRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  qaItem: { flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 12, alignItems: 'center', ...Shadow.sm },
  qaIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  qaLabel: { fontSize: 11, color: Colors.gray700, fontWeight: '600' },

  filterRow: { paddingBottom: 16, gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: Radius.full, backgroundColor: '#fff', borderWidth: 1.5, borderColor: Colors.gray200 },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterChipTxt: { fontSize: 12, fontWeight: '600', color: Colors.gray600 },
  filterChipTxtActive: { color: '#fff' },

  card: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 12, ...Shadow.sm, overflow: 'hidden' },
  cardTop: { flexDirection: 'row', alignItems: 'center', padding: 14, paddingBottom: 10, gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary + '20', alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { fontSize: 14, fontWeight: '800', color: Colors.primary },
  cardName: { fontSize: 15, fontWeight: '700', color: Colors.gray900, marginBottom: 3 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaTxt: { fontSize: 12, color: Colors.gray500 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  badgeTxt: { fontSize: 11, fontWeight: '700' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 14, paddingBottom: 10, gap: 6 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.gray50, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  chipTxt: { fontSize: 11, color: Colors.gray600, fontWeight: '500', maxWidth: 110 },

  actions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: Colors.gray100 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 11, gap: 5 },
  actionTxt: { fontSize: 12, fontWeight: '600' },
  actionDiv: { width: 1, backgroundColor: Colors.gray100, marginVertical: 8 },

  menu: { position: 'absolute', right: 14, bottom: 52, backgroundColor: '#fff', borderRadius: 12, ...Shadow.lg, borderWidth: 1, borderColor: Colors.gray100, zIndex: 10, minWidth: 160 },
  menuItem: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.gray50 },
  menuTxt: { fontSize: 13, fontWeight: '600', color: Colors.gray800 },

  fab: { position: 'absolute', bottom: 28, right: 20, borderRadius: 30, ...Shadow.lg },
  fabGrad: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
});
