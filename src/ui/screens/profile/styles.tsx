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

  avatar: {
    alignItems: 'center',
    marginBottom: 32,
  },

  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: theme.colors.gray[400],
  },

  planSection: {
    gap: 8,
  },

  planCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.gray[400],
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },

  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  planBadgePro: {
    backgroundColor: theme.colors.lime['700/10'],
    borderColor: theme.colors.lime[700],
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  installRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  installIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.gray[200],
  },

  legalCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.gray[400],
    borderRadius: 16,
    paddingHorizontal: 16,
  },

  legalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },

  legalRowDivider: {
    borderBottomWidth: 1,
    borderColor: theme.colors.gray[400],
  },

  legalRowText: {
    flex: 1,
    gap: 2,
  },

  planBadgeFree: {
    backgroundColor: theme.colors.gray[200],
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});
