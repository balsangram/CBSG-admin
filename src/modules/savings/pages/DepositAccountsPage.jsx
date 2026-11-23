import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  ChevronDown,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { mockDepositAccounts } from '../services/savings.service';

export function DepositAccountsPage() {
  const [accounts] = useState(mockDepositAccounts);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showSignedInAlert, setShowSignedInAlert] = useState(true);

  // Filter accounts
  const filteredAccounts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return accounts.filter((acc) => {
      const matchesSearch =
        !q ||
        acc.account.toLowerCase().includes(q) ||
        acc.customer.toLowerCase().includes(q) ||
        acc.plan.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'All' ||
        acc.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [accounts, searchQuery, statusFilter]);

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

      {/* 2. Page Header */}
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#241814]">
            Deposit & savings accounts
          </h2>
          <p className="mt-0.5 text-xs text-[#7a6e67]">
            14 accounts · ₹7.72 L
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Quick Search */}
          <div className="relative w-48 sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#8c8076] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter account or client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-[#2c1b15] placeholder:text-[#94887e] text-xs rounded-full border border-[#ded8cb] pl-8 pr-3 py-1.5 outline-none shadow-2xs"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white text-xs font-semibold text-[#2c1b15] border border-[#ded8cb] rounded-full pl-3 pr-7 py-1.5 shadow-2xs outline-none cursor-pointer"
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Nearing maturity">Nearing maturity</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#8c8076] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 3. Deposit Accounts Table */}
      <div className="bg-white rounded-2xl border border-[#e8e2d5] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#f3efe6] text-[10.5px] uppercase tracking-wider text-[#968a80]">
                <th className="py-3.5 pl-5 pr-3 font-semibold">ACCOUNT</th>
                <th className="py-3.5 px-3 font-semibold">CUSTOMER</th>
                <th className="py-3.5 px-3 font-semibold">PLAN</th>
                <th className="py-3.5 px-3 font-semibold min-w-[140px]">PROGRESS</th>
                <th className="py-3.5 px-3 font-semibold">BALANCE</th>
                <th className="py-3.5 px-3 font-semibold">MATURITY</th>
                <th className="py-3.5 pr-5 pl-3 font-semibold text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f1e8]">
              {filteredAccounts.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-[#faf7f0]/60 transition-colors"
                >
                  {/* ACCOUNT */}
                  <td className="py-3 pl-5 pr-3 font-bold text-[#2c1b15] font-mono whitespace-nowrap">
                    {item.account}
                  </td>

                  {/* CUSTOMER */}
                  <td className="py-3 px-3 font-medium text-[#2c1b15] whitespace-nowrap">
                    {item.customer}
                  </td>

                  {/* PLAN */}
                  <td className="py-3 px-3 text-[#5e5148] whitespace-nowrap">
                    {item.plan}
                  </td>

                  {/* PROGRESS */}
                  <td className="py-3 px-3">
                    <div className="space-y-1">
                      <span className="text-[10.5px] font-mono text-[#7a6e67] block leading-none">
                        {item.progress}%
                      </span>
                      <div className="w-28 sm:w-36 bg-[#eee9df] rounded-full h-1 overflow-hidden">
                        <div
                          className="bg-[#c88a29] h-1 rounded-full"
                          style={{ width: `${Math.min(100, item.progress)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* BALANCE */}
                  <td className="py-3 px-3 font-bold text-[#2c1b15] font-mono whitespace-nowrap">
                    {item.balance}
                  </td>

                  {/* MATURITY */}
                  <td className="py-3 px-3 text-[#7a6e67] whitespace-nowrap">
                    {item.maturity}
                  </td>

                  {/* STATUS */}
                  <td className="py-3 pr-5 pl-3 text-right whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        item.status === 'Active'
                          ? 'bg-[#e7f7ed] text-[#0f7642]'
                          : 'bg-[#fef1db] text-[#b46500]'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DepositAccountsPage;

