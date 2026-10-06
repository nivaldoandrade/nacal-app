import { AppText } from '@/ui/components/AppText';
import { styles } from '@/ui/screens/plans/components/CycleTiles/styles';
import { BillingService } from '@/app/services/BillingService';
import { PlanId } from '@/app/types/Subscription';
import { theme } from '@/ui/styles/theme';
import { formatPrice } from '@/ui/utils/formatPrice';
import { TouchableOpacity, View } from 'react-native';

interface ICycleTilesProps {
  plans: BillingService.Plan[];
  selectedPlanId: PlanId;
  onSelect: (planId: PlanId) => void;
}

export function CycleTiles({ plans, selectedPlanId, onSelect }: ICycleTilesProps) {
  const monthly = plans.find((plan) => plan.cycle === 'MONTHLY');
  const yearly = plans.find((plan) => plan.cycle === 'YEARLY');

  const discountPercent =
    monthly && yearly
      ? Math.round((1 - yearly.price / (monthly.price * 12)) * 100)
      : null;

  const yearlyMonthlyEquivalent = yearly ? yearly.price / 12 : null;

  return (
    <View style={styles.container}>
      {plans.map((plan) => {
        const isSelected = plan.id === selectedPlanId;
        const isYearly = plan.cycle === 'YEARLY';

        return (
          <TouchableOpacity
            key={plan.id}
            style={[styles.tile, isSelected && styles.tileSelected]}
            activeOpacity={0.8}
            onPress={() => onSelect(plan.id)}
          >
            <View style={styles.tileHeader}>
              <View style={[styles.radio, isSelected && styles.radioSelected]}>
                {isSelected && <View style={styles.radioDot} />}
              </View>
              <AppText weight='semiBold'>
                {isYearly ? 'Anual' : 'Mensal'}
              </AppText>
              {isYearly && discountPercent !== null && (
                <View style={styles.discountBadge}>
                  <AppText size='xs' weight='medium' color={theme.colors.lime[800]}>
                    {discountPercent}% de desconto
                  </AppText>
                </View>
              )}
            </View>
            <View style={styles.priceRow}>
              <AppText weight='semiBold' size='lg'>{formatPrice(plan.price)}</AppText>
              <AppText size='sm' color={theme.colors.gray[700]}>
                /{isYearly ? 'ano' : 'mês'}
              </AppText>
            </View>
            {isYearly && yearlyMonthlyEquivalent !== null && (
              <AppText size='xs' color={theme.colors.gray[700]}>
                Equivalente a {formatPrice(Math.round(yearlyMonthlyEquivalent))}/mês
              </AppText>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
