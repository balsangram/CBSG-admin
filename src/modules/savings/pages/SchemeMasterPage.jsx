import React, { useEffect, useState } from 'react';
import {
  Copy,
  Plus,
  RotateCcw,
  X,
  ExternalLink,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { toast } from 'react-toastify';
import {
  initialSchemeConfig,
  publishedSchemes,
  savingsService,
} from '../services/savings.service';

// Map backend plan DTO -> form state
const planToScheme = (plan) => ({
  id: plan.id,
  name: plan.schemeName || '',
  planType: plan.planType || '',
  minInvestment: plan.minimumInvestmentAmount ?? 0,
  payout: plan.payout ?? '',
  monthlyInterest: plan.monthlyInterest ?? 0,
  monthlyInterestDate: plan.monthlyInterestDate
    ? String(plan.monthlyInterestDate).slice(0, 10)
    : '',
  preClosureRule: plan.preClosureRule || '',
  isLive: plan.status === 'PUBLISHED' || plan.isActive,
  rules: (plan.planRules || []).map((r, i) => ({
    id: `rule-${i}`,
    name: r.ruleName || '',
    description: r.description || '',
  })),
});

// Map form state -> backend payload
const schemeToPayload = (scheme) => ({
  schemeName: scheme.name,
  planType: scheme.planType,
  minimumInvestmentAmount: Number(scheme.minInvestment),
  payout: Number(scheme.payout),
  monthlyInterest: Number(scheme.monthlyInterest),
  monthlyInterestDate: scheme.monthlyInterestDate || null,
  preClosureRule: scheme.preClosureRule || '',
  status: scheme.isLive ? 'PUBLISHED' : 'DRAFT',
  planRules: (scheme.rules || []).map((r) => ({
    ruleName: r.name,
    description: r.description,
  })),
});

const EMPTY_SCHEME = {
  name: 'New Custom Savings Plan',
  planType: 'MIP',
  minInvestment: 500,
  payout: 180,
  monthlyInterest: 1.2,
  monthlyInterestDate: '',
  preClosureRule: '',
  isLive: false,
  rules: [
    {
      id: 'rule-new-1',
      name: 'Eligibility',
      description: 'Resident Indian individuals aged 18+',
    },
  ],
};

export function SchemeMasterPage() {
  const [scheme, setScheme] = useState(initialSchemeConfig);
  const [planId, setPlanId] = useState(null);
  const [hasPlan, setHasPlan] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [saving, setSaving] = useState(false);
  const [calculatorSavings, setCalculatorSavings] = useState(100);
  const [showSignedInAlert, setShowSignedInAlert] = useState(true);
  const [showPublishedModal, setShowPublishedModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [livePlans, setLivePlans] = useState([]);

  // Load the single plan (if any) on mount
  useEffect(() => {
    let cancelled = false;
    savingsService
      .getPlans()
      .then((plans) => {
        if (cancelled) return;
        setLivePlans(plans);
        if (plans.length > 0) {
          const plan = plans[0];
          setPlanId(plan.id);
          setScheme(planToScheme(plan));
          setHasPlan(true);
        } else {
          setScheme(EMPTY_SCHEME);
        }
      })
      .catch(() => {
        if (!cancelled) setScheme(EMPTY_SCHEME);
      })
      .finally(() => {
        if (!cancelled) setLoadingPlan(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const showToast = (msg, kind = 'success') => {
    if (kind === 'error') {
      toast.error(msg);
    } else {
      toast.success(msg);
    }
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Calculate monthly interest earned
  const monthlyInterestEarned = ((calculatorSavings * (scheme.monthlyInterest || 1)) / 100).toFixed(2);

  // Field change handler
  const handleFieldChange = (field, value) => {
    setScheme((prev) => ({ ...prev, [field]: value }));
  };

  // Rule modification
  const handleRuleChange = (index, field, value) => {
    const updated = [...scheme.rules];
    updated[index][field] = value;
    setScheme((prev) => ({ ...prev, rules: updated }));
  };

  const handleAddRule = () => {
    const newRule = {
      id: `rule-${Date.now()}`,
      name: 'New Rule',
      description: 'Enter rule details...',
    };
    setScheme((prev) => ({ ...prev, rules: [...prev.rules, newRule] }));
  };

  const handleRemoveRule = (index) => {
    setScheme((prev) => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index),
    }));
  };

  const handleReset = async () => {
    if (planId) {
      try {
        const plans = await savingsService.getPlans();
        const plan = plans.find((p) => p.id === planId);
        if (plan) {
          setScheme(planToScheme(plan));
          showToast('Scheme configuration reloaded.');
          return;
        }
      } catch {
        // fall through to local reset
      }
    }
    setScheme(hasPlan ? EMPTY_SCHEME : initialSchemeConfig);
    showToast('Scheme configuration reset to defaults.');
  };

  const handleDuplicate = () => {
    setScheme((prev) => ({
      ...prev,
      name: `${prev.name} (Copy)`,
      isLive: false,
    }));
    showToast('Scheme duplicated. Ready for customization.');
  };

  // Only one plan may exist — "New scheme" is disabled once one is created
  const handleNewScheme = () => {
    if (hasPlan) {
      showToast('Only one plan can exist. Edit the current plan instead.', 'error');
      return;
    }
    setScheme({ ...EMPTY_SCHEME });
    setPlanId(null);
    showToast('New draft scheme initialized.');
  };

  const handleSave = async () => {
    if (!scheme.name?.trim()) {
      showToast('Scheme name is required.', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = schemeToPayload(scheme);
      const saved = planId
        ? await savingsService.updatePlan(planId, payload)
        : await savingsService.createPlan(payload);
      const mapped = planToScheme(saved);
      setScheme(mapped);
      setPlanId(saved.id);
      setHasPlan(true);
      setLivePlans((prev) => {
        const rest = prev.filter((p) => p.id !== saved.id);
        return [saved, ...rest];
      });
      showToast(planId ? 'Scheme updated successfully.' : 'Scheme created successfully.');
    } catch (err) {
      showToast(err.message || 'Failed to save scheme.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      {/* 1. Signed in status notification banner */}
      {showSignedInAlert && (
        <div className="mb-4 py-2 px-3.5 bg-white/70 border border-[#e8e2d5] rounded-xl flex items-center justify-between text-xs text-[#2c1b15] shadow-2xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">
              ✓
            </span>
            <span className="font-medium">Signed in</span>
          </div>
          <button
            type="button"
            onClick={() => setShowSignedInAlert(false)}
            className="text-[#968a80] hover:text-[#2c1b15] p-1 cursor-pointer"
            aria-label="Dismiss signed in alert"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Global Toast */}
      {toastMessage && (
        <div className="mb-4 py-2.5 px-4 bg-[#e7f7ed] border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage('')}
            className="text-emerald-800 hover:text-emerald-950 ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Page Header & Actions */}
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#241814]">
            Savings scheme master
          </h2>
          <p className="mt-0.5 text-xs text-[#7a6e67]">
            {scheme.name}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowPublishedModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#f6f2e9] border border-[#ded8cb] text-xs font-medium text-[#2c1b15] transition-colors shadow-2xs cursor-pointer select-none"
          >
            <ExternalLink className="w-3 h-3 text-[#7a6e67]" />
            <span>View Published Schemes</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#7a6e67] hover:text-[#2c1b15] cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleDuplicate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#f6f2e9] border border-[#ded8cb] text-xs font-medium text-[#2c1b15] transition-colors shadow-2xs cursor-pointer select-none"
          >
            <Copy className="w-3 h-3 text-[#7a6e67]" />
            <span>Duplicate</span>
          </button>

          <button
            type="button"
            onClick={handleNewScheme}
            disabled={hasPlan || loadingPlan}
            title={hasPlan ? 'Only one plan can exist — edit the current one' : undefined}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#2c1b15] hover:bg-[#1a0f0b] text-white text-xs font-medium transition-colors shadow-2xs cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New scheme</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loadingPlan}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#c88a29] hover:bg-[#b57a1f] text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            <span>{saving ? 'Saving…' : planId ? 'Save changes' : 'Create plan'}</span>
          </button>
        </div>
      </div>

      {/* 3. 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ================= LEFT COLUMN: Configuration Form ================= */}
        <div className="lg:col-span-7 space-y-5">
          {/* Card 1: Scheme Configuration */}
          <div className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#f3efe6] mb-4">
              <h4 className="text-sm font-bold text-[#2c1b15]">
                Scheme configuration
              </h4>

              {/* Live Toggle */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleFieldChange('isLive', !scheme.isLive)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    scheme.isLive ? 'bg-[#c88a29]' : 'bg-stone-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      scheme.isLive ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-xs font-semibold text-[#2c1b15]">Live</span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 text-xs">
              {/* Scheme name */}
              <div>
                <label className="block text-[11px] font-semibold text-[#7a6e67] mb-1">
                  Scheme name
                </label>
                <input
                  type="text"
                  value={scheme.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className="w-full bg-white border border-[#ded8cb] focus:border-[#c88a29] rounded-xl px-3.5 py-2.5 text-xs text-[#2c1b15] font-semibold outline-none shadow-2xs"
                />
              </div>

              {/* Plan type & Minimum Investment Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#7a6e67] mb-1">
                    Plan type
                  </label>
                  <input
                    type="text"
                    value={scheme.planType}
                    onChange={(e) => handleFieldChange('planType', e.target.value)}
                    placeholder="e.g. MIP"
                    className="w-full bg-white border border-[#ded8cb] focus:border-[#c88a29] rounded-xl px-3.5 py-2.5 text-xs text-[#2c1b15] font-semibold outline-none shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#7a6e67] mb-1">
                    Minimum investment amount (₹)
                  </label>
                  <input
                    type="number"
                    value={scheme.minInvestment}
                    onChange={(e) => handleFieldChange('minInvestment', Number(e.target.value))}
                    className="w-full bg-white border border-[#ded8cb] focus:border-[#c88a29] rounded-xl px-3.5 py-2.5 text-xs text-[#2c1b15] font-semibold outline-none shadow-2xs font-mono"
                  />
                </div>
              </div>

              {/* Payout & Monthly Interest */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#7a6e67] mb-1">
                    Payout(In days) 
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={scheme.payout}
                    onChange={(e) => handleFieldChange('payout', e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 30, 90, 180"
                    className="w-full bg-white border border-[#ded8cb] focus:border-[#c88a29] rounded-xl px-3.5 py-2.5 text-xs text-[#2c1b15] font-semibold outline-none shadow-2xs font-mono"
                  />
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    {[30, 60, 90, 180, 360].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleFieldChange('payout', preset)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-medium border transition-colors cursor-pointer ${
                          scheme.payout === preset
                            ? 'bg-[#2c1b15] text-white border-[#2c1b15]'
                            : 'bg-[#faf8f4] text-[#61554d] border-[#ded8cb] hover:bg-white'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#7a6e67] mb-1">
                    Monthly interest (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={scheme.monthlyInterest}
                    onChange={(e) =>
                      handleFieldChange(
                        'monthlyInterest',
                        Math.max(0, Number(e.target.value) || 0)
                      )
                    }
                    className="w-full bg-white border border-[#ded8cb] focus:border-[#c88a29] rounded-xl px-3.5 py-2.5 text-xs text-[#2c1b15] font-semibold outline-none shadow-2xs font-mono"
                  />
                </div>
              </div>

              {/* Monthly Interest Date */}
              <div>
                <label className="block text-[11px] font-semibold text-[#7a6e67] mb-1">
                  Monthly interest date
                </label>
                <input
                  type="date"
                  value={scheme.monthlyInterestDate || ''}
                  onChange={(e) => handleFieldChange('monthlyInterestDate', e.target.value)}
                  className="w-full bg-white border border-[#ded8cb] focus:border-[#c88a29] rounded-xl px-3.5 py-2.5 text-xs text-[#2c1b15] font-semibold outline-none shadow-2xs"
                />
              </div>

              {/* Pre-closure rule */}
              <div>
                <label className="block text-[11px] font-semibold text-[#7a6e67] mb-1">
                  Pre-closure rule
                </label>
                <textarea
                  rows={3}
                  value={scheme.preClosureRule}
                  onChange={(e) => handleFieldChange('preClosureRule', e.target.value)}
                  className="w-full bg-white border border-[#ded8cb] focus:border-[#c88a29] rounded-xl px-3.5 py-2.5 text-xs text-[#2c1b15] outline-none shadow-2xs leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Plan Rules */}
          <div className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#f3efe6] mb-4">
              <h4 className="text-sm font-bold text-[#2c1b15]">
                Plan rules
              </h4>

              <button
                type="button"
                onClick={handleAddRule}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#2c1b15] border border-[#ded8cb] hover:bg-[#f6f2e9] rounded-lg px-2.5 py-1 transition-colors cursor-pointer"
              >
                <span>+ Add rule</span>
              </button>
            </div>

            {/* List of Rules */}
            <div className="space-y-4">
              {scheme.rules.map((rule, idx) => (
                <div
                  key={rule.id || idx}
                  className="p-3.5 bg-[#fbf9f5] border border-[#e8e2d5] rounded-xl space-y-2.5 relative"
                >
                  <div className="flex items-center justify-between">
                    <label className="text-[10.5px] font-bold text-[#8a7e75] uppercase">
                      Rule name
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveRule(idx)}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>

                  <input
                    type="text"
                    value={rule.name}
                    onChange={(e) => handleRuleChange(idx, 'name', e.target.value)}
                    className="w-full bg-white border border-[#ded8cb] focus:border-[#c88a29] rounded-lg px-3 py-1.5 text-xs text-[#2c1b15] font-semibold outline-none"
                  />

                  <div>
                    <label className="text-[10.5px] font-bold text-[#8a7e75] uppercase block mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={rule.description}
                      onChange={(e) => handleRuleChange(idx, 'description', e.target.value)}
                      className="w-full bg-white border border-[#ded8cb] focus:border-[#c88a29] rounded-lg p-2 text-xs text-[#2c1b15] outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: Customer App Preview ================= */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#2c1b15]">
              Customer app preview
            </h4>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e7f7ed] text-[#0f7642]">
              Live
            </span>
          </div>

          {/* Customer Mobile App Preview Card */}
          <div className="bg-white rounded-3xl border border-[#ded8cb] p-5 shadow-sm space-y-4">
            {/* Header Dark Brown Banner */}
            <div className="bg-[#2c1b15] text-white rounded-2xl p-5 shadow-2xs select-none">
              <span className="text-[11px] text-[#c4b5ac] font-medium block">
                Saving Plans
              </span>
              <h3 className="text-xl font-bold tracking-tight text-white mt-0.5">
                {scheme.name}
              </h3>
              <p className="text-xs text-[#d8c7bc] mt-1">
                Start saving from ₹{scheme.minInvestment} · {scheme.monthlyInterest}% monthly interest
              </p>
            </div>

            {/* 3 Metrics Row */}
            <div className="p-3.5 bg-[#fbf9f5] border border-[#e8e2d5] rounded-xl grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] text-[#8a7e75] block font-medium">Minimum saving</span>
                <span className="font-bold text-[#2c1b15] font-mono">₹{scheme.minInvestment}</span>
              </div>
              <div className="border-x border-[#ede8de] px-1">
                <span className="text-[10px] text-[#8a7e75] block font-medium">Interest</span>
                <span className="font-bold text-[#2c1b15] font-mono">{scheme.monthlyInterest}% / month</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8a7e75] block font-medium">Payout</span>
                <span className="font-bold text-[#2c1b15]">{scheme.payout}</span>
              </div>
            </div>

            {/* Interactive Calculator Box */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#f8f5ee] border border-[#e8e2d5] rounded-xl">
                <span className="text-[10px] text-[#8a7e75] block font-medium">My savings</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="font-mono font-bold text-[#2c1b15]">₹</span>
                  <input
                    type="number"
                    value={calculatorSavings}
                    onChange={(e) => setCalculatorSavings(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-white border border-[#ded8cb] rounded px-1.5 py-0.5 font-bold font-mono text-[#2c1b15] text-xs outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#f8f5ee] border border-[#e8e2d5] rounded-xl">
                <span className="text-[10px] text-[#8a7e75] block font-medium">Monthly interest earned</span>
                <span className="text-sm font-extrabold text-[#0f7642] font-mono mt-0.5 block">
                  ₹{monthlyInterestEarned}
                </span>
              </div>
            </div>

            {/* Legal / Policy Note */}
            <p className="text-[10px] text-[#8a7e75] leading-relaxed">
              Interest is credited to customer's personal bank account on{' '}
              <strong className="text-[#2c1b15]">
                {scheme.monthlyInterestDate || '1st of every month'}
              </strong>
              . KYC is required to start saving.
            </p>

            {/* Plan Rules Preview */}
            <div className="space-y-2 pt-2 border-t border-[#f3efe6]">
              <span className="text-xs font-bold text-[#2c1b15] block">
                Plan rules
              </span>
              {scheme.rules.map((rule, idx) => (
                <div key={idx} className="text-[11px] text-[#5e5148]">
                  <p className="font-bold text-[#2c1b15]">{rule.name}</p>
                  <p className="text-[#7a6e67]">{rule.description}</p>
                </div>
              ))}
            </div>

            {/* Pre-closure Preview */}
            <div className="space-y-1 pt-2 border-t border-[#f3efe6]">
              <span className="text-xs font-bold text-[#2c1b15] block">
                Pre-closure
              </span>
              <p className="text-[11px] text-[#7a6e67] leading-relaxed">
                {scheme.preClosureRule}
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <button
                type="button"
                className="w-full py-3 bg-[#a39890] hover:bg-[#8f837a] text-white rounded-xl text-xs font-semibold tracking-wide transition-colors cursor-pointer select-none"
              >
                Start saving
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Published Schemes Modal */}
      {showPublishedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#ded8cb]">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ebdF]">
              <h3 className="font-bold text-sm text-[#2c1b15]">
                Published Savings Schemes
              </h3>
              <button
                type="button"
                onClick={() => setShowPublishedModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              {(livePlans.length > 0
                ? livePlans.map((plan) => ({
                    id: plan.id,
                    name: plan.schemeName,
                    code: plan.planType,
                    minInvestment: plan.minimumInvestmentAmount,
                    monthlyInterest: `${plan.monthlyInterest}%`,
                    payout: plan.payout,
                    status: plan.status === 'PUBLISHED' ? 'Live' : 'Draft',
                    accountsCount: null,
                  }))
                : publishedSchemes
              ).map((sch) => (
                <div
                  key={sch.id}
                  className="p-3.5 bg-[#faf8f4] border border-[#e8e2d5] rounded-xl flex items-center justify-between text-xs"
                >
                  <div>
                    <h5 className="font-bold text-[#2c1b15] text-xs">
                      {sch.name} ({sch.code})
                    </h5>
                    <p className="text-[11px] text-[#7a6e67] mt-0.5">
                      Min: ₹{sch.minInvestment} · Return: {sch.monthlyInterest} · Payout: {sch.payout}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      sch.status === 'Live' || sch.status === 'PUBLISHED'
                        ? 'bg-[#e7f7ed] text-[#0f7642]'
                        : 'bg-[#fef1db] text-[#b46500]'
                    }`}>
                      {sch.status}
                    </span>
                    {sch.accountsCount != null && (
                      <span className="block text-[10px] text-[#8a7e75] mt-1 font-mono">
                        {sch.accountsCount} active accounts
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#f0ebdF] flex justify-end">
              <button
                type="button"
                onClick={() => setShowPublishedModal(false)}
                className="px-4 py-1.5 rounded-xl bg-[#2c1b15] text-white text-xs font-semibold hover:bg-[#1a0f0b] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default SchemeMasterPage;

