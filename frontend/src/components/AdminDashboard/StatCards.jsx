import React from 'react';
import {
  FileText,
  Clock,
  RefreshCw,
  CheckCircle2,
  ShieldAlert,
  TrendingUp,
} from 'lucide-react';

export default function StatCards({ stats, onFilterByStatus }) {
  const cards = [
    {
      id: 'total',
      label: 'Total Complaints',
      value: stats.total || 0,
      icon: FileText,
      color: 'blue',
      border: 'border-blue-200',
      bg: 'bg-blue-50/70',
      iconColor: 'text-blue-600',
      subText: 'Across all 8 campus departments',
      filterVal: 'All',
    },
    {
      id: 'pending',
      label: 'Pending Complaints',
      value: stats.pending || 0,
      icon: Clock,
      color: 'amber',
      border: 'border-amber-200',
      bg: 'bg-amber-50/70',
      iconColor: 'text-amber-600',
      subText: 'Awaiting technician assignment',
      filterVal: 'Pending',
    },
    {
      id: 'inProgress',
      label: 'In Progress',
      value: stats.inProgress || 0,
      icon: RefreshCw,
      color: 'indigo',
      border: 'border-indigo-200',
      bg: 'bg-indigo-50/70',
      iconColor: 'text-indigo-600',
      subText: 'Under active repair/investigation',
      filterVal: 'In Progress',
    },
    {
      id: 'resolved',
      label: 'Resolved Complaints',
      value: stats.resolved || 0,
      icon: CheckCircle2,
      color: 'emerald',
      border: 'border-emerald-200',
      bg: 'bg-emerald-50/70',
      iconColor: 'text-emerald-600',
      subText: `${stats.resolutionRate || 0}% overall resolution rate`,
      filterVal: 'Resolved',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => onFilterByStatus && onFilterByStatus(card.filterVal)}
            className={`p-5 rounded-2xl bg-white border ${card.border} shadow-sm hover:shadow-md transition-all cursor-pointer group`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {card.label}
              </span>
              <div
                className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center ${card.iconColor} group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {card.value}
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-500 font-medium truncate">
              {card.subText}
            </p>
          </div>
        );
      })}
    </div>
  );
}
