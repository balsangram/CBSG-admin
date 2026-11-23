import React, { useState } from 'react';
import { X, UserPlus, Phone, Mail, Award, Check } from 'lucide-react';

export function AddMemberModal({ isOpen, onClose, onAddMember }) {
  const [formData, setFormData] = useState({
    name: '',
    role: 'Executive Manager',
    branch: 'Pune',
    reportsTo: 'Anil Mehta',
    phone: '',
    email: '',
    targetVolume: '₹1,00,000',
  });
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const newMember = {
      id: `member-${Date.now()}`,
      name: formData.name,
      role: formData.role,
      code: formData.role === 'Team Lead' ? `TL - ${formData.branch.slice(0, 3).toUpperCase()} - 03` : `EM - ${Math.floor(1000 + Math.random() * 9000)}`,
      branch: formData.branch,
      reportsTo: formData.reportsTo,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      customers: 0,
      volume: '₹0',
      rawVolume: 0,
      incentives: '₹0',
      rawIncentives: 0,
      status: 'Active',
    };

    onAddMember(newMember);
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-[#e8e2d5] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#f2ede4] flex items-center justify-between bg-[#faf8f4]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#2c1b15] text-white flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#2c1b15]">Add team member</h3>
              <p className="text-[11px] text-[#8f8278]">
                Assign role, hierarchy, branch, and commission setup
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

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {successMsg ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#e7f7ed] text-[#0d7a3e] flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#2c1b15]">Member Added Successfully</h4>
              <p className="text-xs text-[#8f8278]">Hierarchy tree updated in real-time.</p>
            </div>
          ) : (
            <>
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-semibold text-[#61554d] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ritesh Deshpande"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] focus:outline-none focus:border-[#9e6212]"
                />
              </div>

              {/* Role & Branch */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#61554d] mb-1">
                    Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] font-medium focus:outline-none focus:border-[#9e6212]"
                  >
                    <option value="Executive Manager">Executive Manager</option>
                    <option value="Team Lead">Team Lead</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#61554d] mb-1">
                    Branch *
                  </label>
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] font-medium focus:outline-none focus:border-[#9e6212]"
                  >
                    <option value="Pune">Pune</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Nagpur">Nagpur</option>
                  </select>
                </div>
              </div>

              {/* Reports To */}
              <div>
                <label className="block text-[11px] font-semibold text-[#61554d] mb-1">
                  Reports To (Manager)
                </label>
                <select
                  value={formData.reportsTo}
                  onChange={(e) => setFormData({ ...formData, reportsTo: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] font-medium focus:outline-none focus:border-[#9e6212]"
                >
                  <option value="Anil Mehta">Anil Mehta (TL - Pune)</option>
                  <option value="Sneha Iyer">Sneha Iyer (TL - Pune)</option>
                  <option value="Kavya Nair">Kavya Nair (TL - Mumbai)</option>
                  <option value="Meera Joshi">Meera Joshi (TL - Mumbai)</option>
                  <option value="CBSG Admin">CBSG Finance Limited · Admin</option>
                </select>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#61554d] mb-1">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8f8278]" />
                    <input
                      type="tel"
                      placeholder="98XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] focus:outline-none focus:border-[#9e6212]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#61554d] mb-1">
                    Work Email
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8f8278]" />
                    <input
                      type="email"
                      placeholder="name@cbsg.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] focus:outline-none focus:border-[#9e6212]"
                    />
                  </div>
                </div>
              </div>

              {/* Target Volume */}
              <div>
                <label className="block text-[11px] font-semibold text-[#61554d] mb-1">
                  Monthly Target Volume
                </label>
                <div className="relative">
                  <Award className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8f8278]" />
                  <input
                    type="text"
                    value={formData.targetVolume}
                    onChange={(e) => setFormData({ ...formData, targetVolume: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] focus:outline-none focus:border-[#9e6212]"
                  />
                </div>
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
                  className="px-5 py-2 bg-[#2c1b15] text-white rounded-xl text-xs font-bold hover:bg-[#432b22] transition-colors shadow-xs cursor-pointer"
                >
                  Confirm & Add
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default AddMemberModal;
