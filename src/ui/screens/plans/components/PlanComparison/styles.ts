import { StyleSheet } from 'react-native';
import { theme } from '@/ui/styles/theme';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },

  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },

  freeCard: {
    backgroundColor: theme.colors.gray[100],
    borderColor: theme.colors.gray[400],
  },

  proCard: {
    backgroundColor: theme.colors.lime['700/10'],
    borderColor: theme.colors.lime[700],
  },

  proHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },

  pill: {
    backgroundColor: theme.colors.lime[400],
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },

  features: {
    gap: 8,
  },

  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },

  featureText: {
    flex: 1,
  },
});
