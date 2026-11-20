import React, { useState, useEffect } from 'react';
import {
  Search,
  AlertCircle,
  Clock,
  CheckCircle2,
  Calendar,
  Building,
  Layers,
  MapPin,
  User,
  MessageSquare,
  Sparkles,
  History,
  ArrowRight,
} from 'lucide-react';
import { getComplaintById } from '../../services/api';
import StatusBadge from '../StatusBadge';
import PriorityBadge from '../PriorityBadge';

export default function ComplaintTracker({ initialComplaintId = '' }) {
  const [searchId, setSearchId] = useState(initialComplaintId);
  const [isLoading, setIsLoading] = useState(false);
  const [complaint, setComplaint] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // If initialComplaintId is passed (e.g., from quick track or form submit)
  useEffect(() => {
    if (initialComplaintId) {
      setSearchId(initialComplaintId);
      performSearch(initialComplaintId);
    }
  }, [initialComplaintId]);

  const performSearch = async (idToSearch) => {
    const id = (idToSearch || searchId).trim();
    if (!id) {
      setErrorMsg('Please enter a Complaint ID (e.g. CMP-2026-1001)');
      setComplaint(null);
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await getComplaintById(id);
      if (res.success && res.data) {
        setComplaint(res.data);
        setErrorMsg('');
      } else {
        setComplaint(null);
        setErrorMsg(
          res.message || `No complaint found matching ID "${id}". Please verify and try again.`
        );
      }
    } catch (err) {
      setComplaint(null);
      setErrorMsg('Unable to look up complaint: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch(searchId);
  };

  // Status step index: 0 = Pending, 1 = In Progress, 2 = Resolved
  const getStepIndex = (status) => {
    if (status === 'Resolved') return 2;
    if (status === 'In Progress') return 1;
    return 0;
  };

  return (
    <div className="space-y-6">
      {/* Search Bar Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Search className="w-6 h-6 text-blue-600" />
          Track Complaint Progress
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Enter your unique complaint ID (e.g., <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-700 font-mono">CMP-2026-1001</code>) to view real-time status and administrative updates.
        </p>

        <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Complaint ID (e.g., CMP-2026-1001)"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm font-medium transition-all outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Searching...
              </>
            ) : (
              <>
                Track Status
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Error message */}
        {errorMsg && (
          <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-3 text-sm animate-fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
            <div>
              <p className="font-semibold">Complaint Not Found</p>
              <p className="text-xs text-rose-600 mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}
      </div>

      {/* Complaint Detail & Status Timeline Card */}
      {complaint && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8 animate-fade-in">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-mono text-xl sm:text-2xl font-extrabold text-blue-600">
                  {complaint.complaintId}
                </span>
                <StatusBadge status={complaint.status} size="lg" />
                <PriorityBadge priority={complaint.aiPriority} urgencyScore={complaint.aiUrgencyScore} />
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Submitted on{' '}
                {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            {/* Turnaround Badge */}
            <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200/80 text-right sm:text-left">
              <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider block">
                Target Resolution ETA
              </span>
              <span className="text-sm font-bold text-slate-800 flex items-center gap-1">
                <Clock className="w-4 h-4 text-indigo-500" />
                ~{complaint.aiResolutionEtaHours || 24} Hours
              </span>
            </div>
          </div>

          {/* VISUAL 3-STAGE PROGRESS BAR */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
              Resolution Progress
            </h3>

            <div className="relative">
              {/* Connector line */}
              <div className="absolute top-5 left-8 right-8 h-1 bg-slate-200 -z-0 hidden sm:block">
                <div
                  className="h-full bg-blue-600 transition-all duration-700"
                  style={{
                    width: `${(getStepIndex(complaint.status) / 2) * 100}%`,
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
                {/* Step 1: Registered */}
                <div className="flex sm:flex-col items-center sm:text-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                      getStepIndex(complaint.status) >= 0
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'bg-white border-slate-300 text-slate-400'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">1. Complaint Submitted</h4>
                    <p className="text-xs text-slate-500">Registered and AI Triaged</p>
                  </div>
                </div>

                {/* Step 2: In Progress */}
                <div className="flex sm:flex-col items-center sm:text-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                      getStepIndex(complaint.status) >= 1
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'bg-white border-slate-300 text-slate-400'
                    }`}
                  >
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">2. Under Investigation</h4>
                    <p className="text-xs text-slate-500">Technician Assigned & Working</p>
                  </div>
                </div>

                {/* Step 3: Resolved */}
                <div className="flex sm:flex-col items-center sm:text-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                      getStepIndex(complaint.status) === 2
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-500/20'
                        : 'bg-white border-slate-300 text-slate-400'
                    }`}
                  >
                    {getStepIndex(complaint.status) === 2 ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      3
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">3. Issue Resolved</h4>
                    <p className="text-xs text-slate-500">Fixed & Verified by Admin</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                <User className="w-3.5 h-3.5" /> Student Name
              </span>
              <p className="text-sm font-bold text-slate-800">{complaint.studentName}</p>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                <Building className="w-3.5 h-3.5" /> Department
              </span>
              <p className="text-sm font-bold text-slate-800">{complaint.department}</p>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                <Layers className="w-3.5 h-3.5" /> Category
              </span>
              <p className="text-sm font-bold text-slate-800">{complaint.category}</p>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                <MapPin className="w-3.5 h-3.5" /> Campus Location
              </span>
              <p className="text-sm font-bold text-slate-800">
                {complaint.location || 'Campus Premises'}
              </p>
            </div>
          </div>

          {/* Description Block */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Complaint Description
            </h4>
            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 text-sm text-slate-800 leading-relaxed">
              {complaint.description}
            </div>
          </div>

          {/* Admin Remarks / Resolution Status Note */}
          {complaint.adminRemarks && (
            <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-200 text-sm">
              <div className="flex items-center gap-2 text-indigo-900 font-bold mb-1">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                Administrative Remarks / Technician Feedback
              </div>
              <p className="text-indigo-950 font-medium pl-6">{complaint.adminRemarks}</p>
            </div>
          )}

          {/* Timeline / History Logs */}
          {complaint.timeline && complaint.timeline.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" /> Activity Log
              </h4>
              <div className="space-y-3">
                {complaint.timeline.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-800">{item.status}</span>
                      <span className="text-slate-400 ml-2">
                        {new Date(item.updatedAt).toLocaleString()}
                      </span>
                      {item.note && <p className="text-slate-600 mt-0.5">{item.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
