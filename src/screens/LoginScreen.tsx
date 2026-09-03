import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSalaryWiseContext } from '../lib/SalaryWiseContext';
import { signInWithEmail } from '../lib/firebaseAuth';
import { loadRemoteState } from '../lib/firestoreSync';
import { getAuth } from '@react-native-firebase/auth';
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

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const { state, actions } = useSalaryWiseContext();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!/^\S+@\S+\.\S+$/.test(state.email)) {
      setError('Enter a valid email address.');
      return;
    }
    setError(null);
    setSending(true);
    try {
      await signInWithEmail(state.email, state.password);
      if (!getAuth().currentUser?.emailVerified) {
        navigation.navigate('VerifyEmail');
        return;
      }
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
      setSending(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ flexGrow: 1 }}>
      <ScreenTransition style={{ padding: 26, paddingTop: 14, paddingBottom: 40 }}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Text style={{ fontSize: 22, color: colors.ink }}>←</Text>
        </Pressable>
        <Text style={{ fontFamily: fonts.serifSemiBold, fontSize: 32, color: colors.ink, marginTop: 22, lineHeight: 35, letterSpacing: -0.3 }}>
          Welcome back.
        </Text>
        <Text style={{ fontSize: 14, color: colors.inkMuted, marginTop: 10, lineHeight: 21 }}>
          Log in with the email on your account.
        </Text>
        <View style={{ gap: 12, marginTop: 30 }}>
          <View>
            <Text style={fieldLabelStyle}>Email</Text>
            <TextInput style={inputStyle} value={state.email} onChangeText={actions.setEmail} placeholder="rahul@email.com" autoCapitalize="none" keyboardType="email-address" />
          </View>
          <View>
            <Text style={fieldLabelStyle}>Password</Text>
            <TextInput style={inputStyle} value={state.password} onChangeText={actions.setPassword} placeholder="Your password" secureTextEntry autoCapitalize="none" />
          </View>
        </View>
        {error && (
          <View style={{ backgroundColor: colors.amberPale, borderWidth: 1, borderColor: colors.amberBorder, borderRadius: 12, padding: 12, marginTop: 16 }}>
            <Text style={{ fontSize: 12, color: colors.amberText, lineHeight: 17 }}>{error}</Text>
          </View>
        )}
        <Pressable
          onPress={handleLogin}
          disabled={sending}
          style={{ width: '100%', marginTop: 26, backgroundColor: colors.green, borderRadius: 16, padding: 16, alignItems: 'center', opacity: sending ? 0.7 : 1 }}
        >
          {sending ? <ActivityIndicator color={colors.cream} /> : <Text style={{ color: colors.cream, fontSize: 15, fontWeight: '700' }}>Log in</Text>}
        </Pressable>
        <Text style={{ textAlign: 'center', fontSize: 12.5, color: colors.tanLight, marginTop: 16 }}>
          New here?{' '}
          <Text style={{ color: colors.greenLight, fontWeight: '700' }} onPress={() => navigation.navigate('Signup')}>
            Create account
          </Text>
        </Text>
      </ScreenTransition>
    </ScrollView>
  );
}
