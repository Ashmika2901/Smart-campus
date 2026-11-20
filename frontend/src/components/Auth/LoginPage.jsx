import React, { useState } from 'react';
import {
  GraduationCap,
  Shield,
  Lock,
  Mail,
  User,
  Building,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { loginUser, registerUser } from '../../services/api';

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

export default function LoginPage({ onLoginSuccess, onGuestTrack }) {
  const [role, setRole] = useState('student'); // 'student' | 'admin'
  const [isRegistering, setIsRegistering] = useState(false); // for student signup

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Computer Science and Engineering');
  const [studentId, setStudentId] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Login submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      if (isRegistering && role === 'student') {
        if (!name.trim()) {
          setErrorMsg('Please enter your full name.');
          setLoading(false);
          return;
        }
        const res = await registerUser({
          name,
          email,
          password,
          department,
          studentId,
        });
        if (res.success) {
          onLoginSuccess(res.user);
        } else {
          setErrorMsg(res.message || 'Registration failed.');
        }
      } else {
        const res = await loginUser({ email, password, role });
        if (res.success) {
          onLoginSuccess(res.user);
        } else {
          setErrorMsg(res.message || 'Invalid credentials.');
        }
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Demo Login Handlers
  const handleQuickStudentLogin = async () => {
    setEmail('student@campus.edu');
    setPassword('student123');
    setLoading(true);
    setErrorMsg('');
    const res = await loginUser({
      email: 'student@campus.edu',
      password: 'student123',
      role: 'student',
    });
    setLoading(false);
    if (res.success) {
      onLoginSuccess(res.user);
    }
  };

  const handleQuickAdminLogin = async () => {
    setEmail('admin@campus.edu');
    setPassword('admin123');
    setLoading(true);
    setErrorMsg('');
    const res = await loginUser({
      email: 'admin@campus.edu',
      password: 'admin123',
      role: 'admin',
    });
    setLoading(false);
    if (res.success) {
      onLoginSuccess(res.user);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-fade-in">
        {/* Top Header Card */}
        <div className="p-8 pb-6 bg-gradient-to-b from-blue-50/70 to-white text-center border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-500/25 mb-4">
            {role === 'admin' ? (
              <Shield className="w-7 h-7" />
            ) : (
              <GraduationCap className="w-7 h-7" />
            )}
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {role === 'admin' ? 'Campus Admin Login' : isRegistering ? 'Create Student Account' : 'Student Portal Login'}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            {role === 'admin'
              ? 'Authorized facility officers & department management'
              : 'Submit, track and manage facility complaints with automated AI triage'}
          </p>

          {/* Role Switcher Pill Tabs */}
          <div className="mt-6 grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setRole('student');
                setErrorMsg('');
                setIsRegistering(false);
              }}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                role === 'student'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Student
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('admin');
                setErrorMsg('');
                setIsRegistering(false);
              }}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                role === 'admin'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-4 h-4" />
              Administrator
            </button>
          </div>
        </div>

        {/* Login / Register Form Body */}
        <div className="p-8 pt-6 space-y-5">
          {/* Quick Demo Login Pill */}
          <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-800">
                  {role === 'student' ? 'Demo Student Access' : 'Demo Admin Access'}
                </span>
                <p className="text-[11px] text-slate-500">
                  {role === 'student' ? 'student@campus.edu • student123' : 'admin@campus.edu • admin123'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={role === 'student' ? handleQuickStudentLogin : handleQuickAdminLogin}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all shrink-0 cursor-pointer"
            >
              1-Click Fill & Sign In
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* If Registering as student */}
            {isRegistering && role === 'student' && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Aarav Sharma"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Department
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white"
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Roll No / Student ID
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g., CS2026-104"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                {role === 'admin' ? 'Admin Email' : 'Student Email'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'admin' ? 'admin@campus.edu' : 'student@campus.edu'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                role === 'admin'
                  ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {role === 'admin'
                      ? 'Sign In as Administrator'
                      : isRegistering
                      ? 'Create Account & Sign In'
                      : 'Sign In to Student Portal'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Register / Login for students */}
          {role === 'student' && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setErrorMsg('');
                }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                {isRegistering
                  ? 'Already have an account? Sign in here'
                  : "First time here? Register as a new student"}
              </button>
            </div>
          )}

          {/* Guest track bypass link */}
          <div className="text-center pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onGuestTrack}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium inline-flex items-center gap-1"
            >
              <span>Just want to track an existing ticket?</span>
              <span className="font-bold text-blue-600 hover:underline">Track without login →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
