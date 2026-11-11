import { theme } from '@/ui/styles/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.gray[400],
    backgroundColor: theme.colors.gray[100],
  },

  urgent: {
    borderColor: theme.colors.support.orange,
  },

  link: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  message: {
    flex: 1,
  },

  dismiss: {
    paddingVertical: 10,
    paddingRight: 12,
    paddingLeft: 4,
  },
});
