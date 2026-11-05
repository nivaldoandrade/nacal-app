import { useAccount } from '@/app/hooks/queries/useAccount';
import { AppText } from '@/ui/components/AppText';
import { ButtonApp } from '@/ui/components/Button';
import { MacroRainbow } from '@/ui/components/MacroRainbow';
import { styles } from '@/ui/screens/home/components/CurrentGoal/styles';
import { useHomeContext } from '@/ui/screens/home/context/useHomeContext';
import { useDaySummary } from '@/ui/screens/home/useDaySummary';
import { formatDateLabel } from '@/ui/screens/home/utils/formatDateLabel';
import { theme } from '@/ui/styles/theme';
import { isSameDate } from '@/ui/utils/isSameDate';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react-native';
import { View } from 'react-native';

export function CurrentGoal() {
  const { isLoading, selectedDate, onNextDate, onPrevDate } = useHomeContext();

  const isFutureDate = isSameDate(selectedDate, new Date());

  const { account } = useAccount();

  const summary = useDaySummary();

  return (
    <View style={styles.container}>
      <View style={styles.datePicker}>
        <ButtonApp
          size='icon'
          intent='ghost'
          disabled={isLoading}
          onPress={onPrevDate}
        >
          <ChevronLeftIcon />
        </ButtonApp>
        <AppText
          color={theme.colors.gray[700]}
          weight='medium'
          style={{ letterSpacing: 1.28, textAlign: 'center' }}
        >
          {formatDateLabel(selectedDate)}
        </AppText>
        <ButtonApp
          size='icon'
          intent='ghost'
          disabled={isLoading || isFutureDate}
          onPress={onNextDate}
        >
          <ChevronRightIcon />
        </ButtonApp>
      </View>
      <View style={{ paddingHorizontal: 25 }}>
        <MacroRainbow
          mode='progress'
          calories={{ current: summary.calories, goal: account!.goal.calories }}
          protein={{ current: summary.proteins, goal: account!.goal.proteins }}
          carbs={{ current: summary.carbohydrates, goal: account!.goal.carbohydrates }}
          fat={{ current: summary.fats, goal: account!.goal.fats }}
          colorText={theme.colors.gray[700]}
        />
      </View>
    </View>
  );
}

