import { useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import RootNavigator from './navigation/RootNavigator';
import { useSalaryWiseContext } from './lib/SalaryWiseContext';

export default function AppShell() {
  const { hydrated } = useSalaryWiseContext();

  const onReady = useCallback(async () => {
    if (hydrated) await SplashScreen.hideAsync();
  }, [hydrated]);

  if (!hydrated) return null;

  return (
    <NavigationContainer onReady={onReady}>
      <RootNavigator />
    </NavigationContainer>
  );
}
