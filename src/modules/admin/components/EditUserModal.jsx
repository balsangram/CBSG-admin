import React, { useState } from 'react';
import { X, UserCheck, Check } from 'lucide-react';

export function EditUserModal({ isOpen, onClose, user, onUpdateUser }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'Verifier',
    pageAccess: user?.pageAccess || '4 Read · 3 Write',
    status: user?.status || 'Active',
  });
  const [success, setSuccess] = useState(false);

  if (!isOpen || !user) return null;

  const handleRoleChange = (e) => {
    const role = e.target.value;
    let access = '4 Read · 2 Write';
    if (role === 'Sub-admin') access = '16 Read · 14 Write';
    if (role === 'Branch Manager') access = '11 Read · 10 Write';
    if (role === 'Finance') access = '9 Read · 7 Write';
    if (role === 'Verifier') access = '4 Read · 3 Write';
    if (role === 'Approver') access = '4 Read · 2 Write';
    setFormData((prev) => ({ ...prev, role, pageAccess: access }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateUser(user.id, formData);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-[#e8e2d5] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in duration-200">
        <div className="p-5 border-b border-[#f2ede4] flex items-center justify-between bg-[#faf8f4]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#2c1b15] text-[#cca04b] flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#2c1b15]">Edit staff user</h3>
              <p className="text-[11px] text-[#8f8278]">
                Update role and page access permissions
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
              <h4 className="text-sm font-bold text-[#2c1b15]">Staff User Updated</h4>
              <p className="text-xs text-[#8f8278]">Role permissions modified successfully.</p>
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
                  onChange={handleRoleChange}
                  className="w-full px-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] font-medium focus:outline-none focus:border-[#c88a29]"
                >
                  <option value="Sub-admin">Sub-admin</option>
                  <option value="Branch Manager">Branch Manager</option>
                  <option value="Verifier">Verifier</option>
                  <option value="Approver">Approver</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#61554d] mb-1">
                  Page Access
                </label>
                <input
                  type="text"
                  readOnly
                  value={formData.pageAccess}
                  className="w-full px-3 py-2 bg-[#faf8f4] border border-[#e8e2d5] rounded-xl text-xs text-[#61554d] font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#61554d] mb-1">
                  Account Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] font-medium focus:outline-none focus:border-[#c88a29]"
                >
                  <option value="Active">Active</option>
                  <option value="Disabled">Disabled</option>
                </select>
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
                  Save Changes
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default EditUserModal;
