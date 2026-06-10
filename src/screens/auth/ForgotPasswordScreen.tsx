import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../design-system/tokens';
import { Button } from '../../design-system/components/Button';
import { Input } from '../../design-system/components/Input';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (!email) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1500);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.gray900} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!sent ? (
          <>
            <View style={styles.iconBox}>
              <Ionicons name="key-outline" size={48} color={Colors.primary} />
            </View>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              No worries! Enter your registered work email and we'll send you a reset link.
            </Text>
            <Input
              label="Work Email" value={email} onChangeText={setEmail}
              placeholder="you@metromindz.com" keyboardType="email-address"
              leftIcon={<Ionicons name="mail-outline" size={18} color={Colors.gray400} />}
            />
            <Button title="Send Reset Link" onPress={handleSend} loading={loading} size="lg" fullWidth style={{ marginTop: 8 }} />
            <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
              <Ionicons name="arrow-back" size={14} color={Colors.primary} />
              <Text style={styles.backLinkText}> Back to Sign In</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.iconBox}>
              <Ionicons name="mail-open-outline" size={48} color={Colors.success} />
            </View>
            <Text style={styles.title}>Check your email!</Text>
            <Text style={styles.subtitle}>
              We sent a password reset link to{'\n'}
              <Text style={styles.emailText}>{email}</Text>
            </Text>
            <View style={styles.steps}>
              {['Open the email from MetroMindz HR', 'Click on "Reset Password" link', 'Create your new secure password'].map((step, i) => (
                <View key={i} style={styles.step}>
                  <View style={styles.stepNum}><Text style={styles.stepNumText}>{i + 1}</Text></View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>
            <Button title="Open Email App" onPress={() => {}} size="lg" fullWidth style={{ marginBottom: 12 }} />
            <Button title="Back to Sign In" onPress={() => router.replace('/auth/login')} variant="outline" size="lg" fullWidth />
            <TouchableOpacity style={styles.resend} onPress={() => setSent(false)}>
              <Text style={styles.resendText}>Didn't receive it? Try again</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 56, paddingHorizontal: Spacing[5], paddingBottom: 8 },
  backBtn: { padding: 4 },
  content: { paddingHorizontal: Spacing[6], paddingTop: Spacing[4], paddingBottom: 40 },
  iconBox: { width: 88, height: 88, borderRadius: 24, backgroundColor: Colors.overlayLight, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title: { fontSize: Typography.fontSize['2xl'], fontWeight: '800', color: Colors.gray900, marginBottom: 12 },
  subtitle: { fontSize: Typography.fontSize.base, color: Colors.gray500, lineHeight: 24, marginBottom: 32 },
  emailText: { color: Colors.primary, fontWeight: '700' },
  steps: { marginBottom: 32 },
  step: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  stepNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.overlayLight, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  stepNumText: { fontSize: Typography.fontSize.sm, fontWeight: '700', color: Colors.primary },
  stepText: { flex: 1, fontSize: Typography.fontSize.base, color: Colors.gray700 },
  backLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  backLinkText: { fontSize: Typography.fontSize.sm, color: Colors.primary, fontWeight: '600' },
  resend: { alignItems: 'center', marginTop: 16 },
  resendText: { fontSize: Typography.fontSize.sm, color: Colors.gray500 },
});
