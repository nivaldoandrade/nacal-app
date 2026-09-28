
import { useAuth } from '@/app/contexts/AuthContext/useAuth';
import { getApiErrorCode, getErrorMessage } from '@/app/errors/apiErrors';
import { ButtonApp } from '@/ui/components/Button';
import { FormGroup } from '@/ui/components/FormGroup';
import { GoogleIcon } from '@/ui/components/GoogleIcon';
import { InputApp } from '@/ui/components/Input';
import { NameInput } from '@/ui/components/Inputs/NameInput';
import { OrDivider } from '@/ui/components/OrDivider';
import { Step, StepContent, StepFooter, StepHeader, StepSubTitle, StepTitle } from '@/ui/screens/onboarding/components/Step';
import { OnboardingSchema, OnboardingSchemaOutput } from '@/ui/screens/onboarding/schema';
import { useOnboardingSubmit } from '@/ui/screens/onboarding/useOnboardingSubmit';
import { theme } from '@/ui/styles/theme';
import { useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyleSheet, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from '@/ui/hooks/useSafeAreaInsets';

export function CreateAccountStep() {
  const [footerHeight, setFooterHeight] = useState(0);
  const { bottom } = useSafeAreaInsets();
  const { signUp } = useAuth();
  const { signInWithGoogle, isGoogleLoading } = useOnboardingSubmit({ flow: 'signUp' });

  const {
    control,
    setError,
    handleSubmit: RHFHandleSubmit,
    formState: { isValid, isSubmitting },
  } = useFormContext<OnboardingSchema, unknown, OnboardingSchemaOutput>();

  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const passwordConfirmInputRef = useRef<TextInput>(null);

  const handleSubmit = RHFHandleSubmit(async (data) => {
    try {

      await signUp(data);
    } catch (error) {
      const code = getApiErrorCode(error);
      const message = getErrorMessage(code);

      if (code === 'EMAIL_ALREADY_IN_USE') {
        setError('account.email', { type: 'api', message });
      } else if (code) {
        setError('root.api', { message });
      }
    }

  });

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      bottomOffset={footerHeight}
      contentContainerStyle={{
        flexGrow: 1,
      }}
    >
      <Step>

        <StepHeader>
          <StepTitle>Crie sua conta</StepTitle>
          <StepSubTitle>Para poder visualizar seu progresso</StepSubTitle>
        </StepHeader>
        <StepContent>
          <View style={{ gap: 24 }}>
            <ButtonApp
              intent='ghost'
              style={styles.googleButton}
              leftIcon={<GoogleIcon />}
              isLoading={isGoogleLoading}
              disabled={isGoogleLoading || isSubmitting}
              onPress={signInWithGoogle}
            >
              Continuar com o Google
            </ButtonApp>
            <OrDivider />
            <Controller
              name='profile.name'
              control={control}
              render={({ field, fieldState }) => (
                <NameInput
                  inputMode='text'
                  autoCapitalize='words'
                  autoComplete='name'
                  onChange={field.onChange}
                  value={field.value}
                  error={fieldState.error?.message}
                  returnKeyType='next'
                  onSubmitEditing={() => emailInputRef.current?.focus()}

                />
              )}
            />
            <Controller
              name='account.email'
              control={control}
              render={({ field, fieldState }) => (
                <FormGroup label='E-mail' error={fieldState.error?.message}>
                  <InputApp
                    ref={emailInputRef}
                    placeholder='john.doe@email.com.br'
                    inputMode='email'
                    autoComplete='email'
                    autoCorrect={false}
                    autoCapitalize='none'
                    onChangeText={field.onChange}
                    value={field.value}
                    returnKeyType='next'
                    onSubmitEditing={() => passwordInputRef.current?.focus()}
                  />
                </FormGroup>
              )}
            />
            <Controller
              name='account.password'
              control={control}
              render={({ field, fieldState }) => (
                <FormGroup label='Senha' error={fieldState.error?.message}>
                  <InputApp
                    ref={passwordInputRef}
                    placeholder='********'
                    secureTextEntry
                    autoCorrect={false}
                    autoComplete='current-password'
                    autoCapitalize='none'
                    onChangeText={field.onChange}
                    value={field.value}
                    returnKeyType='next'
                    onSubmitEditing={() => passwordConfirmInputRef.current?.focus()}
                  />
                </FormGroup>
              )}
            />
            <Controller
              name='account.confirmPassword'
              control={control}
              render={({ field, fieldState, formState }) => (
                <FormGroup label='Confirmar Senha' error={
                  fieldState.error?.message ||
                  formState.errors.root?.api.message
                }>
                  <InputApp
                    ref={passwordConfirmInputRef}
                    secureTextEntry
                    placeholder='********'
                    autoCorrect={false}
                    autoComplete='current-password'
                    autoCapitalize='none'
                    onChangeText={field.onChange}
                    value={field.value}
                    returnKeyType='done'
                    onSubmitEditing={handleSubmit}
                  />
                </FormGroup>
              )}
            />
          </View>
        </StepContent>
        <StepFooter onLayout={(e) => setFooterHeight(e.nativeEvent.layout.height + bottom)}>
          <View style={{ width: '100%' }}>
            <ButtonApp
              isLoading={isSubmitting}
              disabled={!isValid || isGoogleLoading}
              onPress={handleSubmit}
            >
              Criar Conta
            </ButtonApp>
          </View>
        </StepFooter>
      </Step>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    borderWidth: 1,
    borderColor: theme.colors.gray[400],
  },
});
