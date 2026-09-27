import { theme } from '@/ui/styles/theme';
import * as SystemUI from 'expo-system-ui';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useEffect, useState } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import chickenLeg from '@/ui/assets/chicken-leg.mp4';
import { AppText } from '@/ui/components/AppText';
import { Logo } from '@/ui/components/Logo';

interface ISplashScreenLoader {
  visible: boolean;
}

export function CreateMealLoader({ visible }: ISplashScreenLoader) {
  const [opacityAnimated] = useState(() => new Animated.Value(visible ? 1 : 0));

  useEffect(() => {
    if (!(Platform.OS === 'web' && visible)) {
      return;
    }

    SystemUI.setBackgroundColorAsync(theme.colors.white);

    return () => {
      SystemUI.setBackgroundColorAsync(null);
    };
  }, [visible]);

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
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.white,
        gap: 8,
      }}>
        {Platform.OS === 'web' ? (
          <WebVideo source={chickenLeg} />
        ) : (
          <NativeVideo source={chickenLeg} />
        )}

        <Logo
          width={150}
          variant='onLight'
        />
        <AppText color={theme.colors.lime[900]}>
          Está idenfiticando sua refeição
        </AppText>
      </View>
    </Animated.View>
  );
}

function WebVideo({ source }: { source: string }) {
  return (
    <video
      src={source}
      autoPlay
      muted
      loop
      playsInline
      style={{ width: 200, height: 200, objectFit: 'contain' }}
    />
  );
}

function NativeVideo({ source }: { source: number }) {
  const player = useVideoPlayer(source, (p) => {
    p.muted = true;
    p.loop = true;
    p.play();
  });

  return (
    <VideoView
      style={{ width: 200, height: 200 }}
      player={player}
      allowsPictureInPicture={false}
      nativeControls={false}
    />
  );
}
