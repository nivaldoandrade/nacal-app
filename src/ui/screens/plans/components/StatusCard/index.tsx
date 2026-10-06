import { AppText } from '@/ui/components/AppText';
import { styles } from '@/ui/screens/plans/components/StatusCard/styles';
import { PlanStatus } from '@/ui/screens/plans/usePlansScreen';
import { theme } from '@/ui/styles/theme';
import { MealQuota, Subscription } from '@/app/types/Subscription';
import { formatPrice } from '@/ui/utils/formatPrice';
import { formatShortDate } from '@/ui/utils/formatShortDate';
import { View } from 'react-native';

interface IStatusCardProps {
  status: PlanStatus;
  subscription: Subscription | null;
  quota: MealQuota | null;
  currentPlanName: string | null;
  currentPlanPrice: number | null;
  trialDaysLeft: number | null;
}

export function StatusCard({
  status,
  subscription,
  quota,
  currentPlanName,
  currentPlanPrice,
  trialDaysLeft,
}: IStatusCardProps) {
  const limit = quota?.limit ?? 20;
  const used = quota?.used ?? 0;
  const isQuotaFull = used >= limit;
  const quotaPercent = Math.min(100, Math.round((used / limit) * 100));

  const cycleSuffix = subscription?.planId === 'PRO_YEARLY' ? '/ano' : '/mês';

  function renderQuota() {
    if (!quota || (status !== 'FREE' && status !== 'TRIAL_EXPIRED' && status !== 'EXPIRED')) {
      return null;
    }

    return (
      <View style={styles.quotaBlock}>
        <View style={styles.quotaRow}>
          <AppText size='sm' weight='medium'>
            {used} de {limit} refeições
          </AppText>
          <AppText size='sm' color={theme.colors.gray[700]}>este mês</AppText>
        </View>
        <View style={styles.quotaTrack}>
          <View
            style={[
              styles.quotaFill,
              {
                width: `${quotaPercent}%`,
                backgroundColor: isQuotaFull
                  ? theme.colors.support.red
                  : theme.colors.gray[700],
              },
            ]}
          />
        </View>
        {isQuotaFull && (
          <AppText size='xs' color={theme.colors.support.red}>
            Limite do Free atingido neste mês. Assine o Pro para seguir sem limites.
          </AppText>
        )}
      </View>
    );
  }

  function renderContent() {
    switch (status) {
      case 'FREE':
        return (
          <>
            <View style={styles.headerRow}>
              <View style={styles.badgeFree}>
                <AppText size='xs' weight='medium' color={theme.colors.gray[700]}>Free</AppText>
              </View>
              <AppText weight='semiBold'>Plano Free</AppText>
            </View>
            <AppText size='sm' color={theme.colors.gray[700]}>
              Você tem {limit} refeições AI por mês. Comece um teste grátis ou assine o Pro para desbloquear o ilimitado.
            </AppText>
            {renderQuota()}
          </>
        );

      case 'TRIAL':
        return (
          <>
            <View style={styles.headerRow}>
              <View style={styles.badgePro}>
                <AppText size='xs' weight='medium' color={theme.colors.lime[800]}>Pro · trial</AppText>
              </View>
              <AppText weight='semiBold'>Teste grátis</AppText>
            </View>
            <AppText size='sm' color={theme.colors.gray[700]}>
              {trialDaysLeft !== null && trialDaysLeft > 0
                ? `Seu trial termina em ${trialDaysLeft} ${trialDaysLeft === 1 ? 'dia' : 'dias'} (${formatShortDate(subscription?.trialEndsAt)}). Depois, seu plano volta ao Free, com ${limit} refeições por mês.`
                : `Seu trial termina hoje (${formatShortDate(subscription?.trialEndsAt)}). Depois, seu plano volta ao Free, com ${limit} refeições por mês.`}
            </AppText>
            {trialDaysLeft !== null && trialDaysLeft <= 3 && (
              <View style={styles.warningRow}>
                <AppText size='sm' weight='medium' color={theme.colors.support.orange}>
                  {trialDaysLeft === 0
                    ? 'Hoje é o último dia — assine agora para não perder o ritmo.'
                    : 'Faltam poucos dias — assine agora para não perder o ritmo.'}
                </AppText>
              </View>
            )}
          </>
        );

      case 'TRIAL_EXPIRED':
        return (
          <>
            <View style={styles.headerRow}>
              <View style={styles.badgeFree}>
                <AppText size='xs' weight='medium' color={theme.colors.gray[700]}>Free</AppText>
              </View>
              <AppText weight='semiBold'>Seu teste grátis terminou</AppText>
            </View>
            <AppText size='sm' color={theme.colors.gray[700]}>
              Você está no Free, com {limit} refeições AI por mês. Assine o Pro para continuar sem limites.
            </AppText>
            {renderQuota()}
          </>
        );

      case 'ACTIVE':
        return (
          <>
            <View style={styles.headerRow}>
              <View style={styles.badgePro}>
                <AppText size='xs' weight='medium' color={theme.colors.lime[800]}>Pro</AppText>
              </View>
              <AppText weight='semiBold'>{currentPlanName ?? 'Pro'}</AppText>
            </View>
            <View style={styles.infoRow}>
              <AppText size='sm' color={theme.colors.gray[700]}>Próxima cobrança</AppText>
              <AppText size='sm' weight='medium'>{formatShortDate(subscription?.paidUntil)}</AppText>
            </View>
            <View style={styles.infoRow}>
              <AppText size='sm' color={theme.colors.gray[700]}>Valor</AppText>
              <AppText size='sm' weight='medium'>
                {currentPlanPrice !== null ? formatPrice(currentPlanPrice) : '—'}
                {currentPlanPrice !== null ? cycleSuffix : ''}
              </AppText>
            </View>
          </>
        );

      case 'GRACE':
        return (
          <>
            <View style={styles.headerRow}>
              <View style={styles.badgePro}>
                <AppText size='xs' weight='medium' color={theme.colors.lime[800]}>Pro</AppText>
              </View>
              <AppText weight='semiBold'>Acesso Pro até {formatShortDate(subscription?.paidUntil)}</AppText>
            </View>
            <AppText size='sm' color={theme.colors.gray[700]}>
              Sua assinatura foi cancelada. Reassine para manter o acesso depois dessa data.
            </AppText>
          </>
        );

      case 'PAST_DUE':
        return (
          <>
            <View style={styles.headerRow}>
              <View style={styles.badgeWarning}>
                <AppText size='xs' weight='medium' color={theme.colors.support.red}>Pendente</AppText>
              </View>
              <AppText weight='semiBold'>Pagamento pendente</AppText>
            </View>
            <AppText size='sm' color={theme.colors.gray[700]}>
              Há um pagamento aguardando aprovação. Regularize para manter o Pro sem interrupções.
            </AppText>
          </>
        );

      case 'EXPIRED':
        return (
          <>
            <View style={styles.headerRow}>
              <View style={styles.badgeFree}>
                <AppText size='xs' weight='medium' color={theme.colors.gray[700]}>Free</AppText>
              </View>
              <AppText weight='semiBold'>
                {subscription?.paidUntil ? 'Seu acesso Pro terminou' : 'Seu plano voltou ao Free'}
              </AppText>
            </View>
            <AppText size='sm' color={theme.colors.gray[700]}>
              Agora você está no Free, com {limit} refeições AI por mês. Assine o Pro quando quiser.
            </AppText>
            {renderQuota()}
          </>
        );
    }
  }

  return (
    <View style={styles.card}>
      {renderContent()}
    </View>
  );
}
