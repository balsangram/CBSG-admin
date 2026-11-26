import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { notify } from '../../../utils/notify';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import PageHeader from '../../../components/common/PageHeader';
import DataTable from '../../../components/common/DataTable';
import { customerService } from '../services/customer.service';
import { ROUTES } from '../../../utils/constants';

const formatINR = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const kycClass = (kyc) => {
  if (kyc === 'verified') return 'bg-[#e7f7ed] text-[#0f7642]';
  if (kyc === 'rejected') return 'bg-[#fee2e2] text-[#b91c1c]';
  return 'bg-[#fef1db] text-[#b46500]';
};

const PAGE_SIZE = 10;

export function CustomerRecordsPage() {
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 0 });
  const [meta, setMeta] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All branches');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [pendingDelete, setPendingDelete] = useState(null);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await customerService.getCustomers({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        branch: selectedBranch !== 'All branches' ? selectedBranch : undefined,
      });
      setCustomers(data.customers || []);
      setPagination(
        data.pagination || { page: 1, limit: PAGE_SIZE, total: 0, totalPages: 0 }
      );
      setMeta(data.meta || { total: 0 });
    } catch (err) {
      setError(err.message || 'Failed to load customers.');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, selectedBranch]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Debounce search input before hitting the API
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Any filter change returns to page 1
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedBranch]);

  const branches = useMemo(() => {
    return [...new Set(customers.map((customer) => customer.branch).filter(Boolean))];
  }, [customers]);

  // Pagination meta comes from the API
  const totalPages = Math.max(1, pagination.totalPages || 1);
  const safePage = Math.min(page, totalPages);
  const rangeStart = pagination.total === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(safePage * PAGE_SIZE, pagination.total);

  const columns = [
    {
      key: 'name',
      header: 'Customer',
      headerClassName: 'pl-5',
      render: (customer) => (
        <div className="flex items-center gap-3">
          {customer.photo ? (
            <img
              src={customer.photo}
              alt=""
              className="w-8 h-8 rounded-full object-cover border border-[#e0d9cb]"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#2c1b15] text-[#cca04b] text-[11px] font-bold flex items-center justify-center">
              {(customer.name || 'C').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-bold text-[#2c1b15] truncate">{customer.name}</p>
            <p className="text-[10px] text-[#8c8076] truncate">
              {customer.email || '—'}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Mobile',
      render: (customer) => (
        <span className="font-mono text-[#5e5148]">{customer.phone}</span>
      ),
    },
    {
      key: 'branch',
      header: 'Branch',
      render: (customer) => <span className="text-[#5e5148]">{customer.branch || '—'}</span>,
    },
    {
      key: 'executive',
      header: 'Executive',
      render: (customer) => <span className="text-[#5e5148]">{customer.executive || '—'}</span>,
    },
    {
      key: 'totalSaving',
      header: 'Balance',
      render: (customer) => (
        <span className="font-bold font-mono text-[#2c1b15]">
          {formatINR(customer.totalSaving)}
        </span>
      ),
    },
    {
      key: 'kyc',
      header: 'KYC',
      render: (customer) => (
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${kycClass(customer.kyc)}`}>
          {customer.kyc || 'pending'}
        </span>
      ),
    },
    {
      key: 'joiningDate',
      header: 'Joined',
      render: (customer) => (
        <span className="text-[#5e5148] whitespace-nowrap">{formatDate(customer.joiningDate)}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      headerClassName: 'pr-5',
      cellClassName: 'pr-5 whitespace-nowrap',
      render: (customer) => (
        <>
          <button
            type="button"
            title="View"
            onClick={() => navigate(`${ROUTES.CUSTOMER_360}/${customer.id}`)}
            className="p-1.5 text-stone-400 hover:text-[#2c1b15] hover:bg-[#f6f2e9] rounded-lg transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Delete"
            onClick={() => setPendingDelete(customer)}
            className="p-1.5 text-stone-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </>
      ),
    },
  ];

  const handleDelete = async () => {
    if (!pendingDelete) return;

    try {
      await customerService.deleteCustomer(pendingDelete.id);
      setCustomers((current) =>
        current.filter((customer) => customer.id !== pendingDelete.id)
      );
      notify.success('Customer deleted.');
      setPendingDelete(null);
    } catch (err) {
      notify.error(err.message || 'Failed to delete customer.');
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        crumbs={['Home', 'Customers', 'Customer Records']}
        title="Customer records"
        subtitle={`${meta.total} ${meta.total === 1 ? 'customer' : 'customers'}`}
        actions={
          <>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-white/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search name, mobile, email, executive"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full bg-white/10 text-white placeholder:text-white/50 text-xs rounded-full border border-white/20 pl-9 pr-8 py-2 outline-none backdrop-blur-sm focus:border-white/40"
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
              value={selectedBranch}
              onChange={(event) => setSelectedBranch(event.target.value)}
              className="bg-white/10 text-xs font-medium text-white border border-white/20 rounded-full px-4 py-2 outline-none backdrop-blur-sm cursor-pointer [&>option]:text-[#2c1b15]"
            >
              <option value="All branches">All branches</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </>
        }
        className="mb-5"
      />

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
          {error}
          <button type="button" className="ml-2 underline" onClick={fetchCustomers}>
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-[#e8e2d5] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#f3efe6] bg-[#faf7f0] text-[10.5px] uppercase tracking-wider text-[#968a80]">
                  {columns.map((col) => (
                    <th key={col.key} className={`py-3.5 px-3 font-semibold ${col.headerClassName || ''} ${col.align === 'right' ? 'text-right' : ''}`}>
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f1e8]">
                {Array.from({ length: 6 }).map((_, row) => (
                  <tr key={row} className="animate-pulse">
                    <td className="py-3.5 pl-5 pr-3">
                      <div className="flex items-center gap-3">
                        <div className="sk-skeleton h-8 w-8 rounded-full shrink-0" />
                        <div className="space-y-1.5">
                          <div className="sk-skeleton h-3 w-32 rounded-md" />
                          <div className="sk-skeleton h-2.5 w-24 rounded-md" />
                        </div>
                      </div>
                    </td>
                    {columns.slice(1).map((col) => (
                      <td key={col.key} className="py-3.5 px-3">
                        <div className={`sk-skeleton rounded-md ${col.key === 'kyc' ? 'h-5 w-16 rounded-full' : col.key === 'actions' ? 'h-6 w-14 ml-auto rounded-lg' : 'h-3 w-20'}`} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={customers}
          emptyMessage="No customers found."
        />
      )}

      {/* Pagination */}
      {!loading && pagination.total > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-[#e8d9bd] bg-[#faf0da] px-4 py-3 shadow-[0_1px_2px_rgba(44,27,21,0.05)]">
          <p className="text-[11px] font-medium text-[#8a6d3b]">
            Showing <span className="font-bold text-[#2c1b15]">{rangeStart}–{rangeEnd}</span> of{' '}
            <span className="font-bold text-[#2c1b15]">{pagination.total}</span> customers
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              aria-label="Previous page"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#e0cba4] bg-white/70 text-[#5e4a2a] transition-colors hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((n) => n === 1 || n === totalPages || Math.abs(n - safePage) <= 1)
              .reduce((acc, n, idx, arr) => {
                if (idx > 0 && n - arr[idx - 1] > 1) acc.push('…');
                acc.push(n);
                return acc;
              }, [])
              .map((item, idx) =>
                item === '…' ? (
                  <span key={`ellipsis-${idx}`} className="px-1 text-[11px] font-semibold text-[#8a6d3b]">…</span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPage(item)}
                    aria-label={`Page ${item}`}
                    aria-current={item === safePage ? 'page' : undefined}
                    className={`h-8 min-w-8 px-2 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                      item === safePage
                        ? 'bg-[#2c1b15] text-white shadow-xs'
                        : 'border border-[#e0cba4] bg-white/70 text-[#5e4a2a] hover:bg-white'
                    }`}
                  >
                    {item}
                  </button>
                )
              )}

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              aria-label="Next page"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#e0cba4] bg-white/70 text-[#5e4a2a] transition-colors hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-[#ded8cb]">
            <h3 className="text-sm font-bold text-[#2c1b15]">Delete customer</h3>
            <p className="mt-2 text-xs text-[#7a6e67]">
              Delete {pendingDelete.name}? This removes the customer record.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="px-3 py-1.5 rounded-xl border border-[#e8e2d5] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-1.5 rounded-xl bg-rose-700 text-white text-xs font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default CustomerRecordsPage;
