import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../design-system/tokens';
import { Card, SectionHeader, Divider } from '../../design-system/components/Card';
import { Badge } from '../../design-system/components/Badge';
import { mockPayslips } from '../../data/mockData';

const SALARY_BREAKDOWN = [
  { label: 'Basic Salary', amount: 75000, type: 'earning' },
  { label: 'HRA', amount: 30000, type: 'earning' },
  { label: 'Special Allowance', amount: 20000, type: 'earning' },
  { label: 'Provident Fund', amount: -12500, type: 'deduction' },
  { label: 'Professional Tax', amount: -200, type: 'deduction' },
  { label: 'Income Tax (TDS)', amount: -13850, type: 'deduction' },
];

export default function PayrollScreen() {
  const router = useRouter();
  const latest = mockPayslips[0];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <View style={styles.header}>
        <View style={styles.headerCircle} />
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payroll</Text>
        <Text style={styles.headerSub}>Salary & payslip management</Text>

        {/* Current Month Card */}
        <View style={styles.salaryCard}>
          <View style={styles.salaryRow}>
            <View>
              <Text style={styles.salaryLabel}>Net Salary — {latest.month}</Text>
              <Text style={styles.salaryAmount}>₹{latest.netSalary.toLocaleString()}</Text>
            </View>
            <Badge label={latest.status} variant="success" />
          </View>
          <View style={styles.salaryMeta}>
            <View style={styles.salaryMetaItem}>
              <Text style={styles.salaryMetaLabel}>Gross</Text>
              <Text style={styles.salaryMetaValue}>₹{latest.grossSalary.toLocaleString()}</Text>
            </View>
            <View style={styles.salaryMetaDivider} />
            <View style={styles.salaryMetaItem}>
              <Text style={styles.salaryMetaLabel}>Deductions</Text>
              <Text style={[styles.salaryMetaValue, { color: Colors.dangerLight }]}>-₹{latest.deductions.toLocaleString()}</Text>
            </View>
            <View style={styles.salaryMetaDivider} />
            <View style={styles.salaryMetaItem}>
              <Text style={styles.salaryMetaLabel}>Paid On</Text>
              <Text style={styles.salaryMetaValue}>{latest.paidOn}</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Breakdown */}
        <SectionHeader title="Salary Breakdown — May 2025" />
        <Card>
          <View style={styles.breakdownHeader}>
            <Text style={styles.breakdownCol}>Component</Text>
            <Text style={styles.breakdownCol}>Amount</Text>
          </View>
          <Divider />
          {SALARY_BREAKDOWN.map((item, i) => (
            <View key={item.label}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>{item.label}</Text>
                <Text style={[styles.breakdownAmount, { color: item.type === 'deduction' ? Colors.danger : Colors.success }]}>
                  {item.amount < 0 ? '-' : '+'}₹{Math.abs(item.amount).toLocaleString()}
                </Text>
              </View>
              {i < SALARY_BREAKDOWN.length - 1 && <Divider />}
            </View>
          ))}
          <View style={styles.breakdownTotal}>
            <Text style={styles.breakdownTotalLabel}>Net Salary</Text>
            <Text style={styles.breakdownTotalAmount}>₹{latest.netSalary.toLocaleString()}</Text>
          </View>
        </Card>

        {/* Download */}
        <TouchableOpacity style={styles.downloadBtn} activeOpacity={0.85}>
          <Ionicons name="download-outline" size={20} color={Colors.white} />
          <Text style={styles.downloadText}>Download May 2025 Payslip (PDF)</Text>
        </TouchableOpacity>

        {/* Payslip History */}
        <SectionHeader title="Payslip History" />
        {mockPayslips.map(slip => (
          <Card key={slip.id} onPress={() => {}}>
            <View style={styles.slipRow}>
              <View style={styles.slipIcon}>
                <Ionicons name="wallet-outline" size={22} color={Colors.primary} />
              </View>
              <View style={styles.slipInfo}>
                <Text style={styles.slipMonth}>{slip.month}</Text>
                <Text style={styles.slipDate}>Paid on {slip.paidOn}</Text>
              </View>
              <View style={styles.slipRight}>
                <Text style={styles.slipNet}>₹{slip.netSalary.toLocaleString()}</Text>
                <Badge label={slip.status} variant="success" />
              </View>
            </View>
          </Card>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.gray50 },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 56,
    paddingHorizontal: Spacing[4], paddingBottom: Spacing[5], overflow: 'hidden',
  },
  headerCircle: {
    position: 'absolute', width: 280, height: 280, borderRadius: 140,
    backgroundColor: 'rgba(96,165,250,0.15)', top: -80, right: -60,
  },
  backBtn: { marginBottom: 8 },
  headerTitle: { fontSize: Typography.fontSize.xl, fontWeight: '800', color: Colors.white, marginBottom: 4 },
  headerSub: { fontSize: Typography.fontSize.sm, color: 'rgba(255,255,255,0.7)', marginBottom: Spacing[4] },

  salaryCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.xl, padding: Spacing[4],
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  salaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  salaryLabel: { fontSize: Typography.fontSize.xs, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  salaryAmount: { fontSize: Typography.fontSize['4xl'], fontWeight: '800', color: Colors.white },
  salaryMeta: { flexDirection: 'row' },
  salaryMetaItem: { flex: 1, alignItems: 'center' },
  salaryMetaLabel: { fontSize: Typography.fontSize.xs, color: 'rgba(255,255,255,0.6)', marginBottom: 2 },
  salaryMetaValue: { fontSize: Typography.fontSize.sm, fontWeight: '700', color: Colors.white },
  salaryMetaDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },

  scroll: { flex: 1 },
  scrollContent: { padding: Spacing[4] },

  breakdownHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  breakdownCol: { fontSize: Typography.fontSize.xs, fontWeight: '700', color: Colors.gray500, textTransform: 'uppercase', letterSpacing: 0.5 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  breakdownLabel: { fontSize: Typography.fontSize.sm, color: Colors.gray700 },
  breakdownAmount: { fontSize: Typography.fontSize.sm, fontWeight: '700' },
  breakdownTotal: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginTop: 12, paddingTop: 12,
    borderTopWidth: 2, borderTopColor: Colors.primary + '30',
  },
  breakdownTotalLabel: { fontSize: Typography.fontSize.base, fontWeight: '700', color: Colors.gray900 },
  breakdownTotalAmount: { fontSize: Typography.fontSize.base, fontWeight: '800', color: Colors.primary },

  downloadBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.success, borderRadius: Radius.lg,
    paddingVertical: 14, gap: 10, marginBottom: Spacing[4],
  },
  downloadIcon: {},
  downloadText: { fontSize: Typography.fontSize.sm, fontWeight: '700', color: Colors.white },

  slipRow: { flexDirection: 'row', alignItems: 'center' },
  slipIcon: {
    width: 44, height: 44, borderRadius: Radius.md,
    backgroundColor: Colors.overlayLight,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  slipIconText: {},
  slipInfo: { flex: 1 },
  slipMonth: { fontSize: Typography.fontSize.base, fontWeight: '700', color: Colors.gray900 },
  slipDate: { fontSize: Typography.fontSize.xs, color: Colors.gray500, marginTop: 2 },
  slipRight: { alignItems: 'flex-end', gap: 4 },
  slipNet: { fontSize: Typography.fontSize.base, fontWeight: '700', color: Colors.gray900 },
});
