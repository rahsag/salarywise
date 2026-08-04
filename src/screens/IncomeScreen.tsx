import { useNavigation } from '@react-navigation/native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { inr } from '../lib/finance';
import { useSalaryWiseContext } from '../lib/SalaryWiseContext';
import ScreenTransition from '../components/ScreenTransition';
import SliderRow from '../components/SliderRow';
import StepDots from '../components/StepDots';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

export default function IncomeScreen() {
  const navigation = useNavigation<any>();
  const { state, actions } = useSalaryWiseContext();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ flexGrow: 1 }}>
      <ScreenTransition style={{ padding: 26, paddingTop: 14, paddingBottom: 40 }}>
        <StepDots active={1} />
        <Text style={{ fontFamily: fonts.serifSemiBold, fontSize: 28, color: colors.ink, marginTop: 18 }}>Your monthly money</Text>
        <Text style={{ fontSize: 14, color: colors.inkMuted, marginTop: 6 }}>Rough numbers are fine — you can edit later.</Text>

        <View style={{ marginTop: 22, gap: 20 }}>
          <SliderRow label="Take-home salary" display={inr(state.salary)} valueColor={colors.green} min={20000} max={400000} step={1000} value={state.salary} onChange={actions.setSalary} />
          <SliderRow label="Rent / home EMI" display={inr(state.rent)} min={0} max={150000} step={1000} value={state.rent} onChange={actions.setRent} />
          <SliderRow label="Other loan EMIs" display={inr(state.emi)} min={0} max={100000} step={1000} value={state.emi} onChange={actions.setEmi} />
          <SliderRow label="Living expenses" display={inr(state.expenses)} min={0} max={150000} step={1000} value={state.expenses} onChange={actions.setExpenses} />
          <SliderRow label="Monthly investing (SIP)" display={inr(state.sip)} min={0} max={150000} step={1000} value={state.sip} onChange={actions.setSip} />
        </View>

        <Pressable
          onPress={() => navigation.navigate('Score')}
          style={{ width: '100%', marginTop: 32, backgroundColor: colors.amber, borderRadius: 16, padding: 16, alignItems: 'center' }}
        >
          <Text style={{ color: colors.ink, fontSize: 15, fontWeight: '800' }}>Reveal my Financial Health Score ✦</Text>
        </Pressable>
      </ScreenTransition>
    </ScrollView>
  );
}
