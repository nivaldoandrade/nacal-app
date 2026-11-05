import { theme } from '@/ui/styles/theme';
import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.lime[400],
  },

  refreshControl: {
    zIndex: 1,
  },

  listArea: {
    flex: 1,
    marginTop: -8,
    overflow: 'hidden',
  },

  flatListContainer: {
    minHeight: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: Platform.OS === 'web' ? 0 : 16,
    borderBottomRightRadius: Platform.OS === 'web' ? 0 : 16,
    backgroundColor: theme.colors.white,
  },
});
