import { MEAL_IMAGE_CAPTURE_JPEG_QUALITY } from '@/app/config/mealImage';

import type { ICapturedPhoto } from '../CameraCapture.types';

export const CAMERA_IDEAL_WIDTH = 3840;
export const CAMERA_IDEAL_HEIGHT = 2160;
export const MIN_ZOOM = 1;
export const MAX_ZOOM = 3;
export const DOUBLE_TAP_ZOOM = 2;
export const DOUBLE_TAP_DELAY = 300;
export const DOUBLE_TAP_DISTANCE = 30;

interface ICrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

function getVisibleVideoCrop(
  videoWidth: number,
  videoHeight: number,
  previewWidth: number,
  previewHeight: number,
): ICrop {
  if (!previewWidth || !previewHeight) {
    return {
      x: 0,
      y: 0,
      width: videoWidth,
      height: videoHeight,
    };
  }

  const videoAspect = videoWidth / videoHeight;
  const previewAspect = previewWidth / previewHeight;

  if (videoAspect > previewAspect) {
    const width = Math.max(1, Math.round(videoHeight * previewAspect));

    return {
      x: Math.round((videoWidth - width) / 2),
      y: 0,
      width,
      height: videoHeight,
    };
  }

  if (videoAspect < previewAspect) {
    const height = Math.max(1, Math.round(videoWidth / previewAspect));

    return {
      x: 0,
      y: Math.round((videoHeight - height) / 2),
      width: videoWidth,
      height,
    };
  }

  return {
    x: 0,
    y: 0,
    width: videoWidth,
    height: videoHeight,
  };
}

function getZoomedCrop(base: ICrop, zoom: number): ICrop {
  if (zoom <= MIN_ZOOM) {
    return base;
  }

  const width = base.width / zoom;
  const height = base.height / zoom;

  return {
    x: base.x + (base.width - width) / 2,
    y: base.y + (base.height - height) / 2,
    width,
    height,
  };
}

export function captureFrame(
  video: HTMLVideoElement,
  zoom: number,
): ICapturedPhoto {
  if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
    throw new Error('Câmera ainda não está pronta.');
  }

  const { videoWidth, videoHeight } = video;

  if (!videoWidth || !videoHeight) {
    throw new Error('Câmera ainda não está pronta.');
  }

  const baseCrop = getVisibleVideoCrop(
    videoWidth,
    videoHeight,
    video.clientWidth,
    video.clientHeight,
  );
  const sourceCrop = getZoomedCrop(baseCrop, zoom);

  const canvas = document.createElement('canvas');
  canvas.width = baseCrop.width;
  canvas.height = baseCrop.height;

  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Não foi possível capturar a foto.');
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(
    video,
    sourceCrop.x,
    sourceCrop.y,
    sourceCrop.width,
    sourceCrop.height,
    0,
    0,
    baseCrop.width,
    baseCrop.height,
  );

  return {
    uri: canvas.toDataURL('image/jpeg', MEAL_IMAGE_CAPTURE_JPEG_QUALITY),
    width: baseCrop.width,
    height: baseCrop.height,
  };
}
