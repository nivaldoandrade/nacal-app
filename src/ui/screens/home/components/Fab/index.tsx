import { useAccount } from '@/app/hooks/queries/useAccount';
import { AppText } from '@/ui/components/AppText';
import { ButtonApp } from '@/ui/components/Button';
import type { CreateMealModalType } from '@/ui/components/CreateMealModals';
import { CreateMealOptions } from '@/ui/components/CreateMealOptions';
import { FreeQuotaNotice } from '@/ui/components/FreeQuotaNotice';
import { styles } from '@/ui/screens/home/components/Fab/styles';
import { useHomeContext } from '@/ui/screens/home/context/useHomeContext';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { PlusIcon } from 'lucide-react-native';
import { useCallback, useEffect, useRef } from 'react';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from '@/ui/hooks/useSafeAreaInsets';

export function Fab() {
  const { onOpenCreateMealModal } = useHomeContext();
  const { loadAccount, mealQuota } = useAccount();
  const navigation = useNavigation();

  const { bottom } = useSafeAreaInsets();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const sheetIndexRef = useRef(-1);

  const isQuotaExhausted =
    mealQuota !== null &&
    mealQuota.remaining !== null &&
    mealQuota.remaining <= 0;

  const handleSheetChange = useCallback((index: number) => {
    sheetIndexRef.current = index;
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      if (sheetIndexRef.current === -1) {
        return;
      }

      bottomSheetModalRef.current?.dismiss();
    });

    return unsubscribe;
  }, [navigation]);

  function handleOpenCreateMealOptions() {
    loadAccount();
    bottomSheetModalRef.current?.present();
  }

  function handleSelectCreateMealOption(type: Exclude<CreateMealModalType, null>) {
    bottomSheetModalRef.current?.dismiss();
    onOpenCreateMealModal(type);
  }

  return (
    <>
      <View style={[
        styles.container,
        {
          right: Platform.OS === 'web' ? 24 : 16,
          bottom,
        },
      ]}
      >
        <ButtonApp size='icon' onPress={handleOpenCreateMealOptions}>
          <PlusIcon size={20} />
        </ButtonApp>
      </View>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        onChange={handleSheetChange}
        style={styles.bottomSheetContainer}
      >
        <BottomSheetView style={[
          styles.bottomSheetContent,
          { paddingBottom: bottom },
        ]}>
          <AppText size='xl' weight='semiBold' style={{ letterSpacing: -0.4 }}>
            Cadastre sua refeição
          </AppText>
          <CreateMealOptions disabled={isQuotaExhausted} onSelect={handleSelectCreateMealOption} />
          <FreeQuotaNotice />
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}
