const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  getDashboardStats,
  seedDatabase,
} = require('../controllers/complaintController');

// Stats route (place before :id to prevent collision)
router.get('/stats/summary', getDashboardStats);

// Seed route
router.post('/seed', seedDatabase);

// Main Complaint CRUD routes
router.route('/')
  .get(getAllComplaints)
  .post(createComplaint);

router.route('/:id')
  .get(getComplaintById);

router.patch('/:id/status', updateComplaintStatus);

module.exports = router;
