import { AppText } from '@/ui/components/AppText';
import { YearlyExpiryNotice } from '@/ui/components/YearlyExpiryNotice';
import { CurrentGoal } from '@/ui/screens/home/components/CurrentGoal';
import { styles } from '@/ui/screens/home/components/Header/styles';
import { WeekCalendar } from '@/ui/screens/home/components/WeekCalendar';
import { useHomeContext } from '@/ui/screens/home/context/useHomeContext';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

interface IHeaderProps {
  onSummaryEndLayout?: (y: number) => void;
}

export function Header({ onSummaryEndLayout }: IHeaderProps) {
  const { isLoading } = useHomeContext();
  const [containerY, setContainerY] = useState(0);
  const [dividerY, setDividerY] = useState(0);

  useEffect(() => {
    if (dividerY > 0) {
      onSummaryEndLayout?.(containerY + dividerY);
    }
  }, [containerY, dividerY, onSummaryEndLayout]);

  return (
    <View>
      <View
        style={styles.container}
        onLayout={event => setContainerY(event.nativeEvent.layout.y)}
      >
        <View style={[styles.content, { opacity: isLoading ? 0.4 : 1 }]}>
          <YearlyExpiryNotice />
          <WeekCalendar />
          <CurrentGoal />
        </View>
        <View
          style={styles.divider}
          onLayout={event => setDividerY(event.nativeEvent.layout.y)}
        />
        <AppText
          weight='medium'
          style={{ letterSpacing: 1.28, padding: 20, paddingBottom: 16 }}
        >
          REFEIÇÕES
        </AppText>
      </View>

    </View>
  );
}
