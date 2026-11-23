import React, { useState } from 'react';
import {
  X,
  FileCheck2,
  CheckCircle,
  XCircle,
  CreditCard,
  Building,
} from 'lucide-react';

export function KycReviewModal({ record, onClose, onApprove, onReject }) {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-[#ded8cb]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#f0ebdF]">
          <div className="flex items-center gap-3">
            <img
              src={record.avatar}
              alt={record.customer}
              className="w-12 h-12 rounded-full object-cover border border-[#ded8cb]"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#2c1b15]">
                  {record.customer}
                </h3>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                    record.kycStatus === 'Approved'
                      ? 'bg-[#e7f7ed] text-[#0f7642]'
                      : record.kycStatus === 'Rejected'
                      ? 'bg-[#fee2e2] text-[#b91c1c]'
                      : 'bg-[#fef1db] text-[#b46500]'
                  }`}
                >
                  {record.kycStatus}
                </span>
              </div>
              <p className="text-xs text-[#7a6e67] font-mono mt-0.5">
                {record.phone} · {record.branch}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-[#faf7f0] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 text-xs text-[#5e5148]">
          {/* Submission Info */}
          <div className="p-3 bg-[#faf8f4] rounded-xl border border-[#e8e2d5] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#8a7e75] uppercase block font-semibold">Submission Channel</span>
              <span className="font-semibold text-[#2c1b15]">{record.submissionType}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#8a7e75] uppercase block font-semibold">Submitted On</span>
              <span className="font-semibold text-[#2c1b15]">{record.submittedDate}</span>
            </div>
          </div>

          {/* Verification Checklist */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-[#2c1b15] text-xs uppercase tracking-wider text-[10px]">
              Document Verification Trail
            </h4>

            {/* Aadhaar Card */}
            <div className="p-3 bg-[#f8f5ee] rounded-xl border border-[#e8e2d5] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileCheck2 className="w-4 h-4 text-[#c88a29]" />
                <div>
                  <span className="font-bold text-[#2c1b15] block">Aadhaar Offline XML / e-KYC</span>
                  <span className="text-[11px] text-[#7a6e67] font-mono">{record.aadhaarNumber}</span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                UIDAI Verified
              </span>
            </div>

            {/* PAN Card */}
            <div className="p-3 bg-[#f8f5ee] rounded-xl border border-[#e8e2d5] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-[#c88a29]" />
                <div>
                  <span className="font-bold text-[#2c1b15] block">Income Tax PAN Verification</span>
                  <span className="text-[11px] text-[#7a6e67] font-mono">{record.panNumber}</span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                NSDL Active
              </span>
            </div>

            {/* Bank Proof */}
            <div className="p-3 bg-[#f8f5ee] rounded-xl border border-[#e8e2d5] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building className="w-4 h-4 text-[#c88a29]" />
                <div>
                  <span className="font-bold text-[#2c1b15] block">Bank Account Penny Drop Check</span>
                  <span className="text-[11px] text-[#7a6e67] font-mono">{record.bankAccount}</span>
                </div>
              </div>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  record.kycStatus === 'Rejected'
                    ? 'text-rose-800 bg-rose-100'
                    : record.kycStatus === 'Approved'
                    ? 'text-emerald-800 bg-emerald-100'
                    : 'text-amber-800 bg-amber-100'
                }`}
              >
                {record.kycStatus === 'Rejected' ? 'Name Mismatch' : record.kycStatus === 'Approved' ? 'Penny Drop Verified' : 'Audit Pending'}
              </span>
            </div>
          </div>

          {/* Current Review Reason / Remarks */}
          {record.reviewReason && record.reviewReason !== '—' && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900">
              <span className="font-bold block mb-0.5">Audit Exception Reason:</span>
              <span>{record.reviewReason}</span>
            </div>
          )}

          {/* Rejection Prompt Form */}
          {showRejectForm && (
            <div className="p-3 bg-[#faf8f4] border border-[#e8e2d5] rounded-xl space-y-2 animate-fadeIn">
              <label className="text-[11px] font-bold text-[#2c1b15] block">
                Specify Rejection Reason (Notified to Customer)
              </label>
              <textarea
                rows={2}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Identity: Name mismatch between Aadhaar and PAN..."
                className="w-full bg-white border border-[#ded8cb] rounded-lg p-2 text-xs text-[#2c1b15] outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRejectForm(false)}
                  className="px-2.5 py-1 text-xs text-[#7a6e67] hover:text-[#2c1b15]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onReject(record.id, rejectReason || 'Documentation needs correction.');
                    setShowRejectForm(false);
                  }}
                  className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-[#f0ebdF] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl border border-[#ded8cb] text-xs font-semibold text-[#2c1b15] hover:bg-[#faf8f4] cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {!showRejectForm && (
              <>
                <button
                  type="button"
                  onClick={() => setShowRejectForm(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-semibold cursor-pointer transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>

                <button
                  type="button"
                  onClick={() => onApprove(record.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold cursor-pointer shadow-2xs transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Approve KYC</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default KycReviewModal;
