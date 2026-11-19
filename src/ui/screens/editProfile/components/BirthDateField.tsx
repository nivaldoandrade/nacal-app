import { BirthDateBottomSheet } from '@/ui/components/BirthDate/BirthDateBottomSheet';
import { useBirthDate } from '@/ui/components/BirthDate/useBirthDate';
import { FormGroup } from '@/ui/components/FormGroup';
import { InputApp } from '@/ui/components/Input';
import { ProfileSchema } from '@/ui/screens/editProfile/schema';
import { theme } from '@/ui/styles/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CalendarDaysIcon } from 'lucide-react-native';
import { Controller } from 'react-hook-form';
import { Platform, Pressable, View } from 'react-native';

interface IBirthDateFieldProps {
  disabled?: boolean;
}

export function BirthDateField({ disabled }: IBirthDateFieldProps) {
  const {
    showMobilePicker,
    inputRef,
    bottomSheetRef,
    openPicker,
    onMobileChange,
    onWebChange,
    toDateInputValue,
    onMobileDismiss,
    control,
  } = useBirthDate<ProfileSchema>('birthDate');

  return (
    <Controller
      name='birthDate'
      control={control}
      render={({ field, fieldState }) => {
        const selectedDate = field.value ?? new Date();
        return (
          <View style={{ position: 'relative' }}>
            <FormGroup
              label='Data de Nascimento'
              error={fieldState.error?.message}
            >
              <Pressable onPress={openPicker} disabled={disabled}>
                <InputApp
                  placeholder='19/02/2000'
                  value={field.value ? formatDateForInput(field.value) : ''}
                  editable={false}
                  pointerEvents='none'
                  disabled={disabled}
                  rightAdornment={
                    <CalendarDaysIcon size={20} color={theme.colors.black[700]} />
                  }
                />
              </Pressable>
            </FormGroup>

            {Platform.OS === 'android' && showMobilePicker && (
              <DateTimePicker
                value={selectedDate}
                mode='date'
                display='calendar'
                onValueChange={onMobileChange}
                onDismiss={onMobileDismiss}
                maximumDate={new Date()}
              />
            )}

            {Platform.OS === 'web' && (
              <input
                ref={inputRef}
                type='date'
                value={toDateInputValue(selectedDate)}
                onChange={onWebChange}
                max={toDateInputValue(new Date())}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: 52,
                  bottom: 0,
                  opacity: 0,
                  pointerEvents: 'none',
                }}
              />
            )}

            {Platform.OS === 'ios' && (
              <BirthDateBottomSheet
                bottomSheetRef={bottomSheetRef}
                value={selectedDate}
                onChange={onMobileChange}
              />
            )}
          </View>
        );
      }}
    />
  );
}

function formatDateForInput(value: Date) {
  return new Intl.DateTimeFormat('pt-BR').format(value);
}
