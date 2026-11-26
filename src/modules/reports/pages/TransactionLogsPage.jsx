import React, { useState } from 'react';
import { Search, ChevronDown, Upload, X } from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import PageHeader from '../../../components/common/PageHeader';
import DataTable from '../../../components/common/DataTable';
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

  const columns = [
    {
      key: 'date',
      header: 'Date',
      cellClassName: 'text-[#443831] font-normal whitespace-nowrap',
    },
    {
      key: 'reference',
      header: 'Reference',
      cellClassName:
        'font-medium text-[#2c1b15] font-mono whitespace-nowrap group-hover:text-[#9e6212] transition-colors',
    },
    {
      key: 'customer',
      header: 'Customer',
      cellClassName: 'font-normal text-[#2c1b15] whitespace-nowrap',
    },
    {
      key: 'type',
      header: 'Type',
      cellClassName: 'text-[#73665c] font-normal whitespace-nowrap',
    },
    {
      key: 'mode',
      header: 'Mode',
      cellClassName: 'text-[#443831] font-normal whitespace-nowrap',
    },
    {
      key: 'channel',
      header: 'Channel',
      cellClassName: 'text-[#73665c] font-normal whitespace-nowrap',
    },
    {
      key: 'amount',
      header: 'Amount',
      cellClassName: 'font-semibold text-[#2c1b15] whitespace-nowrap',
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      cellClassName: 'text-center whitespace-nowrap',
      render: (tx) => (
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
            tx.status === 'Success'
              ? 'bg-[#e7f7ed] text-[#0d7a3e] border border-[#c3eed4]'
              : 'bg-[#fef4e6] text-[#b86200] border border-[#fde4c4]'
          }`}
        >
          {tx.status}
        </span>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        crumbs={['Home', 'Reports', 'Transaction Logs']}
        title="Transaction logs"
        subtitle={`${filteredTransactions.length} of ${transactions.length} transactions`}
        actions={
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#c88a29] hover:bg-[#d99a3d] text-[#2c1b15] text-xs font-bold transition-colors shadow-sm cursor-pointer select-none"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        }
        className="mb-5"
      />
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
          <DataTable
            bare
            columns={columns}
            data={filteredTransactions}
            emptyMessage="No transaction records found matching current query."
            onRowClick={setSelectedTx}
            rowClassName="group"
          />
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

