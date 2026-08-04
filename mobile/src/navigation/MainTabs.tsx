import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import DashboardScreen from '../screens/DashboardScreen';
import CoachScreen from '../screens/CoachScreen';
import { colors } from '../theme/colors';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.greenLight,
        tabBarInactiveTintColor: '#b6a88c',
        tabBarStyle: { height: 64, backgroundColor: colors.card, borderTopColor: colors.borderCard },
        tabBarLabelStyle: { fontSize: 9.5, fontWeight: '700' },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>◉</Text>,
        }}
      />
      <Tab.Screen
        name="Coach"
        component={CoachScreen}
        options={{
          tabBarLabel: 'Coach',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>✦</Text>,
        }}
      />
    </Tab.Navigator>
  );
}
