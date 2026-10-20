import { AppText } from '@/ui/components/AppText';
import { ButtonApp } from '@/ui/components/Button';
import { theme } from '@/ui/styles/theme';
import { CameraOffIcon } from 'lucide-react-native';
import { forwardRef, useImperativeHandle } from 'react';
import { View } from 'react-native';

import type {
  ICameraCaptureProps,
  ICameraCaptureRef,
} from './CameraCapture.types';
import { captureFrame, MIN_ZOOM } from './web/camera';
import { styles } from './web/styles';
import { useCameraStream } from './web/useCameraStream';
import { useCameraZoom } from './web/useCameraZoom';

export const CameraCapture = forwardRef<ICameraCaptureRef, ICameraCaptureProps>(
  ({ style }, ref) => {
    const { videoRef, cameraError, retry } = useCameraStream();
    const { zoom, getZoom } = useCameraZoom(videoRef);

    useImperativeHandle(ref, () => ({
      async takePictureAsync() {
        const video = videoRef.current;

        if (!video) {
          throw new Error('Câmera indisponível.');
        }

        return captureFrame(video, getZoom());
      },
    }), [getZoom, videoRef]);

    return (
      <View style={[style, styles.container]}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            touchAction: 'none',
            userSelect: 'none',
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        />
        {cameraError && (
          <View style={styles.cameraErrorOverlay}>
            <View style={styles.cameraErrorIconCircle}>
              <CameraOffIcon
                size={32}
                color={theme.colors.lime[400]}
                strokeWidth={1.5}
              />
            </View>
            <AppText
              size='lg'
              color={theme.colors.gray[100]}
              style={styles.cameraErrorTitle}
            >
              Câmera indisponível
            </AppText>
            <AppText
              size='sm'
              color={theme.colors.gray[200]}
              style={styles.cameraErrorDescription}
            >
              {cameraError}
            </AppText>
            <ButtonApp onPress={retry}>Tentar novamente</ButtonApp>
          </View>
        )}
        {!cameraError && zoom > MIN_ZOOM && (
          <View pointerEvents='none' style={styles.zoomBadge}>
            <AppText size='xs' weight='medium' color={theme.colors.gray[100]}>
              {zoom.toFixed(1)}×
            </AppText>
          </View>
        )}
      </View>
    );
  },
);

CameraCapture.displayName = 'CameraCapture';
