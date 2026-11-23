import React, { useState } from 'react';
import { X, Building2, MapPin, Phone, User, Check } from 'lucide-react';

export function AddBranchModal({ isOpen, onClose, onAddBranch }) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    manager: 'Sneha Iyer',
    address: '',
    phone: '',
    email: '',
  });
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const newBranch = {
      id: `br-${Date.now()}`,
      name: formData.name,
      code: formData.code || `BR-${Math.floor(10 + Math.random() * 90)}`,
      manager: formData.manager,
      customers: 0,
      staff: 1,
      book: '₹0',
      rawBook: 0,
      address: formData.address || 'Commercial Hub, Main Road',
      phone: formData.phone || '+91 20 0000 0000',
      email: formData.email || 'branch@cbsg.online',
      staffList: [{ name: formData.manager, role: 'Branch Manager' }],
    };

    onAddBranch(newBranch);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-[#e8e2d5] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#f2ede4] flex items-center justify-between bg-[#faf8f4]">
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
              {/* Branch Name & Code */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
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
                <div>
                  <label className="block text-[11px] font-semibold text-[#61554d] mb-1">
                    Branch Code
                  </label>
                  <input
                    type="text"
                    placeholder="NSK-04"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] font-mono focus:outline-none focus:border-[#c88a29]"
                  />
                </div>
              </div>

              {/* Branch Manager */}
              <div>
                <label className="block text-[11px] font-semibold text-[#61554d] mb-1">
                  Branch Manager
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8f8278]" />
                  <select
                    value={formData.manager}
                    onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] font-medium focus:outline-none focus:border-[#c88a29] cursor-pointer"
                  >
                    <option value="Sneha Iyer">Sneha Iyer (Team Lead)</option>
                    <option value="Anil Mehta">Anil Mehta (Team Lead)</option>
                    <option value="Meera Joshi">Meera Joshi (Team Lead)</option>
                    <option value="Kavya Nair">Kavya Nair (Team Lead)</option>
                    <option value="Manish Kadu">Manish Kadu (Branch Manager)</option>
                  </select>
                </div>
              </div>

              {/* Location Address */}
              <div>
                <label className="block text-[11px] font-semibold text-[#61554d] mb-1">
                  Branch Address
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-[#8f8278]" />
                  <textarea
                    rows={2}
                    placeholder="Floor 2, Business Square, College Road, Nashik 422005"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] focus:outline-none focus:border-[#c88a29]"
                  />
                </div>
              </div>

              {/* Contact Phone & Email */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#61554d] mb-1">
                    Official Phone
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8f8278]" />
                    <input
                      type="tel"
                      placeholder="+91 253 257 0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] focus:outline-none focus:border-[#c88a29]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#61554d] mb-1">
                    Branch Email
                  </label>
                  <input
                    type="email"
                    placeholder="branch@cbsg.online"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] focus:outline-none focus:border-[#c88a29]"
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
                  className="px-5 py-2 bg-[#2c1b15] hover:bg-[#432b22] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
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

export default AddBranchModal;
