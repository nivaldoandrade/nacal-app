import { theme } from '@/ui/styles/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },

  cameraErrorOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },

  cameraErrorIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.lime['700/10'],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  cameraErrorTitle: {
    textAlign: 'center',
  },

  cameraErrorDescription: {
    textAlign: 'center',
    maxWidth: 280,
  },

  zoomBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: theme.colors.scrim,
  },
});
