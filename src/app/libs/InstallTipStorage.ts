import AsyncStorage from '@react-native-async-storage/async-storage';

export const INSTALL_TIP_SNOOZE_DAYS = 7;

const SNOOZE_MS = INSTALL_TIP_SNOOZE_DAYS * 24 * 60 * 60 * 1000;

export class InstallTipStorage {
  private static KEY = '@nacal:install-tip-dismissed-at';

  static async snooze() {
    try {
      await AsyncStorage.setItem(this.KEY, String(Date.now()));
    } catch {
      // Sem storage, o tutorial só volta na próxima sessão.
    }
  }

  static async isSnoozed(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(this.KEY);

      if (!value) {
        return false;
      }

      const dismissedAt = Number(value);

      if (Number.isNaN(dismissedAt)) {
        return false;
      }

      return Date.now() - dismissedAt < SNOOZE_MS;
    } catch {
      return false;
    }
  }
}
