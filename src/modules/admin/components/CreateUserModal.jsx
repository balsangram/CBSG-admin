import React, { useState } from 'react';
import { X, UserPlus, Check } from 'lucide-react';

export function CreateUserModal({ isOpen, onClose, onAddUser }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Verifier',
    pageAccess: '4 Read · 3 Write',
  });
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const newUser = {
      id: `user-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: 'Active',
      pageAccess: formData.pageAccess,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    };

    onAddUser(newUser);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-[#e8e2d5] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in duration-200">
        <div className="p-5 border-b border-[#f2ede4] flex items-center justify-between bg-[#faf8f4]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#2c1b15] text-[#cca04b] flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#2c1b15]">Create staff user</h3>
              <p className="text-[11px] text-[#8f8278]">
                Grant role-based RBAC permissions
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {success ? (
            <div className="py-6 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#e7f7ed] text-[#0d7a3e] flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#2c1b15]">User Created Successfully</h4>
              <p className="text-xs text-[#8f8278]">Access credentials sent to staff email.</p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-[#61554d] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Joshi"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] focus:outline-none focus:border-[#c88a29]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#61554d] mb-1">
                  Official Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@cbsgfinancial.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] focus:outline-none focus:border-[#c88a29]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#61554d] mb-1">
                  Assigned Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => {
                    const role = e.target.value;
                    let access = '4 Read · 2 Write';
                    if (role === 'Sub-admin') access = '16 Read · 14 Write';
                    if (role === 'Branch Manager') access = '11 Read · 10 Write';
                    if (role === 'Finance') access = '9 Read · 7 Write';
                    setFormData({ ...formData, role, pageAccess: access });
                  }}
                  className="w-full px-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] font-medium focus:outline-none focus:border-[#c88a29]"
                >
                  <option value="Verifier">Verifier</option>
                  <option value="Approver">Approver</option>
                  <option value="Branch Manager">Branch Manager</option>
                  <option value="Finance">Finance</option>
                  <option value="Sub-admin">Sub-admin</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#61554d] mb-1">
                  Calculated Permissions
                </label>
                <input
                  type="text"
                  readOnly
                  value={formData.pageAccess}
                  className="w-full px-3 py-2 bg-[#faf8f4] border border-[#e8e2d5] rounded-xl text-xs text-[#61554d] font-mono outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#f2ede4] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-[#e8e2d5] rounded-xl text-xs font-semibold text-[#61554d] hover:bg-[#faf7f2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2c1b15] hover:bg-[#432b22] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Confirm & Create
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default CreateUserModal;
