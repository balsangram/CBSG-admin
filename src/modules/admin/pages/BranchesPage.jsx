import React, { useEffect, useState } from 'react';
import { Plus, Building2, X, Loader2 } from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import PageHeader from '../../../components/common/PageHeader';
import AddBranchModal from '../components/AddBranchModal';
import BranchDetailModal from '../components/BranchDetailModal';
import { branchesService } from '../services/branches.service';
import { notify } from '../../../utils/notify';

export function BranchesPage() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [bannerVisible, setBannerVisible] = useState(true);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await branchesService.getBranches();
      setBranches(data);
    } catch (err) {
      setError(err.message || 'Failed to load branches.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleAddBranch = async (newBranch) => {
    try {
      const created = await branchesService.createBranch(newBranch);
      setBranches((prev) => [created, ...prev]);
      notify.success(`Branch "${created.name}" created.`);
    } catch (err) {
      notify.error(err.message || 'Failed to create branch.');
      throw err;
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        crumbs={['Home', 'Administration', 'Branches']}
        title="Branches"
        subtitle={`${branches.length} branch${branches.length === 1 ? '' : 'es'}`}
        actions={
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#c88a29] hover:bg-[#d99a3d] text-[#2c1b15] text-xs font-bold transition-colors shadow-sm cursor-pointer select-none"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add branch</span>
          </button>
        }
        className="mb-5"
      />
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

        {/* Page content */}

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {error}
            <button type="button" className="ml-2 underline" onClick={fetchBranches}>
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24 text-stone-500 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading branches…</span>
          </div>
        ) : branches.length === 0 && !error ? (
          <div className="bg-white rounded-2xl border border-[#e8e2d5] p-12 text-center text-xs text-[#8a7e75]">
            No branches yet. Click "Add branch" to create one.
          </div>
        ) : (
          /* Branch Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {branches.map((branch) => (
              <div
                key={branch.id}
                onClick={() => setSelectedBranch(branch)}
                className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-2xs hover:border-[#c88a29]/60 hover:shadow-md transition-all cursor-pointer group"
              >
                {/* Branch Header: Icon + Title + City */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2c1b15] text-[#cca04b] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                    <Building2 className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-bold text-[#2c1b15] truncate group-hover:text-[#9e6212] transition-colors">
                      {branch.name}
                    </h3>
                    <p className="text-[11px] text-[#8f8278] truncate mt-0.5">
                      {branch.city}
                    </p>
                  </div>
                </div>

                {/* Created date */}
                <div className="mt-4 pt-3 border-t border-[#f7f2ea]">
                  <span className="text-[10px] text-[#8f8278] font-normal block">
                    Created
                  </span>
                  <span className="text-xs font-bold text-[#2c1b15] mt-0.5 block">
                    {branch.createdAt
                      ? new Date(branch.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                      : '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

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
