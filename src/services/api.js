import axios from 'axios';
import storageService from './storage.service';
import { ROUTES, STORAGE_KEYS } from '../utils/constants';

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:7080/api/v1';

const AUTH_PATHS = ['/auth/'];

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Attach the access token to every authenticated request
api.interceptors.request.use((config) => {
  const token = storageService.get(STORAGE_KEYS.AUTH_TOKEN);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.';

    const requestUrl = error.config?.url || '';
    const isAuthRequest = AUTH_PATHS.some((path) => requestUrl.includes(path));

    // Expired/invalid session on a protected route -> back to login
    if (status === 401 && !isAuthRequest) {
      storageService.clearAuthState();

      if (window.location.pathname !== ROUTES.LOGIN) {
        window.location.href = ROUTES.LOGIN;
      }
    }

    // Normalize the error so callers always get a readable message
    error.message = message;
    return Promise.reject(error);
  }
);

export { api };
export default api;
