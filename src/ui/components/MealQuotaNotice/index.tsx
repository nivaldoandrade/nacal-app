import { useAccount } from '@/app/hooks/queries/useAccount';
import { AppStackNavigatorProps } from '@/app/navigation/AppStack';
import { AppText } from '@/ui/components/AppText';
import { theme } from '@/ui/styles/theme';
import { useNavigation } from '@react-navigation/native';
import { Pressable } from 'react-native';

type MealQuotaNoticeVariant = 'light' | 'dark';

const COLORS = {
  light: {
    exhausted: theme.colors.lime[700],
    normal: theme.colors.gray[700],
  },
  dark: {
    exhausted: theme.colors.lime[500],
    normal: theme.colors.gray[500],
  },
} as const;

interface IMealQuotaNoticeProps {
  variant?: MealQuotaNoticeVariant;
}

const PRO_DAILY_NOTICE_THRESHOLD = 5;

export function MealQuotaNotice({ variant = 'light' }: IMealQuotaNoticeProps) {
  const { isPro, mealQuota, dailyMealQuota } = useAccount();
  const { navigate } = useNavigation<AppStackNavigatorProps>();

  if (isPro) {
    return <ProDailyNotice variant={variant} remaining={dailyMealQuota?.remaining ?? null} />;
  }

  const limit = mealQuota?.limit ?? null;
  const remaining = mealQuota?.remaining ?? null;

  if (limit === null || remaining === null) {
    return null;
  }

  const isExhausted = remaining <= 0;

  const linkColor = COLORS[variant][isExhausted ? 'exhausted' : 'normal'];

  return (
    <Pressable
      accessibilityRole='link'
      onPress={() => navigate('Plans')}
      style={({ pressed }) => [{ alignSelf: 'stretch' }, pressed && { opacity: 0.7 }]}
    >
      {isExhausted && (
        <AppText size='xs' color={theme.colors.support.red} style={{ textAlign: 'center' }}>
          Limite do Free atingido este mês.{' '}
          <AppText
            size='xs'
            weight='medium'
            color={linkColor}
            style={{ textDecorationLine: 'underline' }}
          >
            Ver planos Pro
          </AppText>
        </AppText>
      )}

      {!isExhausted && (
        <AppText
          size='xs'
          weight='medium'
          color={linkColor}
          style={{ textAlign: 'center', textDecorationLine: 'underline' }}
        >
          {`Restam ${remaining} de ${limit} refeições este mês`}
        </AppText>
      )}
    </Pressable>
  );
}

interface IProDailyNoticeProps {
  variant: MealQuotaNoticeVariant;
  remaining: number | null;
}

function ProDailyNotice({ variant, remaining }: IProDailyNoticeProps) {
  if (remaining === null || remaining > PRO_DAILY_NOTICE_THRESHOLD) {
    return null;
  }

  if (remaining <= 0) {
    return (
      <AppText size='xs' color={theme.colors.support.red} style={{ textAlign: 'center' }}>
        Você chegou ao limite de hoje. Amanhã tem mais!
      </AppText>
    );
  }

  return (
    <AppText size='xs' weight='medium' color={COLORS[variant].normal} style={{ textAlign: 'center' }}>
      {remaining === 1 ? 'Resta 1 refeição hoje' : `Restam ${remaining} refeições hoje`}
    </AppText>
  );
}
