import { theme } from '@/ui/styles/theme';
import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import iconLoading from '@/ui/assets/icon-loading.lottie';
import { AppText } from '@/ui/components/AppText';
import { Logo } from '@/ui/components/Logo';

interface ISplashScreenLoader {
  visible: boolean;
}

const ANIMATION_SIZE = { width: 200, height: 190 };

export function CreateMealLoader({ visible }: ISplashScreenLoader) {
  const [opacityAnimated] = useState(() => new Animated.Value(visible ? 1 : 0));

  useEffect(() => {
    if (!visible) {
      Animated.timing(opacityAnimated, {
        toValue: 0,
        duration: 350,
        useNativeDriver: Platform.OS !== 'web',
      }).start();

      return;
    }

    Animated.timing(opacityAnimated, {
      toValue: 1,
      duration: 300,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [visible, opacityAnimated]);

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[StyleSheet.absoluteFill, {
        opacity: opacityAnimated, zIndex: 999,
      }]}
    >
      <View style={styles.container}>
        {visible && (
          <LottieView
            source={iconLoading}
            autoPlay
            loop
            style={ANIMATION_SIZE}
            webStyle={ANIMATION_SIZE}
          />
        )}

        <Logo width={150} variant='onDark' />
        <AppText color={theme.colors.gray[100]}>
          Está identificando sua refeição
        </AppText>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.black[800],
    gap: 8,
  },
});
