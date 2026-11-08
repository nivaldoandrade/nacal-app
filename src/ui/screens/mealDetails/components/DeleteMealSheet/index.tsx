import { AppText } from '@/ui/components/AppText';
import { ButtonApp } from '@/ui/components/Button';
import { useSafeAreaInsets } from '@/ui/hooks/useSafeAreaInsets';
import { DeleteMealSheetReason, IDeleteMealSheet } from '@/ui/screens/mealDetails/components/DeleteMealSheet/IDeleteMealSheet';
import { styles } from '@/ui/screens/mealDetails/components/DeleteMealSheet/styles';
import { theme } from '@/ui/styles/theme';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useCallback, useImperativeHandle, useRef, useState } from 'react';
import { View } from 'react-native';

const COPY: Record<DeleteMealSheetReason, { title: string; description: string }> = {
  meal: {
    title: 'Excluir esta refeição?',
    description: 'Ela sai do seu diário e das contas do dia. Não dá para desfazer.',
  },
  lastItem: {
    title: 'Excluir a refeição?',
    description: 'Esse é o único item da refeição. Para tirá-lo, a refeição inteira é excluída, e não dá para desfazer.',
  },
};

interface IDeleteMealSheetProps {
  ref: React.Ref<IDeleteMealSheet>;
  isDeleting: boolean;
  onConfirm: () => void;
}

export function DeleteMealSheet({ ref, isDeleting, onConfirm }: IDeleteMealSheetProps) {
  const { bottom } = useSafeAreaInsets();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [reason, setReason] = useState<DeleteMealSheetReason>('meal');

  useImperativeHandle(ref, () => ({
    open(nextReason) {
      setReason(nextReason);
      bottomSheetModalRef.current?.present();
    },
    dismiss() {
      bottomSheetModalRef.current?.dismiss();
    },
  }), []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior={isDeleting ? 'none' : 'close'}
      />
    ),
    [isDeleting],
  );

  const copy = COPY[reason];

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      backdropComponent={renderBackdrop}
      enablePanDownToClose={!isDeleting}
    >
      <BottomSheetView style={[styles.container, { paddingBottom: bottom }]}>
        <View style={styles.header}>
          <AppText size='2xl' weight='semiBold' style={styles.title}>
            {copy.title}
          </AppText>
          <AppText color={theme.colors.gray[700]}>
            {copy.description}
          </AppText>
        </View>

        <View style={styles.actions}>
          <ButtonApp
            intent='secondary'
            style={styles.action}
            disabled={isDeleting}
            onPress={() => bottomSheetModalRef.current?.dismiss()}
          >
            Manter
          </ButtonApp>
          <ButtonApp
            intent='ghost'
            style={styles.action}
            isLoading={isDeleting}
            onPress={onConfirm}
          >
            <AppText weight='medium' color={theme.colors.support.red}>
              Sim, excluir
            </AppText>
          </ButtonApp>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
