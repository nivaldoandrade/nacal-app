import type { StyleProp, ViewStyle } from 'react-native';

export interface ICapturedPhoto {
  uri: string;
  width: number;
  height: number;
}

export interface ICameraCaptureRef {
  takePictureAsync: () => Promise<ICapturedPhoto>;
}

export interface ICameraCaptureProps {
  style?: StyleProp<ViewStyle>;
}
