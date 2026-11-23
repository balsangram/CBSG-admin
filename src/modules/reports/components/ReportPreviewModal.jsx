import React from 'react';
import { X, Download, FileSpreadsheet, FileText, CheckCircle2 } from 'lucide-react';

export function ReportPreviewModal({ report, isOpen, onClose }) {
  if (!isOpen || !report) return null;

  const handleDownload = (format) => {
    alert(`Generating ${format} export for "${report.title}"... Download started.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-[#e8e2d5] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#f2ede4] flex items-center justify-between bg-[#faf8f4]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#2c1b15] text-[#cca04b] flex items-center justify-center shrink-0">
              <FileText className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#2c1b15]">{report.title}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#e7f7ed] text-[#0d7a3e]">
                  Audited & Ready
                </span>
              </div>
              <p className="text-[11px] text-[#8f8278]">{report.subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8f8278] hover:text-[#2c1b15] hover:bg-[#ede7dc] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
          {/* Metadata Banner */}
          <div className="p-3.5 bg-[#faf7f2] border border-[#eee7dc] rounded-2xl flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#73655a]">
            <div>
              <span className="text-[#8f8278] block text-[10px]">ORGANIZATION</span>
              <span className="font-bold text-[#2c1b15]">CBSG Finance Limited (RBI Reg. NBFC)</span>
            </div>
            <div>
              <span className="text-[#8f8278] block text-[10px]">REPORTING PERIOD</span>
              <span className="font-bold text-[#2c1b15]">November 2026 (Live Audit)</span>
            </div>
            <div>
              <span className="text-[#8f8278] block text-[10px]">VERIFIED BY</span>
              <span className="font-bold text-[#2c1b15]">Sanjay Kulkarni (Super Admin)</span>
            </div>
          </div>

          {/* Table Data */}
          <div>
            <h4 className="text-[11px] font-bold text-[#2c1b15] mb-2 uppercase tracking-wide">
              Statement Summary
            </h4>
            <div className="border border-[#e8e2d5] rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#fbf9f5] border-b border-[#e8e2d5] text-[10.5px] uppercase font-bold text-[#8f8278]">
                    {Object.keys(report.tableData[0] || {}).map((col) => (
                      <th key={col} className="py-2.5 px-3 capitalize">
                        {col.replace(/([A-Z])/g, ' $1')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2ede4]">
                  {report.tableData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#faf7f2]">
                      {Object.values(row).map((val, cellIdx) => (
                        <td key={cellIdx} className="py-2.5 px-3 font-medium text-[#2c1b15]">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Compliance note */}
          <div className="flex items-center gap-2 text-[10.5px] text-[#0d7a3e] bg-[#e7f7ed]/70 border border-[#c5ecd4] p-2.5 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Digital signature hash verified with CBSG Maker-Checker Audit Ledger.</span>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-[#f2ede4] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleDownload('PDF')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2c1b15] hover:bg-[#432b22] text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
              <button
                type="button"
                onClick={() => handleDownload('Excel')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#faf7f2] border border-[#e8e2d5] text-[#2c1b15] rounded-xl text-xs font-semibold shadow-2xs cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#0d7a3e]" />
                <span>Excel</span>
              </button>
              <button
                type="button"
                onClick={() => handleDownload('CSV')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#faf7f2] border border-[#e8e2d5] text-[#2c1b15] rounded-xl text-xs font-semibold shadow-2xs cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-[#9e6212]" />
                <span>CSV</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 border border-[#e8e2d5] rounded-xl text-xs font-semibold text-[#61554d] hover:bg-[#faf7f2] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportPreviewModal;
