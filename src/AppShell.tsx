import { useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import RootNavigator from './navigation/RootNavigator';
import { useSalaryWiseContext } from './lib/SalaryWiseContext';

export default function AppShell() {
  const { hydrated, authChecked, remoteLoaded, uid, emailVerified, state } = useSalaryWiseContext();

  // Wait for local storage, the Firebase auth session check, and (if signed in)
  // the one-shot remote profile load — otherwise a returning, already-verified
  // user would flash into the Signup screen before we know better.
  const ready = hydrated && authChecked && (!uid || remoteLoaded);

  const onReady = useCallback(async () => {
    if (ready) await SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  let initialRouteName: 'Onboarding' | 'Main' = 'Onboarding';
  let onboardingInitialRouteName: 'Signup' | 'VerifyEmail' | 'Profile' | undefined;
  if (uid) {
    if (!emailVerified) onboardingInitialRouteName = 'VerifyEmail';
    else if (state.onboarded) initialRouteName = 'Main';
    else onboardingInitialRouteName = 'Profile';
  }

  return (
    <NavigationContainer onReady={onReady}>
      <RootNavigator initialRouteName={initialRouteName} onboardingInitialRouteName={onboardingInitialRouteName} />
    </NavigationContainer>
  );
}
