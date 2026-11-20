import React from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import useAuth from '../../auth/hooks/useAuth';
import { APP_CONFIG } from '../../../utils/constants';
import { Shield, Building, Mail, BadgeCheck } from 'lucide-react';

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <DashboardLayout pageTitle="Staff Profile">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
            alt={user?.name || 'Staff User'}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
          />

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-2">
                  <span>{user?.name || APP_CONFIG.DEMO_STAFF_NAME}</span>
                  <BadgeCheck className="w-5 h-5 text-blue-600" />
                </h2>
                <p className="text-sm font-medium text-slate-600">
                  {user?.role || APP_CONFIG.DEMO_STAFF_ROLE}
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 self-center sm:self-auto">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active Staff Session
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-600 justify-center sm:justify-start">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {user?.email || APP_CONFIG.DEMO_EMAIL}
              </span>
              <span className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                {user?.branch || APP_CONFIG.DEMO_STAFF_BRANCH}
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                Emp ID: {user?.employeeId || 'CBSG-HQ-0482'}
              </span>
            </div>
          </div>
        </div>

        {/* Security & Access Tier */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Security & Maker-Checker Authorization
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-medium text-slate-500 block mb-1">
                Authorization Level
              </span>
              <span className="text-sm font-bold text-slate-900">
                Tier-2 Checker Desk
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                Disbursements up to ₹50 Lakhs
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-medium text-slate-500 block mb-1">
                Two-Factor Security
              </span>
              <span className="text-sm font-bold text-emerald-700">
                Hardware & TOTP Enforced
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                Demo Authenticator active
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-medium text-slate-500 block mb-1">
                Compliance Audits
              </span>
              <span className="text-sm font-bold text-blue-700">
                100% Audit Logged
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                ISO 27001 RBI Standard
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ProfilePage;
