import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import ReportCard from '../components/ReportCard';
import ReportPreviewModal from '../components/ReportPreviewModal';
import { reportsService } from '../services/reports.service';

export function ReportsPage() {
  const [reports] = useState(() => reportsService.getReports());
  const [selectedFormat, setSelectedFormat] = useState('PDF');
  const [activePreviewReport, setActivePreviewReport] = useState(null);
  const [bannerVisible, setBannerVisible] = useState(true);

  const handleExportAll = () => {
    alert(`Exporting complete NBFC Audit Pack (6 Reports) in ${selectedFormat} format... Package generation started.`);
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
            <h1 className="text-2xl font-bold text-[#2c1b15] tracking-tight">Reports & analytics</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Format Selector Pills: PDF, Excel, CSV */}
            <div className="inline-flex p-1 bg-white border border-[#e8e2d5] rounded-xl text-xs shadow-2xs">
              {['PDF', 'Excel', 'CSV'].map((format) => (
                <button
                  key={format}
                  type="button"
                  onClick={() => setSelectedFormat(format)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedFormat === format
                      ? 'bg-[#2c1b15] text-white font-semibold shadow-xs'
                      : 'text-[#61554d] hover:text-[#2c1b15]'
                  }`}
                >
                  {format}
                </button>
              ))}
            </div>

            {/* Export All Reports Button */}
            <button
              type="button"
              onClick={handleExportAll}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2c1b15] hover:bg-[#432b22] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export all reports</span>
            </button>
          </div>
        </div>

        {/* 6 Report Cards Grid: 2 rows x 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onPreview={(rep) => setActivePreviewReport(rep)}
            />
          ))}
        </div>

        {/* Report Preview Modal */}
        <ReportPreviewModal
          report={activePreviewReport}
          isOpen={!!activePreviewReport}
          onClose={() => setActivePreviewReport(null)}
        />
      </div>
    </DashboardLayout>
  );
}

export default ReportsPage;
