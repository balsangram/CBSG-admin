import React from 'react';
import {
  X,
  Phone,
  Mail,
  Building,
  Calendar,
  FileText,
  UserCheck,
} from 'lucide-react';

export function CustomerDetailModal({ customer, onClose }) {
  if (!customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#ded8cb]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#f0ebdF]">
          <div className="flex items-center gap-3">
            <img
              src={customer.avatar}
              alt={customer.name}
              className="w-11 h-11 rounded-full object-cover border border-[#e0d9cb]"
            />
            <div>
              <h3 className="font-bold text-base text-[#2c1b15] leading-snug">
                {customer.name}
              </h3>
              <p className="text-xs text-[#85786f] font-mono">
                {customer.code}
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

        {/* Customer Details Content */}
        <div className="py-4 space-y-4 text-xs text-[#5e5148]">
          {/* Key Stat Badges */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 bg-[#f8f5ee] rounded-xl border border-[#e8e2d5]">
              <span className="text-[10px] text-[#8a7e75] block uppercase font-medium">Balance</span>
              <span className="text-sm font-bold text-[#2c1b15] font-mono">{customer.balance}</span>
            </div>
            <div className="p-3 bg-[#f8f5ee] rounded-xl border border-[#e8e2d5]">
              <span className="text-[10px] text-[#8a7e75] block uppercase font-medium">Active Plans</span>
              <span className="text-sm font-bold text-[#2c1b15]">{customer.plans}</span>
            </div>
            <div className="p-3 bg-[#f8f5ee] rounded-xl border border-[#e8e2d5]">
              <span className="text-[10px] text-[#8a7e75] block uppercase font-medium">KYC Status</span>
              <span
                className={`inline-block mt-0.5 px-2 py-0.2 rounded-full text-[10px] font-bold ${
                  customer.kyc === 'verified'
                    ? 'bg-[#e7f7ed] text-[#0f7642]'
                    : customer.kyc === 'rejected'
                    ? 'bg-[#fee2e2] text-[#b91c1c]'
                    : 'bg-[#fef1db] text-[#b46500]'
                }`}
              >
                {customer.kyc}
              </span>
            </div>
          </div>

          {/* Customer Metadata List */}
          <div className="p-3.5 bg-[#faf8f4] rounded-xl border border-[#e8e2d5] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[#8a7e75] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#a0948b]" />
                Mobile
              </span>
              <span className="font-semibold text-[#2c1b15] font-mono">{customer.mobile}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#8a7e75] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#a0948b]" />
                Email
              </span>
              <span className="font-semibold text-[#2c1b15]">{customer.email}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#8a7e75] flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#a0948b]" />
                Branch
              </span>
              <span className="font-semibold text-[#2c1b15]">{customer.branch}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#8a7e75] flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-[#a0948b]" />
                Assigned Executive
              </span>
              <span className="font-semibold text-[#2c1b15]">{customer.executive}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#8a7e75] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#a0948b]" />
                Onboarding Date
              </span>
              <span className="font-semibold text-[#2c1b15]">{customer.joinedDate}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#8a7e75] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#a0948b]" />
                Primary Product
              </span>
              <span className="font-semibold text-[#2c1b15] text-right truncate max-w-[200px]">
                {customer.schemeName}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-[#f0ebdF] flex items-center justify-between">
          <span className="text-[11px] text-[#8a7e75]">
            RBI NBFC Record · Audit Encrypted
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#2c1b15] text-white text-xs font-semibold hover:bg-[#1a0f0b] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomerDetailModal;
