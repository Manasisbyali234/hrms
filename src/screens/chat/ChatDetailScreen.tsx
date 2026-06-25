import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, Platform, StatusBar, KeyboardAvoidingView,
  Animated, Easing,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../design-system/tokens';
import { mockChats } from '../../data/mockData';

const PRIMARY = '#3B82F6';
const PRIMARY_LIGHT = '#EFF6FF';

type Message = {
  id: string;
  text: string;
  mine: boolean;
  time: string;
  status?: 'sent' | 'delivered' | 'read';
  attachment?: { name: string; size: string };
};

const SEED_MESSAGES: Record<string, Message[]> = {
  C001: [
    { id: '1', text: "Hey! How's the PR coming along?", mine: false, time: '10:28 AM', status: 'read' },
    { id: '2', text: 'Almost done, will push in 30 mins 🚀', mine: true, time: '10:30 AM', status: 'read' },
    { id: '3', text: 'Please review the PR when you get a chance', mine: false, time: '10:32 AM', status: 'read' },
    { id: '4', text: 'Sure! Dropping a comment thread now', mine: true, time: '10:35 AM', status: 'delivered' },
  ],
  C002: [
    { id: '1', text: 'Team sync moved to 3 PM', mine: false, time: '09:10 AM', status: 'read' },
    { id: '2', text: 'Got it, thanks! 👍', mine: true, time: '09:12 AM', status: 'read' },
    { id: '3', text: 'Meeting rescheduled to 3 PM', mine: false, time: '09:15 AM', status: 'read' },
    { id: '4', text: 'Can we also discuss the sprint backlog?', mine: true, time: '09:18 AM', status: 'sent' },
    { id: '5', text: 'Absolutely, agenda updated ✓', mine: false, time: '09:20 AM', status: 'read' },
  ],
  C003: [
    { id: '1', text: 'Hi, just checking on your leave request', mine: false, time: 'Yesterday', status: 'read' },
    { id: '2', text: 'Your leave has been approved ✓', mine: false, time: 'Yesterday', status: 'read' },
    { id: '3', text: 'Thank you so much! 🙏', mine: true, time: 'Yesterday', status: 'read' },
  ],
  C004: [
    { id: '1', text: 'Updated the design files — let me know if changes needed', mine: false, time: 'Yesterday', status: 'read' },
    { id: '2', text: 'Design file attached', mine: false, time: 'Yesterday', status: 'read', attachment: { name: 'Dashboard_v3.fig', size: '4.2 MB' } },
    { id: '3', text: 'Looks great! Just one minor tweak on the header spacing', mine: true, time: 'Yesterday', status: 'read' },
  ],
  C005: [
    { id: '1', text: 'Sprint review at 4 PM today 📅', mine: false, time: 'Jun 3', status: 'read' },
    { id: '2', text: "I'll be there!", mine: true, time: 'Jun 3', status: 'read' },
    { id: '3', text: 'Please prepare your demo screens', mine: false, time: 'Jun 3', status: 'read' },
  ],
};

const AVATAR_COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'];
function getAvatarColor(name: string) {
  let h = 0; for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function Avatar({ name, initials, size = 36, online = false }: { name: string; initials?: string; size?: number; online?: boolean }) {
  const bg = getAvatarColor(name);
  const letters = initials ?? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#fff', fontSize: size * 0.36, fontWeight: '700' }}>{letters}</Text>
      {online && <View style={{ position: 'absolute', bottom: 1, right: 1, width: size * 0.27, height: size * 0.27, borderRadius: size * 0.14, backgroundColor: '#10B981', borderWidth: 2, borderColor: '#fff' }} />}
    </View>
  );
}

function TypingIndicator() {
  const dots = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];
  useEffect(() => {
    const anims = dots.map((d, i) =>
      Animated.loop(Animated.sequence([
        Animated.delay(i * 150),
        Animated.timing(d, { toValue: -5, duration: 300, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(d, { toValue: 0, duration: 300, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.delay(600),
      ]))
    );
    anims.forEach(a => a.start());
    return () => anims.forEach(a => a.stop());
  }, []);

  return (
    <View style={styles.typingWrap}>
      <View style={styles.typingBubble}>
        {dots.map((d, i) => (
          <Animated.View key={i} style={[styles.typingDot, { transform: [{ translateY: d }] }]} />
        ))}
      </View>
    </View>
  );
}

function MessageBubble({ item, prevMine }: { item: Message; prevMine?: boolean }) {
  const slideAnim = useRef(new Animated.Value(item.mine ? 20 : -20)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  const showTail = !prevMine || prevMine !== item.mine;

  return (
    <Animated.View style={[
      styles.bubbleRow,
      item.mine ? styles.bubbleRowMine : styles.bubbleRowTheirs,
      { opacity: fadeAnim, transform: [{ translateX: slideAnim }] },
      !showTail && { marginTop: 2 },
    ]}>
      {!item.mine && showTail && (
        <View style={{ marginRight: 8, alignSelf: 'flex-end' }}>
          <Avatar name="Sender" size={28} />
        </View>
      )}
      {!item.mine && !showTail && <View style={{ width: 36 }} />}

      <View style={[
        styles.bubble,
        item.mine ? styles.bubbleMine : styles.bubbleTheirs,
        showTail && item.mine && styles.bubbleMineWithTail,
        showTail && !item.mine && styles.bubbleTheirsWithTail,
      ]}>
        {item.attachment && (
          <View style={[styles.attachCard, item.mine && styles.attachCardMine]}>
            <Ionicons name="document-attach-outline" size={20} color={item.mine ? 'rgba(255,255,255,0.9)' : PRIMARY} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.attachName, item.mine && { color: '#fff' }]} numberOfLines={1}>{item.attachment.name}</Text>
              <Text style={[styles.attachSize, item.mine && { color: 'rgba(255,255,255,0.7)' }]}>{item.attachment.size}</Text>
            </View>
            <Ionicons name="download-outline" size={16} color={item.mine ? 'rgba(255,255,255,0.8)' : Colors.gray500} />
          </View>
        )}
        {item.text.length > 0 && (
          <Text style={[styles.bubbleText, item.mine && styles.bubbleTextMine]}>{item.text}</Text>
        )}
        <View style={[styles.bubbleMeta, item.mine && { justifyContent: 'flex-end' }]}>
          <Text style={[styles.bubbleTime, item.mine && styles.bubbleTimeMine]}>{item.time}</Text>
          {item.mine && (
            <Ionicons
              name={item.status === 'read' ? 'checkmark-done' : item.status === 'delivered' ? 'checkmark-done-outline' : 'checkmark-outline'}
              size={13}
              color={item.status === 'read' ? '#93C5FD' : 'rgba(255,255,255,0.6)'}
              style={{ marginLeft: 3 }}
            />
          )}
        </View>
      </View>
    </Animated.View>
  );
}

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const chat = mockChats.find(c => c.id === id);
  const [messages, setMessages] = useState<Message[]>(SEED_MESSAGES[id] ?? []);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const listRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  const headerScale = useRef(new Animated.Value(0.97)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(headerScale, { toValue: 1, tension: 80, friction: 12, useNativeDriver: true }),
    ]).start();

    // Simulate typing after 1.5s
    const t = setTimeout(() => { setTyping(true); setTimeout(() => setTyping(false), 2500); }, 1500);
    return () => clearTimeout(t);
  }, []);

  const send = () => {
    if (!input.trim()) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: Message = { id: Date.now().toString(), text: input.trim(), mine: true, time, status: 'sent' };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  if (!chat) return (
    <View style={styles.center}>
      <Text style={{ color: Colors.gray500 }}>Chat not found</Text>
    </View>
  );

  const isOnline = !chat.isGroup && (chat as any).online;
  const allMessages = typing ? [...messages, { id: 'typing', text: '', mine: false, time: '' }] : messages;

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent />

      {/* Sticky Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity, transform: [{ scale: headerScale }] }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#1E293B" />
        </TouchableOpacity>

        <View style={styles.headerAvatarWrap}>
          <Avatar name={chat.name} initials={(chat as any).initials} size={40} online={isOnline} />
          {chat.isGroup && (
            <View style={styles.headerGroupBadge}>
              <Ionicons name="people" size={10} color="#fff" />
            </View>
          )}
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{chat.name}</Text>
          <View style={styles.headerStatusRow}>
            {isOnline && <View style={styles.onlineDot} />}
            <Text style={[styles.headerSub, isOnline && { color: '#10B981' }]}>
              {chat.isGroup ? `${(chat as any).members} members` : isOnline ? 'Active now' : 'Offline'}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="call-outline" size={18} color={Colors.gray600} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="videocam-outline" size={18} color={Colors.gray600} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => setShowActions(!showActions)}>
            <Ionicons name="ellipsis-vertical" size={18} color={Colors.gray600} />
          </TouchableOpacity>
        </View>

        {showActions && (
          <View style={styles.actionMenu}>
            {['View Profile', 'Search in Chat', 'Mute Notifications', 'Clear Chat'].map((label, i) => (
              <TouchableOpacity key={i} style={[styles.actionMenuItem, i < 3 && { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }]} onPress={() => setShowActions(false)}>
                <Text style={[styles.actionMenuText, label === 'Clear Chat' && { color: Colors.danger }]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </Animated.View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={allMessages}
        keyExtractor={m => m.id}
        contentContainerStyle={styles.msgList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item, index }) => {
          if (item.id === 'typing') return <TypingIndicator />;
          const prev = index > 0 ? messages[index - 1] : undefined;
          return <MessageBubble item={item} prevMine={prev?.mine} />;
        }}
      />

      {/* Composer */}
      <View style={styles.composer}>
        <TouchableOpacity style={styles.composerBtn}>
          <Ionicons name="add-circle-outline" size={24} color={Colors.gray500} />
        </TouchableOpacity>
        <View style={styles.composerInputWrap}>
          <TextInput
            ref={inputRef}
            style={styles.composerInput}
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            placeholderTextColor={Colors.gray400}
            multiline
            returnKeyType="default"
          />
          <TouchableOpacity style={styles.emojiBtn}>
            <Ionicons name="happy-outline" size={20} color={Colors.gray400} />
          </TouchableOpacity>
        </View>
        {input.trim().length > 0 ? (
          <TouchableOpacity style={styles.sendBtn} onPress={send}>
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.composerBtn}>
            <Ionicons name="mic-outline" size={22} color={Colors.gray500} />
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const ptop = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 52;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFF' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: ptop, paddingHorizontal: 12, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    gap: 8, zIndex: 20,
    ...Shadow.sm,
  },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F8FAFF', alignItems: 'center', justifyContent: 'center' },
  headerAvatarWrap: { position: 'relative' },
  headerGroupBadge: { position: 'absolute', bottom: 0, right: -2, width: 16, height: 16, borderRadius: 8, backgroundColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  headerInfo: { flex: 1 },
  headerName: { fontSize: Typography.fontSize.base, fontWeight: '700', color: '#0F172A', letterSpacing: -0.2 },
  headerStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#10B981' },
  headerSub: { fontSize: Typography.fontSize.xs, color: Colors.gray400 },
  headerRight: { flexDirection: 'row', gap: 2 },
  headerIconBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#F8FAFF', alignItems: 'center', justifyContent: 'center' },

  actionMenu: {
    position: 'absolute', top: '100%', right: 12,
    backgroundColor: '#fff', borderRadius: 14,
    borderWidth: 1, borderColor: '#F1F5F9',
    zIndex: 100, minWidth: 180,
    ...Shadow.lg,
  },
  actionMenuItem: { paddingHorizontal: 16, paddingVertical: 12 },
  actionMenuText: { fontSize: Typography.fontSize.sm, color: '#1E293B', fontWeight: '500' },

  // Messages
  msgList: { paddingHorizontal: 12, paddingTop: 16, paddingBottom: 12, gap: 4 },

  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', marginVertical: 2 },
  bubbleRowMine: { justifyContent: 'flex-end' },
  bubbleRowTheirs: { justifyContent: 'flex-start' },

  bubble: {
    maxWidth: '75%', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10,
    ...Shadow.sm,
  },
  bubbleMine: { backgroundColor: PRIMARY, borderBottomRightRadius: 4 },
  bubbleTheirs: { backgroundColor: '#fff', borderBottomLeftRadius: 4 },
  bubbleMineWithTail: { borderBottomRightRadius: 4 },
  bubbleTheirsWithTail: { borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: Typography.fontSize.sm, color: '#1E293B', lineHeight: 20 },
  bubbleTextMine: { color: '#fff' },
  bubbleMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  bubbleTime: { fontSize: 10, color: Colors.gray400 },
  bubbleTimeMine: { color: 'rgba(255,255,255,0.65)' },

  // Attachment card
  attachCard: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#EFF6FF', borderRadius: 10, padding: 10,
    marginBottom: 6,
  },
  attachCardMine: { backgroundColor: 'rgba(255,255,255,0.18)' },
  attachName: { fontSize: Typography.fontSize.xs, fontWeight: '600', color: '#1E293B' },
  attachSize: { fontSize: 10, color: Colors.gray500, marginTop: 1 },

  // Typing
  typingWrap: { flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 44, marginVertical: 4 },
  typingBubble: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#fff', borderRadius: 16, borderBottomLeftRadius: 4,
    paddingHorizontal: 14, paddingVertical: 12,
    ...Shadow.sm,
  },
  typingDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.gray400 },

  // Composer
  composer: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 8,
    backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    borderTopWidth: 1, borderTopColor: '#F1F5F9',
    ...Shadow.sm,
  },
  composerBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8FAFF', alignItems: 'center', justifyContent: 'center' },
  composerInputWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'flex-end',
    backgroundColor: '#F8FAFF', borderRadius: 14,
    borderWidth: 1, borderColor: '#E2E8F0',
    paddingRight: 4, minHeight: 42,
  },
  composerInput: {
    flex: 1, minHeight: 40, maxHeight: 110,
    paddingHorizontal: 14, paddingVertical: 10,
    fontSize: Typography.fontSize.sm, color: '#0F172A',
  },
  emojiBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
  sendBtn: { width: 42, height: 42, borderRadius: 13, backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center', ...Shadow.md },
});
