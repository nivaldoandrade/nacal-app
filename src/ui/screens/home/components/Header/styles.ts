import { theme } from '@/ui/styles/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
  },

  content: {
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },

  divider: {
    width: '100%',
    height: 2,
    backgroundColor: theme.colors.gray[200],
  },
});
