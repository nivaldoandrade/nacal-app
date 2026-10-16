import { Meal } from '@/app/types/Meal';
import { CreateMealModals } from '@/ui/components/CreateMealModals';
import { Fab } from '@/ui/screens/home/components/Fab';
import { Header } from '@/ui/screens/home/components/Header';
import { ItemSeparatorComponent } from '@/ui/screens/home/components/ItemSeparatorComponent';
import { ListEmpty } from '@/ui/screens/home/components/ListEmpty';
import { MealItem } from '@/ui/screens/home/components/MealItem';
import { PlanOfferModal } from '@/ui/screens/home/components/PlanOfferModal';
import { PlanSummaryModal } from '@/ui/screens/home/components/PlanSummaryModal';
import { SplashScreenLoader } from '@/ui/screens/home/components/SplashScreenLoader';
import { HomeProvider } from '@/ui/screens/home/context';
import { styles } from '@/ui/screens/home/styles';
import { useFirstRunModals } from '@/ui/screens/home/useFirstRunModals';
import { useHome } from '@/ui/screens/home/useHome';
import { theme } from '@/ui/styles/theme';
import { isSameDate } from '@/ui/utils/isSameDate';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useCallback } from 'react';
import { FlatList, ListRenderItemInfo, Platform, RefreshControl, View } from 'react-native';

export function Home() {
  const {
    selectedDate,
    refreshing,
    meals,
    isLoading,
    top,
    bottom,
    handleNextDate,
    handlePrevDate,
    handleRefresh,
    showSplash,
    handleOpenCreateMealModal,
    handleRequestCloseCreateMealModal,
    activeCreateMealModal,
    isCreateMealModalVisible,
    createMealModalAnimationType,
    finalizeCreateMealModalClose,
    handleSelectDate,
  } = useHome();
  const { showSummary, showOffer, dismissSummary, dismissOffer } = useFirstRunModals();

  useFocusEffect(
    useCallback(() => {
      if (!(Platform.OS === 'web' && !showSplash)) {
        return;
      }
      SystemUI.setBackgroundColorAsync(theme.colors.lime[400]);

      if (!!activeCreateMealModal) {
        SystemUI.setBackgroundColorAsync(null);
      }

    }, [activeCreateMealModal, showSplash]),
  );

  const renderItem = useCallback(
    ({ item: meal }: ListRenderItemInfo<Meal>) => <MealItem meal={meal} />,
    [],
  );

  return (
    <View style={[styles.container]}>
      <StatusBar style='dark' />
      <PlanSummaryModal visible={showSummary} onRequestClose={dismissSummary} />
      <PlanOfferModal visible={showOffer} onRequestClose={dismissOffer} />

      <HomeProvider
        meals={meals}
        isLoading={isLoading}
        selectedDate={selectedDate}
        onNextDate={handleNextDate}
        onPrevDate={handlePrevDate}
        onOpenCreateMealModal={handleOpenCreateMealModal}
        onSelectDate={handleSelectDate}
      >
        <FlatList
          data={meals}
          keyExtractor={item => item.id}
          contentInset={Platform.OS === 'web' ? undefined : { top: top }}
          contentOffset={Platform.OS === 'web' ? undefined : { x: 0, y: -top }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              progressViewOffset={top}
            />
          }
          contentContainerStyle={[styles.flatListContainer, {
            paddingBottom: bottom,
          }]}
          ListEmptyComponent={ListEmpty}
          ListHeaderComponent={Header}
          ItemSeparatorComponent={ItemSeparatorComponent}
          renderItem={renderItem}
        />
        {isSameDate(selectedDate, new Date()) && <Fab />}
      </HomeProvider>

      {activeCreateMealModal && (
        <CreateMealModals
          activeCreateMealModal={activeCreateMealModal}
          visible={isCreateMealModalVisible}
          animationType={createMealModalAnimationType}
          onRequestClose={handleRequestCloseCreateMealModal}
          onDismiss={finalizeCreateMealModalClose}
        />
      )}

      <SplashScreenLoader visible={showSplash} />
    </View>
  );
}
