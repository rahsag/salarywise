import { useNavigation } from '@react-navigation/native';
import { ScrollView, Text, View } from 'react-native';
import { inr } from '../lib/finance';
import { useSalaryWiseContext } from '../lib/SalaryWiseContext';
import BackHeader from '../components/BackHeader';
import ScreenTransition from '../components/ScreenTransition';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

function BudgetCard({ label, amount, note, bg, fg, sub }: { label: string; amount: string; note: string; bg: string; fg: string; sub: string }) {
  return (
    <View style={{ backgroundColor: bg, borderRadius: 20, padding: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Text style={{ fontWeight: '800', color: fg, fontSize: 15 }}>{label}</Text>
        <Text style={{ fontFamily: fonts.serifSemiBold, fontSize: 22, color: fg }}>{amount}</Text>
      </View>
      <Text style={{ fontSize: 12, color: sub, marginTop: 4 }}>{note}</Text>
    </View>
  );
}

export default function BudgetScreen() {
  const navigation = useNavigation<any>();
  const { state } = useSalaryWiseContext();
  const { salary, rent, emi, expenses } = state;

  const needs = salary * 0.5;
  const wants = salary * 0.3;
  const saveTarget = salary * 0.2;
  const spent = rent + emi + expenses;
  const actualSave = (salary - spent) / Math.max(salary, 1);
  const asr = Math.round(actualSave * 100);
  const verdictColor = actualSave >= 0.2 ? colors.greenLight : actualSave >= 0.1 ? colors.amberWarn : colors.redOrange;
  const verdict =
    actualSave >= 0.2
      ? "You're beating the 20% savings target — great discipline. Consider bumping your SIP."
      : actualSave >= 0.1
        ? "You're saving, but below the 20% target. Trim 'wants' by a little to catch up."
        : 'Essentials are eating most of your income. Revisit rent or big EMIs before adding goals.';

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ flexGrow: 1 }}>
      <ScreenTransition style={{ padding: 24, paddingTop: 8, paddingBottom: 40 }}>
        <BackHeader title="Budget Planner" onBack={() => navigation.goBack()} />
        <Text style={{ fontSize: 13, color: colors.inkMuted, marginTop: 8, lineHeight: 19 }}>The 50/30/20 rule on your {inr(salary)} take-home.</Text>

        <View style={{ gap: 12, marginTop: 22 }}>
          <BudgetCard label="Needs · 50%" amount={inr(needs)} note="Rent, EMIs, groceries, bills, transport" bg={colors.greenPale} fg={colors.green} sub={colors.greenLight} />
          <BudgetCard label="Wants · 30%" amount={inr(wants)} note="Dining, shopping, travel, subscriptions" bg={colors.peach} fg={colors.brownText} sub={colors.brownMuted} />
          <BudgetCard label="Savings · 20%" amount={inr(saveTarget)} note="SIP, emergency fund, goals" bg={colors.bluePale} fg={colors.blue} sub={colors.blueMuted} />
        </View>

        <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: colors.borderCard, borderRadius: 18, padding: 18, marginTop: 16 }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: colors.inkMuted }}>HOW YOU'RE ACTUALLY DOING</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <Text style={{ fontSize: 13.5, color: colors.ink }}>Actual saving rate</Text>
            <Text style={{ color: verdictColor, fontWeight: '700' }}>{asr}%</Text>
          </View>
          <Text style={{ fontSize: 12.5, color: colors.inkMuted, marginTop: 8, lineHeight: 18 }}>{verdict}</Text>
        </View>
      </ScreenTransition>
    </ScrollView>
  );
}
