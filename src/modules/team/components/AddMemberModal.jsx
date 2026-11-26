import React, { useEffect, useState } from 'react';
import { X, UserPlus, Phone, Mail, Award, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { api } from '../../../services/api';

const ROLE_MAP = {
  'Executive Manager': 'executive_manager',
  'Team Lead': 'team_lead',
};

const TARGET_ROLE_MAP = {
  executive_manager: 'EXECUTIVE_MANAGER',
  team_lead: 'TEAM_LEAD',
};

export function AddMemberModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    role: 'Executive Manager',
    branchId: '',
    teamLeadId: '',
    targetId: '',
    phone: '',
    email: '',
  });
  const [branches, setBranches] = useState([]);
  const [targets, setTargets] = useState([]);
  const [teamLeads, setTeamLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const isExecutive = formData.role === 'Executive Manager';
  const apiRole = ROLE_MAP[formData.role];
  const noTeamLeads = isExecutive && teamLeads.length === 0;

  // Load branches, targets and team leads when modal opens
  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    Promise.all([
      api.get('/admin/branches'),
      api.get('/admin/targets'),
      api.get('/admin/agents'),
    ])
      .then(([branchRes, targetRes, agentRes]) => {
        setBranches(branchRes.data?.data || []);
        setTargets((targetRes.data?.data || []).filter((t) => t.isActive));
        setTeamLeads(
          (agentRes.data?.data || []).filter((a) => a.role === 'team_lead')
        );
      })
      .catch((err) => {
        toast.error(err.message || 'Failed to load form options.');
      })
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
      teamLeadId: role === 'Team Lead' ? '' : prev.teamLeadId,
      targetId: '', // reset target — filtered by role
    }));
  };

  const roleTargets = targets.filter(
    (t) => t.role === TARGET_ROLE_MAP[apiRole]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (isExecutive && !formData.teamLeadId) {
      if (teamLeads.length === 0) {
        toast.error('No Team Lead exists. Please create a Team Lead first.');
      } else {
        toast.error('Please select a Team Lead this Executive reports to.');
      }
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/admin/agents', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        role: apiRole,
        branchId: formData.branchId || null,
        targetId: formData.targetId || null,
        teamLeadId: isExecutive ? formData.teamLeadId : null,
      });

      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        setFormData({
          name: '',
          role: 'Executive Manager',
          branchId: '',
          teamLeadId: '',
          targetId: '',
          phone: '',
          email: '',
        });
        onClose();
      }, 900);
    } catch (err) {
      toast.error(err.message || 'Failed to create agent.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls =
    'w-full px-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] focus:outline-none focus:border-[#9e6212]';
  const labelCls = 'block text-[11px] font-semibold text-[#61554d] mb-1';

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
                Assign role, hierarchy, branch, and target
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
              <p className="text-xs text-[#8f8278]">Agent created in the system.</p>
            </div>
          ) : loading ? (
            <div className="py-10 flex items-center justify-center gap-2 text-[#8f8278]">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading options…</span>
            </div>
          ) : (
            <>
              {/* Full Name */}
              <div>
                <label className={labelCls}>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ritesh Deshpande"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputCls}
                />
              </div>

              {/* Role & Branch */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className={`${inputCls} cursor-pointer`}
                  >
                    <option value="Executive Manager">Executive Manager</option>
                    <option value="Team Lead">Team Lead</option>
                  </select>
                </div>

                <div>
                  <label className={labelCls}>Branch</label>
                  <select
                    value={formData.branchId}
                    onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                    className={`${inputCls} cursor-pointer`}
                  >
                    <option value="">Select branch</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}{b.city ? ` — ${b.city}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reports To — only for Executive Manager */}
              {isExecutive && (
                <div>
                  <label className={labelCls}>Reports To (Team Lead) *</label>
                  {noTeamLeads ? (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>
                        No Team Lead exists yet. Please create a Team Lead first
                        before adding an Executive Manager.
                      </span>
                    </div>
                  ) : (
                    <select
                      required
                      value={formData.teamLeadId}
                      onChange={(e) => setFormData({ ...formData, teamLeadId: e.target.value })}
                      className={`${inputCls} cursor-pointer`}
                    >
                      <option value="">Select team lead</option>
                      {teamLeads.map((lead) => (
                        <option key={lead.id} value={lead.id}>
                          {lead.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {/* Target */}
              <div>
                <label className={labelCls}>Target Level</label>
                <div className="relative">
                  <Award className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8f8278]" />
                  <select
                    value={formData.targetId}
                    onChange={(e) => setFormData({ ...formData, targetId: e.target.value })}
                    className={`${inputCls} pl-9 cursor-pointer`}
                  >
                    <option value="">No target</option>
                    {roleTargets.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.levelNo}) — ₹{t.amount?.toLocaleString('en-IN')}
                      </option>
                    ))}
                  </select>
                </div>
                {roleTargets.length === 0 && (
                  <p className="text-[10.5px] text-[#8f8278] mt-1">
                    No active targets for this role.
                  </p>
                )}
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Mobile Number *</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8f8278]" />
                    <input
                      type="tel"
                      required
                      placeholder="98XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`${inputCls} pl-9`}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Work Email *</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8f8278]" />
                    <input
                      type="email"
                      required
                      placeholder="name@cbsg.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`${inputCls} pl-9`}
                    />
                  </div>
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
                  disabled={isSubmitting || (isExecutive && noTeamLeads)}
                  className="px-5 py-2 bg-[#2c1b15] text-white rounded-xl text-xs font-bold hover:bg-[#432b22] transition-colors shadow-xs cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? 'Creating…' : 'Confirm & Add'}
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
