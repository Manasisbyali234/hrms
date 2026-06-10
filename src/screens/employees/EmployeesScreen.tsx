import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../design-system/tokens';
import { Avatar } from '../../design-system/components/Avatar';
import { mockEmployees } from '../../data/mockData';

const DEPARTMENTS = ['All', 'Development', 'Design', 'HR', 'QA'];

export default function EmployeesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');

  const filtered = mockEmployees.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.designation.toLowerCase().includes(search.toLowerCase());
    const matchDept = dept === 'All' || e.department === dept || e.department.includes(dept);
    return matchSearch && matchDept;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <View style={styles.header}>
        <View style={styles.headerCircle} />
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Employee Directory</Text>
        <Text style={styles.headerSub}>{mockEmployees.length} employees</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={16} color="rgba(255,255,255,0.6)" />
          <TextInput
            style={styles.searchInput} value={search} onChangeText={setSearch}
            placeholder="Search by name or role..." placeholderTextColor="rgba(255,255,255,0.5)"
          />
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {DEPARTMENTS.map(d => (
            <TouchableOpacity key={d} style={[styles.filterTab, dept === d && styles.filterTabActive]} onPress={() => setDept(d)}>
              <Text style={[styles.filterText, dept === d && styles.filterTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filtered.map(emp => (
          <TouchableOpacity key={emp.id} style={styles.empCard} activeOpacity={0.85}>
            <Avatar name={emp.name} initials={emp.initials} size={52} />
            <View style={styles.empInfo}>
              <Text style={styles.empName}>{emp.name}</Text>
              <Text style={styles.empRole}>{emp.designation}</Text>
              <View style={styles.empMeta}>
                <Ionicons name="business-outline" size={12} color={Colors.gray400} />
                <Text style={styles.empDept}> {emp.department}</Text>
                <Text style={styles.empId}>{emp.id}</Text>
              </View>
            </View>
            <View style={styles.empActions}>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="chatbubble-outline" size={18} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="call-outline" size={18} color={Colors.success} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={48} color={Colors.gray300} style={{ marginBottom: 12 }} />
            <Text style={styles.emptyTitle}>No employees found</Text>
            <Text style={styles.emptySub}>Try a different search term</Text>
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 56,
    paddingHorizontal: Spacing[4], paddingBottom: Spacing[4], overflow: 'hidden',
  },
  headerCircle: { position: 'absolute', width: 240, height: 240, borderRadius: 120, backgroundColor: 'rgba(96,165,250,0.15)', top: -60, right: -40 },
  backBtn: { marginBottom: 8 },
  headerTitle: { fontSize: Typography.fontSize.xl, fontWeight: '800', color: Colors.white, marginBottom: 4 },
  headerSub: { fontSize: Typography.fontSize.sm, color: 'rgba(255,255,255,0.7)', marginBottom: Spacing[3] },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: Radius.full, paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  searchInput: { flex: 1, fontSize: Typography.fontSize.sm, color: Colors.white },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing[4] },
  filterRow: { marginBottom: Spacing[3] },
  filterTab: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: Radius.full, marginRight: 8, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.gray200 },
  filterTabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: Typography.fontSize.sm, color: Colors.gray600, fontWeight: '600' },
  filterTextActive: { color: Colors.white },
  empCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[3], marginBottom: Spacing[2], ...Shadow.sm },
  empInfo: { flex: 1, marginLeft: 12 },
  empName: { fontSize: Typography.fontSize.base, fontWeight: '700', color: Colors.gray900 },
  empRole: { fontSize: Typography.fontSize.xs, color: Colors.gray500, marginTop: 2 },
  empMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  empDept: { fontSize: Typography.fontSize.xs, color: Colors.gray500 },
  empId: { fontSize: Typography.fontSize.xs, color: Colors.primary, fontWeight: '600' },
  empActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: Typography.fontSize.md, fontWeight: '700', color: Colors.gray600 },
  emptySub: { fontSize: Typography.fontSize.sm, color: Colors.gray400, marginTop: 6 },
});
