const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: {
        values: [
          'Computer Science and Business Systems',
          'Computer Science and Engineering',
          'Information Technology',
          'Electronics and Communication Engineering',
          'Electrical and Electronics Engineering',
          'Mechanical Engineering',
          'Civil Engineering',
          'Other',
        ],
        message: '{VALUE} is not a valid department',
      },
    },
    category: {
      type: String,
      required: [true, 'Complaint category is required'],
      enum: {
        values: [
          'Classroom Projector',
          'Wi-Fi / Internet',
          'Drinking Water',
          'Laboratory Equipment',
          'Washroom Maintenance',
          'Hostel Maintenance',
          'Other',
        ],
        message: '{VALUE} is not a valid category',
      },
    },
    description: {
      type: String,
      required: [true, 'Complaint description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters long'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    location: {
      type: String,
      trim: true,
      default: 'Campus Premises',
      maxlength: [150, 'Location cannot exceed 150 characters'],
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved'],
      default: 'Pending',
      index: true,
    },
    adminRemarks: {
      type: String,
      trim: true,
      default: '',
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    // AI Triage & Analytics Attributes
    aiPriority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    aiUrgencyScore: {
      type: Number,
      min: 1,
      max: 100,
      default: 50,
    },
    aiSuggestedCategory: {
      type: String,
      default: '',
    },
    aiResolutionEtaHours: {
      type: Number,
      default: 24,
    },
    timeline: [
      {
        status: { type: String, required: true },
        updatedAt: { type: Date, default: Date.now },
        note: { type: String, default: '' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Helper static to generate sequential/unique complaint ID
ComplaintSchema.statics.generateComplaintId = async function () {
  const currentYear = new Date().getFullYear();
  const prefix = `CMP-${currentYear}-`;

  // Find the highest sequence number for this year
  const latest = await this.findOne({
    complaintId: new RegExp(`^${prefix}`),
  })
    .sort({ complaintId: -1 })
    .lean();

  let nextSeq = 1001;
  if (latest && latest.complaintId) {
    const parts = latest.complaintId.split('-');
    const currentSeq = parseInt(parts[2], 10);
    if (!isNaN(currentSeq)) {
      nextSeq = currentSeq + 1;
    }
  }

  // Double check uniqueness in case of race condition
  let candidate = `${prefix}${nextSeq}`;
  let exists = await this.exists({ complaintId: candidate });
  while (exists) {
    nextSeq += 1;
    candidate = `${prefix}${nextSeq}`;
    exists = await this.exists({ complaintId: candidate });
  }

  return candidate;
};

module.exports = mongoose.model('Complaint', ComplaintSchema);
