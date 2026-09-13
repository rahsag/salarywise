import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { inr } from '../lib/finance';
import { useSalaryWiseContext } from '../lib/SalaryWiseContext';
import BackHeader from '../components/BackHeader';
import ScreenTransition from '../components/ScreenTransition';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

interface StaticRowProps {
  label: string;
  value: string;
}

function StaticRow({ label, value }: StaticRowProps) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 }}>
      <Text style={{ fontSize: 13, fontWeight: '600', color: colors.label }}>{label}</Text>
      <Text style={{ fontWeight: '700', color: colors.ink, fontSize: 15 }}>{value}</Text>
    </View>
  );
}

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
        <View style={{ marginTop: 14, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 18 }}>
          <StaticRow label="Take-home salary" value={inr(state.salary)} />
          <StaticRow label="Rent / home EMI" value={inr(state.rent)} />
          <StaticRow label="Other loan EMIs" value={inr(state.emi)} />
          <StaticRow label="Living expenses" value={inr(state.expenses)} />
          <StaticRow label="Monthly investing (SIP)" value={inr(state.sip)} />
        </View>

        <Pressable
          onPress={() => navigation.navigate('Allocate')}
          style={{ width: '100%', marginTop: 16, backgroundColor: colors.green, borderRadius: 16, padding: 16, alignItems: 'center' }}
        >
          <Text style={{ color: colors.cream, fontSize: 15, fontWeight: '700' }}>Edit numbers →</Text>
        </Pressable>

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
