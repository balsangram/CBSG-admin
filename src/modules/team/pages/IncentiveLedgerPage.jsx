import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import PageHeader from '../../../components/common/PageHeader';
import MonthEndCloseModal from '../components/MonthEndCloseModal';
import {
  BENEFICIARIES_LIST,
  incentivesService,
} from '../services/incentives.service';

export function IncentiveLedgerPage() {
  const [transactions, setTransactions] = useState(() => incentivesService.getTransactions());
  const [metrics, setMetrics] = useState(() => incentivesService.getMetrics());
  const [selectedBeneficiary, setSelectedBeneficiary] = useState('Everyone');
  const [bannerVisible, setBannerVisible] = useState(true);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);

  // Filtered transactions by beneficiary
  const filteredTransactions = transactions.filter((tx) => {
    return selectedBeneficiary === 'Everyone' || tx.beneficiary === selectedBeneficiary;
  });

  // Calculate dynamic metrics based on selected beneficiary
  const currentPayable = transactions
    .filter(
      (tx) =>
        (selectedBeneficiary === 'Everyone' || tx.beneficiary === selectedBeneficiary) &&
        tx.status === 'Payable'
    )
    .reduce((sum, tx) => sum + tx.rawAmount, 0);

  const currentPaid = transactions
    .filter(
      (tx) =>
        (selectedBeneficiary === 'Everyone' || tx.beneficiary === selectedBeneficiary) &&
        tx.status === 'Paid'
    )
    .reduce((sum, tx) => sum + tx.rawAmount, 0);

  const handleConfirmMonthEndClose = () => {
    const { updatedTransactions, closedAmount } = incentivesService.runMonthEndClose(transactions);
    setTransactions(updatedTransactions);
    setMetrics((prev) => ({
      ...prev,
      payable: '₹0.00',
      rawPayable: 0,
      paid: `₹${(prev.rawPaid + closedAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      rawPaid: prev.rawPaid + closedAmount,
    }));
  };

  return (
    <DashboardLayout>
      <PageHeader
        crumbs={['Home', 'Team & Incentives', 'Incentive Ledger']}
        title="Incentive ledger"
        className="mb-5"
      />
      <div className="space-y-5 max-w-7xl mx-auto pb-16">
        {/* Top Notification Banner (matching exact screenshot) */}
        {bannerVisible && (
          <div className="flex items-start justify-between text-xs py-0.5">
            <div className="flex items-start gap-2.5">
              <span className="w-4 h-4 rounded-full border border-[#8f8278] flex items-center justify-center text-[10px] text-[#2c1b15] mt-0.5 shrink-0">
                ✓
              </span>
              <div>
                <h4 className="text-xs font-bold text-[#2c1b15]">
                  Rahul Verma now reports to Sneha Iyer
                </h4>
                <p className="text-[11px] text-[#8f8278]">
                  Incentive overrides re-routed from next transaction.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setBannerVisible(false)}
              className="p-1 text-[#8f8278] hover:text-[#2c1b15] transition-colors cursor-pointer"
              title="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Beneficiary filter + month-end close */}
        <div className="flex items-center justify-end gap-3">
          <div className="relative">
              <select
                value={selectedBeneficiary}
                onChange={(e) => setSelectedBeneficiary(e.target.value)}
                className="appearance-none bg-white border border-[#e8e2d5] rounded-xl pl-3.5 pr-8 py-1.5 text-xs text-[#2c1b15] font-medium shadow-2xs focus:outline-none cursor-pointer"
              >
                {BENEFICIARIES_LIST.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8f8278] pointer-events-none" />
            </div>

            {/* Run Month-End Close Button */}
            <button
              type="button"
              onClick={() => setIsCloseModalOpen(true)}
              className="px-3.5 py-1.5 bg-white hover:bg-[#faf7f2] border border-[#e8e2d5] text-[#2c1b15] rounded-xl text-xs font-medium transition-all shadow-2xs cursor-pointer"
            >
              Run month-end close
            </button>
        </div>

        {/* 3 Summary Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: ACCRUED */}
          <div className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-2xs">
            <span className="text-[10.5px] uppercase font-bold tracking-wider text-[#8f8278]">
              Accrued
            </span>
            <div className="text-2xl font-bold text-[#2c1b15] mt-1">{metrics.accrued}</div>
          </div>

          {/* Card 2: PAYABLE (Signature Golden Card) */}
          <div className="bg-gradient-to-r from-[#dca74d] to-[#e8bb65] rounded-2xl p-5 shadow-2xs border border-[#d29b3f]/30">
            <span className="text-[10.5px] uppercase font-bold tracking-wider text-[#452814]">
              Payable
            </span>
            <div className="text-2xl font-bold text-[#2d1808] mt-1">
              {selectedBeneficiary === 'Everyone'
                ? metrics.payable
                : `₹${currentPayable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
            </div>
          </div>

          {/* Card 3: PAID */}
          <div className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-2xs">
            <span className="text-[10.5px] uppercase font-bold tracking-wider text-[#8f8278]">
              Paid
            </span>
            <div className="text-2xl font-bold text-[#2c1b15] mt-1">
              {selectedBeneficiary === 'Everyone'
                ? metrics.paid
                : `₹${currentPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
            </div>
          </div>
        </div>

        {/* Incentive Ledger Table (directly below cards matching screenshot) */}
        <div className="bg-white rounded-2xl border border-[#e8e2d5] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#f0eae0] text-[10.5px] uppercase tracking-wider text-[#8f8278] font-bold">
                  <th className="py-3.5 px-4 font-semibold">Date</th>
                  <th className="py-3.5 px-4 font-semibold">Beneficiary</th>
                  <th className="py-3.5 px-4 font-semibold">Source</th>
                  <th className="py-3.5 px-4 font-semibold">Kind</th>
                  <th className="py-3.5 px-4 font-semibold">Amount</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f7f2ea] text-xs">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-[#8f8278]">
                      No incentive ledger records found.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#faf7f2] transition-colors">
                      {/* Date */}
                      <td className="py-3 px-4 text-[#443831] font-normal whitespace-nowrap">
                        {tx.date}
                      </td>

                      {/* Beneficiary */}
                      <td className="py-3 px-4 font-semibold text-[#2c1b15] whitespace-nowrap">
                        {tx.beneficiary}
                      </td>

                      {/* Source */}
                      <td className="py-3 px-4 text-[#443831] whitespace-nowrap">{tx.source}</td>

                      {/* Kind */}
                      <td className="py-3 px-4 text-[#73665c] font-normal">{tx.kind}</td>

                      {/* Amount */}
                      <td className="py-3 px-4 font-semibold text-[#2c1b15] whitespace-nowrap">
                        {tx.amount}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            tx.status === 'Payable'
                              ? 'bg-[#fef4e6] text-[#b86200] border border-[#fde4c4]'
                              : 'bg-[#e7f7ed] text-[#0d7a3e] border border-[#c3eed4]'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Month-End Close Modal */}
        <MonthEndCloseModal
          isOpen={isCloseModalOpen}
          onClose={() => setIsCloseModalOpen(false)}
          onConfirmClose={handleConfirmMonthEndClose}
          payableAmount={metrics.payable}
          transactions={transactions}
        />
      </div>
    </DashboardLayout>
  );
}

export default IncentiveLedgerPage;
