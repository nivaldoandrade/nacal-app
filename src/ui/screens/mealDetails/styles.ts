import { theme } from '@/ui/styles/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  divider: {
    borderWidth: 1,
    borderColor: theme.colors.gray[400],
    borderStyle: 'dashed',
  },

  listHeader: {
    padding: 20,
    gap: 24,
    paddingBottom: 8,
  },

  foodContainer: {
    marginHorizontal: 20,
    padding: 14,
    borderBottomWidth: 1,
    borderColor: theme.colors.gray[400],
    gap: 4,
  },

  listFooter: {
    marginHorizontal: 20,
    marginTop: 24,
  },
});
