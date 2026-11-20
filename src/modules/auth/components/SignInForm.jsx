import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { validateSignIn } from '../validation/auth.validation';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { APP_CONFIG, ROUTES } from '../../../utils/constants';

export function SignInForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: APP_CONFIG.DEMO_EMAIL,
    password: APP_CONFIG.DEMO_PASSWORD,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const handleQuickFill = () => {
    setFormData({
      email: APP_CONFIG.DEMO_EMAIL,
      password: APP_CONFIG.DEMO_PASSWORD,
    });
    setErrors({});
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // Step 1 validation
    const validation = validateSignIn(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Authenticate step 1
      await login(formData.email, formData.password);
      // Navigate strictly to two-factor verification
      navigate(ROUTES.TWO_FACTOR);
    } catch (err) {
      setServerError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          Sign in
        </h2>
        <p className="mt-1.5 text-sm text-stone-500">
          Use your CBSG staff credentials.
        </p>
      </div>

      {/* Demo Credentials Quick-Fill Pill */}
      <div className="mb-6 p-3 rounded-xl bg-amber-50/80 border border-amber-200/70 text-xs text-amber-900 flex items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Demo Staff: <strong className="font-semibold">{APP_CONFIG.DEMO_EMAIL}</strong></span>
        </div>
        <button
          type="button"
          onClick={handleQuickFill}
          className="text-xs font-semibold text-amber-800 hover:text-amber-950 underline cursor-pointer shrink-0"
        >
          Autofill
        </button>
      </div>

      {serverError && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
          <span className="font-bold">Error:</span>
          <span>{serverError}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Email Field */}
        <div>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Staff email (e.g. sanjay.k@cbsgfinancial.in)"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            icon={Mail}
            className="rounded-2xl py-3.5 text-stone-800 placeholder:text-stone-400 border-stone-200 focus:border-stone-400 shadow-2xs"
          />
        </div>

        {/* Password Field */}
        <div>
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon={Lock}
            className="rounded-2xl py-3.5 text-stone-800 placeholder:text-stone-400 border-stone-200 focus:border-stone-400 shadow-2xs"
            rightAction={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
        </div>

        {/* Continue Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isSubmitting}
            className="rounded-2xl py-3.5 bg-[#2f1d17] hover:bg-[#20130e] text-white font-medium text-sm shadow-sm tracking-wide cursor-pointer"
          >
            Continue
          </Button>
        </div>
      </form>

      {/* Security note */}
      <div className="mt-8 pt-6 border-t border-stone-200/80 flex items-center justify-center gap-2 text-stone-600 text-xs text-center">
        <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
        <span>Hardware token & Authenticator 2FA enforced</span>
      </div>
    </div>
  );
}

export default SignInForm;
