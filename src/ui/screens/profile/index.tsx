import { ButtonApp } from '@/ui/components/Button';
import { HeaderApp } from '@/ui/components/HeaderApp';
import { GenderInput } from '@/ui/components/Inputs/GenderInput';
import { MeasurementField } from '@/ui/components/Inputs/MeasurementField';
import { NameInput } from '@/ui/components/Inputs/NameInput';
import { BirthDateField } from '@/ui/screens/profile/components/BirthDateField';
import { PlanSection } from '@/ui/screens/profile/components/PlanSection';
import { styles } from '@/ui/screens/profile/styles';
import { useProfile } from '@/ui/screens/profile/useProfile';
import { theme } from '@/ui/styles/theme';
import { formatHeight, formatWeight } from '@/ui/utils/formatMeasurement';
import { useFocusEffect } from '@react-navigation/native';
import * as SystemUI from 'expo-system-ui';
import { LogOutIcon } from 'lucide-react-native';
import { useCallback } from 'react';
import { Controller, FormProvider } from 'react-hook-form';
import { Platform, View } from 'react-native';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';

export function Profile() {
  const {
    isSubmitting,
    form,
    top,
    footerHeight,
    setFooterHeight,
    bottom,
    handleSubmit,
    handleSignOut,
  } = useProfile();

  useFocusEffect(
    useCallback(() => {
      if (!(Platform.OS === 'web')) {
        return;
      }

      SystemUI.setBackgroundColorAsync(null);

    }, []),
  );

  return (
    <FormProvider {...form}>
      <View style={[styles.container, { paddingTop: top }]}>
        <HeaderApp
          title='Perfil'
          disabled={isSubmitting}
          rightIcon={LogOutIcon}
          onRightPress={handleSignOut}
        />
        <KeyboardAwareScrollView
          bottomOffset={footerHeight}
          keyboardShouldPersistTaps='handled'
        >
          <View style={styles.content}>
            {/* <View style={styles.avatar}>
              <Avatar name={account?.profile.name ?? 'Perfil'} />
            </View> */}
            <Controller
              name='name'
              control={form.control}
              render={({ field, fieldState }) => (
                <NameInput
                  value={field.value}
                  onChange={(value) => {
                    form.clearErrors('root.api');
                    field.onChange(value);
                  }}
                  error={fieldState.error?.message}
                  disabled={isSubmitting}
                />
              )}
            />
            <BirthDateField disabled={isSubmitting} />
            <Controller
              name='height'
              control={form.control}
              render={({ field, fieldState }) => (
                <MeasurementField
                  name={field.name}
                  placeholder='175'
                  unit='cm'
                  value={field.value}
                  disabled={isSubmitting}
                  onChange={(value) => {
                    form.clearErrors('root.api');
                    field.onChange(formatHeight(value));
                  }}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name='weight'
              control={form.control}
              render={({ field, fieldState }) => (
                <MeasurementField
                  name={field.name}
                  placeholder='80'
                  unit='kg'
                  value={field.value}
                  disabled={isSubmitting}
                  onChange={(value) => {
                    form.clearErrors('root.api');
                    field.onChange(formatWeight(value));
                  }}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="gender"
              control={form.control}
              render={({ field }) => (
                <GenderInput
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting}
                />
              )}
            />
            <PlanSection />
          </View>
        </KeyboardAwareScrollView>
        <KeyboardStickyView
          onLayout={(e) => setFooterHeight(e.nativeEvent.layout.height + bottom)}
          offset={{ opened: 30 }}
          style={{ backgroundColor: theme.colors.white }}
        >
          <View style={[styles.footer, { paddingBottom: bottom }]}>
            <ButtonApp
              disabled={!form.formState.isValid || isSubmitting}
              isLoading={isSubmitting}
              onPress={handleSubmit}
            >
              Salvar
            </ButtonApp>
          </View>
        </KeyboardStickyView>
      </View>
    </FormProvider>
  );
}
