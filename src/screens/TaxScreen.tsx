import { useNavigation } from '@react-navigation/native';
import { ScrollView, Text, View } from 'react-native';
import { inr, short, taxCalc } from '../lib/finance';
import { useSalaryWiseContext } from '../lib/SalaryWiseContext';
import BackHeader from '../components/BackHeader';
import ScreenTransition from '../components/ScreenTransition';
import SliderRow from '../components/SliderRow';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

interface Rec {
  t: string;
  d: string;
  v: string;
}

function RecRow({ rec, index }: { rec: Rec; index: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 11, alignItems: 'center' }}>
      <View style={{ width: 22, height: 22, borderRadius: 7, backgroundColor: colors.greenPale, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.green, fontSize: 12, fontWeight: '800' }}>{index + 1}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: colors.ink }}>{rec.t}</Text>
        <Text style={{ fontSize: 11, color: colors.tan }}>{rec.d}</Text>
      </View>
      <Text style={{ fontSize: 13, fontWeight: '800', color: colors.greenLight }}>{rec.v}</Text>
    </View>
  );
}

export default function TaxScreen() {
  const navigation = useNavigation<any>();
  const { state, actions } = useSalaryWiseContext();
  const { taxIncome, tax80c, taxHra } = state;

  const taxNew = taxCalc(taxIncome, 'new', 0, 0);
  const taxOld = taxCalc(taxIncome, 'old', tax80c, taxHra);
  const best = taxNew <= taxOld ? 'New' : 'Old';
  const taxSaving = Math.abs(taxNew - taxOld);

  const recs: Rec[] = [
    best === 'New'
      ? { t: 'Switch to the New regime', d: 'Lower tax at your income & deductions', v: short(taxSaving) }
      : { t: 'Stay on the Old regime', d: 'Your deductions make it cheaper', v: short(taxSaving) },
    {
      t: 'Max out 80C to ₹1.5L',
      d: tax80c < 150000 ? 'ELSS / PPF / EPF — Old regime only' : 'Already maxed ✓',
      v: tax80c < 150000 ? short((150000 - tax80c) * 0.3) : '—',
    },
    { t: 'Claim HRA exemption', d: 'If you pay rent & get HRA in CTC', v: short(taxHra * 0.2) },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ flexGrow: 1 }}>
      <ScreenTransition style={{ padding: 24, paddingTop: 8, paddingBottom: 40 }}>
        <BackHeader title="Tax & Salary Optimizer" onBack={() => navigation.goBack()} />

        <View style={{ backgroundColor: colors.amber, borderRadius: 22, padding: 20, marginTop: 18, alignItems: 'center' }}>
          <Text style={{ fontSize: 12, fontWeight: '700', letterSpacing: 0.5, color: colors.ink }}>RECOMMENDED FOR YOU</Text>
          <Text style={{ fontFamily: fonts.serifSemiBold, fontSize: 30, color: colors.ink, marginTop: 6 }}>{best} regime</Text>
          <Text style={{ fontSize: 13.5, marginTop: 6, fontWeight: '600', color: colors.ink }}>
            Saves you <Text style={{ fontWeight: '800' }}>{inr(taxSaving)}</Text> a year vs the other
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
          <View style={{ flex: 1, backgroundColor: '#fff', borderWidth: 2, borderColor: best === 'New' ? colors.greenLight : colors.borderCard, borderRadius: 18, padding: 16 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: colors.inkMuted }}>NEW REGIME</Text>
            <Text style={{ fontFamily: fonts.serifSemiBold, fontSize: 24, color: colors.ink, marginTop: 4 }}>{inr(taxNew)}</Text>
            <Text style={{ fontSize: 11, color: colors.tan, marginTop: 2 }}>tax / year</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: '#fff', borderWidth: 2, borderColor: best === 'Old' ? colors.greenLight : colors.borderCard, borderRadius: 18, padding: 16 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: colors.inkMuted }}>OLD REGIME</Text>
            <Text style={{ fontFamily: fonts.serifSemiBold, fontSize: 24, color: colors.ink, marginTop: 4 }}>{inr(taxOld)}</Text>
            <Text style={{ fontSize: 11, color: colors.tan, marginTop: 2 }}>with deductions</Text>
          </View>
        </View>

        <View style={{ gap: 22, marginTop: 24 }}>
          <SliderRow label="Annual gross income" display={short(taxIncome)} min={300000} max={5000000} step={50000} value={taxIncome} onChange={actions.setTaxIncome} />
          <SliderRow label="80C investments" display={short(tax80c)} min={0} max={150000} step={5000} value={tax80c} onChange={actions.setTax80c} />
          <SliderRow label="HRA + other exemptions" display={short(taxHra)} min={0} max={500000} step={10000} value={taxHra} onChange={actions.setTaxHra} />
        </View>

        <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: colors.borderCard, borderRadius: 18, padding: 18, marginTop: 18 }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: colors.inkMuted }}>RANKED RECOMMENDATIONS</Text>
          <View style={{ marginTop: 10, gap: 10 }}>
            {recs.map((r, i) => (
              <RecRow key={i} rec={r} index={i} />
            ))}
          </View>
        </View>

        <Text style={{ fontSize: 11.5, color: colors.tanLight, marginTop: 14, lineHeight: 17 }}>⚠ Slabs simplified & indicative — verify against current law before filing.</Text>
      </ScreenTransition>
    </ScrollView>
  );
}
