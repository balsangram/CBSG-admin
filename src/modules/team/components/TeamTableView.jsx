import React, { useState } from 'react';
import { Search, ChevronDown, Eye, MessageSquare, ArrowUpDown } from 'lucide-react';

export function TeamTableView({ members, onSelectMember }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.branch.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBranch = branchFilter === 'All' || member.branch === branchFilter;
    const matchesRole = roleFilter === 'All' || member.role === roleFilter;
    return matchesSearch && matchesBranch && matchesRole;
  });

  return (
    <div className="bg-white rounded-2xl border border-[#e8e2d5] shadow-xs overflow-hidden">
      {/* Controls Bar */}
      <div className="p-4 border-b border-[#e8e2d5] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-[#faf8f4]">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8f8278]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search member name, code, branch..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] placeholder-[#a2958b] focus:outline-none focus:border-[#9e6212] transition-colors"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2">
          {/* Branch Filter */}
          <div className="relative">
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="appearance-none bg-white border border-[#e8e2d5] rounded-xl pl-3 pr-8 py-1.5 text-xs text-[#2c1b15] font-medium focus:outline-none focus:border-[#9e6212] cursor-pointer"
            >
              <option value="All">All branches</option>
              <option value="Pune">Pune</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Nagpur">Nagpur</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8f8278] pointer-events-none" />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="appearance-none bg-white border border-[#e8e2d5] rounded-xl pl-3 pr-8 py-1.5 text-xs text-[#2c1b15] font-medium focus:outline-none focus:border-[#9e6212] cursor-pointer"
            >
              <option value="All">All roles</option>
              <option value="Team Lead">Team Lead</option>
              <option value="Executive Manager">Executive Manager</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8f8278] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#e8e2d5] bg-[#fbf9f5] text-[10.5px] uppercase tracking-wider text-[#8f8278] font-bold">
              <th className="py-3 px-4">Member</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Branch</th>
              <th className="py-3 px-4">Reports To</th>
              <th className="py-3 px-4 text-center">Customers</th>
              <th className="py-3 px-4 text-right">
                <span className="inline-flex items-center gap-1 justify-end">
                  Volume <ArrowUpDown className="w-3 h-3" />
                </span>
              </th>
              <th className="py-3 px-4 text-right">Incentives</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f2ede4] text-xs">
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-xs text-[#8f8278]">
                  No team members matching your search or filters.
                </td>
              </tr>
            ) : (
              filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-[#faf7f2] transition-colors group cursor-pointer"
                  onClick={() => onSelectMember && onSelectMember(member)}
                >
                  {/* Member info */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-[#e8e2d5]"
                      />
                      <div>
                        <div className="font-bold text-[#2c1b15] group-hover:text-[#9e6212] transition-colors">
                          {member.name}
                        </div>
                        <div className="text-[10.5px] text-[#8f8278]">{member.code}</div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10.5px] font-semibold ${
                        member.role === 'Team Lead'
                          ? 'bg-[#2c1b15] text-white'
                          : 'bg-[#eef2f6] text-[#334155]'
                      }`}
                    >
                      {member.role}
                    </span>
                  </td>

                  {/* Branch */}
                  <td className="py-3 px-4 text-[#443831] font-medium">{member.branch}</td>

                  {/* Reports to */}
                  <td className="py-3 px-4 text-[#73665c]">{member.reportsTo}</td>

                  {/* Customers */}
                  <td className="py-3 px-4 text-center font-semibold text-[#2c1b15]">
                    {member.customers}
                  </td>

                  {/* Volume */}
                  <td className="py-3 px-4 text-right font-bold text-[#2c1b15]">
                    {member.volume}
                  </td>

                  {/* Incentives */}
                  <td className="py-3 px-4 text-right font-bold text-[#9e6212]">
                    {member.incentives}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#e7f7ed] text-[#0d7a3e]">
                      {member.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div
                      className="inline-flex items-center gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => onSelectMember && onSelectMember(member)}
                        className="p-1 rounded-lg text-[#8f8278] hover:text-[#2c1b15] hover:bg-[#ede7dc] transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => alert(`Direct message channel opened for ${member.name}`)}
                        className="p-1 rounded-lg text-[#8f8278] hover:text-[#2c1b15] hover:bg-[#ede7dc] transition-colors cursor-pointer"
                        title="Send Message"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TeamTableView;
