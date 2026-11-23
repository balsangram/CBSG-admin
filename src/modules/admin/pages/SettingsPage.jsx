import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { X, Check } from 'lucide-react';

export function SettingsPage() {
  const [showNotification, setShowNotification] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [incentiveSaved, setIncentiveSaved] = useState(false);
  const [pwdResetSuccess, setPwdResetSuccess] = useState(false);

  // Company details
  const [companyData, setCompanyData] = useState({
    legalName: 'CBSG Finance Limited',
    rbiCorNo: 'N-13.02481',
    gstin: '27AAKCC4821M1Z5',
    supportNumber: '1800-200-2724',
    financialYear: '2026-27',
  });

  // Security & Operations
  const [securityData, setSecurityData] = useState({
    userTarget: 'Super Admin',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Incentive Settings
  const [emRate, setEmRate] = useState(10);
  const [tlRate, setTlRate] = useState(5);
  const [customerInvestment, setCustomerInvestment] = useState(10000);

  // Dynamic calculations
  const emIncentive = (Number(customerInvestment || 0) * Number(emRate || 0)) / 100;
  const tlIncentive = (Number(customerInvestment || 0) * Number(tlRate || 0)) / 100;

  const handleGlobalSave = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (!securityData.newPassword) return;
    setPwdResetSuccess(true);
    setSecurityData((prev) => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }));
    setTimeout(() => setPwdResetSuccess(false), 2500);
  };

  const handleSaveIncentives = () => {
    setIncentiveSaved(true);
    setTimeout(() => setIncentiveSaved(false), 2500);
  };

  return (
    <DashboardLayout pageTitle="Settings">
      <div className="space-y-5">
        {/* Top Dismissible Reporting Notification Banner */}
        {showNotification && (
          <div className="bg-[#faf6ee] border border-[#eee4d2] rounded-xl px-4 py-2.5 flex items-start justify-between gap-3 text-xs shadow-2xs">
            <div className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#c88a29] mt-1 shrink-0" />
              <div>
                <p className="font-semibold text-[#2c1b15]">
                  Rahul Verma now reports to Sneha Iyer
                </p>
                <p className="text-[11px] text-[#8f8278]">
                  Incentive overrides re-routed from next transaction.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowNotification(false)}
              className="text-[#8f8278] hover:text-[#2c1b15] p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Header & Save Button */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold font-serif text-[#2c1b15]">Settings</h1>

          <div className="flex items-center gap-2">
            {saveSuccess && (
              <span className="text-xs text-[#0d7a3e] font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Settings saved
              </span>
            )}
            <button
              type="button"
              onClick={handleGlobalSave}
              className="px-5 py-2 bg-[#2c1b15] hover:bg-[#432b22] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>

        {/* 2-Column Grid: Company Details + Security & Operations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Company */}
          <div className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-xs space-y-4 text-xs">
            <h2 className="text-sm font-bold text-[#2c1b15]">Company</h2>

            <div className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-[#61554d] mb-1">
                  Legal name
                </label>
                <input
                  type="text"
                  value={companyData.legalName}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, legalName: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] focus:outline-none focus:border-[#c88a29]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#61554d] mb-1">
                    RBI CoR No.
                  </label>
                  <input
                    type="text"
                    value={companyData.rbiCorNo}
                    onChange={(e) =>
                      setCompanyData({ ...companyData, rbiCorNo: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] focus:outline-none focus:border-[#c88a29]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#61554d] mb-1">
                    GSTIN
                  </label>
                  <input
                    type="text"
                    value={companyData.gstin}
                    onChange={(e) =>
                      setCompanyData({ ...companyData, gstin: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] focus:outline-none focus:border-[#c88a29]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#61554d] mb-1">
                    Support number
                  </label>
                  <input
                    type="text"
                    value={companyData.supportNumber}
                    onChange={(e) =>
                      setCompanyData({ ...companyData, supportNumber: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] focus:outline-none focus:border-[#c88a29]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#61554d] mb-1">
                    Financial year
                  </label>
                  <input
                    type="text"
                    value={companyData.financialYear}
                    onChange={(e) =>
                      setCompanyData({ ...companyData, financialYear: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] focus:outline-none focus:border-[#c88a29]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Security & Operations */}
          <div className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-xs space-y-4 text-xs">
            <h2 className="text-sm font-bold text-[#2c1b15]">Security & operations</h2>

            <form onSubmit={handlePasswordReset} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-[#61554d] mb-1">
                  Password reset for
                </label>
                <select
                  value={securityData.userTarget}
                  onChange={(e) =>
                    setSecurityData({ ...securityData, userTarget: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] font-medium focus:outline-none focus:border-[#c88a29]"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Sanjay Kulkarni">Sanjay Kulkarni (Sub-admin)</option>
                  <option value="Anil Mehta">Anil Mehta (Branch Manager)</option>
                  <option value="Nisha Agarwal">Nisha Agarwal (Finance)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#61554d] mb-1">
                  Current password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={securityData.currentPassword}
                  onChange={(e) =>
                    setSecurityData({ ...securityData, currentPassword: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] focus:outline-none focus:border-[#c88a29]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#61554d] mb-1">
                  New password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={securityData.newPassword}
                  onChange={(e) =>
                    setSecurityData({ ...securityData, newPassword: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] focus:outline-none focus:border-[#c88a29]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#61554d] mb-1">
                  Confirm new password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={securityData.confirmPassword}
                  onChange={(e) =>
                    setSecurityData({ ...securityData, confirmPassword: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] focus:outline-none focus:border-[#c88a29]"
                />
              </div>

              <div className="pt-1 flex items-center justify-between">
                <button
                  type="submit"
                  className="px-4 py-2 bg-white border border-[#e8e2d5] hover:bg-[#faf7f2] text-[#2c1b15] rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  Password reset
                </button>
                {pwdResetSuccess && (
                  <span className="text-xs text-[#0d7a3e] font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Password reset initiated
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Card 3: Incentive Settings (Full Width) */}
        <div className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-xs space-y-4 text-xs">
          <h2 className="text-sm font-bold text-[#2c1b15]">Incentive settings</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#61554d] mb-1">
                Executive Manager (EM) %
              </label>
              <input
                type="number"
                value={emRate}
                onChange={(e) => setEmRate(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] focus:outline-none focus:border-[#c88a29]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#61554d] mb-1">
                Team Lead (TL) %
              </label>
              <input
                type="number"
                value={tlRate}
                onChange={(e) => setTlRate(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] focus:outline-none focus:border-[#c88a29]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#61554d] mb-1">
              Customer investment (₹)
            </label>
            <input
              type="number"
              value={customerInvestment}
              onChange={(e) => setCustomerInvestment(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] focus:outline-none focus:border-[#c88a29]"
            />
          </div>

          {/* Calculated Output Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <p className="text-[11px] text-[#8f8278]">EM incentive {emRate}%</p>
              <p className="text-sm font-bold font-serif text-[#2c1b15] mt-0.5">
                ₹{emIncentive.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#8f8278]">TL incentive {tlRate}%</p>
              <p className="text-sm font-bold font-serif text-[#2c1b15] mt-0.5">
                ₹{tlIncentive.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Explanatory Policy Note */}
          <p className="text-[11px] text-[#8f8278] leading-relaxed">
            Each incentive is calculated directly on the customer's investment, not on the other incentive. Saved rules apply to new successful investments; previous earnings stay unchanged.
          </p>

          {/* Save Incentives Action Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {incentiveSaved && (
              <span className="text-xs text-[#0d7a3e] font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Incentives saved successfully
              </span>
            )}
            <button
              type="button"
              onClick={handleSaveIncentives}
              className="px-5 py-2 bg-[#a89f91] hover:bg-[#8f8278] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Save incentives
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SettingsPage;

