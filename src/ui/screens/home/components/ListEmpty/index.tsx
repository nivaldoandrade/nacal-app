import { AppText } from '@/ui/components/AppText';
import { ButtonApp } from '@/ui/components/Button';
import { useHomeContext } from '@/ui/screens/home/context/useHomeContext';
import { styles } from '@/ui/screens/home/components/ListEmpty/styles';
import { theme } from '@/ui/styles/theme';
import { isSameDate } from '@/ui/utils/isSameDate';
import { View } from 'react-native';

export function ListEmpty() {
  const { isLoading, selectedDate, onSelectDate } = useHomeContext();

  const isToday = isSameDate(selectedDate, new Date());

  function handleGoToToday() {
    onSelectDate(new Date());
  }

  return (
    <View style={[styles.container, { opacity: isLoading ? 0.4 : 1 }]}>
      <AppText color={theme.colors.gray[700]} style={{ opacity: 0.8, textAlign: 'center' }}>
        Nenhuma refeição por aqui ainda.
      </AppText>
      {!isToday && !isLoading && (
        <ButtonApp
          intent='secondary'
          onPress={handleGoToToday}
          style={{ alignSelf: 'center' }}
        >
          Voltar para hoje
        </ButtonApp>
      )}
    </View>
  );
}
