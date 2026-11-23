import React from 'react';
import { X, Building, Award, Users, Coins, ArrowRight } from 'lucide-react';

export function MemberDetailModal({ member, onClose }) {
  if (!member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-[#e8e2d5] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#f2ede4] flex items-center justify-between bg-[#faf8f4]">
          <div className="flex items-center gap-3">
            <img
              src={member.avatar}
              alt={member.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-[#e8e2d5]"
            />
            <div>
              <h3 className="text-sm font-bold text-[#2c1b15]">{member.name}</h3>
              <p className="text-[11px] text-[#8f8278]">
                {member.role} · {member.code}
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
        <div className="p-5 space-y-4 text-xs">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-[#faf7f2] rounded-2xl border border-[#f0eae0] text-center">
            <div>
              <div className="text-[10px] text-[#8f8278] font-medium">Customers</div>
              <div className="text-sm font-bold text-[#2c1b15] mt-0.5">{member.customers}</div>
            </div>
            <div>
              <div className="text-[10px] text-[#8f8278] font-medium">Deposit Volume</div>
              <div className="text-sm font-bold text-[#2c1b15] mt-0.5">{member.volume}</div>
            </div>
            <div>
              <div className="text-[10px] text-[#8f8278] font-medium">Incentives</div>
              <div className="text-sm font-bold text-[#9e6212] mt-0.5">{member.incentives}</div>
            </div>
          </div>

          {/* Details list */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between py-1.5 border-b border-[#f6f2ea]">
              <span className="text-[#8f8278] flex items-center gap-2">
                <Building className="w-3.5 h-3.5" /> Branch Location
              </span>
              <span className="font-semibold text-[#2c1b15]">{member.branch} Branch</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-[#f6f2ea]">
              <span className="text-[#8f8278] flex items-center gap-2">
                <Users className="w-3.5 h-3.5" /> Reports To
              </span>
              <span className="font-semibold text-[#2c1b15]">{member.reportsTo || 'CBSG Admin'}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-[#f6f2ea]">
              <span className="text-[#8f8278] flex items-center gap-2">
                <Award className="w-3.5 h-3.5" /> Performance Rank
              </span>
              <span className="font-semibold text-[#0d7a3e]">Top Tier Performer</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-[#f6f2ea]">
              <span className="text-[#8f8278] flex items-center gap-2">
                <Coins className="w-3.5 h-3.5" /> Payout Status
              </span>
              <span className="font-semibold text-[#2c1b15]">Disbursed Monthly</span>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-[#f2ede4] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#e8e2d5] rounded-xl text-xs font-semibold text-[#61554d] hover:bg-[#faf7f2] transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                alert(`Incentive statement generated for ${member.name}`);
                onClose();
              }}
              className="px-4 py-2 bg-[#2c1b15] text-white rounded-xl text-xs font-bold hover:bg-[#432b22] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>View Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberDetailModal;
