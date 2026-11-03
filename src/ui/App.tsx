
import { AuthProvider } from '@/app/contexts/AuthContext';
import { queryClient } from '@/app/libs/queryClient';
import { Toaster } from '@/app/libs/sonner';
import { Navigation } from '@/app/navigation';
import { DesktopGate } from '@/ui/components/DesktopGate';
import {
  HostGrotesk_300Light,
  HostGrotesk_400Regular,
  HostGrotesk_500Medium,
  HostGrotesk_600SemiBold,
  useFonts,
} from '@expo-google-fonts/host-grotesk';
import { QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    HostGrotesk_300Light,
    HostGrotesk_400Regular,
    HostGrotesk_500Medium,
    HostGrotesk_600SemiBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <KeyboardProvider statusBarTranslucent={true} navigationBarTranslucent={true}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <DesktopGate>
                <Navigation />
              </DesktopGate>
            </AuthProvider>
          </QueryClientProvider>
          <Toaster position="bottom-center" />
        </GestureHandlerRootView>
      </KeyboardProvider>
    </SafeAreaProvider >
  );
}
