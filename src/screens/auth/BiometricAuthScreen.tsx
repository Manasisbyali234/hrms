import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../design-system/tokens';
import { Button } from '../../design-system/components/Button';

const shadowLg = Platform.OS === 'web'
  ? { boxShadow: '0px 8px 24px rgba(46,134,181,0.18)' }
  : { shadowColor: '#2E86B5', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.18, shadowRadius: 24, elevation: 10 };

export default function BiometricAuthScreen() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [success, setSuccess]   = useState(false);
  const pulseAnim   = useRef(new Animated.Value(1)).current;
  const successAnim = useRef(new Animated.Value(0)).current;

  const pulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 700, useNativeDriver: true }),
      ])
    ).start();
  };

  const handleScan = () => {
    setScanning(true);
    pulse();
    setTimeout(() => {
      pulseAnim.stopAnimation();
      setScanning(false);
      setSuccess(true);
      Animated.spring(successAnim, { toValue: 1, useNativeDriver: true, tension: 60 }).start();
      setTimeout(() => router.replace('/(tabs)'), 1200);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={styles.bg} />
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <View><Ionicons name="arrow-back" size={24} color={Colors.white} /></View>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.userCard}>
          <View style={[styles.avatar, shadowLg]}>
            <Text style={styles.avatarText}>{'VM'}</Text>
          </View>
          <Text style={styles.userName}>{'Venil Mottana'}</Text>
          <Text style={styles.userRole}>{'Senior Software Engineer'}</Text>
        </View>

        <TouchableOpacity onPress={handleScan} activeOpacity={0.85} disabled={scanning || success}>
          <Animated.View style={[styles.scanBtn, shadowLg, { transform: [{ scale: pulseAnim }] }]}>
            {success ? (
              <Animated.View style={{ transform: [{ scale: successAnim }] }}>
                <View><Ionicons name="checkmark-circle" size={56} color={Colors.success} /></View>
              </Animated.View>
            ) : scanning ? (
              <View><Ionicons name="scan-outline" size={52} color={Colors.primaryLight} /></View>
            ) : (
              <View><Ionicons name="finger-print" size={52} color={Colors.white} /></View>
            )}
          </Animated.View>
        </TouchableOpacity>

        <Text style={styles.scanLabel}>
          {success ? 'Authenticated!' : scanning ? 'Scanning...' : 'Touch to authenticate'}
        </Text>
        <Text style={styles.scanSub}>
          {success ? 'Welcome back, Venil' : 'Use Face ID or Fingerprint to sign in'}
        </Text>

        {!scanning && !success && (
          <View style={styles.options}>
            <Button title="Use Password Instead" variant="outline" size="md" onPress={() => router.replace('/auth/login')} style={styles.optionBtn} />
            <TouchableOpacity onPress={() => router.replace('/auth/login')} style={styles.switchUser}>
              <View><Ionicons name="swap-horizontal-outline" size={14} color="rgba(255,255,255,0.5)" /></View>
              <Text style={styles.switchText}>{'Switch Account'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1 },
  bg:         { ...StyleSheet.absoluteFillObject, backgroundColor: Colors.primaryDark },
  backBtn:    { position: 'absolute', top: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 16 : 60, left: Spacing[5], zIndex: 10 },
  content:    { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing[6] },
  userCard:   { alignItems: 'center', marginBottom: 60 },
  avatar:     { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)', marginBottom: 16 },
  avatarText: { fontSize: Typography.fontSize['2xl'], fontWeight: '800', color: Colors.white },
  userName:   { fontSize: Typography.fontSize.xl, fontWeight: '800', color: Colors.white, marginBottom: 4 },
  userRole:   { fontSize: Typography.fontSize.sm, color: 'rgba(255,255,255,0.6)' },
  scanBtn:    { width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  scanLabel:  { fontSize: Typography.fontSize.lg, fontWeight: '700', color: Colors.white, marginBottom: 8 },
  scanSub:    { fontSize: Typography.fontSize.sm, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 60 },
  options:    { alignItems: 'center', width: '100%' },
  optionBtn:  { marginBottom: 16 },
  switchUser: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 8 },
  switchText: { fontSize: Typography.fontSize.sm, color: 'rgba(255,255,255,0.5)' },
});
