import { StyleSheet } from 'react-native';
import { theme } from '@/ui/styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },

  content: {
    padding: 20,
    gap: 16,
  },

  block: {
    gap: 12,
  },

  ctaBlock: {
    gap: 12,
    marginTop: 4,
  },

  fullWidth: {
    width: '100%',
  },

  focusCard: {
    borderWidth: 1,
    borderColor: theme.colors.gray[400],
    borderRadius: 16,
    backgroundColor: theme.colors.gray[100],
    padding: 16,
    gap: 8,
  },

  cancelActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },

  centerBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 64,
    paddingHorizontal: 20,
  },

  hint: {
    textAlign: 'center',
  },
});
