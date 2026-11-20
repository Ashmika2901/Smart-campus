/**
 * Smart Campus API Client with Dual-Mode Architecture:
 * 1. Primary: REST calls to Express.js & MongoDB
 * 2. Fallback: Browser LocalStorage with Local AI Triage Engine
 */

import { liveAiPredict } from './localAiEngine';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
const STORAGE_KEY = 'smart_campus_complaints_v1';

// Initial realistic seed complaints for offline / local-storage fallback
const INITIAL_FALLBACK_COMPLAINTS = [
  {
    complaintId: 'CMP-2026-1001',
    studentName: 'Aarav Sharma',
    department: 'Computer Science and Engineering',
    category: 'Classroom Projector',
    description: 'Projector in Room LH-302 flickers repeatedly and turns off after 10 minutes of display. Scheduled lecture presentations are getting disrupted.',
    location: 'Lecture Hall Complex LH-302',
    status: 'In Progress',
    adminRemarks: 'Assigned to AV technician Mr. Ramesh. Replacement HDMI cable and bulb ordered.',
    aiPriority: 'High',
    aiUrgencyScore: 72,
    aiSuggestedCategory: 'Classroom Projector',
    aiResolutionEtaHours: 12,
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    resolvedAt: null,
    timeline: [
      { status: 'Pending', updatedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(), note: 'Complaint registered by student.' },
      { status: 'In Progress', updatedAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(), note: 'Technician dispatched to inspect projector bulb.' }
    ]
  },
  {
    complaintId: 'CMP-2026-1002',
    studentName: 'Sneha Patel',
    department: 'Information Technology',
    category: 'Wi-Fi / Internet',
    description: 'Wi-Fi access point in 3rd Floor Library Silent Zone is constantly dropping connections and shows DNS probe finished bad config error.',
    location: 'Central Library, 3rd Floor',
    status: 'Pending',
    adminRemarks: '',
    aiPriority: 'High',
    aiUrgencyScore: 68,
    aiSuggestedCategory: 'Wi-Fi / Internet',
    aiResolutionEtaHours: 12,
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    resolvedAt: null,
    timeline: [
      { status: 'Pending', updatedAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(), note: 'Complaint registered by student.' }
    ]
  },
  {
    complaintId: 'CMP-2026-1003',
    studentName: 'Rohan Deshmukh',
    department: 'Mechanical Engineering',
    category: 'Drinking Water',
    description: 'Water cooler near Workshop B is leaking heavily and the water dispensed is lukewarm with low pressure.',
    location: 'Mechanical Workshop Block B',
    status: 'Resolved',
    adminRemarks: 'Compressor serviced and leak repaired with new valve. Water temperature verified cold.',
    aiPriority: 'Medium',
    aiUrgencyScore: 55,
    aiSuggestedCategory: 'Drinking Water',
    aiResolutionEtaHours: 24,
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    timeline: [
      { status: 'Pending', updatedAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(), note: 'Complaint registered.' },
      { status: 'In Progress', updatedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(), note: 'Plumbing and HVAC team dispatched.' },
      { status: 'Resolved', updatedAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(), note: 'Compressor serviced and valve replaced.' }
    ]
  },
  {
    complaintId: 'CMP-2026-1004',
    studentName: 'Priya Sundaram',
    department: 'Electronics and Communication Engineering',
    category: 'Laboratory Equipment',
    description: 'Digital Storage Oscilloscope at Bench 04 in Communication Systems Lab shows no trace and power button gives a spark when pressed.',
    location: 'ECE Department, Lab 204, Bench 04',
    status: 'In Progress',
    adminRemarks: 'Safety hazard flagged by AI. Bench isolated immediately. Instrument sent for warranty calibration.',
    aiPriority: 'Critical',
    aiUrgencyScore: 92,
    aiSuggestedCategory: 'Laboratory Equipment',
    aiResolutionEtaHours: 4,
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    resolvedAt: null,
    timeline: [
      { status: 'Pending', updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), note: 'Emergency spark hazard flagged.' },
      { status: 'In Progress', updatedAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(), note: 'Lab attendant tagged instrument out-of-order.' }
    ]
  },
  {
    complaintId: 'CMP-2026-1005',
    studentName: 'Kavya Nair',
    department: 'Computer Science and Business Systems',
    category: 'Washroom Maintenance',
    description: 'Washroom on 2nd Floor of Academic Block A has continuous flush leakage and soap dispensers have been empty since yesterday.',
    location: 'Academic Block A, 2nd Floor Restroom',
    status: 'Pending',
    adminRemarks: '',
    aiPriority: 'Medium',
    aiUrgencyScore: 48,
    aiSuggestedCategory: 'Washroom Maintenance',
    aiResolutionEtaHours: 24,
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    resolvedAt: null,
    timeline: [
      { status: 'Pending', updatedAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(), note: 'Complaint registered.' }
    ]
  },
  {
    complaintId: 'CMP-2026-1006',
    studentName: 'Aditya Verma',
    department: 'Electrical and Electronics Engineering',
    category: 'Hostel Maintenance',
    description: 'Ceiling fan in Hostel Room 314 makes an extremely loud grinding noise and wobbles alarmingly on medium speed.',
    location: 'Boys Hostel 2, Room 314',
    status: 'Resolved',
    adminRemarks: 'Capacitor and ball bearing replaced by hostel electrician.',
    aiPriority: 'Medium',
    aiUrgencyScore: 50,
    aiSuggestedCategory: 'Hostel Maintenance',
    aiResolutionEtaHours: 24,
    createdAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 30 * 3600 * 1000).toISOString(),
    timeline: [
      { status: 'Pending', updatedAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString(), note: 'Complaint logged.' },
      { status: 'In Progress', updatedAt: new Date(Date.now() - 60 * 3600 * 1000).toISOString(), note: 'Maintenance slip generated.' },
      { status: 'Resolved', updatedAt: new Date(Date.now() - 30 * 3600 * 1000).toISOString(), note: 'Bearing replacement completed.' }
    ]
  },
  {
    complaintId: 'CMP-2026-1007',
    studentName: 'Vikram Joshi',
    department: 'Civil Engineering',
    category: 'Laboratory Equipment',
    description: 'Universal Testing Machine in Strength of Materials Lab is reporting calibration error code E-04 during tensile testing experiment.',
    location: 'Civil SOM Lab, Ground Floor',
    status: 'Pending',
    adminRemarks: '',
    aiPriority: 'High',
    aiUrgencyScore: 70,
    aiSuggestedCategory: 'Laboratory Equipment',
    aiResolutionEtaHours: 12,
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    resolvedAt: null,
    timeline: [
      { status: 'Pending', updatedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), note: 'Registered by student lab representative.' }
    ]
  }
];

// Helper to get complaints from localStorage
function getLocalComplaints() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FALLBACK_COMPLAINTS));
      return INITIAL_FALLBACK_COMPLAINTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_FALLBACK_COMPLAINTS;
  }
}

// Helper to save complaints to localStorage
function saveLocalComplaints(complaints) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

/**
 * Check backend health
 */
export async function checkBackendConnection() {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(1500) });
    if (!res.ok) return { connected: false, mode: 'local' };
    const data = await res.json();
    return {
      connected: true,
      database: data.database || 'connected',
      mode: 'mongodb',
    };
  } catch (err) {
    return { connected: false, mode: 'local' };
  }
}

/**
 * Fetch all complaints with filters
 */
export async function getComplaints(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'All') params.append('status', filters.status);
    if (filters.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters.department && filters.department !== 'All') params.append('department', filters.department);
    if (filters.priority && filters.priority !== 'All') params.append('priority', filters.priority);
    if (filters.search) params.append('search', filters.search);

    const res = await fetch(`${API_BASE}/complaints?${params.toString()}`, {
      signal: AbortSignal.timeout(2500),
    });

    if (res.ok) {
      const data = await res.json();
      return { success: true, data: data.data, source: 'mongodb' };
    }
  } catch (error) {
    // Backend unreachable -> use localStorage fallback
  }

  // Local fallback filtering
  let list = getLocalComplaints();

  if (filters.status && filters.status !== 'All') {
    list = list.filter(c => c.status === filters.status);
  }
  if (filters.category && filters.category !== 'All') {
    list = list.filter(c => c.category === filters.category);
  }
  if (filters.department && filters.department !== 'All') {
    list = list.filter(c => c.department === filters.department);
  }
  if (filters.priority && filters.priority !== 'All') {
    list = list.filter(c => c.aiPriority === filters.priority);
  }
  if (filters.search && filters.search.trim()) {
    const q = filters.search.toLowerCase().trim();
    list = list.filter(c =>
      c.complaintId.toLowerCase().includes(q) ||
      c.studentName.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      (c.location && c.location.toLowerCase().includes(q))
    );
  }

  // Sort newest first
  list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return { success: true, data: list, source: 'local' };
}

/**
 * Get complaint by ID
 */
export async function getComplaintById(complaintId) {
  if (!complaintId || !complaintId.trim()) {
    return { success: false, message: 'Please provide a valid Complaint ID' };
  }

  const cleanId = complaintId.trim();

  try {
    const res = await fetch(`${API_BASE}/complaints/${encodeURIComponent(cleanId)}`, {
      signal: AbortSignal.timeout(2500),
    });

    if (res.ok) {
      const data = await res.json();
      return { success: true, data: data.data, source: 'mongodb' };
    }
  } catch (error) {
    // fallback
  }

  const list = getLocalComplaints();
  const match = list.find(c => c.complaintId.toLowerCase() === cleanId.toLowerCase());

  if (match) {
    return { success: true, data: match, source: 'local' };
  }

  return {
    success: false,
    message: `No complaint found with ID: ${cleanId}. Please check the ID and try again.`,
  };
}

/**
 * Submit a new complaint
 */
export async function submitComplaint(payload) {
  // Validate
  if (!payload.studentName?.trim()) {
    return { success: false, message: 'Student Name is required.' };
  }
  if (!payload.department) {
    return { success: false, message: 'Please select your Department.' };
  }
  if (!payload.category) {
    return { success: false, message: 'Please select a Complaint Category.' };
  }
  if (!payload.description || payload.description.trim().length < 10) {
    return { success: false, message: 'Description must be at least 10 characters long.' };
  }

  try {
    const res = await fetch(`${API_BASE}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const data = await res.json();
      return { success: true, data: data.data, message: data.message, source: 'mongodb' };
    }
  } catch (error) {
    // fallback
  }

  // Local AI evaluation
  const ai = liveAiPredict(`${payload.description} ${payload.location || ''}`);
  const list = getLocalComplaints();

  // Generate unique complaint ID
  const year = new Date().getFullYear();
  let maxSeq = 1000;
  list.forEach(c => {
    if (c.complaintId && c.complaintId.startsWith(`CMP-${year}-`)) {
      const num = parseInt(c.complaintId.split('-')[2], 10);
      if (!isNaN(num) && num > maxSeq) maxSeq = num;
    }
  });

  const complaintId = `CMP-${year}-${maxSeq + 1}`;

  const newComplaint = {
    complaintId,
    studentName: payload.studentName.trim(),
    department: payload.department,
    category: payload.category,
    description: payload.description.trim(),
    location: payload.location ? payload.location.trim() : 'Campus Premises',
    status: 'Pending',
    adminRemarks: '',
    aiPriority: ai.priority,
    aiUrgencyScore: ai.urgencyScore,
    aiSuggestedCategory: ai.suggestedCategory || payload.category,
    aiResolutionEtaHours: ai.etaHours,
    createdAt: new Date().toISOString(),
    resolvedAt: null,
    timeline: [
      {
        status: 'Pending',
        updatedAt: new Date().toISOString(),
        note: 'Complaint registered by student.',
      },
    ],
  };

  list.unshift(newComplaint);
  saveLocalComplaints(list);

  return {
    success: true,
    data: newComplaint,
    message: 'Complaint submitted successfully!',
    source: 'local',
  };
}

/**
 * Update Complaint Status (Admin)
 */
export async function updateComplaintStatus(complaintId, status, adminRemarks = '') {
  try {
    const res = await fetch(`${API_BASE}/complaints/${encodeURIComponent(complaintId)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminRemarks }),
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const data = await res.json();
      return { success: true, data: data.data, source: 'mongodb' };
    }
  } catch (error) {
    // fallback
  }

  const list = getLocalComplaints();
  const idx = list.findIndex(c => c.complaintId.toLowerCase() === complaintId.toLowerCase());

  if (idx === -1) {
    return { success: false, message: `Complaint ${complaintId} not found.` };
  }

  list[idx].status = status;
  if (adminRemarks) {
    list[idx].adminRemarks = adminRemarks;
  }
  if (status === 'Resolved' && !list[idx].resolvedAt) {
    list[idx].resolvedAt = new Date().toISOString();
  } else if (status !== 'Resolved') {
    list[idx].resolvedAt = null;
  }

  list[idx].timeline = list[idx].timeline || [];
  list[idx].timeline.push({
    status,
    updatedAt: new Date().toISOString(),
    note: adminRemarks ? `Status changed to ${status}: ${adminRemarks}` : `Status updated to ${status}`,
  });

  saveLocalComplaints(list);

  return { success: true, data: list[idx], source: 'local' };
}

/**
 * Fetch dynamic summary stats
 */
export async function getDashboardStats() {
  try {
    const res = await fetch(`${API_BASE}/complaints/stats/summary`, {
      signal: AbortSignal.timeout(2500),
    });

    if (res.ok) {
      const data = await res.json();
      return { success: true, data: data.data, source: 'mongodb' };
    }
  } catch (error) {
    // fallback
  }

  const list = getLocalComplaints();
  const total = list.length;
  const pending = list.filter(c => c.status === 'Pending').length;
  const inProgress = list.filter(c => c.status === 'In Progress').length;
  const resolved = list.filter(c => c.status === 'Resolved').length;
  const critical = list.filter(c => c.aiPriority === 'Critical').length;

  const catMap = {};
  list.forEach(c => {
    catMap[c.category] = (catMap[c.category] || 0) + 1;
  });
  const categoryStats = Object.entries(catMap).map(([k, v]) => ({ _id: k, count: v }));

  const deptMap = {};
  list.forEach(c => {
    deptMap[c.department] = (deptMap[c.department] || 0) + 1;
  });
  const departmentStats = Object.entries(deptMap).map(([k, v]) => ({ _id: k, count: v }));

  return {
    success: true,
    data: {
      total,
      pending,
      inProgress,
      resolved,
      critical,
      categoryStats,
      departmentStats,
      resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
    },
    source: 'local',
  };
}

/**
 * Reset / Re-seed sample data
 */
export function resetLocalSeedData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FALLBACK_COMPLAINTS));
  return INITIAL_FALLBACK_COMPLAINTS;
}

// ==========================================
// AUTHENTICATION CLIENT (STUDENT & ADMIN)
// ==========================================
const USER_STORAGE_KEY = 'smart_campus_user_v1';

const LOCAL_DEMO_USERS = [
  {
    _id: 'usr_admin_1',
    name: 'Facility Admin Officer',
    email: 'admin@campus.edu',
    password: 'admin123',
    role: 'admin',
    department: 'Campus Administration',
  },
  {
    _id: 'usr_student_1',
    name: 'Aarav Sharma',
    email: 'student@campus.edu',
    password: 'student123',
    role: 'student',
    department: 'Computer Science and Engineering',
    studentId: 'STU-2026-001',
  },
  {
    _id: 'usr_student_2',
    name: 'Sneha Patel',
    email: 'sneha@campus.edu',
    password: 'student123',
    role: 'student',
    department: 'Information Technology',
    studentId: 'STU-2026-002',
  },
];

/**
 * Login function
 */
export async function loginUser({ email, password, role }) {
  const cleanEmail = (email || '').toLowerCase().trim();

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, password, role }),
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
        return { success: true, user: data.user, message: data.message };
      }
    } else {
      const errData = await res.json().catch(() => ({}));
      return { success: false, message: errData.message || 'Invalid credentials' };
    }
  } catch (err) {
    // Fallback to local demo users
  }

  // Local authentication fallback
  const match = LOCAL_DEMO_USERS.find(
    (u) => u.email.toLowerCase() === cleanEmail && u.password === password
  );

  if (!match) {
    return {
      success: false,
      message: 'Invalid email or password. Use demo credentials or register.',
    };
  }

  if (role && match.role !== role) {
    return {
      success: false,
      message: `Account found, but you do not have ${role} privileges. Please switch to the ${match.role} login tab.`,
    };
  }

  const userObj = {
    _id: match._id,
    name: match.name,
    email: match.email,
    role: match.role,
    department: match.department,
    studentId: match.studentId,
  };

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userObj));
  return { success: true, user: userObj, message: `Welcome back, ${match.name}!` };
}

/**
 * Register student
 */
export async function registerUser({ name, email, password, department, studentId }) {
  const cleanEmail = (email || '').toLowerCase().trim();

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email: cleanEmail, password, department, studentId }),
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
        return { success: true, user: data.user, message: data.message };
      }
    } else {
      const errData = await res.json().catch(() => ({}));
      return { success: false, message: errData.message || 'Registration failed' };
    }
  } catch (err) {
    // Local fallback
  }

  const newUser = {
    _id: `usr_${Date.now()}`,
    name: name.trim(),
    email: cleanEmail,
    role: 'student',
    department: department || 'Computer Science and Engineering',
    studentId: studentId || `STU-${Date.now().toString().slice(-4)}`,
  };

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
  return { success: true, user: newUser, message: 'Account created successfully!' };
}

/**
 * Get active user from storage
 */
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Logout
 */
export function logoutUser() {
  localStorage.removeItem(USER_STORAGE_KEY);
}

