import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { getBrowserWindow } from './browser';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_ID_KEY = 'user_id';
const USER_ROLE_KEY = 'user_role';

const getSessionStorage = () => {
  const browser = getBrowserWindow();
  if (!browser) {
    throw new Error('Browser storage is unavailable.');
  }
  return browser.sessionStorage;
};

const setItem = (key: string, value: string): Promise<void> =>
  Platform.OS === 'web'
    ? Promise.resolve().then(() => {
        getSessionStorage().setItem(key, value);
      })
    : SecureStore.setItemAsync(key, value);

const getItem = (key: string): Promise<string | null> =>
  Platform.OS === 'web'
    ? Promise.resolve().then(() => getSessionStorage().getItem(key))
    : SecureStore.getItemAsync(key);

const deleteItem = (key: string): Promise<void> =>
  Platform.OS === 'web'
    ? Promise.resolve().then(() => {
        getSessionStorage().removeItem(key);
      })
    : SecureStore.deleteItemAsync(key);

export const TokenStorage = {
  saveTokens: async (accessToken: string, refreshToken: string): Promise<void> => {
    await setItem(ACCESS_TOKEN_KEY, accessToken);
    await setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  saveAccessToken: (accessToken: string): Promise<void> =>
    setItem(ACCESS_TOKEN_KEY, accessToken),

  saveRefreshToken: (refreshToken: string): Promise<void> =>
    setItem(REFRESH_TOKEN_KEY, refreshToken),

  getAccessToken: (): Promise<string | null> => getItem(ACCESS_TOKEN_KEY),

  getRefreshToken: (): Promise<string | null> => getItem(REFRESH_TOKEN_KEY),

  clearTokens: async (): Promise<void> => {
    await deleteItem(ACCESS_TOKEN_KEY);
    await deleteItem(REFRESH_TOKEN_KEY);
  },

  hasTokens: async (): Promise<boolean> => {
    const token = await getItem(ACCESS_TOKEN_KEY);
    return token !== null;
  },
};

export const UserStorage = {
  saveUserId: (userId: string) => setItem(USER_ID_KEY, userId),

  getUserId: () => getItem(USER_ID_KEY),

  saveUserRole: (role: string) => setItem(USER_ROLE_KEY, role),

  getUserRole: () => getItem(USER_ROLE_KEY),

  clear: async () => {
    await deleteItem(USER_ID_KEY);
    await deleteItem(USER_ROLE_KEY);
  },
};

export const clearAllStorage = async (): Promise<void> => {
  await Promise.all([TokenStorage.clearTokens(), UserStorage.clear()]);
};
