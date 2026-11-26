import React, { useState } from 'react';
import { X } from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import PageHeader from '../../../components/common/PageHeader';
import PayoutReviewModal from '../components/PayoutReviewModal';
import { payoutsService } from '../services/payouts.service';

export function PayoutManagementPage() {
  const [payouts, setPayouts] = useState(() => payoutsService.getPayouts());
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Customers' | 'EM' | 'Team Leads'
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [bannerVisible, setBannerVisible] = useState(true);

  // Filter payouts by active tab
  const filteredPayouts = payouts.filter((p) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Customers') return p.category === 'Customers';
    if (activeTab === 'EM') return p.category === 'EM';
    if (activeTab === 'Team Leads') return p.category === 'Team Leads';
    return true;
  });

  const handleApprove = (id) => {
    const updated = payoutsService.approvePayout(payouts, id);
    setPayouts(updated);
  };

  const handleReject = (id) => {
    const updated = payoutsService.rejectPayout(payouts, id);
    setPayouts(updated);
  };

  return (
    <DashboardLayout>
      <PageHeader
        crumbs={['Home', 'Team & Incentives', 'Payout Management']}
        title="Payout management"
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

        {/* Filter Tabs: All, Customers, EM, Team Leads */}
        <div className="flex items-center justify-end">
          <div className="inline-flex p-1 bg-white border border-[#e8e2d5] rounded-xl text-xs shadow-2xs">
            {['All', 'Customers', 'EM', 'Team Leads'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#2c1b15] text-white font-semibold shadow-xs'
                    : 'text-[#61554d] hover:text-[#2c1b15]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Payouts Table (matching exact screenshot) */}
        <div className="bg-white rounded-2xl border border-[#e8e2d5] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#f0eae0] text-[10.5px] uppercase tracking-wider text-[#8f8278] font-bold">
                  <th className="py-3.5 px-4 font-semibold">Beneficiary</th>
                  <th className="py-3.5 px-4 font-semibold">Type</th>
                  <th className="py-3.5 px-4 font-semibold">Requested</th>
                  <th className="py-3.5 px-4 font-semibold">Amount</th>
                  <th className="py-3.5 px-4 font-semibold">Tds</th>
                  <th className="py-3.5 px-4 font-semibold">Net</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Comments</th>
                  <th className="py-3.5 px-4 text-right font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f7f2ea] text-xs">
                {filteredPayouts.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-xs text-[#8f8278]">
                      No payout records found in this category.
                    </td>
                  </tr>
                ) : (
                  filteredPayouts.map((row) => (
                    <tr key={row.id} className="hover:bg-[#faf7f2] transition-colors">
                      {/* Beneficiary */}
                      <td className="py-3.5 px-4 font-semibold text-[#2c1b15] whitespace-nowrap">
                        {row.beneficiary}
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-4 text-[#73665c] font-normal whitespace-nowrap">
                        {row.type}
                      </td>

                      {/* Requested */}
                      <td className="py-3.5 px-4 text-[#443831] font-normal whitespace-nowrap">
                        {row.requested}
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 font-semibold text-[#2c1b15] whitespace-nowrap">
                        {row.amount}
                      </td>

                      {/* TDS */}
                      <td className="py-3.5 px-4 text-[#73665c] font-normal whitespace-nowrap">
                        {row.tds}
                      </td>

                      {/* Net */}
                      <td className="py-3.5 px-4 font-semibold text-[#2c1b15] whitespace-nowrap">
                        {row.net}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            row.status === 'Requested'
                              ? 'bg-[#fef4e6] text-[#b86200] border border-[#fde4c4]'
                              : row.status === 'Settled'
                              ? 'bg-[#f5efe4] text-[#736357] border border-[#e8dfd2]'
                              : 'bg-[#fee2e2] text-[#991b1b] border border-[#fecaca]'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>

                      {/* Comments */}
                      <td className="py-3.5 px-4 text-[#8f8278] whitespace-nowrap">
                        {row.comments}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {row.status === 'Requested' ? (
                          <button
                            type="button"
                            onClick={() => setSelectedPayout(row)}
                            className="px-3.5 py-1 bg-[#2c1b15] hover:bg-[#432b22] text-white rounded-xl text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                          >
                            Review
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Maker-Checker Payout Review Modal */}
        <PayoutReviewModal
          payout={selectedPayout}
          isOpen={!!selectedPayout}
          onClose={() => setSelectedPayout(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </DashboardLayout>
  );
}

export default PayoutManagementPage;

