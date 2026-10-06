import { AppText } from '@/ui/components/AppText';
import { ButtonApp } from '@/ui/components/Button';
import { HeaderApp } from '@/ui/components/HeaderApp';
import { CycleTiles } from '@/ui/screens/plans/components/CycleTiles';
import { PlanComparison } from '@/ui/screens/plans/components/PlanComparison';
import { StatusCard } from '@/ui/screens/plans/components/StatusCard';
import { styles } from '@/ui/screens/plans/styles';
import { usePlansScreen } from '@/ui/screens/plans/usePlansScreen';
import { theme } from '@/ui/styles/theme';
import { formatShortDate } from '@/ui/utils/formatShortDate';
import { ReactNode } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';

export function Plans() {
  const {
    top,
    bottom,
    plans,
    isLoading,
    isError,
    refetchPlans,
    status,
    subscription,
    mealQuota,
    trialDaysLeft,
    currentPlan,
    selectedPlanId,
    setSelectedPlanId,
    canStartTrial,
    showCycleSelector,
    showConfirmPanel,
    showCancelAction,
    showCancelConfirm,
    setShowCancelConfirm,
    isConfirming,
    isStartingTrial,
    isCreatingCheckout,
    isCanceling,
    checkoutLabel,
    handleStartTrial,
    handleCheckout,
    handleDismissConfirm,
    handleCancel,
    runPaymentConfirmation,
  } = usePlansScreen();

  const limit = mealQuota?.limit ?? 20;
  const monthlyPlan = plans.find((plan) => plan.cycle === 'MONTHLY');
  const proFeatures = monthlyPlan?.features ?? plans[0]?.features ?? [];
  const trialDays = monthlyPlan?.trialDays ?? null;

  let body: ReactNode;

  if (isLoading) {
    body = (
      <View style={styles.centerBlock}>
        <ActivityIndicator color={theme.colors.gray[700]} />
      </View>
    );
  } else if (isError) {
    body = (
      <View style={styles.centerBlock}>
        <AppText color={theme.colors.gray[700]}>Não foi possível carregar os planos.</AppText>
        <ButtonApp intent='secondary' onPress={() => refetchPlans()}>
          Tentar novamente
        </ButtonApp>
      </View>
    );
  } else {
    body = (
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: bottom + 32 }]}>
        <StatusCard
          status={status}
          subscription={subscription}
          quota={mealQuota}
          currentPlanName={currentPlan?.name ?? null}
          currentPlanPrice={currentPlan?.price ?? null}
          trialDaysLeft={trialDaysLeft}
        />

        {showConfirmPanel ? (
          <View style={styles.focusCard}>
            <AppText weight='semiBold'>
              {isConfirming ? 'Confirmando pagamento…' : 'Pagamento em processamento'}
            </AppText>
            <AppText size='sm' color={theme.colors.gray[700]}>
              {isConfirming
                ? 'Só um instante: estamos verificando a aprovação com o meio de pagamento.'
                : 'Assim que o pagamento for aprovado, seu Pro é ativado automaticamente.'}
            </AppText>
            <ButtonApp onPress={() => runPaymentConfirmation()} isLoading={isConfirming}>
              Já paguei
            </ButtonApp>
            {!isConfirming && (
              <ButtonApp intent='ghost' onPress={handleDismissConfirm}>
                <AppText weight='medium' color={theme.colors.gray[700]}>
                  Fazer novo checkout
                </AppText>
              </ButtonApp>
            )}
          </View>
        ) : showCancelConfirm && subscription ? (
          <View style={styles.focusCard}>
            <AppText weight='semiBold'>
              Cancelar {subscription.status === 'TRIALING' ? 'o trial' : 'a assinatura'}?
            </AppText>
            <AppText size='sm' color={theme.colors.gray[700]}>
              {subscription.status === 'TRIALING'
                ? `Seu plano volta ao Free agora, com ${limit} refeições AI por mês.`
                : `Você mantém o acesso Pro até ${formatShortDate(subscription.paidUntil)}.`}
            </AppText>
            <View style={styles.cancelActions}>
              <ButtonApp
                intent='secondary'
                style={{ flex: 1 }}
                onPress={() => setShowCancelConfirm(false)}
                disabled={isCanceling}
              >
                Manter
              </ButtonApp>
              <ButtonApp
                intent='ghost'
                style={{ flex: 1 }}
                onPress={handleCancel}
                isLoading={isCanceling}
              >
                <AppText weight='medium' color={theme.colors.support.red}>
                  Sim, cancelar
                </AppText>
              </ButtonApp>
            </View>
          </View>
        ) : (
          <>
            {showCycleSelector && (
              <View style={styles.block}>
                <AppText weight='semiBold' size='lg'>Escolha seu ciclo</AppText>
                <CycleTiles
                  plans={plans}
                  selectedPlanId={selectedPlanId}
                  onSelect={setSelectedPlanId}
                />
              </View>
            )}

            <View style={styles.block}>
              <AppText weight='semiBold' size='lg'>Compare os planos</AppText>
              <PlanComparison
                freeFeature={`${limit} refeições AI por mês`}
                proFeatures={proFeatures}
                trialDays={trialDays}
              />
            </View>

            <View style={styles.ctaBlock}>
              {canStartTrial && (
                <ButtonApp
                  style={styles.fullWidth}
                  onPress={handleStartTrial}
                  isLoading={isStartingTrial}
                >
                  Começar 7 dias grátis
                </ButtonApp>
              )}

              {status !== 'ACTIVE' && (
                <ButtonApp
                  intent={canStartTrial ? 'secondary' : 'primary'}
                  style={styles.fullWidth}
                  onPress={handleCheckout}
                  isLoading={isCreatingCheckout}
                >
                  {checkoutLabel}
                </ButtonApp>
              )}

              {showCancelAction && (
                <ButtonApp
                  intent='ghost'
                  style={styles.fullWidth}
                  onPress={() => setShowCancelConfirm(true)}
                >
                  <AppText weight='medium' color={theme.colors.support.red}>
                    {status === 'TRIAL' ? 'Cancelar trial' : 'Cancelar assinatura'}
                  </AppText>
                </ButtonApp>
              )}

              {canStartTrial && (
                <AppText
                  size='sm'
                  color={theme.colors.gray[700]}
                  style={styles.hint}
                >
                  7 dias grátis, sem cartão. Depois disso, volte a qualquer momento para o Free.
                </AppText>
              )}
            </View>
          </>
        )}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <HeaderApp title='Planos' />
      {body}
    </View>
  );
}
