import { useNavigation } from '@react-navigation/native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { computeScore, inr, scoreBand } from '../lib/finance';
import { useSalaryWiseContext } from '../lib/SalaryWiseContext';
import ScreenTransition from '../components/ScreenTransition';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

interface ToolButtonProps {
  icon: string;
  bg: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}

function ToolButton({ icon, bg, title, subtitle, onPress }: ToolButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: '48%',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: colors.borderCard,
        borderRadius: 18,
        padding: 14,
        flexDirection: 'row',
        gap: 11,
        alignItems: 'center',
      }}
    >
      <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 18 }}>{icon}</Text>
      </View>
      <View>
        <Text style={{ fontSize: 13, fontWeight: '700', color: colors.ink }}>{title}</Text>
        <Text style={{ fontSize: 10.5, color: colors.tan }}>{subtitle}</Text>
      </View>
    </Pressable>
  );
}

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const { state, monthlyExpenseTotal } = useSalaryWiseContext();
  const { proUnlocked } = state;
  const { name, salary, rent, emi, sip } = state;
  const expenses = monthlyExpenseTotal > 0 ? monthlyExpenseTotal : state.expenses;

  const sc = computeScore(salary, rent, emi, expenses, sip);
  const band = scoreBand(sc.total);
  const greetName = name ? name.split(' ')[0] : 'Rahul';
  const initial = (name || 'R').trim().charAt(0).toUpperCase();
  const dashScoreMsg = sc.total >= 65 ? '3 quick wins could push you past 80' : 'Small changes can move this fast';

  const todayLabel = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });

  const spent = rent + emi + expenses;
  const left = salary - spent - sip;
  const spentPct = Math.round((spent / Math.max(salary, 1)) * 100);
  const pw = (v: number) => `${((v / Math.max(salary, 1)) * 100).toFixed(1)}%` as `${number}%`;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ flexGrow: 1 }}>
      <ScreenTransition style={{ padding: 20, paddingTop: 8, paddingBottom: 26 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4 }}>
          <View>
            <Text style={{ fontSize: 13, color: colors.tan, fontWeight: '600' }}>{todayLabel}</Text>
            <Text style={{ fontFamily: fonts.serifSemiBold, fontSize: 26, color: colors.ink, letterSpacing: -0.3 }}>{greetName}</Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate('Account')}
            style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#e5dcc7', alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: colors.greenLight, fontWeight: '700', fontFamily: fonts.serifSemiBold, fontSize: 18 }}>{initial}</Text>
          </Pressable>
        </View>

        <View style={{ marginTop: 16, backgroundColor: colors.green, borderRadius: 26, padding: 22, overflow: 'hidden' }}>
          <View style={{ position: 'absolute', right: -40, top: -40, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,.05)' }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View>
              <Text style={{ fontSize: 12, fontWeight: '600', color: colors.greenFaint, letterSpacing: 0.5 }}>FINANCIAL HEALTH</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                <Text style={{ fontFamily: fonts.serifSemiBold, fontSize: 52, color: colors.cream, lineHeight: 47 }}>{sc.total}</Text>
                <Text style={{ fontSize: 15, color: colors.greenFaint, fontWeight: '600' }}>/100</Text>
              </View>
            </View>
            <View style={{ backgroundColor: colors.amber, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
              <Text style={{ color: colors.ink, fontSize: 12, fontWeight: '800' }}>{band}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 13, color: colors.greenMuted, marginTop: 8 }}>{dashScoreMsg}</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 14 }}>
          <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.borderCard }}>
            <Text style={{ fontSize: 11, color: colors.tan, fontWeight: '600' }}>Earned</Text>
            <Text style={{ fontFamily: fonts.serifSemiBold, fontSize: 22, color: colors.ink, marginTop: 2 }}>{inr(salary)}</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.borderCard }}>
            <Text style={{ fontSize: 11, color: colors.tan, fontWeight: '600' }}>Left to spend</Text>
            <Text style={{ fontFamily: fonts.serifSemiBold, fontSize: 22, color: colors.greenLight, marginTop: 2 }}>{inr(Math.max(0, left))}</Text>
          </View>
        </View>

        <View style={{ marginTop: 14, backgroundColor: '#fff', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: colors.borderCard }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 12, color: colors.tan, fontWeight: '600' }}>Spent {spentPct}% of income</Text>
            <Text style={{ fontSize: 12, color: colors.tan, fontWeight: '600' }}>{inr(spent)}</Text>
          </View>
          <View style={{ height: 9, borderRadius: 6, backgroundColor: '#efe8da', marginTop: 9, overflow: 'hidden', flexDirection: 'row' }}>
            <View style={{ width: pw(rent), backgroundColor: colors.greenLight, height: '100%' }} />
            <View style={{ width: pw(emi), backgroundColor: colors.amber, height: '100%' }} />
            <View style={{ width: pw(expenses), backgroundColor: colors.brown, height: '100%' }} />
          </View>
          <View style={{ flexDirection: 'row', gap: 14, marginTop: 10 }}>
            <Text style={{ fontSize: 11, color: colors.label }}>
              ● Home <Text style={{ fontWeight: '700' }}>{inr(rent)}</Text>
            </Text>
            <Text style={{ fontSize: 11, color: colors.amber }}>● EMI</Text>
            <Text style={{ fontSize: 11, color: colors.brown }}>● Living</Text>
          </View>
        </View>

        <Text style={{ marginHorizontal: 4, marginTop: 22, marginBottom: 12, fontFamily: fonts.serifSemiBold, fontSize: 18, color: colors.ink }}>Your toolkit</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 11, justifyContent: 'space-between' }}>
          <ToolButton icon="📊" bg={colors.greenPale} title="Budget" subtitle="50/30/20" onPress={() => navigation.navigate('Budget')} />
          <ToolButton icon="🏦" bg={colors.peach} title="EMI" subtitle="Loan calc" onPress={() => navigation.navigate('Emi')} />
          <ToolButton icon="📈" bg={colors.purplePale} title="SIP" subtitle="Grow wealth" onPress={() => navigation.navigate('Sip')} />
          <ToolButton icon="🏠" bg={colors.bluePale} title="Home" subtitle="Affordability" onPress={() => navigation.navigate('Afford')} />
          <ToolButton icon="🧺" bg={colors.amberPale} title="Expenses" subtitle="Log a spend" onPress={() => navigation.navigate('Expenses')} />
        </View>

        <Pressable
          onPress={() => navigation.navigate(proUnlocked ? 'Tax' : 'Upgrade')}
          style={{ width: '100%', marginTop: 11, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.borderCard, borderRadius: 18, padding: 16, flexDirection: 'row', gap: 12, alignItems: 'center' }}
        >
          <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: colors.rose, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 19 }}>🧾</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: colors.ink }}>Tax Planner & Salary Optimizer</Text>
            <Text style={{ fontSize: 11, color: colors.tan }}>New vs old regime · ranked savings</Text>
          </View>
          {!proUnlocked && (
            <View style={{ backgroundColor: colors.amberPale, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20 }}>
              <Text style={{ fontSize: 12, fontWeight: '800', color: colors.amber }}>PRO</Text>
            </View>
          )}
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate(proUnlocked ? 'Coach' : 'Upgrade')}
          style={{ width: '100%', marginTop: 14, backgroundColor: colors.amber, borderRadius: 20, padding: 18, flexDirection: 'row', gap: 13, alignItems: 'center' }}
        >
          <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 19, color: colors.amber }}>✦</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.ink, fontWeight: '800', fontSize: 14 }}>Chat with your Money Coach</Text>
            <Text style={{ color: '#6b4d1e', fontSize: 11.5, marginTop: 1 }}>Ask anything about your money</Text>
          </View>
          {!proUnlocked && (
            <View style={{ backgroundColor: colors.ink, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20 }}>
              <Text style={{ fontSize: 12, fontWeight: '800', color: colors.amber }}>PRO</Text>
            </View>
          )}
          <Text style={{ color: colors.ink, fontSize: 18 }}>→</Text>
        </Pressable>
      </ScreenTransition>
    </ScrollView>
  );
}
