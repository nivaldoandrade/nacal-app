import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
    paddingHorizontal: 20,
  },

  keyboardAvoiding: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 24,
  },

  titleContainer: {
    gap: 8,
  },

  input: {
    minHeight: 96,
    maxHeight: 160,
    textAlignVertical: 'top',
  },

  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
});
