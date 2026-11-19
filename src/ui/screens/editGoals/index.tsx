import { ButtonApp } from '@/ui/components/Button';
import { HeaderApp } from '@/ui/components/HeaderApp';
import { GoalInputField } from '@/ui/screens/editGoals/components/GoalInputField';
import { styles } from '@/ui/screens/editGoals/styles';
import { useEditGoals } from '@/ui/screens/editGoals/useEditGoals';
import { theme } from '@/ui/styles/theme';
import { FormProvider } from 'react-hook-form';
import { View } from 'react-native';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';

export function EditGoals() {

  const {
    isSubmitting,
    canSubmit,
    form,
    top,
    footerHeight,
    setFooterHeight,
    bottom,
    goBack,
    handleSubmit,

  } = useEditGoals();

  return (
    <FormProvider {...form} >
      <View style={[styles.container, { paddingTop: top }]}>
        <HeaderApp title='Suas Metas' disabled={isSubmitting} />
        <KeyboardAwareScrollView
          bottomOffset={footerHeight}
        >
          <View style={styles.content}>
            <GoalInputField
              name='calories'
              label='Calorias'
              placeholder='2000'
              unit='kcal'
              disabled={isSubmitting}
            />
            <GoalInputField
              name='carbohydrates'
              label='Carboidratos'
              placeholder='200'
              unit='g'
              disabled={isSubmitting}
            />
            <GoalInputField
              name='proteins'
              label='Proteínas'
              placeholder='175'
              unit='g'
              disabled={isSubmitting}
            />
            <GoalInputField
              name='fats'
              label='Gorduras'
              placeholder='56'
              unit='g'
              disabled={isSubmitting}
            />
          </View>
        </KeyboardAwareScrollView>
        <KeyboardStickyView
          onLayout={(e) => setFooterHeight(e.nativeEvent.layout.height + bottom)}
          offset={{ opened: 10 + 20 }}
          style={{ backgroundColor: theme.colors.white }}
        >
          <View style={[styles.footer, { paddingBottom: bottom }]}>
            <ButtonApp
              intent='neutral'
              style={{ flex: 1 }}
              disabled={isSubmitting}
              onPress={goBack}
            >
              Cancelar
            </ButtonApp>
            <ButtonApp
              style={{ flex: 1 }}
              disabled={!canSubmit}
              isLoading={isSubmitting}
              onPress={handleSubmit}
            >
              Salvar
            </ButtonApp>
          </View>
        </KeyboardStickyView>
      </View >
    </FormProvider>
  );
}

