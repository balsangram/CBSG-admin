import React from 'react';
import { ArrowUpRight, ArrowDownRight, Users, UserCheck, Clock, CheckCircle2 } from 'lucide-react';
import { formatNumber } from '../../../utils/helpers';

export function StatsCard({
  title,
  count,
  change,
  isPositive: _isPositive = true,
  trend = 'up',
  subtitle,
  color = 'blue',
  iconName = 'Users',
}) {
  // Render matching Lucide icon
  const getIcon = () => {
    switch (iconName) {
      case 'UserCheck':
        return <UserCheck className="w-5 h-5 text-emerald-600" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'CheckCircle':
        return <CheckCircle2 className="w-5 h-5 text-indigo-600" />;
      case 'Users':
      default:
        return <Users className="w-5 h-5 text-blue-600" />;
    }
  };

  const getIconBg = () => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-50 border-emerald-100';
      case 'amber':
        return 'bg-amber-50 border-amber-100';
      case 'indigo':
        return 'bg-indigo-50 border-indigo-100';
      case 'blue':
      default:
        return 'bg-blue-50 border-blue-100';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 group">
      {/* Top row: Icon and Title */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-slate-500 tracking-tight">
          {title}
        </span>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center border ${getIconBg()} transition-transform duration-200 group-hover:scale-105`}
        >
          {getIcon()}
        </div>
      </div>

      {/* Middle row: Big metric count */}
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {formatNumber(count)}
        </h3>

        {/* Trend Indicator Badge */}
        <div
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
            trend === 'up'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
              : 'bg-amber-50 text-amber-700 border border-amber-200/60'
          }`}
        >
          {trend === 'up' ? (
            <ArrowUpRight className="w-3.5 h-3.5" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5" />
          )}
          <span>{change}</span>
        </div>
      </div>

      {/* Bottom subtitle/context */}
      <p className="text-xs text-slate-600">
        <span className="text-slate-600 font-medium">Trend:</span>{' '}
        <span className="capitalize">{trend === 'up' ? 'Increasing' : 'Optimizing'}</span>{' '}
        {subtitle && `· ${subtitle}`}
      </p>
    </div>
  );
}

export default StatsCard;
