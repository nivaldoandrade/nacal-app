import { useAccount } from '@/app/hooks/queries/useAccount';
import { YearlyExpiryNoticeStorage } from '@/app/libs/YearlyExpiryNoticeStorage';
import { AppStackNavigatorProps } from '@/app/navigation/AppStack';
import { AppText } from '@/ui/components/AppText';
import { styles } from '@/ui/components/YearlyExpiryNotice/styles';
import { theme } from '@/ui/styles/theme';
import { formatShortDate } from '@/ui/utils/formatShortDate';
import {
  formatYearlyExpiryCountdown,
  getYearlyExpiry,
  YEARLY_EXPIRED_NOTICE_DAYS,
} from '@/ui/utils/getYearlyExpiry';
import { useNavigation } from '@react-navigation/native';
import { XIcon } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

export function YearlyExpiryNotice() {
  const { subscription } = useAccount();
  const { navigate } = useNavigation<AppStackNavigatorProps>();
  const [dismissedKey, setDismissedKey] = useState<string | null>(null);

  const expiry = getYearlyExpiry(subscription, new Date());
  const isExpired = expiry?.state === 'EXPIRED';
  const expiredKey = isExpired ? expiry.paidUntil.toISOString() : null;

  useEffect(() => {
    if (!expiredKey) {
      return;
    }

    let isActive = true;

    YearlyExpiryNoticeStorage.isDismissed(new Date(expiredKey)).then((isDismissed) => {
      if (isActive && isDismissed) {
        setDismissedKey(expiredKey);
      }
    });

    return () => {
      isActive = false;
    };
  }, [expiredKey]);

  if (!expiry) {
    return null;
  }

  if (isExpired && (expiry.daysOverdue > YEARLY_EXPIRED_NOTICE_DAYS || dismissedKey === expiredKey)) {
    return null;
  }

  function handleDismiss() {
    if (!expiry) {
      return;
    }

    setDismissedKey(expiry.paidUntil.toISOString());
    YearlyExpiryNoticeStorage.dismiss(expiry.paidUntil);
  }

  const message = isExpired
    ? `Seu Pro Anual venceu em ${formatShortDate(expiry.paidUntil)}.`
    : `Seu Pro Anual ${formatYearlyExpiryCountdown(expiry.daysLeft)}.`;

  return (
    <View style={[styles.container, expiry.isUrgent && styles.urgent]}>
      <Pressable
        accessibilityRole='link'
        onPress={() => navigate('Plans')}
        style={({ pressed }) => [styles.link, pressed && { opacity: 0.7 }]}
      >
        <AppText size='sm' color={theme.colors.black[700]} style={styles.message}>
          {message}
        </AppText>
        <AppText
          size='sm'
          weight='medium'
          color={theme.colors.lime[700]}
          style={{ textDecorationLine: 'underline' }}
        >
          Renovar
        </AppText>
      </Pressable>
      {isExpired && (
        <Pressable
          accessibilityRole='button'
          accessibilityLabel='Dispensar aviso'
          hitSlop={8}
          onPress={handleDismiss}
          style={({ pressed }) => [styles.dismiss, pressed && { opacity: 0.7 }]}
        >
          <XIcon size={16} color={theme.colors.gray[700]} />
        </Pressable>
      )}
    </View>
  );
}
