import { STORAGE_KEYS } from '../utils/constants';

class StorageService {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  }

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
      return false;
    }
  }

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  }

  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
      return false;
    }
  }

  // Auth specific convenience helpers
  getAuthState() {
    const user = this.get(STORAGE_KEYS.AUTH_USER, null);
    const token = this.get(STORAGE_KEYS.AUTH_TOKEN, null);
    const step1Complete = Boolean(this.get(STORAGE_KEYS.AUTH_STEP, false));
    const isAuthenticated = Boolean(
      this.get(STORAGE_KEYS.AUTH_IS_AUTHENTICATED, false)
    );

    return {
      user,
      token,
      step1Complete,
      isAuthenticated,
    };
  }

  // Step 1 complete: OTP issued, waiting for verification
  savePendingOtp({ email, otpId, user }) {
    this.set(STORAGE_KEYS.AUTH_OTP_EMAIL, email);
    this.set(STORAGE_KEYS.AUTH_OTP_ID, otpId);
    if (user) this.set(STORAGE_KEYS.AUTH_USER, user);
    this.set(STORAGE_KEYS.AUTH_STEP, true);
    this.set(STORAGE_KEYS.AUTH_IS_AUTHENTICATED, false);
  }

  getPendingOtp() {
    return {
      email: this.get(STORAGE_KEYS.AUTH_OTP_EMAIL, null),
      otpId: this.get(STORAGE_KEYS.AUTH_OTP_ID, null),
    };
  }

  // Step 2 complete: full session established
  saveSession({ accessToken, refreshToken, user }) {
    this.set(STORAGE_KEYS.AUTH_TOKEN, accessToken);
    if (refreshToken) {
      this.set(STORAGE_KEYS.AUTH_REFRESH_TOKEN, refreshToken);
    }
    if (user) this.set(STORAGE_KEYS.AUTH_USER, user);
    this.set(STORAGE_KEYS.AUTH_STEP, true);
    this.set(STORAGE_KEYS.AUTH_IS_AUTHENTICATED, true);
    this.remove(STORAGE_KEYS.AUTH_OTP_ID);
    this.remove(STORAGE_KEYS.AUTH_OTP_EMAIL);
  }

  clearAuthState() {
    this.remove(STORAGE_KEYS.AUTH_TOKEN);
    this.remove(STORAGE_KEYS.AUTH_REFRESH_TOKEN);
    this.remove(STORAGE_KEYS.AUTH_USER);
    this.remove(STORAGE_KEYS.AUTH_STEP);
    this.remove(STORAGE_KEYS.AUTH_IS_AUTHENTICATED);
    this.remove(STORAGE_KEYS.AUTH_OTP_ID);
    this.remove(STORAGE_KEYS.AUTH_OTP_EMAIL);
  }
}

export const storageService = new StorageService();
export default storageService;
