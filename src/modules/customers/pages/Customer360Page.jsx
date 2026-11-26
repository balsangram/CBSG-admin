import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Mail,
  X,
  FileCheck2,
  Send,
  Loader2,
  Pencil,
  Trash2,
  Eye,
} from 'lucide-react';
import { notify } from '../../../utils/notify';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { customerService } from '../services/customer.service';
import { ROUTES } from '../../../utils/constants';

const formatINR = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const draftFromRecord = (record) => ({
  name: record?.name || '',
  phone: record?.phone || '',
  email: record?.email || '',
  agentId: record?.agentId ? String(record.agentId) : '',
  address: record?.address || '',
  aadhar: record?.aadhar || '',
  pan: record?.pan || '',
  bankName: record?.bankName || '',
  accountNumber: record?.accountNumber || '',
  ifscCode: record?.ifscCode || '',
  nominee: record?.nominee || '',
  nomineeRelation: record?.nomineeRelation || '',
});

const fieldClass =
  'w-full px-2.5 py-1.5 border border-[#e8e2d5] rounded-lg text-xs font-semibold text-[#2c1b15] outline-none focus:border-[#c88a29] bg-white';

const isImageFile = (file) => Boolean(file?.type?.startsWith('image/'));

const isImageUrl = (url) => /\.(png|jpe?g|webp)(\?|$)/i.test(url || '');

const isPdfUrl = (url) => /\.pdf(\?|$)/i.test(url || '');

function IdentityDocument({ label, storedUrl, previewUrl, file, editing, onFile, children }) {
  const viewUrl = previewUrl || storedUrl;
  const showImage = previewUrl ? isImageFile(file) : isImageUrl(storedUrl);
  const showPdf = !showImage && (file?.type === 'application/pdf' || isPdfUrl(viewUrl));

  return (
    <div className="rounded-xl border border-[#e8e2d5] bg-[#f8f5ee] p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a7e75]">{label}</span>
        {viewUrl && (
          <a
            href={viewUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2c1b15] hover:text-[#c88a29]"
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </a>
        )}
      </div>
      {showImage ? (
        <a href={viewUrl} target="_blank" rel="noreferrer" className="block">
          <img
            src={viewUrl}
            alt={label}
            className="h-40 w-full rounded-lg border border-[#e8e2d5] bg-white object-contain"
          />
        </a>
      ) : showPdf ? (
        <a
          href={viewUrl}
          target="_blank"
          rel="noreferrer"
          className="flex h-40 items-center justify-center rounded-lg border border-[#e8e2d5] bg-white text-xs font-semibold text-[#2c1b15]"
        >
          <FileCheck2 className="mr-2 h-5 w-5 text-[#c88a29]" />
          PDF document
        </a>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-[#e8e2d5] bg-white text-xs text-[#8a7e75]">
          No document
        </div>
      )}
      {children}
      {editing && (
        <label className="mt-2 block text-[10px] font-semibold text-[#8a7e75]">
          {storedUrl || previewUrl ? 'Replace file' : 'Upload file'}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={(event) => onFile(event.target.files?.[0] || null)}
            className="mt-1 block w-full text-[10px] text-[#5e5148] file:mr-2 file:rounded-md file:border-0 file:bg-white file:px-2 file:py-1 file:text-[10px] file:font-semibold"
          />
        </label>
      )}
    </div>
  );
}

const toProfile = (record) => {
  const bank = [record.bankName, record.accountNumber, record.ifscCode]
    .filter(Boolean)
    .join(' · ');
  const kycStatus =
    record.kyc === 'verified'
      ? 'KYC verified'
      : record.kyc === 'rejected'
        ? 'KYC rejected'
        : 'KYC pending';

  return {
    name: record.name,
    mobile: record.phone,
    code: record.email || '—',
    avatar: record.photo,
    kycStatus,
    stage: 'active',
    savingsBalance: formatINR(record.totalSaving),
    activePlansCount: 0,
    branch: record.branch || '—',
    address: [record.address, record.pinCode].filter(Boolean).join(', ') || '—',
    addressShort: record.address || '—',
    relationshipExecutive: record.executive || '—',
    pan: record.pan || '—',
    joined: formatDate(record.joiningDate),
    bankAccount: bank || '—',
    nominee: record.nominee
      ? `${record.nominee}${record.nomineeRelation ? ` (${record.nomineeRelation})` : ''}`
      : '—',
    savingsPlans: [],
    transactions: [],
    aadharDocument: record.aadharDocument || '',
    panDocument: record.panDocument || '',
    documents: [
      {
        id: 'aadhar',
        type: 'Aadhaar',
        number: record.aadhar || '—',
        url: record.aadharDocument || '',
        status: record.kyc === 'verified' ? 'Verified' : 'Pending',
        date: formatDate(record.updatedAt),
      },
      {
        id: 'pan',
        type: 'PAN',
        number: record.pan || '—',
        url: record.panDocument || '',
        status: record.kyc === 'verified' ? 'Verified' : 'Pending',
        date: formatDate(record.updatedAt),
      },
    ],
  };
};

export function Customer360Page() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [record, setRecord] = useState(null);
  const [agents, setAgents] = useState([]);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [docFiles, setDocFiles] = useState({ aadharDocument: null, panDocument: null });
  const [docPreviews, setDocPreviews] = useState({ aadharDocument: '', panDocument: '' });
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [pendingDelete, setPendingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [activeTab, setActiveTab] = useState('Savings');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setLoadError('Open a customer from Customer records.');
      return;
    }

    let active = true;

    customerService
      .getCustomer(id)
      .then((nextRecord) => {
        if (!active) return;
        const profile = toProfile(nextRecord);
        setRecord(nextRecord);
        setCustomer(profile);
        setMessageText(`Dear ${profile.name}, your CBSG savings account statement is ready.`);
      })
      .catch((error) => {
        if (active) setLoadError(error.message || 'Failed to load customer.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    customerService.getAgents().then(setAgents).catch(() => setAgents([]));
  }, []);

  const clearDocPreviews = () => {
    setDocPreviews((current) => {
      Object.values(current).forEach((url) => {
        if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
      });
      return { aadharDocument: '', panDocument: '' };
    });
    setDocFiles({ aadharDocument: null, panDocument: null });
  };

  const startEdit = () => {
    setDraft(draftFromRecord(record));
    setPhotoFile(null);
    clearDocPreviews();
    setEditError('');
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setDraft(null);
    setPhotoFile(null);
    clearDocPreviews();
    setEditError('');
  };

  const setDocFile = (key, file) => {
    setDocFiles((current) => ({ ...current, [key]: file }));
    setDocPreviews((current) => {
      if (current[key]?.startsWith('blob:')) URL.revokeObjectURL(current[key]);
      return { ...current, [key]: file ? URL.createObjectURL(file) : '' };
    });
  };

  const setField = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async () => {
    if (!draft?.name.trim() || !draft.phone.trim() || !draft.agentId) {
      setEditError('Name, phone, and executive are required.');
      return;
    }

    try {
      setSaving(true);
      setEditError('');
      const updated = await customerService.updateCustomer(
        id,
        {
          name: draft.name.trim(),
          phone: draft.phone.trim(),
          email: draft.email.trim(),
          agentId: draft.agentId,
          address: draft.address.trim(),
          aadhar: draft.aadhar.trim(),
          pan: draft.pan.trim().toUpperCase(),
          bankName: draft.bankName.trim(),
          accountNumber: draft.accountNumber.trim(),
          ifscCode: draft.ifscCode.trim().toUpperCase(),
          nominee: draft.nominee.trim(),
          nomineeRelation: draft.nomineeRelation.trim(),
        },
        {
          photo: photoFile,
          aadharDocument: docFiles.aadharDocument,
          panDocument: docFiles.panDocument,
        }
      );
      setRecord(updated);
      setCustomer(toProfile(updated));
      setEditing(false);
      setDraft(null);
      setPhotoFile(null);
      clearDocPreviews();
      notify.success('Customer updated.');
    } catch (error) {
      setEditError(error.message || 'Failed to update customer.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await customerService.deleteCustomer(id);
      notify.success('Customer deleted.');
      navigate(ROUTES.CUSTOMERS);
    } catch (error) {
      notify.error(error.message || 'Failed to delete customer.');
      setDeleting(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    setShowMessageModal(false);
    notify.success(`SMS & WhatsApp dispatch sent to ${customer.name} (${customer.mobile}).`);
  };

  if (loading || loadError || !customer) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center gap-2 py-24 text-sm text-[#7a6e67]">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading customer…
            </>
          ) : (
            loadError || 'Customer not found.'
          )}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Page Header: Title and Actions */}
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#241814]">
            Customer 360
          </h2>
          <p className="mt-0.5 text-xs text-[#7a6e67]">
            {customer.name}
          </p>
        </div>

        {/* Right Action Controls: Customer Picker + Message */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {editing ? (
            <>
              <button
                type="button"
                onClick={cancelEdit}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#f6f2e9] border border-[#ded8cb] text-xs font-medium text-[#2c1b15] transition-colors shadow-2xs cursor-pointer select-none disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2c1b15] hover:bg-[#1a0f0b] text-white text-xs font-medium transition-colors shadow-2xs cursor-pointer select-none disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={startEdit}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#f6f2e9] border border-[#ded8cb] text-xs font-medium text-[#2c1b15] transition-colors shadow-2xs cursor-pointer select-none"
            >
              <Pencil className="w-3.5 h-3.5 text-[#7a6e67]" />
              <span>Edit</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setPendingDelete(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 transition-colors shadow-2xs cursor-pointer select-none"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
          <button
            type="button"
            onClick={() => setShowMessageModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#f6f2e9] border border-[#ded8cb] text-xs font-medium text-[#2c1b15] transition-colors shadow-2xs cursor-pointer select-none"
          >
            <Mail className="w-3.5 h-3.5 text-[#7a6e67]" />
            <span>Message</span>
          </button>
        </div>
      </div>

      {/* 3. Main Customer Profile Card */}
      <div className={`bg-white rounded-2xl border p-6 shadow-2xs mb-6 ${editing ? 'border-[#c88a29]' : 'border-[#e8e2d5]'}`}>
        {editError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {editError}
          </div>
        )}
        {/* Top Profile Summary Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#f3efe6]">
          {/* Left Avatar & Identity */}
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="shrink-0">
              {customer.avatar ? (
                <img
                  src={customer.avatar}
                  alt={customer.name}
                  className="w-14 h-14 rounded-full object-cover border border-[#ded8cb]"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#2c1b15] text-[#cca04b] text-lg font-bold flex items-center justify-center">
                  {(customer.name || 'C').charAt(0).toUpperCase()}
                </div>
              )}
              {editing && (
                <label className="mt-2 block text-[10px] font-semibold text-[#8a7e75] cursor-pointer">
                  Photo
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) => setPhotoFile(event.target.files?.[0] || null)}
                    className="mt-1 block w-28 text-[10px] text-[#5e5148] file:mr-1 file:rounded-md file:border-0 file:bg-[#f6f2e9] file:px-1.5 file:py-1 file:text-[10px] file:font-semibold"
                  />
                </label>
              )}
            </div>
            <div className="min-w-0 flex-1">
              {editing ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    value={draft.name}
                    onChange={(event) => setField('name', event.target.value)}
                    placeholder="Name"
                    className={fieldClass}
                  />
                  <input
                    value={draft.phone}
                    onChange={(event) => setField('phone', event.target.value)}
                    placeholder="Phone"
                    className={`${fieldClass} font-mono`}
                  />
                  <input
                    type="email"
                    value={draft.email}
                    onChange={(event) => setField('email', event.target.value)}
                    placeholder="Email"
                    className={fieldClass}
                  />
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-[#2c1b15] leading-tight">
                    {customer.name}
                  </h3>
                  <p className="text-xs text-[#7a6e67] font-mono mt-0.5">
                    {customer.mobile} · {customer.code}
                  </p>
                </>
              )}
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#fef1db] text-[#b46500]">
                  {customer.kycStatus}
                </span>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#e7f7ed] text-[#0f7642]">
                  {customer.stage}
                </span>
              </div>
            </div>
          </div>

          {/* Right Metrics: Savings Balance & Active Plans */}
          <div className="flex items-center gap-8 self-start md:self-auto">
            <div>
              <span className="text-[11px] font-medium text-[#8a7e75] block">
                Savings balance
              </span>
              <span className="text-2xl font-extrabold text-[#2c1b15] font-mono tracking-tight">
                {customer.savingsBalance}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-medium text-[#8a7e75] block">
                Active plans
              </span>
              <span className="text-2xl font-extrabold text-[#2c1b15]">
                {customer.activePlansCount}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Metadata 4-Column Grid */}
        <div className="pt-6 grid grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-6 text-xs">
          <div>
            <span className="text-[10px] font-bold text-[#8a7e75] uppercase tracking-wider block mb-1">
              BRANCH
            </span>
            <span className="font-semibold text-[#2c1b15] block">
              {customer.branch}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-[#8a7e75] uppercase tracking-wider block mb-1">
              RELATIONSHIP EXECUTIVE
            </span>
            {editing ? (
              <select
                value={draft.agentId}
                onChange={(event) => setField('agentId', event.target.value)}
                className={fieldClass}
              >
                <option value="">Select executive</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                    {agent.employeeId ? ` · ${agent.employeeId}` : ''}
                  </option>
                ))}
              </select>
            ) : (
              <span className="font-semibold text-[#2c1b15] block">
                {customer.relationshipExecutive}
              </span>
            )}

            <span className="text-[10px] font-bold text-[#8a7e75] uppercase tracking-wider block mt-3 mb-1">
              PAN
            </span>
            {editing ? (
              <input
                value={draft.pan}
                onChange={(event) => setField('pan', event.target.value)}
                className={`${fieldClass} font-mono uppercase`}
              />
            ) : (
              <span className="font-semibold text-[#2c1b15] font-mono block">
                {customer.pan}
              </span>
            )}
          </div>

          <div>
            <span className="text-[10px] font-bold text-[#8a7e75] uppercase tracking-wider block mb-1">
              JOINED
            </span>
            <span className="font-semibold text-[#2c1b15] block">
              {customer.joined}
            </span>

            <span className="text-[10px] font-bold text-[#8a7e75] uppercase tracking-wider block mt-3 mb-1">
              BANK ACCOUNT
            </span>
            {editing ? (
              <div className="space-y-1.5">
                <input
                  value={draft.bankName}
                  onChange={(event) => setField('bankName', event.target.value)}
                  placeholder="Bank name"
                  className={fieldClass}
                />
                <input
                  value={draft.accountNumber}
                  onChange={(event) => setField('accountNumber', event.target.value)}
                  placeholder="Account number"
                  className={`${fieldClass} font-mono`}
                />
                <input
                  value={draft.ifscCode}
                  onChange={(event) => setField('ifscCode', event.target.value)}
                  placeholder="IFSC"
                  className={`${fieldClass} font-mono uppercase`}
                />
              </div>
            ) : (
              <span className="font-semibold text-[#2c1b15] block">
                {customer.bankAccount}
              </span>
            )}
          </div>

          <div>
            <span className="text-[10px] font-bold text-[#8a7e75] uppercase tracking-wider block mb-1">
              NOMINEE
            </span>
            {editing ? (
              <div className="space-y-1.5">
                <input
                  value={draft.nominee}
                  onChange={(event) => setField('nominee', event.target.value)}
                  placeholder="Nominee name"
                  className={fieldClass}
                />
                <input
                  value={draft.nomineeRelation}
                  onChange={(event) => setField('nomineeRelation', event.target.value)}
                  placeholder="Relation"
                  className={fieldClass}
                />
              </div>
            ) : (
              <span className="font-semibold text-[#2c1b15] block">
                {customer.nominee}
              </span>
            )}
          </div>
        </div>

        <div className="mt-6">
          <span className="text-[10px] font-bold text-[#8a7e75] uppercase tracking-wider block mb-1">
            ADDRESS
          </span>
          {editing ? (
            <textarea
              rows={4}
              value={draft.address}
              onChange={(event) => setField('address', event.target.value)}
              placeholder="House, street, area, city, pin code"
              className={`${fieldClass} min-h-28 resize-y leading-5`}
            />
          ) : (
            <p className="min-h-16 whitespace-pre-wrap font-semibold text-[#2c1b15] leading-5">
              {customer.addressShort}
            </p>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <IdentityDocument
            label="Aadhaar document"
            storedUrl={customer.aadharDocument}
            previewUrl={docPreviews.aadharDocument}
            file={docFiles.aadharDocument}
            editing={editing}
            onFile={(file) => setDocFile('aadharDocument', file)}
          >
            <div className="mt-2">
              <span className="text-[10px] font-bold text-[#8a7e75] uppercase tracking-wider block mb-1">
                Aadhaar number
              </span>
              {editing ? (
                <input
                  value={draft.aadhar}
                  onChange={(event) => setField('aadhar', event.target.value)}
                  placeholder="12 digit Aadhaar"
                  className={`${fieldClass} font-mono`}
                />
              ) : (
                <span className="font-semibold font-mono text-[#2c1b15]">
                  {record?.aadhar || '—'}
                </span>
              )}
            </div>
          </IdentityDocument>

          <IdentityDocument
            label="PAN document"
            storedUrl={customer.panDocument}
            previewUrl={docPreviews.panDocument}
            file={docFiles.panDocument}
            editing={editing}
            onFile={(file) => setDocFile('panDocument', file)}
          />
        </div>
      </div>

      {/* 4. Navigation Tabs */}
      <div className="mb-5">
        <div className="inline-flex p-1 bg-[#ede8de]/60 rounded-xl gap-1 text-xs font-semibold select-none">
          {['Savings', 'Transactions', 'KYC & documents'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-white text-[#2c1b15] shadow-2xs'
                  : 'text-[#70645c] hover:text-[#2c1b15]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Tab Content Panels */}
      {activeTab === 'Savings' && customer.savingsPlans.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#e8e2d5] p-8 text-center text-xs text-[#8a7e75]">
          No savings plans for this customer.
        </div>
      )}

      {activeTab === 'Savings' && customer.savingsPlans.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {customer.savingsPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-2xs"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-[#2c1b15]">
                    {plan.name}
                  </h4>
                  <p className="text-[11px] text-[#7a6e67] mt-0.5">
                    {plan.code} · since {plan.startDate}
                  </p>
                </div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#e7f7ed] text-[#0f7642]">
                  {plan.status}
                </span>
              </div>

              {/* 3 Metric Columns */}
              <div className="grid grid-cols-3 gap-2 pb-3 text-xs">
                <div>
                  <span className="text-[10px] font-medium text-[#8a7e75] block">
                    Savings
                  </span>
                  <span className="text-xs font-bold text-[#2c1b15] font-mono">
                    {plan.savings}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-medium text-[#8a7e75] block">
                    Goal
                  </span>
                  <span className="text-xs font-bold text-[#2c1b15] font-mono">
                    {plan.goal}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-medium text-[#8a7e75] block">
                    Progress
                  </span>
                  <span className="text-xs font-bold text-[#2c1b15]">
                    {plan.progress}%
                  </span>
                </div>
              </div>

              {/* Thin Progress Bar */}
              <div className="w-full bg-[#eee9df] rounded-full h-1.5 overflow-hidden mt-1">
                <div
                  className="bg-[#c88a29] h-1.5 rounded-full transition-all duration-700"
                  style={{ width: `${plan.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Transactions' && (
        <div className="bg-white rounded-2xl border border-[#e8e2d5] shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-[#f3efe6] flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#2c1b15]">
              Customer Transaction Ledger
            </h4>
            <span className="text-xs text-[#7a6e67] font-medium">
              {customer.transactions.length} records
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#f3efe6] text-[10.5px] uppercase tracking-wider text-[#968a80]">
                  <th className="py-3 px-4 font-semibold">DATE & TIME</th>
                  <th className="py-3 px-4 font-semibold">TYPE</th>
                  <th className="py-3 px-4 font-semibold">CHANNEL</th>
                  <th className="py-3 px-4 font-semibold">REFERENCE</th>
                  <th className="py-3 px-4 font-semibold">AMOUNT</th>
                  <th className="py-3 px-4 font-semibold text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f1e8]">
                {customer.transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-[#8a7e75]">
                      No transactions for this customer.
                    </td>
                  </tr>
                ) : customer.transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#faf7f0]/60 transition-colors">
                    <td className="py-2.5 px-4 text-[#7a6e67] font-mono text-[11px]">
                      {tx.time}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-[#2c1b15]">
                      {tx.type}
                    </td>
                    <td className="py-2.5 px-4 text-[#5e5148]">
                      {tx.by}
                    </td>
                    <td className="py-2.5 px-4 text-[#7a6e67] font-mono">
                      {tx.ref}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-[#2c1b15] font-mono">
                      {tx.amount}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e7f7ed] text-[#0f7642]">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'KYC & documents' && (
        <div className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-2xs">
          <h4 className="text-sm font-bold text-[#2c1b15] mb-4">
            Verified Documents & Regulatory Compliance
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {customer.documents.length === 0 && (
              <p className="text-xs text-[#8a7e75]">No documents on file.</p>
            )}
            {customer.documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-xl bg-[#f8f5ee] border border-[#e8e2d5] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <FileCheck2 className="w-5 h-5 text-[#c88a29]" />
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        doc.status === 'Verified'
                          ? 'bg-[#e7f7ed] text-[#0f7642]'
                          : 'bg-[#fef1db] text-[#b46500]'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                  <h5 className="font-bold text-xs text-[#2c1b15]">
                    {doc.type}
                  </h5>
                  <p className="text-[11px] text-[#7a6e67] font-mono mt-1">
                    {doc.number}
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-[#ede8de] text-[10px] text-[#8a7e75] flex items-center justify-between gap-2">
                  <span>Uploaded: {doc.date}</span>
                  {doc.url ? (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-[#2c1b15] hover:text-[#c88a29]"
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </a>
                  ) : (
                    <span>No file</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Send Message Modal Dialog */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#ded8cb]">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ebdF]">
              <h3 className="font-bold text-sm text-[#2c1b15]">
                Send Notification to {customer.name}
              </h3>
              <button
                type="button"
                onClick={() => setShowMessageModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="py-4 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-[#8a7e75] uppercase block mb-1">
                  Recipient Contact
                </label>
                <input
                  type="text"
                  disabled
                  value={`${customer.name} (${customer.mobile})`}
                  className="w-full bg-[#f8f5ee] border border-[#e8e2d5] rounded-xl px-3 py-2 text-xs text-[#2c1b15]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#8a7e75] uppercase block mb-1">
                  Message Content (SMS / WhatsApp)
                </label>
                <textarea
                  rows={4}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full bg-white border border-[#ded8cb] focus:border-[#c88a29] rounded-xl p-3 text-xs text-[#2c1b15] outline-none"
                  placeholder="Type message to client..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMessageModal(false)}
                  className="px-3 py-1.5 rounded-xl border border-[#ded8cb] text-xs font-semibold text-[#2c1b15] hover:bg-[#faf8f4] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#2c1b15] hover:bg-[#1a0f0b] text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  <Send className="w-3 h-3" />
                  <span>Send Notification</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-[#ded8cb]">
            <h3 className="text-sm font-bold text-[#2c1b15]">Delete customer</h3>
            <p className="mt-2 text-xs text-[#7a6e67]">
              Delete {customer.name}? This removes the customer record.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDelete(false)}
                disabled={deleting}
                className="px-3 py-1.5 rounded-xl border border-[#e8e2d5] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-3 py-1.5 rounded-xl bg-rose-700 text-white text-xs font-semibold"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Customer360Page;
