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
    const isAuthenticated = Boolean(this.get(STORAGE_KEYS.AUTH_IS_AUTHENTICATED, false));

    return {
      user,
      token,
      step1Complete,
      isAuthenticated,
    };
  }

  saveStep1Success(user) {
    this.set(STORAGE_KEYS.AUTH_USER, user);
    this.set(STORAGE_KEYS.AUTH_STEP, true);
    this.set(STORAGE_KEYS.AUTH_IS_AUTHENTICATED, false);
  }

  saveTwoFactorSuccess(token, user) {
    this.set(STORAGE_KEYS.AUTH_TOKEN, token);
    if (user) this.set(STORAGE_KEYS.AUTH_USER, user);
    this.set(STORAGE_KEYS.AUTH_STEP, true);
    this.set(STORAGE_KEYS.AUTH_IS_AUTHENTICATED, true);
  }

  clearAuthState() {
    this.remove(STORAGE_KEYS.AUTH_TOKEN);
    this.remove(STORAGE_KEYS.AUTH_USER);
    this.remove(STORAGE_KEYS.AUTH_STEP);
    this.remove(STORAGE_KEYS.AUTH_IS_AUTHENTICATED);
  }
}

export const storageService = new StorageService();
export default storageService;
