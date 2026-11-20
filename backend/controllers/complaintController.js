const Complaint = require('../models/Complaint');
const { analyzeComplaint } = require('../services/aiTriageService');
const seedData = require('../data/seedData');

/**
 * @desc    Submit a new complaint with automatic AI triage
 * @route   POST /api/complaints
 */
const createComplaint = async (req, res) => {
  try {
    const { studentName, department, category, description, location } = req.body;

    // Manual Validation
    if (!studentName || !studentName.trim()) {
      return res.status(400).json({ success: false, message: 'Student name is required' });
    }
    if (!department) {
      return res.status(400).json({ success: false, message: 'Department is required' });
    }
    if (!category) {
      return res.status(400).json({ success: false, message: 'Complaint category is required' });
    }
    if (!description || description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Complaint description is required (at least 10 characters)',
      });
    }

    // Run AI Triage Engine
    const aiAnalysis = analyzeComplaint({
      description,
      userCategory: category,
      location,
    });

    // Generate Unique Complaint ID (CMP-YYYY-XXXX)
    const complaintId = await Complaint.generateComplaintId();

    const newComplaint = new Complaint({
      complaintId,
      studentName: studentName.trim(),
      department,
      category,
      description: description.trim(),
      location: location ? location.trim() : 'Campus Premises',
      status: 'Pending',
      aiPriority: aiAnalysis.aiPriority,
      aiUrgencyScore: aiAnalysis.aiUrgencyScore,
      aiSuggestedCategory: aiAnalysis.aiSuggestedCategory,
      aiResolutionEtaHours: aiAnalysis.aiResolutionEtaHours,
      timeline: [
        {
          status: 'Pending',
          updatedAt: new Date(),
          note: 'Complaint registered and assigned to AI triage.',
        },
      ],
    });

    const savedComplaint = await newComplaint.save();

    return res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully!',
      data: savedComplaint,
    });
  } catch (error) {
    console.error('Error creating complaint:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit complaint. ' + error.message,
    });
  }
};

/**
 * @desc    Get all complaints with optional filtering and search
 * @route   GET /api/complaints
 */
const getAllComplaints = async (req, res) => {
  try {
    const { status, category, department, search, priority } = req.query;

    const filter = {};

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (department && department !== 'All') {
      filter.department = department;
    }

    if (priority && priority !== 'All') {
      filter.aiPriority = priority;
    }

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { complaintId: { $regex: q, $options: 'i' } },
        { studentName: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } },
      ];
    }

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching complaints: ' + error.message,
    });
  }
};

/**
 * @desc    Get single complaint by unique complaint ID (or _id)
 * @route   GET /api/complaints/:id
 */
const getComplaintById = async (req, res) => {
  try {
    const idParam = req.params.id.trim();

    // Check by complaintId (e.g. CMP-2026-1001) or Mongo _id
    let complaint = await Complaint.findOne({
      complaintId: { $regex: new RegExp(`^${idParam}$`, 'i') },
    });

    if (!complaint && idParam.match(/^[0-9a-fA-F]{24}$/)) {
      complaint = await Complaint.findById(idParam);
    }

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `No complaint found with ID: ${idParam}. Please verify and try again.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    console.error('Error finding complaint:', error);
    return res.status(500).json({
      success: false,
      message: 'Error searching complaint: ' + error.message,
    });
  }
};

/**
 * @desc    Update complaint status and admin remarks
 * @route   PATCH /api/complaints/:id/status
 */
const updateComplaintStatus = async (req, res) => {
  try {
    const idParam = req.params.id.trim();
    const { status, adminRemarks } = req.body;

    const validStatuses = ['Pending', 'In Progress', 'Resolved'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    let complaint = await Complaint.findOne({
      complaintId: { $regex: new RegExp(`^${idParam}$`, 'i') },
    });

    if (!complaint && idParam.match(/^[0-9a-fA-F]{24}$/)) {
      complaint = await Complaint.findById(idParam);
    }

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `Complaint not found with ID: ${idParam}`,
      });
    }

    complaint.status = status;
    if (adminRemarks !== undefined) {
      complaint.adminRemarks = adminRemarks;
    }

    if (status === 'Resolved' && !complaint.resolvedAt) {
      complaint.resolvedAt = new Date();
    } else if (status !== 'Resolved') {
      complaint.resolvedAt = null;
    }

    // Add timeline milestone
    complaint.timeline.push({
      status,
      updatedAt: new Date(),
      note: adminRemarks ? `Status changed to ${status}: ${adminRemarks}` : `Status updated to ${status}`,
    });

    const updated = await complaint.save();

    return res.status(200).json({
      success: true,
      message: `Complaint ${complaint.complaintId} marked as ${status}`,
      data: updated,
    });
  } catch (error) {
    console.error('Error updating status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update status: ' + error.message,
    });
  }
};

/**
 * @desc    Get dynamic summary statistics and AI insights
 * @route   GET /api/complaints/stats/summary
 */
const getDashboardStats = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'Pending' });
    const inProgress = await Complaint.countDocuments({ status: 'In Progress' });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    const critical = await Complaint.countDocuments({ aiPriority: 'Critical' });

    // Category breakdown
    const categoryStats = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Department breakdown
    const departmentStats = await Complaint.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return res.status(200).json({
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
    });
  } catch (error) {
    console.error('Error computing stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate stats: ' + error.message,
    });
  }
};

/**
 * @desc    Seed demo database with realistic samples
 * @route   POST /api/complaints/seed
 */
const seedDatabase = async (req, res) => {
  try {
    await Complaint.deleteMany({});
    const created = await Complaint.insertMany(seedData);
    return res.status(200).json({
      success: true,
      message: `Successfully seeded ${created.length} complaints into MongoDB.`,
      count: created.length,
      data: created,
    });
  } catch (error) {
    console.error('Error seeding data:', error);
    return res.status(500).json({
      success: false,
      message: 'Seeding failed: ' + error.message,
    });
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  getDashboardStats,
  seedDatabase,
};
