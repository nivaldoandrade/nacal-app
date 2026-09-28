import { AppText } from '@/ui/components/AppText';
import { BirthDateBottomSheet } from '@/ui/components/BirthDate/BirthDateBottomSheet';
import { useBirthDate } from '@/ui/components/BirthDate/useBirthDate';
import { Step, StepContent, StepFooter, StepHeader, StepSubTitle, StepTitle } from '@/ui/screens/onboarding/components/Step';
import { StepAdvanceButton } from '@/ui/screens/onboarding/components/StepAdvanceButton';
import { OnboardingSchema } from '@/ui/screens/onboarding/schema';
import { theme } from '@/ui/styles/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Controller, useFormContext } from 'react-hook-form';
import { Platform, TouchableOpacity, View } from 'react-native';

export function BirthDateStep() {
  const {
    getValues,
    formState: { errors },
  } = useFormContext<OnboardingSchema>();

  const {
    showMobilePicker,
    inputRef,
    bottomSheetRef,
    openPicker,
    onMobileChange,
    onWebChange,
    toDateInputValue,
    onMobileDismiss,
    isFutureDate,
    control,
  } = useBirthDate<OnboardingSchema>('profile.birthDate');

  return (
    <Step>
      <StepHeader>
        <StepTitle>Que dia você nasceu?</StepTitle>
        <StepSubTitle>Cada faixa etária responde de forma única</StepSubTitle>
      </StepHeader>
      <StepContent position='center'>
        <Controller
          name='profile.birthDate'
          control={control}
          render={({ field, fieldState }) => {
            const selectedDate = field.value ?? new Date();
            return (
              <View>
                <TouchableOpacity onPress={openPicker}>
                  <AppText
                    weight='semiBold'
                    size='4xl'
                    color={theme.colors.gray[700]}
                    style={{ textAlign: 'center' }}
                  >
                    {formatDateForInput(selectedDate)}
                  </AppText>
                </TouchableOpacity>

                {Platform.OS === 'web' && (
                  <input
                    ref={inputRef}
                    type='date'
                    value={toDateInputValue(selectedDate)}
                    onChange={onWebChange}
                    role='textbox'
                    max={toDateInputValue(new Date())}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      top: 10,
                      pointerEvents: 'none',
                      opacity: 0,
                    }}
                  />
                )}

                {(showMobilePicker && Platform.OS === 'android') && (
                  <DateTimePicker
                    value={selectedDate}
                    mode='date'
                    display='calendar'
                    onValueChange={onMobileChange}
                    onDismiss={onMobileDismiss}
                    maximumDate={new Date()}
                  />
                )}

                {Platform.OS === 'ios' && (
                  <BirthDateBottomSheet
                    bottomSheetRef={bottomSheetRef}
                    value={selectedDate}
                    onChange={onMobileChange}
                  />
                )}

                {fieldState.error && (
                  <AppText
                    weight='semiBold'
                    color={theme.colors.support.red}
                    style={{ textAlign: 'center' }}
                  >
                    {fieldState.error.message}
                  </AppText>
                )}
              </View>
            );
          }}
        />
      </StepContent>
      <StepFooter>
        <StepAdvanceButton
          field='profile.birthDate'
          disabled={!!errors.profile?.birthDate}
          onBeforeAdvance={() => {
            const selectedDate = getValues('profile.birthDate');

            return !!selectedDate && !isFutureDate(selectedDate);
          }}
        />
      </StepFooter>
    </Step>
  );
}

function formatDateForInput(value: Date) {
  return new Intl.DateTimeFormat('pt-BR').format(value);
}
