import React, { useState } from 'react';
import {
  X,
  Calendar,
  Building,
  Layers,
  MapPin,
  User,
  Sparkles,
  MessageSquare,
  History,
  CheckCircle2,
  Clock,
  RefreshCw,
  Send,
} from 'lucide-react';
import StatusBadge from '../StatusBadge';
import PriorityBadge from '../PriorityBadge';

export default function ComplaintDetailModal({
  complaint,
  onClose,
  onUpdateStatus,
}) {
  if (!complaint) return null;

  const [currentStatus, setCurrentStatus] = useState(complaint.status);
  const [remarks, setRemarks] = useState(complaint.adminRemarks || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusSave = async () => {
    setIsUpdating(true);
    await onUpdateStatus(complaint.complaintId, currentStatus, remarks);
    setIsUpdating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xl font-extrabold text-blue-600">
                {complaint.complaintId}
              </span>
              <StatusBadge status={complaint.status} size="sm" />
              <PriorityBadge
                priority={complaint.aiPriority}
                urgencyScore={complaint.aiUrgencyScore}
              />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Submitted by <strong>{complaint.studentName}</strong> on{' '}
              {new Date(complaint.createdAt).toLocaleString()}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                Department
              </span>
              <span className="font-bold text-slate-800">{complaint.department}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                Category
              </span>
              <span className="font-bold text-slate-800">{complaint.category}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                Location
              </span>
              <span className="font-bold text-slate-800">
                {complaint.location || 'Campus Premises'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                Turnaround SLA
              </span>
              <span className="font-bold text-slate-800">
                ~{complaint.aiResolutionEtaHours || 24} Hours
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Issue Description
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 leading-relaxed">
              {complaint.description}
            </div>
          </div>

          {/* ADMIN STATUS UPDATE SECTION */}
          <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Administrative Action & Status Management
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCurrentStatus('Pending')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  currentStatus === 'Pending'
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                Pending
              </button>

              <button
                type="button"
                onClick={() => setCurrentStatus('In Progress')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  currentStatus === 'In Progress'
                    ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                In Progress
              </button>

              <button
                type="button"
                onClick={() => setCurrentStatus('Resolved')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  currentStatus === 'Resolved'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Resolved
              </button>
            </div>

            {/* Admin remarks / technician notes input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admin Remarks / Resolution Details
              </label>
              <textarea
                rows="2"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add technician assignment, parts replacement note, or resolution remarks..."
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                disabled={isUpdating}
                onClick={handleStatusSave}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isUpdating ? 'Saving Update...' : 'Save Status & Remarks'}
              </button>
            </div>
          </div>

          {/* Activity / Timeline logs */}
          {complaint.timeline && complaint.timeline.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                <History className="w-3.5 h-3.5" /> History Timeline
              </h4>
              <div className="space-y-2 border-l-2 border-slate-200 ml-2 pl-3">
                {complaint.timeline.map((entry, idx) => (
                  <div key={idx} className="text-xs">
                    <span className="font-semibold text-slate-800">{entry.status}</span>
                    <span className="text-slate-400 ml-2">
                      {new Date(entry.updatedAt).toLocaleString()}
                    </span>
                    {entry.note && <p className="text-slate-600 mt-0.5">{entry.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
