/**
 * Seed data with realistic campus complaints across diverse departments and categories
 */
const seedComplaints = [
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
    createdAt: new Date(Date.now() - 36 * 3600 * 1000),
    resolvedAt: null,
    timeline: [
      { status: 'Pending', updatedAt: new Date(Date.now() - 36 * 3600 * 1000), note: 'Complaint registered by student.' },
      { status: 'In Progress', updatedAt: new Date(Date.now() - 18 * 3600 * 1000), note: 'Technician dispatched to inspect projector bulb.' }
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
    createdAt: new Date(Date.now() - 14 * 3600 * 1000),
    resolvedAt: null,
    timeline: [
      { status: 'Pending', updatedAt: new Date(Date.now() - 14 * 3600 * 1000), note: 'Complaint registered by student.' }
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
    createdAt: new Date(Date.now() - 72 * 3600 * 1000),
    resolvedAt: new Date(Date.now() - 20 * 3600 * 1000),
    timeline: [
      { status: 'Pending', updatedAt: new Date(Date.now() - 72 * 3600 * 1000), note: 'Complaint registered.' },
      { status: 'In Progress', updatedAt: new Date(Date.now() - 48 * 3600 * 1000), note: 'Plumbing and HVAC team dispatched.' },
      { status: 'Resolved', updatedAt: new Date(Date.now() - 20 * 3600 * 1000), note: 'Compressor serviced and valve replaced.' }
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
    createdAt: new Date(Date.now() - 24 * 3600 * 1000),
    resolvedAt: null,
    timeline: [
      { status: 'Pending', updatedAt: new Date(Date.now() - 24 * 3600 * 1000), note: 'Emergency spark hazard flagged.' },
      { status: 'In Progress', updatedAt: new Date(Date.now() - 20 * 3600 * 1000), note: 'Lab attendant tagged instrument out-of-order.' }
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
    createdAt: new Date(Date.now() - 8 * 3600 * 1000),
    resolvedAt: null,
    timeline: [
      { status: 'Pending', updatedAt: new Date(Date.now() - 8 * 3600 * 1000), note: 'Complaint registered.' }
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
    createdAt: new Date(Date.now() - 96 * 3600 * 1000),
    resolvedAt: new Date(Date.now() - 30 * 3600 * 1000),
    timeline: [
      { status: 'Pending', updatedAt: new Date(Date.now() - 96 * 3600 * 1000), note: 'Complaint logged.' },
      { status: 'In Progress', updatedAt: new Date(Date.now() - 60 * 3600 * 1000), note: 'Maintenance slip generated.' },
      { status: 'Resolved', updatedAt: new Date(Date.now() - 30 * 3600 * 1000), note: 'Bearing replacement completed.' }
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
    createdAt: new Date(Date.now() - 5 * 3600 * 1000),
    resolvedAt: null,
    timeline: [
      { status: 'Pending', updatedAt: new Date(Date.now() - 5 * 3600 * 1000), note: 'Registered by student lab representative.' }
    ]
  }
];

module.exports = seedComplaints;
