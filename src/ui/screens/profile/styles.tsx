import { theme } from '@/ui/styles/theme';
import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },

  content: {
    paddingTop: 32,
    paddingHorizontal: 20,
    gap: 24,
  },

  pressed: {
    opacity: Platform.OS === 'web' ? 0.4 : 0.7,
  },

  section: {
    gap: 8,
  },

  rowText: {
    flex: 1,
    gap: 2,
  },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.gray[400],
    borderRadius: 16,
    padding: 16,
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

  planBadgeFree: {
    backgroundColor: theme.colors.gray[200],
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

  listCard: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.gray[400],
    borderRadius: 16,
    paddingHorizontal: 16,
  },

  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },

  listRowDivider: {
    borderBottomWidth: 1,
    borderColor: theme.colors.gray[400],
  },

  sheet: {
    paddingHorizontal: 24,
    paddingTop: 10,
    gap: 24,
  },

  sheetHeader: {
    gap: 8,
  },

  sheetTitle: {
    letterSpacing: -0.4,
  },

  sheetInfo: {
    backgroundColor: theme.colors.gray[100],
    borderWidth: 1,
    borderColor: theme.colors.gray[400],
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },

  sheetFooter: {
    gap: 8,
  },
});
