import React, { useState } from 'react';
import { GripVertical, ArrowUpDown, UserCheck, ChevronDown } from 'lucide-react';

export function OrgChartNode({
  lead,
  columnKey,
  leadIndex,
  onSelectMember,
  draggedItem,
  onDragStartLead,
  onDragStartExec,
  onDragEnd,
  onDropOnLead,
  onDropReorder,
  onQuickMoveExec,
  onQuickDemoteLead,
  allLeads = [],
}) {
  const [isLeadHoveredDrop, setIsLeadHoveredDrop] = useState(false);
  const [dropMode, setDropMode] = useState('nest'); // 'nest' | 'swap'
  const [quickMenuOpen, setQuickMenuOpen] = useState(null); // id of member with open quick move menu

  const isDraggingThisLead = draggedItem?.type === 'TEAM_LEAD' && draggedItem?.id === lead.id;
  const isDraggingAnyLead = draggedItem?.type === 'TEAM_LEAD' && draggedItem?.id !== lead.id;
  const isDraggingExec = draggedItem?.type === 'EXECUTIVE';

  return (
    <div className="flex flex-col space-y-2 relative">
      {/* Reorder Drop Zone Before this Lead (shown when dragging another Team Lead) */}
      {isDraggingAnyLead && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDropReorder(draggedItem.id, columnKey, leadIndex);
          }}
          className="h-6 -my-1 rounded-xl border-2 border-dashed border-[#c88a29] bg-[#fbf5eb] text-center flex items-center justify-center text-[10px] font-semibold text-[#8e520c] transition-all hover:bg-[#f8eedb]"
        >
          <ArrowUpDown className="w-3 h-3 mr-1 text-[#8e520c]" />
          Drop here to place before {lead.name}
        </div>
      )}

      {/* Team Lead Card Container */}
      <div className="relative">
        {/* Team Lead Floating Pill Badge + Reassign Tooltip */}
        <div className="mb-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#2c1b15] text-white tracking-wide shadow-xs">
              Team Lead
            </span>
            <span className="text-[10px] text-[#8f8278] hidden sm:inline">
              (Drag to reorder or nest)
            </span>
          </div>

          {/* Quick Actions Dropdown for Mobile / Accessibility */}
          {allLeads.filter((l) => l.id !== lead.id).length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setQuickMenuOpen(quickMenuOpen === lead.id ? null : lead.id)}
                className="text-[10.5px] font-medium text-[#7a6d63] hover:text-[#2c1b15] bg-[#ede7dc]/60 hover:bg-[#ede7dc] px-2 py-0.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                title="Quick move options"
              >
                <span>Move</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {quickMenuOpen === lead.id && (
                <div className="absolute right-0 top-6 z-30 w-52 bg-white rounded-xl shadow-lg border border-[#e8e2d5] p-2 text-xs space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8f8278] px-2 py-1">
                    Nest under Team Lead:
                  </div>
                  {allLeads
                    .filter((l) => l.id !== lead.id)
                    .map((target) => (
                      <button
                        key={target.id}
                        type="button"
                        onClick={() => {
                          onQuickDemoteLead(lead.id, target.id);
                          setQuickMenuOpen(null);
                        }}
                        className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-[#2c1b15] hover:bg-[#faf7f2] font-medium transition-colors flex items-center justify-between"
                      >
                        <span>{target.name}</span>
                        <span className="text-[10px] text-[#8f8278]">{target.branch}</span>
                      </button>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Team Lead Main Card */}
        <div
          draggable={true}
          onDragStart={(e) => onDragStartLead(e, lead)}
          onDragEnd={onDragEnd}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isDraggingThisLead) {
              setIsLeadHoveredDrop(true);
            }
          }}
          onDragLeave={(e) => {
            e.stopPropagation();
            setIsLeadHoveredDrop(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsLeadHoveredDrop(false);
            if (draggedItem) {
              onDropOnLead(draggedItem, lead.id, dropMode);
            }
          }}
          onClick={() => onSelectMember && onSelectMember(lead)}
          className={`bg-white rounded-2xl border p-4 shadow-xs transition-all cursor-grab active:cursor-grabbing select-none group relative ${
            isDraggingThisLead
              ? 'opacity-40 border-dashed border-[#c88a29] bg-[#faf6ed]'
              : isLeadHoveredDrop
              ? 'border-2 border-dashed border-[#c88a29] bg-[#fbf5eb] ring-4 ring-[#c88a29]/20 scale-[1.01]'
              : 'border-[#e8e2d5] hover:border-[#c88a29]/70 hover:shadow-md'
          }`}
        >
          {/* Visual Drop Target Highlight Overlay */}
          {isLeadHoveredDrop && (
            <div className="absolute inset-0 bg-[#fbf5eb]/95 backdrop-blur-2xs rounded-2xl p-3 z-20 flex flex-col items-center justify-center text-center">
              {isDraggingExec && (
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-[#c88a29] text-white flex items-center justify-center mx-auto">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-[#623707]">
                    Assign {draggedItem?.member?.name} under {lead.name}
                  </div>
                  <div className="text-[10px] text-[#935a1a]">
                    Release to assign as Executive Manager
                  </div>
                </div>
              )}

              {isDraggingAnyLead && (
                <div className="space-y-2 w-full max-w-xs">
                  <div className="text-xs font-bold text-[#623707]">
                    Choose drop action for {draggedItem?.member?.name}:
                  </div>
                  <div className="flex gap-2 justify-center">
                    <button
                      type="button"
                      onMouseEnter={() => setDropMode('nest')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        dropMode === 'nest'
                          ? 'bg-[#2c1b15] text-white shadow-xs'
                          : 'bg-white border border-[#c88a29] text-[#2c1b15]'
                      }`}
                    >
                      Nest as Manager
                    </button>
                    <button
                      type="button"
                      onMouseEnter={() => setDropMode('swap')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        dropMode === 'swap'
                          ? 'bg-[#2c1b15] text-white shadow-xs'
                          : 'bg-white border border-[#c88a29] text-[#2c1b15]'
                      }`}
                    >
                      Swap positions
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Header Row: Grip Handle + Avatar + Info */}
          <div className="flex items-center gap-2.5">
            <div
              className="text-[#b0a498] group-hover:text-[#2c1b15] transition-colors p-0.5 cursor-grab"
              title="Drag Team Lead to move, nest, or reorder"
            >
              <GripVertical className="w-4 h-4" />
            </div>
            <img
              src={lead.avatar}
              alt={lead.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#f6f4ed] shrink-0 pointer-events-none"
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

      {/* Subordinates / Executive Managers Container */}
      {lead.subordinates && lead.subordinates.length > 0 && (
        <div className="relative pl-6 space-y-2.5 pt-1">
          {/* Vertical Connector Branch Line */}
          <div className="absolute left-3 top-0 bottom-4 w-px bg-[#d8d0c2]" />

          {lead.subordinates.map((sub) => {
            const isDraggingThisSub =
              draggedItem?.type === 'EXECUTIVE' && draggedItem?.id === sub.id;

            return (
              <div
                key={sub.id}
                draggable={true}
                onDragStart={(e) => onDragStartExec(e, sub, lead.id)}
                onDragEnd={onDragEnd}
                onClick={() => onSelectMember && onSelectMember(sub)}
                className={`relative bg-white rounded-2xl border p-3 shadow-xs transition-all cursor-grab active:cursor-grabbing flex flex-col justify-between group select-none ${
                  isDraggingThisSub
                    ? 'opacity-40 border-dashed border-[#c88a29] bg-[#faf6ed]'
                    : 'border-[#e8e2d5] hover:border-[#c88a29]/70 hover:shadow-md'
                }`}
              >
                {/* Horizontal Elbow connector to left vertical line */}
                <div className="absolute -left-3 top-6 w-3 h-px bg-[#d8d0c2]" />

                <div className="flex items-center gap-2">
                  <div
                    className="text-[#b0a498] group-hover:text-[#2c1b15] p-0.5 cursor-grab"
                    title="Drag to move to another Team Lead or promote to Lead"
                  >
                    <GripVertical className="w-3.5 h-3.5 shrink-0" />
                  </div>
                  <img
                    src={sub.avatar}
                    alt={sub.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-[#f6f4ed] shrink-0 pointer-events-none"
                  />
                  <div className="min-w-0 flex-1">
                    <h5 className="text-[11.5px] font-bold text-[#2c1b15] truncate group-hover:text-[#9e6212] transition-colors">
                      {sub.name}
                    </h5>
                    <p className="text-[10.5px] text-[#8f8278] truncate">
                      {sub.role} · {sub.code} · {sub.branch}
                    </p>
                  </div>

                  {/* Quick Reassign Menu for Mobile / Touch */}
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() =>
                        setQuickMenuOpen(quickMenuOpen === sub.id ? null : sub.id)
                      }
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-[#8f8278] hover:text-[#2c1b15] hover:bg-[#ede7dc] transition-all text-[10px] font-medium"
                      title="Move Executive"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>

                    {quickMenuOpen === sub.id && (
                      <div className="absolute right-0 top-6 z-30 w-48 bg-white rounded-xl shadow-lg border border-[#e8e2d5] p-2 text-xs space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#8f8278] px-2 py-1">
                          Move to Team Lead:
                        </div>
                        {allLeads
                          .filter((l) => l.id !== lead.id)
                          .map((target) => (
                            <button
                              key={target.id}
                              type="button"
                              onClick={() => {
                                onQuickMoveExec(sub.id, target.id);
                                setQuickMenuOpen(null);
                              }}
                              className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-[#2c1b15] hover:bg-[#faf7f2] font-medium transition-colors flex items-center justify-between"
                            >
                              <span>{target.name}</span>
                              <span className="text-[10px] text-[#8f8278]">{target.branch}</span>
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Subordinate stats row */}
                <div className="mt-2.5 grid grid-cols-3 gap-2 pt-2 border-t border-[#f4ede2] pl-5 text-left">
                  <div>
                    <span className="text-[9.5px] text-[#8f8278] font-medium block">Customers</span>
                    <span className="text-xs font-bold text-[#2c1b15] mt-0.5 block">
                      {sub.customers}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9.5px] text-[#8f8278] font-medium block">Volume</span>
                    <span className="text-xs font-bold text-[#2c1b15] mt-0.5 block">{sub.volume}</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] text-[#8f8278] font-medium block">Incentives</span>
                    <span className="text-xs font-bold text-[#2c1b15] mt-0.5 block">
                      {sub.incentives}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OrgChartNode;
