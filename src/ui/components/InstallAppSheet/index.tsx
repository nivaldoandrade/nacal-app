import { InstallPlatform } from '@/app/libs/pwaInstall';
import { AppText } from '@/ui/components/AppText';
import { ButtonApp } from '@/ui/components/Button';
import { IInstallAppSheet, InstallAppSheetSource } from '@/ui/components/InstallAppSheet/IInstallAppSheet';
import { styles } from '@/ui/components/InstallAppSheet/styles';
import { useInstallAppSheet } from '@/ui/components/InstallAppSheet/useInstallAppSheet';
import { theme } from '@/ui/styles/theme';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {
  CircleCheckIcon,
  CompassIcon,
  EllipsisIcon,
  EllipsisVerticalIcon,
  LucideIcon,
  ShareIcon,
  SquarePlusIcon,
} from 'lucide-react-native';
import { ReactNode, useCallback } from 'react';
import { Image, View } from 'react-native';

interface IInstallAppSheetProps {
  ref: React.Ref<IInstallAppSheet>;
  source: InstallAppSheetSource;
}

interface IStep {
  icon: LucideIcon;
  text: ReactNode;
}

function Bold({ children }: { children: ReactNode }) {
  return <AppText weight='semiBold'>{children}</AppText>;
}

function getSteps(platform: InstallPlatform): IStep[] {
  if (platform === 'ios-safari') {
    return [
      { icon: ShareIcon, text: <>Toque em <Bold>Compartilhar</Bold> na barra do Safari</> },
      { icon: SquarePlusIcon, text: <>Role e escolha <Bold>Adicionar à Tela de Início</Bold></> },
      { icon: CircleCheckIcon, text: <>Toque em <Bold>Adicionar</Bold> no canto superior</> },
    ];
  }

  if (platform === 'ios-other') {
    return [
      { icon: ShareIcon, text: <>Toque em <Bold>Compartilhar</Bold> ao lado do endereço do site</> },
      { icon: SquarePlusIcon, text: <>Escolha <Bold>Adicionar à Tela de Início</Bold></> },
      { icon: CircleCheckIcon, text: <>Toque em <Bold>Adicionar</Bold> para confirmar</> },
    ];
  }

  if (platform === 'ios-inapp') {
    return [
      { icon: EllipsisIcon, text: <>Toque no menu <Bold>•••</Bold> deste app</> },
      { icon: CompassIcon, text: <>Escolha <Bold>Abrir no navegador</Bold> (Safari)</> },
      { icon: ShareIcon, text: <>No Safari, toque em <Bold>Compartilhar</Bold> e depois em <Bold>Adicionar à Tela de Início</Bold></> },
    ];
  }

  return [
    { icon: EllipsisVerticalIcon, text: <>Toque no menu <Bold>⋮</Bold> do navegador</> },
    { icon: SquarePlusIcon, text: <>Escolha <Bold>Instalar app</Bold> ou <Bold>Adicionar à tela inicial</Bold></> },
    { icon: CircleCheckIcon, text: <>Confirme em <Bold>Instalar</Bold></> },
  ];
}

export function InstallAppSheet({ ref, source }: IInstallAppSheetProps) {
  const {
    bottom,
    bottomSheetModalRef,
    platform,
    canPromptNatively,
    isInstalling,
    handleDismiss,
    handleLater,
    handleInstall,
  } = useInstallAppSheet({ ref, source });

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    [],
  );

  const steps = getSteps(platform);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      backdropComponent={renderBackdrop}
      onDismiss={handleDismiss}
    >
      <BottomSheetView style={[styles.container, { paddingBottom: bottom }]}>
        <View style={styles.header}>
          <Image
            source={{ uri: '/apple-touch-icon.png' }}
            style={styles.appIcon}
            accessibilityIgnoresInvertColors
          />
          <View style={{ gap: 8 }}>
            <AppText size='2xl' weight='semiBold' style={styles.title}>
              Tenha o NaCal na sua tela inicial
            </AppText>
            <AppText color={theme.colors.gray[700]}>
              Abre mais rápido, em tela cheia, como um app de verdade.
            </AppText>
          </View>
        </View>

        {canPromptNatively ? (
          <ButtonApp onPress={handleInstall} isLoading={isInstalling}>
            Instalar NaCal
          </ButtonApp>
        ) : (
          <View style={styles.steps}>
            {steps.map(({ icon: Icon, text }, index) => (
              <View key={index} style={styles.step}>
                <View style={styles.stepNumber}>
                  <AppText size='sm' weight='semiBold'>{index + 1}</AppText>
                </View>
                <AppText size='sm' style={styles.stepText}>{text}</AppText>
                <View style={styles.stepIcon}>
                  <Icon size={20} color={theme.colors.black[700]} />
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          {source === 'auto' && (
            <AppText size='xs' weight='light' color={theme.colors.gray[700]} style={styles.hint}>
              Você também encontra este passo a passo no seu perfil.
            </AppText>
          )}
          <ButtonApp intent='ghost' onPress={handleLater} disabled={isInstalling}>
            <AppText weight='medium' color={theme.colors.gray[700]}>
              {source === 'auto' ? 'Agora não' : 'Fechar'}
            </AppText>
          </ButtonApp>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
