import { api } from '../../../services/api';
import storageService from '../../../services/storage.service';

class AuthService {
  /**
   * Step 1: Staff Sign In with Email & Password
   * POST /auth/admin/login -> { id, email } (OTP record id)
   */
  async signIn(email, password) {
    const response = await api.post('/auth/admin/login', {
      email: email.trim().toLowerCase(),
      password,
    });

    // Backend wraps payloads as { success, message, data }
    const otp = response.data?.data || {};

    const pendingUser = {
      email: otp.email,
      role: 'admin',
    };

    storageService.savePendingOtp({
      email: otp.email,
      otpId: otp.id,
      user: pendingUser,
    });

    return {
      success: true,
      user: pendingUser,
      step1Complete: true,
      otpId: otp.id,
      message: 'OTP sent. Please verify to continue.',
    };
  }

  /**
   * Step 2: Two-Factor Verification
   * POST /auth/admin/verify-otp -> { user, accessToken, refreshToken }
   */
  async verifyTwoFactor(code) {
    const { email, otpId } = storageService.getPendingOtp();

    if (!email || !otpId) {
      throw new Error('Session expired. Please sign in again.');
    }

    const response = await api.post('/auth/admin/verify-otp', {
      email,
      otp: String(code).replace(/\D/g, ''),
      id: otpId,
    });

    const session = response.data?.data || {};

    storageService.saveSession({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      user: session.user,
    });

    return {
      success: true,
      token: session.accessToken,
      user: session.user,
      isAuthenticated: true,
    };
  }

  /**
   * Logout staff session
   */
  async logout() {
    storageService.clearAuthState();
  }

  /**
   * Read stored authentication state
   */
  getInitialState() {
    return storageService.getAuthState();
  }
}

export const authService = new AuthService();
export default authService;
