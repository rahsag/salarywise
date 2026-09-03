import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { inr } from '../lib/finance';
import { useSalaryWiseContext } from '../lib/SalaryWiseContext';
import BackHeader from '../components/BackHeader';
import ScreenTransition from '../components/ScreenTransition';
import SliderRow from '../components/SliderRow';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

export default function AccountScreen() {
  const navigation = useNavigation<any>();
  const { state, actions } = useSalaryWiseContext();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await actions.signOut();
      navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ flexGrow: 1 }}>
      <ScreenTransition style={{ padding: 24, paddingTop: 8, paddingBottom: 40 }}>
        <BackHeader title="Account" onBack={() => navigation.goBack()} />

        <View style={{ marginTop: 18, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 18 }}>
          <Text style={{ fontFamily: fonts.serifSemiBold, fontSize: 18, color: colors.ink }}>{state.name || 'Your account'}</Text>
          <Text style={{ fontSize: 13, color: colors.inkMuted, marginTop: 3 }}>{state.email}</Text>
        </View>

        <Text style={{ marginTop: 26, marginBottom: 4, fontSize: 12, fontWeight: '700', color: colors.inkMuted, letterSpacing: 0.5 }}>
          YOUR NUMBERS
        </Text>
        <View style={{ gap: 22, marginTop: 14 }}>
          <SliderRow label="Take-home salary" display={inr(state.salary)} valueColor={colors.green} min={20000} max={400000} step={1000} value={state.salary} onChange={actions.setSalary} />
          <SliderRow label="Rent / home EMI" display={inr(state.rent)} min={0} max={150000} step={1000} value={state.rent} onChange={actions.setRent} />
          <SliderRow label="Other loan EMIs" display={inr(state.emi)} min={0} max={100000} step={1000} value={state.emi} onChange={actions.setEmi} />
          <SliderRow label="Living expenses" display={inr(state.expenses)} min={0} max={150000} step={1000} value={state.expenses} onChange={actions.setExpenses} />
          <SliderRow label="Monthly investing (SIP)" display={inr(state.sip)} min={0} max={150000} step={1000} value={state.sip} onChange={actions.setSip} />
        </View>

        <Pressable
          onPress={handleSignOut}
          disabled={signingOut}
          style={{ width: '100%', marginTop: 34, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 16, alignItems: 'center', opacity: signingOut ? 0.7 : 1 }}
        >
          {signingOut ? <ActivityIndicator color={colors.redOrange} /> : <Text style={{ color: colors.redOrange, fontSize: 15, fontWeight: '700' }}>Sign out</Text>}
        </Pressable>
      </ScreenTransition>
    </ScrollView>
  );
}
