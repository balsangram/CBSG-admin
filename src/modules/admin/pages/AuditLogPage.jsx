import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import PageHeader from '../../../components/common/PageHeader';
import { Search } from 'lucide-react';
import { auditService } from '../services/audit.service';

export function AuditLogPage() {
  const [logs] = useState(() => auditService.getLogs());
  const [searchQuery, setSearchQuery] = useState('');

  // Filter logs by search query across fields
  const filteredLogs = logs.filter((log) => {
    const q = searchQuery.toLowerCase();
    return (
      log.timestamp.toLowerCase().includes(q) ||
      log.user.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.entity.toLowerCase().includes(q) ||
      log.before.toLowerCase().includes(q) ||
      log.after.toLowerCase().includes(q)
    );
  });

  return (
    <DashboardLayout pageTitle="Audit log">
      <PageHeader
        crumbs={['Home', 'Administration', 'Audit Log']}
        title="Audit log"
        subtitle="Immutable record with before / after values"
        actions={
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-white/50 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-white/50 focus:outline-none focus:border-white/40 backdrop-blur-sm transition-colors"
            />
          </div>
        }
        className="mb-5"
      />
      <div className="space-y-5">

        {/* Audit Log Table */}
        <div className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#f2ede4] text-[10.5px] font-semibold text-[#8f8278] uppercase tracking-wider">
                  <th className="pb-3 pr-3 min-w-[140px]">Timestamp</th>
                  <th className="pb-3 px-3 min-w-[100px]">User</th>
                  <th className="pb-3 px-3 min-w-[130px]">Action</th>
                  <th className="pb-3 px-3 min-w-[110px]">Entity</th>
                  <th className="pb-3 px-3 min-w-[280px]">Before</th>
                  <th className="pb-3 pl-3 min-w-[280px]">After</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f1e9]">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-[#8f8278]">
                      No audit records found.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#faf8f4] transition-colors align-top">
                      {/* Timestamp */}
                      <td className="py-3.5 pr-3 font-mono text-[11px] text-[#61554d] whitespace-nowrap">
                        {log.timestamp}
                      </td>

                      {/* User */}
                      <td className="py-3.5 px-3 font-semibold text-[#2c1b15] whitespace-nowrap">
                        {log.user}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-3 text-[#2c1b15] font-medium whitespace-nowrap">
                        {log.action}
                      </td>

                      {/* Entity */}
                      <td className="py-3.5 px-3 font-bold text-[#2c1b15] whitespace-nowrap">
                        {log.entity}
                      </td>

                      {/* Before (Red Diff Badge) */}
                      <td className="py-3 px-3">
                        <div className="bg-[#fee2e2]/70 text-[#991b1b] border border-[#fecaca] px-2.5 py-1.5 rounded-lg text-[10.5px] font-mono leading-relaxed break-all max-h-36 overflow-y-auto">
                          {log.before}
                        </div>
                      </td>

                      {/* After (Green Diff Badge) */}
                      <td className="py-3 pl-3">
                        <div className="bg-[#dcfce7]/70 text-[#166534] border border-[#bbf7d0] px-2.5 py-1.5 rounded-lg text-[10.5px] font-mono leading-relaxed break-all max-h-36 overflow-y-auto">
                          {log.after}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AuditLogPage;

