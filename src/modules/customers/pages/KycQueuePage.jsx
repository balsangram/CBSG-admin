import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  Eye,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import PageHeader from '../../../components/common/PageHeader';
import DataTable from '../../../components/common/DataTable';
import { kycService } from '../services/kyc.service';
import { ROUTES } from '../../../utils/constants';

const PAGE_SIZE = 10;

// UI filter label -> backend status enum
const FILTER_TO_STATUS = {
  All: undefined,
  Approved: 'VERIFIED',
  Rejected: 'REJECTED',
  Pending: 'PENDING',
};

const STATUS_BADGE = {
  VERIFIED: 'bg-[#e7f7ed] text-[#0f7642]',
  REJECTED: 'bg-[#fee2e2] text-[#b91c1c]',
  PENDING: 'bg-[#fef1db] text-[#b46500]',
  IN_PROGRESS: 'bg-[#fef1db] text-[#b46500]',
  UNDER_REVIEW: 'bg-[#e0f2fe] text-[#0369a1]',
};

const STATUS_LABEL = {
  VERIFIED: 'Approved',
  REJECTED: 'Rejected',
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  UNDER_REVIEW: 'Under Review',
};

// Map API KYC list item -> table/review record shape
const toRecord = (kyc) => ({
  id: kyc.id,
  customerId: kyc.userId, // used by /admin/kyc/:customerId
  customer: kyc.customer?.name || 'Unknown',
  phone: kyc.customer?.phone || '—',
  email: kyc.customer?.email || '',
  avatar: kyc.customer?.photo || null,
  kycStatus: kyc.status,
  reviewReason: kyc.rejectionReason || '—',
  createdAt: kyc.createdAt,
});

export function KycQueuePage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [meta, setMeta] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [pagination, setPagination] = useState({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const [toastMessage, setToastMessage] = useState('');

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const fetchKycs = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await kycService.getKycList({
        page: pagination.page,
        limit: PAGE_SIZE,
        status: FILTER_TO_STATUS[selectedFilter],
        search: debouncedSearch || undefined,
      });
      setRecords((data?.kycs || []).map(toRecord));
      setPagination(data?.pagination || { page: 1, limit: PAGE_SIZE, total: 0, totalPages: 0 });
      setMeta(data?.meta || { total: 0, pending: 0, approved: 0, rejected: 0 });
    } catch (err) {
      setError(err.message || 'Failed to load KYC queue.');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, selectedFilter, debouncedSearch]);

  useEffect(() => {
    fetchKycs();
  }, [fetchKycs]);

  // Reset to page 1 when filters/search change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [selectedFilter, debouncedSearch]);

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
          {rec.avatar ? (
            <img
              src={rec.avatar}
              alt={rec.customer}
              className="w-8 h-8 rounded-full object-cover border border-[#e0d9cb] shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#f0ebdf] flex items-center justify-center text-[#7a6e67] text-[10px] font-bold shrink-0">
              {rec.customer.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <span className="font-bold text-[#2c1b15] block truncate">{rec.customer}</span>
            {rec.email && (
              <span className="text-[10.5px] text-[#8a7e75] block truncate">{rec.email}</span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      cellClassName: 'text-[#5e5148] font-mono text-[11.5px] whitespace-nowrap',
    },
    {
      key: 'createdAt',
      header: 'Submitted',
      cellClassName: 'text-[#5e5148] whitespace-nowrap',
      render: (rec) =>
        rec.createdAt
          ? new Date(rec.createdAt).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
          : '—',
    },
    {
      key: 'kycStatus',
      header: 'KYC Status',
      cellClassName: 'whitespace-nowrap',
      render: (rec) => (
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold ${
            STATUS_BADGE[rec.kycStatus] || 'bg-stone-100 text-stone-600'
          }`}
        >
          {STATUS_LABEL[rec.kycStatus] || rec.kycStatus}
        </span>
      ),
    },
    {
      key: 'action',
      header: '',
      headerClassName: 'pr-5 pl-2 text-right',
      cellClassName: 'pr-5 pl-2 text-right whitespace-nowrap',
      align: 'right',
      render: (rec) => (
        <button
          type="button"
          title="View"
          aria-label="View KYC"
          onClick={(e) => {
            e.stopPropagation();
            openReview(rec);
          }}
          className="p-1.5 text-stone-400 hover:text-[#2c1b15] rounded-lg cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        crumbs={['Home', 'Customers', 'KYC Queue']}
        title="KYC approval queue"
        subtitle={`${meta.total} customer records`}
        actions={
          <>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-white/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search customer name, email or phone"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 text-white placeholder:text-white/50 text-xs rounded-full border border-white/20 pl-9 pr-8 py-2 transition-all outline-none backdrop-blur-sm focus:border-white/40"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <select
              value={selectedFilter}
              onChange={(event) => setSelectedFilter(event.target.value)}
              aria-label="KYC status"
              className="bg-white/10 text-xs font-semibold text-white border border-white/20 rounded-full pl-4 pr-8 py-2 outline-none backdrop-blur-sm cursor-pointer [&>option]:text-[#2c1b15]"
            >
              {['All', 'Approved', 'Rejected', 'Pending'].map((filter) => (
                <option key={filter} value={filter}>
                  {filter}
                </option>
              ))}
            </select>
          </>
        }
        className="mb-5"
      />
      {/* Page content */}

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

      {/* 2. Metric Statistics Cards (from API meta) */}
      <div className="bg-white rounded-2xl border border-[#e8e2d5] shadow-2xs mb-5 p-5">
        <div className="grid grid-cols-3 divide-x divide-[#f0ebdF]">
          <div className="pr-4 sm:pr-8">
            <span className="text-[11px] font-medium text-[#7a6e67] block">
              Approved
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#2c1b15] tracking-tight">
              {meta.approved}
            </span>
          </div>
          <div className="px-4 sm:px-8">
            <span className="text-[11px] font-medium text-[#7a6e67] block">
              Rejected
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#2c1b15] tracking-tight">
              {meta.rejected}
            </span>
          </div>
          <div className="pl-4 sm:pl-8">
            <span className="text-[11px] font-medium text-[#7a6e67] block">
              Pending
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#2c1b15] tracking-tight">
              {meta.pending}
            </span>
          </div>
        </div>
      </div>

      {/* KYC Approval Queue Table */}
      {loading ? (
        <div className="flex items-center justify-center py-24 text-stone-500 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading KYC queue…</span>
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-[#e8e2d5] p-12 text-center">
          <p className="text-xs text-rose-600 mb-3">{error}</p>
          <button
            type="button"
            onClick={fetchKycs}
            className="px-4 py-2 bg-[#2c1b15] text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={records}
            emptyMessage="No KYC records match your criteria."
          />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-xs text-[#7a6e67]">
              <span>
                Page {pagination.page} of {pagination.totalPages} ·{' '}
                {pagination.total} records
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                  }
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#ded8cb] bg-white font-semibold text-[#2c1b15] hover:bg-[#faf7f0] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Prev
                </button>
                <button
                  type="button"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                  }
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#ded8cb] bg-white font-semibold text-[#2c1b15] hover:bg-[#faf7f0] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}

export default KycQueuePage;
