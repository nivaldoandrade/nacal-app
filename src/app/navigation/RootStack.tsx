import { useAuth } from '@/app/contexts/AuthContext/useAuth';
import { AppStack, AppStackParamlist } from '@/app/navigation/AppStack';
import { AuthStack } from '@/app/navigation/AuthStack';
import { ConnectionError } from '@/ui/screens/connectionError';
import { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type RootParamList = {
  Auth: undefined;
  ConnectionError: undefined;
  App: NavigatorScreenParams<AppStackParamlist>;
}

const Stack = createNativeStackNavigator<RootParamList>();

export function RootStack() {

  const { isSignedIn, shouldShowOnboarding, sessionRestoreFailed } = useAuth();

  if (sessionRestoreFailed) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ConnectionError" component={ConnectionError} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isSignedIn || shouldShowOnboarding ? (
        <Stack.Screen
          name="Auth"
          component={AuthStack}
          options={{ animationTypeForReplace: 'pop' }}
        />
      ) : (
        <Stack.Screen name="App" component={AppStack} />
      )
      }

    </Stack.Navigator>
  );
}
