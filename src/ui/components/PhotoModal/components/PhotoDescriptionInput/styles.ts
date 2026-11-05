import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    paddingHorizontal: 20,
    gap: 6,
  },

  input: {
    maxHeight: 96,
    textAlignVertical: 'top',
  },

  helper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
});
