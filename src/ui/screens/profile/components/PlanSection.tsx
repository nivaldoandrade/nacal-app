import { useAccount } from '@/app/hooks/queries/useAccount';
import { AppText } from '@/ui/components/AppText';
import { ButtonApp } from '@/ui/components/Button';
import { styles } from '@/ui/screens/profile/styles';
import { theme } from '@/ui/styles/theme';
import { AppStackNavigatorProps } from '@/app/navigation/AppStack';
import { formatShortDate } from '@/ui/utils/formatShortDate';
import { daysUntil } from '@/ui/utils/daysUntil';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';

export function PlanSection() {
  const { navigate } = useNavigation<AppStackNavigatorProps>();
  const { subscription, mealQuota } = useAccount();

  const limit = mealQuota?.limit ?? 20;
  const used = mealQuota?.used ?? 0;
  const isPro = subscription?.plan === 'PRO';

  const planLabel = getPlanLabel(subscription?.planId ?? null);
  const statusLine = getStatusLine();

  function getPlanLabel(planId: string | null): string {
    if (planId === 'PRO_YEARLY') {
      return 'Pro Anual';
    }

    if (planId === 'PRO_MONTHLY') {
      return 'Pro Mensal';
    }

    return 'Free';
  }

  function getStatusLine(): string {
    if (!subscription || subscription.plan === 'FREE') {
      return `${used} de ${limit} refeições este mês`;
    }

    if (subscription.status === 'TRIALING') {
      const daysLeft = daysUntil(subscription.trialEndsAt, new Date());

      if (daysLeft > 0) {
        return `Trial — faltam ${daysLeft} ${daysLeft === 1 ? 'dia' : 'dias'}`;
      }

      return 'Trial — termina hoje';
    }

    if (subscription.status === 'ACTIVE') {
      return `Próxima cobrança: ${formatShortDate(subscription.paidUntil)}`;
    }

    if (subscription.status === 'PAST_DUE') {
      return 'Pagamento pendente';
    }

    if (subscription.paidUntil && subscription.paidUntil.getTime() > Date.now()) {
      return `Acesso Pro até ${formatShortDate(subscription.paidUntil)}`;
    }

    return `${used} de ${limit} refeições este mês`;
  }

  return (
    <View style={styles.planSection}>
      <AppText size='sm' weight='medium' color={theme.colors.gray[700]}>
        Plano
      </AppText>
      <View style={styles.planCard}>
        <View style={styles.planRow}>
          <AppText weight='semiBold'>{planLabel}</AppText>
          <View style={isPro ? styles.planBadgePro : styles.planBadgeFree}>
            <AppText
              size='xs'
              weight='medium'
              color={isPro ? theme.colors.lime[800] : theme.colors.gray[700]}
            >
              {isPro ? 'Pro' : 'Free'}
            </AppText>
          </View>
        </View>
        <AppText size='sm' color={theme.colors.gray[700]}>
          {statusLine}
        </AppText>
        <ButtonApp intent='secondary' onPress={() => navigate('Plans')}>
          Ver planos
        </ButtonApp>
      </View>
    </View>
  );
}
