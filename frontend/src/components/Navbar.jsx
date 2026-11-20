import React from 'react';
import {
  GraduationCap,
  Sparkles,
  LayoutDashboard,
  UserCheck,
  Database,
  Search,
  LogOut,
  User,
  Shield,
  LogIn,
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  backendInfo,
  currentUser,
  onLogout,
  onOpenLogin,
  onOpenQuickTrack,
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  Smart Campus
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-sky-500/10 text-indigo-700 border border-indigo-200/50">
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  AI Triage
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Complaint Resolution & Facility Management
              </p>
            </div>
          </div>

          {/* Module Navigation Tabs (Only if logged in or allowed) */}
          {currentUser && (
            <div className="flex items-center gap-1 sm:gap-2 bg-slate-100/90 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setActiveTab('student')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'student'
                    ? 'bg-white text-blue-700 shadow-sm border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                Student Portal
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'admin'
                    ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Admin Dashboard
              </button>
            </div>
          )}

          {/* User Profile & Right-Hand Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenQuickTrack}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
              title="Track by Complaint ID"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              Track ID
            </button>

            {/* Connection badge */}
            <div
              className={`hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                backendInfo.connected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-sky-50 text-sky-700 border-sky-200'
              }`}
              title={
                backendInfo.connected
                  ? 'Connected to Express & MongoDB Compass'
                  : 'Running with LocalStorage & AI fallback persistence'
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  backendInfo.connected ? 'bg-emerald-500 animate-pulse' : 'bg-sky-500'
                }`}
              />
              <Database className="w-3 h-3 opacity-70" />
              <span>{backendInfo.connected ? 'Compass Online' : 'Local Mode'}</span>
            </div>

            {/* Logged in User Profile or Login CTA */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-xl">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                      currentUser.role === 'admin'
                        ? 'bg-gradient-to-tr from-indigo-600 to-purple-600'
                        : 'bg-gradient-to-tr from-blue-600 to-sky-500'
                    }`}
                  >
                    {currentUser.role === 'admin' ? (
                      <Shield className="w-3.5 h-3.5" />
                    ) : (
                      currentUser.name.charAt(0)
                    )}
                  </div>
                  <div className="hidden sm:block text-left text-xs">
                    <p className="font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                      {currentUser.name}
                    </p>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider ${
                        currentUser.role === 'admin' ? 'text-indigo-600' : 'text-blue-600'
                      }`}
                    >
                      {currentUser.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                  title="Sign Out / Switch Role"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
