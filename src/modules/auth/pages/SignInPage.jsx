import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import AuthBrandPanel from '../components/AuthBrandPanel';
import SignInForm from '../components/SignInForm';
import Logo from '../../../components/common/Logo';
import { ROUTES } from '../../../utils/constants';

export function SignInPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen w-full flex bg-[#fcfaf7]">
      {/* Left Column: Brand Hero Panel */}
      <AuthBrandPanel />

      {/* Right Column: Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 overflow-y-auto">
        {/* Mobile Header Logo */}
        <div className="lg:hidden mb-6 flex justify-between items-center border-b border-stone-200/60 pb-4">
          <Logo variant="light" size="sm" />
          <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
            RBI NBFC
          </span>
        </div>

        {/* Form Container */}
        <div className="my-auto py-8">
          <SignInForm />
        </div>

        {/* Right Footer Legal */}
        <div className="pt-6 text-center text-xs text-stone-600 select-none">
          CBSG Finance Limited · Staff Console v2.6 · Authorized Access Only
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
