import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  Platform, StatusBar, FlatList, Animated, useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../design-system/tokens';
import { mockChats, mockProjects, currentUser } from '../../data/mockData';

const PRIMARY = '#3B82F6';
const PRIMARY_LIGHT = '#EFF6FF';
const PRIMARY_SOFT = '#DBEAFE';

type ChatItem = typeof mockChats[0] & { isGroup?: boolean; members?: number; online?: boolean; initials?: string; role?: string };

const AVATAR_COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function InitialsAvatar({ name, initials, size = 44, online = false, style }: { name: string; initials?: string; size?: number; online?: boolean; style?: any }) {
  const bg = getAvatarColor(name);
  const letters = initials ?? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <View style={[{ width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: bg }, style]}>
      <Text style={{ color: '#fff', fontSize: size * 0.36, fontWeight: '700', letterSpacing: 0.5 }}>{letters}</Text>
      {online && (
        <View style={{
          position: 'absolute', bottom: 1, right: 1,
          width: size * 0.27, height: size * 0.27,
          borderRadius: size * 0.14, backgroundColor: '#10B981',
          borderWidth: 2, borderColor: '#fff',
        }} />
      )}
    </View>
  );
}

function ProjectSidebarItem({ project, active, onPress }: { project: typeof mockProjects[0]; active: boolean; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const press = () => { Animated.sequence([Animated.spring(scale, { toValue: 0.94, useNativeDriver: true }), Animated.spring(scale, { toValue: 1, useNativeDriver: true })]).start(); onPress(); };
  const abbr = project.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity activeOpacity={0.8} onPress={press} style={[styles.sidebarItem, active && styles.sidebarItemActive]}>
        <View style={[styles.sidebarIcon, active && { backgroundColor: PRIMARY }]}>
          <Text style={[styles.sidebarIconText, active && { color: '#fff' }]}>{abbr}</Text>
        </View>
        {active && <View style={styles.sidebarActiveDot} />}
      </TouchableOpacity>
    </Animated.View>
  );
}

function ChatRow({ item, onPress, index }: { item: ChatItem; onPress: () => void; index: number }) {
  const slide = useRef(new Animated.Value(30)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 320, delay: index * 60, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 320, delay: index * 60, useNativeDriver: true }),
    ]).start();
  }, []);
  const onIn = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  const onOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  const hasUnread = item.unread > 0;

  return (
    <Animated.View style={{ opacity: fade, transform: [{ translateX: slide }, { scale }] }}>
      <TouchableOpacity activeOpacity={1} onPressIn={onIn} onPressOut={onOut} onPress={onPress} style={[styles.chatRow, hasUnread && styles.chatRowUnread]}>
        <View style={styles.chatRowAvatar}>
          <InitialsAvatar name={item.name} initials={item.initials} size={48} online={!item.isGroup && item.online} />
          {item.isGroup && (
            <View style={styles.groupBadgeIcon}>
              <Ionicons name="people" size={9} color="#fff" />
            </View>
          )}
        </View>
        <View style={styles.chatRowBody}>
          <View style={styles.chatRowTop}>
            <Text style={[styles.chatRowName, hasUnread && { color: '#0F172A', fontWeight: '700' }]} numberOfLines={1}>{item.name}</Text>
            <Text style={[styles.chatRowTime, hasUnread && { color: PRIMARY, fontWeight: '600' }]}>{item.time}</Text>
          </View>
          <View style={styles.chatRowBottom}>
            <Text style={[styles.chatRowPreview, hasUnread && { color: '#374151', fontWeight: '500' }]} numberOfLines={1}>
              {item.lastMessage}
            </Text>
            {hasUnread ? (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{item.unread > 9 ? '9+' : item.unread}</Text>
              </View>
            ) : (
              <Ionicons name="checkmark-done" size={14} color="#10B981" style={{ marginLeft: 4 }} />
            )}
          </View>
          {item.isGroup && (
            <Text style={styles.chatRowMeta}>{item.members} members · Group</Text>
          )}
          {!item.isGroup && item.role && (
            <Text style={styles.chatRowMeta}>{item.role}</Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ChatScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [search, setSearch] = useState('');
  const [activeProject, setActiveProject] = useState(0);
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const filtered = mockChats.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(search.toLowerCase())
  ) as ChatItem[];

  const totalUnread = mockChats.reduce((s, c) => s + c.unread, 0);

  const SIDEBAR_W = 64;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Left Sidebar */}
      <View style={[styles.sidebar, { width: SIDEBAR_W }]}>
        <View style={styles.sidebarTop}>
          <View style={styles.sidebarSelfAvatar}>
            <InitialsAvatar name={currentUser.name} initials={currentUser.initials} size={38} online />
          </View>
          <View style={styles.sidebarDivider} />
          {mockProjects.map((p, i) => (
            <ProjectSidebarItem key={p.id} project={p} active={activeProject === i} onPress={() => setActiveProject(i)} />
          ))}
        </View>
        <View style={styles.sidebarBottom}>
          <TouchableOpacity style={styles.sidebarAction} onPress={() => router.push('/chat/new' as any)}>
            <Ionicons name="add" size={22} color={Colors.gray400} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarAction} onPress={() => router.push('/settings' as any)}>
            <Ionicons name="settings-outline" size={20} color={Colors.gray400} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Panel */}
      <View style={styles.main}>
        {/* Sticky Header */}
        <Animated.View style={[styles.header, { opacity: headerAnim, transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-12, 0] }) }] }]}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Messages</Text>
              {totalUnread > 0 && (
                <View style={styles.headerBadge}>
                  <Text style={styles.headerBadgeText}>{totalUnread}</Text>
                </View>
              )}
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerBtn} onPress={() => setSearch('')}>
                <Ionicons name="filter-outline" size={18} color={Colors.gray600} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.headerBtn, { backgroundColor: PRIMARY }]} onPress={() => router.push('/chat/new' as any)}>
                <Ionicons name="create-outline" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchWrap}>
            <Ionicons name="search-outline" size={16} color={Colors.gray400} style={{ marginLeft: 12 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search messages, people..."
              placeholderTextColor={Colors.gray400}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')} style={{ padding: 8 }}>
                <Ionicons name="close-circle" size={16} color={Colors.gray400} />
              </TouchableOpacity>
            )}
          </View>

          {/* Active Project Chip */}
          <View style={styles.projectChip}>
            <View style={[styles.projectChipDot, { backgroundColor: PRIMARY }]} />
            <Text style={styles.projectChipText}>{mockProjects[activeProject]?.name ?? 'All Chats'}</Text>
            <Text style={styles.projectChipCount}>{filtered.length} conversations</Text>
          </View>
        </Animated.View>

        {/* Online Now Strip */}
        <View style={styles.onlineStrip}>
          <Text style={styles.onlineStripLabel}>Online Now</Text>
          <FlatList
            horizontal
            data={mockChats.filter(c => !c.isGroup && (c as any).online) as ChatItem[]}
            keyExtractor={i => i.id + '_o'}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 16, paddingVertical: 4 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.onlineAvatarWrap} onPress={() => router.push(`/chat/${item.id}` as any)}>
                <InitialsAvatar name={item.name} initials={item.initials} size={44} online />
                <Text style={styles.onlineAvatarName} numberOfLines={1}>{item.name.split(' ')[0]}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Chat List */}
        <FlatList
          data={filtered}
          keyExtractor={i => i.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<View style={styles.listSectionHeader}><Text style={styles.listSectionLabel}>Recent</Text></View>}
          renderItem={({ item, index }) => (
            <ChatRow item={item} index={index} onPress={() => router.push(`/chat/${item.id}` as any)} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="chatbubbles-outline" size={48} color={Colors.gray300} />
              <Text style={styles.emptyStateText}>No conversations found</Text>
            </View>
          }
        />

        {/* FAB */}
        <TouchableOpacity style={styles.fab} activeOpacity={0.85} onPress={() => router.push('/chat/new' as any)}>
          <Ionicons name="chatbubble-ellipses" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const ptop = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 52;

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: '#F8FAFF' },

  // Sidebar
  sidebar: {
    backgroundColor: '#fff',
    borderRightWidth: 1, borderRightColor: '#F1F5F9',
    alignItems: 'center', justifyContent: 'space-between',
    paddingTop: ptop + 4, paddingBottom: 24,
    ...Shadow.sm,
  },
  sidebarTop: { alignItems: 'center', gap: 4, flex: 1 },
  sidebarBottom: { alignItems: 'center', gap: 4 },
  sidebarSelfAvatar: { marginBottom: 6 },
  sidebarDivider: { width: 32, height: 1, backgroundColor: '#F1F5F9', marginVertical: 8 },
  sidebarItem: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  sidebarItemActive: { backgroundColor: PRIMARY_LIGHT },
  sidebarIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  sidebarIconText: { fontSize: 11, fontWeight: '700', color: Colors.gray600, letterSpacing: 0.3 },
  sidebarActiveDot: { position: 'absolute', left: 0, top: '50%', width: 3, height: 24, borderRadius: 2, backgroundColor: PRIMARY, marginTop: -12 },
  sidebarAction: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#F8FAFF', alignItems: 'center', justifyContent: 'center', marginTop: 2 },

  // Main
  main: { flex: 1, backgroundColor: '#F8FAFF' },

  // Header
  header: {
    backgroundColor: '#fff',
    paddingTop: ptop,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    ...Shadow.sm,
    zIndex: 10,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: Typography.fontSize.xl, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },
  headerBadge: { backgroundColor: PRIMARY, borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2 },
  headerBadgeText: { fontSize: 11, color: '#fff', fontWeight: '700' },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F8FAFF', alignItems: 'center', justifyContent: 'center' },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F8FAFF', borderRadius: 12,
    borderWidth: 1, borderColor: '#E2E8F0',
    height: 42, marginBottom: 10,
  },
  searchInput: { flex: 1, paddingHorizontal: 10, fontSize: Typography.fontSize.sm, color: '#0F172A' },

  projectChip: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  projectChipDot: { width: 8, height: 8, borderRadius: 4 },
  projectChipText: { fontSize: Typography.fontSize.sm, fontWeight: '600', color: '#1E293B' },
  projectChipCount: { fontSize: Typography.fontSize.xs, color: Colors.gray400, marginLeft: 2 },

  // Online Strip
  onlineStrip: { backgroundColor: '#fff', paddingTop: 12, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  onlineStripLabel: { fontSize: Typography.fontSize.xs, fontWeight: '700', color: Colors.gray500, paddingHorizontal: 16, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.6 },
  onlineAvatarWrap: { alignItems: 'center', width: 52 },
  onlineAvatarName: { fontSize: 10, color: Colors.gray600, marginTop: 4, textAlign: 'center' },

  // Section
  listSectionHeader: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6 },
  listSectionLabel: { fontSize: Typography.fontSize.xs, fontWeight: '700', color: Colors.gray500, textTransform: 'uppercase', letterSpacing: 0.6 },

  // Chat Row
  chatRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#fff', marginHorizontal: 12, marginBottom: 4,
    borderRadius: 14, ...Shadow.sm,
  },
  chatRowUnread: { backgroundColor: PRIMARY_LIGHT, borderLeftWidth: 3, borderLeftColor: PRIMARY },
  chatRowAvatar: { position: 'relative', marginRight: 12 },
  groupBadgeIcon: {
    position: 'absolute', bottom: 0, right: -2,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#fff',
  },
  chatRowBody: { flex: 1 },
  chatRowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 },
  chatRowName: { fontSize: Typography.fontSize.base, fontWeight: '600', color: '#1E293B', flex: 1, marginRight: 8 },
  chatRowTime: { fontSize: Typography.fontSize.xs, color: Colors.gray400 },
  chatRowBottom: { flexDirection: 'row', alignItems: 'center' },
  chatRowPreview: { flex: 1, fontSize: Typography.fontSize.sm, color: Colors.gray500, lineHeight: 18 },
  chatRowMeta: { fontSize: 10, color: Colors.gray400, marginTop: 3 },
  unreadBadge: { minWidth: 20, height: 20, borderRadius: 10, backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  unreadBadgeText: { fontSize: 10, color: '#fff', fontWeight: '700' },

  // Empty
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyStateText: { fontSize: Typography.fontSize.base, color: Colors.gray400 },

  // FAB
  fab: {
    position: 'absolute', right: 20, bottom: 90,
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center',
    ...Shadow.lg,
  },
});
