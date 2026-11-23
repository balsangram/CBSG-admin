import React, { useState } from 'react';
import { Search, ChevronDown, Upload, X } from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import TransactionDetailModal from '../components/TransactionDetailModal';
import { transactionsService } from '../services/transactions.service';

export function TransactionLogsPage() {
  const [transactions] = useState(() => transactionsService.getTransactions());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedTx, setSelectedTx] = useState(null);
  const [bannerVisible, setBannerVisible] = useState(true);

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.channel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.date.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || tx.status === statusFilter;
    const matchesType = typeFilter === 'All' || tx.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleExportCSV = () => {
    const headers = ['Date,Reference,Customer,Type,Mode,Channel,Amount,Status,UTR'];
    const rows = filteredTransactions.map(
      (tx) =>
        `"${tx.date}","${tx.reference}","${tx.customer}","${tx.type}","${tx.mode}","${tx.channel}","${tx.amount}","${tx.status}","${tx.utr}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cbsg_transaction_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-7xl mx-auto pb-16">
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

        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="text-2xl font-bold text-[#2c1b15] tracking-tight">Transaction logs</h1>
            <p className="text-xs text-[#8f8278] mt-0.5">
              {filteredTransactions.length} of {transactions.length} transactions
            </p>
          </div>

          {/* Export Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-[#faf7f2] border border-[#e8e2d5] text-[#2c1b15] rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#8f8278]" />
            <span>Export</span>
          </button>
        </div>

        {/* Transaction Table Card */}
        <div className="bg-white rounded-2xl border border-[#e8e2d5] shadow-2xs overflow-hidden">
          {/* Top Search & Filter Bar */}
          <div className="p-3.5 border-b border-[#f0eae0] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8f8278]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reference or customer"
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] placeholder-[#a2958b] focus:outline-none focus:border-[#9e6212] transition-colors"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2">
              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white border border-[#e8e2d5] rounded-xl pl-3 pr-7 py-1.5 text-xs text-[#2c1b15] font-medium focus:outline-none cursor-pointer"
                >
                  <option value="All">All status</option>
                  <option value="Success">Success</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 text-[#8f8278] pointer-events-none" />
              </div>

              {/* Type Filter */}
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="appearance-none bg-white border border-[#e8e2d5] rounded-xl pl-3 pr-7 py-1.5 text-xs text-[#2c1b15] font-medium focus:outline-none cursor-pointer"
                >
                  <option value="All">All types</option>
                  <option value="Deposit">Deposit</option>
                  <option value="Settlement">Settlement</option>
                  <option value="Withdrawal">Withdrawal</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 text-[#8f8278] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#f0eae0] text-[10.5px] uppercase tracking-wider text-[#8f8278] font-bold">
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Reference</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Type</th>
                  <th className="py-3 px-4 font-semibold">Mode</th>
                  <th className="py-3 px-4 font-semibold">Channel</th>
                  <th className="py-3 px-4 font-semibold">Amount</th>
                  <th className="py-3 px-4 text-center font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f7f2ea] text-xs">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-xs text-[#8f8278]">
                      No transaction records found matching current query.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      onClick={() => setSelectedTx(tx)}
                      className="hover:bg-[#faf7f2] transition-colors cursor-pointer group"
                    >
                      {/* Date */}
                      <td className="py-3 px-4 text-[#443831] font-normal whitespace-nowrap">
                        {tx.date}
                      </td>

                      {/* Reference */}
                      <td className="py-3 px-4 font-medium text-[#2c1b15] font-mono whitespace-nowrap group-hover:text-[#9e6212] transition-colors">
                        {tx.reference}
                      </td>

                      {/* Customer */}
                      <td className="py-3 px-4 font-normal text-[#2c1b15] whitespace-nowrap">
                        {tx.customer}
                      </td>

                      {/* Type */}
                      <td className="py-3 px-4 text-[#73665c] font-normal whitespace-nowrap">
                        {tx.type}
                      </td>

                      {/* Mode */}
                      <td className="py-3 px-4 text-[#443831] font-normal whitespace-nowrap">
                        {tx.mode}
                      </td>

                      {/* Channel */}
                      <td className="py-3 px-4 text-[#73665c] font-normal whitespace-nowrap">
                        {tx.channel}
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-4 font-semibold text-[#2c1b15] whitespace-nowrap">
                        {tx.amount}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            tx.status === 'Success'
                              ? 'bg-[#e7f7ed] text-[#0d7a3e] border border-[#c3eed4]'
                              : 'bg-[#fef4e6] text-[#b86200] border border-[#fde4c4]'
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

        {/* Transaction Detail Modal */}
        <TransactionDetailModal
          tx={selectedTx}
          isOpen={!!selectedTx}
          onClose={() => setSelectedTx(null)}
        />
      </div>
    </DashboardLayout>
  );
}

export default TransactionLogsPage;

