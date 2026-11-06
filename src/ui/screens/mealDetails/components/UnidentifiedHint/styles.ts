import { theme } from '@/ui/styles/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: theme.colors.gray[400],
    borderRadius: 16,
    backgroundColor: theme.colors.white,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  iconWell: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.lime['700/10'],
  },

  texts: {
    flex: 1,
    gap: 2,
  },
});
