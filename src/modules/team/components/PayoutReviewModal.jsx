import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Banknote, ArrowRight, Building, CreditCard } from 'lucide-react';

export function PayoutReviewModal({ payout, isOpen, onClose, onApprove, onReject }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !payout) return null;

  const handleApprove = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        onApprove(payout.id);
        onClose();
        setSuccess(false);
      }, 900);
    }, 700);
  };

  const handleReject = () => {
    onReject(payout.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-[#e8e2d5] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#f2ede4] flex items-center justify-between bg-[#faf8f4]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2c1b15] text-[#cca04b] flex items-center justify-center shrink-0">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#2c1b15]">Review payout request</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#fef4e6] text-[#b86200] border border-[#fde4c4]">
                  {payout.status}
                </span>
              </div>
              <p className="text-[11px] text-[#8f8278]">
                {payout.beneficiary} · {payout.role}
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
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#2c1b15]">Payout Disbursed Successfully</h4>
              <p className="text-xs text-[#8f8278]">
                {payout.net} transferred via IMPS to {payout.beneficiary}.
              </p>
            </div>
          ) : (
            <>
              {/* Amount Highlight Card */}
              <div className="p-4 bg-gradient-to-r from-[#dca74d] to-[#e8bb65] rounded-2xl text-[#2c1b15] shadow-xs border border-[#d29b3f]/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#452814]">
                    Net Disbursable Payout
                  </span>
                  <div className="text-2xl font-bold text-[#2d1808] mt-0.5">{payout.net}</div>
                </div>
                <div className="text-right text-[11px] space-y-0.5 text-[#3a1f0a]">
                  <div>Gross: <span className="font-bold">{payout.amount}</span></div>
                  <div>TDS (Sec 194H): <span className="font-bold">-{payout.tds}</span></div>
                </div>
              </div>

              {/* Bank & Beneficiary Details */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between py-1.5 border-b border-[#f6f2ea]">
                  <span className="text-[#8f8278] flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5" /> Destination Account
                  </span>
                  <span className="font-semibold text-[#2c1b15] font-mono">{payout.bankAccount}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-[#f6f2ea]">
                  <span className="text-[#8f8278] flex items-center gap-2">
                    <Building className="w-3.5 h-3.5" /> IFSC & Branch
                  </span>
                  <span className="font-semibold text-[#2c1b15]">{payout.ifsc} ({payout.branch})</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-[#f6f2ea]">
                  <span className="text-[#8f8278] flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5" /> PAN Verified
                  </span>
                  <span className="font-semibold text-[#2c1b15] font-mono">{payout.pan}</span>
                </div>
              </div>

              {/* Maker-Checker Verification Checklist */}
              <div className="p-3 bg-[#faf7f2] border border-[#ede6da] rounded-xl space-y-1.5 text-[11px]">
                <div className="flex items-center gap-2 text-[#0d7a3e]">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Beneficiary KYC and active mandate verified</span>
                </div>
                <div className="flex items-center gap-2 text-[#0d7a3e]">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Within RBI monthly incentive distribution ceiling</span>
                </div>
                <div className="flex items-center gap-2 text-[#0d7a3e]">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Instant IMPS transfer channel active (24/7)</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-[#f2ede4] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleReject}
                  className="px-4 py-2 border border-[#e8e2d5] text-[#b42318] hover:bg-[#fef3f2] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Reject / Hold
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleApprove}
                  className="px-5 py-2 bg-[#2c1b15] hover:bg-[#432b22] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  {isProcessing ? (
                    <span>Disbursing...</span>
                  ) : (
                    <>
                      <span>Approve & Disburse (IMPS)</span>
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

export default PayoutReviewModal;
