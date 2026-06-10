import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Platform, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../design-system/tokens';
import { mockNotifications } from '../../data/mockData';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];
type Notification = typeof mockNotifications[number];

const TYPE_CONFIG: Record<string, { icon: IoniconName; bg: string; color: string }> = {
  info:    { icon: 'information-circle-outline', bg: '#EFF6FF', color: Colors.info },
  success: { icon: 'checkmark-circle-outline',  bg: Colors.successLight, color: Colors.success },
  warning: { icon: 'warning-outline',           bg: Colors.warningLight, color: Colors.warning },
  danger:  { icon: 'alert-circle-outline',      bg: Colors.dangerLight,  color: Colors.danger },
};

function NotifCard({ n, unread }: { n: Notification; unread: boolean }) {
  const cfg = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.info;
  return (
    <View style={[styles.card, unread && styles.cardUnread]}>
      {unread && <View style={styles.unreadBar} />}
      <View style={[styles.iconBox, { backgroundColor: unread ? cfg.bg : Colors.gray100 }]}>
        <Ionicons name={cfg.icon} size={20} color={unread ? cfg.color : Colors.gray400} />
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTopRow}>
          <Text style={[styles.cardTitle, !unread && styles.cardTitleRead]} numberOfLines={1}>
            {n.title}
          </Text>
          <Text style={styles.cardTime}>{n.time}</Text>
        </View>
        <Text style={styles.cardMsg} numberOfLines={2}>{n.message}</Text>
      </View>
    </View>
  );
}

function SectionLabel({ icon, label }: { icon: IoniconName; label: string }) {
  return (
    <View style={styles.sectionRow}>
      <Ionicons name={icon} size={13} color={Colors.gray400} />
      <Text style={styles.sectionLabel}>{label}</Text>
    </View>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(mockNotifications);

  const unread = notifications.filter(n => !n.read);
  const read   = notifications.filter(n =>  n.read);

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="arrow-back" size={22} color={Colors.gray900} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={markAllRead} disabled={unread.length === 0} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={[styles.markAll, unread.length === 0 && styles.markAllDisabled]}>
            Mark all read
          </Text>
        </TouchableOpacity>
      </View>

      {/* Unread banner */}
      {unread.length > 0 && (
        <View style={styles.banner}>
          <View style={styles.bannerDot} />
          <Text style={styles.bannerText}>
            You have <Text style={styles.bannerCount}>{unread.length} unread</Text> notification{unread.length > 1 ? 's' : ''}
          </Text>
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {unread.length === 0 && read.length === 0 && (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="notifications-off-outline" size={36} color={Colors.gray300} />
            </View>
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptyMsg}>No notifications to show right now.</Text>
          </View>
        )}

        {unread.length > 0 && (
          <>
            <SectionLabel icon="radio-button-on-outline" label={`New · ${unread.length}`} />
            {unread.map(n => <NotifCard key={n.id} n={n} unread />)}
          </>
        )}

        {read.length > 0 && (
          <View style={{ marginTop: unread.length > 0 ? Spacing[4] : 0 }}>
            <SectionLabel icon="time-outline" label="Earlier" />
            {read.map(n => <NotifCard key={n.id} n={n} unread={false} />)}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },

  // Header
  header: {
    backgroundColor: Colors.white,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 12 : 56,
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  backBtn: { padding: 4 },
  headerTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    color: Colors.gray900,
    flex: 1,
    textAlign: 'center',
  },
  markAll: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
  markAllDisabled: { color: Colors.gray300 },

  // Unread banner
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.overlayLight,
    paddingHorizontal: Spacing[4],
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary + '18',
    gap: 8,
  },
  bannerDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  bannerText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray600,
  },
  bannerCount: {
    fontWeight: '700',
    color: Colors.primary,
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing[4], paddingTop: Spacing[4] },

  // Section label
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing[2],
    marginLeft: 2,
  },
  sectionLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
    color: Colors.gray400,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },

  // Card
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing[3],
    marginBottom: Spacing[2],
    borderWidth: 1,
    borderColor: Colors.gray100,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  cardUnread: {
    borderColor: Colors.primary + '25',
    backgroundColor: '#FAFCFF',
  },
  unreadBar: {
    position: 'absolute',
    left: 0, top: 0, bottom: 0,
    width: 3,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: Radius.lg,
    borderBottomLeftRadius: Radius.lg,
  },
  iconBox: {
    width: 42, height: 42,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[3],
    flexShrink: 0,
  },
  cardBody: { flex: 1 },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
    gap: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.gray900,
  },
  cardTitleRead: {
    fontWeight: '600',
    color: Colors.gray600,
  },
  cardTime: {
    fontSize: Typography.fontSize.xs,
    color: Colors.gray400,
    flexShrink: 0,
  },
  cardMsg: {
    fontSize: Typography.fontSize.xs,
    color: Colors.gray500,
    lineHeight: 18,
  },

  // Empty state
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 10,
  },
  emptyIcon: {
    width: 72, height: 72,
    borderRadius: 36,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    color: Colors.gray700,
  },
  emptyMsg: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gray400,
  },
});
