import React, { useState } from 'react';
import {
  Mail,
  ChevronDown,
  X,
  FileCheck2,
  Send,
  CheckCircle2,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { customer360Service } from '../services/customer360.service';

export function Customer360Page() {
  const [selectedCustomerCode, setSelectedCustomerCode] = useState('CBSGPRIY15');
  const [activeTab, setActiveTab] = useState('Savings'); // 'Savings', 'Transactions', 'KYC & documents'
  const [showSignedInAlert, setShowSignedInAlert] = useState(true);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [messageText, setMessageText] = useState('Dear Priya, your CBSG savings account statement for November 2026 is ready.');

  const customer = customer360Service.getCustomer(selectedCustomerCode);
  const customerList = customer360Service.getAllCustomers();

  const handleSendMessage = (e) => {
    e.preventDefault();
    setShowMessageModal(false);
    setToastMessage(`SMS & WhatsApp dispatch sent to ${customer.name} (${customer.mobile}).`);
    setTimeout(() => setToastMessage(''), 4000);
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

      {/* Global Toast */}
      {toastMessage && (
        <div className="mb-4 py-2.5 px-4 bg-[#e7f7ed] border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage('')}
            className="text-emerald-800 hover:text-emerald-950 ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Page Header: Title and Actions */}
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#241814]">
            Customer 360
          </h2>
          <p className="mt-0.5 text-xs text-[#7a6e67]">
            {customer.name}
          </p>
        </div>

        {/* Right Action Controls: Customer Picker + Message */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Customer Selection Pill */}
          <div className="relative">
            <select
              value={selectedCustomerCode}
              onChange={(e) => setSelectedCustomerCode(e.target.value)}
              className="appearance-none bg-white text-xs font-semibold text-[#2c1b15] border border-[#ded8cb] rounded-full pl-4 pr-8 py-2 shadow-2xs outline-none cursor-pointer hover:border-[#c8bfb0] transition-colors"
            >
              {customerList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#8c8076] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Message Button */}
          <button
            type="button"
            onClick={() => setShowMessageModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#f6f2e9] border border-[#ded8cb] text-xs font-medium text-[#2c1b15] transition-colors shadow-2xs cursor-pointer select-none"
          >
            <Mail className="w-3.5 h-3.5 text-[#7a6e67]" />
            <span>Message</span>
          </button>
        </div>
      </div>

      {/* 3. Main Customer Profile Card */}
      <div className="bg-white rounded-2xl border border-[#e8e2d5] p-6 shadow-2xs mb-6">
        {/* Top Profile Summary Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#f3efe6]">
          {/* Left Avatar & Identity */}
          <div className="flex items-center gap-4">
            <img
              src={customer.avatar}
              alt={customer.name}
              className="w-14 h-14 rounded-full object-cover border border-[#ded8cb] shrink-0"
            />
            <div>
              <h3 className="text-lg font-bold text-[#2c1b15] leading-tight">
                {customer.name}
              </h3>
              <p className="text-xs text-[#7a6e67] font-mono mt-0.5">
                {customer.mobile} · {customer.code}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#fef1db] text-[#b46500]">
                  {customer.kycStatus}
                </span>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#e7f7ed] text-[#0f7642]">
                  {customer.stage}
                </span>
              </div>
            </div>
          </div>

          {/* Right Metrics: Savings Balance & Active Plans */}
          <div className="flex items-center gap-8 self-start md:self-auto">
            <div>
              <span className="text-[11px] font-medium text-[#8a7e75] block">
                Savings balance
              </span>
              <span className="text-2xl font-extrabold text-[#2c1b15] font-mono tracking-tight">
                {customer.savingsBalance}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-medium text-[#8a7e75] block">
                Active plans
              </span>
              <span className="text-2xl font-extrabold text-[#2c1b15]">
                {customer.activePlansCount}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Metadata 4-Column Grid */}
        <div className="pt-6 grid grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-6 text-xs">
          {/* Column 1 */}
          <div>
            <span className="text-[10px] font-bold text-[#8a7e75] uppercase tracking-wider block mb-1">
              BRANCH
            </span>
            <span className="font-semibold text-[#2c1b15] block">
              {customer.branch}
            </span>

            <span className="text-[10px] font-bold text-[#8a7e75] uppercase tracking-wider block mt-3 mb-1">
              ADDRESS
            </span>
            <span className="font-semibold text-[#2c1b15] block truncate" title={customer.address}>
              {customer.addressShort}
            </span>
          </div>

          {/* Column 2 */}
          <div>
            <span className="text-[10px] font-bold text-[#8a7e75] uppercase tracking-wider block mb-1">
              RELATIONSHIP EXECUTIVE
            </span>
            <span className="font-semibold text-[#2c1b15] block">
              {customer.relationshipExecutive}
            </span>

            <span className="text-[10px] font-bold text-[#8a7e75] uppercase tracking-wider block mt-3 mb-1">
              PAN
            </span>
            <span className="font-semibold text-[#2c1b15] font-mono block">
              {customer.pan}
            </span>
          </div>

          {/* Column 3 */}
          <div>
            <span className="text-[10px] font-bold text-[#8a7e75] uppercase tracking-wider block mb-1">
              JOINED
            </span>
            <span className="font-semibold text-[#2c1b15] block">
              {customer.joined}
            </span>

            <span className="text-[10px] font-bold text-[#8a7e75] uppercase tracking-wider block mt-3 mb-1">
              BANK ACCOUNT
            </span>
            <span className="font-semibold text-[#2c1b15] block">
              {customer.bankAccount}
            </span>
          </div>

          {/* Column 4 */}
          <div>
            <span className="text-[10px] font-bold text-[#8a7e75] uppercase tracking-wider block mb-1">
              NOMINEE
            </span>
            <span className="font-semibold text-[#2c1b15] block">
              {customer.nominee}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Navigation Tabs */}
      <div className="mb-5">
        <div className="inline-flex p-1 bg-[#ede8de]/60 rounded-xl gap-1 text-xs font-semibold select-none">
          {['Savings', 'Transactions', 'KYC & documents'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-white text-[#2c1b15] shadow-2xs'
                  : 'text-[#70645c] hover:text-[#2c1b15]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Tab Content Panels */}
      {activeTab === 'Savings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {customer.savingsPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-2xs"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-[#2c1b15]">
                    {plan.name}
                  </h4>
                  <p className="text-[11px] text-[#7a6e67] mt-0.5">
                    {plan.code} · since {plan.startDate}
                  </p>
                </div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#e7f7ed] text-[#0f7642]">
                  {plan.status}
                </span>
              </div>

              {/* 3 Metric Columns */}
              <div className="grid grid-cols-3 gap-2 pb-3 text-xs">
                <div>
                  <span className="text-[10px] font-medium text-[#8a7e75] block">
                    Savings
                  </span>
                  <span className="text-xs font-bold text-[#2c1b15] font-mono">
                    {plan.savings}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-medium text-[#8a7e75] block">
                    Goal
                  </span>
                  <span className="text-xs font-bold text-[#2c1b15] font-mono">
                    {plan.goal}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-medium text-[#8a7e75] block">
                    Progress
                  </span>
                  <span className="text-xs font-bold text-[#2c1b15]">
                    {plan.progress}%
                  </span>
                </div>
              </div>

              {/* Thin Progress Bar */}
              <div className="w-full bg-[#eee9df] rounded-full h-1.5 overflow-hidden mt-1">
                <div
                  className="bg-[#c88a29] h-1.5 rounded-full transition-all duration-700"
                  style={{ width: `${plan.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Transactions' && (
        <div className="bg-white rounded-2xl border border-[#e8e2d5] shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-[#f3efe6] flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#2c1b15]">
              Customer Transaction Ledger
            </h4>
            <span className="text-xs text-[#7a6e67] font-medium">
              {customer.transactions.length} records
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#f3efe6] text-[10.5px] uppercase tracking-wider text-[#968a80]">
                  <th className="py-3 px-4 font-semibold">DATE & TIME</th>
                  <th className="py-3 px-4 font-semibold">TYPE</th>
                  <th className="py-3 px-4 font-semibold">CHANNEL</th>
                  <th className="py-3 px-4 font-semibold">REFERENCE</th>
                  <th className="py-3 px-4 font-semibold">AMOUNT</th>
                  <th className="py-3 px-4 font-semibold text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f1e8]">
                {customer.transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#faf7f0]/60 transition-colors">
                    <td className="py-2.5 px-4 text-[#7a6e67] font-mono text-[11px]">
                      {tx.time}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-[#2c1b15]">
                      {tx.type}
                    </td>
                    <td className="py-2.5 px-4 text-[#5e5148]">
                      {tx.by}
                    </td>
                    <td className="py-2.5 px-4 text-[#7a6e67] font-mono">
                      {tx.ref}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-[#2c1b15] font-mono">
                      {tx.amount}
                    </td>
                    <td className="py-2.5 px-4 text-right">
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
      )}

      {activeTab === 'KYC & documents' && (
        <div className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-2xs">
          <h4 className="text-sm font-bold text-[#2c1b15] mb-4">
            Verified Documents & Regulatory Compliance
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {customer.documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-xl bg-[#f8f5ee] border border-[#e8e2d5] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <FileCheck2 className="w-5 h-5 text-[#c88a29]" />
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        doc.status === 'Verified'
                          ? 'bg-[#e7f7ed] text-[#0f7642]'
                          : 'bg-[#fef1db] text-[#b46500]'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                  <h5 className="font-bold text-xs text-[#2c1b15]">
                    {doc.type}
                  </h5>
                  <p className="text-[11px] text-[#7a6e67] font-mono mt-1">
                    {doc.number}
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-[#ede8de] text-[10px] text-[#8a7e75] flex items-center justify-between">
                  <span>Uploaded: {doc.date}</span>
                  <span className="font-semibold text-emerald-700">Audit-ready</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Send Message Modal Dialog */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#ded8cb]">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ebdF]">
              <h3 className="font-bold text-sm text-[#2c1b15]">
                Send Notification to {customer.name}
              </h3>
              <button
                type="button"
                onClick={() => setShowMessageModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="py-4 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-[#8a7e75] uppercase block mb-1">
                  Recipient Contact
                </label>
                <input
                  type="text"
                  disabled
                  value={`${customer.name} (${customer.mobile})`}
                  className="w-full bg-[#f8f5ee] border border-[#e8e2d5] rounded-xl px-3 py-2 text-xs text-[#2c1b15]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#8a7e75] uppercase block mb-1">
                  Message Content (SMS / WhatsApp)
                </label>
                <textarea
                  rows={4}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full bg-white border border-[#ded8cb] focus:border-[#c88a29] rounded-xl p-3 text-xs text-[#2c1b15] outline-none"
                  placeholder="Type message to client..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMessageModal(false)}
                  className="px-3 py-1.5 rounded-xl border border-[#ded8cb] text-xs font-semibold text-[#2c1b15] hover:bg-[#faf8f4] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#2c1b15] hover:bg-[#1a0f0b] text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  <Send className="w-3 h-3" />
                  <span>Send Notification</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Customer360Page;
