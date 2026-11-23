import React, { useState, useMemo } from 'react';
import {
  Download,
  ChevronDown,
  X,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import {
  daybookSummary,
  todayDaybookEntries,
  customerSavingsPassbook,
} from '../services/daybook.service';

export function DaybookPage() {
  const [summary] = useState(daybookSummary);
  const [todayEntries] = useState(todayDaybookEntries);
  const [passbook] = useState(customerSavingsPassbook);
  const [selectedCustomer, setSelectedCustomer] = useState('All customers');
  const [selectedMode, setSelectedMode] = useState('All modes');
  const [showSignedInAlert, setShowSignedInAlert] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  // Extract distinct customers for dropdown
  const customerOptions = useMemo(() => {
    const names = Array.from(new Set(passbook.map((p) => p.customer)));
    return ['All customers', ...names];
  }, [passbook]);

  // Filter passbook rows
  const filteredPassbook = useMemo(() => {
    return passbook.filter((item) => {
      const matchCust =
        selectedCustomer === 'All customers' || item.customer === selectedCustomer;
      const matchMode =
        selectedMode === 'All modes' || item.mode.toLowerCase() === selectedMode.toLowerCase();
      return matchCust && matchMode;
    });
  }, [passbook, selectedCustomer, selectedMode]);

  // Export CSV handler
  const handleExport = () => {
    const headers = ['Date', 'Receipt', 'Customer', 'Account', 'Mode', 'Savings', 'Status'];
    const rows = filteredPassbook.map((r) => [
      r.date,
      r.receipt,
      r.customer,
      r.account,
      r.mode,
      r.savings,
      r.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CBSG_Savings_Daybook_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage('Daybook records exported to CSV.');
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

      {/* 2. Page Header: Title and Export */}
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#241814]">
            Customer savings day book
          </h2>
          <p className="mt-0.5 text-xs text-[#7a6e67]">
            {summary.date}
          </p>
        </div>

        {/* Export Button */}
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#f6f2e9] border border-[#ded8cb] text-xs font-medium text-[#2c1b15] transition-colors shadow-2xs cursor-pointer select-none self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-[#7a6e67]" />
          <span>Export</span>
        </button>
      </div>

      {/* 3. Four Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Card 1: Today's Customer Savings (Amber Card) */}
        <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-r from-[#d9aa5b] to-[#cca053] text-[#2c1b15] shadow-xs select-none flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2c1b15]/80">
              TODAY'S CUSTOMER SAVINGS
            </span>
            <div className="w-6 h-6 rounded-lg bg-black/10 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-[#2c1b15]" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#2c1b15]">
              {summary.todaySavings}
            </span>
          </div>
        </div>

        {/* Card 2: Bank */}
        <div className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7a6e67]">
            BANK
          </span>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#2c1b15]">
              {summary.bank}
            </span>
          </div>
        </div>

        {/* Card 3: UPI */}
        <div className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7a6e67]">
            UPI
          </span>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#2c1b15]">
              {summary.upi}
            </span>
          </div>
        </div>

        {/* Card 4: Entries */}
        <div className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7a6e67]">
            ENTRIES
          </span>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#2c1b15]">
              {summary.entries}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Filter Dropdowns */}
      <div className="mb-4 flex items-center gap-3">
        {/* All customers dropdown */}
        <div className="relative">
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="appearance-none bg-white text-xs font-semibold text-[#2c1b15] border border-[#ded8cb] rounded-full pl-3.5 pr-8 py-2 shadow-2xs outline-none cursor-pointer hover:border-[#c8bfb0] transition-colors"
          >
            {customerOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#8c8076] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* All modes dropdown */}
        <div className="relative">
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="appearance-none bg-white text-xs font-semibold text-[#2c1b15] border border-[#ded8cb] rounded-full pl-3.5 pr-8 py-2 shadow-2xs outline-none cursor-pointer hover:border-[#c8bfb0] transition-colors"
          >
            <option value="All modes">All modes</option>
            <option value="UPI">UPI</option>
            <option value="Bank">Bank Transfer</option>
            <option value="Cash">Cash</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#8c8076] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* 5. Today's Daybook Table (Empty State) */}
      <div className="bg-white rounded-2xl border border-[#e8e2d5] shadow-2xs overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#f3efe6] text-[10.5px] uppercase tracking-wider text-[#968a80]">
                <th className="py-3.5 pl-5 pr-3 font-semibold">TIME</th>
                <th className="py-3.5 px-3 font-semibold">RECEIPT</th>
                <th className="py-3.5 px-3 font-semibold">CUSTOMER</th>
                <th className="py-3.5 px-3 font-semibold">ACCOUNT</th>
                <th className="py-3.5 px-3 font-semibold">MODE</th>
                <th className="py-3.5 px-3 font-semibold">CUSTOMER SAVINGS</th>
                <th className="py-3.5 pr-5 pl-3 font-semibold text-right">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {todayEntries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-xs text-[#8a7e75]">
                    No entries yet today.
                  </td>
                </tr>
              ) : (
                todayEntries.map((row) => (
                  <tr key={row.id}>
                    <td className="py-3 pl-5 pr-3">{row.time}</td>
                    <td className="py-3 px-3">{row.receipt}</td>
                    <td className="py-3 px-3">{row.customer}</td>
                    <td className="py-3 px-3">{row.account}</td>
                    <td className="py-3 px-3">{row.mode}</td>
                    <td className="py-3 px-3">{row.savings}</td>
                    <td className="py-3 pr-5 pl-3 text-right">{row.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Customer Savings Passbook Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#2c1b15]">
          Customer savings passbook
        </h3>

        <div className="bg-white rounded-2xl border border-[#e8e2d5] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#f3efe6] text-[10.5px] uppercase tracking-wider text-[#968a80]">
                  <th className="py-3.5 pl-5 pr-3 font-semibold">DATE</th>
                  <th className="py-3.5 px-3 font-semibold">RECEIPT</th>
                  <th className="py-3.5 px-3 font-semibold">CUSTOMER</th>
                  <th className="py-3.5 px-3 font-semibold">ACCOUNT</th>
                  <th className="py-3.5 px-3 font-semibold">MODE</th>
                  <th className="py-3.5 px-3 font-semibold">CUSTOMER SAVINGS</th>
                  <th className="py-3.5 pr-5 pl-3 font-semibold text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f1e8]">
                {filteredPassbook.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-xs text-[#8a7e75]">
                      No passbook records match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredPassbook.map((item) => (
                    <tr key={item.id} className="hover:bg-[#faf7f0]/60 transition-colors">
                      {/* DATE */}
                      <td className="py-3 pl-5 pr-3 text-[#7a6e67] whitespace-nowrap">
                        {item.date}
                      </td>

                      {/* RECEIPT */}
                      <td className="py-3 px-3 font-mono text-[#5e5148] text-[11px] whitespace-nowrap">
                        {item.receipt}
                      </td>

                      {/* CUSTOMER */}
                      <td className="py-3 px-3 font-medium text-[#2c1b15] whitespace-nowrap">
                        {item.customer}
                      </td>

                      {/* ACCOUNT */}
                      <td className="py-3 px-3 font-mono text-[#2c1b15] whitespace-nowrap">
                        {item.account}
                      </td>

                      {/* MODE */}
                      <td className="py-3 px-3 text-[#5e5148] whitespace-nowrap">
                        {item.mode}
                      </td>

                      {/* CUSTOMER SAVINGS */}
                      <td className="py-3 px-3 font-bold text-[#2c1b15] font-mono whitespace-nowrap">
                        {item.savings}
                      </td>

                      {/* STATUS */}
                      <td className="py-3 pr-5 pl-3 text-right whitespace-nowrap">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#e7f7ed] text-[#0f7642]">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DaybookPage;

