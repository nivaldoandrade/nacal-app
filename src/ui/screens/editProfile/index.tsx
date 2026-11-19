import { ButtonApp } from '@/ui/components/Button';
import { HeaderApp } from '@/ui/components/HeaderApp';
import { GenderInput } from '@/ui/components/Inputs/GenderInput';
import { MeasurementField } from '@/ui/components/Inputs/MeasurementField';
import { NameInput } from '@/ui/components/Inputs/NameInput';
import { BirthDateField } from '@/ui/screens/editProfile/components/BirthDateField';
import { styles } from '@/ui/screens/editProfile/styles';
import { useEditProfile } from '@/ui/screens/editProfile/useEditProfile';
import { theme } from '@/ui/styles/theme';
import { formatHeight, formatWeight } from '@/ui/utils/formatMeasurement';
import { Controller, FormProvider } from 'react-hook-form';
import { View } from 'react-native';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';

export function EditProfile() {
  const {
    isSubmitting,
    canSubmit,
    form,
    top,
    footerHeight,
    setFooterHeight,
    bottom,
    handleSubmit,
  } = useEditProfile();

  return (
    <FormProvider {...form}>
      <View style={[styles.container, { paddingTop: top }]}>
        <HeaderApp title='Editar perfil' disabled={isSubmitting} />
        <KeyboardAwareScrollView
          bottomOffset={footerHeight}
          keyboardShouldPersistTaps='handled'
        >
          <View style={styles.content}>
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
              name='gender'
              control={form.control}
              render={({ field }) => (
                <GenderInput
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting}
                />
              )}
            />
          </View>
        </KeyboardAwareScrollView>
        <KeyboardStickyView
          onLayout={(e) => setFooterHeight(e.nativeEvent.layout.height + bottom)}
          offset={{ opened: 30 }}
          style={{ backgroundColor: theme.colors.white }}
        >
          <View style={[styles.footer, { paddingBottom: bottom }]}>
            <ButtonApp
              disabled={!canSubmit}
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
