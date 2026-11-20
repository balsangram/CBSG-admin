import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignInPage from '../modules/auth/pages/SignInPage';
import TwoFactorPage from '../modules/auth/pages/TwoFactorPage';
import DashboardPage from '../modules/dashboard/pages/DashboardPage';
import ProfilePage from '../modules/dashboard/pages/ProfilePage';
import SettingsPage from '../modules/dashboard/pages/SettingsPage';
import ProtectedRoute from '../components/common/ProtectedRoute';
import useAuth from '../modules/auth/hooks/useAuth';
import { ROUTES } from '../utils/constants';

export function AppRoutes() {
  const { isAuthenticated, step1Complete } = useAuth();

  return (
    <Routes>
      {/* Root redirect */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={ROUTES.DASHBOARD} replace />
          ) : step1Complete ? (
            <Navigate to={ROUTES.TWO_FACTOR} replace />
          ) : (
            <Navigate to={ROUTES.LOGIN} replace />
          )
        }
      />

      {/* Authentication Step 1 */}
      <Route path={ROUTES.LOGIN} element={<SignInPage />} />

      {/* Authentication Step 2: Two-Factor Verification */}
      <Route path={ROUTES.TWO_FACTOR} element={<TwoFactorPage />} />

      {/* Protected Staff Dashboard */}
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Profile */}
      <Route
        path={ROUTES.PROFILE}
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Protected Settings */}
      <Route
        path={ROUTES.SETTINGS}
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
