import React, { useState, useCallback } from 'react';
import { AuthContext } from './AuthContextInstance';
import authService from '../modules/auth/services/auth.service';

export { AuthContext };

export function AuthProvider({ children }) {
  // Initialize state lazily from storage without cascading effect renders
  const [authState, setAuthState] = useState(() => {
    try {
      const saved = authService.getInitialState();
      return {
        user: saved.user || null,
        token: saved.token || null,
        step1Complete: Boolean(saved.step1Complete),
        isAuthenticated: Boolean(saved.isAuthenticated),
      };
    } catch {
      return {
        user: null,
        token: null,
        step1Complete: false,
        isAuthenticated: false,
      };
    }
  });

  const [loading] = useState(false);
  const [authError, setAuthError] = useState(null);

  /**
   * Step 1: Sign in with credentials
   */
  const login = useCallback(async (email, password) => {
    setAuthError(null);
    try {
      const response = await authService.signIn(email, password);
      setAuthState({
        user: response.user,
        token: null,
        step1Complete: true,
        isAuthenticated: false,
      });
      return response;
    } catch (error) {
      const msg = error.message || 'Authentication failed. Please verify credentials.';
      setAuthError(msg);
      throw error;
    }
  }, []);

  /**
   * Step 2: Verify 2FA OTP
   */
  const verifyTwoFactor = useCallback(async (code) => {
    setAuthError(null);
    try {
      const response = await authService.verifyTwoFactor(code, authState.user);
      setAuthState((prev) => ({
        ...prev,
        token: response.token,
        isAuthenticated: true,
      }));
      return response;
    } catch (error) {
      const msg = error.message || 'Verification failed. Please check your code.';
      setAuthError(msg);
      throw error;
    }
  }, [authState.user]);

  /**
   * Reset back to Step 1
   */
  const resetToStep1 = useCallback(() => {
    authService.logout();
    setAuthState({
      user: null,
      token: null,
      step1Complete: false,
      isAuthenticated: false,
    });
    setAuthError(null);
  }, []);

  /**
   * Full Logout
   */
  const logout = useCallback(async () => {
    await authService.logout();
    setAuthState({
      user: null,
      token: null,
      step1Complete: false,
      isAuthenticated: false,
    });
    setAuthError(null);
  }, []);

  const value = {
    user: authState.user,
    token: authState.token,
    step1Complete: authState.step1Complete,
    isAuthenticated: authState.isAuthenticated,
    loading,
    authError,
    login,
    verifyTwoFactor,
    resetToStep1,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
