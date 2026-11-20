import React from 'react';
import { Clock, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function StatusBadge({ status, size = 'md' }) {
  const isSm = size === 'sm';

  switch (status) {
    case 'Pending':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 ${
            isSm ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs'
          }`}
        >
          <Clock className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          Pending
        </span>
      );
    case 'In Progress':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 ${
            isSm ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs'
          }`}
        >
          <RefreshCw className={`${isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} animate-spin`} style={{ animationDuration: '4s' }} />
          In Progress
        </span>
      );
    case 'Resolved':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${
            isSm ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs'
          }`}
        >
          <CheckCircle2 className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          Resolved
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
          {status}
        </span>
      );
  }
}
