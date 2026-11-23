import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  Wallet,
  IndianRupee,
  Plus,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import OrgChartNode from '../components/OrgChartNode';
import TeamTableView from '../components/TeamTableView';
import AddMemberModal from '../components/AddMemberModal';
import MemberDetailModal from '../components/MemberDetailModal';
import { INITIAL_ORG_DATA, INITIAL_TEAM_METRICS, teamService } from '../services/team.service';

export function TeamStructurePage() {
  const [viewMode, setViewMode] = useState('org'); // 'org' | 'table'
  const [orgData, setOrgData] = useState(INITIAL_ORG_DATA);
  const [metrics, setMetrics] = useState(INITIAL_TEAM_METRICS);
  const [flatMembers, setFlatMembers] = useState(() => teamService.getAllMembersFlat());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Handle adding a new member
  const handleAddMember = (newMember) => {
    setFlatMembers((prev) => [newMember, ...prev]);

    if (newMember.role === 'Team Lead') {
      setMetrics((prev) => ({
        ...prev,
        teamLeaders: prev.teamLeaders + 1,
      }));
      // Append to right column
      setOrgData((prev) => ({
        ...prev,
        rightColumn: [
          ...prev.rightColumn,
          {
            ...newMember,
            subordinates: [],
          },
        ],
      }));
    } else {
      setMetrics((prev) => ({
        ...prev,
        executives: prev.executives + 1,
      }));
      // Append to the appropriate Team Lead's subordinates
      const updatedLeft = orgData.leftColumn.map((lead) => {
        if (lead.name === newMember.reportsTo) {
          return {
            ...lead,
            subordinates: [...(lead.subordinates || []), newMember],
          };
        }
        return lead;
      });
      const updatedRight = orgData.rightColumn.map((lead) => {
        if (lead.name === newMember.reportsTo) {
          return {
            ...lead,
            subordinates: [...(lead.subordinates || []), newMember],
          };
        }
        return lead;
      });
      setOrgData({
        ...orgData,
        leftColumn: updatedLeft,
        rightColumn: updatedRight,
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#2c1b15] tracking-tight">Team structure</h1>
            <p className="text-xs text-[#8f8278] mt-0.5">Team Lead → Executive Manager</p>
          </div>

          <div className="flex items-center gap-3">
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

        {/* View Switch: Org Chart vs Table View */}
        {viewMode === 'table' ? (
          <TeamTableView members={flatMembers} onSelectMember={(m) => setSelectedMember(m)} />
        ) : (
          /* Org Chart View Canvas */
          <div className="pt-2">
            {/* Center Root Node: CBSG Finance Limited · Admin */}
            <div className="flex flex-col items-center">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-[#261611] text-white rounded-2xl shadow-md border border-[#3e261f]">
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

            {/* Two-Column Grid: Left (Anil Mehta, Sneha Iyer) & Right (Meera Joshi, Kavya Nair) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 pt-4 lg:pt-6">
              {/* Left Column */}
              <div className="space-y-6">
                {orgData.leftColumn.map((lead) => (
                  <OrgChartNode
                    key={lead.id}
                    lead={lead}
                    onSelectMember={(m) => setSelectedMember(m)}
                  />
                ))}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {orgData.rightColumn.map((lead) => (
                  <OrgChartNode
                    key={lead.id}
                    lead={lead}
                    onSelectMember={(m) => setSelectedMember(m)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Member Modal */}
        <AddMemberModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddMember={handleAddMember}
        />

        {/* Member Details Modal */}
        <MemberDetailModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      </div>
    </DashboardLayout>
  );
}

export default TeamStructurePage;
