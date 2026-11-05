import { theme } from '@/ui/styles/theme';
import { cva, VariantProps } from '@/ui/styles/utils/cva';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },

  inputContainer: {
    position: 'relative',
    flex: 1,
  },

  adornmentPadding: {
    paddingRight: 48,
  },

  adornment: {
    position: 'absolute',
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  adormentDisabled: {
    opacity: 0.5,
  },

  sufix: {
    minWidth: 56,
    padding: 14,
    backgroundColor: theme.colors.gray[100],
    borderRadius: 10,
    textAlign: 'center',
  },
});

const inputBase = {
  flex: 1,
  borderWidth: 1,
  borderRadius: 10,
  padding: 14,
  minHeight: 52,
  fontFamily: theme.fontFamily.sans.regular,
  fontSize: theme.fontSize.base,
};

const disabledVariant = {
  true: {
    opacity: 0.5,
  },
  false: {
    opacity: 1,
  },
};

export const input = cva({
  base: {
    ...inputBase,
    backgroundColor: theme.colors.white,
    color: theme.colors.black[700],
  },
  variants: {
    intent: {
      default: {
        borderColor: theme.colors.gray[400],
      },
      focus: {
        borderColor: theme.colors.black[700],
      },
      error: {
        borderColor: theme.colors.support.red,
      },
    },
    disabled: disabledVariant,
  },
  defaultVariants: {
    intent: 'default',
    disabled: false,
  },
});

export const inputDark = cva({
  base: {
    ...inputBase,
    backgroundColor: theme.colors.black[700],
    color: theme.colors.gray[100],
  },
  variants: {
    intent: {
      default: {
        borderColor: theme.colors.gray['700/50'],
      },
      focus: {
        borderColor: theme.colors.lime[600],
      },
      error: {
        borderColor: theme.colors.support.red,
      },
    },
    disabled: disabledVariant,
  },
  defaultVariants: {
    intent: 'default',
    disabled: false,
  },
});

export type InputVariant = VariantProps<typeof input>;
