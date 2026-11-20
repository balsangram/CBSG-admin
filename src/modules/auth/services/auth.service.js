import { api } from '../../../services/api';
import storageService from '../../../services/storage.service';
import { APP_CONFIG } from '../../../utils/constants';

class AuthService {
  /**
   * Step 1: Staff Sign In with Email & Password
   */
  async signIn(email, password) {
    // Simulated network API call
    await api.post('/api/v1/auth/staff-login', { email, password }, 700);

    // Create staff user session object
    const staffUser = {
      id: 'usr_cbsg_849201',
      name: APP_CONFIG.DEMO_STAFF_NAME,
      email: email.trim().toLowerCase(),
      role: APP_CONFIG.DEMO_STAFF_ROLE,
      branch: APP_CONFIG.DEMO_STAFF_BRANCH,
      employeeId: 'CBSG-HQ-0482',
      department: 'NBFC Credit & Risk Control',
      securityLevel: 'Maker-Checker Tier 2',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    };

    // Save step 1 completion in storage
    storageService.saveStep1Success(staffUser);

    return {
      success: true,
      user: staffUser,
      step1Complete: true,
      message: 'Step 1 authenticated. Please verify 2FA.',
    };
  }

  /**
   * Step 2: Two-Factor Verification
   */
  async verifyTwoFactor(code, user) {
    await api.post('/api/v1/auth/2fa-verify', { code }, 600);

    const cleaned = (code || '').replace(/\D/g, '');

    // For demo mode, accept only demo OTP '123456'
    if (cleaned !== APP_CONFIG.DEMO_OTP) {
      throw new Error(`Invalid verification code. Use demo code ${APP_CONFIG.DEMO_OTP}.`);
    }

    const demoToken = `cbsg_jwt_${Date.now()}_sec74a9`;

    // Persist full authentication in storage
    storageService.saveTwoFactorSuccess(demoToken, user);

    return {
      success: true,
      token: demoToken,
      user,
      isAuthenticated: true,
    };
  }

  /**
   * Logout staff session
   */
  async logout() {
    try {
      await api.post('/api/v1/auth/logout', {}, 300);
    } catch {
      // Continue cleanup even on network failure
    } finally {
      storageService.clearAuthState();
    }
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
