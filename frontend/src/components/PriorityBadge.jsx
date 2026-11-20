import React from 'react';
import { AlertCircle, AlertTriangle, Info, ShieldAlert } from 'lucide-react';

export default function PriorityBadge({ priority, urgencyScore }) {
  switch (priority) {
    case 'Critical':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-300">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
          Critical {urgencyScore ? `(${urgencyScore}%)` : ''}
        </span>
      );
    case 'High':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-300">
          <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
          High {urgencyScore ? `(${urgencyScore}%)` : ''}
        </span>
      );
    case 'Low':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
          <Info className="w-3 h-3 text-slate-500" />
          Low
        </span>
      );
    case 'Medium':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
          <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
          Medium
        </span>
      );
  }
}
