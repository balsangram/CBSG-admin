import React from 'react';
import { FileText, Eye } from 'lucide-react';

export function ReportCard({ report, onPreview }) {
  return (
    <div className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-xs flex flex-col justify-between hover:border-[#c88a29]/60 hover:shadow-md transition-all group">
      {/* Top Header: Icon + Title + Subtitle */}
      <div>
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-[#2c1b15] text-[#cca04b] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-bold text-[#2c1b15] tracking-tight group-hover:text-[#9e6212] transition-colors truncate">
              {report.title}
            </h3>
            <p className="text-[10.5px] text-[#8f8278] truncate mt-0.5">{report.subtitle}</p>
          </div>
        </div>

        {/* Chart Canvas Area */}
        <div className="mt-4 flex gap-2 h-36 pt-2">
          {/* Y-Axis Labels */}
          <div className="flex flex-col justify-between text-[9px] text-[#8f8278] font-mono pr-1 text-right select-none w-10 shrink-0">
            {report.yAxis.map((val, idx) => (
              <span key={idx} className="leading-none">
                {val}
              </span>
            ))}
          </div>

          {/* Chart Plotting Area with Base Grid */}
          <div className="flex-1 relative flex items-end justify-around border-b border-[#e8e2d5] border-l border-[#f0eae0] pl-2 pb-0.5">
            {/* Subtle Horizontal grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30">
              <div className="border-b border-dashed border-[#e8e2d5] w-full" />
              <div className="border-b border-dashed border-[#e8e2d5] w-full" />
              <div className="border-b border-dashed border-[#e8e2d5] w-full" />
              <div className="border-b border-dashed border-[#e8e2d5] w-full" />
              <div className="w-full" />
            </div>

            {/* Ochre Golden Bars */}
            {report.bars.map((bar, idx) => (
              <div
                key={idx}
                className="relative flex flex-col items-center justify-end h-full z-10 group/bar"
                style={{ width: `${bar.widthPct}%` }}
              >
                {/* Bar */}
                <div
                  className="w-full bg-[#c99b44] hover:bg-[#b58732] rounded-t-xs transition-all duration-300"
                  style={{ height: `${bar.heightPct}%` }}
                  title={`${bar.label}: ${bar.value.toLocaleString('en-IN')}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer: Preview Button */}
      <div className="mt-4 pt-3 border-t border-[#f7f2ea] flex items-center justify-between">
        <button
          type="button"
          onClick={() => onPreview(report)}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-[#faf7f2] border border-[#e8e2d5] text-[#2c1b15] rounded-xl text-xs font-semibold shadow-2xs hover:border-[#c88a29] transition-all cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-[#8f8278]" />
          <span>Preview</span>
        </button>

        <span className="text-[10px] text-[#8f8278] font-mono">Q3 FY26-27</span>
      </div>
    </div>
  );
}

export default ReportCard;

