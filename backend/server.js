require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const complaintRoutes = require('./routes/complaintRoutes');
const authRoutes = require('./routes/authRoutes');
const Complaint = require('./models/Complaint');
const seedData = require('./data/seedData');
const { seedUsers } = require('./controllers/authController');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for development
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health & Status endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'Smart Campus Complaint Management System Backend with AI Triage & Auth',
    timestamp: new Date().toISOString(),
    database: require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);

// Root route
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; padding: 40px; text-align: center;">
      <h1 style="color: #2563eb;">Smart Campus Complaint Management System - Backend API</h1>
      <p style="color: #4b5563;">Node.js, Express, MongoDB with AI Triage Engine & User Authentication</p>
      <p>Endpoints: <a href="/api/health">/api/health</a> | <a href="/api/complaints">/api/complaints</a> | <a href="/api/complaints/stats/summary">/api/complaints/stats/summary</a></p>
    </div>
  `);
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Connect to MongoDB and Start Server
const startServer = async () => {
  const isDbConnected = await connectDB();

  if (isDbConnected) {
    try {
      // Seed initial demo accounts (admin & student)
      await seedUsers();

      // Seed complaints if empty
      const count = await Complaint.countDocuments();
      if (count === 0) {
        console.log('[Auto-Seed] Database is empty. Inserting demo complaints...');
        await Complaint.insertMany(seedData);
        console.log(`[Auto-Seed] Loaded ${seedData.length} initial complaints.`);
      } else {
        console.log(`[Database Ready] Found ${count} existing complaints in MongoDB.`);
      }
    } catch (seedErr) {
      console.warn('[Auto-Seed Warning]:', seedErr.message);
    }
  }

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Smart Campus Backend is running on port ${PORT}`);
    console.log(`🌐 Base URL: http://localhost:${PORT}`);
    console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth/login`);
    console.log(`📑 Complaints API: http://localhost:${PORT}/api/complaints`);
    console.log(`====================================================`);
  });
};

startServer();
