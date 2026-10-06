import { RootParamList, RootStack } from '@/app/navigation/RootStack';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { Platform } from 'react-native';

const linking: LinkingOptions<RootParamList> = {
  prefixes: Platform.OS === 'web' ? [window.location.origin] : ['nacal://'],
  config: {
    screens: {
      App: {
        // Boot em /billing/return monta [Home, Plans] (senão Plans vira raiz e
        // o goBack do Header não tem pilha pra descer). Home: '' sincroniza a
        // URL com '/' após o back.
        initialRouteName: 'Home',
        screens: {
          Home: '',
          Plans: 'billing/return',
        },
      },
    },
  },
};

export function Navigation() {

  return (
    <NavigationContainer linking={linking}>
      <BottomSheetModalProvider>
        <RootStack />
      </BottomSheetModalProvider>
    </NavigationContainer>
  );
}
