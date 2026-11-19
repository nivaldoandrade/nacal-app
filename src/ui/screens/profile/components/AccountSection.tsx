import { AppText } from '@/ui/components/AppText';
import { DeleteAccountSheet, IDeleteAccountSheet } from '@/ui/screens/profile/components/DeleteAccountSheet';
import { styles } from '@/ui/screens/profile/styles';
import { theme } from '@/ui/styles/theme';
import { ChevronRightIcon, LogOutIcon } from 'lucide-react-native';
import { useRef } from 'react';
import { Pressable, View } from 'react-native';

interface IAccountSectionProps {
  onSignOut: () => void;
}

export function AccountSection({ onSignOut }: IAccountSectionProps) {
  const deleteSheetRef = useRef<IDeleteAccountSheet>(null);

  return (
    <View style={styles.section}>
      <AppText size='sm' weight='medium' color={theme.colors.gray[700]}>
        Conta
      </AppText>
      <View style={styles.listCard}>
        <Pressable
          accessibilityRole='button'
          onPress={onSignOut}
          style={({ pressed }) => [styles.listRow, styles.listRowDivider, pressed && styles.pressed]}
        >
          <AppText style={styles.rowText}>Sair da conta</AppText>
          <LogOutIcon size={18} color={theme.colors.gray[700]} />
        </Pressable>
        <Pressable
          accessibilityRole='button'
          onPress={() => deleteSheetRef.current?.open()}
          style={({ pressed }) => [styles.listRow, pressed && styles.pressed]}
        >
          <AppText style={styles.rowText} color={theme.colors.support.red}>
            Excluir conta
          </AppText>
          <ChevronRightIcon size={18} color={theme.colors.gray[700]} />
        </Pressable>
      </View>
      <DeleteAccountSheet ref={deleteSheetRef} />
    </View>
  );
}
