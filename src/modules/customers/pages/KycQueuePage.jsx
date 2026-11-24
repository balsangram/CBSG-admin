import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import DataTable from '../../../components/common/DataTable';
import { mockKycQueueData, kycService } from '../services/kyc.service';
import { ROUTES } from '../../../utils/constants';

export function KycQueuePage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState(mockKycQueueData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All'); // 'All', 'Approved', 'Rejected', 'Pending'
  const [showSignedInAlert, setShowSignedInAlert] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  // Calculate live stats
  const stats = useMemo(() => kycService.getStats(records), [records]);

  // Filter records
  const filteredRecords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return records.filter((rec) => {
      const matchesSearch =
        !q ||
        rec.customer.toLowerCase().includes(q) ||
        rec.phone.includes(q) ||
        rec.branch.toLowerCase().includes(q);

      const matchesFilter =
        selectedFilter === 'All' ||
        rec.kycStatus.toLowerCase() === selectedFilter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [records, searchQuery, selectedFilter]);

  // Handle Approve action
  const handleApprove = (id) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, kycStatus: 'Approved', reviewReason: '—' } : r
      )
    );
    setToastMessage('Customer KYC approved and signed off by Maker-Checker.');
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Handle Reject action
  const handleReject = (id, reason) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, kycStatus: 'Rejected', reviewReason: reason } : r
      )
    );
    setToastMessage('KYC status updated to Rejected with review reason.');
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Navigate to the KYC review page with the record
  const openReview = (rec) => {
    navigate(ROUTES.KYC_REVIEW, { state: { record: rec } });
  };

  const columns = [
    {
      key: 'customer',
      header: 'Customer',
      headerClassName: 'pl-5 pr-3',
      cellClassName: 'pl-5 pr-3',
      render: (rec) => (
        <div className="flex items-center gap-3">
          <img
            src={rec.avatar}
            alt={rec.customer}
            className="w-8 h-8 rounded-full object-cover border border-[#e0d9cb] shrink-0"
          />
          <span className="font-bold text-[#2c1b15]">{rec.customer}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      cellClassName: 'text-[#5e5148] font-mono text-[11.5px] whitespace-nowrap',
    },
    {
      key: 'branch',
      header: 'Branch',
      cellClassName: 'text-[#5e5148] whitespace-nowrap',
    },
    {
      key: 'kycStatus',
      header: 'KYC Status',
      cellClassName: 'whitespace-nowrap',
      render: (rec) => (
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold ${
            rec.kycStatus === 'Approved'
              ? 'bg-[#e7f7ed] text-[#0f7642]'
              : rec.kycStatus === 'Rejected'
              ? 'bg-[#fee2e2] text-[#b91c1c]'
              : 'bg-[#fef1db] text-[#b46500]'
          }`}
        >
          {rec.kycStatus}
        </span>
      ),
    },
    {
      key: 'reviewReason',
      header: 'Review Reason',
      cellClassName: 'text-[#5e5148] max-w-xs truncate',
      render: (rec) => (
        <span title={rec.reviewReason}>{rec.reviewReason}</span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      headerClassName: 'pr-5 pl-2 text-right',
      cellClassName: 'pr-5 pl-2 text-right whitespace-nowrap',
      align: 'right',
      render: (rec) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openReview(rec);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#ded8cb] text-xs font-semibold text-[#2c1b15] hover:bg-[#faf7f0] transition-colors cursor-pointer select-none"
        >
          <Eye className="w-3 h-3 text-[#7a6e67]" />
          <span>View KYC</span>
        </button>
      ),
    },
  ];

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

      {/* 2. Page Header */}
      <div className="mb-5">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#241814]">
          KYC approval queue
        </h2>
        <p className="mt-0.5 text-xs text-[#7a6e67]">
          {stats.total} customer records
        </p>
      </div>

      {/* 3. Three Metric Statistics Cards */}
      <div className="bg-white rounded-2xl border border-[#e8e2d5] shadow-2xs mb-5 p-5">
        <div className="grid grid-cols-3 divide-x divide-[#f0ebdF]">
          {/* Approved */}
          <div className="pr-4 sm:pr-8">
            <span className="text-[11px] font-medium text-[#7a6e67] block">
              Approved
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#2c1b15] tracking-tight">
              {stats.approved}
            </span>
          </div>

          {/* Rejected */}
          <div className="px-4 sm:px-8">
            <span className="text-[11px] font-medium text-[#7a6e67] block">
              Rejected
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#2c1b15] tracking-tight">
              {stats.rejected}
            </span>
          </div>

          {/* Pending */}
          <div className="pl-4 sm:pl-8">
            <span className="text-[11px] font-medium text-[#7a6e67] block">
              Pending
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#2c1b15] tracking-tight">
              {stats.pending}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Search and Filter Bar */}
      <div className="mb-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-[#8c8076] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search customer name or phone"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-[#2c1b15] placeholder:text-[#94887e] text-xs rounded-full border border-[#e2dbcd] focus:border-[#c8bfb0] pl-9 pr-8 py-2.5 transition-all outline-none shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="inline-flex p-1 bg-white border border-[#ded8cb] rounded-full gap-1 text-xs font-semibold self-start sm:self-auto shadow-2xs">
          {['All', 'Approved', 'Rejected', 'Pending'].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                selectedFilter === filter
                  ? 'bg-[#2c1b15] text-white'
                  : 'text-[#6e6158] hover:text-[#2c1b15]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* 5. KYC Approval Queue Table */}
      <DataTable
        columns={columns}
        data={filteredRecords}
        emptyMessage="No KYC records match your criteria."
      />

    </DashboardLayout>
  );
}

export default KycQueuePage;

