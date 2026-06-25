import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, StatusBar, Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SvgXml } from 'react-native-svg';
import { Colors, Typography, Spacing, Radius } from '../../design-system/tokens';
import { Button } from '../../design-system/components/Button';
import { Input } from '../../design-system/components/Input';
import {
  fetchCaptcha, loginApi, saveToken,
  CaptchaResponse, LoginError, LoginSuccess,
} from '../../services/authService';

type LoginMode = 'employee' | 'superadmin';

export default function LoginScreen() {
  const router = useRouter();

  const [mode, setMode]               = useState<LoginMode>('employee');
  const [identifier, setIdentifier]   = useState('');   // employeeId or email
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [captcha, setCaptcha]               = useState('');
  const [captchaInput, setCaptchaInput]     = useState('');
  const [captchaToken, setCaptchaToken]     = useState('');
  const [captchaLoading, setCaptchaLoading] = useState(false);

  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [warning, setWarning]   = useState('');
  const [locked, setLocked]     = useState(false);

  // ── Load CAPTCHA ──────────────────────────────────────────────────────────
  const loadCaptcha = useCallback(async () => {
    setCaptchaLoading(true);
    setCaptchaInput('');
    setError('');
    try {
      const data: CaptchaResponse = await fetchCaptcha();
      setCaptcha(data.image);
      setCaptchaToken(data.captchaToken);
    } catch {
      setError('Failed to load CAPTCHA. Please try again.');
    } finally {
      setCaptchaLoading(false);
    }
  }, []);

  // Load on mount
  React.useEffect(() => { loadCaptcha(); }, [loadCaptcha]);

  // ── Switch login mode ─────────────────────────────────────────────────────
  const switchMode = (m: LoginMode) => {
    setMode(m);
    setIdentifier('');
    setError('');
    setWarning('');
  };

  // ── Dummy credentials ─────────────────────────────────────────────────────
  const isDummySuperAdmin = mode === 'superadmin';

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleLogin = async () => {
    setError('');
    setWarning('');

    const id = identifier.trim();
    if (!id) {
      setError(mode === 'superadmin' ? 'Email is required.' : 'Employee ID is required.');
      return;
    }
    if (!password) { setError('Password is required.'); return; }

    // Superadmin dummy bypass — no CAPTCHA needed
    if (mode === 'superadmin') {
      if (id.toLowerCase() === 'admin@metromindz.com' && password === 'Admin@1234') {
        setLoading(true);
        setTimeout(() => { setLoading(false); router.replace('/(tabs)'); }, 600);
      } else {
        setError('Invalid email or password.');
      }
      return;
    }

    // Employee login — requires CAPTCHA
    if (!captchaInput.trim()) { setError('CAPTCHA is required.'); return; }
    if (!captchaToken) { setError('Please wait for CAPTCHA to load.'); return; }

    setLoading(true);
    try {
      const payload = {
        password,
        captcha: captchaInput.trim(),
        captchaToken,
        ...(mode === 'superadmin' ? { email: identifier.trim() } : { employeeId: identifier.trim() }),
      };

      const { ok, status, data } = await loginApi(payload);

      if (ok && (data as LoginSuccess).success) {
        const success = data as LoginSuccess;
        await saveToken(success.token);
        router.replace('/(tabs)');
        return;
      }

      const err = data as LoginError;

      if (err.captchaInvalid) {
        setError(err.message);
        loadCaptcha();
        return;
      }

      if (err.locked) {
        setLocked(true);
        const mins = err.remainingMinutes ? ` Try again in ${err.remainingMinutes} minutes.` : '';
        setError(err.message + mins);
        return;
      }

      if (status === 403) {
        setError(err.message);
        return;
      }

      if (err.warned) {
        setWarning(`${err.message} (${err.attemptsLeft} attempt${err.attemptsLeft === 1 ? '' : 's'} left)`);
        loadCaptcha();
        return;
      }

      setError(err.message || 'Login failed. Please try again.');
      loadCaptcha();
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── Header ── */}
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

      <ScrollView
        style={styles.form}
        contentContainerStyle={styles.formContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Mode Toggle ── */}
        <View style={styles.toggle}>
          {(['employee', 'superadmin'] as LoginMode[]).map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.toggleBtn, mode === m && styles.toggleBtnActive]}
              onPress={() => switchMode(m)}
            >
              <Text style={[styles.toggleText, mode === m && styles.toggleTextActive]}>
                {m === 'employee' ? 'Employee' : 'Super Admin'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Identifier ── */}
        <Input
          label={mode === 'superadmin' ? 'Email' : 'Employee ID'}
          value={identifier}
          onChangeText={setIdentifier}
          placeholder={mode === 'superadmin' ? 'admin@metromindz.com' : 'EMP001'}
          keyboardType={mode === 'superadmin' ? 'email-address' : 'default'}
          autoCapitalize={mode === 'superadmin' ? 'none' : 'characters'}
          leftIcon={
            <Ionicons
              name={mode === 'superadmin' ? 'mail-outline' : 'id-card-outline'}
              size={18}
              color={Colors.gray400}
            />
          }
        />

        {/* ── Password ── */}
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry={!showPassword}
          leftIcon={<Ionicons name="lock-closed-outline" size={18} color={Colors.gray400} />}
          rightIcon={
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={Colors.gray400}
              />
            </TouchableOpacity>
          }
        />

        {/* ── CAPTCHA ── */}
        {!isDummySuperAdmin && (
        <View style={styles.captchaSection}>
          <Text style={styles.captchaLabel}>{'CAPTCHA Verification'}</Text>
          <View style={styles.captchaRow}>
            <View style={styles.captchaImageBox}>
              {captchaLoading ? (
                <ActivityIndicator color={Colors.primary} />
              ) : captcha ? (
                <SvgXml xml={captcha} width="100%" height={56} />
              ) : (
                <Text style={styles.captchaPlaceholder}>{'—'}</Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.refreshBtn}
              onPress={loadCaptcha}
              disabled={captchaLoading}
            >
              <View><Ionicons name="refresh" size={20} color={Colors.primary} /></View>
            </TouchableOpacity>
          </View>
          <Input
            label=""
            value={captchaInput}
            onChangeText={setCaptchaInput}
            placeholder="Enter CAPTCHA"
            autoCapitalize="characters"
            leftIcon={<Ionicons name="shield-outline" size={18} color={Colors.gray400} />}
            style={styles.captchaInput}
          />
        </View>
        )}

        {!!warning && (
          <View style={styles.warningBanner}>
            <View><Ionicons name="warning-outline" size={16} color={Colors.warningDark} /></View>
            <Text style={styles.warningText}>{warning}</Text>
          </View>
        )}

        {!!error && (
          <View style={styles.errorBanner}>
            <View><Ionicons name="alert-circle-outline" size={16} color={Colors.dangerDark} /></View>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* ── Forgot password ── */}
        <TouchableOpacity
          style={styles.forgotRow}
          onPress={() => router.push('/auth/forgot-password')}
        >
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* ── Login button ── */}
        <Button
          title={loading ? 'Signing in…' : 'Sign In'}
          onPress={handleLogin}
          loading={loading}
          disabled={locked}
          size="lg"
          fullWidth
          style={styles.loginBtn}
        />

        {/* ── Divider ── */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* ── Biometric ── */}
        <TouchableOpacity
          style={styles.biometricBtn}
          onPress={() => router.push('/auth/biometric-auth')}
        >
          <View style={styles.biometricIconBox}>
            <Ionicons name="finger-print" size={28} color={Colors.primary} />
          </View>
          <View>
            <Text style={styles.biometricTitle}>Use Biometric Login</Text>
            <Text style={styles.biometricSub}>Face ID or Fingerprint</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.gray400} style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>

        <View style={styles.securityNote}>
          <View><Ionicons name="shield-checkmark-outline" size={18} color={Colors.primaryDark} /></View>
          <Text style={styles.securityText}>{'Your data is encrypted and protected with enterprise-grade security.'}</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },

  // Header
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
  headerSub:   { fontSize: Typography.fontSize.sm, color: 'rgba(255,255,255,0.7)', lineHeight: 20 },

  // Form
  form: { flex: 1 },
  formContent: { paddingHorizontal: Spacing[5], paddingTop: Spacing[5], paddingBottom: 40 },

  // Toggle
  toggle: {
    flexDirection: 'row',
    backgroundColor: Colors.gray100,
    borderRadius: Radius.md,
    padding: 4,
    marginBottom: Spacing[5],
  },
  toggleBtn: {
    flex: 1, paddingVertical: 10, borderRadius: Radius.sm - 2,
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: Colors.white,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 2px 6px rgba(77,168,218,0.08)' }
      : { shadowColor: '#4DA8DA', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 }
    ),
  },
  toggleText: { fontSize: Typography.fontSize.sm, fontWeight: '600', color: Colors.gray500 },
  toggleTextActive: { color: Colors.primary },

  // CAPTCHA
  captchaSection: { marginBottom: Spacing[4] },
  captchaLabel: {
    fontSize: Typography.fontSize.sm, fontWeight: '600',
    color: Colors.gray700, marginBottom: 8, letterSpacing: 0.1,
  },
  captchaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  captchaImageBox: {
    flex: 1, height: 60, backgroundColor: Colors.gray50,
    borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.gray200,
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden', paddingHorizontal: 8,
  },
  captchaPlaceholder: { color: Colors.gray400, fontSize: Typography.fontSize.sm },
  refreshBtn: {
    width: 44, height: 44, borderRadius: Radius.md,
    backgroundColor: Colors.overlayLight, borderWidth: 1.5, borderColor: Colors.gray200,
    alignItems: 'center', justifyContent: 'center',
  },
  captchaInput: { marginBottom: 0 },

  // Banners
  warningBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: Colors.warningLight, borderRadius: Radius.md,
    padding: Spacing[3], marginBottom: Spacing[3],
    borderWidth: 1, borderColor: Colors.warning,
  },
  warningText: { flex: 1, fontSize: Typography.fontSize.xs, color: Colors.warningDark, lineHeight: 18 },
  errorBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: Colors.dangerLight, borderRadius: Radius.md,
    padding: Spacing[3], marginBottom: Spacing[3],
    borderWidth: 1, borderColor: Colors.danger,
  },
  errorText: { flex: 1, fontSize: Typography.fontSize.xs, color: Colors.dangerDark, lineHeight: 18 },

  forgotRow: { alignItems: 'flex-end', marginBottom: Spacing[4] },
  forgotText: { fontSize: Typography.fontSize.sm, color: Colors.primary, fontWeight: '700' },

  loginBtn: { marginBottom: Spacing[5] },

  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing[4] },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.gray200 },
  dividerText: { fontSize: Typography.fontSize.sm, color: Colors.gray400, paddingHorizontal: 12 },

  biometricBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.gray50, borderRadius: Radius.lg,
    padding: Spacing[4], borderWidth: 1.5, borderColor: Colors.gray200, marginBottom: Spacing[4], gap: 14,
    minHeight: 68,
  },
  biometricIconBox: {
    width: 44, height: 44, borderRadius: Radius.md,
    backgroundColor: Colors.overlayLight, alignItems: 'center', justifyContent: 'center',
  },
  biometricTitle: { fontSize: Typography.fontSize.base, fontWeight: '700', color: Colors.gray900 },
  biometricSub:   { fontSize: Typography.fontSize.xs, color: Colors.gray500, marginTop: 2 },

  securityNote: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: Colors.infoLight, borderRadius: Radius.md,
    padding: Spacing[3], gap: 8, borderWidth: 1, borderColor: Colors.accentLight,
  },
  securityText: { flex: 1, fontSize: Typography.fontSize.xs, color: Colors.primaryDark, lineHeight: 18 },
});
