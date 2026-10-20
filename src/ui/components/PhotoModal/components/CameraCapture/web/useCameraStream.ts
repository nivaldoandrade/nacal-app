import { useCallback, useEffect, useRef, useState } from 'react';

import { CAMERA_IDEAL_HEIGHT, CAMERA_IDEAL_WIDTH } from './camera';
import {
  CAMERA_UNAVAILABLE_MESSAGE,
  getCameraErrorMessage,
} from './cameraErrors';

async function applyMaxResolution(track?: MediaStreamTrack): Promise<void> {
  if (!track?.applyConstraints) {
    return;
  }

  try {
    const capabilities = track.getCapabilities?.();
    const width = capabilities?.width?.max ?? CAMERA_IDEAL_WIDTH;
    const height = capabilities?.height?.max ?? CAMERA_IDEAL_HEIGHT;

    await track.applyConstraints({
      width: { ideal: width },
      height: { ideal: height },
    });
  } catch {
    return;
  }
}

function stopStream(stream: MediaStream | null): void {
  stream?.getTracks().forEach((track) => track.stop());
}

export function useCameraStream() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const retry = useCallback(() => {
    setCameraError(null);
    setRetryKey((current) => current + 1);
  }, []);

  useEffect(() => {
    let isCancelled = false;
    let stream: MediaStream | null = null;
    const video = videoRef.current;

    async function startCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError(CAMERA_UNAVAILABLE_MESSAGE);
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: CAMERA_IDEAL_WIDTH },
            height: { ideal: CAMERA_IDEAL_HEIGHT },
          },
        });

        if (isCancelled) {
          stopStream(stream);
          return;
        }

        const [videoTrack] = stream.getVideoTracks();

        await applyMaxResolution(videoTrack);

        if (isCancelled) {
          stopStream(stream);
          return;
        }

        if (!video) {
          stopStream(stream);
          setCameraError(CAMERA_UNAVAILABLE_MESSAGE);
          return;
        }

        video.srcObject = stream;

        try {
          await video.play();
        } catch {
          if (isCancelled) {
            return;
          }

          stopStream(stream);
          stream = null;
          video.srcObject = null;
          setCameraError('Não conseguimos iniciar a câmera. Tente novamente.');
        }
      } catch (error) {
        if (isCancelled) {
          return;
        }

        stopStream(stream);
        stream = null;

        if (video) {
          video.srcObject = null;
        }

        setCameraError(getCameraErrorMessage(error));
      }
    }

    startCamera();

    return () => {
      isCancelled = true;
      stopStream(stream);
      stream = null;

      if (video) {
        video.srcObject = null;
      }
    };
  }, [retryKey]);

  return {
    videoRef,
    cameraError,
    retry,
  };
}
