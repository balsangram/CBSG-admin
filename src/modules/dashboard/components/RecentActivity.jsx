import React from 'react';
import {
  CheckCircle2,
  Clock,
  FileCheck,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

export function RecentActivity({ activities = [] }) {
  const getBadge = (status, color) => {
    const colorMap = {
      emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      amber: 'bg-amber-50 text-amber-700 border-amber-200',
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      slate: 'bg-slate-100 text-slate-700 border-slate-200',
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${
          colorMap[color] || 'bg-slate-100 text-slate-700 border-slate-200'
        }`}
      >
        {status}
      </span>
    );
  };

  const getIcon = (type) => {
    switch (type) {
      case 'approval':
        return <FileCheck className="w-4 h-4 text-amber-600" />;
      case 'payout':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'kyc':
        return <ShieldCheck className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Recent Activities</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit logs and real-time operations across CBSG desks
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/50">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          Live Audit Stream
        </span>
      </div>

      {/* List */}
      <div className="divide-y divide-slate-100">
        {activities.map((item) => (
          <div
            key={item.id}
            className="p-4 hover:bg-slate-50/70 transition-colors flex items-start gap-3.5 group"
          >
            {/* Action Icon */}
            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
              {getIcon(item.type)}
            </div>

            {/* Content Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900 leading-snug truncate">
                  {item.title}
                </p>
                <span className="text-[11px] font-medium text-slate-600 shrink-0">
                  {item.time}
                </span>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                  {item.reference}
                </span>
                <span className="text-xs text-slate-600">
                  by <strong className="font-medium text-slate-700">{item.user}</strong> ({item.role})
                </span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="shrink-0 hidden sm:block">
              {getBadge(item.status, item.statusColor)}
            </div>
          </div>
        ))}
      </div>

      {/* Footer view all link */}
      <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-center">
        <button
          type="button"
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
        >
          <span>View complete NBFC audit log</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default RecentActivity;
