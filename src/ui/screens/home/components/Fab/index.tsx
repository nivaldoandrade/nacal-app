import { useAccount } from '@/app/hooks/queries/useAccount';
import { AppText } from '@/ui/components/AppText';
import { ButtonApp } from '@/ui/components/Button';
import type { CreateMealModalType } from '@/ui/components/CreateMealModals';
import { CreateMealOptions } from '@/ui/components/CreateMealOptions';
import { FreeQuotaNotice } from '@/ui/components/FreeQuotaNotice';
import { styles } from '@/ui/screens/home/components/Fab/styles';
import { useHomeContext } from '@/ui/screens/home/context/useHomeContext';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { PlusIcon } from 'lucide-react-native';
import { useRef } from 'react';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from '@/ui/hooks/useSafeAreaInsets';

export function Fab() {
  const { onOpenCreateMealModal } = useHomeContext();
  const { loadAccount, mealQuota } = useAccount();

  const { bottom } = useSafeAreaInsets();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const isQuotaExhausted =
    mealQuota !== null &&
    mealQuota.remaining !== null &&
    mealQuota.remaining <= 0;

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
