import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Eye, Trash2, Loader2 } from 'lucide-react';
import { notify } from '../../../utils/notify';
import DashboardLayout from '../../../components/layout/DashboardLayout';
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

export function CustomerRecordsPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All branches');
  const navigate = useNavigate();
  const [pendingDelete, setPendingDelete] = useState(null);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await customerService.getCustomers();
      setCustomers(data);
    } catch (err) {
      setError(err.message || 'Failed to load customers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const branches = useMemo(() => {
    return [...new Set(customers.map((customer) => customer.branch).filter(Boolean))];
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesSearch =
        !query ||
        customer.name?.toLowerCase().includes(query) ||
        customer.phone?.includes(query) ||
        customer.email?.toLowerCase().includes(query) ||
        customer.executive?.toLowerCase().includes(query);

      const matchesBranch =
        selectedBranch === 'All branches' || customer.branch === selectedBranch;

      return matchesSearch && matchesBranch;
    });
  }, [customers, searchQuery, selectedBranch]);

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
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#241814]">
            Customer records
          </h2>
          <p className="mt-0.5 text-xs text-[#7a6e67]">
            {filteredCustomers.length}{' '}
            {filteredCustomers.length === 1 ? 'customer' : 'customers'}
          </p>
        </div>
      </div>

      <div className="mb-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-xl">
          <Search className="w-3.5 h-3.5 text-[#8c8076] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search name, mobile, email, executive"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full bg-white text-[#2c1b15] placeholder:text-[#94887e] text-xs rounded-full border border-[#e2dbcd] pl-9 pr-8 py-2.5 outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <select
          value={selectedBranch}
          onChange={(event) => setSelectedBranch(event.target.value)}
          className="bg-white text-xs font-medium text-[#2c1b15] border border-[#e2dbcd] rounded-full px-4 py-2.5"
        >
          <option value="All branches">All branches</option>
          {branches.map((branch) => (
            <option key={branch} value={branch}>
              {branch}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
          {error}
          <button type="button" className="ml-2 underline" onClick={loadCustomers}>
            Retry
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#e8e2d5] shadow-2xs overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-sm text-[#7a6e67]">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading customers…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#f3efe6] text-[10.5px] uppercase tracking-wider text-[#968a80]">
                  <th className="py-3.5 pl-5 pr-3 font-semibold">Customer</th>
                  <th className="py-3.5 px-3 font-semibold">Mobile</th>
                  <th className="py-3.5 px-3 font-semibold">Branch</th>
                  <th className="py-3.5 px-3 font-semibold">Executive</th>
                  <th className="py-3.5 px-3 font-semibold">Balance</th>
                  <th className="py-3.5 px-3 font-semibold">KYC</th>
                  <th className="py-3.5 px-3 font-semibold">Joined</th>
                  <th className="py-3.5 pr-5 pl-2 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f1e8]">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-[#8a7e75]">
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-[#faf7f0]/60">
                      <td className="py-3 pl-5 pr-3">
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
                      </td>
                      <td className="py-3 px-3 font-mono text-[#5e5148]">{customer.phone}</td>
                      <td className="py-3 px-3 text-[#5e5148]">{customer.branch || '—'}</td>
                      <td className="py-3 px-3 text-[#5e5148]">{customer.executive || '—'}</td>
                      <td className="py-3 px-3 font-bold font-mono text-[#2c1b15]">
                        {formatINR(customer.totalSaving)}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${kycClass(customer.kyc)}`}>
                          {customer.kyc || 'pending'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[#5e5148] whitespace-nowrap">
                        {formatDate(customer.joiningDate)}
                      </td>
                      <td className="py-3 pr-5 pl-2 text-right whitespace-nowrap">
                        <button
                          type="button"
                          title="View"
                          onClick={() => navigate(`${ROUTES.CUSTOMER_360}/${customer.id}`)}
                          className="p-1.5 text-stone-400 hover:text-[#2c1b15] rounded-lg"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Delete"
                          onClick={() => setPendingDelete(customer)}
                          className="p-1.5 text-stone-400 hover:text-rose-700 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
