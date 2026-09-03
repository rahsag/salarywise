import { useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { computeScore, scoreBand } from '../lib/finance';
import { useSalaryWiseContext } from '../lib/SalaryWiseContext';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

const RING_CIRCUMFERENCE = 590.6;

function ScoreBar({ label, points, widthPct }: { label: string; points: string; widthPct: number }) {
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ color: colors.greenMuted, fontSize: 13 }}>{label}</Text>
        <Text style={{ color: colors.cream, fontSize: 13, fontWeight: '700' }}>{points}</Text>
      </View>
      <View style={{ height: 7, borderRadius: 5, backgroundColor: 'rgba(255,255,255,.14)', marginTop: 7, overflow: 'hidden' }}>
        <View style={{ height: '100%', width: `${widthPct}%`, backgroundColor: '#8fb47f' }} />
      </View>
    </View>
  );
}

export default function ScoreScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { state, actions, monthlyExpenseTotal } = useSalaryWiseContext();
  const { name, salary, rent, emi, sip, animScore } = state;
  const expenses = monthlyExpenseTotal > 0 ? monthlyExpenseTotal : state.expenses;

  useFocusEffect(
    useCallback(() => {
      actions.startScore();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  const sc = computeScore(salary, rent, emi, expenses, sip);
  const band = scoreBand(sc.total);
  const scoreDash = RING_CIRCUMFERENCE * (1 - animScore / 100);
  const scoreMsg = sc.total >= 65 ? `Solid footing, ${name || 'Rahul'}. A few nudges take you higher.` : `A real starting point — here's where the easy wins are.`;

  const enterMain = () => navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Main' }] });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.green }} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ padding: 26, paddingTop: 20 + insets.top, paddingBottom: 40 }}>
        <Text style={{ textAlign: 'center', fontSize: 12, fontWeight: '600', letterSpacing: 2, color: colors.greenFaint }}>YOUR FINANCIAL HEALTH SCORE</Text>
        <View style={{ alignItems: 'center', marginTop: 22 }}>
          <Svg width={220} height={220} viewBox="0 0 220 220">
            <Circle cx={110} cy={110} r={94} fill="none" stroke="rgba(255,255,255,.14)" strokeWidth={15} />
            <Circle
              cx={110}
              cy={110}
              r={94}
              fill="none"
              stroke={colors.amber}
              strokeWidth={15}
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={scoreDash}
              rotation={-90}
              origin="110, 110"
            />
          </Svg>
          <View style={{ position: 'absolute', top: '50%', alignItems: 'center', transform: [{ translateY: -56 }] }}>
            <Text style={{ fontFamily: fonts.serifSemiBold, fontSize: 76, color: colors.cream, lineHeight: 80 }}>{animScore}</Text>
            <Text style={{ fontSize: 14, color: colors.amber, fontWeight: '700', marginTop: 4 }}>{band}</Text>
          </View>
        </View>
        <Text style={{ textAlign: 'center', fontSize: 14, color: colors.greenMuted, marginTop: 14, lineHeight: 21, paddingHorizontal: 6 }}>{scoreMsg}</Text>
        <View style={{ backgroundColor: 'rgba(255,255,255,.07)', borderRadius: 20, padding: 18, marginTop: 24, gap: 16 }}>
          <ScoreBar label="Savings rate" points={`${sc.savePts}/40`} widthPct={(sc.savePts / 40) * 100} />
          <ScoreBar label="Debt burden" points={`${sc.debtPts}/30`} widthPct={(sc.debtPts / 30) * 100} />
          <ScoreBar label="Investing habit" points={`${sc.investPts}/30`} widthPct={(sc.investPts / 30) * 100} />
        </View>
        <Pressable onPress={enterMain} style={{ width: '100%', marginTop: 26, backgroundColor: colors.amber, borderRadius: 16, padding: 16, alignItems: 'center' }}>
          <Text style={{ color: colors.ink, fontSize: 15, fontWeight: '800' }}>Enter SalaryWise →</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
