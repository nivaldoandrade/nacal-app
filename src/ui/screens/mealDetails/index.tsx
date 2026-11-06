import { useGetMealById } from '@/app/hooks/queries/useGetMealById';
import { AppStackScreenRouteProps } from '@/app/navigation/AppStack';
import { Food } from '@/app/types/Food';
import { isUnidentifiedKind, UnidentifiedKind } from '@/app/types/Meal';
import { AppText } from '@/ui/components/AppText';
import { ButtonApp } from '@/ui/components/Button';
import { Skeleton } from '@/ui/components/Skeleton';
import { AddItemModal } from '@/ui/screens/mealDetails/components/AddItemModal';
import { Header } from '@/ui/screens/mealDetails/components/Header';
import { Macros } from '@/ui/screens/mealDetails/components/Macros';
import { UnidentifiedHint } from '@/ui/screens/mealDetails/components/UnidentifiedHint';
import { styles } from '@/ui/screens/mealDetails/styles';
import { theme } from '@/ui/styles/theme';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { PlusIcon } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, ListRenderItemInfo, Platform, View } from 'react-native';
import { useSafeAreaInsets } from '@/ui/hooks/useSafeAreaInsets';

export function MealDetails({ route }: AppStackScreenRouteProps<'MealDetails'>) {
  const { mealId } = route.params;
  const { meal, isLoading } = useGetMealById(mealId);
  const [isAddItemModalVisible, setIsAddItemModalVisible] = useState(false);
  const [addItemHint, setAddItemHint] = useState<UnidentifiedKind | null>(null);

  const { bottom } = useSafeAreaInsets();

  const summary = useMemo(() => {
    if (!meal?.foods || meal.foods.length === 0) {
      return {
        calories: 0,
        macros: [
          { label: 'Carboidratos' as const, quantity: 0, percentage: 0 },
          { label: 'Proteínas' as const, quantity: 0, percentage: 0 },
          { label: 'Gorduras' as const, quantity: 0, percentage: 0 },
        ],
      };
    }

    const result = meal.foods.reduce((acc, food) => {
      acc.calories += food.calories;
      acc.carbs += food.carbohydrates;
      acc.proteins += food.proteins;
      acc.fats += food.fats;
      return acc;
    }, { calories: 0, carbs: 0, proteins: 0, fats: 0 });

    const totalCaloriesFromMacros =
      result.carbs * 4 + result.proteins * 4 + result.fats * 9;

    const round = (value: number) => parseFloat(value.toFixed(1));

    const carbsPct = totalCaloriesFromMacros === 0
      ? 0
      : round((result.carbs * 4 / totalCaloriesFromMacros) * 100);
    const proteinsPct = totalCaloriesFromMacros === 0
      ? 0
      : round((result.proteins * 4 / totalCaloriesFromMacros) * 100);
    const fatsPct = totalCaloriesFromMacros === 0
      ? 0
      : round(100 - carbsPct - proteinsPct);

    return {
      calories: Math.round(result.calories),
      macros: [
        { label: 'Carboidratos' as const, quantity: round(result.carbs), percentage: carbsPct },
        { label: 'Proteínas' as const, quantity: round(result.proteins), percentage: proteinsPct },
        { label: 'Gorduras' as const, quantity: round(result.fats), percentage: fatsPct },
      ],
    };
  }, [meal]);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'web') {
        return;
      }
      SystemUI.setBackgroundColorAsync(theme.colors.black[800]);
    }, []),
  );

  const foodKeyExtractor = useCallback(
    (item: Food, index: number) => `${item.name}-${item.quantity}-${index}`,
    [],
  );

  const renderFoodItem = useCallback(
    ({ item }: ListRenderItemInfo<Food>) => (
      <View style={styles.foodContainer}>
        <AppText>{item.quantity}</AppText>
        <AppText style={{ textTransform: 'capitalize' }}>
          {item.name}
        </AppText>
      </View>
    ),
    [],
  );

  const renderListEmpty = useCallback(
    () => (
      !isLoading
        ? null
        : (
          <>
            <View style={styles.foodContainer}>
              <Skeleton width='100%' height={60} colorMode='light' />
            </View>
            <View style={styles.foodContainer}>
              <Skeleton width='100%' height={60} colorMode='light' />
            </View>
            <View style={styles.foodContainer}>
              <Skeleton width='100%' height={60} colorMode='light' />
            </View>
          </>
        )
    ),
    [isLoading],
  );

  const openAddItemModal = useCallback((hint: UnidentifiedKind | null) => {
    setAddItemHint(hint);
    setIsAddItemModalVisible(true);
  }, []);

  const canAddItems = meal?.canAddItems ?? false;
  const rawUnidentified = meal?.unidentified;
  const unidentified = isUnidentifiedKind(rawUnidentified) ? rawUnidentified : null;

  const renderListFooter = useCallback(
    () => {
      if (!canAddItems) {
        return null;
      }

      return (
        <View style={styles.listFooter}>
          {unidentified
            ? (
              <UnidentifiedHint
                kind={unidentified}
                onAddItem={() => openAddItemModal(unidentified)}
              />
            )
            : (
              <ButtonApp
                intent='neutral'
                leftIcon={<PlusIcon size={18} color={theme.colors.black[700]} />}
                onPress={() => openAddItemModal(null)}
              >
                Adicionar item
              </ButtonApp>
            )}
        </View>
      );
    },
    [canAddItems, unidentified, openAddItemModal],
  );

  return (
    <>
      <StatusBar animated style='light' />
      <View style={[styles.container]}>
        <Header totalCalories={summary.calories} isLoading={isLoading} />
        <Macros macros={summary.macros} isLoading={isLoading} />
        <View style={styles.divider} />
        <View style={styles.listHeader}>
          <Skeleton width="50%" height={32} show={isLoading}>
            <AppText color={theme.colors.black[700]} weight='semiBold' size='2xl'>
              {meal?.name}
            </AppText>
          </Skeleton>
          <AppText color={theme.colors.gray[700]} weight='medium' >
            Itens
          </AppText>
        </View>
        <FlatList
          data={meal?.foods ?? []}
          keyExtractor={foodKeyExtractor}
          contentContainerStyle={{
            paddingBottom: bottom,
          }}
          ListEmptyComponent={renderListEmpty}
          ListFooterComponent={renderListFooter}
          renderItem={renderFoodItem}
        />
      </View>
      <AddItemModal
        mealId={mealId}
        hint={addItemHint}
        visible={isAddItemModalVisible}
        onClose={() => setIsAddItemModalVisible(false)}
      />
    </>
  );
}
