import React, { useState } from 'react';
import {
  FileText,
  CreditCard,
  UserCheck,
  Download,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  X,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import StatsCard from '../components/StatsCard';
import RecentActivity from '../components/RecentActivity';
import DashboardChart from '../components/DashboardChart';
import Button from '../../../components/common/Button';
import { mockDashboardData } from '../services/dashboard.service';

export function DashboardPage() {
  const [data] = useState(mockDashboardData);
  const [actionModal, setActionModal] = useState(null); // 'loan', 'payout', 'kyc', 'report'
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Handle Quick Action confirmation
  const handleActionExecute = (actionType) => {
    setActionModal(null);
    let msg = '';
    if (actionType === 'loan') {
      msg = 'New Loan Application #LN-9014 submitted into Maker-Checker queue!';
    } else if (actionType === 'payout') {
      msg = 'Weekly Payout Batch cleared and scheduled for instant NACH dispatch!';
    } else if (actionType === 'kyc') {
      msg = 'KYC documentation batch verified and marked complete!';
    } else if (actionType === 'report') {
      msg = 'CBSG NBFC Audit & Compliance report compiled and downloaded.';
    }
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(''), 5000);
  };

  return (
    <DashboardLayout pageTitle="Dashboard">
      {/* Alert / Feedback Notification */}
      {feedbackMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage('')}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Welcome Message & Workspace Subtitle */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Welcome back!
          </h2>
          <p className="mt-1 text-sm sm:text-base text-slate-500">
            Here's what's happening with your workspace today.
          </p>
        </div>

        {/* Workspace Operations Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs text-xs font-medium text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Core NBFC Node: Online</span>
          </div>
          <Button
            variant="blue"
            size="md"
            icon={Plus}
            onClick={() => setActionModal('loan')}
            className="rounded-xl"
          >
            New Application
          </Button>
        </div>
      </div>

      {/* 2. Four Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {data.stats.map((stat) => (
          <StatsCard
            key={stat.id}
            title={stat.title}
            count={stat.count}
            change={stat.change}
            isPositive={stat.isPositive}
            trend={stat.trend}
            subtitle={stat.subtitle}
            color={stat.color}
            iconName={stat.iconName}
          />
        ))}
      </div>

      {/* 3. Main Chart & Task Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Disbursements Chart (2 cols on large screen) */}
        <div className="lg:col-span-2">
          <DashboardChart chartData={data.chartData} />
        </div>

        {/* Task Overview Section (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Task Overview</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Maker-checker verification queue
                </p>
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                4 Active
              </span>
            </div>

            <div className="space-y-4">
              {data.taskOverview.map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="text-xs font-bold text-slate-900 leading-snug">
                      {task.title}
                    </p>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${task.badgeClass}`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                    <span>{task.category}</span>
                    <span className="font-semibold text-slate-700">
                      {task.pendingCount} pending
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-600" />
                      {task.due}
                    </span>
                    <span className="font-bold text-slate-700">{task.progress}% done</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActionModal('payout')}
              className="w-full py-2 px-3 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/70 rounded-xl transition-colors cursor-pointer text-center block"
            >
              Review all pending approvals →
            </button>
          </div>
        </div>
      </div>

      {/* 4. Quick Actions Row */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Quick Actions</h3>
            <p className="text-xs text-slate-500">
              Frequently accessed NBFC maker-checker workflows
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Action 1: New Loan Application */}
          <button
            type="button"
            onClick={() => setActionModal('loan')}
            className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all text-left flex items-start gap-4 group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                New Loan Application
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Initiate applicant appraisal & risk scoring
              </p>
            </div>
          </button>

          {/* Action 2: Approve Payout */}
          <button
            type="button"
            onClick={() => setActionModal('payout')}
            className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all text-left flex items-start gap-4 group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                Approve Payout
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Authorize NACH and IMPS disbursements
              </p>
            </div>
          </button>

          {/* Action 3: Review KYC */}
          <button
            type="button"
            onClick={() => setActionModal('kyc')}
            className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-300 transition-all text-left flex items-start gap-4 group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                Review KYC
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Verify Aadhaar, PAN & CIBIL documents
              </p>
            </div>
          </button>

          {/* Action 4: Generate Audit Report */}
          <button
            type="button"
            onClick={() => setActionModal('report')}
            className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all text-left flex items-start gap-4 group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Generate Audit Report
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Export RBI compliant balance & risk sheets
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 5. Recent Activities & Recent Users 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities Section */}
        <RecentActivity activities={data.recentActivities} />

        {/* Recent Users Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Recent Users</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Newly registered borrowers and depositors
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              5 of 18,420
            </span>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            {data.recentUsers.map((item) => (
              <div
                key={item.id}
                className="p-4 hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{item.email}</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {item.type} · <span className="font-mono">{item.branch}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-900 block font-mono">
                    {item.amount}
                  </span>
                  <span
                    className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      item.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        : item.status === 'Under Review'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-center">
            <button
              type="button"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View full customer & staff database</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Action Modals */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg">
                {actionModal === 'loan' && 'New Loan Application'}
                {actionModal === 'payout' && 'Confirm Payout Approval'}
                {actionModal === 'kyc' && 'Review KYC Queue'}
                {actionModal === 'report' && 'Generate Compliance Report'}
              </h3>
              <button
                type="button"
                onClick={() => setActionModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 text-sm text-slate-600 leading-relaxed">
              {actionModal === 'loan' && (
                <div>
                  <p className="mb-3">
                    Start a new customer application under maker appraisal with automated CIBIL and NBFC risk scoring.
                  </p>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div><strong>Applicant:</strong> M/s Sharma Logistics</div>
                    <div><strong>Proposed Facility:</strong> ₹25,00,000 Working Capital</div>
                    <div><strong>Checker Officer:</strong> Sanjay Kumar (Desk 01)</div>
                  </div>
                </div>
              )}

              {actionModal === 'payout' && (
                <div>
                  <p className="mb-3">
                    Verify and authorize batch #4893 for 42 beneficiaries through the RBI NEFT/NACH gateway.
                  </p>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                    <strong>Total Amount:</strong> ₹64,20,000 across 42 accounts
                  </div>
                </div>
              )}

              {actionModal === 'kyc' && (
                <div>
                  <p className="mb-3">
                    Run bulk automated verification across 16 pending Aadhaar & PAN KYC documents.
                  </p>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
                    UIDAI & NSDL API Integration: <strong>Connected & Active</strong>
                  </div>
                </div>
              )}

              {actionModal === 'report' && (
                <div>
                  <p className="mb-3">
                    Export comprehensive RBI quarterly audit report containing all loans, disbursements, and maker-checker audit trails.
                  </p>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                    <div><strong>Format:</strong> PDF + Encrypted CSV</div>
                    <div><strong>Standard:</strong> RBI NBFC Master Directions 2026</div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setActionModal(null)}
              >
                Cancel
              </Button>
              <Button
                variant="blue"
                size="md"
                onClick={() => handleActionExecute(actionModal)}
              >
                Confirm & Proceed
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default DashboardPage;
