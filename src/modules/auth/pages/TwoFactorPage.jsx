import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import AuthBrandPanel from '../components/AuthBrandPanel';
import TwoFactorForm from '../components/TwoFactorForm';
import Logo from '../../../components/common/Logo';
import { ROUTES } from '../../../utils/constants';

export function TwoFactorPage() {
  const { step1Complete, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Route security check:
  // If already authenticated, go to dashboard.
  // If user hasn't completed step 1 credentials, redirect back to login!
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    } else if (!step1Complete) {
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [isAuthenticated, step1Complete, navigate]);

  return (
    <div className="min-h-screen w-full flex bg-[#fcfaf7]">
      {/* Left Column: Brand Hero Panel */}
      <AuthBrandPanel />

      {/* Right Column: 2FA Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 overflow-y-auto">
        {/* Mobile Header Logo */}
        <div className="lg:hidden mb-6 flex justify-between items-center border-b border-stone-200/60 pb-4">
          <Logo variant="light" size="sm" />
          <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
            2FA Security
          </span>
        </div>

        {/* 2FA Verification Form */}
        <div className="my-auto py-8">
          <TwoFactorForm />
        </div>

        {/* Right Footer Legal */}
        <div className="pt-6 text-center text-xs text-stone-600 select-none">
          Protected by Hardware Security Modules · RBI NBFC Regulated
        </div>
      </div>
    </div>
  );
}

export default TwoFactorPage;
