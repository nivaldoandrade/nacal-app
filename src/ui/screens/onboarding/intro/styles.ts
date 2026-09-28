import { theme } from '@/ui/styles/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  iconWell: {
    alignSelf: 'center',
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: theme.colors.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 44,
  },
  footer: {
    alignItems: 'stretch',
    gap: 16,
    marginBottom: 34,
  },
});
