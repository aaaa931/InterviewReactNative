import * as Keychain from 'react-native-keychain';
import { Buffer } from 'buffer';
import axios, { httpPost } from '../utils/axios';

function jwtDecode(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    Buffer.from(base64, 'base64')
      .toString()
      .split('')
      .map(c => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join(''),
  );

  return JSON.parse(jsonPayload);
}

export const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }

  const decoded = jwtDecode(accessToken);

  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

export const tokenExpired = (exp: number, callback?: () => void) => {
  // eslint-disable-next-line prefer-const
  let expiredTimer: ReturnType<typeof setTimeout> | null = null;

  const currentTime = Date.now();

  // Test token expires after 10s
  // const timeLeft = currentTime + 10000 - currentTime; // ~10s
  const timeLeft = exp * 1000 - currentTime;

  if (expiredTimer) clearTimeout(expiredTimer);

  expiredTimer = setTimeout(async () => {
    const credentials = await Keychain.getGenericPassword();
    if (!credentials) return;

    const refreshData = await httpPost('/api/token/refresh', {
      refreshToken: credentials.password,
    });

    await Keychain.resetGenericPassword();
    await Keychain.setGenericPassword('token', refreshData.refreshToken);

    clearTimeout(expiredTimer as ReturnType<typeof setTimeout>);

    // if (callback) {
    //   callback();
    // }

    const { exp } = jwtDecode(refreshData.refreshToken);
    tokenExpired(exp, callback);
  }, timeLeft);
};

export const setSession = async (
  accessToken: string | null,
  callback?: () => void,
) => {
  if (accessToken) {
    await Keychain.setGenericPassword('token', accessToken);

    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    const { exp } = jwtDecode(accessToken);
    tokenExpired(exp, callback);
  } else {
    await Keychain.resetGenericPassword();

    delete axios.defaults.headers.common.Authorization;
  }
};
