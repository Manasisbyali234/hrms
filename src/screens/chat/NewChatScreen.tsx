import React from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Platform, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../design-system/tokens';
import { Avatar } from '../../design-system/components/Avatar';
import { mockEmployees, mockChats } from '../../data/mockData';

export default function NewChatScreen() {
  const router = useRouter();

  const handleSelect = (emp: typeof mockEmployees[0]) => {
    const existing = mockChats.find(c => !c.isGroup && (c as any).initials === emp.initials);
    if (existing) {
      router.replace(`/chat/${existing.id}` as any);
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Message</Text>
      </View>

      <FlatList
        data={mockEmployees}
        keyExtractor={e => e.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} activeOpacity={0.75} onPress={() => handleSelect(item)}>
            <Avatar name={item.name} initials={item.initials} size={48} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.role}>{item.designation}</Text>
            </View>
            <Ionicons name="chatbubble-outline" size={18} color={Colors.primary} />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 56,
    paddingHorizontal: Spacing[4], paddingBottom: Spacing[3],
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: Typography.fontSize.xl, fontWeight: '700', color: Colors.white },
  list: { padding: Spacing[4] },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12 },
  info: { flex: 1 },
  name: { fontSize: Typography.fontSize.base, fontWeight: '600', color: Colors.gray900 },
  role: { fontSize: Typography.fontSize.sm, color: Colors.gray500, marginTop: 2 },
  separator: { height: 1, backgroundColor: Colors.gray100 },
});
