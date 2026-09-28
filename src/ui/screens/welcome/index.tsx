import { useAuth } from '@/app/contexts/AuthContext/useAuth';
import type { AuthStackNavigatorProps, AuthStackScreenProps } from '@/app/navigation/AuthStack';
import { AppText } from '@/ui/components/AppText';
import { ButtonApp } from '@/ui/components/Button';
import { Logo } from '@/ui/components/Logo';
import { SignInBottomSheet } from '@/ui/components/SignInBottomSheet';
import { ISignInBottomSheet } from '@/ui/components/SignInBottomSheet/ISignInBottomSheet';
import { styles } from '@/ui/screens/welcome/styles';
import { theme } from '@/ui/styles/theme';
import { useFocusEffect, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SystemUI from 'expo-system-ui';
import { useCallback, useEffect, useRef } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from '@/ui/hooks/useSafeAreaInsets';

export function Welcome() {
  const navigation = useNavigation<AuthStackNavigatorProps>();
  const route = useRoute<AuthStackScreenProps<'Welcome'>['route']>();
  const signInModalRef = useRef<ISignInBottomSheet>(null);
  const insets = useSafeAreaInsets();

  const { shouldShowOnboarding } = useAuth();
  const isFocused = useIsFocused();

  useFocusEffect(
    useCallback(() => {
      SystemUI.setBackgroundColorAsync(theme.colors.welcomeFallback);

      return () => {
        SystemUI.setBackgroundColorAsync(null);
      };
    }, []),

  );

  useEffect(() => {
    if (shouldShowOnboarding && isFocused) {
      navigation.navigate('OnboardingIntro');
    }
  }, [shouldShowOnboarding, isFocused, navigation]);

  useEffect(() => {
    const email = route.params?.prefillEmail;

    if (!email) {
      return;
    }

    signInModalRef.current?.open();
  }, [route.params?.prefillEmail]);

  const handleSignInModalOpen = () => {
    signInModalRef.current?.open();
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.backgroundFallback}>
          <LinearGradient
            colors={theme.colors.welcomeGradient.colors}
            locations={theme.colors.welcomeGradient.locations}
            style={styles.background}
          />
        </View>

        <View style={styles.content}>
          <View style={{ paddingTop: insets.top }}>
            <Logo width={186} height={60} />
          </View>
          <View style={[styles.buttonsContainer, { paddingBottom: insets.bottom }]}>
            <View style={styles.ctaContainer}>
              <AppText
                size='4xl'
                weight='medium'
                color={theme.colors.white}
                style={styles.heading}
              >
                Controle sua dieta de forma simples
              </AppText>
              <View style={styles.ctaContent}>
                <View style={styles.primaryButtonWrapper}>
                  <ButtonApp
                    onPress={() => navigation.navigate('Onboarding')}
                    style={styles.primaryButton}
                  >
                    Criar Conta
                  </ButtonApp>
                </View>
                <View style={styles.signInContainer}>
                  <AppText color={theme.colors.white} >
                    Já tem conta?
                  </AppText>
                  <TouchableOpacity onPress={handleSignInModalOpen}>
                    <AppText color={theme.colors.lime[500]} weight='semiBold'>
                      Acessar conta
                    </AppText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      <SignInBottomSheet
        ref={signInModalRef}
        initialEmail={route.params?.prefillEmail} />
    </>
  );
}
