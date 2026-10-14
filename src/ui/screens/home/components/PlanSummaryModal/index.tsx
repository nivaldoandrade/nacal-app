import { useAccount } from '@/app/hooks/queries/useAccount';
import { AppText } from '@/ui/components/AppText';
import { ButtonApp } from '@/ui/components/Button';
import { MacroRainbow } from '@/ui/components/MacroRainbow';
import { styles } from '@/ui/screens/home/components/PlanSummaryModal/styles';
import { theme } from '@/ui/styles/theme';
import { useSafeAreaInsets } from '@/ui/hooks/useSafeAreaInsets';
import { goalInfoByValue } from '@/ui/utils/goal';
import { Modal, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

interface IPlanSummaryModalProps {
  visible: boolean;
  onRequestClose: () => void;
}

export function PlanSummaryModal({ visible, onRequestClose }: IPlanSummaryModalProps) {
  const { top, bottom } = useSafeAreaInsets();
  const { account } = useAccount();

  const currentGoal = account ? goalInfoByValue[account.profile.goal] : null;

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
            {account && currentGoal && (
              <>
                <View style={styles.content}>
                  <View style={styles.header}>
                    <View style={styles.iconContainer}>
                      <AppText style={{ textAlign: 'center' }}>
                        {currentGoal.icon}
                      </AppText>
                    </View>
                    <View style={styles.headerContent}>
                      <AppText
                        size='4xl'
                        weight='semiBold'
                        color={theme.colors.gray[100]}
                        style={styles.title}
                      >
                        Seu plano de dieta {'\n'} para {''}
                        <Text style={styles.titleHighlight}>{currentGoal.label}</Text>
                        {'\n'} está pronto!
                      </AppText>
                      <AppText
                        color={theme.colors.gray[600]}
                        style={{ textAlign: 'center' }}
                      >
                        Essa é a recomendação diária recomendada para seu plano.
                        Fique tranquilo, você poderá editar depois caso deseje.
                      </AppText>
                    </View>
                  </View>
                  <View style={styles.rainbow}>
                    <MacroRainbow
                      mode='full'
                      calories={{ goal: account.goal.calories }}
                      protein={{ goal: account.goal.proteins }}
                      carbs={{ goal: account.goal.carbohydrates }}
                      fat={{ goal: account.goal.fats }}
                      colorText={theme.colors.gray[200]}
                    />
                  </View>
                </View>

                <View style={styles.footer}>
                  <ButtonApp onPress={onRequestClose}>
                    Começar meu plano
                  </ButtonApp>
                </View>
              </>
            )}
          </View>
        </SafeAreaProvider>
      </View>
    </Modal>
  );
}
