import AsyncStorage from '@react-native-async-storage/async-storage';

export class YearlyExpiryNoticeStorage {
  private static KEY = '@nacal:yearly-expiry-notice-dismissed';

  static async dismiss(paidUntil: Date) {
    try {
      await AsyncStorage.setItem(this.KEY, paidUntil.toISOString());
    } catch {
      return;
    }
  }

  static async isDismissed(paidUntil: Date): Promise<boolean> {
    try {
      return await AsyncStorage.getItem(this.KEY) === paidUntil.toISOString();
    } catch {
      return false;
    }
  }
}
