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
      <Ionicons name={name} size={focused ? 20 : 20} color={focused ? '#fff' : color} />
    </View>
    <Text style={[styles.tabLabel, { color: focused ? Colors.primary : color, fontWeight: focused ? '700' : '500' }]}>{label}</Text>
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
    height: Platform.OS === 'ios' ? 84 : 66,
    backgroundColor: '#fff',
    borderTopWidth: 0,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    shadowColor: '#4DA8DA',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 20,
  },
  tabItem: {
    alignItems: 'center', justifyContent: 'center',
    minWidth: 52, minHeight: 44, gap: 2,
  },
  tabItemFocused: {},
  activeIconBg: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 2,
  },
  tabLabel: { fontSize: 10, letterSpacing: 0.1 },
});
