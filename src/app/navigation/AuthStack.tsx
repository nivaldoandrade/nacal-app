
import { OnboardingParamList } from '@/app/navigation/OnboardingStack';
import { ForgotPassword } from '@/ui/screens/forgotPassword';
import { ResetPassword } from '@/ui/screens/forgotPassword/resetPassword';
import { Onboarding } from '@/ui/screens/onboarding';
import { OnboardingIntro } from '@/ui/screens/onboarding/intro';
import { Welcome } from '@/ui/screens/welcome';
import { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  Welcome: { prefillEmail?: string } | undefined;
  OnboardingIntro: undefined;
  Onboarding: NavigatorScreenParams<OnboardingParamList> | undefined;
  ForgotPassword: undefined;
  ResetPassword: { email: string };
}

const Stack = createNativeStackNavigator<AuthStackParamList>();

export type AuthStackNavigatorProps = NativeStackNavigationProp<AuthStackParamList>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName='Welcome'
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="OnboardingIntro" component={OnboardingIntro} />
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
    </Stack.Navigator>
  );
}

