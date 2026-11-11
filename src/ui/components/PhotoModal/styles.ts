import { theme } from '@/ui/styles/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
    paddingHorizontal: 20,
  },

  keyboardAvoiding: {
    flex: 1,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  permissionContainer: {
    alignItems: 'center',
    gap: 12,
    maxWidth: 260,
  },

  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.lime['700/5'],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.lime[900],
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.lime[700],
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginTop: 4,
  },

  cameraAndPhotoContainer: {
    flex: 1,
    width: '100%',
  },

  framingHint: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    pointerEvents: 'none',
  },

  footer: {
    minHeight: 200,
    alignItems: 'center',
    marginTop: 24,
    gap: 16,
  },
});
