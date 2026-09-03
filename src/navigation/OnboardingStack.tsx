import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import VerifyEmailScreen from '../screens/VerifyEmailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import IncomeScreen from '../screens/IncomeScreen';
import ScoreScreen from '../screens/ScoreScreen';
import type { OnboardingStackParamList } from './types';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export default function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Income" component={IncomeScreen} />
      <Stack.Screen name="Score" component={ScoreScreen} />
    </Stack.Navigator>
  );
}
