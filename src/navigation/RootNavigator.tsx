import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingStack from './OnboardingStack';
import MainTabs from './MainTabs';
import BudgetScreen from '../screens/BudgetScreen';
import EmiScreen from '../screens/EmiScreen';
import SipScreen from '../screens/SipScreen';
import AffordScreen from '../screens/AffordScreen';
import TaxScreen from '../screens/TaxScreen';
import UpgradeScreen from '../screens/UpgradeScreen';
import AccountScreen from '../screens/AccountScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import type { OnboardingStackParamList, RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

interface RootNavigatorProps {
  initialRouteName?: keyof RootStackParamList;
  onboardingInitialRouteName?: keyof OnboardingStackParamList;
}

export default function RootNavigator({ initialRouteName = 'Onboarding', onboardingInitialRouteName }: RootNavigatorProps) {
  return (
    <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding">
        {() => <OnboardingStack initialRouteName={onboardingInitialRouteName} />}
      </Stack.Screen>
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="Budget" component={BudgetScreen} />
      <Stack.Screen name="Emi" component={EmiScreen} />
      <Stack.Screen name="Sip" component={SipScreen} />
      <Stack.Screen name="Afford" component={AffordScreen} />
      <Stack.Screen name="Tax" component={TaxScreen} />
      <Stack.Screen name="Upgrade" component={UpgradeScreen} />
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen name="Expenses" component={ExpensesScreen} />
    </Stack.Navigator>
  );
}
