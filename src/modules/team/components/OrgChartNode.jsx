import React from 'react';
import { GripVertical } from 'lucide-react';

export function OrgChartNode({ lead, onSelectMember }) {
  return (
    <div className="flex flex-col space-y-3">
      {/* Team Lead Card Container */}
      <div className="relative">
        {/* Team Lead Floating Pill Badge */}
        <div className="mb-1.5 flex items-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#2c1b15] text-white tracking-wide shadow-xs">
            Team Lead
          </span>
        </div>

        {/* Team Lead Card */}
        <div
          onClick={() => onSelectMember && onSelectMember(lead)}
          className="bg-white rounded-2xl border border-[#e8e2d5] p-4 shadow-xs hover:border-[#c88a29]/60 hover:shadow-md transition-all cursor-pointer group"
        >
          {/* Header Row: Avatar + Info */}
          <div className="flex items-center gap-3">
            <img
              src={lead.avatar}
              alt={lead.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#f6f4ed] shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-[#2c1b15] truncate group-hover:text-[#9e6212] transition-colors">
                {lead.name}
              </h4>
              <p className="text-[11px] text-[#8f8278] truncate">
                {lead.role} · {lead.code} · {lead.branch}
              </p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="mt-3.5 grid grid-cols-3 gap-2 pt-3 border-t border-[#f4ede2] text-left">
            <div>
              <span className="text-[10px] text-[#8f8278] font-medium block">Customers</span>
              <span className="text-xs font-bold text-[#2c1b15] mt-0.5 block">{lead.customers}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#8f8278] font-medium block">Volume</span>
              <span className="text-xs font-bold text-[#2c1b15] mt-0.5 block">{lead.volume}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#8f8278] font-medium block">Incentives</span>
              <span className="text-xs font-bold text-[#2c1b15] mt-0.5 block">{lead.incentives}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subordinates / Executive Managers */}
      {lead.subordinates && lead.subordinates.length > 0 && (
        <div className="relative pl-6 space-y-2.5">
          {/* Connector Branch Line */}
          <div className="absolute left-3 top-0 bottom-4 w-px bg-[#d8d0c2]" />

          {lead.subordinates.map((sub) => (
            <div
              key={sub.id}
              onClick={() => onSelectMember && onSelectMember(sub)}
              className="relative bg-white rounded-2xl border border-[#e8e2d5] p-3 shadow-xs hover:border-[#c88a29]/60 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              {/* Elbow connector to left vertical line */}
              <div className="absolute -left-3 top-6 w-3 h-px bg-[#d8d0c2]" />

              <div className="flex items-center gap-2.5">
                <GripVertical className="w-3.5 h-3.5 text-[#b0a498] shrink-0" />
                <img
                  src={sub.avatar}
                  alt={sub.name}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-[#f6f4ed] shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h5 className="text-[11.5px] font-bold text-[#2c1b15] truncate group-hover:text-[#9e6212] transition-colors">
                    {sub.name}
                  </h5>
                  <p className="text-[10.5px] text-[#8f8278] truncate">
                    {sub.role} · {sub.code} · {sub.branch}
                  </p>
                </div>
              </div>

              {/* Subordinate stats row */}
              <div className="mt-2.5 grid grid-cols-3 gap-2 pt-2 border-t border-[#f4ede2] pl-6 text-left">
                <div>
                  <span className="text-[9.5px] text-[#8f8278] font-medium block">Customers</span>
                  <span className="text-xs font-bold text-[#2c1b15] mt-0.5 block">{sub.customers}</span>
                </div>
                <div>
                  <span className="text-[9.5px] text-[#8f8278] font-medium block">Volume</span>
                  <span className="text-xs font-bold text-[#2c1b15] mt-0.5 block">{sub.volume}</span>
                </div>
                <div>
                  <span className="text-[9.5px] text-[#8f8278] font-medium block">Incentives</span>
                  <span className="text-xs font-bold text-[#2c1b15] mt-0.5 block">{sub.incentives}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrgChartNode;
