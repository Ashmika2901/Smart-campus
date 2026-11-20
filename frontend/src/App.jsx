import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import LoginPage from './components/Auth/LoginPage';
import ComplaintForm from './components/StudentPortal/ComplaintForm';
import ComplaintTracker from './components/StudentPortal/ComplaintTracker';
import StudentComplaintList from './components/StudentPortal/StudentComplaintList';
import StatCards from './components/AdminDashboard/StatCards';
import ComplaintTable from './components/AdminDashboard/ComplaintTable';
import ComplaintDetailModal from './components/AdminDashboard/ComplaintDetailModal';
import AiAnalyticsView from './components/AdminDashboard/AiAnalyticsView';
import AdminSidebar from './components/AdminDashboard/AdminSidebar';
import {
  getComplaints,
  getDashboardStats,
  updateComplaintStatus,
  checkBackendConnection,
  resetLocalSeedData,
  getCurrentUser,
  logoutUser,
} from './services/api';
import {
  PlusCircle,
  Search,
  List,
  Sparkles,
  Building,
  GraduationCap,
  ShieldAlert,
} from 'lucide-react';

export default function App() {
  // Auth state
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [showLoginModal, setShowLoginModal] = useState(() => !getCurrentUser());

  // Active module & view
  const [activeTab, setActiveTab] = useState(() => {
    const user = getCurrentUser();
    return user?.role === 'admin' ? 'admin' : 'student';
  });
  const [studentSubTab, setStudentSubTab] = useState('submit'); // 'submit' | 'track' | 'list'
  const [adminView, setAdminView] = useState('complaints'); // 'complaints' | 'analytics'

  // Data states
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    critical: 0,
    resolutionRate: 0,
  });

  // Admin filter states
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected complaint for modal
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [trackedId, setTrackedId] = useState('');

  // Toast notification
  const [toast, setToast] = useState(null);

  // Backend connection status
  const [backendInfo, setBackendInfo] = useState({ connected: false, mode: 'local' });

  // Load backend status
  useEffect(() => {
    checkBackendConnection().then((info) => {
      setBackendInfo(info);
    });
  }, []);

  // Fetch complaints & stats
  const loadData = useCallback(async () => {
    try {
      const [complaintsRes, statsRes] = await Promise.all([
        getComplaints({
          status: statusFilter,
          category: categoryFilter,
          department: departmentFilter,
          search: searchTerm,
        }),
        getDashboardStats(),
      ]);

      if (complaintsRes.success) {
        setComplaints(complaintsRes.data);
      }
      if (statsRes.success) {
        setStats(statsRes.data);
      }
    } catch (err) {
      console.error('Failed to load complaints:', err);
    }
  }, [statusFilter, categoryFilter, departmentFilter, searchTerm]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auth Handlers
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setShowLoginModal(false);
    setActiveTab(user.role === 'admin' ? 'admin' : 'student');
    setToast({
      type: 'success',
      message: `Signed in successfully as ${user.name} (${user.role.toUpperCase()})`,
    });
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setShowLoginModal(true);
    setToast({
      type: 'success',
      message: 'You have been signed out.',
    });
  };

  // Complaint submission from student
  const handleComplaintSubmitted = (newComplaint) => {
    setToast({
      type: 'success',
      message: `Complaint ${newComplaint.complaintId} submitted! Priority: ${newComplaint.aiPriority}`,
    });
    loadData();
  };

  // Switch to Track Complaint with ID
  const handleTrackComplaint = (complaintId) => {
    setTrackedId(complaintId);
    setShowLoginModal(false);
    setActiveTab('student');
    setStudentSubTab('track');
  };

  // Quick status update from table or modal
  const handleStatusUpdate = async (complaintId, newStatus, remarks = '') => {
    const res = await updateComplaintStatus(complaintId, newStatus, remarks);
    if (res.success) {
      setToast({
        type: 'success',
        message: `Complaint ${complaintId} marked as ${newStatus}`,
      });
      loadData();
      if (selectedComplaint && selectedComplaint.complaintId === complaintId) {
        setSelectedComplaint(res.data);
      }
    } else {
      setToast({
        type: 'error',
        message: res.message || 'Failed to update status',
      });
    }
  };

  // Reset seed data
  const handleResetSeedData = () => {
    if (window.confirm('Reset sample complaints to original demonstration dataset?')) {
      resetLocalSeedData();
      loadData();
      setToast({
        type: 'success',
        message: 'Sample demo dataset refreshed successfully.',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'admin' && currentUser?.role !== 'admin') {
            setToast({
              type: 'error',
              message: 'Administrator login required to access Admin Dashboard.',
            });
            setShowLoginModal(true);
            return;
          }
          setActiveTab(tab);
        }}
        backendInfo={backendInfo}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenLogin={() => setShowLoginModal(true)}
        onOpenQuickTrack={() => {
          setShowLoginModal(false);
          setActiveTab('student');
          setStudentSubTab('track');
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* LOGIN VIEW (When not logged in or explicitly requested) */}
        {showLoginModal ? (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onGuestTrack={() => {
              setShowLoginModal(false);
              setActiveTab('student');
              setStudentSubTab('track');
            }}
          />
        ) : (
          <>
            {/* ======================================================== */}
            {/* STUDENT PORTAL MODULE                                    */}
            {/* ======================================================== */}
            {activeTab === 'student' && (
              <div className="space-y-6">
                {/* Student Navigation Pill Tabs */}
                <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200/80 pb-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Student Helpdesk & Complaint Center
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Logged in as <strong>{currentUser?.name || 'Guest Student'}</strong> • Report facility issues with AI automated triage.
                    </p>
                  </div>

                  {/* Sub tabs */}
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      onClick={() => setStudentSubTab('submit')}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        studentSubTab === 'submit'
                          ? 'bg-white text-blue-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Submit Complaint
                    </button>

                    <button
                      onClick={() => setStudentSubTab('track')}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        studentSubTab === 'track'
                          ? 'bg-white text-blue-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Search className="w-3.5 h-3.5" />
                      Track Status
                    </button>

                    <button
                      onClick={() => setStudentSubTab('list')}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        studentSubTab === 'list'
                          ? 'bg-white text-blue-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <List className="w-3.5 h-3.5" />
                      All Complaints
                    </button>
                  </div>
                </div>

                {/* Sub-tab views */}
                {studentSubTab === 'submit' && (
                  <div className="max-w-3xl mx-auto">
                    <ComplaintForm
                      currentUser={currentUser}
                      onComplaintSubmitted={handleComplaintSubmitted}
                      onTrackComplaint={handleTrackComplaint}
                    />
                  </div>
                )}

                {studentSubTab === 'track' && (
                  <div className="max-w-3xl mx-auto">
                    <ComplaintTracker initialComplaintId={trackedId} />
                  </div>
                )}

                {studentSubTab === 'list' && (
                  <StudentComplaintList
                    complaints={complaints}
                    onTrackComplaint={handleTrackComplaint}
                    onRefresh={loadData}
                  />
                )}
              </div>
            )}

            {/* ======================================================== */}
            {/* ADMIN DASHBOARD MODULE                                   */}
            {/* ======================================================== */}
            {activeTab === 'admin' && (
              <div className="space-y-6">
                {/* Admin Access Check */}
                {currentUser?.role !== 'admin' ? (
                  <div className="max-w-md mx-auto p-8 rounded-3xl bg-white border border-rose-200 text-center shadow-lg space-y-4">
                    <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 mx-auto">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Administrator Access Required</h2>
                    <p className="text-xs text-slate-500">
                      You are currently logged in as a student ({currentUser?.name}). Please sign in with administrator credentials to view and manage campus complaints.
                    </p>
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      Switch to Administrator Login
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Top Dashboard Header */}
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                        Campus Facilities Administration
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {currentUser.name} (Officer)
                        </span>
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Centralized dashboard to review, triage, update, and resolve college facility maintenance tickets.
                      </p>
                    </div>

                    {/* 4 Summary Stat Cards */}
                    <StatCards
                      stats={stats}
                      onFilterByStatus={(st) => {
                        setStatusFilter(st);
                        setAdminView('complaints');
                      }}
                    />

                    {/* Admin Layout: Sidebar + Main Content */}
                    <div className="flex flex-col lg:flex-row gap-6 items-start">
                      <AdminSidebar
                        activeView={adminView}
                        setActiveView={setAdminView}
                        onResetSeedData={handleResetSeedData}
                        totalCount={stats.total}
                      />

                      <div className="flex-1 w-full min-w-0">
                        {adminView === 'complaints' ? (
                          <ComplaintTable
                            complaints={complaints}
                            onSelectComplaint={(c) => setSelectedComplaint(c)}
                            onQuickStatusChange={handleStatusUpdate}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            categoryFilter={categoryFilter}
                            setCategoryFilter={setCategoryFilter}
                            departmentFilter={departmentFilter}
                            setDepartmentFilter={setDepartmentFilter}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            onRefresh={loadData}
                          />
                        ) : (
                          <AiAnalyticsView complaints={complaints} stats={stats} />
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <ComplaintDetailModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onUpdateStatus={handleStatusUpdate}
        />
      )}

      {/* Floating Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
          <p className="font-semibold text-slate-700">
            Smart Campus Complaint Management System Using AI
          </p>
          <p className="mt-1 text-slate-400">
            MERN Stack (React.js, Vite, Node.js, Express.js, MongoDB Compass & Mongoose) with Role-Based Authentication
          </p>
        </div>
      </footer>
    </div>
  );
}
