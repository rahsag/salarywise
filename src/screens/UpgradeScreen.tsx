import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useSalaryWiseContext } from '../lib/SalaryWiseContext';
import ScreenTransition from '../components/ScreenTransition';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

export default function UpgradeScreen() {
  const navigation = useNavigation<any>();
  const { actions } = useSalaryWiseContext();
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    setError(null);
    setPurchasing(true);
    try {
      await actions.purchasePro();
      navigation.replace('Tax');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ flexGrow: 1 }}>
      <ScreenTransition style={{ padding: 26, paddingTop: 14, paddingBottom: 40 }}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
          <Text style={{ fontSize: 22, color: colors.ink }}>←</Text>
        </Pressable>

        <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: colors.amber, alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
          <Text style={{ fontSize: 24 }}>🧾</Text>
        </View>
        <Text style={{ fontFamily: fonts.serifSemiBold, fontSize: 28, color: colors.ink, marginTop: 18 }}>Unlock Pro</Text>
        <Text style={{ fontSize: 14, color: colors.inkMuted, marginTop: 8, lineHeight: 21 }}>
          Get the Tax Planner & Salary Optimizer — compare old vs new regime and see ranked savings, for life.
        </Text>

        <View style={{ marginTop: 26, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 18 }}>
          <Text style={{ fontSize: 13, color: colors.inkMuted }}>One-time payment</Text>
          <Text style={{ fontFamily: fonts.serifSemiBold, fontSize: 32, color: colors.ink, marginTop: 4 }}>₹299</Text>
        </View>

        {error && (
          <View style={{ backgroundColor: colors.amberPale, borderWidth: 1, borderColor: colors.amberBorder, borderRadius: 12, padding: 12, marginTop: 18 }}>
            <Text style={{ fontSize: 12, color: colors.amberText, lineHeight: 17 }}>{error}</Text>
          </View>
        )}

        <Pressable
          onPress={handleUpgrade}
          disabled={purchasing}
          style={{ width: '100%', marginTop: 22, backgroundColor: colors.green, borderRadius: 16, padding: 16, alignItems: 'center', opacity: purchasing ? 0.7 : 1 }}
        >
          {purchasing ? <ActivityIndicator color={colors.cream} /> : <Text style={{ color: colors.cream, fontSize: 15, fontWeight: '700' }}>Pay ₹299 & unlock</Text>}
        </Pressable>
      </ScreenTransition>
    </ScrollView>
  );
}
