import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../design-system/tokens';
import { Avatar } from '../../design-system/components/Avatar';
import { mockChats } from '../../data/mockData';

export default function ChatScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <View style={styles.header}>
        <View style={styles.headerCircle} />
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Messages</Text>
          <TouchableOpacity style={styles.composeBtn} onPress={() => {}}>
            <Ionicons name="create-outline" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={16} color="rgba(255,255,255,0.6)" />
          <Text style={styles.searchPlaceholder}>Search conversations...</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.onlineSection}>
          <Text style={styles.onlineTitle}>Online Now</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.onlineRow}>
            {mockChats.filter(c => !c.isGroup && (c as any).online).map(chat => (
              <View key={chat.id} style={styles.onlineItem}>
                <Avatar name={chat.name} initials={(chat as any).initials} size={52} online={true} />
                <Text style={styles.onlineName} numberOfLines={1}>{chat.name.split(' ')[0]}</Text>
              </View>
            ))}
            <View style={styles.onlineItem}>
              <View style={styles.newChatBtn}>
                <Ionicons name="add" size={22} color={Colors.gray500} />
              </View>
              <Text style={styles.onlineName}>New</Text>
            </View>
          </ScrollView>
        </View>

        <View style={styles.chatList}>
          {mockChats.map(chat => (
            <TouchableOpacity
              key={chat.id} style={styles.chatItem} activeOpacity={0.8}
              onPress={() => router.push(`/chat/${chat.id}` as any)}
            >
              <View style={styles.avatarWrap}>
                <Avatar name={chat.name} initials={(chat as any).initials} size={52} online={!chat.isGroup && (chat as any).online} />
                {chat.isGroup && (
                  <View style={styles.groupBadge}>
                    <Ionicons name="people" size={10} color={Colors.white} />
                  </View>
                )}
              </View>
              <View style={styles.chatInfo}>
                <View style={styles.chatTopRow}>
                  <Text style={styles.chatName} numberOfLines={1}>{chat.name}</Text>
                  <Text style={styles.chatTime}>{chat.time}</Text>
                </View>
                <View style={styles.chatBottomRow}>
                  <Text style={styles.chatPreview} numberOfLines={1}>
                    {chat.lastMessage}
                  </Text>
                  {chat.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{chat.unread}</Text>
                    </View>
                  )}
                </View>
                {chat.isGroup && (
                  <Text style={styles.memberCount}>{(chat as any).members} members</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
        <Ionicons name="chatbubble-ellipses-outline" size={24} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 56,
    paddingHorizontal: Spacing[4], paddingBottom: Spacing[4], overflow: 'hidden',
  },
  headerCircle: { position: 'absolute', width: 240, height: 240, borderRadius: 120, backgroundColor: 'rgba(96,165,250,0.15)', top: -60, right: -40 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing[3] },
  headerTitle: { fontSize: Typography.fontSize.xl, fontWeight: '800', color: Colors.white },
  composeBtn: { padding: 6 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: Radius.full, paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  searchPlaceholder: { fontSize: Typography.fontSize.sm, color: 'rgba(255,255,255,0.6)' },
  scroll: { flex: 1 },
  onlineSection: { paddingHorizontal: Spacing[4], paddingTop: Spacing[4], marginBottom: Spacing[2] },
  onlineTitle: { fontSize: Typography.fontSize.sm, fontWeight: '700', color: Colors.gray700, marginBottom: 12 },
  onlineRow: {},
  onlineItem: { alignItems: 'center', marginRight: 16, width: 60 },
  onlineName: { fontSize: Typography.fontSize.xs, color: Colors.gray600, marginTop: 6, textAlign: 'center' },
  newChatBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.gray100, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.gray200, borderStyle: 'dashed' },
  chatList: {},
  chatItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing[4], paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.gray100 },
  avatarWrap: { position: 'relative', marginRight: 14 },
  groupBadge: { position: 'absolute', bottom: 0, right: -2, width: 18, height: 18, borderRadius: 9, backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.white },
  groupBadgeText: { fontSize: 9, color: Colors.white, fontWeight: '700' },
  chatInfo: { flex: 1 },
  chatTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  chatName: { fontSize: Typography.fontSize.base, fontWeight: '700', color: Colors.gray900, flex: 1 },
  chatTime: { fontSize: Typography.fontSize.xs, color: Colors.gray400 },
  chatBottomRow: { flexDirection: 'row', alignItems: 'center' },
  chatPreview: { flex: 1, fontSize: Typography.fontSize.sm, color: Colors.gray500 },
  unreadBadge: { minWidth: 20, height: 20, borderRadius: 10, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  unreadText: { fontSize: 10, color: Colors.white, fontWeight: '700' },
  memberCount: { fontSize: Typography.fontSize.xs, color: Colors.gray400, marginTop: 2 },
  fab: { position: 'absolute', right: 20, bottom: 100, width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', ...Shadow.lg },
});
