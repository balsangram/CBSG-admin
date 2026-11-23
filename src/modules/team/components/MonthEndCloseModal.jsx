import React, { useState } from 'react';
import { X, Calendar, Check, ArrowRight, ShieldCheck } from 'lucide-react';

export function MonthEndCloseModal({ isOpen, onClose, onConfirmClose, payableAmount, transactions }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  // Calculate breakdown by beneficiary for payable transactions
  const breakdown = {};
  transactions
    .filter((tx) => tx.status === 'Payable')
    .forEach((tx) => {
      if (!breakdown[tx.beneficiary]) {
        breakdown[tx.beneficiary] = {
          name: tx.beneficiary,
          role: tx.beneficiaryRole,
          amount: 0,
          entries: 0,
        };
      }
      breakdown[tx.beneficiary].amount += tx.rawAmount;
      breakdown[tx.beneficiary].entries += 1;
    });

  const breakdownList = Object.values(breakdown);

  const handleExecuteClose = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        onConfirmClose();
        onClose();
        setSuccess(false);
      }, 1000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-[#e8e2d5] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#f2ede4] flex items-center justify-between bg-[#faf8f4]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#2c1b15] text-white flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#2c1b15]">Run month-end close</h3>
              <p className="text-[11px] text-[#8f8278]">
                Freeze ledger, calculate TDS, and queue direct IMPS payouts
              </p>
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
          {success ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#e7f7ed] text-[#0d7a3e] flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#2c1b15]">Month-End Close Complete</h4>
              <p className="text-xs text-[#8f8278]">
                {payableAmount} successfully queued for disbursement.
              </p>
            </div>
          ) : (
            <>
              {/* Summary highlight */}
              <div className="p-4 bg-gradient-to-r from-[#dca74d] to-[#e8bb65] rounded-2xl text-[#2c1b15] flex items-center justify-between shadow-xs border border-[#d29b3f]/30">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#452814]">
                    Total Payable Amount
                  </span>
                  <div className="text-2xl font-bold text-[#2d1808] mt-0.5">{payableAmount}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#452814]">
                    Cycle Period
                  </span>
                  <div className="text-xs font-bold text-[#2d1808] mt-0.5">November 2026</div>
                </div>
              </div>

              {/* Breakdown List */}
              <div>
                <h4 className="text-[11px] font-bold text-[#2c1b15] mb-2 uppercase tracking-wide">
                  Beneficiary Payout Breakdown
                </h4>
                <div className="divide-y divide-[#f2ede4] border border-[#e8e2d5] rounded-xl max-h-48 overflow-y-auto">
                  {breakdownList.map((item) => (
                    <div
                      key={item.name}
                      className="px-3.5 py-2 flex items-center justify-between hover:bg-[#faf8f4]"
                    >
                      <div>
                        <div className="font-bold text-[#2c1b15]">{item.name}</div>
                        <div className="text-[10.5px] text-[#8f8278]">
                          {item.role} · {item.entries} entries
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[#2c1b15]">
                          ₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                        <span className="text-[9.5px] font-semibold text-[#0d7a3e] bg-[#e7f7ed] px-1.5 py-0.2 rounded-full">
                          Ready
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policy note */}
              <div className="p-3 bg-[#faf7f2] border border-[#ede6da] rounded-xl flex items-center gap-2.5 text-[11px] text-[#73655a]">
                <ShieldCheck className="w-4 h-4 text-[#0d7a3e] shrink-0" />
                <span>
                  All payouts are audited against RBI NBFC commission cap policies and verified with
                  maker-checker approval.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#f2ede4] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-[#e8e2d5] rounded-xl text-xs font-semibold text-[#61554d] hover:bg-[#faf7f2] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleExecuteClose}
                  className="px-5 py-2 bg-[#2c1b15] hover:bg-[#432b22] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  {isProcessing ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <span>Confirm & Disburse</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MonthEndCloseModal;
