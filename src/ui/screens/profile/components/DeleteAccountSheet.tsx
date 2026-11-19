import { getDeleteAccountUrl, legal } from '@/app/config/legal';
import { useAccount } from '@/app/hooks/queries/useAccount';
import { openExternalUrl } from '@/app/libs/openExternalUrl';
import { AppText } from '@/ui/components/AppText';
import { ButtonApp } from '@/ui/components/Button';
import { useSafeAreaInsets } from '@/ui/hooks/useSafeAreaInsets';
import { styles } from '@/ui/screens/profile/styles';
import { theme } from '@/ui/styles/theme';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useCallback, useImperativeHandle, useRef } from 'react';
import { View } from 'react-native';

export interface IDeleteAccountSheet {
  open: () => void;
}

interface IDeleteAccountSheetProps {
  ref: React.Ref<IDeleteAccountSheet>;
}

export function DeleteAccountSheet({ ref }: IDeleteAccountSheetProps) {
  const { bottom } = useSafeAreaInsets();
  const { email } = useAccount();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  useImperativeHandle(ref, () => ({
    open() {
      bottomSheetModalRef.current?.present();
    },
  }), []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    [],
  );

  function handleClose() {
    bottomSheetModalRef.current?.dismiss();
  }

  function handleConfirm() {
    bottomSheetModalRef.current?.dismiss();
    openExternalUrl(getDeleteAccountUrl(email));
  }

  return (
    <BottomSheetModal ref={bottomSheetModalRef} backdropComponent={renderBackdrop}>
      <BottomSheetView style={[styles.sheet, { paddingBottom: bottom }]}>
        <View style={styles.sheetHeader}>
          <AppText size='2xl' weight='semiBold' style={styles.sheetTitle}>
            Excluir sua conta?
          </AppText>
          <AppText color={theme.colors.gray[700]}>
            Vamos abrir um e-mail para {legal.supportEmail} já com o e-mail da sua conta. É só enviar.
          </AppText>
        </View>

        <View style={styles.sheetInfo}>
          <AppText size='sm'>
            Se o e-mail sair de outro endereço, confirmamos o pedido pelo e-mail da conta.
          </AppText>
          <AppText size='sm'>
            Apagamos todos os seus dados em até 15 dias. Depois disso, não dá para recuperar.
          </AppText>
        </View>

        <View style={styles.sheetFooter}>
          <ButtonApp intent='secondary' onPress={handleConfirm}>
            <AppText weight='medium' color={theme.colors.support.red}>
              Escrever e-mail de exclusão
            </AppText>
          </ButtonApp>
          <ButtonApp intent='ghost' onPress={handleClose}>
            <AppText weight='medium' color={theme.colors.gray[700]}>
              Cancelar
            </AppText>
          </ButtonApp>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
