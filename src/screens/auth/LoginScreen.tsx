import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, StatusBar, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../design-system/tokens';
import { Button } from '../../design-system/components/Button';
import { Input } from '../../design-system/components/Input';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('venil.mottana@metromindz.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); router.replace('/(tabs)'); }, 1500);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <View style={styles.header}>
        <View style={styles.headerCircle} />
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.logoBox}>
          <Image source={require('../../../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
        </View>
        <Text style={styles.headerTitle}>Welcome back</Text>
        <Text style={styles.headerSub}>Sign in to your MetroMindz account</Text>
      </View>

      <ScrollView style={styles.form} contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
        <Input
          label="Work Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@metromindz.com"
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon={<Ionicons name="mail-outline" size={18} color={Colors.gray400} />}
        />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry={!showPassword}
          leftIcon={<Ionicons name="lock-closed-outline" size={18} color={Colors.gray400} />}
          rightIcon={
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color={Colors.gray400} />
            </TouchableOpacity>
          }
        />

        <View style={styles.row}>
          <TouchableOpacity style={styles.rememberRow} onPress={() => setRemember(!remember)}>
            <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
              {remember && <Ionicons name="checkmark" size={12} color={Colors.white} />}
            </View>
            <Text style={styles.rememberText}>Remember me</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/auth/forgot-password')}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <Button title={loading ? 'Signing in...' : 'Sign In'} onPress={handleLogin} loading={loading} size="lg" fullWidth style={styles.loginBtn} />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.biometricBtn} onPress={() => router.push('/auth/biometric-auth')}>
          <View style={styles.biometricIconBox}>
            <Ionicons name="finger-print" size={28} color={Colors.primary} />
          </View>
          <View>
            <Text style={styles.biometricTitle}>Use Biometric Login</Text>
            <Text style={styles.biometricSub}>Face ID or Fingerprint</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.gray400} style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.otpBtn} onPress={() => router.push('/auth/otp')}>
          <Ionicons name="keypad-outline" size={16} color={Colors.primary} />
          <Text style={styles.otpText}>Sign in with OTP instead</Text>
          <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
        </TouchableOpacity>

        <View style={styles.securityNote}>
          <Ionicons name="shield-checkmark-outline" size={18} color={Colors.primaryDark} />
          <Text style={styles.securityText}>
            Your data is encrypted and protected with enterprise-grade security.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 56,
    paddingBottom: 36, paddingHorizontal: Spacing[5], overflow: 'hidden',
  },
  headerCircle: {
    position: 'absolute', width: 280, height: 280, borderRadius: 140,
    backgroundColor: 'rgba(255,255,255,0.12)', top: -90, right: -70,
  },
  backBtn: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 52,
    left: Spacing[5], zIndex: 10, padding: 4,
    minWidth: 36, minHeight: 36, alignItems: 'center', justifyContent: 'center',
  },
  logoBox: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
  },
  logoImage: { width: 40, height: 40 },
  headerTitle: { fontSize: Typography.fontSize['2xl'], fontWeight: '800', color: Colors.white, marginBottom: 5, letterSpacing: -0.3 },
  headerSub: { fontSize: Typography.fontSize.sm, color: 'rgba(255,255,255,0.7)', lineHeight: 20 },
  form: { flex: 1 },
  formContent: { paddingHorizontal: Spacing[5], paddingTop: Spacing[5], paddingBottom: 40 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing[5] },
  rememberRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 2,
    borderColor: Colors.gray300, marginRight: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  rememberText: { fontSize: Typography.fontSize.sm, color: Colors.gray600 },
  forgotText: { fontSize: Typography.fontSize.sm, color: Colors.primary, fontWeight: '700' },
  loginBtn: { marginBottom: Spacing[5] },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing[4] },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.gray200 },
  dividerText: { fontSize: Typography.fontSize.sm, color: Colors.gray400, paddingHorizontal: 12 },
  biometricBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.gray50, borderRadius: Radius.lg,
    padding: Spacing[4], borderWidth: 1.5, borderColor: Colors.gray200, marginBottom: Spacing[3], gap: 14,
    minHeight: 68,
  },
  biometricIconBox: {
    width: 44, height: 44, borderRadius: Radius.md,
    backgroundColor: Colors.overlayLight, alignItems: 'center', justifyContent: 'center',
  },
  biometricTitle: { fontSize: Typography.fontSize.base, fontWeight: '700', color: Colors.gray900 },
  biometricSub: { fontSize: Typography.fontSize.xs, color: Colors.gray500, marginTop: 2 },
  otpBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: Spacing[3], marginBottom: Spacing[4], minHeight: 44,
  },
  otpText: { fontSize: Typography.fontSize.sm, color: Colors.primary, fontWeight: '600' },
  securityNote: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: Colors.infoLight, borderRadius: Radius.md,
    padding: Spacing[3], gap: 8, borderWidth: 1, borderColor: Colors.accentLight,
  },
  securityText: { flex: 1, fontSize: Typography.fontSize.xs, color: Colors.primaryDark, lineHeight: 18 },
});
