import * as SecureStore from 'expo-secure-store';

// TODO: replace with your actual base URL
const BASE_URL = 'https://your-api.metromindz.com';

const ensureBaseUrl = () => {
  if (__DEV__ && BASE_URL.includes('your-api')) {
    throw new Error('Set BASE_URL in authService.ts before testing API calls.');
  }
};

const TOKEN_KEY = 'hrms_jwt';

// ── Token storage (expo-secure-store: native = Keychain/Keystore, web = localStorage encrypted) ──
export const saveToken  = (token: string) => SecureStore.setItemAsync(TOKEN_KEY, token);
export const getToken   = () => SecureStore.getItemAsync(TOKEN_KEY);
export const clearToken = () => SecureStore.deleteItemAsync(TOKEN_KEY);

// ── CAPTCHA ──
export interface CaptchaResponse {
  success: boolean;
  image: string;       // SVG string
  captchaToken: string;
}

export const fetchCaptcha = async (): Promise<CaptchaResponse> => {
  ensureBaseUrl();
  const res = await fetch(`${BASE_URL}/captcha`);
  if (!res.ok) throw new Error('Failed to fetch CAPTCHA');
  return res.json();
};

// ── Login ──
export interface LoginPayload {
  password: string;
  captcha: string;
  captchaToken: string;
  email?: string;
  employeeId?: string;
}

export interface LoginSuccess {
  success: true;
  message: string;
  token: string;
  user: { _id: string; name: string; role: string; permissions: string[] };
}

export interface LoginError {
  message: string;
  captchaInvalid?: boolean;
  locked?: boolean;
  lockoutUntil?: string;
  remainingMinutes?: number;
  warned?: boolean;
  failedAttempts?: number;
  attemptsLeft?: number;
}

export const loginApi = async (
  payload: LoginPayload,
): Promise<{ ok: boolean; status: number; data: LoginSuccess | LoginError }> => {
  ensureBaseUrl();
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
};

// ── Profile ──
export const fetchProfile = async () => {
  ensureBaseUrl();
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
};

// ── Logout ──
export const logoutApi = async () => {
  ensureBaseUrl();
  const token = await getToken();
  await fetch(`${BASE_URL}/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => {});
  await clearToken();
};
