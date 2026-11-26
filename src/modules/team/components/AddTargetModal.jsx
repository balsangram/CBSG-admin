import React, { useState } from 'react';
import { X, Target, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import { targetsService } from '../services/targets.service';

const ROLE_OPTIONS = [
  { value: 'TEAM_LEAD', label: 'Team Lead' },
  { value: 'EXECUTIVE_MANAGER', label: 'Executive Manager' },
];

const initialForm = {
  name: '',
  levelNo: '',
  role: 'TEAM_LEAD',
  amount: '',
  customer: '',
  prize: '',
  isActive: true,
};

export function AddTargetModal({ isOpen, onClose, onCreated }) {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      levelNo: form.levelNo.trim().toUpperCase(),
      role: form.role,
      amount: Number(form.amount),
      customer: Number(form.customer),
      prize: form.prize.trim(),
      isActive: form.isActive,
    };

    if (
      !payload.name ||
      !payload.levelNo ||
      !payload.prize ||
      Number.isNaN(payload.amount) ||
      Number.isNaN(payload.customer)
    ) {
      toast.error('Please fill all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await targetsService.createTarget(payload);
      toast.success('Target level created successfully.');
      onCreated?.(created);
      setForm(initialForm);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to create target.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls =
    'w-full px-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] focus:outline-none focus:border-[#c88a29]';
  const labelCls = 'block text-[11px] font-semibold text-[#61554d] mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-[#e8e2d5] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#f2ede4] flex items-center justify-between bg-[#faf8f4]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#2c1b15] text-[#cca04b] flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#2c1b15]">Add target level</h3>
              <p className="text-[11px] text-[#8f8278]">
                Define a new incentive target slab for agents
              </p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Level Name + Level No */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Level Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Gold Level"
                value={form.name}
                onChange={set('name')}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Level No. *</label>
              <input
                type="text"
                required
                placeholder="L1"
                value={form.levelNo}
                onChange={set('levelNo')}
                className={`${inputCls} font-mono uppercase`}
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className={labelCls}>Role *</label>
            <select
              value={form.role}
              onChange={set('role')}
              className={`${inputCls} cursor-pointer`}
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Amount + Customer Target */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Amount Target (₹) *</label>
              <input
                type="number"
                min="0"
                required
                placeholder="500000"
                value={form.amount}
                onChange={set('amount')}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Customer Target *</label>
              <input
                type="number"
                min="0"
                required
                placeholder="50"
                value={form.customer}
                onChange={set('customer')}
                className={inputCls}
              />
            </div>
          </div>

          {/* Prize */}
          <div>
            <label className={labelCls}>Prize *</label>
            <input
              type="text"
              required
              placeholder="e.g. 2% of business or ₹500/customer"
              value={form.prize}
              onChange={set('prize')}
              className={inputCls}
            />
          </div>

          {/* Is Active */}
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, isActive: e.target.checked }))
              }
              className="w-4 h-4 accent-[#c88a29]"
            />
            <span className="text-[#2c1b15] font-medium">Active level</span>
          </label>

          {/* Actions */}
          <div className="pt-3 border-t border-[#f2ede4] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#e8e2d5] rounded-xl text-xs font-semibold text-[#61554d] hover:bg-[#faf7f2] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#2c1b15] hover:bg-[#432b22] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? 'Creating…' : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Create Target
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTargetModal;
