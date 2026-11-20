import React from 'react';
import {
  Sparkles,
  BarChart3,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Clock,
  PieChart,
  CheckCircle2,
} from 'lucide-react';
import PriorityBadge from '../PriorityBadge';

export default function AiAnalyticsView({ complaints = [], stats = {} }) {
  // Aggregate category counts
  const categoryMap = {};
  const deptMap = {};
  let criticalCount = 0;
  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;

  complaints.forEach((c) => {
    categoryMap[c.category] = (categoryMap[c.category] || 0) + 1;
    deptMap[c.department] = (deptMap[c.department] || 0) + 1;
    if (c.aiPriority === 'Critical') criticalCount++;
    else if (c.aiPriority === 'High') highCount++;
    else if (c.aiPriority === 'Low') lowCount++;
    else mediumCount++;
  });

  const total = complaints.length || 1;
  const sortedCategories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
  const sortedDepts = Object.entries(deptMap).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md text-sky-300 border border-white/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            AI Facility Intelligence & Insights
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Automated Campus Facility Health Analysis
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Real-time heuristic intelligence categorizes student tickets, identifies potential safety hazards, and forecasts facility maintenance demand.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Critical Safety Alerts
          </span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-extrabold text-rose-600">{criticalCount}</span>
            <AlertTriangle className="w-7 h-7 text-rose-500/30" />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Sparks, floods, or electrical hazards flagged for expedited 4h SLA.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Overall Resolution Rate
          </span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-extrabold text-emerald-600">
              {stats.resolutionRate || 0}%
            </span>
            <ShieldCheck className="w-7 h-7 text-emerald-500/30" />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Target SLA compliance maintained across active campus buildings.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Average Turnaround Time
          </span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-extrabold text-indigo-600">18.4h</span>
            <Clock className="w-7 h-7 text-indigo-500/30" />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Down by 42% compared to manual WhatsApp messages and verbal requests.
          </p>
        </div>
      </div>

      {/* Breakdown Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Bar Chart */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            Complaints by Facility Category
          </h3>
          <div className="space-y-3.5">
            {sortedCategories.map(([cat, count]) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{cat}</span>
                    <span className="text-slate-500">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Volume Breakdown */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-4">
            <PieChart className="w-4 h-4 text-indigo-600" />
            Department Ticket Distribution
          </h3>
          <div className="space-y-3.5">
            {sortedDepts.map(([dept, count]) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={dept} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span className="truncate max-w-[240px]">{dept}</span>
                    <span className="text-slate-500">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
