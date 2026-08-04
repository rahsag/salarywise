import { useNavigation } from '@react-navigation/native';
import { ScrollView, Text, View } from 'react-native';
import { emiCalc, inr, short } from '../lib/finance';
import { useSalaryWiseContext } from '../lib/SalaryWiseContext';
import BackHeader from '../components/BackHeader';
import ScreenTransition from '../components/ScreenTransition';
import SliderRow from '../components/SliderRow';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

export default function EmiScreen() {
  const navigation = useNavigation<any>();
  const { state, actions } = useSalaryWiseContext();
  const { emiP, emiR, emiN } = state;
  const e = emiCalc(emiP, emiR, emiN);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ flexGrow: 1 }}>
      <ScreenTransition style={{ padding: 24, paddingTop: 8, paddingBottom: 40 }}>
        <BackHeader title="EMI Calculator" onBack={() => navigation.goBack()} />

        <View style={{ backgroundColor: colors.green, borderRadius: 24, padding: 22, marginTop: 18, alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: colors.greenFaint, fontWeight: '600', letterSpacing: 1 }}>MONTHLY EMI</Text>
          <Text style={{ fontFamily: fonts.serifSemiBold, fontSize: 46, color: colors.cream, marginTop: 4 }}>{inr(e.m)}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,.14)' }}>
            <View>
              <Text style={{ fontSize: 11, color: colors.greenFaint }}>Principal</Text>
              <Text style={{ fontWeight: '700', marginTop: 2, color: colors.cream }}>{short(emiP)}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 11, color: colors.greenFaint }}>Interest</Text>
              <Text style={{ fontWeight: '700', marginTop: 2, color: colors.amber }}>{short(e.interest)}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 11, color: colors.greenFaint }}>Total</Text>
              <Text style={{ fontWeight: '700', marginTop: 2, color: colors.cream }}>{short(e.total)}</Text>
            </View>
          </View>
        </View>

        <View style={{ gap: 22, marginTop: 24 }}>
          <SliderRow label="Loan amount" display={short(emiP)} min={100000} max={20000000} step={50000} value={emiP} onChange={actions.setEmiP} />
          <SliderRow label="Interest rate" display={`${emiR}%`} min={6} max={18} step={0.1} value={emiR} onChange={actions.setEmiR} />
          <SliderRow label="Tenure" display={`${emiN} years`} min={1} max={30} step={1} value={emiN} onChange={actions.setEmiN} />
        </View>
      </ScreenTransition>
    </ScrollView>
  );
}
