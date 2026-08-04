import type { NavigatorScreenParams } from '@react-navigation/native';

export type OnboardingStackParamList = {
  Signup: undefined;
  Otp: undefined;
  Profile: undefined;
  Income: undefined;
  Score: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Coach: undefined;
};

export type RootStackParamList = {
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  Budget: undefined;
  Emi: undefined;
  Sip: undefined;
  Afford: undefined;
  Tax: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
