import { getCalendars } from 'expo-localization';

export function getDeviceTimeZone(): string | undefined {
  try {
    const timeZone = getCalendars()[0]?.timeZone;

    if (timeZone) {
      return timeZone;
    }
  } catch {
    // expo-localization unavailable fall back to Intl below.
  }

  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
  } catch {
    return undefined;
  }
}
