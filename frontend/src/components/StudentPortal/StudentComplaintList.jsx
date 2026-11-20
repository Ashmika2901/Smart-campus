import React, { useState } from 'react';
import {
  ListFilter,
  Search,
  ExternalLink,
  Calendar,
  Layers,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import StatusBadge from '../StatusBadge';
import PriorityBadge from '../PriorityBadge';

export default function StudentComplaintList({
  complaints = [],
  onTrackComplaint,
  onRefresh,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Filter complaints
  const filtered = complaints.filter((c) => {
    const matchesSearch =
      !searchTerm.trim() ||
      c.complaintId.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      c.studentName.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase().trim());

    const matchesCategory =
      categoryFilter === 'All' || c.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ListFilter className="w-6 h-6 text-blue-600" />
            Submitted Complaints
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Browse through campus issues, monitor their real-time resolution state, and inspect logs.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors w-fit"
          title="Refresh List"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, name, or keywords..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm outline-none transition-all"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white text-sm outline-none text-slate-700"
        >
          <option value="All">All Categories</option>
          <option value="Classroom Projector">Classroom Projector</option>
          <option value="Wi-Fi / Internet">Wi-Fi / Internet</option>
          <option value="Drinking Water">Drinking Water</option>
          <option value="Laboratory Equipment">Laboratory Equipment</option>
          <option value="Washroom Maintenance">Washroom Maintenance</option>
          <option value="Hostel Maintenance">Hostel Maintenance</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Structured Table / Responsive Cards */}
      <div className="mt-6">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            <p className="text-sm font-semibold text-slate-600">No complaints found</p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search query or submitting a new complaint.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Complaint ID</th>
                  <th className="py-3 px-4">Student & Dept</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr
                    key={item.complaintId}
                    className="hover:bg-blue-50/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 whitespace-nowrap">
                      {item.complaintId}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{item.studentName}</div>
                      <div className="text-xs text-slate-500 truncate max-w-[180px]">
                        {item.department}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 whitespace-nowrap">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="line-clamp-2 text-xs text-slate-600">
                        {item.description}
                      </p>
                      {item.location && (
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" /> {item.location}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onTrackComplaint(item.complaintId)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                      >
                        Track <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
