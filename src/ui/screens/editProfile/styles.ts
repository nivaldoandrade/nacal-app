import { theme } from '@/ui/styles/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },

  content: {
    paddingTop: 32,
    paddingHorizontal: 20,
    gap: 24,
    paddingBottom: 32,
  },

  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: theme.colors.gray[400],
  },
});
