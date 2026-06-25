import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, StatusBar, KeyboardAvoidingView, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../design-system/tokens';
import { Input } from '../../design-system/components/Input';
import { Button } from '../../design-system/components/Button';
import { Card } from '../../design-system/components/Card';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmall = SCREEN_WIDTH < 360;

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const LEAVE_TYPES: { label: string; iconName: IoniconName; balance: number }[] = [
  { label: 'Annual Leave',       iconName: 'sunny-outline',          balance: 8 },
  { label: 'Sick Leave',         iconName: 'medical-outline',         balance: 4 },
  { label: 'Casual Leave',       iconName: 'cafe-outline',            balance: 3 },
  { label: 'Compensatory Leave', iconName: 'refresh-circle-outline',  balance: 2 },
];

export default function ApplyLeaveScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState(0);
  const [fromDate, setFromDate] = useState('2025-06-10');
  const [toDate, setToDate] = useState('2025-06-12');
  const [reason, setReason] = useState('');
  const [halfDay, setHalfDay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1500);
  };

  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successIconBox}>
          <Ionicons name="checkmark-circle" size={72} color={Colors.success} />
        </View>
        <Text style={styles.successTitle}>Leave Applied!</Text>
        <Text style={styles.successSub}>
          Your {LEAVE_TYPES[selectedType].label} request has been submitted for approval.
        </Text>
        <Text style={styles.successDetail}>Jun 10 – Jun 12, 2025 (3 days)</Text>
        <Button title="Go to Leave Dashboard" onPress={() => router.back()} size="lg" style={{ marginTop: 32 }} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.gray900} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Apply for Leave</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <Text style={styles.sectionLabel}>Leave Type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typesRow}>
          {LEAVE_TYPES.map((lt, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.typeCard, selectedType === i && styles.typeCardActive]}
              onPress={() => setSelectedType(i)}
            >
              <View style={[styles.typeIconBox, selectedType === i && styles.typeIconBoxActive]}>
                <Ionicons name={lt.iconName} size={22} color={selectedType === i ? Colors.white : Colors.primary} />
              </View>
              <Text style={[styles.typeLabel, selectedType === i && styles.typeLabelActive]}>{lt.label}</Text>
              <Text style={[styles.typeBalance, selectedType === i && { color: 'rgba(255,255,255,0.8)' }]}>
                {lt.balance} days left
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionLabel}>Date Range</Text>
        <View style={[styles.dateRow, isSmall && styles.dateRowSmall]}>
          <View style={styles.dateBox}>
            <Text style={styles.dateLabel}>From</Text>
            <Input
              value={fromDate} onChangeText={setFromDate} placeholder="YYYY-MM-DD"
              leftIcon={<Ionicons name="calendar-outline" size={18} color={Colors.gray400} />}
              style={{ marginBottom: 0 }}
            />
          </View>
          {!isSmall && (
            <View style={styles.dateSeparator}>
              <Ionicons name="arrow-forward" size={18} color={Colors.gray400} />
            </View>
          )}
          <View style={styles.dateBox}>
            <Text style={styles.dateLabel}>To</Text>
            <Input
              value={toDate} onChangeText={setToDate} placeholder="YYYY-MM-DD"
              leftIcon={<Ionicons name="calendar-outline" size={18} color={Colors.gray400} />}
              style={{ marginBottom: 0 }}
            />
          </View>
        </View>

        <Card style={styles.durationCard}>
          <View style={styles.durationRow}>
            <View style={styles.durationIconBox}>
              <Ionicons name="time-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.durationInfo}>
              <Text style={styles.durationLabel}>Duration</Text>
              <Text style={styles.durationValue}>3 Working Days</Text>
            </View>
            <TouchableOpacity
              style={[styles.halfDayBtn, halfDay && styles.halfDayBtnActive]}
              onPress={() => setHalfDay(!halfDay)}
            >
              {halfDay && <Ionicons name="checkmark" size={12} color={Colors.white} />}
              <Text style={[styles.halfDayText, halfDay && { color: Colors.white }]}>
                {halfDay ? 'Half Day' : 'Half Day?'}
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Text style={styles.sectionLabel}>Reason</Text>
        <Input
          value={reason} onChangeText={setReason}
          placeholder="Please provide a reason for your leave request..."
          multiline numberOfLines={4}
          leftIcon={<Ionicons name="create-outline" size={18} color={Colors.gray400} />}
        />

        <Text style={styles.sectionLabel}>Approver</Text>
        <Card>
          <View style={styles.approverRow}>
            <View style={styles.approverAvatar}>
              <Text style={styles.approverInitials}>RS</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.approverName}>Rahul Sharma</Text>
              <Text style={styles.approverRole}>Engineering Manager</Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
          </View>
        </Card>

        <View style={styles.policyNote}>
          <Ionicons name="information-circle-outline" size={18} color={Colors.info} />
          <Text style={styles.policyText}>
            Leave requests must be submitted at least 2 working days in advance. Emergency leaves require manager approval.
          </Text>
        </View>

        <Button title="Submit Leave Request" onPress={handleSubmit} loading={loading} size="lg" fullWidth style={{ marginTop: 16 }} />
        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    backgroundColor: Colors.white,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 56,
    paddingHorizontal: Spacing[4], paddingBottom: 16,
    flexDirection: 'row', alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: Colors.gray100,
  },
  backBtn: { marginRight: 16, padding: 4 },
  headerTitle: { fontSize: Typography.fontSize.md, fontWeight: '700', color: Colors.gray900 },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing[4] },
  sectionLabel: { fontSize: Typography.fontSize.sm, fontWeight: '700', color: Colors.gray700, marginBottom: 10, marginTop: 4 },
  typesRow: { marginBottom: Spacing[4] },
  typeCard: {
    alignItems: 'center', backgroundColor: Colors.gray50,
    borderRadius: Radius.lg, padding: 14, marginRight: 12,
    borderWidth: 2, borderColor: Colors.gray200, minWidth: 110,
  },
  typeCardActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  typeIconBox: { width: 44, height: 44, borderRadius: Radius.md, backgroundColor: Colors.overlayLight, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  typeIconBoxActive: { backgroundColor: 'rgba(255,255,255,0.2)' },
  typeLabel: { fontSize: Typography.fontSize.xs, fontWeight: '700', color: Colors.gray700, textAlign: 'center', marginBottom: 4 },
  typeLabelActive: { color: Colors.white },
  typeBalance: { fontSize: 10, color: Colors.gray500 },
  dateRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing[3] },
  dateRowSmall: { flexDirection: 'column', gap: 8 },
  dateBox: { flex: 1 },
  dateLabel: { fontSize: Typography.fontSize.xs, color: Colors.gray500, marginBottom: 4 },
  dateSeparator: { paddingHorizontal: 8, paddingTop: 28 },
  durationCard: { marginBottom: Spacing[4] },
  durationRow: { flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  durationIconBox: { width: 40, height: 40, borderRadius: Radius.md, backgroundColor: Colors.overlayLight, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  durationInfo: { flex: 1, minWidth: 80 },
  durationLabel: { fontSize: Typography.fontSize.xs, color: Colors.gray500 },
  durationValue: { fontSize: Typography.fontSize.base, fontWeight: '700', color: Colors.primary },
  halfDayBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full, borderWidth: 1.5, borderColor: Colors.primary, flexShrink: 0 },
  halfDayBtnActive: { backgroundColor: Colors.primary },
  halfDayText: { fontSize: Typography.fontSize.xs, color: Colors.primary, fontWeight: '600' },
  approverRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  approverAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  approverInitials: { fontSize: Typography.fontSize.base, fontWeight: '700', color: Colors.white },
  approverName: { fontSize: Typography.fontSize.base, fontWeight: '700', color: Colors.gray900 },
  approverRole: { fontSize: Typography.fontSize.xs, color: Colors.gray500 },
  policyNote: { flexDirection: 'row', backgroundColor: Colors.infoLight, borderRadius: Radius.md, padding: Spacing[3], gap: 8, marginBottom: Spacing[3] },
  policyText: { flex: 1, fontSize: Typography.fontSize.xs, color: Colors.info, lineHeight: 18 },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing[5], paddingVertical: Spacing[8], backgroundColor: Colors.white },
  successIconBox: { marginBottom: 24 },
  successTitle: { fontSize: Typography.fontSize['3xl'], fontWeight: '800', color: Colors.gray900, marginBottom: 12 },
  successSub: { fontSize: Typography.fontSize.base, color: Colors.gray500, textAlign: 'center', lineHeight: 24, marginBottom: 8 },
  successDetail: { fontSize: Typography.fontSize.sm, color: Colors.primary, fontWeight: '700' },
});
