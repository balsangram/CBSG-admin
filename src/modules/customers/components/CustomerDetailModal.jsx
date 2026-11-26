import React from 'react';
import { X, Phone, Mail, Building, Calendar, UserCheck } from 'lucide-react';

const formatINR = (value) =>
  `₹${Number(value || 0).toLocaleString('en-IN')}`;

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

export function CustomerDetailModal({ customer, onClose, onEdit }) {
  if (!customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#ded8cb]">
        <div className="flex items-center justify-between pb-4 border-b border-[#f0ebdF]">
          <div className="flex items-center gap-3">
            {customer.photo ? (
              <img
                src={customer.photo}
                alt={customer.name}
                className="w-11 h-11 rounded-full object-cover border border-[#e0d9cb]"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-[#2c1b15] text-[#cca04b] text-sm font-bold flex items-center justify-center">
                {(customer.name || 'C').charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="font-bold text-base text-[#2c1b15] leading-snug">
                {customer.name}
              </h3>
              <p className="text-xs text-[#85786f] font-mono">{customer.phone}</p>
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

        <div className="py-4 space-y-4 text-xs text-[#5e5148]">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-[#f8f5ee] rounded-xl border border-[#e8e2d5]">
              <span className="text-[10px] text-[#8a7e75] block uppercase font-medium">Balance</span>
              <span className="text-sm font-bold text-[#2c1b15] font-mono">
                {formatINR(customer.totalSaving)}
              </span>
            </div>
            <div className="p-3 bg-[#f8f5ee] rounded-xl border border-[#e8e2d5]">
              <span className="text-[10px] text-[#8a7e75] block uppercase font-medium">KYC</span>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${kycClass(customer.kyc)}`}>
                {customer.kyc || 'pending'}
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-[#faf8f4] rounded-xl border border-[#e8e2d5] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[#8a7e75] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Mobile
              </span>
              <span className="font-semibold text-[#2c1b15] font-mono">{customer.phone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8a7e75] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email
              </span>
              <span className="font-semibold text-[#2c1b15]">{customer.email || '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8a7e75] flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" /> Branch
              </span>
              <span className="font-semibold text-[#2c1b15]">{customer.branch || '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8a7e75] flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" /> Executive
              </span>
              <span className="font-semibold text-[#2c1b15]">{customer.executive || '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8a7e75] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Joined
              </span>
              <span className="font-semibold text-[#2c1b15]">{formatDate(customer.joiningDate)}</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[#f0ebdF] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#e8e2d5] text-xs font-semibold text-[#61554d]"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onEdit(customer)}
            className="px-4 py-2 rounded-xl bg-[#2c1b15] text-white text-xs font-semibold"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomerDetailModal;
