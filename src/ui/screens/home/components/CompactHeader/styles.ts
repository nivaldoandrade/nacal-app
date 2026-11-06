import { theme } from '@/ui/styles/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: theme.colors.lime[400],
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
  },

  content: {
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  dateLabel: {
    flexShrink: 1,
    letterSpacing: 1.28,
  },

  track: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: theme.colors['white/40'],
  },

  fill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: theme.colors.support.tomato,
  },
});
