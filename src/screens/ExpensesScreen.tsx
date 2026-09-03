import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { inr } from '../lib/finance';
import { useSalaryWiseContext } from '../lib/SalaryWiseContext';
import type { ExpenseCategory } from '../lib/expenses';
import BackHeader from '../components/BackHeader';
import ScreenTransition from '../components/ScreenTransition';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

const CATEGORIES: { key: ExpenseCategory; icon: string }[] = [
  { key: 'Food', icon: '🍔' },
  { key: 'Transport', icon: '🚕' },
  { key: 'Shopping', icon: '🛍️' },
  { key: 'Bills', icon: '🧾' },
  { key: 'Other', icon: '🗂️' },
];

const CATEGORY_ICON: Record<ExpenseCategory, string> = Object.fromEntries(CATEGORIES.map((c) => [c.key, c.icon])) as Record<
  ExpenseCategory,
  string
>;

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  if (iso === todayISO()) return 'Today';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

const inputStyle = {
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 14,
  padding: 14,
  fontSize: 15,
  color: colors.ink,
  backgroundColor: colors.card,
};

export default function ExpensesScreen() {
  const navigation = useNavigation<any>();
  const { actions, expenses, monthlyExpenseTotal } = useSalaryWiseContext();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async () => {
    const parsed = parseFloat(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setError('Enter a valid amount.');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await actions.addExpense({ amount: parsed, category, note: note.trim(), date: todayISO() });
      setAmount('');
      setNote('');
    } catch {
      setError('Could not save this expense. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ flexGrow: 1 }}>
      <ScreenTransition style={{ padding: 24, paddingTop: 8, paddingBottom: 40 }}>
        <BackHeader title="Expenses" onBack={() => navigation.goBack()} />

        <View style={{ marginTop: 18, backgroundColor: colors.green, borderRadius: 20, padding: 20 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: colors.greenFaint, letterSpacing: 0.5 }}>THIS MONTH</Text>
          <Text style={{ fontFamily: fonts.serifSemiBold, fontSize: 34, color: colors.cream, marginTop: 4 }}>{inr(monthlyExpenseTotal)}</Text>
        </View>

        <View style={{ marginTop: 22, gap: 12 }}>
          <TextInput style={inputStyle} value={amount} onChangeText={setAmount} placeholder="Amount spent" keyboardType="decimal-pad" />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {CATEGORIES.map((c) => (
              <Pressable
                key={c.key}
                onPress={() => setCategory(c.key)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  paddingHorizontal: 13,
                  paddingVertical: 9,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: category === c.key ? colors.green : colors.border,
                  backgroundColor: category === c.key ? colors.green : colors.card,
                }}
              >
                <Text style={{ fontSize: 14 }}>{c.icon}</Text>
                <Text style={{ fontSize: 12.5, fontWeight: '700', color: category === c.key ? colors.cream : colors.label }}>{c.key}</Text>
              </Pressable>
            ))}
          </View>
          <TextInput style={inputStyle} value={note} onChangeText={setNote} placeholder="Note (optional)" />
        </View>

        {error && (
          <View style={{ backgroundColor: colors.amberPale, borderWidth: 1, borderColor: colors.amberBorder, borderRadius: 12, padding: 12, marginTop: 14 }}>
            <Text style={{ fontSize: 12, color: colors.amberText, lineHeight: 17 }}>{error}</Text>
          </View>
        )}

        <Pressable
          onPress={handleAdd}
          disabled={saving}
          style={{ width: '100%', marginTop: 14, backgroundColor: colors.green, borderRadius: 16, padding: 16, alignItems: 'center', opacity: saving ? 0.7 : 1 }}
        >
          {saving ? <ActivityIndicator color={colors.cream} /> : <Text style={{ color: colors.cream, fontSize: 15, fontWeight: '700' }}>Add expense</Text>}
        </Pressable>

        <Text style={{ marginTop: 30, marginBottom: 10, fontSize: 12, fontWeight: '700', color: colors.inkMuted, letterSpacing: 0.5 }}>RECENT</Text>
        {expenses.length === 0 && <Text style={{ fontSize: 13, color: colors.tanLight }}>No expenses logged yet.</Text>}
        <View style={{ gap: 10 }}>
          {expenses.map((e) => (
            <View
              key={e.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 14,
                padding: 13,
              }}
            >
              <Text style={{ fontSize: 18 }}>{CATEGORY_ICON[e.category] ?? '🗂️'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13.5, fontWeight: '700', color: colors.ink }}>{e.category}</Text>
                {!!e.note && <Text style={{ fontSize: 11.5, color: colors.tan, marginTop: 1 }}>{e.note}</Text>}
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: colors.ink }}>{inr(e.amount)}</Text>
                <Text style={{ fontSize: 11, color: colors.tanLight, marginTop: 1 }}>{formatDate(e.date)}</Text>
              </View>
              <Pressable onPress={() => actions.deleteExpense(e.id)} hitSlop={8}>
                <Text style={{ fontSize: 16, color: colors.tanLight }}>×</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScreenTransition>
    </ScrollView>
  );
}
