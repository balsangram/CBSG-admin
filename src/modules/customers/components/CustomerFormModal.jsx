import React, { useEffect, useState } from 'react';
import { X, UserPlus } from 'lucide-react';

const emptyForm = {
  name: '',
  phone: '',
  email: '',
  agentId: '',
};

export function CustomerFormModal({
  isOpen,
  mode,
  customer,
  agents,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(emptyForm);
  const [photoFile, setPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    setForm({
      name: customer?.name || '',
      phone: customer?.phone || '',
      email: customer?.email || '',
      agentId: customer?.agentId || '',
    });
    setPhotoFile(null);
    setError('');
  }, [isOpen, customer]);

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.phone.trim() || !form.agentId) {
      setError('Name, phone, and executive are required.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      await onSubmit(
        {
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          agentId: form.agentId,
        },
        photoFile
      );
    } catch (err) {
      setError(err.message || 'Failed to save customer.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#ded8cb]"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#f0ebdF]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#2c1b15] text-[#cca04b] flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#2c1b15]">
                {mode === 'edit' ? 'Edit customer' : 'Add customer'}
              </h3>
              <p className="text-[11px] text-[#8f8278]">
                Name, phone, and the executive who looks after this customer
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-[#faf7f0] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-3 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
              {error}
            </div>
          )}

          <label className="block font-semibold text-[#61554d]">
            Name *
            <input
              required
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="mt-1 w-full px-3 py-2 border border-[#e8e2d5] rounded-xl text-[#2c1b15] outline-none focus:border-[#c88a29]"
            />
          </label>

          <label className="block font-semibold text-[#61554d]">
            Phone *
            <input
              required
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              placeholder="10 digit mobile"
              className="mt-1 w-full px-3 py-2 border border-[#e8e2d5] rounded-xl text-[#2c1b15] outline-none focus:border-[#c88a29]"
            />
          </label>

          <label className="block font-semibold text-[#61554d]">
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className="mt-1 w-full px-3 py-2 border border-[#e8e2d5] rounded-xl text-[#2c1b15] outline-none focus:border-[#c88a29]"
            />
          </label>

          <label className="block font-semibold text-[#61554d]">
            Executive *
            <select
              required
              value={form.agentId}
              onChange={(event) => setForm({ ...form, agentId: event.target.value })}
              className="mt-1 w-full px-3 py-2 border border-[#e8e2d5] rounded-xl text-[#2c1b15] outline-none focus:border-[#c88a29] bg-white"
            >
              <option value="">Select executive</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                  {agent.employeeId ? ` · ${agent.employeeId}` : ''}
                </option>
              ))}
            </select>
          </label>

          <label className="block font-semibold text-[#61554d]">
            Photo
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => setPhotoFile(event.target.files?.[0] || null)}
              className="mt-1 w-full text-[#5e5148] file:mr-3 file:rounded-lg file:border-0 file:bg-[#f6f2e9] file:px-3 file:py-2 file:text-xs file:font-semibold"
            />
          </label>
        </div>

        <div className="pt-3 border-t border-[#f0ebdF] flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded-xl border border-[#e8e2d5] text-xs font-semibold text-[#61554d]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-[#2c1b15] text-white text-xs font-semibold disabled:opacity-60"
          >
            {saving ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Create customer'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CustomerFormModal;
