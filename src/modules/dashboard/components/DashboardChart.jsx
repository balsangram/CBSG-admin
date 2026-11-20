import React, { useState } from 'react';
import { TrendingUp, Calendar } from 'lucide-react';

export function DashboardChart({ chartData }) {
  const [timeRange, setTimeRange] = useState('7d');

  const currentData = chartData[timeRange] || chartData['7d'];

  // Calculate highest value for relative bar heights
  const maxVal = Math.max(
    ...currentData.map((d) => Math.max(d.disbursements, d.deposits)),
    100
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-base">
              Disbursements & Deposits Trend
            </h3>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              <TrendingUp className="w-3 h-3" />
              +14.2% Net Flow
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Weekly loan disbursement volume against customer deposits
          </p>
        </div>

        {/* Time range pill buttons */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200/60">
          {['7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                timeRange === range
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 text-xs text-slate-600 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-blue-600" />
          <span className="font-medium">Loan Disbursements</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-amber-500" />
          <span className="font-medium">Deposits Received</span>
        </div>
      </div>

      {/* Visual Chart Visualization using Tailwind */}
      <div className="h-56 sm:h-64 flex items-end justify-between gap-3 sm:gap-6 pt-6 pb-2 px-2 border-b border-slate-100">
        {currentData.map((item, idx) => {
          const heightD = Math.max(12, Math.round((item.disbursements / maxVal) * 180));
          const heightC = Math.max(12, Math.round((item.deposits / maxVal) * 180));

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center justify-end h-full group relative"
            >
              {/* Tooltip on hover */}
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-900 text-white text-[10px] font-mono py-1 px-2 rounded shadow-lg whitespace-nowrap z-20">
                Loans: {item.amountD} | Dep: {item.amountC}
              </div>

              {/* Bar Pairs */}
              <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full">
                {/* Disbursements Bar */}
                <div
                  style={{ height: `${heightD}px` }}
                  className="w-1/2 max-w-[18px] bg-blue-600 rounded-t-sm group-hover:bg-blue-700 transition-all duration-300 relative"
                />
                {/* Deposits Bar */}
                <div
                  style={{ height: `${heightC}px` }}
                  className="w-1/2 max-w-[18px] bg-amber-500 rounded-t-sm group-hover:bg-amber-600 transition-all duration-300 relative"
                />
              </div>

              {/* Day Label */}
              <span className="mt-2.5 text-[11px] font-medium text-slate-500">
                {item.day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="mt-4 pt-3 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Active Disbursement Window: 09:30 AM - 06:30 PM IST</span>
        </div>
        <div className="font-medium text-slate-700">
          Target Utilization: <span className="text-blue-600 font-bold">92.4%</span>
        </div>
      </div>
    </div>
  );
}

export default DashboardChart;
