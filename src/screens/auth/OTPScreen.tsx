import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, StatusBar, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../design-system/tokens';
import { Button } from '../../design-system/components/Button';

const RESEND_SECONDS = 60;

export default function OTPScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<Array<TextInput | null>>([]);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (val: string, idx: number) => {
    const newOtp = [...otp];
    newOtp[idx] = val.replace(/[^0-9]/g, '').slice(-1);
    setOtp(newOtp);
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
    if (!val && idx > 0) inputs.current[idx - 1]?.focus();
  };

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6,   duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleVerify = () => {
    if (otp.join('').length < 6) { shake(); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); router.replace('/(tabs)'); }, 1500);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <View><Ionicons name="arrow-back" size={24} color={Colors.white} /></View>
        </TouchableOpacity>
        <View style={styles.headerIconBox}>
          <View><Ionicons name="keypad-outline" size={40} color={Colors.white} /></View>
        </View>
        <Text style={styles.title}>{'OTP Verification'}</Text>
        <Text style={styles.sub}>
          {'Enter the 6-digit code sent to\n'}
          <Text style={styles.email}>{'venil.mottana@metromindz.com'}</Text>
        </Text>
      </View>

      <View style={styles.body}>
        <Animated.View style={[styles.otpRow, { transform: [{ translateX: shakeAnim }] }]}>
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={el => { inputs.current[i] = el; }}
              style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
              value={digit}
              onChangeText={val => handleChange(val, i)}
              keyboardType="numeric" maxLength={1} selectTextOnFocus
            />
          ))}
        </Animated.View>

        <View style={styles.timerRow}>
          {timer > 0 ? (
            <View style={styles.timerContent}>
              <View><Ionicons name="time-outline" size={14} color={Colors.gray500} /></View>
              <Text style={styles.timerText}>
                {'Resend OTP in '}
                <Text style={styles.timerCount}>{`0:${String(timer).padStart(2, '0')}`}</Text>
              </Text>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setTimer(RESEND_SECONDS)} style={styles.resendBtn}>
              <View><Ionicons name="refresh-outline" size={14} color={Colors.primary} /></View>
              <Text style={styles.resendText}>{'Resend OTP'}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoCard}>
          <View><Ionicons name="information-circle-outline" size={20} color={Colors.warningDark} /></View>
          <Text style={styles.infoText}>{"Didn't receive the code? Check your spam folder or contact IT support."}</Text>
        </View>

        <Button title="Verify & Continue" onPress={handleVerify} loading={loading} size="lg" fullWidth style={{ marginTop: 32 }} />

        <TouchableOpacity onPress={() => router.push('/auth/login')} style={styles.changeMethod}>
          <View><Ionicons name="lock-closed-outline" size={14} color={Colors.primary} /></View>
          <Text style={styles.changeText}>{'Use password instead'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { backgroundColor: Colors.primary, paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 20 : 70, paddingBottom: 40, paddingHorizontal: Spacing[6], alignItems: 'center' },
  backBtn: { position: 'absolute', top: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 16 : 60, left: Spacing[5] },
  headerIconBox: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: Typography.fontSize['2xl'], fontWeight: '800', color: Colors.white, marginBottom: 12 },
  sub: { fontSize: Typography.fontSize.base, color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 22 },
  email: { color: Colors.white, fontWeight: '700' },
  body: { flex: 1, paddingHorizontal: Spacing[6], paddingTop: 40 },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  otpBox: { width: 52, height: 60, borderWidth: 2, borderColor: Colors.gray200, borderRadius: Radius.md, textAlign: 'center', fontSize: Typography.fontSize['2xl'], fontWeight: '700', color: Colors.gray900, backgroundColor: Colors.gray50 },
  otpBoxFilled: { borderColor: Colors.primary, backgroundColor: Colors.overlayLight, color: Colors.primary },
  timerRow: { alignItems: 'center', marginBottom: 24 },
  timerContent: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timerText: { fontSize: Typography.fontSize.sm, color: Colors.gray500 },
  timerCount: { color: Colors.primary, fontWeight: '700' },
  resendBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  resendText: { fontSize: Typography.fontSize.base, color: Colors.primary, fontWeight: '700' },
  infoCard: { flexDirection: 'row', backgroundColor: Colors.warningLight, borderRadius: Radius.md, padding: Spacing[4], gap: 10, alignItems: 'flex-start' },
  infoText: { flex: 1, fontSize: Typography.fontSize.sm, color: Colors.warningDark, lineHeight: 20 },
  changeMethod: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 20 },
  changeText: { fontSize: Typography.fontSize.sm, color: Colors.primary, fontWeight: '600' },
});
