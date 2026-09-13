import { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';
import { inr } from '../lib/finance';
import { useSalaryWiseContext } from '../lib/SalaryWiseContext';
import AmountInput from '../components/AmountInput';
import BackHeader from '../components/BackHeader';
import DonutChart, { type DonutSegment } from '../components/DonutChart';
import ScreenTransition from '../components/ScreenTransition';
import SliderRow from '../components/SliderRow';
import { colors } from '../theme/colors';

const ALLOC_BLUE = '#2a78d6';
const ALLOC_ORANGE = '#eb6834';
const ALLOC_AQUA = '#1baf7a';
const ALLOC_MAGENTA = '#e87ba4';

interface LegendRowProps {
  color: string;
  label: string;
  value: string;
}

function LegendRow({ color, label, value }: LegendRowProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 }}>
      <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: color }} />
      <Text style={{ fontSize: 12, color: colors.tan, flex: 1 }}>{label}</Text>
      <Text style={{ fontSize: 12, fontWeight: '700', color: colors.ink }}>{value}</Text>
    </View>
  );
}

interface AllocatedValues {
  rent: number;
  emi: number;
  expenses: number;
  sip: number;
  left: number;
}

export default function AllocateScreen() {
  const navigation = useNavigation<any>();
  const { state, actions } = useSalaryWiseContext();
  const { salary, rent, emi, expenses, sip } = state;

  // Salary-decrease self-heal: if lowering salary leaves rent+emi+expenses+sip
  // summing to more than the new salary, proportionally scale all four down
  // so the pie never exceeds 100%. Keyed only on salary (not the four fields)
  // since the headroom-based `max` below already keeps the sum in bounds
  // during normal slider drags — this effect only needs to react when salary
  // itself moves the ceiling down.
  useEffect(() => {
    const sum = rent + emi + expenses + sip;
    if (sum > salary && sum > 0) {
      const scale = salary / sum;
      actions.setRent(Math.floor((rent * scale) / 1000) * 1000);
      actions.setEmi(Math.floor((emi * scale) / 1000) * 1000);
      actions.setExpenses(Math.floor((expenses * scale) / 1000) * 1000);
      actions.setSip(Math.floor((sip * scale) / 1000) * 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salary]);

  const headroom = Math.max(0, salary - (rent + emi + expenses + sip));
  const rentMax = rent + headroom;
  const emiMax = emi + headroom;
  const expensesMax = expenses + headroom;
  const sipMax = sip + headroom;

  const left = salary - (rent + emi + expenses + sip);

  // Animate the donut by lerping the underlying data (not SVG props directly)
  // via a plain Animated.Value + listener — DonutChart itself is untouched.
  const real: AllocatedValues = { rent, emi, expenses, sip, left: Math.max(0, left) };
  const [displayed, setDisplayed] = useState<AllocatedValues>(real);
  const displayedRef = useRef<AllocatedValues>(real);
  const fromRef = useRef<AllocatedValues>(real);
  const targetRef = useRef<AllocatedValues>(real);
  const progress = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const next = real;
    const t = targetRef.current;
    if (next.rent === t.rent && next.emi === t.emi && next.expenses === t.expenses && next.sip === t.sip && next.left === t.left) {
      return;
    }

    fromRef.current = displayedRef.current;
    targetRef.current = next;
    progress.stopAnimation();
    progress.setValue(0);

    const id = progress.addListener(({ value: v }) => {
      const from = fromRef.current;
      const to = targetRef.current;
      const interp: AllocatedValues = {
        rent: from.rent + (to.rent - from.rent) * v,
        emi: from.emi + (to.emi - from.emi) * v,
        expenses: from.expenses + (to.expenses - from.expenses) * v,
        sip: from.sip + (to.sip - from.sip) * v,
        left: from.left + (to.left - from.left) * v,
      };
      displayedRef.current = interp;
      setDisplayed(interp);
    });

    Animated.timing(progress, { toValue: 1, duration: 260, useNativeDriver: false }).start(() => progress.removeListener(id));
    return () => progress.removeListener(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rent, emi, expenses, sip, left]);

  const segments: DonutSegment[] = [
    { label: 'Rent', value: displayed.rent, color: ALLOC_BLUE },
    { label: 'EMI', value: displayed.emi, color: ALLOC_ORANGE },
    { label: 'Living', value: displayed.expenses, color: ALLOC_AQUA },
    { label: 'SIP', value: displayed.sip, color: ALLOC_MAGENTA },
    { label: 'Left over', value: displayed.left, color: colors.tan },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ flexGrow: 1 }}>
      <ScreenTransition style={{ padding: 24, paddingTop: 8, paddingBottom: 40 }}>
        <BackHeader title="Allocate" onBack={() => navigation.goBack()} />
        <Text style={{ fontSize: 13, color: colors.inkMuted, marginTop: 8, lineHeight: 19 }}>
          Your take-home salary is the whole pie. Rent, EMIs, expenses and SIP are slices of it — they can never add up to
          more than 100%.
        </Text>

        <View style={{ marginTop: 18, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 18 }}>
          <AmountInput label="Take-home salary" display={inr(salary)} valueColor={colors.green} min={1000} value={salary} onChange={actions.setSalary} />
        </View>

        <View style={{ marginTop: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.borderCard, borderRadius: 20, padding: 18, alignItems: 'center' }}>
          <DonutChart segments={segments} size={168} strokeWidth={26} centerValue={inr(salary)} centerLabel="take-home" />
          <View style={{ width: '100%', marginTop: 16 }}>
            <LegendRow color={ALLOC_BLUE} label="Rent" value={inr(rent)} />
            <LegendRow color={ALLOC_ORANGE} label="EMI" value={inr(emi)} />
            <LegendRow color={ALLOC_AQUA} label="Living" value={inr(expenses)} />
            <LegendRow color={ALLOC_MAGENTA} label="SIP" value={inr(sip)} />
            <LegendRow color={colors.tan} label="Left over" value={inr(Math.max(0, left))} />
          </View>
        </View>

        <View style={{ marginTop: 18, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 18, gap: 22 }}>
          <SliderRow label="Rent / home EMI" display={inr(rent)} min={0} max={rentMax} step={1000} value={rent} onChange={actions.setRent} />
          <SliderRow label="Other loan EMIs" display={inr(emi)} min={0} max={emiMax} step={1000} value={emi} onChange={actions.setEmi} />
          <SliderRow label="Living expenses" display={inr(expenses)} min={0} max={expensesMax} step={1000} value={expenses} onChange={actions.setExpenses} />
          <SliderRow label="Monthly investing (SIP)" display={inr(sip)} min={0} max={sipMax} step={1000} value={sip} onChange={actions.setSip} />
        </View>

        <Pressable
          onPress={() => navigation.goBack()}
          style={{ width: '100%', marginTop: 22, backgroundColor: colors.green, borderRadius: 16, padding: 16, alignItems: 'center' }}
        >
          <Text style={{ color: colors.cream, fontSize: 15, fontWeight: '700' }}>Done</Text>
        </Pressable>
      </ScreenTransition>
    </ScrollView>
  );
}
