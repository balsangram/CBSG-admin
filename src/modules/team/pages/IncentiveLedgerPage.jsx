import React, { useState } from 'react';
import {
  ChevronDown,
  Search,
  CheckCircle2,
  X,
  Download,
  Calendar,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import MonthEndCloseModal from '../components/MonthEndCloseModal';
import {
  BENEFICIARIES_LIST,
  incentivesService,
} from '../services/incentives.service';

export function IncentiveLedgerPage() {
  const [transactions, setTransactions] = useState(() => incentivesService.getTransactions());
  const [metrics, setMetrics] = useState(() => incentivesService.getMetrics());
  const [selectedBeneficiary, setSelectedBeneficiary] = useState('Everyone');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [bannerVisible, setBannerVisible] = useState(true);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);

  // Filtered transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesBeneficiary =
      selectedBeneficiary === 'Everyone' || tx.beneficiary === selectedBeneficiary;
    const matchesSearch =
      tx.beneficiary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.date.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || tx.status === statusFilter;
    return matchesBeneficiary && matchesSearch && matchesStatus;
  });

  // Calculate dynamic metrics based on selected beneficiary
  const currentPayable = transactions
    .filter((tx) => (selectedBeneficiary === 'Everyone' || tx.beneficiary === selectedBeneficiary) && tx.status === 'Payable')
    .reduce((sum, tx) => sum + tx.rawAmount, 0);

  const currentPaid = transactions
    .filter((tx) => (selectedBeneficiary === 'Everyone' || tx.beneficiary === selectedBeneficiary) && tx.status === 'Paid')
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

  const handleExportCSV = () => {
    const headers = ['Date,Beneficiary,Source,Kind,Amount,Status'];
    const rows = filteredTransactions.map(
      (tx) => `"${tx.date}","${tx.beneficiary}","${tx.source}","${tx.kind}","${tx.amount}","${tx.status}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cbsg_incentive_ledger_${selectedBeneficiary.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-16">
        {/* Hierarchy Routing Toast Notification Banner */}
        {bannerVisible && (
          <div className="bg-[#fbf9f4] border border-[#e8decf] rounded-2xl p-4 flex items-start justify-between shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#f0e3ce] flex items-center justify-center text-[#9c5807] mt-0.5 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#2c1b15]">
                  Rahul Verma now reports to Sneha Iyer
                </h4>
                <p className="text-[11px] text-[#8f8278] mt-0.5">
                  Incentive overrides re-routed from next transaction.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setBannerVisible(false)}
              className="p-1 rounded-lg text-[#8f8278] hover:text-[#2c1b15] hover:bg-[#ede7dc] transition-colors cursor-pointer"
              title="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#2c1b15] tracking-tight">Incentive ledger</h1>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Beneficiary Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedBeneficiary}
                onChange={(e) => setSelectedBeneficiary(e.target.value)}
                className="appearance-none bg-white border border-[#e8e2d5] rounded-xl pl-3.5 pr-8 py-2 text-xs text-[#2c1b15] font-semibold shadow-xs focus:outline-none focus:border-[#c88a29] cursor-pointer"
              >
                {BENEFICIARIES_LIST.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-[#8f8278] pointer-events-none" />
            </div>

            {/* Run Month-End Close Button */}
            <button
              type="button"
              onClick={() => setIsCloseModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#faf7f2] border border-[#e8e2d5] text-[#2c1b15] rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#8f8278]" />
              <span>Run month-end close</span>
            </button>
          </div>
        </div>

        {/* 3 Summary Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: ACCRUED */}
          <div className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-xs">
            <span className="text-[10.5px] uppercase font-bold tracking-wider text-[#8f8278]">
              Accrued
            </span>
            <div className="text-2xl font-bold text-[#2c1b15] mt-1">{metrics.accrued}</div>
          </div>

          {/* Card 2: PAYABLE (Golden Gradient Card) */}
          <div className="bg-gradient-to-r from-[#dca74d] to-[#e8bb65] rounded-2xl p-5 shadow-xs border border-[#d29b3f]/30">
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
          <div className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-xs">
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

        {/* Incentive Ledger Table Card */}
        <div className="bg-white rounded-2xl border border-[#e8e2d5] shadow-xs overflow-hidden">
          {/* Controls Bar */}
          <div className="p-4 border-b border-[#e8e2d5] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-[#faf8f4]">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8f8278]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search source customer, beneficiary..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] placeholder-[#a2958b] focus:outline-none focus:border-[#9e6212] transition-colors"
              />
            </div>

            {/* Filter and Export */}
            <div className="flex items-center gap-2">
              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white border border-[#e8e2d5] rounded-xl pl-3 pr-7 py-1.5 text-xs text-[#2c1b15] font-medium focus:outline-none focus:border-[#9e6212] cursor-pointer"
                >
                  <option value="All">All status</option>
                  <option value="Payable">Payable</option>
                  <option value="Paid">Paid</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 text-[#8f8278] pointer-events-none" />
              </div>

              {/* CSV Export Button */}
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#faf7f2] border border-[#e8e2d5] text-[#2c1b15] rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#8f8278]" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e8e2d5] bg-[#fbf9f5] text-[10.5px] uppercase tracking-wider text-[#8f8278] font-bold">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Beneficiary</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Kind</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2ede4] text-xs">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-[#8f8278]">
                      No incentive ledger records found matching current criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#faf7f2] transition-colors">
                      {/* Date */}
                      <td className="py-3.5 px-4 text-[#443831] font-medium whitespace-nowrap">
                        {tx.date}
                      </td>

                      {/* Beneficiary */}
                      <td className="py-3.5 px-4 font-bold text-[#2c1b15] whitespace-nowrap">
                        {tx.beneficiary}
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-4 text-[#443831] whitespace-nowrap">{tx.source}</td>

                      {/* Kind */}
                      <td className="py-3.5 px-4 text-[#73665c] font-medium">{tx.kind}</td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 text-right font-bold text-[#2c1b15] whitespace-nowrap">
                        {tx.amount}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold ${
                            tx.status === 'Payable'
                              ? 'bg-[#fef3e2] text-[#9c5807] border border-[#fbdca7]'
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
