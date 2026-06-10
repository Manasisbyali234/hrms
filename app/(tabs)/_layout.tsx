import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Shadow } from '../../src/design-system/tokens';

interface TabIconProps {
  name: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  focused: boolean;
  color: string;
}

const TabIcon: React.FC<TabIconProps> = ({ name, label, focused, color }) => (
  <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
    <View style={focused ? styles.activeIconBg : null}>
      <Ionicons name={name} size={focused ? 22 : 21} color={color} />
    </View>
    <Text style={[styles.tabLabel, { color, fontWeight: focused ? '700' : '500' }]}>{label}</Text>
  </View>
);

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray400,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} label="Home" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: 'Attendance',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'time' : 'time-outline'} label="Attend" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="leaves"
        options={{
          title: 'Leaves',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'calendar' : 'calendar-outline'} label="Leaves" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'checkmark-circle' : 'checkmark-circle-outline'} label="Tasks" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'chatbubbles' : 'chatbubbles-outline'} label="Chat" focused={focused} color={color} />
          ),
          tabBarBadge: 7,
          tabBarBadgeStyle: { backgroundColor: Colors.danger, fontSize: 10, minWidth: 18, height: 18, borderRadius: 9 },
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: Platform.OS === 'ios' ? 82 : 64,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
    paddingBottom: Platform.OS === 'ios' ? 22 : 6,
    paddingTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 16,
  },
  tabItem: {
    alignItems: 'center', justifyContent: 'center',
    paddingVertical: 2, paddingHorizontal: 6,
    minWidth: 52, minHeight: 44,
  },
  tabItemFocused: {},
  activeIconBg: {
    backgroundColor: Colors.primary + '14',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 1,
  },
  tabLabel: { fontSize: 10, letterSpacing: 0.1, marginTop: 2 },
});
