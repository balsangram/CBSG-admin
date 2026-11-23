import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  Wallet,
  IndianRupee,
  Plus,
  RotateCcw,
  Award,
  CheckCircle2,
  Undo2,
  Info,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import OrgChartNode from '../components/OrgChartNode';
import TeamTableView from '../components/TeamTableView';
import AddMemberModal from '../components/AddMemberModal';
import MemberDetailModal from '../components/MemberDetailModal';
import { INITIAL_ORG_DATA, teamService } from '../services/team.service';

export function TeamStructurePage() {
  const [viewMode, setViewMode] = useState('org'); // 'org' | 'table'
  const [orgData, setOrgData] = useState(() => teamService.getOrgData());
  const [metrics, setMetrics] = useState(() => teamService.getMetrics());
  const [flatMembers, setFlatMembers] = useState(() => teamService.getAllMembersFlat(INITIAL_ORG_DATA));
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Drag and Drop States
  const [draggedItem, setDraggedItem] = useState(null);
  const [isAdminDropActive, setIsAdminDropActive] = useState(false);
  const [isPromoteDropActive, setIsPromoteDropActive] = useState(false);

  // History for Undo
  const [history, setHistory] = useState([]);
  const [toast, setToast] = useState(null); // { message, type }

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast((prev) => (prev === message ? null : prev));
    }, 4500);
  };

  const pushHistory = (newOrgData) => {
    setHistory((prev) => [...prev.slice(-9), orgData]);
    setOrgData(newOrgData);
    const newMetrics = teamService.calculateMetrics(newOrgData);
    setMetrics(newMetrics);
    setFlatMembers(teamService.getAllMembersFlat(newOrgData));
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setOrgData(previous);
    setMetrics(teamService.calculateMetrics(previous));
    setFlatMembers(teamService.getAllMembersFlat(previous));
    showToast('Reverted hierarchy to previous state');
  };

  const handleResetHierarchy = () => {
    pushHistory(teamService.getOrgData());
    showToast('Hierarchy reset to initial configuration');
  };

  // Drag Start Handlers
  const handleDragStartLead = (e, lead) => {
    e.dataTransfer.setData('text/plain', lead.id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedItem({
      type: 'TEAM_LEAD',
      id: lead.id,
      member: lead,
    });
  };

  const handleDragStartExec = (e, exec, sourceLeadId) => {
    e.dataTransfer.setData('text/plain', exec.id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedItem({
      type: 'EXECUTIVE',
      id: exec.id,
      sourceLeadId,
      member: exec,
    });
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setIsAdminDropActive(false);
    setIsPromoteDropActive(false);
  };

  // Drop on a Team Lead card
  const handleDropOnLead = (dragged, targetLeadId, dropMode = 'nest') => {
    if (!dragged) return;

    if (dragged.type === 'EXECUTIVE') {
      // Move Executive Manager from one Team Lead to another
      const result = teamService.moveExecutiveToLead(orgData, dragged.id, targetLeadId);
      if (result.success) {
        pushHistory(result.orgData);
        showToast(`Moved ${result.member.name} under ${result.target.name}`);
      }
    } else if (dragged.type === 'TEAM_LEAD') {
      if (dragged.id === targetLeadId) return;

      if (dropMode === 'nest') {
        // Demote Team Lead to become Executive Manager under target Team Lead ("team lead to manager")
        const result = teamService.demoteLeadToExecutive(orgData, dragged.id, targetLeadId);
        if (result.success) {
          pushHistory(result.orgData);
          showToast(`Moved ${result.member.name} as Executive Manager under ${result.target.name}`);
        }
      } else {
        // Swap positions of the two Team Leads
        const result = teamService.swapTeamLeads(orgData, dragged.id, targetLeadId);
        if (result.success) {
          pushHistory(result.orgData);
          showToast(`Swapped positions of Team Leads`);
        }
      }
    }
    handleDragEnd();
  };

  // Reorder Team Leads (drop between/before another Lead)
  const handleDropReorder = (draggedLeadId, targetColumn, targetIndex) => {
    const result = teamService.reorderTeamLead(orgData, draggedLeadId, targetColumn, targetIndex);
    if (result.success) {
      pushHistory(result.orgData);
      showToast(`Updated position for ${result.member.name}`);
    }
    handleDragEnd();
  };

  // Promote Executive Manager to Team Lead ("manager to team lead")
  const handlePromoteToLead = (execId, targetColumn = 'rightColumn') => {
    const result = teamService.promoteExecutiveToLead(orgData, execId, targetColumn);
    if (result.success) {
      pushHistory(result.orgData);
      showToast(`${result.member.name} promoted to Team Lead (Reports directly to Admin)`);
    }
    handleDragEnd();
  };

  // Quick action from modal or menu
  const handleQuickMoveExec = (execId, targetLeadId) => {
    const result = teamService.moveExecutiveToLead(orgData, execId, targetLeadId);
    if (result.success) {
      pushHistory(result.orgData);
      showToast(`Moved ${result.member.name} under ${result.target.name}`);
    }
  };

  const handleQuickDemoteLead = (leadId, targetLeadId) => {
    const result = teamService.demoteLeadToExecutive(orgData, leadId, targetLeadId);
    if (result.success) {
      pushHistory(result.orgData);
      showToast(`Moved ${result.member.name} as Executive Manager under ${result.target.name}`);
    }
  };

  // Add Member
  const handleAddMember = (newMember) => {
    if (newMember.role === 'Team Lead') {
      const next = JSON.parse(JSON.stringify(orgData));
      next.rightColumn.push({
        ...newMember,
        subordinates: [],
      });
      pushHistory(next);
      showToast(`Added ${newMember.name} as Team Lead`);
    } else {
      const next = JSON.parse(JSON.stringify(orgData));
      let added = false;
      ['leftColumn', 'rightColumn'].forEach((col) => {
        next[col].forEach((lead) => {
          if (lead.name === newMember.reportsTo) {
            if (!lead.subordinates) lead.subordinates = [];
            lead.subordinates.push(newMember);
            added = true;
          }
        });
      });
      if (!added && next.leftColumn[0]) {
        next.leftColumn[0].subordinates.push(newMember);
      }
      pushHistory(next);
      showToast(`Added ${newMember.name} as Executive Manager under ${newMember.reportsTo}`);
    }
  };

  // All current team leads for dropdown selects
  const allCurrentLeads = [...orgData.leftColumn, ...orgData.rightColumn];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-16">
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#2c1b15] tracking-tight">Team structure</h1>
            <p className="text-xs text-[#8f8278] mt-0.5">Team Lead → Executive Manager</p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* View Mode Toggle: Org chart / Table */}
            <div className="inline-flex p-1 bg-[#ede7dc] rounded-xl border border-[#ded5c7] text-xs">
              <button
                type="button"
                onClick={() => setViewMode('org')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  viewMode === 'org'
                    ? 'bg-white text-[#2c1b15] shadow-xs'
                    : 'text-[#8f8278] hover:text-[#2c1b15]'
                }`}
              >
                Org chart
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-[#2c1b15] shadow-xs'
                    : 'text-[#8f8278] hover:text-[#2c1b15]'
                }`}
              >
                Table
              </button>
            </div>

            {/* Undo Button */}
            {history.length > 0 && (
              <button
                type="button"
                onClick={handleUndo}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#faf7f2] border border-[#e8e2d5] text-[#2c1b15] rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
                title="Undo last change"
              >
                <Undo2 className="w-3.5 h-3.5 text-[#8f8278]" />
                <span>Undo</span>
              </button>
            )}

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleResetHierarchy}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#faf7f2] border border-[#e8e2d5] text-[#61554d] rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
              title="Reset to default hierarchy"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#8f8278]" />
              <span className="hidden md:inline">Reset</span>
            </button>

            {/* + Add Member Button */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2c1b15] hover:bg-[#432b22] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add member</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Team Leaders */}
          <div className="bg-white rounded-2xl border border-[#e8e2d5] p-4 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10.5px] uppercase font-bold tracking-wider text-[#8f8278]">
                Team Leaders
              </span>
              <div className="text-2xl font-bold text-[#2c1b15] mt-1">{metrics.teamLeaders}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#f8f5ee] flex items-center justify-center text-[#8f8278]">
              <Users className="w-5 h-5" />
            </div>
          </div>

          {/* Card 2: Executives */}
          <div className="bg-white rounded-2xl border border-[#e8e2d5] p-4 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10.5px] uppercase font-bold tracking-wider text-[#8f8278]">
                Executives
              </span>
              <div className="text-2xl font-bold text-[#2c1b15] mt-1">{metrics.executives}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#f8f5ee] flex items-center justify-center text-[#8f8278]">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          {/* Card 3: Network Volume */}
          <div className="bg-white rounded-2xl border border-[#e8e2d5] p-4 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10.5px] uppercase font-bold tracking-wider text-[#8f8278]">
                Network Volume
              </span>
              <div className="text-2xl font-bold text-[#2c1b15] mt-1">{metrics.networkVolume}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#f8f5ee] flex items-center justify-center text-[#8f8278]">
              <Wallet className="w-5 h-5" />
            </div>
          </div>

          {/* Card 4: Incentives Earned (Golden Gradient Card) */}
          <div className="bg-gradient-to-r from-[#dca74d] to-[#e8bb65] rounded-2xl p-4 shadow-xs flex items-center justify-between border border-[#d29b3f]/40">
            <div>
              <span className="text-[10.5px] uppercase font-bold tracking-wider text-[#452814]">
                Incentives Earned
              </span>
              <div className="text-2xl font-bold text-[#2d1808] mt-1">
                {metrics.incentivesEarned}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-900/15 flex items-center justify-center text-[#3a1d09]">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Drag & Drop Instructions Helper Bar */}
        <div className="bg-[#f5efe4] border border-[#e8decf] rounded-2xl px-4 py-2.5 flex items-center justify-between text-xs text-[#6e5f54]">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#a3702e] shrink-0" />
            <span>
              <strong>Drag & Drop Active:</strong> Drag an Executive Manager to another Team Lead,
              drag an Executive to the Admin top zone to promote them to Team Lead, or drag a Team
              Lead onto another to nest as Manager.
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-2 text-[11px] text-[#8e7a6d]">
            <span className="px-2 py-0.5 rounded-md bg-white border border-[#dfd4c5] font-semibold">
              Grip Handle ⠿
            </span>
            <span>to reorder</span>
          </div>
        </div>

        {/* View Switch: Org Chart vs Table View */}
        {viewMode === 'table' ? (
          <TeamTableView members={flatMembers} onSelectMember={(m) => setSelectedMember(m)} />
        ) : (
          /* Org Chart View Canvas */
          <div className="pt-2">
            {/* Center Root Node: CBSG Finance Limited · Admin */}
            <div className="flex flex-col items-center">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  if (draggedItem?.type === 'EXECUTIVE') {
                    setIsAdminDropActive(true);
                  }
                }}
                onDragLeave={() => setIsAdminDropActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsAdminDropActive(false);
                  if (draggedItem?.type === 'EXECUTIVE') {
                    handlePromoteToLead(draggedItem.id);
                  }
                }}
                className={`inline-flex items-center gap-3 px-5 py-2.5 bg-[#261611] text-white rounded-2xl shadow-md border transition-all select-none ${
                  isAdminDropActive
                    ? 'border-[#c88a29] ring-4 ring-[#c88a29]/40 bg-[#3a2017] scale-105'
                    : 'border-[#3e261f]'
                }`}
              >
                {/* 4-bar ascending logo icon */}
                <div className="flex items-end gap-0.5 h-4.5 shrink-0">
                  <div className="w-1 h-2 bg-[#d97706] rounded-xs" />
                  <div className="w-1 h-3 bg-[#eab308] rounded-xs" />
                  <div className="w-1 h-4 bg-[#f59e0b] rounded-xs" />
                  <div className="w-1 h-4.5 bg-[#fbbf24] rounded-xs" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold tracking-wide text-white">
                    {orgData.admin.title}
                  </div>
                  <div className="text-[10.5px] text-[#e8cba6] font-medium">
                    {orgData.admin.subtitle}
                  </div>
                </div>
              </div>

              {/* Connecting Tree Lines */}
              <div className="w-0.5 h-6 bg-[#d8d0c2]" />

              {/* Horizontal Crossbar across the two columns */}
              <div className="hidden lg:block w-[52%] h-0.5 bg-[#d8d0c2] relative">
                {/* Left vertical connector down to Left Column */}
                <div className="absolute left-0 top-0 w-0.5 h-6 bg-[#d8d0c2]" />
                {/* Right vertical connector down to Right Column */}
                <div className="absolute right-0 top-0 w-0.5 h-6 bg-[#d8d0c2]" />
              </div>
            </div>

            {/* Special Drop Target: "Promote Executive to Team Lead" */}
            {draggedItem?.type === 'EXECUTIVE' && (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsPromoteDropActive(true);
                }}
                onDragLeave={() => setIsPromoteDropActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsPromoteDropActive(false);
                  handlePromoteToLead(draggedItem.id);
                }}
                className={`my-3 mx-auto max-w-lg p-3 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
                  isPromoteDropActive
                    ? 'border-[#c88a29] bg-[#fbf5eb] ring-4 ring-[#c88a29]/30 scale-102'
                    : 'border-[#c88a29]/60 bg-[#fdfaf3]'
                }`}
              >
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#703d05]">
                  <Award className="w-4 h-4 text-[#c88a29]" />
                  <span>
                    Drop here to promote {draggedItem?.member?.name} to Team Lead
                  </span>
                </div>
                <div className="text-[10.5px] text-[#8f632d] mt-0.5">
                  Member will report directly to CBSG Admin
                </div>
              </div>
            )}

            {/* Two-Column Grid: Left & Right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 pt-4 lg:pt-6">
              {/* Left Column */}
              <div className="space-y-6">
                {orgData.leftColumn.map((lead, index) => (
                  <OrgChartNode
                    key={lead.id}
                    lead={lead}
                    columnKey="leftColumn"
                    leadIndex={index}
                    onSelectMember={(m) => setSelectedMember(m)}
                    draggedItem={draggedItem}
                    onDragStartLead={handleDragStartLead}
                    onDragStartExec={handleDragStartExec}
                    onDragEnd={handleDragEnd}
                    onDropOnLead={handleDropOnLead}
                    onDropReorder={handleDropReorder}
                    onQuickMoveExec={handleQuickMoveExec}
                    onQuickDemoteLead={handleQuickDemoteLead}
                    allLeads={allCurrentLeads}
                  />
                ))}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {orgData.rightColumn.map((lead, index) => (
                  <OrgChartNode
                    key={lead.id}
                    lead={lead}
                    columnKey="rightColumn"
                    leadIndex={index}
                    onSelectMember={(m) => setSelectedMember(m)}
                    draggedItem={draggedItem}
                    onDragStartLead={handleDragStartLead}
                    onDragStartExec={handleDragStartExec}
                    onDragEnd={handleDragEnd}
                    onDropOnLead={handleDropOnLead}
                    onDropReorder={handleDropReorder}
                    onQuickMoveExec={handleQuickMoveExec}
                    onQuickDemoteLead={handleQuickDemoteLead}
                    allLeads={allCurrentLeads}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Floating Toast Notification with Undo */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#261611] text-white px-4 py-3 rounded-2xl shadow-2xl border border-[#3e261f] flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
            <CheckCircle2 className="w-4 h-4 text-[#d9aa5b] shrink-0" />
            <span className="text-xs font-medium text-stone-100">{toast}</span>
            {history.length > 0 && (
              <button
                type="button"
                onClick={handleUndo}
                className="ml-2 text-xs font-bold text-[#d9aa5b] hover:text-[#f8d488] transition-colors underline cursor-pointer"
              >
                Undo
              </button>
            )}
          </div>
        )}

        {/* Add Member Modal */}
        <AddMemberModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddMember={handleAddMember}
        />

        {/* Member Details Modal */}
        <MemberDetailModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          allLeads={allCurrentLeads}
          onReassignExec={handleQuickMoveExec}
          onPromoteExec={handlePromoteToLead}
          onDemoteLead={handleQuickDemoteLead}
        />
      </div>
    </DashboardLayout>
  );
}

export default TeamStructurePage;
