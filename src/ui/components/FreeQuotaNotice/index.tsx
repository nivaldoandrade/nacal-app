import { useAccount } from '@/app/hooks/queries/useAccount';
import { AppStackNavigatorProps } from '@/app/navigation/AppStack';
import { AppText } from '@/ui/components/AppText';
import { theme } from '@/ui/styles/theme';
import { useNavigation } from '@react-navigation/native';
import { Pressable } from 'react-native';

type FreeQuotaNoticeVariant = 'light' | 'dark';

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

interface IFreeQuotaNoticeProps {
  variant?: FreeQuotaNoticeVariant;
}

export function FreeQuotaNotice({ variant = 'light' }: IFreeQuotaNoticeProps) {
  const { isPro, mealQuota } = useAccount();
  const { navigate } = useNavigation<AppStackNavigatorProps>();

  const limit = mealQuota?.limit ?? null;
  const remaining = mealQuota?.remaining ?? null;

  if (isPro || limit === null || remaining === null) {
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
