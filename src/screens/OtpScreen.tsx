import { useEffect, useRef, useState } from 'react';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from 'react-native';
import { getAuth } from '@react-native-firebase/auth';
import { useSalaryWiseContext } from '../lib/SalaryWiseContext';
import { confirmOtp, sendOtp, toE164, type Confirmation } from '../lib/firebaseAuth';
import { loadRemoteState } from '../lib/firestoreSync';
import ScreenTransition from '../components/ScreenTransition';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import type { OnboardingStackParamList } from '../navigation/types';

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

const RESEND_SECONDS = 24;

export default function OtpScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<OnboardingStackParamList, 'Otp'>>();
  const { state, actions } = useSalaryWiseContext();
  const mobileDisplay = state.mobile || '+91 98765 43210';
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const [confirmation, setConfirmation] = useState<Confirmation>(route.params.confirmation);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  const handleChange = (i: number, v: string) => {
    setError(null);
    actions.setOtpDigit(i, v);
    if (v && i < 3) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyPress = (i: number, e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Backspace' && !state.otp[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = state.otp.join('');
    if (code.length !== 4) {
      setError('Enter all 4 digits.');
      return;
    }
    setError(null);
    setVerifying(true);
    try {
      await confirmOtp(confirmation, code);
      // Firebase phone auth doesn't distinguish signup from login — a synced
      // doc already existing for this uid is what tells returning users apart
      // from brand-new ones, so route accordingly instead of always onboarding.
      const uid = getAuth().currentUser?.uid;
      const remote = uid ? await loadRemoteState(uid) : null;
      if (remote) {
        navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      } else {
        navigation.navigate('Profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    const phoneE164 = toE164(state.mobile);
    if (!phoneE164 || resending || secondsLeft > 0) return;
    setError(null);
    setResending(true);
    try {
      const next = await sendOtp(phoneE164);
      setConfirmation(next);
      setSecondsLeft(RESEND_SECONDS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setResending(false);
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
        {error && (
          <View style={{ backgroundColor: colors.amberPale, borderWidth: 1, borderColor: colors.amberBorder, borderRadius: 12, padding: 12, marginTop: 18 }}>
            <Text style={{ fontSize: 12, color: colors.amberText, lineHeight: 17 }}>{error}</Text>
          </View>
        )}
        <Pressable onPress={handleResend} disabled={secondsLeft > 0 || resending} style={{ marginTop: 18 }}>
          <Text style={{ textAlign: 'center', fontSize: 13, color: colors.tanLight }}>
            {resending ? 'Resending…' : secondsLeft > 0 ? `Resend code in 0:${String(secondsLeft).padStart(2, '0')}` : 'Resend code'}
          </Text>
        </Pressable>
        <Pressable
          onPress={handleVerify}
          disabled={verifying}
          style={{ width: '100%', marginTop: 22, backgroundColor: colors.green, borderRadius: 16, padding: 16, alignItems: 'center', opacity: verifying ? 0.7 : 1 }}
        >
          {verifying ? <ActivityIndicator color={colors.cream} /> : <Text style={{ color: colors.cream, fontSize: 15, fontWeight: '700' }}>Verify & continue</Text>}
        </Pressable>
      </ScreenTransition>
    </ScrollView>
  );
}
