import React, { useMemo, useRef, useState } from 'react';
import { X, Building2, MapPin, Check, ChevronDown } from 'lucide-react';
import useClickOutside from '../../../hooks/useClickOutside';
import { INDIAN_CITIES } from '../data/indian-cities';

const RESULT_LIMIT = 80;

function CitySearchSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const rootRef = useRef(null);

  useClickOutside(rootRef, () => setOpen(false));

  const { matches, total } = useMemo(() => {
    const term = query.trim().toLowerCase();

    if (!term) {
      return { matches: [], total: INDIAN_CITIES.length };
    }

    const found = INDIAN_CITIES.filter(
      (city) =>
        city.name.toLowerCase().includes(term) ||
        city.state.toLowerCase().includes(term)
    );

    return { matches: found.slice(0, RESULT_LIMIT), total: found.length };
  }, [query]);

  const selectCity = (city) => {
    onChange(city.name);
    setQuery(city.name);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8f8278]" />
      <input
        type="text"
        required
        autoComplete="off"
        placeholder="Search an Indian city"
        value={query}
        onMouseDown={() => setOpen(true)}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          onChange('');
          setOpen(true);
        }}
        className="w-full pl-9 pr-8 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] focus:outline-none focus:border-[#c88a29]"
      />
      <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-[#8f8278] pointer-events-none" />

      {open && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-[#e8e2d5] bg-white shadow-lg">
          <ul className="max-h-52 overflow-y-auto">
            {matches.length === 0 ? (
              <li className="px-3 py-2.5 text-[11px] text-[#8f8278]">
                {query.trim()
                  ? 'No city found'
                  : `Type to search ${INDIAN_CITIES.length.toLocaleString('en-IN')} Indian cities`}
              </li>
            ) : (
              matches.map((city) => (
                <li key={`${city.name}-${city.state}`}>
                  <button
                    type="button"
                    onClick={() => selectCity(city)}
                    className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left hover:bg-[#faf7f2]"
                  >
                    <span className="font-semibold text-[#2c1b15]">{city.name}</span>
                    <span className="shrink-0 text-[11px] text-[#8f8278]">{city.state}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
          {total > matches.length && (
            <p className="border-t border-[#f2ede4] px-3 py-1.5 text-[10px] text-[#8f8278]">
              Showing {matches.length} of {total}. Keep typing to narrow the list.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function AddBranchModal({ isOpen, onClose, onAddBranch }) {
  const [formData, setFormData] = useState({
    name: '',
    city: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.city.trim()) {
      setError('Select a city from the list.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onAddBranch({
        name: formData.name.trim(),
        city: formData.city.trim(),
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData({ name: '', city: '' });
        onClose();
      }, 800);
    } catch (err) {
      setError(err.message || 'Failed to create branch.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-[#e8e2d5] shadow-2xl w-full max-w-lg overflow-visible animate-in fade-in duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#f2ede4] flex items-center justify-between bg-[#faf8f4] rounded-t-3xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#2c1b15] text-[#cca04b] flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#2c1b15]">Add new branch</h3>
              <p className="text-[11px] text-[#8f8278]">
                Establish new NBFC operational branch office
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

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {success ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#e7f7ed] text-[#0d7a3e] flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#2c1b15]">Branch Created Successfully</h4>
              <p className="text-xs text-[#8f8278]">Branch ledger and staff mapping initialized.</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {error}
                </div>
              )}

              {/* Branch Name */}
              <div>
                <label className="block text-[11px] font-semibold text-[#61554d] mb-1">
                  Branch Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nashik - College Road"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] focus:outline-none focus:border-[#c88a29]"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-[11px] font-semibold text-[#61554d] mb-1">
                  City *
                </label>
                <CitySearchSelect
                  value={formData.city}
                  onChange={(city) => setFormData({ ...formData, city })}
                />
              </div>

              {/* Action Buttons */}
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
                  className="px-5 py-2 bg-[#2c1b15] hover:bg-[#432b22] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? 'Creating…' : 'Confirm & Create'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default AddBranchModal;
