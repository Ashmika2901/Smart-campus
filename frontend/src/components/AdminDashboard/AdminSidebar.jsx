import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  RotateCcw,
  Shield,
  Layers,
  FileCheck,
  CheckCircle,
} from 'lucide-react';

export default function AdminSidebar({
  activeView,
  setActiveView,
  onResetSeedData,
  totalCount = 0,
}) {
  return (
    <aside className="w-full lg:w-64 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-6 shrink-0 h-fit">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
          Admin Operations
        </span>
        <nav className="space-y-1">
          <button
            onClick={() => setActiveView('complaints')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
              activeView === 'complaints'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4" />
              <span>Complaints Console</span>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                activeView === 'complaints'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {totalCount}
            </span>
          </button>

          <button
            onClick={() => setActiveView('analytics')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
              activeView === 'analytics'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Facility Insights</span>
          </button>
        </nav>
      </div>

      {/* System Utilities */}
      <div className="pt-4 border-t border-slate-100">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
          Quick Management
        </span>
        <button
          onClick={onResetSeedData}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
          title="Reload initial demo dataset"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reload Sample Data</span>
        </button>
      </div>

      {/* SLA Guideline Card */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <Shield className="w-4 h-4 text-blue-600" />
          Campus SLA Targets
        </div>
        <ul className="space-y-1 text-slate-500">
          <li>• Critical: &lt; 4 Hours</li>
          <li>• High: &lt; 12 Hours</li>
          <li>• Standard: &lt; 24 Hours</li>
        </ul>
      </div>
    </aside>
  );
}
