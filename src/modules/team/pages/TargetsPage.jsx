import React, { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Target, Loader2, Search, X, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import PageHeader from '../../../components/common/PageHeader';
import DataTable from '../../../components/common/DataTable';
import AddTargetModal from '../components/AddTargetModal';
import { targetsService } from '../services/targets.service';
import { notify } from '../../../utils/notify';

const PAGE_SIZE = 10;

const formatINR = (value) =>
  `₹${Number(value || 0).toLocaleString('en-IN')}`;

const ROLE_LABELS = {
  TEAM_LEAD: 'Team Lead',
  EXECUTIVE_MANAGER: 'Executive Manager',
  MANAGER: 'Manager',
};

const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest first' },
  { value: 'createdAt:asc', label: 'Oldest first' },
  { value: 'name:asc', label: 'Name A–Z' },
  { value: 'name:desc', label: 'Name Z–A' },
  { value: 'amount:desc', label: 'Amount high→low' },
  { value: 'amount:asc', label: 'Amount low→high' },
  { value: 'customer:desc', label: 'Customers high→low' },
  { value: 'customer:asc', label: 'Customers low→high' },
];

export function TargetsPage() {
  const [targets, setTargets] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 0 });
  const [meta, setMeta] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortValue, setSortValue] = useState('createdAt:desc');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTargets = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [sortBy, order] = sortValue.split(':');
      const data = await targetsService.getTargets({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        role: roleFilter || undefined,
        status: statusFilter || undefined,
        sortBy,
        order,
      });
      setTargets(data.targets || []);
      setPagination(
        data.pagination || { page: 1, limit: PAGE_SIZE, total: 0, totalPages: 0 }
      );
      setMeta(data.meta || { total: 0 });
    } catch (err) {
      setError(err.message || 'Failed to load targets.');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, roleFilter, statusFilter, sortValue]);

  useEffect(() => {
    fetchTargets();
  }, [fetchTargets]);

  // Debounce search input before hitting the API
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Any filter change returns to page 1
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, roleFilter, statusFilter, sortValue]);

  const openCreate = () => {
    setEditingTarget(null);
    setIsModalOpen(true);
  };

  const openEdit = (target) => {
    setEditingTarget(target);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      setDeleting(true);
      await targetsService.deleteTarget(pendingDelete.id);
      setTargets((current) => current.filter((t) => t.id !== pendingDelete.id));
      setMeta((m) => ({ ...m, total: Math.max(0, m.total - 1) }));
      notify.success('Target deleted.');
      setPendingDelete(null);
    } catch (err) {
      notify.error(err.message || 'Failed to delete target.');
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = Math.max(1, pagination.totalPages || 1);
  const safePage = Math.min(page, totalPages);
  const rangeStart = pagination.total === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(safePage * PAGE_SIZE, pagination.total);

  const filterSelectCls =
    'bg-white/10 text-xs font-medium text-white border border-white/20 rounded-full px-4 py-2 outline-none backdrop-blur-sm cursor-pointer [&>option]:text-[#2c1b15]';

  const columns = [
    {
      key: 'levelNo',
      header: 'Level',
      headerClassName: 'pl-5',
      render: (t) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2c1b15] text-[#cca04b] flex items-center justify-center shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[#2c1b15]">{t.name}</p>
            <p className="text-[10px] font-mono font-semibold text-[#c88a29]">{t.levelNo}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (t) => (
        <span className="text-[#5e5148]">
          {ROLE_LABELS[t.role] || t.role}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Target amount',
      render: (t) => (
        <span className="font-bold font-mono text-[#2c1b15]">
          {formatINR(t.amount)}
        </span>
      ),
    },
    {
      key: 'customer',
      header: 'Customers',
      render: (t) => (
        <span className="font-semibold text-[#5e5148] font-mono">
          {t.customer}
        </span>
      ),
    },
    {
      key: 'prize',
      header: 'Prize / incentive',
      render: (t) => (
        <span className="text-[#5e5148]">{t.prize || '—'}</span>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (t) => (
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
            t.isActive !== false
              ? 'bg-[#e7f7ed] text-[#0f7642]'
              : 'bg-[#f3efe6] text-[#8a7e75]'
          }`}
        >
          {t.isActive !== false ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      headerClassName: 'pr-5',
      cellClassName: 'pr-5 whitespace-nowrap',
      render: (t) => (
        <>
          <button
            type="button"
            title="Edit"
            onClick={() => openEdit(t)}
            className="p-1.5 text-stone-400 hover:text-[#2c1b15] hover:bg-[#f6f2e9] rounded-lg transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Delete"
            onClick={() => setPendingDelete(t)}
            className="p-1.5 text-stone-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        crumbs={['Home', 'Team & Incentives', 'Targets']}
        title="Targets"
        subtitle={`${meta.total} target ${meta.total === 1 ? 'level' : 'levels'} configured`}
        actions={
          <>
            {/* Search */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-white/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search name, level, prize"
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

            {/* Role filter */}
            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className={filterSelectCls}
            >
              <option value="">All roles</option>
              <option value="TEAM_LEAD">Team Lead</option>
              <option value="EXECUTIVE_MANAGER">Executive Manager</option>
              <option value="MANAGER">Manager</option>
            </select>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className={filterSelectCls}
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Sort */}
            <div className="relative">
              <ArrowUpDown className="w-3.5 h-3.5 text-white/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={sortValue}
                onChange={(event) => setSortValue(event.target.value)}
                className={`${filterSelectCls} pl-8 pr-4`}
                title="Sort targets"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Add target */}
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#c88a29] hover:bg-[#d99a3d] text-[#2c1b15] text-xs font-bold transition-colors shadow-sm cursor-pointer select-none"
            >
              <Plus className="w-4 h-4" />
              <span>Add target</span>
            </button>
          </>
        }
        className="mb-5"
      />

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
          {error}
          <button type="button" className="ml-2 underline" onClick={fetchTargets}>
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-[#e8e2d5] shadow-2xs p-8 flex items-center justify-center gap-2 text-sm text-[#7a6e67]">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading targets…
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={targets}
          emptyMessage="No targets match your criteria."
        />
      )}

      {/* Pagination */}
      {!loading && pagination.total > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-[#e8d9bd] bg-[#faf0da] px-4 py-3 shadow-[0_1px_2px_rgba(44,27,21,0.05)]">
          <p className="text-[11px] font-medium text-[#8a6d3b]">
            Showing <span className="font-bold text-[#2c1b15]">{rangeStart}–{rangeEnd}</span> of{' '}
            <span className="font-bold text-[#2c1b15]">{pagination.total}</span> targets
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

      <AddTargetModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTarget(null);
        }}
        target={editingTarget}
        onCreated={fetchTargets}
      />

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-[#ded8cb]">
            <h3 className="text-sm font-bold text-[#2c1b15]">Delete target</h3>
            <p className="mt-2 text-xs text-[#7a6e67]">
              Delete {pendingDelete.name} ({pendingDelete.levelNo})? This cannot
              be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                disabled={deleting}
                className="px-3 py-1.5 rounded-xl border border-[#e8e2d5] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-3 py-1.5 rounded-xl bg-rose-700 text-white text-xs font-semibold disabled:opacity-60"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default TargetsPage;
