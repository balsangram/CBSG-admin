import React from 'react';
import Logo from '../../../components/common/Logo';

export function AuthBrandPanel() {
  return (
    <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 xl:p-16 bg-[#251712] overflow-hidden select-none">
      {/* Background radial warmth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#38221a_0%,#241510_70%,#180e0a_100%)] pointer-events-none" />

      {/* Subtle background ambient mesh */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Logo */}
      <div className="relative z-10">
        <Logo variant="dark" size="md" />
      </div>

      {/* Center Hero Value Proposition */}
      <div className="relative z-10 max-w-lg my-auto py-12">
        <h1 className="text-4xl xl:text-5xl font-bold tracking-tight text-white leading-[1.18]">
          Run the whole NBFC <br />
          <span className="text-[#e5a84b]">from one desk.</span>
        </h1>
        <p className="mt-5 text-[#bfaea3] text-sm xl:text-base leading-relaxed max-w-md font-normal">
          Deposits, weekly payouts, daily loans, commissions and compliance — with maker-checker on every rupee.
        </p>

        {/* Feature Highlights Pills */}
        <div className="mt-8 flex flex-wrap gap-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#d8c7bc]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Maker-Checker Engine
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#d8c7bc]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            RBI Compliance Guard
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#d8c7bc]">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Real-time Disbursements
          </div>
        </div>
      </div>

      {/* Bottom Right Graphic Watermark (Stylized rising bar chart with upward arrow) */}
      <div className="absolute bottom-6 right-8 w-72 h-56 pointer-events-none opacity-20 transform translate-x-4 translate-y-4">
        <svg
          viewBox="0 0 280 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-amber-500"
        >
          <defs>
            <linearGradient id="chartWatermarkGrad" x1="0" y1="100%" x2="0" y2="0">
              <stop offset="0%" stopColor="#d97706" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          {/* Bar 1 */}
          <rect x="20" y="140" width="34" height="60" rx="4" fill="url(#chartWatermarkGrad)" />
          {/* Bar 2 */}
          <rect x="74" y="105" width="34" height="95" rx="4" fill="url(#chartWatermarkGrad)" />
          {/* Bar 3 */}
          <rect x="128" y="70" width="34" height="130" rx="4" fill="url(#chartWatermarkGrad)" />
          {/* Bar 4 */}
          <rect x="182" y="30" width="34" height="170" rx="4" fill="url(#chartWatermarkGrad)" />

          {/* Sweeping Upward Curved Arrow */}
          <path
            d="M 10 190 C 80 190, 160 160, 240 45"
            stroke="#f59e0b"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Arrow Head */}
          <polygon points="230,30 255,42 245,65" fill="#f59e0b" />
        </svg>
      </div>

      {/* Bottom Regulatory Text */}
      <div className="relative z-10 flex items-center justify-between text-[#877063] text-xs font-mono tracking-wide pt-4 border-t border-white/10">
        <span>ISO 27001 · RBI-registered NBFC · Audit-ready</span>
        <span className="text-[11px] text-[#6d594f]">v2.6 Enterprise</span>
      </div>
    </div>
  );
}

export default AuthBrandPanel;
