import { StyleSheet } from 'react-native';
import { theme } from '@/ui/styles/theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.gray[400],
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },

  badgePro: {
    backgroundColor: theme.colors.lime['700/10'],
    borderColor: theme.colors.lime[700],
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  badgeFree: {
    backgroundColor: theme.colors.gray[200],
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  badgeWarning: {
    backgroundColor: theme.colors.support['red/10'],
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  warningRow: {
    backgroundColor: theme.colors.gray[100],
    borderRadius: 8,
    padding: 10,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.gray[100],
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  quotaBlock: {
    gap: 6,
    marginTop: 4,
  },

  quotaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  quotaTrack: {
    height: 4,
    borderRadius: 999,
    backgroundColor: theme.colors.gray[200],
    overflow: 'hidden',
  },

  quotaFill: {
    height: 4,
    borderRadius: 999,
  },
});
