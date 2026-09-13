import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useSalaryWiseContext } from '../lib/SalaryWiseContext';
import { refreshEmailVerified, resendVerificationEmail } from '../lib/firebaseAuth';
import { loadRemoteState } from '../lib/firestoreSync';
import { getAuth } from '@react-native-firebase/auth';
import ScreenTransition from '../components/ScreenTransition';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

export default function VerifyEmailScreen() {
  const navigation = useNavigation<any>();
  const { state } = useSalaryWiseContext();
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleCheckVerified = async () => {
    setError(null);
    setChecking(true);
    try {
      const verified = await refreshEmailVerified();
      if (!verified) {
        setError("Still not verified — check your inbox and tap the link, then try again.");
        return;
      }
      const uid = getAuth().currentUser?.uid;
      const remote = uid ? await loadRemoteState(uid) : null;
      if (remote?.onboarded) {
        navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      } else {
        navigation.navigate('Profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setResending(true);
    try {
      await resendVerificationEmail();
      setSent(true);
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
        <Text style={{ fontFamily: fonts.serifSemiBold, fontSize: 28, color: colors.ink, marginTop: 20 }}>Verify your email</Text>
        <Text style={{ fontSize: 14, color: colors.inkMuted, marginTop: 8, lineHeight: 21 }}>
          We sent a verification link to{'\n'}
          <Text style={{ color: colors.ink, fontWeight: '700' }}>{state.email}</Text>
          {'\n\n'}Tap the link in that email, then come back and continue below.
        </Text>
        {sent && (
          <View style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, marginTop: 18 }}>
            <Text style={{ fontSize: 12, color: colors.inkMuted, lineHeight: 17 }}>Verification email sent again.</Text>
          </View>
        )}
        {error && (
          <View style={{ backgroundColor: colors.amberPale, borderWidth: 1, borderColor: colors.amberBorder, borderRadius: 12, padding: 12, marginTop: 18 }}>
            <Text style={{ fontSize: 12, color: colors.amberText, lineHeight: 17 }}>{error}</Text>
          </View>
        )}
        <Pressable onPress={handleResend} disabled={resending} style={{ marginTop: 18 }}>
          <Text style={{ textAlign: 'center', fontSize: 13, color: colors.tanLight }}>
            {resending ? 'Resending…' : 'Resend email'}
          </Text>
        </Pressable>
        <Pressable
          onPress={handleCheckVerified}
          disabled={checking}
          style={{ width: '100%', marginTop: 22, backgroundColor: colors.green, borderRadius: 16, padding: 16, alignItems: 'center', opacity: checking ? 0.7 : 1 }}
        >
          {checking ? <ActivityIndicator color={colors.cream} /> : <Text style={{ color: colors.cream, fontSize: 15, fontWeight: '700' }}>I've verified — continue</Text>}
        </Pressable>
      </ScreenTransition>
    </ScrollView>
  );
}
