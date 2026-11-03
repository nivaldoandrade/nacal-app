import { AppText } from '@/ui/components/AppText';
import { ButtonApp } from '@/ui/components/Button';
import { FormGroup } from '@/ui/components/FormGroup';
import { InputApp } from '@/ui/components/Input';
import { useSafeAreaInsets } from '@/ui/hooks/useSafeAreaInsets';
import { HeaderForgotAndResetPassword } from '@/ui/screens/forgotPassword/components/HeaderForgotAndResetPassword';
import { styles } from '@/ui/screens/confirmEmail/styles';
import { useConfirmEmail } from '@/ui/screens/confirmEmail/useConfirmEmail';
import type { AuthStackNavigatorProps, AuthStackScreenProps } from '@/app/navigation/AuthStack';
import { theme } from '@/ui/styles/theme';
import { useNavigation } from '@react-navigation/native';
import { Controller } from 'react-hook-form';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

export function ConfirmEmail({ route }: AuthStackScreenProps<'ConfirmEmail'>) {
  const { email, codeSent = true } = route.params;
  const navigation = useNavigation<AuthStackNavigatorProps>();
  const { top, bottom } = useSafeAreaInsets();
  const {
    control,
    handleSubmit,
    handleResendCode,
    clearErrors,
    isSubmitting,
    isValid,
    isSuccess,
    passwordResetRequired,
    requiresPassword,
    resendCountdown,
    isResending,
    canResend,
  } = useConfirmEmail({ email, codeSent });

  if (isSuccess && passwordResetRequired) {
    return (
      <View style={[styles.successContainer, { paddingTop: top, paddingBottom: bottom }]}>
        <AppText
          size='4xl'
          weight='semiBold'
          style={{ textAlign: 'center', letterSpacing: -0.32 }}
        >
          E-mail confirmado
        </AppText>
        <AppText color={theme.colors.gray[700]} style={{ textAlign: 'center' }}>
          Por segurança, crie uma nova senha para entrar. É rapidinho: enviamos um código para o seu e-mail.
        </AppText>
        <View style={{ width: '100%' }}>
          <ButtonApp onPress={() => navigation.navigate('ForgotPassword')}>
            Criar nova senha
          </ButtonApp>
        </View>
      </View>
    );
  }

  if (isSuccess) {
    return (
      <View style={[styles.successContainer, { paddingTop: top, paddingBottom: bottom }]}>
        <AppText
          size='4xl'
          weight='semiBold'
          style={{ textAlign: 'center', letterSpacing: -0.32 }}
        >
          E-mail confirmado
        </AppText>
        <AppText color={theme.colors.gray[700]} style={{ textAlign: 'center' }}>
          Sua conta está pronta. Entre para continuar.
        </AppText>
        <View style={{ width: '100%' }}>
          <ButtonApp
            onPress={() => navigation.navigate('Welcome', { prefillEmail: email })}
          >
            Fazer login
          </ButtonApp>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: top, paddingBottom: bottom }]}>
      <KeyboardAwareScrollView
        mode='layout'
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.sheet}>
          <HeaderForgotAndResetPassword
            title='Confirme seu e-mail'
            subtitle={
              <>
                Digite o código de 6 dígitos enviado para
                <AppText weight='semiBold'> {email} </AppText>
                . Se não recebeu, reenvie abaixo.
              </>
            }
          />
          <View style={styles.content}>
            {requiresPassword && (
              <Controller
                name='password'
                control={control}
                render={({ field, fieldState }) => (
                  <FormGroup label='Senha' error={fieldState.error?.message}>
                    <InputApp
                      placeholder='A senha que você criou no cadastro'
                      autoCorrect={false}
                      autoComplete='current-password'
                      autoCapitalize='none'
                      secureTextEntry
                      returnKeyType='next'
                      onBlur={field.onBlur}
                      onChangeText={(value) => {
                        field.onChange(value);
                        clearErrors('password');
                      }}
                      disabled={isSubmitting}
                      value={field.value}
                    />
                  </FormGroup>
                )}
              />
            )}
            <Controller
              name='confirmationCode'
              control={control}
              render={({ field, fieldState, formState }) => (
                <FormGroup
                  label='Código'
                  error={
                    fieldState.error?.message
                    || formState.errors.root?.api.message
                  }
                >
                  <InputApp
                    placeholder='000000'
                    inputMode='numeric'
                    autoComplete='one-time-code'
                    maxLength={6}
                    returnKeyType='done'
                    onSubmitEditing={handleSubmit}
                    onBlur={field.onBlur}
                    onChangeText={(value) => {
                      field.onChange(value);
                      clearErrors('confirmationCode');
                    }}
                    disabled={isSubmitting}
                    value={field.value}
                  />
                </FormGroup>
              )}
            />
          </View>
          <View style={styles.footer}>
            <ButtonApp
              isLoading={isSubmitting}
              disabled={!isValid}
              onPress={handleSubmit}
            >
              Confirmar e-mail
            </ButtonApp>
            <TouchableOpacity
              accessibilityRole='button'
              accessibilityLabel='Reenviar código'
              accessibilityState={{ disabled: !canResend || isSubmitting }}
              disabled={!canResend || isSubmitting}
              onPress={handleResendCode}
              style={{ alignSelf: 'center', minHeight: 24, justifyContent: 'center' }}
            >
              {isResending ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <ActivityIndicator size='small' color={theme.colors.gray[700]} />
                  <AppText color={theme.colors.gray[700]} size='sm' weight='medium'>
                    Enviando...
                  </AppText>
                </View>
              ) : canResend ? (
                <AppText size='sm' weight='medium'>
                  Reenviar código
                </AppText>
              ) : (
                <AppText color={theme.colors.gray[700]} size='sm' weight='medium'>
                  Reenviar código em {resendCountdown}s
                </AppText>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
