import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { validateOtpCode } from '../validation/auth.validation';
import Button from '../../../components/common/Button';
import { APP_CONFIG, ROUTES } from '../../../utils/constants';

export function TwoFactorForm() {
  const navigate = useNavigate();
  const { verifyTwoFactor } = useAuth();

  // 6 OTP digit inputs
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // References to the 6 input elements for smooth keyboard navigation
  const inputRefs = useRef([]);

  // Auto focus first input on load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Handle single digit input
  const handleDigitChange = (index, value) => {
    // Only accept numeric digits
    const cleaned = value.replace(/\D/g, '');

    // If user pasted multiple digits into one field
    if (cleaned.length > 1) {
      handlePastedCode(cleaned);
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = cleaned;
    setOtp(newOtp);
    setError('');

    // If a digit was entered, automatically focus next input
    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle keydown for backspace and navigation
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move back to previous input and clear it
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Support pasting all six digits
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    handlePastedCode(pastedData);
  };

  const handlePastedCode = (pastedText) => {
    const digits = pastedText.replace(/\D/g, '').slice(0, 6).split('');
    if (digits.length === 0) return;

    const newOtp = ['', '', '', '', '', ''];
    digits.forEach((digit, i) => {
      newOtp[i] = digit;
    });

    setOtp(newOtp);
    setError('');

    // Focus last filled digit or final input
    const nextIndex = Math.min(digits.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  // Autofill demo code handler
  const handleAutofill = () => {
    const demoDigits = APP_CONFIG.DEMO_OTP.split('');
    setOtp(demoDigits);
    setError('');
    // Focus last digit
    inputRefs.current[5]?.focus();
  };

  // Submit verification
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');

    const fullCode = otp.join('');
    const validation = validateOtpCode(fullCode);

    if (!validation.isValid) {
      setError(validation.errors.code || 'Please enter all 6 digits.');
      return;
    }

    setIsSubmitting(true);
    try {
      await verifyTwoFactor(fullCode);
      // On success, navigate to dashboard
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      setError(err.message || `Invalid code. Please enter demo code ${APP_CONFIG.DEMO_OTP}.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isComplete = otp.every((digit) => digit !== '');

  return (
    <div className="w-full max-w-[420px] mx-auto">
      {/* Back to Launcher Link */}
      <a
        href={APP_CONFIG.LAUNCHER_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors mb-8 cursor-pointer select-none"
      >
        <span className="text-stone-400 group-hover:-translate-x-0.5 transition-transform">←</span>
        <span>Back to Launcher</span>
      </a>

      {/* Header */}
      <div className="mb-7">
        <h2 className="text-3xl font-bold tracking-tight text-stone-900">
          Two-factor verification
        </h2>
        <p className="mt-1.5 text-sm text-stone-500 leading-relaxed">
          Enter the 6-digit code from your authenticator (demo {APP_CONFIG.DEMO_OTP}).
        </p>
      </div>

      {/* Authenticator Form */}
      <form onSubmit={handleSubmit} noValidate>
        {/* 6-Digit OTP Inputs */}
        <div className="mb-3">
          <div className="flex items-center justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isSubmitting}
                className={`w-12 h-14 sm:w-13 sm:h-14 text-center text-xl font-bold rounded-xl border bg-white shadow-2xs outline-none transition-all duration-200 select-all ${
                  error
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 text-rose-700'
                    : digit
                    ? 'border-stone-400 bg-stone-50/50 text-stone-900 focus:border-stone-600 focus:ring-4 focus:ring-stone-400/15'
                    : 'border-stone-200 hover:border-stone-300 focus:border-stone-400 focus:ring-4 focus:ring-stone-400/15 text-stone-800'
                }`}
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>

          {/* Validation Error Message */}
          {error && (
            <p className="mt-2.5 text-xs font-medium text-rose-600 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </p>
          )}
        </div>

        {/* Autofill demo code button (Link style matching Image 2) */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleAutofill}
            className="text-xs font-medium text-stone-600 hover:text-stone-900 underline transition-colors cursor-pointer select-none"
          >
            Autofill demo code
          </button>
        </div>

        {/* Verify & sign in button */}
        <Button
          type="submit"
          size="lg"
          fullWidth
          loading={isSubmitting}
          className={`rounded-2xl py-3.5 font-medium text-sm transition-all duration-200 shadow-sm cursor-pointer ${
            isComplete
              ? 'bg-[#2f1d17] hover:bg-[#20130e] text-white active:scale-[0.99]'
              : 'bg-[#a39892] hover:bg-[#968a84] text-white'
          }`}
        >
          Verify & sign in
        </Button>
      </form>

      {/* Return to Sign in option */}
      <div className="mt-8 pt-6 border-t border-stone-200/80 flex items-center justify-between text-xs text-stone-600">
        <button
          type="button"
          onClick={() => navigate(ROUTES.LOGIN)}
          className="hover:text-stone-900 underline font-medium cursor-pointer"
        >
          Switch staff account
        </button>
        <span className="flex items-center gap-1 text-stone-600">
          <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
          End-to-end encrypted
        </span>
      </div>
    </div>
  );
}

export default TwoFactorForm;
