import { useNavigation } from '@react-navigation/native';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSalaryWiseContext } from '../lib/SalaryWiseContext';
import ScreenTransition from '../components/ScreenTransition';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

const fieldLabelStyle = { fontSize: 12, fontWeight: '600' as const, color: colors.fieldLabel, marginBottom: 6 };
const inputStyle = {
  width: '100%' as const,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 14,
  padding: 14,
  fontSize: 15,
  color: colors.ink,
  backgroundColor: colors.card,
};

export default function SignupScreen() {
  const navigation = useNavigation<any>();
  const { state, actions } = useSalaryWiseContext();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ flexGrow: 1 }}>
      <ScreenTransition style={{ padding: 26, paddingTop: 14, paddingBottom: 40 }}>
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            backgroundColor: colors.green,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontFamily: fonts.serifSemiBold, fontSize: 26, color: colors.amber }}>S</Text>
        </View>
        <Text style={{ fontFamily: fonts.serifSemiBold, fontSize: 32, color: colors.ink, marginTop: 22, lineHeight: 35, letterSpacing: -0.3 }}>
          Money, made{'\n'}manageable.
        </Text>
        <Text style={{ fontSize: 14, color: colors.inkMuted, marginTop: 10, lineHeight: 21 }}>
          Budgeting, tax, loans and investing for salaried India — in one calm place.
        </Text>
        <View style={{ gap: 12, marginTop: 30 }}>
          <View>
            <Text style={fieldLabelStyle}>Full name</Text>
            <TextInput style={inputStyle} value={state.name} onChangeText={actions.setName} placeholder="Rahul Sharma" />
          </View>
          <View>
            <Text style={fieldLabelStyle}>Mobile number</Text>
            <TextInput style={inputStyle} value={state.mobile} onChangeText={actions.setMobile} keyboardType="numeric" placeholder="+91 98765 43210" />
          </View>
          <View>
            <Text style={fieldLabelStyle}>Email</Text>
            <TextInput style={inputStyle} value={state.email} onChangeText={actions.setEmail} placeholder="rahul@email.com" autoCapitalize="none" />
          </View>
        </View>
        <Pressable
          onPress={() => navigation.navigate('Otp')}
          style={{ width: '100%', marginTop: 26, backgroundColor: colors.green, borderRadius: 16, padding: 16, alignItems: 'center' }}
        >
          <Text style={{ color: colors.cream, fontSize: 15, fontWeight: '700' }}>Create account</Text>
        </Pressable>
        <Text style={{ textAlign: 'center', fontSize: 12.5, color: colors.tanLight, marginTop: 16 }}>
          Already have an account? <Text style={{ color: colors.greenLight, fontWeight: '700' }}>Log in</Text>
        </Text>
      </ScreenTransition>
    </ScrollView>
  );
}
