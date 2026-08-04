import { useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Pressable, ScrollView, Text, TextInput, View, type NativeSyntheticEvent, type TextInputKeyPressEventData } from 'react-native';
import { useSalaryWiseContext } from '../lib/SalaryWiseContext';
import ScreenTransition from '../components/ScreenTransition';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

const otpInputStyle = {
  width: 60,
  textAlign: 'center' as const,
  fontSize: 26,
  fontWeight: '700' as const,
  paddingVertical: 16,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 14,
  color: colors.ink,
  backgroundColor: colors.card,
};

export default function OtpScreen() {
  const navigation = useNavigation<any>();
  const { state, actions } = useSalaryWiseContext();
  const mobileDisplay = state.mobile || '+91 98765 43210';
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleChange = (i: number, v: string) => {
    actions.setOtpDigit(i, v);
    if (v && i < 3) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyPress = (i: number, e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Backspace' && !state.otp[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ flexGrow: 1 }}>
      <ScreenTransition style={{ padding: 26, paddingTop: 14, paddingBottom: 40 }}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Text style={{ fontSize: 22, color: colors.ink }}>←</Text>
        </Pressable>
        <Text style={{ fontFamily: fonts.serifSemiBold, fontSize: 28, color: colors.ink, marginTop: 20 }}>Verify your number</Text>
        <Text style={{ fontSize: 14, color: colors.inkMuted, marginTop: 8, lineHeight: 21 }}>
          We sent a 4-digit code to{'\n'}
          <Text style={{ color: colors.ink, fontWeight: '700' }}>{mobileDisplay}</Text>
        </Text>
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 30 }}>
          {state.otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={(r) => {
                inputRefs.current[i] = r;
              }}
              style={otpInputStyle}
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              onChangeText={(v) => handleChange(i, v)}
              onKeyPress={(e) => handleKeyPress(i, e)}
            />
          ))}
        </View>
        <View style={{ backgroundColor: colors.amberPale, borderWidth: 1, borderColor: colors.amberBorder, borderRadius: 12, padding: 12, marginTop: 18 }}>
          <Text style={{ fontSize: 12, color: colors.amberText, lineHeight: 17 }}>⚠ Demo mode — OTP is mocked, any code works.</Text>
        </View>
        <Text style={{ textAlign: 'center', fontSize: 13, color: colors.tanLight, marginTop: 18 }}>Resend code in 0:24</Text>
        <Pressable
          onPress={() => navigation.navigate('Profile')}
          style={{ width: '100%', marginTop: 22, backgroundColor: colors.green, borderRadius: 16, padding: 16, alignItems: 'center' }}
        >
          <Text style={{ color: colors.cream, fontSize: 15, fontWeight: '700' }}>Verify & continue</Text>
        </Pressable>
      </ScreenTransition>
    </ScrollView>
  );
}
