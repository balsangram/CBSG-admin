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
} from 'lucide-react';
import { toast } from 'react-toastify';
import DashboardLayout from '../../../components/layout/DashboardLayout';
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

const FIELD_LABELS = {
  name: 'Full Name',
  phone: 'Phone',
  fathersName: "Father's Name",
  dob: 'Date of Birth',
  address: 'Address',
  pinCode: 'PIN Code',
  aadhar: 'Aadhaar Number',
  aadharDocument: 'Aadhaar Document',
  pan: 'PAN Number',
  panDocument: 'PAN Document',
  bankName: 'Bank Name',
  accountNumber: 'Account Number',
  ifscCode: 'IFSC Code',
  nomineeName: 'Nominee Name',
  nomineeRelation: 'Nominee Relation',
};

const STATUS_STYLES = {
  VERIFIED: 'bg-[#e7f7ed] text-[#0f7642]',
  APPROVED: 'bg-[#e7f7ed] text-[#0f7642]',
  REJECTED: 'bg-[#fee2e2] text-[#b91c1c]',
  PENDING: 'bg-[#fef1db] text-[#b46500]',
  IN_PROGRESS: 'bg-[#fef1db] text-[#b46500]',
  UNDER_REVIEW: 'bg-[#e0f2fe] text-[#0369a1]',
};

const statusLabel = (status) =>
  status === 'VERIFIED' ? 'Approved' : status === 'REJECTED' ? 'Rejected' : status;

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

      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goBack}
            className="p-2 rounded-xl border border-[#ded8cb] text-[#5e5148] hover:bg-[#faf8f4] cursor-pointer"
            aria-label="Back to KYC queue"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#241814]">
              KYC Review
            </h2>
            <p className="mt-0.5 text-xs text-[#7a6e67]">
              {customerName} · {customerPhone}
              {customerEmail ? ` · ${customerEmail}` : ''}
            </p>
          </div>
        </div>
        <StatusBadge status={isRealRecord ? overallStatus : record.kycStatus} />
      </div>

      {/* Customer summary card */}
      <div className="bg-white rounded-2xl border border-[#e8e2d5] shadow-2xs p-5 mb-5">
        <div className="flex items-center gap-4">
          {record.avatar ? (
            <img
              src={record.avatar}
              alt={customerName}
              className="w-14 h-14 rounded-full object-cover border border-[#ded8cb]"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#f0ebdf] flex items-center justify-center text-[#7a6e67]">
              <User className="w-6 h-6" />
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-2 text-xs flex-1">
            <div>
              <span className="text-[10px] text-[#8a7e75] uppercase block font-semibold">
                Phone
              </span>
              <span className="font-semibold text-[#2c1b15] font-mono">
                {customerPhone}
              </span>
            </div>
            {record.branch && (
              <div>
                <span className="text-[10px] text-[#8a7e75] uppercase block font-semibold">
                  Branch
                </span>
                <span className="font-semibold text-[#2c1b15]">
                  {record.branch}
                </span>
              </div>
            )}
            {record.submittedDate && (
              <div>
                <span className="text-[10px] text-[#8a7e75] uppercase block font-semibold">
                  Submitted
                </span>
                <span className="font-semibold text-[#2c1b15]">
                  {record.submittedDate}
                </span>
              </div>
            )}
            {record.submissionType && (
              <div>
                <span className="text-[10px] text-[#8a7e75] uppercase block font-semibold">
                  Channel
                </span>
                <span className="font-semibold text-[#2c1b15]">
                  {record.submissionType}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== Real API mode: section-wise review ===== */}
      {isRealRecord && kyc && (
        <div className="bg-white rounded-2xl border border-[#e8e2d5] shadow-2xs overflow-hidden mb-5">
          <div className="px-5 py-4 border-b border-[#f3efe6]">
            <h3 className="text-sm font-bold text-[#2c1b15]">
              KYC Sections
            </h3>
            <p className="text-[11px] text-[#7a6e67] mt-0.5">
              Review each section individually or reject the entire KYC.
            </p>
          </div>
          <div className="divide-y divide-[#f5f1e8]">
            {Object.entries(SECTION_META).map(([key, meta]) => {
              const section = kyc[key] || {};
              const Icon = meta.icon;

              return (
                <div key={key} className="px-5 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className="w-4 h-4 text-[#c88a29] shrink-0" />
                      <div className="min-w-0">
                        <span className="font-bold text-[#2c1b15] block text-xs">
                          {meta.label}
                        </span>
                        {section.rejectionReason && (
                          <span className="text-[11px] text-rose-600 block truncate">
                            {section.rejectionReason}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={section.status} />
                      {!allVerified && section.status !== 'VERIFIED' && (
                        <>
                          <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => approveSection(key)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white text-[11px] font-semibold hover:bg-emerald-800 disabled:opacity-50 cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => openRejectModal(key)}
                            className="px-2.5 py-1 rounded-lg border border-rose-200 text-rose-700 bg-rose-50 text-[11px] font-semibold hover:bg-rose-100 disabled:opacity-50 cursor-pointer"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
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

      {/* Reject entire KYC (real mode) — hidden once any section is approved */}
      {isRealRecord && !allVerified && !allRejected && !hasVerified && (
        <div className="bg-white rounded-2xl border border-[#e8e2d5] shadow-2xs p-5 mb-5">
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
            <div className="space-y-2 animate-fadeIn">
              <label className="text-[11px] font-bold text-[#2c1b15] block">
                Overall rejection reason (notified to customer)
              </label>
              <textarea
                rows={3}
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

      {/* Footer actions */}
      {(isRealRecord ? !allVerified : !isFinal) && (
        <div className="flex items-center justify-end gap-3 pb-4">
          {isRealRecord ? (
            <button
              type="button"
              disabled={isSubmitting || hasRejected}
              title={hasRejected ? 'Resolve rejected sections first' : undefined}
              onClick={approveAll}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold cursor-pointer shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-4 h-4" />
              {isSubmitting ? 'Processing…' : 'Approve All Sections'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleMockApprove}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold cursor-pointer shadow-2xs"
            >
              <CheckCircle className="w-4 h-4" />
              Approve KYC
            </button>
          )}
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
                  Select the fields to flag and provide a reason.
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
            <div className="p-5 space-y-4 text-xs">
              {/* Field checkboxes */}
              {(SECTION_FIELDS[rejectModalSection] || []).length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-[#2c1b15] block mb-2">
                    Flagged fields
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {SECTION_FIELDS[rejectModalSection].map((field) => (
                      <label
                        key={field}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-colors ${
                          checkedFields[field]
                            ? 'border-rose-300 bg-rose-50'
                            : 'border-[#e8e2d5] bg-white hover:border-[#c8bfb0]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={Boolean(checkedFields[field])}
                          onChange={() => toggleField(field)}
                          className="w-3.5 h-3.5 accent-rose-600"
                        />
                        <span className="text-[#2c1b15] font-medium">
                          {FIELD_LABELS[field] || field}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Mandatory reason */}
              <div>
                <label className="text-[11px] font-bold text-[#2c1b15] block mb-1">
                  Rejection reason <span className="text-rose-600">*</span>
                </label>
                <textarea
                  rows={3}
                  value={sectionReasons[rejectModalSection] || ''}
                  onChange={(e) =>
                    setSectionReasons((prev) => ({
                      ...prev,
                      [rejectModalSection]: e.target.value,
                    }))
                  }
                  placeholder="e.g. Document is blurry, details do not match…"
                  className="w-full bg-white border border-[#ded8cb] rounded-lg p-2.5 text-xs text-[#2c1b15] outline-none focus:border-rose-400"
                />
              </div>
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
                {isSubmitting ? 'Rejecting…' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default KycReviewPage;
