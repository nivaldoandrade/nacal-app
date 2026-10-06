import { AppText } from '@/ui/components/AppText';
import { styles } from '@/ui/screens/plans/components/PlanComparison/styles';
import { theme } from '@/ui/styles/theme';
import { CheckIcon } from 'lucide-react-native';
import { View } from 'react-native';

interface IPlanComparisonProps {
  freeFeature: string;
  proFeatures: string[];
  trialDays: number | null;
}

export function PlanComparison({ freeFeature, proFeatures, trialDays }: IPlanComparisonProps) {
  return (
    <View style={styles.row}>
      <View style={[styles.card, styles.freeCard]}>
        <AppText weight='semiBold'>Free</AppText>
        <View style={styles.features}>
          <View style={styles.featureRow}>
            <CheckIcon size={16} color={theme.colors.gray[600]} />
            <AppText size='sm' color={theme.colors.gray[700]} style={styles.featureText}>
              {freeFeature}
            </AppText>
          </View>
        </View>
      </View>
      <View style={[styles.card, styles.proCard]}>
        <View style={styles.proHeader}>
          <AppText weight='semiBold'>Pro</AppText>
          {trialDays !== null && (
            <View style={styles.pill}>
              <AppText size='xs' weight='medium' color={theme.colors.lime[800]}>
                {trialDays} dias grátis
              </AppText>
            </View>
          )}
        </View>
        <View style={styles.features}>
          {proFeatures.map((feature) => (
            <View key={feature} style={styles.featureRow}>
              <CheckIcon size={16} color={theme.colors.lime[700]} />
              <AppText size='sm' color={theme.colors.black[700]} style={styles.featureText}>
                {feature}
              </AppText>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
