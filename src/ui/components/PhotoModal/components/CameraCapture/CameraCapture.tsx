import { CameraView } from 'expo-camera';
import { forwardRef, useImperativeHandle, useRef } from 'react';

import type {
  ICameraCaptureProps,
  ICameraCaptureRef,
} from './CameraCapture.types';

export const CameraCapture =
  forwardRef<ICameraCaptureRef, ICameraCaptureProps>((
    { style }, ref,
  ) => {
    const cameraRef = useRef<CameraView>(null);

    useImperativeHandle(ref, () => ({
      async takePictureAsync() {
        if (!cameraRef.current) {
          throw new Error('Câmera indisponível.');
        }

        const photo = await cameraRef.current.takePictureAsync();

        return {
          uri: photo.uri,
          width: photo.width,
          height: photo.height,
        };
      },
    }), []);

    return <CameraView ref={cameraRef} facing='back' style={style} />;
  },
  );

CameraCapture.displayName = 'CameraCapture';
