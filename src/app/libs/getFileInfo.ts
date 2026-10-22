import {
  getScaledImageSize,
  MEAL_IMAGE_JPEG_QUALITY,
} from '@/app/config/mealImage';
import { File } from 'expo-file-system';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { Image as RNImage, Platform } from 'react-native';

const SUPPORTED_MIME_TYPE_EXTENSIONS: Record<string, string> = {
  'audio/m4a': 'm4a',
  'audio/webm': 'webm',
  'image/jpeg': 'jpg',
};

const AUDIO_MIME_TYPE_ALIASES: Record<string, string> = {
  'audio/m4a': 'audio/m4a',
  'audio/mp4': 'audio/m4a',
  'audio/webm': 'audio/webm',
  'audio/x-m4a': 'audio/m4a',
};

export async function getFileInfo(fileOrUri: string | globalThis.File) {
  try {
    if (Platform.OS === 'web') {
      const file = await resolveWebFile(fileOrUri);
      const optimizedFile = await optimizeWebImageFile(file);

      if (!optimizedFile.size) {
        throw new Error('File does not exist.');
      }

      if (!isSupportedMimeType(optimizedFile.type)) {
        throw new Error(`Unsupported MIME type: ${optimizedFile.type}.`);
      }

      return {
        uri: typeof fileOrUri === 'string' ? fileOrUri : '',
        size: optimizedFile.size,
        mimeType: optimizedFile.type,
        file: optimizedFile,
      } as const;
    }

    const fileUri = fileOrUri as string;
    const filename = fileUri.split('/').at(-1);

    if (!filename) {
      throw new Error('File does not exist.');
    }

    if (isNativeImageFile(filename)) {
      const optimizedImage = await optimizeNativeImageFile(fileUri);
      const optimizedFilename = optimizedImage.uri.split('/').at(-1);
      const optimizedFileInfo = new File(optimizedImage.uri).info();

      if (!optimizedFilename || !optimizedFileInfo.exists || !optimizedFileInfo.size) {
        throw new Error('File does not exist.');
      }

      return {
        uri: optimizedImage.uri,
        filename: optimizedFilename,
        size: optimizedFileInfo.size,
        mimeType: 'image/jpeg',
      } as const;
    }

    const fileInfo = new File(fileUri).info();

    if (!fileInfo.exists || !fileInfo.size) {
      throw new Error('File does not exist.');
    }

    return {
      uri: fileUri,
      filename: filename,
      size: fileInfo.size,
      mimeType: 'audio/m4a',
    } as const;
  } catch (error) {
    console.log('Error file info:', error);
    throw error;
  }
}

function isNativeImageFile(filename: string): boolean {
  return /\.(jpe?g|png|webp|heic|heif)$/i.test(filename);
}

async function optimizeNativeImageFile(uri: string) {
  const { width, height } = await new Promise<{ width: number; height: number }>(
    (resolve, reject) => {
      RNImage.getSize(
        uri,
        (naturalWidth, naturalHeight) => resolve({
          width: naturalWidth,
          height: naturalHeight,
        }),
        reject,
      );
    },
  );

  const scaledSize = getScaledImageSize(width, height);
  const context = ImageManipulator.manipulate(uri);

  if (scaledSize.width !== width || scaledSize.height !== height) {
    context.resize({
      width: scaledSize.width,
      height: scaledSize.height,
    });
  }

  const image = await context.renderAsync();

  return image.saveAsync({
    compress: MEAL_IMAGE_JPEG_QUALITY,
    format: SaveFormat.JPEG,
  });
}

function getBaseMimeType(mimeType: string): string {
  return mimeType.split(';')[0]?.trim().toLowerCase() ?? '';
}

function getMimeTypeExtension(mimeType: string): string {
  return SUPPORTED_MIME_TYPE_EXTENSIONS[mimeType] ?? 'bin';
}

function isSupportedMimeType(mimeType: string): boolean {
  return mimeType in SUPPORTED_MIME_TYPE_EXTENSIONS;
}

function normalizeAudioMimeType(mimeType: string): string {
  const normalizedMimeType = AUDIO_MIME_TYPE_ALIASES[getBaseMimeType(mimeType)];

  if (!normalizedMimeType) {
    throw new Error(`Unsupported audio MIME type: ${mimeType}.`);
  }

  return normalizedMimeType;
}

function loadImage(file: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Unable to load image.'));
    };

    image.src = objectUrl;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Unable to encode image.'));
        return;
      }

      resolve(blob);
    }, 'image/jpeg', MEAL_IMAGE_JPEG_QUALITY);
  });
}

async function optimizeWebImageFile(
  file: globalThis.File,
): Promise<globalThis.File> {
  if (!file.type.startsWith('image/')) {
    return file;
  }

  const image = await loadImage(file);

  if (!image.naturalWidth || !image.naturalHeight) {
    throw new Error('Image has no dimensions.');
  }

  const { width, height } = getScaledImageSize(
    image.naturalWidth,
    image.naturalHeight,
  );

  if (
    file.type === 'image/jpeg' &&
    width === image.naturalWidth &&
    height === image.naturalHeight
  ) {
    return file;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Canvas context unavailable');
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  const blob = await canvasToBlob(canvas);
  const filename = `${crypto.randomUUID()}.jpg`;

  return new globalThis.File([blob], filename, { type: 'image/jpeg' });
}

function isBase64Uri(uri: string): boolean {
  return uri.startsWith('data:');
}

function isBlobUri(uri: string): boolean {
  return uri.startsWith('blob:');
}

async function base64ToFile(dataUri: string): Promise<globalThis.File> {
  const [header, data] = dataUri.split(',');
  const rawMimeType = header.match(/:(.*?);/)?.[1] ?? 'application/octet-stream';
  const baseMimeType = getBaseMimeType(rawMimeType);
  const mimeType = baseMimeType.startsWith('image/')
    ? baseMimeType
    : normalizeAudioMimeType(baseMimeType);

  const byteString = atob(data);
  const byteArray = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([byteArray], { type: mimeType });
  const filename = `${crypto.randomUUID()}.${getMimeTypeExtension(mimeType)}`;

  return new globalThis.File([blob], filename, { type: mimeType });
}

async function blobUriToFile(blobUri: string): Promise<globalThis.File> {
  const response = await fetch(blobUri);
  const blob = await response.blob();
  const baseMimeType = getBaseMimeType(blob.type || 'audio/webm');
  const mimeType = baseMimeType.startsWith('image/')
    ? baseMimeType
    : normalizeAudioMimeType(baseMimeType);
  const filename = `${crypto.randomUUID()}.${getMimeTypeExtension(mimeType)}`;

  return new globalThis.File([blob], filename, { type: mimeType });
}

async function resolveWebFile(fileOrUri: string | globalThis.File): Promise<globalThis.File> {
  if (typeof fileOrUri !== 'string') {
    return fileOrUri;
  }

  if (isBase64Uri(fileOrUri)) {
    return base64ToFile(fileOrUri);
  }

  if (isBlobUri(fileOrUri)) {
    return blobUriToFile(fileOrUri);
  }

  throw new Error('Unsupported URI format on web.');
}
