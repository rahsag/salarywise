import { useNavigation } from '@react-navigation/native';
import { ScrollView, Text, View } from 'react-native';
import { inr, short, sipCalc } from '../lib/finance';
import { useSalaryWiseContext } from '../lib/SalaryWiseContext';
import BackHeader from '../components/BackHeader';
import ScreenTransition from '../components/ScreenTransition';
import SliderRow from '../components/SliderRow';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

export default function SipScreen() {
  const navigation = useNavigation<any>();
  const { state, actions } = useSalaryWiseContext();
  const { sipAmt, sipR, sipY } = state;
  const s = sipCalc(sipAmt, sipR, sipY);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ flexGrow: 1 }}>
      <ScreenTransition style={{ padding: 24, paddingTop: 8, paddingBottom: 40 }}>
        <BackHeader title="SIP Calculator" onBack={() => navigation.goBack()} />

        <View style={{ backgroundColor: colors.green, borderRadius: 24, padding: 22, marginTop: 18, alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: colors.greenFaint, fontWeight: '600', letterSpacing: 1 }}>PROJECTED VALUE IN {sipY} YEARS</Text>
          <Text style={{ fontFamily: fonts.serifSemiBold, fontSize: 44, color: colors.cream, marginTop: 4 }}>{short(s.fv)}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,.14)' }}>
            <View>
              <Text style={{ fontSize: 11, color: colors.greenFaint }}>Invested</Text>
              <Text style={{ fontWeight: '700', marginTop: 2, color: colors.cream }}>{short(s.invested)}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 11, color: colors.greenFaint }}>Est. gain</Text>
              <Text style={{ fontWeight: '700', marginTop: 2, color: '#8fe3c8' }}>{short(s.gain)}</Text>
            </View>
          </View>
        </View>

        <View style={{ gap: 22, marginTop: 24 }}>
          <SliderRow label="Monthly investment" display={inr(sipAmt)} min={500} max={200000} step={500} value={sipAmt} onChange={actions.setSipAmt} />
          <SliderRow label="Expected return" display={`${sipR}% p.a.`} min={4} max={20} step={0.5} value={sipR} onChange={actions.setSipR} />
          <SliderRow label="Time period" display={`${sipY} years`} min={1} max={40} step={1} value={sipY} onChange={actions.setSipY} />
        </View>
      </ScreenTransition>
    </ScrollView>
  );
}
