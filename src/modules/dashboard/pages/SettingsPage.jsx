import React from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { ShieldCheck, Smartphone, Lock, Globe } from 'lucide-react';

export function SettingsPage() {
  return (
    <DashboardLayout pageTitle="Console Settings">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Security Settings */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-600" />
            Two-Factor Authentication & Access Control
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Configure authenticator apps, security keys, and session timeouts for CBSG compliance.
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/70">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-slate-600" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Authenticator App (TOTP)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Demo OTP (123456) enabled for staff desk verification
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/70">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-slate-600" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    RBI Maker-Checker Protocol
                  </h4>
                  <p className="text-xs text-slate-500">
                    Every disbursement requires independent dual verification
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full">
                Enforced
              </span>
            </div>
          </div>
        </div>

        {/* Launcher & Connected Services */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            Connected Launcher Ecosystem
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            CBSG Admin Console is linked to the primary organization launcher at https://www.cbsg.online/.
          </p>

          <a
            href="https://www.cbsg.online/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors"
          >
            Open CBSG Launcher (www.cbsg.online) →
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SettingsPage;
