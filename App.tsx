import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import AppShell from './src/AppShell';
import { SalaryWiseProvider } from './src/lib/SalaryWiseContext';
import { fontMap } from './src/theme/fonts';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts(fontMap);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (fontsLoaded) setReady(true);
  }, [fontsLoaded]);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <SalaryWiseProvider>
        <AppShell />
      </SalaryWiseProvider>
    </SafeAreaProvider>
  );
}
