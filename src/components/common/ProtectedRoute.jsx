import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../modules/auth/hooks/useAuth';
import Loader from './Loader';
import { ROUTES } from '../../utils/constants';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, step1Complete, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <Loader size="lg" color="blue" />
        <p className="text-sm text-slate-500 font-medium animate-pulse">
          Verifying security authorization...
        </p>
      </div>
    );
  }

  // If user hasn't completed step 1 (credentials), send to login
  if (!step1Complete) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // If user completed step 1 but has not completed step 2 (2FA), send to two-factor
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.TWO_FACTOR} state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
