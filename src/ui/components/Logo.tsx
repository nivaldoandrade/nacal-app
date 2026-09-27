import wordmarkOnDark from '@/ui/assets/wordmark-on-dark.png';
import wordmarkOnLight from '@/ui/assets/wordmark-on-light.png';
import { Image, ImageProps } from 'react-native';

type WordmarkVariant = 'onDark' | 'onLight';

interface ILogo extends Omit<ImageProps, 'source' | 'resizeMode'> {
  width?: number;
  height?: number;
  variant?: WordmarkVariant;
}

const WORDMARK_ASPECT = 822 / 217;

export function Logo({
  width = 274,
  height,
  variant = 'onDark',
  style,
  ...props
}: ILogo) {
  const resolvedHeight = height ?? Math.round(width / WORDMARK_ASPECT);

  return (
    <Image
      {...props}
      source={variant === 'onLight' ? wordmarkOnLight : wordmarkOnDark}
      resizeMode='contain'
      style={[{ width, height: resolvedHeight }, style]}
    />
  );
}
