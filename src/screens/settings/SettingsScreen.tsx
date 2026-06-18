import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar, Switch, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../design-system/tokens';
import { Card, Divider } from '../../design-system/components/Card';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const SETTING_SECTIONS: {
  title: string;
  items: { iconName: IoniconName; iconColor: string; label: string; route?: string; toggle?: boolean; key?: string; value?: string }[];
}[] = [
  {
    title: 'Account',
    items: [
      { iconName: 'person-outline',       iconColor: Colors.primary, label: 'Edit Profile',       route: '/profile' },
      { iconName: 'lock-closed-outline',  iconColor: Colors.danger,  label: 'Change Password',    route: '/settings/security' },
      { iconName: 'finger-print',         iconColor: Colors.accent,  label: 'Biometric Login',    toggle: true, key: 'biometric' },
    ],
  },
  {
    title: 'Notifications',
    items: [
      { iconName: 'notifications-outline', iconColor: Colors.primary, label: 'Push Notifications', toggle: true, key: 'push' },
      { iconName: 'megaphone-outline',      iconColor: Colors.warning, label: 'Announcements',      toggle: true, key: 'announcements' },
      { iconName: 'checkmark-circle-outline', iconColor: Colors.success, label: 'Task Reminders',  toggle: true, key: 'tasks' },
      { iconName: 'calendar-outline',       iconColor: Colors.accent,  label: 'Leave Updates',     toggle: true, key: 'leave' },
      { iconName: 'wallet-outline',         iconColor: Colors.warning, label: 'Expense Updates',   toggle: true, key: 'expense' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { iconName: 'moon-outline',   iconColor: Colors.gray700, label: 'Dark Mode', toggle: true, key: 'darkMode' },
      { iconName: 'globe-outline',  iconColor: Colors.accent,  label: 'Language',  value: 'English', route: '/settings/language' },
      { iconName: 'cash-outline',   iconColor: Colors.success, label: 'Currency',  value: 'INR (₹)', route: '/settings/currency' },
    ],
  },
  {
    title: 'Privacy & Security',
    items: [
      { iconName: 'shield-checkmark-outline', iconColor: Colors.primary, label: 'Privacy Settings', route: '/settings/privacy' },
      { iconName: 'server-outline',           iconColor: Colors.accent,  label: 'Data & Storage',   route: '/settings/data' },
      { iconName: 'document-text-outline',    iconColor: Colors.gray600, label: 'Terms of Service', route: '/settings/terms' },
      { iconName: 'lock-open-outline',        iconColor: Colors.gray600, label: 'Privacy Policy',   route: '/settings/privacy-policy' },
    ],
  },
  {
    title: 'Support',
    items: [
      { iconName: 'chatbubble-ellipses-outline', iconColor: Colors.primary, label: 'Contact IT Support', route: '/support' },
      { iconName: 'help-circle-outline',         iconColor: Colors.accent,  label: 'Help & FAQ',         route: '/help' },
      { iconName: 'information-circle-outline',  iconColor: Colors.gray600, label: 'About App',          value: 'v2.0.1', route: '/about' },
    ],
  },
];

export default function SettingsScreen() {
  const router = useRouter();
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    biometric: true, push: true, announcements: true, tasks: true, leave: true, expense: false, darkMode: false,
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.gray900} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {SETTING_SECTIONS.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Card style={styles.sectionCard}>
              {section.items.map((item, i) => (
                <View key={item.label}>
                  <TouchableOpacity
                    style={styles.settingRow}
                    onPress={() => item.route && router.push(item.route as any)}
                    activeOpacity={item.toggle ? 1 : 0.7}
                  >
                    <View style={styles.settingLeft}>
                      <View style={[styles.settingIconBox, { backgroundColor: item.iconColor + '15' }]}>
                        <Ionicons name={item.iconName} size={18} color={item.iconColor} />
                      </View>
                      <Text style={styles.settingLabel}>{item.label}</Text>
                    </View>
                    <View style={styles.settingRight}>
                      {item.value && <Text style={styles.settingValue}>{item.value}</Text>}
                      {item.toggle ? (
                        <Switch
                          value={toggles[item.key!] ?? false}
                          onValueChange={(val) => setToggles(prev => ({ ...prev, [item.key!]: val }))}
                          trackColor={{ false: Colors.gray300, true: Colors.primaryLight }}
                          thumbColor={toggles[item.key!] ? Colors.primary : Colors.gray400}
                        />
                      ) : (
                        <Ionicons name="chevron-forward" size={18} color={Colors.gray400} />
                      )}
                    </View>
                  </TouchableOpacity>
                  {i < section.items.length - 1 && <Divider style={{ marginLeft: 54 }} />}
                </View>
              ))}
            </Card>
          </View>
        ))}

        <View style={styles.appInfo}>
          <View style={styles.appLogo}>
            <Image source={require('../../../assets/logo.png')} style={styles.appLogoImage} resizeMode="contain" />
          </View>
          <Text style={styles.appName}>MetroMindz HRMS</Text>
          <Text style={styles.appVersion}>Version 2.0.1 (Build 201)</Text>
          <Text style={styles.appCopyright}>© 2025 MetroMindz. All rights reserved.</Text>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { backgroundColor: Colors.white, paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 56, paddingHorizontal: Spacing[4], paddingBottom: 16, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  backBtn: { marginRight: 16, padding: 4 },
  headerTitle: { fontSize: Typography.fontSize.md, fontWeight: '700', color: Colors.gray900 },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing[4] },
  section: { marginBottom: Spacing[3] },
  sectionTitle: { fontSize: Typography.fontSize.xs, fontWeight: '700', color: Colors.gray500, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4 },
  sectionCard: { marginBottom: 0 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  settingIconBox: { width: 36, height: 36, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  settingLabel: { fontSize: Typography.fontSize.base, color: Colors.gray800, fontWeight: '500' },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  settingValue: { fontSize: Typography.fontSize.sm, color: Colors.gray400 },
  appInfo: { alignItems: 'center', paddingVertical: Spacing[6] },
  appLogo: { width: 60, height: 60, borderRadius: 18, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 1, borderColor: Colors.gray100 },
  appLogoImage: { width: 46, height: 46 },
  appName: { fontSize: Typography.fontSize.md, fontWeight: '700', color: Colors.gray900, marginBottom: 4 },
  appVersion: { fontSize: Typography.fontSize.sm, color: Colors.gray500, marginBottom: 4 },
  appCopyright: { fontSize: Typography.fontSize.xs, color: Colors.gray400 },
});
