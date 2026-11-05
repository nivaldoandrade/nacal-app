import { useAccount } from '@/app/hooks/queries/useAccount';
import { AppText } from '@/ui/components/AppText';
import { styles } from '@/ui/screens/home/components/CompactHeader/styles';
import { useHomeContext } from '@/ui/screens/home/context/useHomeContext';
import { useDaySummary } from '@/ui/screens/home/useDaySummary';
import { formatDateLabel } from '@/ui/screens/home/utils/formatDateLabel';
import { theme } from '@/ui/styles/theme';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const FADE_DISTANCE = 24;

interface ICompactHeaderProps {
  scrollY: SharedValue<number>;
  threshold: number;
  onPress: () => void;
}

export function CompactHeader({ scrollY, threshold, onPress }: ICompactHeaderProps) {
  const { selectedDate, isLoading } = useHomeContext();
  const { account } = useAccount();
  const summary = useDaySummary();
  const [height, setHeight] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const showAt = threshold - height;
  const isReady = threshold > 0 && height > 0;

  const goalCalories = account!.goal.calories;
  const progress = goalCalories > 0 ? Math.min(summary.calories / goalCalories, 1) : 0;

  useAnimatedReaction(
    () => isReady && scrollY.value >= showAt - FADE_DISTANCE / 2,
    (visible, previous) => {
      if (visible !== previous) {
        scheduleOnRN(setIsVisible, visible);
      }
    },
    [isReady, showAt],
  );

  const animatedStyle = useAnimatedStyle(() => {
    if (!isReady) {
      return { opacity: 0, transform: [{ translateY: -height }] };
    }

    return {
      opacity: interpolate(
        scrollY.value,
        [showAt - FADE_DISTANCE, showAt],
        [0, 1],
        Extrapolation.CLAMP,
      ),
      transform: [{
        translateY: interpolate(
          scrollY.value,
          [showAt - FADE_DISTANCE, showAt],
          [-height, 0],
          Extrapolation.CLAMP,
        ),
      }],
    };
  }, [isReady, showAt, height]);

  return (
    <Animated.View
      pointerEvents={isVisible ? 'auto' : 'none'}
      style={[styles.container, animatedStyle]}
      onLayout={event => setHeight(event.nativeEvent.layout.height)}
    >
      <Pressable
        accessibilityRole='button'
        accessibilityLabel='Voltar ao topo'
        onPress={onPress}
        style={[styles.content, { opacity: isLoading ? 0.4 : 1 }]}
      >
        <View style={styles.row}>
          <AppText
            size='sm'
            weight='medium'
            numberOfLines={1}
            color={theme.colors.gray[700]}
            style={styles.dateLabel}
          >
            {formatDateLabel(selectedDate)}
          </AppText>
          <AppText size='sm' color={theme.colors.gray[700]}>
            <AppText size='sm' weight='semiBold' color={theme.colors.support.tomato}>
              {summary.calories}
            </AppText>
            {` / ${goalCalories} kcal`}
          </AppText>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress * 100}%` }]} />
        </View>
      </Pressable>
    </Animated.View>
  );
}
