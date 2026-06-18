import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../design-system/tokens';
import { Card, Divider } from '../../design-system/components/Card';
import { Avatar } from '../../design-system/components/Avatar';
import { Badge } from '../../design-system/components/Badge';
import { currentUser } from '../../data/mockData';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const INFO_ROWS: { iconName: IoniconName; label: string; value: string }[] = [
  { iconName: 'id-card-outline',        label: 'Employee ID',   value: currentUser.employeeId },
  { iconName: 'briefcase-outline',      label: 'Designation',   value: currentUser.designation },
  { iconName: 'business-outline',       label: 'Department',    value: currentUser.department },
  { iconName: 'calendar-outline',       label: 'Joined',        value: currentUser.joinDate },
  { iconName: 'person-outline',         label: 'Reports to',    value: currentUser.reportingManager },
  { iconName: 'location-outline',       label: 'Location',      value: currentUser.location },
  { iconName: 'mail-outline',           label: 'Email',         value: currentUser.email },
  { iconName: 'call-outline',           label: 'Phone',         value: currentUser.phone },
];

const MENU_ITEMS: { iconName: IoniconName; label: string; route: string; color: string }[] = [
  { iconName: 'person-outline',          label: 'Personal Information',      route: '/profile/personal',        color: Colors.primary },
  { iconName: 'briefcase-outline',       label: 'Employment Details',        route: '/profile/employment',      color: Colors.accent },
  { iconName: 'call-outline',            label: 'Contact Information',       route: '/profile/contact',         color: Colors.success },
  { iconName: 'document-text-outline',   label: 'Documents',                 route: '/profile/documents',       color: Colors.warning },
  { iconName: 'lock-closed-outline',     label: 'Security & Password',       route: '/settings/security',       color: Colors.danger },
  { iconName: 'notifications-outline',   label: 'Notification Preferences',  route: '/settings/notifications',  color: Colors.info },
  { iconName: 'settings-outline',        label: 'App Settings',              route: '/settings',                color: Colors.gray600 },
];

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroBg} />
          <View style={styles.heroCircle1} />
          <View style={styles.heroCircle2} />
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.editBtn} onPress={() => {}}>
            <Ionicons name="create-outline" size={14} color={Colors.white} />
            <Text style={styles.editText}> Edit</Text>
          </TouchableOpacity>
          <View style={styles.avatarWrap}>
            <Avatar name={currentUser.name} initials={currentUser.initials} size={90} />
            <TouchableOpacity style={styles.cameraBtn}>
              <Ionicons name="camera-outline" size={14} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.heroName}>{currentUser.name}</Text>
          <Text style={styles.heroDesignation}>{currentUser.designation}</Text>
          <View style={styles.heroBadges}>
            <Badge label={currentUser.department} variant="primary" />
            <Badge label="Active" variant="success" dot />
          </View>
          <Text style={styles.heroId}>ID: {currentUser.employeeId}</Text>
        </View>

        <View style={styles.statsRow}>
          {[
            { label: 'Projects',  value: '3',  iconName: 'folder-outline' as IoniconName,           color: Colors.primary },
            { label: 'Tasks',     value: '6',  iconName: 'checkmark-circle-outline' as IoniconName, color: Colors.accent },
            { label: 'Leave Days',value: `${currentUser.leaveBalance.remaining.annual}`, iconName: 'umbrella-outline' as IoniconName, color: Colors.success },
          ].map(stat => (
            <View key={stat.label} style={[styles.statBox, Shadow.sm]}>
              <Ionicons name={stat.iconName} size={20} color={stat.color} style={{ marginBottom: 4 }} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <Card style={styles.infoCard}>
          <Text style={styles.sectionLabel}>Employee Information</Text>
          {INFO_ROWS.map((row, i) => (
            <View key={row.label}>
              <View style={styles.infoRow}>
                <View style={styles.infoIconBox}>
                  <Ionicons name={row.iconName} size={16} color={Colors.primary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>{row.label}</Text>
                  <Text style={styles.infoValue}>{row.value}</Text>
                </View>
              </View>
              {i < INFO_ROWS.length - 1 && <Divider />}
            </View>
          ))}
        </Card>

        <Card style={styles.menuCard}>
          <Text style={styles.sectionLabel}>Profile Settings</Text>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity key={item.label} style={styles.menuItem} onPress={() => router.push(item.route as any)} activeOpacity={0.7}>
              <View style={[styles.menuIconBox, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.iconName} size={18} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.gray400} />
            </TouchableOpacity>
          ))}
        </Card>

        <TouchableOpacity style={styles.logoutBtn} onPress={() => router.replace('/auth/welcome')}>
          <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>MetroMindz HRMS v2.0.1</Text>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scroll: { flex: 1 },
  hero: { backgroundColor: Colors.primary, paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 56, paddingHorizontal: Spacing[4], paddingBottom: 40, alignItems: 'center', overflow: 'hidden' },
  heroBg: { ...StyleSheet.absoluteFillObject, backgroundColor: Colors.primary },
  heroCircle1: { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255,255,255,0.10)', top: -100, right: -80 },
  heroCircle2: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.07)', bottom: -60, left: -40 },
  backBtn: { position: 'absolute', top: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 16 : 60, left: Spacing[4] },
  editBtn: { position: 'absolute', top: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 16 : 60, right: Spacing[4], flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 6 },
  editText: { fontSize: Typography.fontSize.xs, color: Colors.white, fontWeight: '600' },
  avatarWrap: { position: 'relative', marginBottom: 16 },
  cameraBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: Colors.white, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.primary },
  heroName: { fontSize: Typography.fontSize['2xl'], fontWeight: '800', color: Colors.white, marginBottom: 4 },
  heroDesignation: { fontSize: Typography.fontSize.sm, color: 'rgba(255,255,255,0.8)', marginBottom: 12 },
  heroBadges: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  heroId: { fontSize: Typography.fontSize.xs, color: 'rgba(255,255,255,0.5)' },
  statsRow: { flexDirection: 'row', paddingHorizontal: Spacing[4], marginTop: -20, gap: 12, marginBottom: Spacing[4] },
  statBox: { flex: 1, backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing[3], alignItems: 'center' },
  statValue: { fontSize: Typography.fontSize.xl, fontWeight: '800', color: Colors.gray900 },
  statLabel: { fontSize: Typography.fontSize.xs, color: Colors.gray500, marginTop: 2 },
  infoCard: { marginHorizontal: Spacing[4], marginBottom: Spacing[3] },
  menuCard: { marginHorizontal: Spacing[4], marginBottom: Spacing[3] },
  sectionLabel: { fontSize: Typography.fontSize.sm, fontWeight: '700', color: Colors.gray500, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  infoIconBox: { width: 32, height: 32, borderRadius: Radius.sm, backgroundColor: Colors.overlayLight, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: Typography.fontSize.xs, color: Colors.gray400, marginBottom: 1 },
  infoValue: { fontSize: Typography.fontSize.sm, color: Colors.gray800, fontWeight: '600' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  menuIconBox: { width: 36, height: 36, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  menuLabel: { flex: 1, fontSize: Typography.fontSize.base, color: Colors.gray800, fontWeight: '500' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: Spacing[4], marginBottom: Spacing[3], backgroundColor: Colors.dangerLight, borderRadius: Radius.lg, paddingVertical: 14, gap: 8 },
  logoutText: { fontSize: Typography.fontSize.base, fontWeight: '700', color: Colors.danger },
  version: { textAlign: 'center', fontSize: Typography.fontSize.xs, color: Colors.gray400, marginBottom: Spacing[3] },
});
