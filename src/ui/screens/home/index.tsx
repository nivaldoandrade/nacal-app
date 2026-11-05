import { Meal } from '@/app/types/Meal';
import { CreateMealModals } from '@/ui/components/CreateMealModals';
import { InstallAppSheet } from '@/ui/components/InstallAppSheet';
import { IInstallAppSheet } from '@/ui/components/InstallAppSheet/IInstallAppSheet';
import { CompactHeader } from '@/ui/screens/home/components/CompactHeader';
import { Fab } from '@/ui/screens/home/components/Fab';
import { Header } from '@/ui/screens/home/components/Header';
import { ItemSeparatorComponent } from '@/ui/screens/home/components/ItemSeparatorComponent';
import { ListEmpty } from '@/ui/screens/home/components/ListEmpty';
import { MealItem } from '@/ui/screens/home/components/MealItem';
import { PlanOfferModal } from '@/ui/screens/home/components/PlanOfferModal';
import { PlanSummaryModal } from '@/ui/screens/home/components/PlanSummaryModal';
import { SplashScreenLoader } from '@/ui/screens/home/components/SplashScreenLoader';
import { UserHeader } from '@/ui/screens/home/components/UserHeader';
import { HomeProvider } from '@/ui/screens/home/context';
import { styles } from '@/ui/screens/home/styles';
import { useFirstRunModals } from '@/ui/screens/home/useFirstRunModals';
import { useHome } from '@/ui/screens/home/useHome';
import { theme } from '@/ui/styles/theme';
import { isSameDate } from '@/ui/utils/isSameDate';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ListRenderItemInfo, Platform, RefreshControl, View } from 'react-native';
import Animated, { useAnimatedRef, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

export function Home() {
  const {
    selectedDate,
    refreshing,
    meals,
    isLoading,
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
  const { showSummary, showOffer, showInstallTip, dismissSummary, dismissOffer } = useFirstRunModals();
  const installSheetRef = useRef<IInstallAppSheet>(null);
  const installTipPresentedRef = useRef(false);
  const listRef = useAnimatedRef<Animated.FlatList<Meal>>();
  const scrollY = useSharedValue(0);
  const [summaryEndY, setSummaryEndY] = useState(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
  });

  const handleScrollToTop = useCallback(() => {
    listRef.current?.scrollToOffset({
      offset: 0,
      animated: true,
    });
  }, [listRef]);

  useEffect(() => {
    if (!showInstallTip || showSplash || !!activeCreateMealModal || installTipPresentedRef.current) {
      return;
    }

    // Pequena pausa para não competir com o fade do splash.
    const timeout = setTimeout(() => {
      installTipPresentedRef.current = true;
      installSheetRef.current?.open();
    }, 800);

    return () => clearTimeout(timeout);
  }, [showInstallTip, showSplash, activeCreateMealModal]);

  useFocusEffect(
    useCallback(() => {
      if (!(Platform.OS === 'web' && !showSplash)) {
        return;
      }
      SystemUI.setBackgroundColorAsync(
        activeCreateMealModal ? theme.colors.black[800] : theme.colors.lime[400],
      );

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
        <UserHeader />
        <View style={styles.listArea}>
          <Animated.FlatList
            ref={listRef}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            data={meals}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                style={styles.refreshControl}
              />
            }
            contentContainerStyle={[styles.flatListContainer, {
              paddingBottom: bottom,
            }]}
            ListEmptyComponent={ListEmpty}
            ListHeaderComponent={<Header onSummaryEndLayout={setSummaryEndY} />}
            ItemSeparatorComponent={ItemSeparatorComponent}
            renderItem={renderItem}
          />
          <CompactHeader
            scrollY={scrollY}
            threshold={summaryEndY}
            onPress={handleScrollToTop}
          />
        </View>
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

      <InstallAppSheet ref={installSheetRef} source='auto' />

      <SplashScreenLoader visible={showSplash} />
    </View>
  );
}
