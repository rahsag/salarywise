import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSalaryWiseContext } from '../lib/SalaryWiseContext';
import ScreenTransition from '../components/ScreenTransition';
import StepDots from '../components/StepDots';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import type { CityTier } from '../lib/types';

const CITY_TIERS: CityTier[] = ['Metro', 'Tier-2', 'Tier-3'];

const stepperBtnStyle = {
  width: 34,
  height: 34,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: colors.border,
  backgroundColor: colors.card,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { state, actions } = useSalaryWiseContext();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ flexGrow: 1 }}>
      <ScreenTransition style={{ padding: 26, paddingTop: 14, paddingBottom: 40 }}>
        <StepDots active={0} />
        <Text style={{ fontFamily: fonts.serifSemiBold, fontSize: 28, color: colors.ink, marginTop: 18 }}>A little about you</Text>
        <Text style={{ fontSize: 14, color: colors.inkMuted, marginTop: 6 }}>This tailors your plan and score.</Text>

        <View style={{ marginTop: 26 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.label }}>Age</Text>
            <Text style={{ color: colors.ink, fontSize: 15, fontWeight: '700' }}>{state.age} yrs</Text>
          </View>
          <Slider
            minimumValue={21}
            maximumValue={60}
            step={1}
            value={state.age}
            onValueChange={actions.setAge}
            minimumTrackTintColor={colors.green}
            maximumTrackTintColor="#e5dcc7"
            thumbTintColor={colors.green}
            style={{ width: '100%', marginTop: 12, height: 22 }}
          />
        </View>

        <View style={{ marginTop: 24 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.label, marginBottom: 10 }}>City tier</Text>
          <View style={{ flexDirection: 'row', gap: 9 }}>
            {CITY_TIERS.map((c) => (
              <Pressable
                key={c}
                onPress={() => actions.setCityTier(c)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 13,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: state.cityTier === c ? colors.green : colors.border,
                  backgroundColor: state.cityTier === c ? colors.green : colors.card,
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '700', color: state.cityTier === c ? colors.cream : colors.label }}>{c}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ marginTop: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.label }}>Dependents</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <Pressable onPress={actions.depMinus} style={stepperBtnStyle}>
                <Text style={{ fontSize: 18, color: colors.ink }}>−</Text>
              </Pressable>
              <Text style={{ fontSize: 17, color: colors.ink, fontWeight: '700', minWidth: 14, textAlign: 'center' }}>{state.dependents}</Text>
              <Pressable onPress={actions.depPlus} style={stepperBtnStyle}>
                <Text style={{ fontSize: 18, color: colors.ink }}>+</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <Pressable
          onPress={() => navigation.navigate('Income')}
          style={{ width: '100%', marginTop: 38, backgroundColor: colors.green, borderRadius: 16, padding: 16, alignItems: 'center' }}
        >
          <Text style={{ color: colors.cream, fontSize: 15, fontWeight: '700' }}>Continue</Text>
        </Pressable>
      </ScreenTransition>
    </ScrollView>
  );
}
