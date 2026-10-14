import { theme } from '@/ui/styles/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.lime[900],
  },

  wrapper: {
    flex: 1,
    paddingHorizontal: 24,
  },

  content: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: 32,
    paddingVertical: 24,
  },

  header: {
    alignItems: 'center',
    gap: 12,
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    backgroundColor: theme.colors.gray[200],
    marginBottom: 12,
  },

  title: {
    textAlign: 'center',
    letterSpacing: -0.32,
  },

  titleHighlight: {
    color: theme.colors.lime[500],
  },

  subtitle: {
    textAlign: 'center',
  },

  comparisonState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },

  tray: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: 16,
  },

  footer: {
    gap: 12,
    paddingTop: 8,
  },

  hint: {
    textAlign: 'center',
  },
});
