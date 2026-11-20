import React, { useState, useEffect } from 'react';
import {
  Send,
  Sparkles,
  CheckCircle,
  Copy,
  ArrowRight,
  AlertCircle,
  ShieldAlert,
  Clock,
  Layers,
  MapPin,
  Building,
  User,
} from 'lucide-react';
import { submitComplaint } from '../../services/api';
import { liveAiPredict } from '../../services/localAiEngine';
import PriorityBadge from '../PriorityBadge';

const DEPARTMENTS = [
  'Computer Science and Business Systems',
  'Computer Science and Engineering',
  'Information Technology',
  'Electronics and Communication Engineering',
  'Electrical and Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Other',
];

const CATEGORIES = [
  'Classroom Projector',
  'Wi-Fi / Internet',
  'Drinking Water',
  'Laboratory Equipment',
  'Washroom Maintenance',
  'Hostel Maintenance',
  'Other',
];

export default function ComplaintForm({
  onComplaintSubmitted,
  onTrackComplaint,
  currentUser,
}) {
  const [formData, setFormData] = useState({
    studentName: currentUser?.name || '',
    department: currentUser?.department || '',
    category: '',
    description: '',
    location: '',
  });

  // Keep synced if user signs in
  useEffect(() => {
    if (currentUser?.name) {
      setFormData((prev) => ({
        ...prev,
        studentName: currentUser.name,
        department: currentUser.department || prev.department,
      }));
    }
  }, [currentUser]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [copiedId, setCopiedId] = useState(false);

  // Live AI Prediction state
  const [aiInsight, setAiInsight] = useState({
    suggestedCategory: null,
    priority: 'Medium',
    urgencyScore: 45,
    etaHours: 24,
    isHazard: false,
  });

  // Re-run AI analysis on description change
  useEffect(() => {
    const analysis = liveAiPredict(formData.description);
    setAiInsight(analysis);
  }, [formData.description]);

  const validate = () => {
    const newErrors = {};
    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Student name is required.';
    } else if (formData.studentName.trim().length < 2) {
      newErrors.studentName = 'Name must be at least 2 characters.';
    }

    if (!formData.department) {
      newErrors.department = 'Please select your department.';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a complaint category.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Complaint description is required.';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleApplyAiCategory = () => {
    if (aiInsight.suggestedCategory) {
      setFormData((prev) => ({ ...prev, category: aiInsight.suggestedCategory }));
      if (errors.category) {
        setErrors((prev) => ({ ...prev, category: '' }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await submitComplaint(formData);
      if (res.success) {
        setSubmittedData(res.data);
        if (onComplaintSubmitted) {
          onComplaintSubmitted(res.data);
        }
      } else {
        alert(res.message || 'Submission failed. Please check inputs.');
      }
    } catch (err) {
      alert('An unexpected error occurred: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyId = () => {
    if (!submittedData?.complaintId) return;
    navigator.clipboard.writeText(submittedData.complaintId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleReset = () => {
    setSubmittedData(null);
    setFormData({
      studentName: '',
      department: '',
      category: '',
      description: '',
      location: '',
    });
    setErrors({});
  };

  // SUCCESS CONFIRMATION VIEW
  if (submittedData) {
    return (
      <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-xl max-w-2xl mx-auto text-center animate-fade-in">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-4 ring-8 ring-emerald-50">
          <CheckCircle className="w-9 h-9" />
        </div>

        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
          Complaint Submitted Successfully!
        </h3>
        <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
          Your complaint has been registered into the centralized campus repository and prioritized by the AI triage engine.
        </p>

        {/* Generated Unique Complaint ID Box */}
        <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 inline-block w-full max-w-md">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Unique Complaint ID
          </span>
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 tracking-wider">
              {submittedData.complaintId}
            </span>
            <button
              onClick={handleCopyId}
              type="button"
              className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
              title="Copy ID"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          {copiedId && (
            <span className="text-xs text-emerald-600 font-semibold mt-1 block">
              Copied to clipboard!
            </span>
          )}
        </div>

        {/* AI Triage Summary */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left max-w-md mx-auto text-xs bg-indigo-50/60 p-4 rounded-xl border border-indigo-100">
          <div>
            <span className="text-indigo-400 block font-medium">Assigned Category</span>
            <span className="font-semibold text-slate-800">{submittedData.category}</span>
          </div>
          <div>
            <span className="text-indigo-400 block font-medium">AI Priority</span>
            <PriorityBadge priority={submittedData.aiPriority} />
          </div>
          <div>
            <span className="text-indigo-400 block font-medium">Est. Turnaround</span>
            <span className="font-semibold text-slate-800">
              ~{submittedData.aiResolutionEtaHours || 24} Hours
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onTrackComplaint(submittedData.complaintId)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all"
          >
            Track Status Now
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all"
          >
            Submit Another Complaint
          </button>
        </div>
      </div>
    );
  }

  // COMPLAINT SUBMISSION FORM
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      <div className="flex items-start justify-between pb-6 border-b border-slate-100 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Submit a Campus Complaint
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              <Sparkles className="w-3 h-3 text-blue-500" />
              AI Assisted
            </span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Fill out the details below. Our AI engine automatically triages urgency and routes to the relevant department.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Student Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Student Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              placeholder="e.g., Aarav Sharma"
              className={`w-full px-3.5 py-2.5 rounded-xl text-sm border bg-slate-50/50 focus:bg-white transition-all outline-none focus:ring-2 ${
                errors.studentName
                  ? 'border-rose-300 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
              }`}
            />
            {errors.studentName && (
              <p className="text-xs text-rose-500 font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.studentName}
              </p>
            )}
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              Department <span className="text-rose-500">*</span>
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`w-full px-3.5 py-2.5 rounded-xl text-sm border bg-slate-50/50 focus:bg-white transition-all outline-none focus:ring-2 ${
                errors.department
                  ? 'border-rose-300 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
              }`}
            >
              <option value="">-- Select Your Department --</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.department && (
              <p className="text-xs text-rose-500 font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.department}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Complaint Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              Complaint Category <span className="text-rose-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-3.5 py-2.5 rounded-xl text-sm border bg-slate-50/50 focus:bg-white transition-all outline-none focus:ring-2 ${
                errors.category
                  ? 'border-rose-300 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
              }`}
            >
              <option value="">-- Select Issue Category --</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-rose-500 font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.category}
              </p>
            )}
          </div>

          {/* Specific Location / Classroom / Lab */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Specific Location / Room No.
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., LH-302, Library 3rd Floor, Hostel 2"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-300 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
            />
          </div>
        </div>

        {/* Complaint Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Complaint Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows="4"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the problem clearly (e.g., The classroom projector lamp is flickering violently and turns black after 5 minutes during lectures...)"
            className={`w-full px-3.5 py-2.5 rounded-xl text-sm border bg-slate-50/50 focus:bg-white transition-all outline-none focus:ring-2 ${
              errors.description
                ? 'border-rose-300 focus:ring-rose-200'
                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
            }`}
          ></textarea>
          {errors.description && (
            <p className="text-xs text-rose-500 font-medium mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.description}
            </p>
          )}

          {/* LIVE AI TRIAGE CARD */}
          {formData.description.trim().length >= 4 && (
            <div className="mt-3 p-3.5 rounded-xl bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-purple-50/80 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-800">
                    AI Real-Time Analysis:
                  </span>{' '}
                  <span className="text-slate-600">
                    Priority assessed as{' '}
                    <strong className="text-slate-900">{aiInsight.priority}</strong>{' '}
                    ({aiInsight.urgencyScore}% urgency) • Turnaround: ~{aiInsight.etaHours}h
                  </span>
                  {aiInsight.isHazard && (
                    <span className="inline-flex items-center gap-1 ml-2 text-rose-700 font-bold">
                      <ShieldAlert className="w-3.5 h-3.5" /> High Urgency Safety Risk
                    </span>
                  )}
                </div>
              </div>

              {aiInsight.suggestedCategory &&
                aiInsight.suggestedCategory !== formData.category && (
                  <button
                    type="button"
                    onClick={handleApplyAiCategory}
                    className="shrink-0 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-all text-[11px]"
                  >
                    Set Category to "{aiInsight.suggestedCategory}"
                  </button>
                )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Submitting & Generating ID...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Complaint
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
