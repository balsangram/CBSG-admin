import React from 'react';
import { APP_CONFIG } from '../../utils/constants';

export function Footer() {
  return (
    <footer className="mt-auto bg-white border-t border-slate-200/80 px-6 py-5 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-slate-600">
          <span className="font-semibold text-slate-700">
            © 2026 {APP_CONFIG.APP_NAME}
          </span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span>RBI Registered NBFC · ISO 27001 Certified</span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="text-emerald-700 font-medium">Audit-ready Maker-Checker System</span>
        </div>

        <div className="flex items-center gap-4 text-slate-600">
          <a
            href={APP_CONFIG.LAUNCHER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors"
          >
            CBSG Launcher
          </a>
          <span>·</span>
          <span className="font-mono text-[11px] text-slate-600">Version 2.6.4</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
