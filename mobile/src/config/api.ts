import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { getBrowserWindow } from '@/utils/browser';

const configuredApiUrl =
  process.env.EXPO_PUBLIC_API_URL ??
  Constants.expoConfig?.extra?.apiUrl ??
  'http://localhost:3000';

const resolveApiOrigin = (): string => {
  const url = new URL(configuredApiUrl);
  const browser = getBrowserWindow();

  if (
    !process.env.EXPO_PUBLIC_API_URL &&
    Platform.OS === 'web' &&
    browser
  ) {
    url.hostname = browser.location.hostname;
  } else if (!process.env.EXPO_PUBLIC_API_URL && Platform.OS !== 'web') {
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
      url.hostname = new URL(`http://${hostUri}`).hostname;
    }
  }

  return url.toString().replace(/\/$/, '');
};

export const API_ORIGIN = resolveApiOrigin();
export const API_BASE_URL = `${API_ORIGIN}/api`;
