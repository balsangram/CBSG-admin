import React, { useState } from 'react';
import {
  RotateCcw,
  SlidersHorizontal,
  Download,
  TrendingUp,
  X,
  Sliders,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CollectionTrendsChart from '../components/CollectionTrendsChart';
import { performanceOverviewData } from '../services/dashboard.service';

export function DashboardPage() {
  const [data] = useState(performanceOverviewData);
  const [showSignedInAlert, setShowSignedInAlert] = useState(true);
  const [activeModal, setActiveModal] = useState(null); // 'kyc', 'approvals', 'details', 'export'
  const [alertMessage, setAlertMessage] = useState('');

  const handleExport = () => {
    setAlertMessage('Generating CBSG Finance portfolio export... download started.');
    setTimeout(() => setAlertMessage(''), 4000);
  };

  const handleRefresh = () => {
    setAlertMessage('Dashboard data synchronized with core NBFC node.');
    setTimeout(() => setAlertMessage(''), 3000);
  };

  return (
    <DashboardLayout>
      {/* 1. Signed in status notification banner */}
      {showSignedInAlert && (
        <div className="mb-4 py-2 px-3.5 bg-white/70 border border-[#e8e2d5] rounded-xl flex items-center justify-between text-xs text-[#2c1b15] shadow-2xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">
              ✓
            </span>
            <span className="font-medium">Signed in</span>
          </div>
          <button
            type="button"
            onClick={() => setShowSignedInAlert(false)}
            className="text-[#968a80] hover:text-[#2c1b15] p-1 cursor-pointer"
            aria-label="Dismiss signed in alert"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Global alert toast */}
      {alertMessage && (
        <div className="mb-4 py-2.5 px-4 bg-[#e7f7ed] border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs">
          <span>{alertMessage}</span>
          <button
            type="button"
            onClick={() => setAlertMessage('')}
            className="text-emerald-800 hover:text-emerald-950 ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Page Header: Title, Subtitle and Top Actions */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#241814]">
            Performance Overview
          </h2>
          <p className="mt-0.5 text-xs text-[#7a6e67]">
            Collections, growth and portfolio insights — all in one place
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Refresh Button */}
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#ded8cb] text-xs font-medium text-[#2c1b15] hover:bg-[#f6f2e9] transition-colors shadow-2xs cursor-pointer select-none"
          >
            <RotateCcw className="w-3 h-3 text-[#7a6e67]" />
            <span>Refresh</span>
          </button>

          {/* Reports Button */}
          <button
            type="button"
            onClick={() => setActiveModal('details')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#ded8cb] text-xs font-medium text-[#2c1b15] hover:bg-[#f6f2e9] transition-colors shadow-2xs cursor-pointer select-none"
          >
            <Sliders className="w-3 h-3 text-[#7a6e67]" />
            <span>Reports</span>
          </button>

          {/* Export Data Button */}
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#2c1b15] hover:bg-[#1a0f0b] text-white text-xs font-medium transition-colors shadow-2xs cursor-pointer select-none"
          >
            <Download className="w-3 h-3" />
            <span>Export data</span>
          </button>
        </div>
      </div>

      {/* 3. Main Dashboard Grid (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* ================= LEFT COLUMN (approx 5 cols on lg) ================= */}
        <div className="lg:col-span-5 space-y-5">
          {/* Hero Gradient Card: "Explore your performance" */}
          <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-[#f8d474] via-[#f7bc45] to-[#e89b25] shadow-xs select-none">
            {/* Top Tag */}
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#2c1b15]/90 mb-3">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{data.hero.tag}</span>
            </div>

            {/* Big Headline */}
            <h3 className="text-2xl sm:text-3xl font-medium text-[#2c1b15] tracking-tight leading-tight">
              {data.hero.title} <br />
              <span className="italic font-serif font-normal text-2xl sm:text-3xl">
                {data.hero.titleEmphasis}
              </span>
            </h3>

            {/* Organization Name */}
            <p className="mt-1 text-xs text-[#2c1b15]/80 font-medium">
              {data.hero.organization}
            </p>

            {/* Bottom Deposit Book Value */}
            <div className="mt-8 flex items-baseline justify-between pt-2">
              <span className="text-xs text-[#2c1b15]/85 font-medium">
                {data.hero.depositBookLabel}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#2c1b15] tracking-tight">
                {data.hero.depositBookValue}
              </span>
            </div>
          </div>

          {/* Portfolio Performance Card */}
          <div className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-2xs">
            <h4 className="text-sm font-bold text-[#2c1b15] mb-4">
              Portfolio performance
            </h4>

            {/* Table Header */}
            <div className="grid grid-cols-12 pb-2 text-[10.5px] font-semibold uppercase tracking-wider text-[#968a80] border-b border-[#f3efe6]">
              <span className="col-span-6">INDICATOR</span>
              <span className="col-span-3">VALUE</span>
              <span className="col-span-3 text-right">STATUS</span>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-[#f5f1e8]">
              {data.portfolioPerformance.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 py-3 text-xs items-center"
                >
                  <span className="col-span-6 font-medium text-[#2c1b15]">
                    {item.indicator}
                  </span>
                  <span className="col-span-3 font-bold text-[#2c1b15]">
                    {item.value}
                  </span>
                  <div className="col-span-3 text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10.5px] font-semibold ${
                        item.statusVariant === 'success'
                          ? 'bg-[#e7f7ed] text-[#0f7642]'
                          : 'bg-[#fef1db] text-[#b46500]'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Goal progress Card */}
          <div className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-2xs">
            <div className="text-[10.5px] font-bold text-[#8a7e75] uppercase tracking-wider mb-2">
              Goal progress
            </div>

            <div className="flex items-baseline mb-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#2c1b15]">
                {data.goalProgress.percentage}%
              </span>
              <span className="text-xs text-[#7a6e67] ml-2">
                {data.goalProgress.label}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#eee9df] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#c88a29] h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${data.goalProgress.percentage}%` }}
              />
            </div>

            <p className="mt-3 text-[11px] text-[#8a7e75]">
              {data.goalProgress.missedWeeks} missed weeks ·{' '}
              {data.goalProgress.scheduledInstalments} scheduled instalments
            </p>
          </div>

          {/* Operations Overview Card */}
          <div className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-2xs">
            <h4 className="text-xs font-bold text-[#8a7e75] uppercase tracking-wider mb-3">
              Operations overview
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActiveModal('kyc')}
                className="py-2.5 px-3 rounded-xl bg-[#f8f5ee] hover:bg-[#eee8dc] border border-[#e8e2d5] text-xs font-bold text-[#2c1b15] text-center transition-colors cursor-pointer"
              >
                {data.operationsOverview.pendingKyc} KYC pending
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('approvals')}
                className="py-2.5 px-3 rounded-xl bg-[#f8f5ee] hover:bg-[#eee8dc] border border-[#e8e2d5] text-xs font-bold text-[#2c1b15] text-center transition-colors cursor-pointer"
              >
                {data.operationsOverview.approvals} approvals
              </button>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN (approx 7 cols on lg) ================= */}
        <div className="lg:col-span-7 space-y-5">
          {/* Collection Trends Card */}
          <div className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-[#2c1b15]">
                Collection trends
              </h4>

              <button
                type="button"
                onClick={() => setActiveModal('details')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#e8e2d5] text-[11px] font-medium text-[#2c1b15] hover:bg-[#f8f5ee] transition-colors cursor-pointer select-none"
              >
                <SlidersHorizontal className="w-3 h-3 text-[#7a6e67]" />
                <span>Details</span>
              </button>
            </div>

            {/* Metric Display */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-extrabold text-[#2c1b15]">
                {data.collectionTrends.todayAmount}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-[#e7f7ed] text-[#0f7642]">
                Today
              </span>
              <span className="text-xs text-[#7a6e67] ml-1">
                {data.collectionTrends.todayLabel}
              </span>
            </div>

            {/* High-Fidelity SVG Curve Chart */}
            <CollectionTrendsChart data={data.collectionTrends} />
          </div>

          {/* Live Transactions Card */}
          <div className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-[#2c1b15]">
                Live transactions
              </h4>

              <button
                type="button"
                onClick={() => setActiveModal('details')}
                className="text-xs text-[#7a6e67] hover:text-[#2c1b15] font-medium cursor-pointer"
              >
                View all
              </button>
            </div>

            {/* Transactions Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#f3efe6] text-[10.5px] uppercase tracking-wider text-[#968a80]">
                    <th className="pb-2 font-semibold">TIME</th>
                    <th className="pb-2 font-semibold">CUSTOMER</th>
                    <th className="pb-2 font-semibold">TYPE</th>
                    <th className="pb-2 font-semibold">BY</th>
                    <th className="pb-2 font-semibold">AMOUNT</th>
                    <th className="pb-2 font-semibold text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f1e8]">
                  {data.liveTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#faf7f0]/60 transition-colors">
                      <td className="py-2.5 text-[#7a6e67] font-mono text-[11px] whitespace-nowrap">
                        {tx.time}
                      </td>
                      <td className="py-2.5 font-bold text-[#2c1b15] whitespace-nowrap">
                        {tx.customer}
                      </td>
                      <td className="py-2.5 text-[#5e5148] whitespace-nowrap">
                        {tx.type}
                      </td>
                      <td className="py-2.5 text-[#5e5148] whitespace-nowrap">
                        {tx.by}
                      </td>
                      <td className="py-2.5 font-bold text-[#2c1b15] font-mono whitespace-nowrap">
                        {tx.amount}
                      </td>
                      <td className="py-2.5 text-right whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e7f7ed] text-[#0f7642]">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Executives Card */}
          <div className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-2xs">
            <h4 className="text-sm font-bold text-[#2c1b15] mb-3">
              Top executives
            </h4>

            {/* Executives Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#f3efe6] text-[10.5px] uppercase tracking-wider text-[#968a80]">
                    <th className="pb-2 font-semibold">EXECUTIVE</th>
                    <th className="pb-2 font-semibold">CUSTOMERS</th>
                    <th className="pb-2 font-semibold">COLLECTED TODAY</th>
                    <th className="pb-2 font-semibold text-right">TREND</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f1e8]">
                  {data.topExecutives.map((exec) => (
                    <tr key={exec.id} className="hover:bg-[#faf7f0]/60 transition-colors">
                      <td className="py-2.5 flex items-center gap-2.5">
                        <img
                          src={exec.avatar}
                          alt={exec.name}
                          className="w-7 h-7 rounded-full object-cover border border-[#e0d9cb]"
                        />
                        <div>
                          <p className="font-bold text-[#2c1b15] leading-tight text-xs">
                            {exec.name}
                          </p>
                          <p className="text-[10px] text-[#85786f]">
                            {exec.role}
                          </p>
                        </div>
                      </td>
                      <td className="py-2.5 font-bold text-[#2c1b15]">
                        {exec.customers}
                      </td>
                      <td className="py-2.5 font-bold text-[#2c1b15] font-mono">
                        {exec.collectedToday}
                      </td>
                      <td className="py-2.5 text-right">
                        {/* Mini Sparkline SVG */}
                        <div className="inline-flex items-center justify-end">
                          <svg className="w-12 h-4 text-[#c88a29]" viewBox="0 0 48 16" fill="none">
                            <path
                              d="M 2 12 Q 14 13, 24 9 T 46 3"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modal Dialogs */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#ded8cb]">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ebdF]">
              <h3 className="font-bold text-sm text-[#2c1b15]">
                {activeModal === 'kyc' && 'Pending KYC Applications (2)'}
                {activeModal === 'approvals' && 'Pending Maker-Checker Approvals (1)'}
                {activeModal === 'details' && 'Full Portfolio Reports'}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 text-xs text-[#5e5148] space-y-3">
              {activeModal === 'kyc' && (
                <>
                  <p>The following customers have submitted identity documents awaiting verification:</p>
                  <div className="p-3 bg-[#faf8f4] rounded-xl border border-[#e8e2d5] space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#2c1b15]">1. Rajesh Sen (Aadhaar + PAN)</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#fef1db] text-[#b46500]">Pending</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#2c1b15]">2. Sunita Rao (Bank Passbook)</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#fef1db] text-[#b46500]">Pending</span>
                    </div>
                  </div>
                </>
              )}

              {activeModal === 'approvals' && (
                <>
                  <p>Pending authorization in the maker-checker desk:</p>
                  <div className="p-3 bg-[#faf8f4] rounded-xl border border-[#e8e2d5]">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-[#2c1b15]">Weekly Incentive Batch #489</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#fef1db] text-[#b46500]">Review</span>
                    </div>
                    <p className="text-[11px] text-[#7a6e67]">Amount: ₹10,605 across 4 staff officers</p>
                  </div>
                </>
              )}

              {activeModal === 'details' && (
                <>
                  <p>Comprehensive ledger, collection daybook, and executive performance metrics are active and updated real-time.</p>
                  <div className="p-3 bg-[#f8f5ee] rounded-xl border border-[#e8e2d5] text-[11px] space-y-1">
                    <div>Deposit Book: <strong>₹7.72 Lakhs</strong></div>
                    <div>Active Customers: <strong>13</strong></div>
                    <div>Collection Efficiency: <strong>96.9%</strong></div>
                  </div>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-[#f0ebdF] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-3 py-1.5 rounded-xl border border-[#ded8cb] text-xs font-semibold text-[#2c1b15] hover:bg-[#faf8f4] cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  setAlertMessage('Action processed successfully.');
                  setTimeout(() => setAlertMessage(''), 3000);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#2c1b15] text-white text-xs font-semibold hover:bg-[#1a0f0b] cursor-pointer"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default DashboardPage;
