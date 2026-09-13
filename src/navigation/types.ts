import type { NavigatorScreenParams } from '@react-navigation/native';

export type OnboardingStackParamList = {
  Signup: undefined;
  Disclaimer: undefined;
  Login: undefined;
  VerifyEmail: undefined;
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
  Upgrade: undefined;
  Account: undefined;
  Expenses: undefined;
  Allocate: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
