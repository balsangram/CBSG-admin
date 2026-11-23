import React, { useState } from 'react';
import { X, Building, Award, Users, Coins, ArrowRight, UserCheck } from 'lucide-react';

export function MemberDetailModal({
  member,
  onClose,
  allLeads = [],
  onReassignExec,
  onPromoteExec,
  onDemoteLead,
}) {
  const [selectedLeadId, setSelectedLeadId] = useState('');

  if (!member) return null;

  const isTeamLead = member.role === 'Team Lead';
  const availableLeads = allLeads.filter((l) => l.id !== member.id);

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
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#2c1b15]">{member.name}</h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    isTeamLead ? 'bg-[#2c1b15] text-white' : 'bg-[#eef2f6] text-[#334155]'
                  }`}
                >
                  {member.role}
                </span>
              </div>
              <p className="text-[11px] text-[#8f8278]">{member.code}</p>
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
              <span className="font-semibold text-[#2c1b15]">
                {member.reportsTo || 'CBSG Admin'}
              </span>
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

          {/* Hierarchy Management Actions */}
          <div className="p-3 bg-[#fdfaf5] border border-[#f0e6d6] rounded-2xl space-y-2.5">
            <div className="text-[11px] font-bold text-[#2c1b15] flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#c88a29]" />
              <span>Reporting Hierarchy Actions</span>
            </div>

            {!isTeamLead ? (
              // Actions for Executive Manager
              <div className="space-y-2">
                <div className="flex gap-2">
                  <select
                    value={selectedLeadId}
                    onChange={(e) => setSelectedLeadId(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15]"
                  >
                    <option value="">Choose new Team Lead...</option>
                    {availableLeads.map((lead) => (
                      <option key={lead.id} value={lead.id}>
                        {lead.name} ({lead.branch})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={!selectedLeadId}
                    onClick={() => {
                      if (onReassignExec && selectedLeadId) {
                        onReassignExec(member.id, selectedLeadId);
                        onClose();
                      }
                    }}
                    className="px-3 py-1.5 bg-[#2c1b15] disabled:opacity-40 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Reassign
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (onPromoteExec) {
                      onPromoteExec(member.id);
                      onClose();
                    }
                  }}
                  className="w-full py-2 bg-[#f4ecd8] hover:bg-[#ebdfc4] text-[#73430c] border border-[#e5d4b5] rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Promote to Team Lead (Reports to Admin)</span>
                </button>
              </div>
            ) : (
              // Actions for Team Lead
              <div className="space-y-2">
                <div className="flex gap-2">
                  <select
                    value={selectedLeadId}
                    onChange={(e) => setSelectedLeadId(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15]"
                  >
                    <option value="">Nest under Team Lead...</option>
                    {availableLeads.map((lead) => (
                      <option key={lead.id} value={lead.id}>
                        {lead.name} ({lead.branch})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={!selectedLeadId}
                    onClick={() => {
                      if (onDemoteLead && selectedLeadId) {
                        onDemoteLead(member.id, selectedLeadId);
                        onClose();
                      }
                    }}
                    className="px-3 py-1.5 bg-[#2c1b15] disabled:opacity-40 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Nest as Manager
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer buttons */}
          <div className="pt-2 border-t border-[#f2ede4] flex items-center justify-end gap-2">
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
