import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Calendar,
  Layers,
  Building,
} from 'lucide-react';
import StatusBadge from '../StatusBadge';
import PriorityBadge from '../PriorityBadge';

const CATEGORIES = [
  'All',
  'Classroom Projector',
  'Wi-Fi / Internet',
  'Drinking Water',
  'Laboratory Equipment',
  'Washroom Maintenance',
  'Hostel Maintenance',
  'Other',
];

const STATUSES = ['All', 'Pending', 'In Progress', 'Resolved'];

const DEPARTMENTS = [
  'All',
  'Computer Science and Business Systems',
  'Computer Science and Engineering',
  'Information Technology',
  'Electronics and Communication Engineering',
  'Electrical and Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Other',
];

export default function ComplaintTable({
  complaints = [],
  onSelectComplaint,
  onQuickStatusChange,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  departmentFilter,
  setDepartmentFilter,
  searchTerm,
  setSearchTerm,
  onRefresh,
}) {
  const [updatingId, setUpdatingId] = useState(null);

  const handleStatusSelect = async (complaintId, newStatus) => {
    setUpdatingId(complaintId);
    try {
      await onQuickStatusChange(complaintId, newStatus);
    } finally {
      setUpdatingId(null);
    }
  };

  // Export to CSV helper
  const handleExportCSV = () => {
    if (!complaints.length) return;
    const headers = [
      'Complaint ID',
      'Student Name',
      'Department',
      'Category',
      'Location',
      'Description',
      'Status',
      'Priority',
      'Created Date',
      'Admin Remarks',
    ];

    const rows = complaints.map((c) => [
      `"${c.complaintId}"`,
      `"${c.studentName}"`,
      `"${c.department}"`,
      `"${c.category}"`,
      `"${c.location || ''}"`,
      `"${c.description.replace(/"/g, '""')}"`,
      `"${c.status}"`,
      `"${c.aiPriority || 'Medium'}"`,
      `"${new Date(c.createdAt).toISOString()}"`,
      `"${(c.adminRemarks || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smart_campus_complaints_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header and Controls */}
      <div className="p-6 border-b border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              All Campus Complaints
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {complaints.length} Records
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review, filter, and assign complaints. Changes reflect immediately in student portals.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              title="Download CSV"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
            <button
              onClick={onRefresh}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ID, name, or keywords..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-xs outline-none transition-all"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white text-xs outline-none font-medium text-slate-700"
            >
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  Status: {st}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white text-xs outline-none font-medium text-slate-700"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white text-xs outline-none font-medium text-slate-700 truncate"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  Dept: {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        {complaints.length === 0 ? (
          <div className="py-16 text-center">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-700">No complaints match your filters</h3>
            <p className="text-xs text-slate-400 mt-1">
              Try resetting search filters or changing the category/status dropdowns.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Complaint ID</th>
                <th className="py-3 px-4">Student & Dept</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status & Update</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {complaints.map((item) => (
                <tr
                  key={item.complaintId}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  {/* ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600 whitespace-nowrap">
                    {item.complaintId}
                    <div className="mt-1">
                      <PriorityBadge priority={item.aiPriority} />
                    </div>
                  </td>

                  {/* Student & Department */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{item.studentName}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[170px]">
                      {item.department}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {item.category}
                    </span>
                  </td>

                  {/* Description & Location */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="line-clamp-2 text-slate-600 font-normal leading-relaxed">
                      {item.description}
                    </p>
                    {item.location && (
                      <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                        📍 {item.location}
                      </span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>

                  {/* Status Dropdown / Action */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <select
                        value={item.status}
                        disabled={updatingId === item.complaintId}
                        onChange={(e) => handleStatusSelect(item.complaintId, e.target.value)}
                        className={`text-xs font-semibold py-1 px-2.5 rounded-lg border outline-none cursor-pointer transition-all ${
                          item.status === 'Resolved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : item.status === 'In Progress'
                            ? 'bg-blue-50 text-blue-700 border-blue-300'
                            : 'bg-amber-50 text-amber-700 border-amber-300'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  </td>

                  {/* View Details Action */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => onSelectComplaint(item)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
                      title="Inspect Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
