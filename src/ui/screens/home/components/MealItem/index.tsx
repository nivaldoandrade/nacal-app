import { AppStackNavigatorProps } from '@/app/navigation/AppStack';
import { Meal } from '@/app/types/Meal';
import { AppText } from '@/ui/components/AppText';
import { styles } from '@/ui/screens/home/components/MealItem/styles';
import { useHomeContext } from '@/ui/screens/home/context/useHomeContext';
import { theme } from '@/ui/styles/theme';
import { useNavigation } from '@react-navigation/native';
import { useMemo } from 'react';
import { Platform, Pressable, View } from 'react-native';

interface IMealItemProps {
  meal: Meal
}

export function MealItem({ meal }: IMealItemProps) {

  const { navigate } = useNavigation<AppStackNavigatorProps>();

  const { isLoading } = useHomeContext();

  const formattedNameFoods = useMemo(() => {
    return meal.foods.map(food => food.name).join(', ');
  }, [meal.foods]);

  const summaryMacros = useMemo(() => {
    const result = meal.foods.reduce((acc, item) => {
      acc.calories += item.calories;
      acc.proteins = acc.proteins + item.proteins;
      acc.carbohydrates += item.carbohydrates;
      acc.fats += item.fats;

      return acc;
    },
      {
        calories: 0,
        proteins: 0,
        carbohydrates: 0,
        fats: 0,
      },
    );

    return {
      calories: Math.round(result.calories),
      proteins: parseFloat(result.proteins.toFixed(1)),
      carbohydrates: parseFloat(result.carbohydrates.toFixed(1)),
      fats: parseFloat(result.fats.toFixed(1)),
    };
  }, [meal.foods]);

  return (
    <View style={[styles.container, { opacity: isLoading ? 0.4 : 1 }]}>
      <AppText color={theme.colors.gray[700]} style={{ opacity: 0.8 }}>
        {formatTime(meal.createdAt, meal.timeZone)}
      </AppText>
      <View style={styles.mealItem}>
        <Pressable
          onPress={() => navigate('MealDetails', { mealId: meal.id })}
          android_ripple={{ color: 'rgba(0, 0, 0, 0.2)' }}
          disabled={isLoading}
          style={({ pressed }) => [
            styles.buttonContainer,
            pressed && {
              ...Platform.select({
                ios: { opacity: 0.7 },
                web: { opacity: 0.4 },
                default: null,
              }),
            },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.icon}>
              <AppText>{meal.icon}</AppText>
            </View>
            <View style={styles.info}>
              <AppText
                color={theme.colors.gray[700]}
                size='sm'
                numberOfLines={1}
              >
                {meal.name}
              </AppText>
              <AppText weight='medium' numberOfLines={1} >
                {formattedNameFoods}
              </AppText>
            </View>
          </View>
          <View style={styles.macrosContainer}>
            <View style={styles.macrosRow}>
              <View style={styles.macroItem}>
                <MacroValue color={theme.colors.support.tomato}>
                  {summaryMacros.calories}
                </MacroValue>
                <MacroLabel>Kcal</MacroLabel>
              </View>
              <View style={styles.macroItem}>
                <MacroValue color={theme.colors.support.teal}>
                  {summaryMacros.proteins}g
                </MacroValue>
                <MacroLabel>Proteínas</MacroLabel>
              </View>
            </View>
            <View style={styles.macrosRow}>
              <View style={styles.macroItem}>
                <MacroValue color={theme.colors.support.yellow}>
                  {summaryMacros.carbohydrates}g
                </MacroValue>
                <MacroLabel>Carboidratos</MacroLabel>
              </View>
              <View style={styles.macroItem}>
                <MacroValue color={theme.colors.support.orange}>
                  {summaryMacros.fats}g
                </MacroValue>
                <MacroLabel>Gorduras</MacroLabel>
              </View>
            </View>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

interface IMacroValueProps {
  children: React.ReactNode;
  color: string;
}

function MacroValue({ color, children }: IMacroValueProps) {

  return (
    <AppText color={color} weight='medium'>{children}</AppText>
  );
}

function MacroLabel({ children }: { children: React.ReactNode }) {

  return (
    <AppText color={theme.colors.gray[700]} style={{ opacity: 0.8 }}>
      {children}
    </AppText>
  );
}

function formatTime(dateString: string, timeZone?: string) {
  const date = new Date(dateString);

  if (timeZone) {
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
      }).formatToParts(date);

      const hours = parts.find(part => part.type === 'hour')?.value;
      const minutes = parts.find(part => part.type === 'minute')?.value;

      if (hours && minutes) {
        return `${hours}h${minutes}`;
      }
    } catch {
      return formatDeviceTime(date);
    }
  }

  return formatDeviceTime(date);
}

function formatDeviceTime(date: Date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}h${minutes}`;
}

