import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingStack from './OnboardingStack';
import MainTabs from './MainTabs';
import BudgetScreen from '../screens/BudgetScreen';
import EmiScreen from '../screens/EmiScreen';
import SipScreen from '../screens/SipScreen';
import AffordScreen from '../screens/AffordScreen';
import TaxScreen from '../screens/TaxScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingStack} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="Budget" component={BudgetScreen} />
      <Stack.Screen name="Emi" component={EmiScreen} />
      <Stack.Screen name="Sip" component={SipScreen} />
      <Stack.Screen name="Afford" component={AffordScreen} />
      <Stack.Screen name="Tax" component={TaxScreen} />
    </Stack.Navigator>
  );
}
