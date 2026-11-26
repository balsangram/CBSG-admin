import React, { useEffect, useState } from 'react';
import {
  Plus,
  RotateCcw,
  CheckCircle2,
  Loader2,
  Pencil,
  IndianRupee,
  Percent,
  CalendarDays,
  FileText,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { notify } from '../../../utils/notify';
import {
  initialSchemeConfig,
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
  const [editing, setEditing] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [saving, setSaving] = useState(false);
  const [calculatorSavings, setCalculatorSavings] = useState(100);
  // Load the single plan (if any) on mount
  useEffect(() => {
    let cancelled = false;
    savingsService
      .getPlans()
      .then((plans) => {
        if (cancelled) return;
        if (plans.length > 0) {
          const plan = plans[0];
          setPlanId(plan.id);
          setScheme(planToScheme(plan));
          setHasPlan(true);
          setEditing(false);
        } else {
          setScheme(EMPTY_SCHEME);
          setEditing(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setScheme(EMPTY_SCHEME);
          setEditing(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingPlan(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const showToast = (msg, kind = 'success') => {
    if (kind === 'error') notify.error(msg);
    else notify.success(msg);
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
      setEditing(false);
      showToast(planId ? 'Scheme updated successfully.' : 'Scheme created successfully.');
    } catch (err) {
      showToast(err.message || 'Failed to save scheme.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const showForm = !hasPlan || editing;

  const formatInterestDate = (value) => {
    if (!value) return '1st of every month';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#241814]">
            Savings scheme master
          </h2>
          <p className="mt-0.5 text-xs text-[#7a6e67]">
            {showForm ? (editing ? 'Edit scheme details' : 'Create your savings scheme') : 'Published scheme overview'}
          </p>
        </div>

        {showForm && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#7a6e67] hover:text-[#2c1b15] cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>

            {!hasPlan && (
              <button
                type="button"
                onClick={handleNewScheme}
                disabled={loadingPlan}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#2c1b15] hover:bg-[#1a0f0b] text-white text-xs font-medium transition-colors shadow-2xs cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New scheme</span>
              </button>
            )}

            {hasPlan && editing && (
              <button
                type="button"
                onClick={() => setEditing(false)}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#f6f2e9] border border-[#ded8cb] text-xs font-medium text-[#2c1b15] transition-colors shadow-2xs cursor-pointer select-none"
              >
                Cancel
              </button>
            )}

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
        )}
      </div>

      {loadingPlan ? (
        <div className="flex items-center justify-center py-24 text-[#7a6e67]">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : !showForm ? (
        /* ================= VIEW: Single scheme card ================= */
        <div className="max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl border border-[#e8e2d5] bg-white shadow-sm">
            <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-br from-[#2c1b15] via-[#3d2a22] to-[#c88a29]" />

            <div className="relative px-5 pt-5 sm:px-7 sm:pt-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="inline-flex items-center rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#f3e6d4] ring-1 ring-white/20">
                    {scheme.planType || 'Plan'}
                  </span>
                  <h3 className="mt-3 text-xl sm:text-2xl font-bold tracking-tight text-white truncate">
                    {scheme.name}
                  </h3>
                  <p className="mt-1 text-xs text-[#e8d5c4]">
                    Start saving from ₹{Number(scheme.minInvestment).toLocaleString('en-IN')} · {scheme.monthlyInterest}% monthly
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  title="Edit scheme"
                  aria-label="Edit scheme"
                  className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/25 hover:bg-white hover:text-[#2c1b15] transition-colors cursor-pointer"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-5 px-5 sm:px-7 pb-6 pt-5">
              {/* Left: metrics + pre-closure */}
              <div className="lg:col-span-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      label: 'Min. investment',
                      value: `₹${Number(scheme.minInvestment).toLocaleString('en-IN')}`,
                      icon: IndianRupee,
                    },
                    {
                      label: 'Monthly interest',
                      value: `${scheme.monthlyInterest}%`,
                      icon: Percent,
                    },
                    {
                      label: 'Payout',
                      value: `${scheme.payout} days`,
                      icon: CalendarDays,
                    },
                    {
                      label: 'Interest date',
                      value: formatInterestDate(scheme.monthlyInterestDate),
                      icon: CalendarDays,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-[#ebe4d8] bg-[#fbf9f5] px-3.5 py-3"
                    >
                      <div className="flex items-center gap-1.5 text-[#8a7e75]">
                        <item.icon className="w-3 h-3" />
                        <span className="text-[10px] font-medium">{item.label}</span>
                      </div>
                      <p className="mt-1.5 text-sm font-bold text-[#2c1b15] font-mono leading-tight">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-[#ebe4d8] bg-[#f8f5ee] px-4 py-3.5">
                  <h4 className="text-xs font-bold uppercase tracking-wide text-[#7a6e67]">
                    Pre-closure
                  </h4>
                  <p className="mt-1.5 text-[12px] text-[#5e5148] leading-relaxed">
                    {scheme.preClosureRule?.trim() || 'No pre-closure rule configured.'}
                  </p>
                </div>
              </div>

              {/* Right: plan rules */}
              <div className="lg:col-span-7 rounded-2xl border border-[#ebe4d8] bg-[#fbf9f5] p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-3.5 pb-3 border-b border-[#ebe4d8]">
                  <FileText className="w-3.5 h-3.5 text-[#c88a29]" />
                  <h4 className="text-xs font-bold uppercase tracking-wide text-[#7a6e67]">
                    Plan rules
                  </h4>
                  {scheme.rules?.length > 0 && (
                    <span className="ml-auto text-[10px] font-semibold text-[#8a7e75]">
                      {scheme.rules.length} rules
                    </span>
                  )}
                </div>
                {scheme.rules?.length ? (
                  <ul className="space-y-2.5 max-h-[22rem] overflow-y-auto pr-1">
                    {scheme.rules.map((rule, idx) => (
                      <li
                        key={rule.id || idx}
                        className="flex gap-3 rounded-xl border border-[#ebe4d8] bg-white px-3.5 py-3"
                      >
                        <span className="shrink-0 mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#2c1b15] text-[10px] font-bold text-white">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#2c1b15]">{rule.name}</p>
                          <p className="mt-0.5 text-[11px] text-[#7a6e67] leading-relaxed">
                            {rule.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[#8a7e75]">No plan rules added.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= EDIT / CREATE: Form + preview ================= */
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-2xs">
              <div className="pb-4 border-b border-[#f3efe6] mb-4">
                <h4 className="text-sm font-bold text-[#2c1b15]">
                  Scheme configuration
                </h4>
              </div>

              <div className="space-y-4 text-xs">
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

          <div className="lg:col-span-5 lg:sticky lg:top-20 lg:self-start space-y-4">
            <h4 className="text-sm font-bold text-[#2c1b15]">
              Customer app preview
            </h4>

            <div className="bg-white rounded-3xl border border-[#ded8cb] p-5 shadow-sm space-y-4">
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

              <p className="text-[10px] text-[#8a7e75] leading-relaxed">
                Interest is credited to customer's personal bank account on{' '}
                <strong className="text-[#2c1b15]">
                  {formatInterestDate(scheme.monthlyInterestDate)}
                </strong>
                . KYC is required to start saving.
              </p>

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

              <div className="space-y-1 pt-2 border-t border-[#f3efe6]">
                <span className="text-xs font-bold text-[#2c1b15] block">
                  Pre-closure
                </span>
                <p className="text-[11px] text-[#7a6e67] leading-relaxed">
                  {scheme.preClosureRule}
                </p>
              </div>

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
      )}
    </DashboardLayout>
  );
}

export default SchemeMasterPage;

