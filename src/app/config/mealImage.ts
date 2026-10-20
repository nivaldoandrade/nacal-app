export const MEAL_IMAGE_MAX_DIMENSION = 1024;

export const MEAL_IMAGE_JPEG_QUALITY = 0.9;

export const MEAL_IMAGE_CAPTURE_JPEG_QUALITY = 0.95;

export function getScaledImageSize(
  width: number,
  height: number,
  maxDimension = MEAL_IMAGE_MAX_DIMENSION,
) {
  const longestSide = Math.max(width, height);

  if (longestSide <= maxDimension) {
    return { width, height };
  }

  const scale = maxDimension / longestSide;

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}
