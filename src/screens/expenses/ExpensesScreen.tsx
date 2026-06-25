import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadow, IconBox } from '../../design-system/tokens';
import { Card, SectionHeader } from '../../design-system/components/Card';
import { Badge, statusToVariant } from '../../design-system/components/Badge';
import { mockExpenses } from '../../data/mockData';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const EXPENSE_CATEGORIES: { label: string; iconName: IoniconName; color: string }[] = [
  { label: 'Meals',    iconName: 'restaurant-outline',               color: Colors.warning },
  { label: 'Travel',  iconName: 'airplane-outline',                  color: Colors.accent },
  { label: 'Software',iconName: 'laptop-outline',                    color: Colors.primary },
  { label: 'Office',  iconName: 'briefcase-outline',                 color: Colors.success },
  { label: 'Medical', iconName: 'medkit-outline',                    color: Colors.danger },
  { label: 'Other',   iconName: 'ellipsis-horizontal-circle-outline',color: Colors.gray600 },
];

export default function ExpensesScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const totalPending  = mockExpenses.filter(e => e.status === 'pending').reduce((a, e) => a + e.amount, 0);
  const totalApproved = mockExpenses.filter(e => e.status === 'approved').reduce((a, e) => a + e.amount, 0);

  const filteredExpenses = selectedCategory
    ? mockExpenses.filter(e => e.category === selectedCategory)
    : mockExpenses;

  const handleSubmitExpense = () =>
    Alert.alert('Submit Expense', 'Expense submission form coming soon!', [{ text: 'OK' }]);

  const handleExpensePress = (expense: typeof mockExpenses[0]) =>
    Alert.alert(
      expense.title,
      `Category: ${expense.category}\nAmount: ₹${expense.amount.toLocaleString()}\nDate: ${expense.date}\nStatus: ${expense.status.toUpperCase()}\n\n${expense.description}`,
      [{ text: 'Close' }]
    );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <View style={styles.header}>
        <View style={styles.headerCircle} />
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Expense Management</Text>
        <Text style={styles.headerSub}>Track and submit expense claims</Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Ionicons name="time-outline" size={20} color={Colors.warningDark} style={styles.summaryIcon} />
            <Text style={styles.summaryValue}>₹{totalPending.toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>Pending</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: Colors.successLight }]}>
            <Ionicons name="checkmark-circle-outline" size={20} color={Colors.successDark} style={styles.summaryIcon} />
            <Text style={[styles.summaryValue, { color: Colors.successDark }]}>₹{totalApproved.toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>Approved</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: Colors.dangerLight }]}>
            <Ionicons name="wallet-outline" size={20} color={Colors.dangerDark} style={styles.summaryIcon} />
            <Text style={[styles.summaryValue, { color: Colors.dangerDark }]}>
              ₹{mockExpenses.reduce((a, e) => a + e.amount, 0).toLocaleString()}
            </Text>
            <Text style={styles.summaryLabel}>Total Claims</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.submitCTA} activeOpacity={0.85} onPress={handleSubmitExpense}>
          <View style={styles.submitLeft}>
            <View style={styles.submitIconBox}>
              <Ionicons name="add-circle-outline" size={32} color={Colors.white} />
            </View>
            <View>
              <Text style={styles.submitTitle}>Submit New Expense</Text>
              <Text style={styles.submitSub}>Upload receipt & get reimbursed</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.white} />
        </TouchableOpacity>

        <SectionHeader title="Quick Category" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesRow}>
          {EXPENSE_CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.label;
            return (
              <TouchableOpacity
                key={cat.label}
                style={styles.categoryItem}
                activeOpacity={0.8}
                onPress={() => setSelectedCategory(isSelected ? null : cat.label)}
              >
                <View style={styles.categoryIcon}>
                  <Ionicons name={cat.iconName} size={24} color={isSelected ? cat.color : cat.color} />
                </View>
                <Text style={[styles.categoryLabel, isSelected && { color: cat.color, fontWeight: '700' }]}>{cat.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <SectionHeader
          title={selectedCategory ? `${selectedCategory} Expenses` : 'Expense History'}
          actionLabel={selectedCategory ? 'Clear Filter' : 'View All'}
          onAction={() => selectedCategory ? setSelectedCategory(null) : Alert.alert('Expense History', `Showing all ${mockExpenses.length} expenses`, [{ text: 'OK' }])}
        />
        {filteredExpenses.map(expense => {
          const cat = EXPENSE_CATEGORIES.find(c => c.label === expense.category);
          return (
            <Card key={expense.id} onPress={() => handleExpensePress(expense)}>
              <View style={styles.expenseHeader}>
                <View style={styles.expenseIconBox}>
                  <Ionicons name={cat?.iconName ?? 'receipt-outline'} size={22} color={cat?.color ?? Colors.gray500} />
                </View>
                <View style={styles.expenseInfo}>
                  <Text style={styles.expenseTitle}>{expense.title}</Text>
                  <Text style={styles.expenseDesc} numberOfLines={1}>{expense.description}</Text>
                  <Text style={styles.expenseDate}>{expense.date}</Text>
                </View>
                <View style={styles.expenseRight}>
                  <Text style={styles.expenseAmount}>₹{expense.amount.toLocaleString()}</Text>
                  <Badge label={expense.status} variant={statusToVariant[expense.status] || 'neutral'} />
                </View>
              </View>
              {expense.receipt && (
                <View style={styles.receiptRow}>
                  <Ionicons name="receipt-outline" size={13} color={Colors.gray500} />
                  <Text style={styles.receiptText}> Receipt attached</Text>
                </View>
              )}
            </Card>
          );
        })}

        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity style={styles.fab} activeOpacity={0.85} onPress={handleSubmitExpense}>
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 56,
    paddingHorizontal: Spacing[4], paddingBottom: Spacing[5], overflow: 'hidden',
  },
  headerCircle: { position: 'absolute', width: 280, height: 280, borderRadius: 140, backgroundColor: 'rgba(96,165,250,0.15)', top: -80, right: -60 },
  backBtn: { marginBottom: 8 },
  headerTitle: { fontSize: Typography.fontSize.xl, fontWeight: '800', color: Colors.white, marginBottom: 4 },
  headerSub: { fontSize: Typography.fontSize.sm, color: 'rgba(255,255,255,0.7)', marginBottom: Spacing[4] },
  summaryRow: { flexDirection: 'row', gap: 8 },
  summaryCard: { flex: 1, backgroundColor: Colors.warningLight, borderRadius: Radius.md, padding: Spacing[3], alignItems: 'center' },
  summaryIcon: { marginBottom: 4 },
  summaryValue: { fontSize: Typography.fontSize.base, fontWeight: '800', color: Colors.warningDark },
  summaryLabel: { fontSize: Typography.fontSize.xs, color: Colors.gray600, marginTop: 2 },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing[4] },
  submitCTA: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.primary, borderRadius: Radius.lg, padding: Spacing[4], marginBottom: Spacing[4], ...Shadow.md },
  submitLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  submitIconBox: { width: 48, height: 48, borderRadius: Radius.md, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  submitTitle: { fontSize: Typography.fontSize.base, fontWeight: '700', color: Colors.white },
  submitSub: { fontSize: Typography.fontSize.xs, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  categoriesRow: { marginBottom: Spacing[4] },
  categoryItem: { alignItems: 'center', marginRight: 16 },
  categoryIcon: { width: IconBox.size, height: IconBox.size, borderRadius: IconBox.radius, backgroundColor: IconBox.bg, alignItems: 'center', justifyContent: 'center', marginBottom: 6, ...IconBox.shadow as any },
  categoryLabel: { fontSize: Typography.fontSize.xs, color: Colors.gray600, fontWeight: '600' },
  expenseHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  expenseIconBox: { width: IconBox.size, height: IconBox.size, borderRadius: IconBox.radius, backgroundColor: IconBox.bg, alignItems: 'center', justifyContent: 'center', marginRight: 12, ...IconBox.shadow as any },
  expenseInfo: { flex: 1 },
  expenseTitle: { fontSize: Typography.fontSize.base, fontWeight: '700', color: Colors.gray900 },
  expenseDesc: { fontSize: Typography.fontSize.xs, color: Colors.gray500, marginTop: 2 },
  expenseDate: { fontSize: Typography.fontSize.xs, color: Colors.gray400, marginTop: 2 },
  expenseRight: { alignItems: 'flex-end', gap: 6 },
  expenseAmount: { fontSize: Typography.fontSize.base, fontWeight: '800', color: Colors.gray900 },
  receiptRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: Colors.gray100 },
  receiptText: { fontSize: Typography.fontSize.xs, color: Colors.gray500 },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', ...Shadow.lg },
});
