import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileCheck2,
  CreditCard,
  Building,
  CheckCircle,
  XCircle,
  User,
  MapPin,
  Landmark,
  UserCheck,
  Camera,
  Loader2,
  GripVertical,
} from 'lucide-react';
import { toast } from 'react-toastify';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import PageHeader from '../../../components/common/PageHeader';
import { mockKycQueueData, kycService } from '../services/kyc.service';
import { ROUTES } from '../../../utils/constants';

const SECTION_META = {
  personalDetails: { label: 'Personal Details', icon: User },
  address: { label: 'Address', icon: MapPin },
  aadhar: { label: 'Aadhaar', icon: FileCheck2 },
  pan: { label: 'PAN', icon: CreditCard },
  photo: { label: 'Photo', icon: Camera },
  bankAccount: { label: 'Bank Account', icon: Landmark },
  nominee: { label: 'Nominee', icon: UserCheck },
};

// Fields per section — matches backend kyc.model.js rejectedFields
const SECTION_FIELDS = {
  personalDetails: ['name', 'phone', 'fathersName', 'dob'],
  address: ['address', 'pinCode'],
  aadhar: ['aadhar', 'aadharDocument'],
  pan: ['pan', 'panDocument'],
  photo: [],
  bankAccount: ['bankName', 'accountNumber', 'ifscCode'],
  nominee: ['nomineeName', 'nomineeRelation'],
};

const STATUS_STYLES = {
  VERIFIED: 'bg-[#e7f7ed] text-[#0f7642]',
  APPROVED: 'bg-[#e7f7ed] text-[#0f7642]',
  REJECTED: 'bg-[#fee2e2] text-[#b91c1c]',
  PENDING: 'bg-[#fef1db] text-[#b46500]',
  IN_PROGRESS: 'bg-[#fef1db] text-[#b46500]',
  UNDER_REVIEW: 'bg-[#e0f2fe] text-[#0369a1]',
};

const statusLabel = (status) => {
  if (status === 'VERIFIED' || status === 'Approved') return 'Approved';
  if (status === 'REJECTED' || status === 'Rejected') return 'Rejected';
  if (!status || status === 'PENDING' || status === 'IN_PROGRESS' || status === 'Pending') {
    return 'Pending';
  }
  return status;
};

const KANBAN_COLUMNS = [
  {
    id: 'PENDING',
    title: 'Pending',
    hint: 'Waiting for review',
    header: 'bg-[#fef1db] text-[#b46500]',
  },
  {
    id: 'VERIFIED',
    title: 'Approved',
    hint: 'Verified sections',
    header: 'bg-[#e7f7ed] text-[#0f7642]',
  },
  {
    id: 'REJECTED',
    title: 'Rejected',
    hint: 'Needs a correction',
    header: 'bg-[#fee2e2] text-[#b91c1c]',
  },
];

const columnForStatus = (status) =>
  status === 'VERIFIED' || status === 'REJECTED' ? status : 'PENDING';

const isImageSrc = (src) => /\.(png|jpe?g|webp|gif)(\?|$)/i.test(src || '');

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

function DocumentThumb({ src, alt, onOpen, cover = false }) {
  if (!src) {
    return <p className="mt-3 text-[11px] text-[#8a7e75]">No file</p>;
  }

  const open = (event) => {
    event.stopPropagation();
    event.preventDefault();
    onOpen({ src, title: alt });
  };

  if (!isImageSrc(src)) {
    return (
      <button
        type="button"
        onMouseDown={(event) => event.stopPropagation()}
        onClick={open}
        className="mt-3 text-[11px] font-semibold text-[#2c1b15] underline cursor-pointer"
      >
        Open document
      </button>
    );
  }

  return (
    <button
      type="button"
      onMouseDown={(event) => event.stopPropagation()}
      onClick={open}
      className="mt-2 block w-full cursor-zoom-in"
    >
      <img
        src={src}
        alt={alt}
        className={`h-40 w-full rounded-lg border border-[#e8e2d5] ${cover ? 'object-cover' : 'object-contain bg-white'}`}
      />
    </button>
  );
}

const StatusBadge = ({ status }) => (
  <span
    className={`inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold ${
      STATUS_STYLES[status] || 'bg-stone-100 text-stone-600'
    }`}
  >
    {statusLabel(status)}
  </span>
);

export function KycReviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { record } = location.state || {};

  const isRealRecord = Boolean(record?.customerId);
  const [kyc, setKyc] = useState(null);
  const [loading, setLoading] = useState(isRealRecord);
  const [error, setError] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [sectionReasons, setSectionReasons] = useState({});
  const [rejectModalSection, setRejectModalSection] = useState(null);
  const [checkedFields, setCheckedFields] = useState({});
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draggingKey, setDraggingKey] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!record) {
      navigate(ROUTES.KYC_QUEUE, { replace: true });
      return;
    }

    if (isRealRecord) {
      kycService
        .getKycByCustomer(record.customerId)
        .then(setKyc)
        .catch((err) => setError(err.message || 'Failed to load KYC'))
        .finally(() => setLoading(false));
    }
  }, [record, isRealRecord, navigate]);

  const showToast = (msg, kind = 'success') => {
    if (kind === 'error') {
      toast.error(msg);
    } else {
      toast.success(msg);
    }
  };

  const goBack = () => navigate(ROUTES.KYC_QUEUE);

  // ---------- Real API actions ----------
  const approveAll = async () => {
    const anyRejected = Object.keys(SECTION_META).some(
      (key) => kyc?.[key]?.status === 'REJECTED'
    );
    if (anyRejected) return;

    setIsSubmitting(true);
    try {
      // Single backend call — approves all reviewable sections and sends
      // one customer notification (individual approves stay silent).
      const updated = await kycService.approveAllKyc(record.customerId);
      setKyc(updated);
      showToast('All KYC sections approved.');
      setTimeout(goBack, 1200);
    } catch (err) {
      showToast(err.message || 'Failed to approve KYC', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const approveSection = async (section) => {
    setIsSubmitting(true);
    try {
      const updated = await kycService.approveSection(
        record.customerId,
        section
      );
      setKyc(updated);
      showToast(`${SECTION_META[section].label} approved.`);
    } catch (err) {
      showToast(err.message || 'Failed to approve section', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openRejectModal = (section) => {
    setRejectModalSection(section);
    setSectionReasons((prev) => ({ ...prev, [section]: prev[section] || '' }));
    setCheckedFields({});
    setError('');
  };

  const closeRejectModal = () => {
    setRejectModalSection(null);
    setCheckedFields({});
  };

  const toggleField = (field) => {
    setCheckedFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const rejectOne = async (section) => {
    const reason = (sectionReasons[section] || '').trim();
    if (!reason) {
      showToast('Rejection reason is required.', 'error');
      return;
    }

    const rejectedFields = {};
    for (const field of SECTION_FIELDS[section] || []) {
      rejectedFields[field] = Boolean(checkedFields[field]);
    }

    setIsSubmitting(true);
    try {
      const updated = await kycService.rejectSection(
        record.customerId,
        section,
        { rejectionReason: reason, rejectedFields }
      );
      setKyc(updated);
      closeRejectModal();
      setSectionReasons((prev) => ({ ...prev, [section]: '' }));
      showToast(`${SECTION_META[section].label} rejected.`);
    } catch (err) {
      showToast(err.message || 'Failed to reject section', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const rejectEntire = async () => {
    const reason = rejectReason.trim();
    if (!reason) {
      showToast('Overall rejection reason is required.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const updated = await kycService.rejectAll(record.customerId, reason);
      setKyc(updated);
      setShowRejectForm(false);
      showToast('KYC rejected.');
      setTimeout(goBack, 1200);
    } catch (err) {
      showToast(err.message || 'Failed to reject KYC', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------- Mock-mode actions (mutate shared mock dataset) ----------
  const updateMockRecord = (patch) => {
    const target = mockKycQueueData.find((r) => r.id === record.id);
    if (target) Object.assign(target, patch);
  };

  const handleMockApprove = () => {
    updateMockRecord({ kycStatus: 'Approved', reviewReason: '—' });
    goBack();
  };

  const handleMockReject = () => {
    updateMockRecord({
      kycStatus: 'Rejected',
      reviewReason: rejectReason || 'Documentation needs correction.',
    });
    goBack();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-24 text-stone-500 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading KYC details…</span>
        </div>
      </DashboardLayout>
    );
  }

  const customerName = isRealRecord
    ? kyc?.customer?.name || record.name || record.customer
    : record.customer;
  const customerPhone = isRealRecord
    ? kyc?.customer?.phone || record.phone
    : record.phone;
  const customerEmail = isRealRecord ? kyc?.customer?.email : null;
  const overallStatus = isRealRecord ? kyc?.status : record.kycStatus;
  const isFinal = ['VERIFIED', 'REJECTED', 'Approved', 'Rejected'].includes(
    overallStatus
  );

  // Section-level gating: actions stay available until every section is
  // VERIFIED — a single rejected section must not freeze the rest.
  const sectionKeys = isRealRecord && kyc ? Object.keys(SECTION_META) : [];
  const allVerified =
    sectionKeys.length > 0 &&
    sectionKeys.every((key) => kyc[key]?.status === 'VERIFIED');
  const allRejected =
    sectionKeys.length > 0 &&
    sectionKeys.every((key) => kyc[key]?.status === 'REJECTED');

  // Button rules:
  // - any VERIFIED section  -> hide "Reject Entire KYC"
  // - any REJECTED section  -> disable "Approve All Sections"
  // - all verified/rejected -> everything hidden (above)
  const verifiedCount = sectionKeys.filter(
    (key) => kyc?.[key]?.status === 'VERIFIED'
  ).length;
  const rejectedCount = sectionKeys.filter(
    (key) => kyc?.[key]?.status === 'REJECTED'
  ).length;
  const hasVerified = verifiedCount > 0;
  const hasRejected = rejectedCount > 0;

  return (
    <DashboardLayout>
      <PageHeader
        crumbs={['Home', 'Customers', 'KYC Review']}
        title="KYC Review"
        subtitle={`${customerName} · ${customerPhone}${customerEmail ? ` · ${customerEmail}` : ''}`}
        actions={
          <>
            <button
              type="button"
              onClick={goBack}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-medium transition-colors backdrop-blur-sm cursor-pointer select-none"
              aria-label="Back to KYC queue"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            {isRealRecord && kyc && !allVerified && (
              <button
                type="button"
                disabled={isSubmitting || hasRejected}
                title={hasRejected ? 'Resolve rejected sections first' : undefined}
                onClick={approveAll}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/90 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                {isSubmitting ? 'Processing…' : 'Approve All Sections'}
              </button>
            )}
          </>
        }
        className="mb-4"
      />
      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
          {error}
          <button
            type="button"
            className="ml-2 underline"
            onClick={() => setError('')}
          >
            Dismiss
          </button>
        </div>
      )}

      <div className={isRealRecord ? 'flex h-[calc(100vh-7.5rem)] min-h-0 flex-col' : ''}>
      {/* Status row */}
      <div className="mb-4 flex shrink-0 items-center justify-end">
        <StatusBadge status={isRealRecord ? overallStatus : record.kycStatus} />
      </div>

      {/* ===== Real API mode: section kanban ===== */}
      {isRealRecord && kyc && (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="mb-3 shrink-0">
            <h3 className="text-sm font-bold text-[#2c1b15]">KYC sections</h3>
            <p className="text-[11px] text-[#7a6e67] mt-0.5">
              Scroll inside Pending, Approved, or Rejected. Only that column moves.
            </p>
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-1">
            {KANBAN_COLUMNS.map((column) => {
              const cards = Object.entries(SECTION_META).filter(
                ([key]) => columnForStatus(kyc[key]?.status) === column.id
              );

              return (
                <div
                  key={column.id}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragOverColumn(column.id);
                  }}
                  onDragLeave={() =>
                    setDragOverColumn((current) => (current === column.id ? null : current))
                  }
                  onDrop={(event) => {
                    event.preventDefault();
                    const key = draggingKey;
                    setDraggingKey(null);
                    setDragOverColumn(null);
                    if (!key || isSubmitting) return;
                    const current = columnForStatus(kyc[key]?.status);
                    if (current === column.id) return;
                    if (column.id === 'VERIFIED') approveSection(key);
                    else if (column.id === 'REJECTED') openRejectModal(key);
                    else showToast('Approve or reject a section to move it.', 'error');
                  }}
                  className={`flex min-h-0 h-full w-full flex-col overflow-hidden rounded-2xl border bg-[#f7f3ea] ${
                    dragOverColumn === column.id
                      ? 'border-[#c88a29] ring-2 ring-[#c88a29]/30'
                      : 'border-[#e8e2d5]'
                  }`}
                >
                  <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[#efe6d8] px-3 py-3">
                    <div>
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${column.header}`}>
                        {column.title}
                      </span>
                      <p className="mt-1 text-[10px] text-[#8a7e75]">{column.hint}</p>
                    </div>
                    <span className="text-sm font-bold text-[#2c1b15]">{cards.length}</span>
                  </div>
                  <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-y-contain p-3">
                    {cards.length === 0 && (
                      <div className="flex h-full min-h-[140px] items-center justify-center rounded-xl border border-dashed border-[#e0d8cb] text-[11px] text-[#8a7e75]">
                        No sections
                      </div>
                    )}
                    {cards.map(([key, meta]) => {
                      const section = kyc[key] || {};
                      const Icon = meta.icon;
                      const customer = kyc.customer || {};
                      const showApprove = !isSubmitting && section.status !== 'VERIFIED';
                      const showReject = !isSubmitting;

                      return (
                        <div
                          key={key}
                          draggable={showReject || showApprove}
                          onDragStart={() => setDraggingKey(key)}
                          onDragEnd={() => {
                            setDraggingKey(null);
                            setDragOverColumn(null);
                          }}
                          className={`shrink-0 rounded-2xl border border-[#efe8dc] bg-white shadow-[0_8px_20px_rgba(44,27,21,0.04)] ${
                            showReject || showApprove ? 'cursor-grab active:cursor-grabbing' : ''
                          } ${draggingKey === key ? 'opacity-50' : ''}`}
                        >
                          <div className="flex items-start gap-2.5 px-3.5 pt-3.5">
                            {(showReject || showApprove) && (
                              <GripVertical className="mt-1.5 h-3.5 w-3.5 shrink-0 text-[#c9bfb2]" />
                            )}
                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#f6f1e6] text-[#c88a29]">
                              <Icon className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[13px] font-bold text-[#2c1b15]">{meta.label}</span>
                                <StatusBadge status={section.status} />
                              </div>
                              {section.rejectionReason && (
                                <p className="mt-1.5 rounded-lg bg-rose-50 px-2 py-1 text-[11px] leading-4 text-rose-700">
                                  {section.rejectionReason}
                                </p>
                              )}
                            </div>
                          </div>
                          {key === 'personalDetails' && (
                            <div className="mx-3.5 mt-3 grid grid-cols-2 gap-2 rounded-xl bg-[#faf7f2] p-2.5 text-[11px]">
                              <p><span className="block text-[10px] uppercase tracking-wide text-[#8a7e75]">Name</span>{customer.name || '—'}</p>
                              <p><span className="block text-[10px] uppercase tracking-wide text-[#8a7e75]">Phone</span><span className="font-mono">{customer.phone || '—'}</span></p>
                              <p><span className="block text-[10px] uppercase tracking-wide text-[#8a7e75]">Father</span>{customer.fathersName || '—'}</p>
                              <p><span className="block text-[10px] uppercase tracking-wide text-[#8a7e75]">DOB</span>{customer.dob ? formatDate(customer.dob) : '—'}</p>
                            </div>
                          )}
                          {key === 'address' && (
                            <p className="mx-3.5 mt-3 whitespace-pre-wrap rounded-xl bg-[#faf7f2] p-2.5 text-[11px] leading-5 text-[#2c1b15]">
                              {[customer.address, customer.pinCode].filter(Boolean).join(', ') || '—'}
                            </p>
                          )}
                          {key === 'aadhar' && (
                            <div className="mx-3.5 mt-3 rounded-xl bg-[#faf7f2] p-2.5">
                              <p className="font-mono text-[11px] font-semibold text-[#2c1b15]">
                                {customer.aadhar || '—'}
                              </p>
                              <DocumentThumb
                                src={customer.aadharDocument}
                                alt="Aadhaar document"
                                onOpen={setPreview}
                              />
                            </div>
                          )}
                          {key === 'pan' && (
                            <div className="mx-3.5 mt-3 rounded-xl bg-[#faf7f2] p-2.5">
                              <p className="font-mono text-[11px] font-semibold text-[#2c1b15]">
                                {customer.pan || '—'}
                              </p>
                              <DocumentThumb
                                src={customer.panDocument}
                                alt="PAN document"
                                onOpen={setPreview}
                              />
                            </div>
                          )}
                          {key === 'photo' && (
                            <div className="mx-3.5 mt-3 rounded-xl bg-[#faf7f2] p-2.5">
                              <DocumentThumb
                                src={customer.photo}
                                alt={customer.name || 'Customer photo'}
                                onOpen={setPreview}
                                cover
                              />
                            </div>
                          )}
                          {key === 'bankAccount' && (
                            <div className="mx-3.5 mt-3 space-y-1 rounded-xl bg-[#faf7f2] p-2.5 text-[11px] text-[#2c1b15]">
                              <p>
                                <span className="text-[#8a7e75]">Bank </span>
                                {customer.bankName || '—'}
                              </p>
                              <p className="font-mono">{customer.accountNumber || '—'}</p>
                              <p className="font-mono">{customer.ifscCode || '—'}</p>
                            </div>
                          )}
                          {key === 'nominee' && (
                            <p className="mx-3.5 mt-3 rounded-xl bg-[#faf7f2] p-2.5 text-xs font-semibold text-[#2c1b15]">
                              {customer.nominee || '—'}
                              {customer.nomineeRelation ? ` (${customer.nomineeRelation})` : ''}
                            </p>
                          )}
                          {(showApprove || showReject) && (
                            <div className="mt-3 flex justify-end gap-2 border-t border-[#f3eee6] px-3.5 py-2.5">
                              {showApprove && (
                                <button
                                  type="button"
                                  disabled={isSubmitting}
                                  onClick={() => approveSection(key)}
                                  className="cursor-pointer rounded-lg bg-emerald-700 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
                                >
                                  Approve
                                </button>
                              )}
                              {showReject && (
                                <button
                                  type="button"
                                  disabled={isSubmitting}
                                  onClick={() => openRejectModal(key)}
                                  className="cursor-pointer rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {isRealRecord && !allVerified && !allRejected && !hasVerified && (
            <div className="mt-3 shrink-0 rounded-2xl border border-[#e8e2d5] bg-white p-3 shadow-2xs">
              {!showRejectForm ? (
                <button
                  type="button"
                  onClick={() => setShowRejectForm(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-semibold cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Reject Entire KYC
                </button>
              ) : (
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#2c1b15] block">
                    Overall rejection reason
                  </label>
                  <textarea
                    rows={2}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="e.g. Documents do not match the registered details…"
                    className="w-full bg-white border border-[#ded8cb] rounded-lg p-2.5 text-xs text-[#2c1b15] outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowRejectForm(false)}
                      className="px-3 py-1.5 text-xs text-[#7a6e67] hover:text-[#2c1b15]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={rejectEntire}
                      className="px-4 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 disabled:opacity-50"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ===== Mock mode / document details ===== */}
      {!isRealRecord && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div className="bg-white rounded-2xl border border-[#e8e2d5] p-4 shadow-2xs">
              <span className="text-[10px] text-[#8a7e75] uppercase font-semibold block mb-1">
                PAN Number
              </span>
              <span className="font-mono font-bold text-[#2c1b15]">
                {record.panNumber}
              </span>
            </div>
            <div className="bg-white rounded-2xl border border-[#e8e2d5] p-4 shadow-2xs">
              <span className="text-[10px] text-[#8a7e75] uppercase font-semibold block mb-1">
                Aadhaar
              </span>
              <span className="font-mono font-bold text-[#2c1b15]">
                {record.aadhaarNumber}
              </span>
            </div>
            <div className="bg-white rounded-2xl border border-[#e8e2d5] p-4 shadow-2xs">
              <span className="text-[10px] text-[#8a7e75] uppercase font-semibold block mb-1">
                Bank Account
              </span>
              <span className="font-semibold text-[#2c1b15]">
                {record.bankAccount}
              </span>
            </div>
          </div>

          {/* Verification trail */}
          <div className="bg-white rounded-2xl border border-[#e8e2d5] shadow-2xs p-5 mb-5 space-y-2.5">
            <h4 className="font-bold text-[#2c1b15] text-xs uppercase tracking-wider text-[10px]">
              Document Verification Trail
            </h4>
            {[
              {
                icon: FileCheck2,
                title: 'Aadhaar Offline XML / e-KYC',
                sub: record.aadhaarNumber,
                badge: 'UIDAI Verified',
                badgeStyle: 'text-emerald-800 bg-emerald-100',
              },
              {
                icon: CreditCard,
                title: 'Income Tax PAN Verification',
                sub: record.panNumber,
                badge: 'NSDL Active',
                badgeStyle: 'text-emerald-800 bg-emerald-100',
              },
              {
                icon: Building,
                title: 'Bank Account Penny Drop Check',
                sub: record.bankAccount,
                badge:
                  record.kycStatus === 'Rejected'
                    ? 'Name Mismatch'
                    : record.kycStatus === 'Approved'
                    ? 'Penny Drop Verified'
                    : 'Audit Pending',
                badgeStyle:
                  record.kycStatus === 'Rejected'
                    ? 'text-rose-800 bg-rose-100'
                    : record.kycStatus === 'Approved'
                    ? 'text-emerald-800 bg-emerald-100'
                    : 'text-amber-800 bg-amber-100',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-3 bg-[#f8f5ee] rounded-xl border border-[#e8e2d5] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-[#c88a29]" />
                  <div>
                    <span className="font-bold text-[#2c1b15] block">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-[#7a6e67] font-mono">
                      {item.sub}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${item.badgeStyle}`}
                >
                  {item.badge}
                </span>
              </div>
            ))}
          </div>

          {record.reviewReason && record.reviewReason !== '—' && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs mb-5">
              <span className="font-bold block mb-0.5">
                Audit Exception Reason:
              </span>
              <span>{record.reviewReason}</span>
            </div>
          )}
        </>
      )}

      {!isRealRecord && !isFinal && (
        <div className="flex items-center justify-end gap-3 pb-4">
          <button
            type="button"
            onClick={handleMockApprove}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold cursor-pointer shadow-2xs"
          >
            <CheckCircle className="w-4 h-4" />
            Approve KYC
          </button>
        </div>
      )}

      {/* Mock reject form */}
      {!isRealRecord && !isFinal && (
        <div className="pb-6">
          {!showRejectForm ? (
            <button
              type="button"
              onClick={() => setShowRejectForm(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-semibold cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              Reject KYC
            </button>
          ) : (
            <div className="p-4 bg-white rounded-2xl border border-[#e8e2d5] shadow-2xs space-y-2 max-w-xl">
              <label className="text-[11px] font-bold text-[#2c1b15] block">
                Specify Rejection Reason (Notified to Customer)
              </label>
              <textarea
                rows={2}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Identity: Name mismatch between Aadhaar and PAN…"
                className="w-full bg-white border border-[#ded8cb] rounded-lg p-2 text-xs text-[#2c1b15] outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRejectForm(false)}
                  className="px-3 py-1.5 text-xs text-[#7a6e67] hover:text-[#2c1b15]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleMockReject}
                  className="px-4 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      </div>

      {/* ===== Section Reject Popup (fields + mandatory reason) ===== */}
      {rejectModalSection && isRealRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#e8e2d5] shadow-2xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-[#f2ede4] flex items-center justify-between bg-[#faf8f4]">
              <div>
                <h3 className="text-sm font-bold text-[#2c1b15]">
                  Reject {SECTION_META[rejectModalSection]?.label}
                </h3>
                <p className="text-[11px] text-[#8f8278] mt-0.5">
                  Send one message to the customer.
                </p>
              </div>
              <button
                type="button"
                onClick={closeRejectModal}
                className="p-1.5 rounded-lg text-[#8f8278] hover:text-[#2c1b15] hover:bg-[#ede7dc] cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 text-xs">
              <label className="text-[11px] font-bold text-[#2c1b15] block mb-1">
                Message
              </label>
              <textarea
                rows={4}
                value={sectionReasons[rejectModalSection] || ''}
                onChange={(e) =>
                  setSectionReasons((prev) => ({
                    ...prev,
                    [rejectModalSection]: e.target.value,
                  }))
                }
                placeholder="Write the message for the customer…"
                className="w-full bg-white border border-[#ded8cb] rounded-lg p-2.5 text-xs text-[#2c1b15] outline-none focus:border-rose-400"
              />
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-[#f2ede4] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={closeRejectModal}
                className="px-4 py-2 border border-[#e8e2d5] rounded-xl text-xs font-semibold text-[#61554d] hover:bg-[#faf7f2] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={
                  isSubmitting ||
                  !(sectionReasons[rejectModalSection] || '').trim()
                }
                onClick={() => rejectOne(rejectModalSection)}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending…' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}

      {preview && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-950/80 p-6"
          onClick={() => setPreview(null)}
        >
          <button
            type="button"
            onClick={() => setPreview(null)}
            className="absolute right-5 top-5 text-sm font-semibold text-white"
          >
            Close
          </button>
          {isImageSrc(preview.src) ? (
            <img
              src={preview.src}
              alt={preview.title}
              className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain"
              onClick={(event) => event.stopPropagation()}
            />
          ) : (
            <iframe
              title={preview.title}
              src={preview.src}
              className="h-[85vh] w-[min(900px,90vw)] rounded-xl bg-white"
              onClick={(event) => event.stopPropagation()}
            />
          )}
        </div>
      )}
    </DashboardLayout>
  );
}

export default KycReviewPage;
