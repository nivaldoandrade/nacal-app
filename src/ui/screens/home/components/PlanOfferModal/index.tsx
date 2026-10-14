import { AppText } from '@/ui/components/AppText';
import { ButtonApp } from '@/ui/components/Button';
import { useSafeAreaInsets } from '@/ui/hooks/useSafeAreaInsets';
import { styles } from '@/ui/screens/home/components/PlanOfferModal/styles';
import { usePlanOfferModal } from '@/ui/screens/home/components/PlanOfferModal/usePlanOfferModal';
import { PlanComparison } from '@/ui/screens/plans/components/PlanComparison';
import { theme } from '@/ui/styles/theme';
import { ActivityIndicator, Modal, ScrollView, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

interface IPlanOfferModalProps {
  visible: boolean;
  onRequestClose: () => void;
}

export function PlanOfferModal({ visible, onRequestClose }: IPlanOfferModalProps) {
  const { top, bottom } = useSafeAreaInsets();
  const {
    isLoadingPlans,
    isErrorPlans,
    freeFeature,
    proFeatures,
    trialDays,
    isStartingTrial,
    handleStartTrial,
    handleKeepFree,
  } = usePlanOfferModal({ onDismiss: onRequestClose });

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType='fade'
      onRequestClose={onRequestClose}
    >
      <View style={styles.container}>
        <SafeAreaProvider>
          <View style={[styles.wrapper, { paddingTop: top, paddingBottom: bottom }]}>
            <ScrollView contentContainerStyle={styles.content}>
              <View style={styles.header}>
                <View style={styles.iconContainer}>
                  <AppText style={{ textAlign: 'center' }}>🌱</AppText>
                </View>
                <AppText
                  size='4xl'
                  weight='semiBold'
                  color={theme.colors.gray[100]}
                  style={styles.title}
                >
                  Escolha como {'\n'}
                  <Text style={styles.titleHighlight}>continuar</Text>
                </AppText>
                <AppText color={theme.colors.gray[600]} style={styles.subtitle}>
                  Comece gratuitamente ou experimente o Pro com refeições ilimitadas.
                </AppText>
              </View>

              {isLoadingPlans && (
                <View style={styles.comparisonState}>
                  <ActivityIndicator color={theme.colors.gray[400]} />
                </View>
              )}

              {isErrorPlans && (
                <View style={styles.comparisonState}>
                  <AppText
                    size='sm'
                    color={theme.colors.gray[500]}
                    style={styles.subtitle}
                  >
                    Não foi possível carregar a comparação agora.
                    {'\n'}Dá uma olhada depois, no seu perfil.
                  </AppText>
                </View>
              )}

              {!isLoadingPlans && !isErrorPlans && (
                <View style={styles.tray}>
                  <PlanComparison
                    freeFeature={freeFeature}
                    proFeatures={proFeatures}
                    trialDays={trialDays}
                  />
                </View>
              )}
            </ScrollView>

            <View style={styles.footer}>
              <ButtonApp onPress={handleStartTrial} isLoading={isStartingTrial}>
                Começar 7 dias grátis
              </ButtonApp>
              <AppText
                size='sm'
                color={theme.colors.gray[500]}
                style={styles.hint}
              >
                7 dias grátis, sem cartão. Depois disso, volte a qualquer momento para o Free.
              </AppText>
              <ButtonApp
                intent='ghost'
                onPress={handleKeepFree}
                disabled={isStartingTrial}>
                <AppText weight='medium' color={theme.colors.gray[300]}>
                  Continuar no Free
                </AppText>
              </ButtonApp>
            </View>
          </View>
        </SafeAreaProvider>
      </View>
    </Modal>
  );
}
