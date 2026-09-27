import AsyncStorage from '@react-native-async-storage/async-storage';

export class AuthTokenManager {
  private static KEY = '@nacal:authtokens';

  static async save(tokens: AuthTokenManager.Tokens) {
    await AsyncStorage.setItem(this.KEY, JSON.stringify(tokens));
  }

  static async get(): Promise<AuthTokenManager.Tokens | null> {
    try {
      const jsonTokensValue = await AsyncStorage.getItem(this.KEY);

      if (!jsonTokensValue) {
        return null;
      }

      return JSON.parse(jsonTokensValue) as AuthTokenManager.Tokens;
    } catch {
      return null;
    }
  }

  static async remove() {
    await AsyncStorage.removeItem(this.KEY);
  }
}

namespace AuthTokenManager {
  export type Tokens = {
    accessToken: string;
    refreshToken: string;
  }
}
