import React from 'react';
import { X, Building2, MapPin } from 'lucide-react';

export function BranchDetailModal({ branch, isOpen, onClose }) {
  if (!isOpen || !branch) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-[#e8e2d5] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#f2ede4] flex items-center justify-between bg-[#faf8f4]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2c1b15] text-[#cca04b] flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#2c1b15]">{branch.name}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#e7f7ed] text-[#0d7a3e]">
                  Active Branch
                </span>
              </div>
              <p className="text-[11px] text-[#8f8278]">{branch.city}</p>
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
        <div className="p-6 space-y-4 text-xs">
          {/* Details list */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between py-1.5 border-b border-[#f6f2ea]">
              <span className="text-[#8f8278] flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> City
              </span>
              <span className="font-medium text-[#2c1b15]">{branch.city}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-[#f6f2ea]">
              <span className="text-[#8f8278]">Branch ID</span>
              <span className="font-semibold text-[#2c1b15] font-mono text-[11px]">
                {branch.id}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-[#f6f2ea]">
              <span className="text-[#8f8278]">Created</span>
              <span className="font-medium text-[#2c1b15]">
                {branch.createdAt
                  ? new Date(branch.createdAt).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '—'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <span className="text-[#8f8278]">Last Updated</span>
              <span className="font-medium text-[#2c1b15]">
                {branch.updatedAt
                  ? new Date(branch.updatedAt).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '—'}
              </span>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-[#f2ede4] flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-[#2c1b15] text-white rounded-xl text-xs font-semibold hover:bg-[#432b22] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BranchDetailModal;
