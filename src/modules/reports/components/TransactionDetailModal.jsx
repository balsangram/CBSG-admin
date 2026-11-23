import React from 'react';
import { X, CheckCircle2, CreditCard, Building, User, Download } from 'lucide-react';

export function TransactionDetailModal({ tx, isOpen, onClose }) {
  if (!isOpen || !tx) return null;

  const handleDownloadReceipt = () => {
    alert(`Downloading transaction receipt for ${tx.reference}...`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-[#e8e2d5] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#f2ede4] flex items-center justify-between bg-[#faf8f4]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2c1b15] text-[#cca04b] flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#2c1b15]">{tx.reference}</h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    tx.status === 'Success'
                      ? 'bg-[#e7f7ed] text-[#0d7a3e] border border-[#c3eed4]'
                      : 'bg-[#fef4e6] text-[#b86200] border border-[#fde4c4]'
                  }`}
                >
                  {tx.status}
                </span>
              </div>
              <p className="text-[11px] text-[#8f8278]">{tx.date}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8f8278] hover:text-[#2c1b15] hover:bg-[#ede7dc] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Amount Card */}
          <div className="p-4 bg-gradient-to-r from-[#dca74d] to-[#e8bb65] rounded-2xl text-[#2c1b15] shadow-xs border border-[#d29b3f]/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#452814]">
                Transaction Amount
              </span>
              <div className="text-2xl font-bold text-[#2d1808] mt-0.5">{tx.amount}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#452814]">
                Type & Mode
              </span>
              <div className="text-xs font-bold text-[#2d1808] mt-0.5">
                {tx.type} · {tx.mode}
              </div>
            </div>
          </div>

          {/* Details list */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between py-1.5 border-b border-[#f6f2ea]">
              <span className="text-[#8f8278] flex items-center gap-2">
                <User className="w-3.5 h-3.5" /> Customer
              </span>
              <span className="font-semibold text-[#2c1b15]">
                {tx.customerFull || tx.customer} ({tx.account})
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-[#f6f2ea]">
              <span className="text-[#8f8278] flex items-center gap-2">
                <Building className="w-3.5 h-3.5" /> Branch Location
              </span>
              <span className="font-semibold text-[#2c1b15]">{tx.branch}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-[#f6f2ea]">
              <span className="text-[#8f8278] flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5" /> Channel Attribution
              </span>
              <span className="font-semibold text-[#2c1b15]">{tx.channel}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-[#f6f2ea]">
              <span className="text-[#8f8278] flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5" /> UTR / Gateway Reference
              </span>
              <span className="font-mono text-[#2c1b15] font-medium">{tx.utr}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-[#f6f2ea]">
              <span className="text-[#8f8278] flex items-center gap-2">
                <Building className="w-3.5 h-3.5" /> Payment Gateway
              </span>
              <span className="font-medium text-[#2c1b15]">{tx.gateway}</span>
            </div>
          </div>

          {/* Audit Verification */}
          <div className="p-3 bg-[#e7f7ed]/70 border border-[#c5ecd4] rounded-xl flex items-center gap-2.5 text-[11px] text-[#0d7a3e]">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              Reconciled with CBSG Core Ledger & RBI-Compliant Escrow Account.
            </span>
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-[#f2ede4] flex items-center justify-between">
            <button
              type="button"
              onClick={handleDownloadReceipt}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-[#faf7f2] border border-[#e8e2d5] text-[#2c1b15] rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#8f8278]" />
              <span>Download Receipt</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-[#2c1b15] text-white rounded-xl text-xs font-semibold hover:bg-[#432b22] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionDetailModal;

