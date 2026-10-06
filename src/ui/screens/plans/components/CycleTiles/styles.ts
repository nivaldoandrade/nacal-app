import { StyleSheet } from 'react-native';
import { theme } from '@/ui/styles/theme';

export const styles = StyleSheet.create({
  container: {
    gap: 12,
  },

  tile: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.gray[400],
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },

  tileSelected: {
    backgroundColor: theme.colors.lime['700/10'],
    borderColor: theme.colors.lime[700],
  },

  tileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.gray[500],
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioSelected: {
    borderColor: theme.colors.lime[700],
  },

  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.lime[700],
  },

  discountBadge: {
    backgroundColor: theme.colors.lime[400],
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
});
