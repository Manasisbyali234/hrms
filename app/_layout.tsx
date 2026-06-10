import { Stack } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { Colors } from '../src/design-system/tokens';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth/welcome" />
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/otp" />
      <Stack.Screen name="auth/forgot-password" />
      <Stack.Screen name="auth/biometric-auth" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="announcements/index" />
      <Stack.Screen name="notifications/index" />
      <Stack.Screen name="profile/index" />
      <Stack.Screen name="employees/index" />
      <Stack.Screen name="projects/index" />
      <Stack.Screen name="expenses/index" />
      <Stack.Screen name="payroll/index" />
      <Stack.Screen name="leaves/apply" />
      <Stack.Screen name="settings/index" />
    </Stack>
  );
}
