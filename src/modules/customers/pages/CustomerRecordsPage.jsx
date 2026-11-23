import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  ChevronDown,
  X,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CustomerDetailModal from '../components/CustomerDetailModal';
import { mockCustomerRecords } from '../services/customer.service';

export function CustomerRecordsPage() {
  const [customers] = useState(mockCustomerRecords);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState('All stages');
  const [selectedBranch, setSelectedBranch] = useState('All branches');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showSignedInAlert, setShowSignedInAlert] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  // Filter customers dynamically
  const filteredCustomers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return customers.filter((customer) => {
      // Search matching
      const matchesSearch =
        !q ||
        customer.name.toLowerCase().includes(q) ||
        customer.code.toLowerCase().includes(q) ||
        customer.mobile.includes(q) ||
        customer.executive.toLowerCase().includes(q);

      // Stage matching
      const matchesStage =
        selectedStage === 'All stages' ||
        customer.stage.toLowerCase() === selectedStage.toLowerCase();

      // Branch matching
      const matchesBranch =
        selectedBranch === 'All branches' ||
        customer.branch.toLowerCase() === selectedBranch.toLowerCase();

      return matchesSearch && matchesStage && matchesBranch;
    });
  }, [customers, searchQuery, selectedStage, selectedBranch]);

  // Export CSV handler
  const handleExportCSV = () => {
    const headers = ['Name', 'Customer Code', 'Mobile', 'Branch', 'Executive', 'Plans', 'Balance', 'KYC', 'Stage'];
    const rows = filteredCustomers.map((c) => [
      c.name,
      c.code,
      c.mobile,
      c.branch,
      c.executive,
      c.plans,
      c.balance,
      c.kyc,
      c.stage,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CBSG_Customer_Records_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage(`Exported ${filteredCustomers.length} customer records to CSV.`);
    setTimeout(() => setToastMessage(''), 4000);
  };

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

      {/* 2. Page Header: Title and Export Action */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#241814]">
            Customer records
          </h2>
          <p className="mt-0.5 text-xs text-[#7a6e67]">
            {filteredCustomers.length} {filteredCustomers.length === 1 ? 'customer' : 'customers'}
          </p>
        </div>

        {/* Export Button */}
        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#f6f2e9] border border-[#ded8cb] text-xs font-medium text-[#2c1b15] transition-colors shadow-2xs cursor-pointer select-none"
        >
          <Download className="w-3.5 h-3.5 text-[#7a6e67]" />
          <span>Export</span>
        </button>
      </div>

      {/* 3. Search and Filters Bar */}
      <div className="mb-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-xl">
          <Search className="w-3.5 h-3.5 text-[#8c8076] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search name, mobile, referral code"
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

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          {/* Stage Filter */}
          <div className="relative">
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="appearance-none bg-white text-xs font-medium text-[#2c1b15] border border-[#e2dbcd] rounded-full pl-4 pr-8 py-2.5 shadow-2xs outline-none cursor-pointer hover:border-[#c8bfb0] transition-colors"
            >
              <option value="All stages">All stages</option>
              <option value="active">Active</option>
              <option value="maturing">Maturing</option>
              <option value="new">New</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#8c8076] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Branch Filter */}
          <div className="relative">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="appearance-none bg-white text-xs font-medium text-[#2c1b15] border border-[#e2dbcd] rounded-full pl-4 pr-8 py-2.5 shadow-2xs outline-none cursor-pointer hover:border-[#c8bfb0] transition-colors"
            >
              <option value="All branches">All branches</option>
              <option value="Pune">Pune</option>
              <option value="Nagpur">Nagpur</option>
              <option value="Mumbai">Mumbai</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#8c8076] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 4. Customer Records Table Card */}
      <div className="bg-white rounded-2xl border border-[#e8e2d5] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#f3efe6] text-[10.5px] uppercase tracking-wider text-[#968a80]">
                <th className="py-3.5 pl-5 pr-3 font-semibold">CUSTOMER</th>
                <th className="py-3.5 px-3 font-semibold">MOBILE</th>
                <th className="py-3.5 px-3 font-semibold">BRANCH</th>
                <th className="py-3.5 px-3 font-semibold">EXECUTIVE</th>
                <th className="py-3.5 px-3 font-semibold">PLANS</th>
                <th className="py-3.5 px-3 font-semibold">BALANCE</th>
                <th className="py-3.5 px-3 font-semibold">KYC</th>
                <th className="py-3.5 px-3 font-semibold">STAGE</th>
                <th className="py-3.5 pr-5 pl-2 font-semibold text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f1e8]">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-xs text-[#8a7e75]">
                    No customer records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer)}
                    className="hover:bg-[#faf7f0]/60 transition-colors cursor-pointer group"
                  >
                    {/* CUSTOMER: Avatar, Name & Code */}
                    <td className="py-3 pl-5 pr-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={customer.avatar}
                          alt={customer.name}
                          className="w-8 h-8 rounded-full object-cover border border-[#e0d9cb] shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-[#2c1b15] leading-tight truncate">
                            {customer.name}
                          </p>
                          <p className="text-[10px] text-[#8c8076] font-mono mt-0.5 tracking-tight truncate">
                            {customer.code}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* MOBILE */}
                    <td className="py-3 px-3 text-[#5e5148] font-mono text-[11.5px] whitespace-nowrap">
                      {customer.mobile}
                    </td>

                    {/* BRANCH */}
                    <td className="py-3 px-3 text-[#5e5148] whitespace-nowrap">
                      {customer.branch}
                    </td>

                    {/* EXECUTIVE */}
                    <td className="py-3 px-3 text-[#5e5148] whitespace-nowrap">
                      {customer.executive}
                    </td>

                    {/* PLANS */}
                    <td className="py-3 px-3 text-[#2c1b15] font-semibold whitespace-nowrap">
                      {customer.plans}
                    </td>

                    {/* BALANCE */}
                    <td className="py-3 px-3 font-bold text-[#2c1b15] font-mono whitespace-nowrap">
                      {customer.balance}
                    </td>

                    {/* KYC Badge */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          customer.kyc === 'verified'
                            ? 'bg-[#e7f7ed] text-[#0f7642]'
                            : customer.kyc === 'rejected'
                            ? 'bg-[#fee2e2] text-[#b91c1c]'
                            : 'bg-[#fef1db] text-[#b46500]'
                        }`}
                      >
                        {customer.kyc}
                      </span>
                    </td>

                    {/* STAGE Badge */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          customer.stage === 'active'
                            ? 'bg-[#e7f7ed] text-[#0f7642]'
                            : customer.stage === 'maturing'
                            ? 'bg-[#fef1db] text-[#b46500]'
                            : 'bg-[#fef3e2] text-[#c27803]'
                        }`}
                      >
                        {customer.stage}
                      </span>
                    </td>

                    {/* ACTION Button */}
                    <td className="py-3 pr-5 pl-2 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomer(customer);
                        }}
                        className="p-1.5 text-stone-400 group-hover:text-[#2c1b15] hover:bg-[#eee8dc] rounded-lg transition-colors cursor-pointer"
                        title="View customer profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Customer Detail Inspection Modal */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </DashboardLayout>
  );
}

export default CustomerRecordsPage;

