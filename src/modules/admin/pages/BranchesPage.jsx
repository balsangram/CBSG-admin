import React, { useState } from 'react';
import { Plus, Building2, X } from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import AddBranchModal from '../components/AddBranchModal';
import BranchDetailModal from '../components/BranchDetailModal';
import { branchesService } from '../services/branches.service';

export function BranchesPage() {
  const [branches, setBranches] = useState(() => branchesService.getBranches());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [bannerVisible, setBannerVisible] = useState(true);

  const handleAddBranch = (newBranch) => {
    const updated = branchesService.addBranch(branches, newBranch);
    setBranches(updated);
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-7xl mx-auto pb-16">
        {/* Top Notification Banner (matching exact screenshot) */}
        {bannerVisible && (
          <div className="flex items-start justify-between text-xs py-0.5">
            <div className="flex items-start gap-2.5">
              <span className="w-4 h-4 rounded-full border border-[#8f8278] flex items-center justify-center text-[10px] text-[#2c1b15] mt-0.5 shrink-0">
                ✓
              </span>
              <div>
                <h4 className="text-xs font-bold text-[#2c1b15]">
                  Rahul Verma now reports to Sneha Iyer
                </h4>
                <p className="text-[11px] text-[#8f8278]">
                  Incentive overrides re-routed from next transaction.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setBannerVisible(false)}
              className="p-1 text-[#8f8278] hover:text-[#2c1b15] transition-colors cursor-pointer"
              title="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="text-2xl font-bold text-[#2c1b15] tracking-tight">Branches</h1>
          </div>

          {/* + Add Branch Button */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2c1b15] hover:bg-[#432b22] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add branch</span>
          </button>
        </div>

        {/* 3 Branch Cards Grid (matching exact screenshot) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {branches.map((branch) => (
            <div
              key={branch.id}
              onClick={() => setSelectedBranch(branch)}
              className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-2xs hover:border-[#c88a29]/60 hover:shadow-md transition-all cursor-pointer group"
            >
              {/* Branch Header: Icon + Title + Manager */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2c1b15] text-[#cca04b] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  <Building2 className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-bold text-[#2c1b15] truncate group-hover:text-[#9e6212] transition-colors">
                    {branch.name}
                  </h3>
                  <p className="text-[11px] text-[#8f8278] truncate mt-0.5">
                    Manager: {branch.manager}
                  </p>
                </div>
              </div>

              {/* 3 Metrics Row */}
              <div className="mt-4 pt-3 border-t border-[#f7f2ea] grid grid-cols-3 gap-2 text-left">
                <div>
                  <span className="text-[10px] text-[#8f8278] font-normal block">Customers</span>
                  <span className="text-xs font-bold text-[#2c1b15] mt-0.5 block">{branch.customers}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8f8278] font-normal block">Staff</span>
                  <span className="text-xs font-bold text-[#2c1b15] mt-0.5 block">{branch.staff}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8f8278] font-normal block">Book</span>
                  <span className="text-xs font-bold text-[#2c1b15] mt-0.5 block">{branch.book}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Branch Modal */}
        <AddBranchModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddBranch={handleAddBranch}
        />

        {/* Branch Detail Modal */}
        <BranchDetailModal
          branch={selectedBranch}
          isOpen={!!selectedBranch}
          onClose={() => setSelectedBranch(null)}
        />
      </div>
    </DashboardLayout>
  );
}

export default BranchesPage;

