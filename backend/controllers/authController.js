const User = require('../models/User');

const DEMO_USERS = [
  {
    name: 'Facility Admin Officer',
    email: 'admin@campus.edu',
    password: 'admin123',
    role: 'admin',
    department: 'Campus Administration',
  },
  {
    name: 'Aarav Sharma',
    email: 'student@campus.edu',
    password: 'student123',
    role: 'student',
    department: 'Computer Science and Engineering',
    studentId: 'STU-2026-001',
  },
  {
    name: 'Sneha Patel',
    email: 'sneha@campus.edu',
    password: 'student123',
    role: 'student',
    department: 'Information Technology',
    studentId: 'STU-2026-002',
  },
];

/**
 * @desc    Login for Student or Admin
 * @route   POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check in MongoDB
    let user = await User.findOne({ email: cleanEmail });

    // Fallback: If database is new/empty, check against DEMO_USERS and auto-persist
    if (!user) {
      const demoMatch = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === cleanEmail && u.password === password
      );
      if (demoMatch) {
        try {
          user = await User.create(demoMatch);
        } catch (e) {
          user = demoMatch;
        }
      }
    }

    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.',
      });
    }

    // Role check (if specified)
    if (role && user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `Account found, but you do not have ${role} privileges. Please switch to the ${user.role} login tab.`,
      });
    }

    // Return user without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      studentId: user.studentId,
    };

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: userResponse,
      token: `token_${user.role}_${Date.now()}`,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login: ' + error.message,
    });
  }
};

/**
 * @desc    Student Registration
 * @route   POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { name, email, password, department, studentId } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists. Please log in.',
      });
    }

    const newUser = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      role: 'student',
      department: department || 'Computer Science and Engineering',
      studentId: studentId ? studentId.trim() : `STU-${Date.now().toString().slice(-4)}`,
    });

    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      studentId: newUser.studentId,
    };

    return res.status(201).json({
      success: true,
      message: 'Registration successful! You are now logged in.',
      user: userResponse,
      token: `token_student_${Date.now()}`,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create student account: ' + error.message,
    });
  }
};

/**
 * @desc    Seed initial users
 */
const seedUsers = async () => {
  try {
    for (const demo of DEMO_USERS) {
      const exists = await User.findOne({ email: demo.email });
      if (!exists) {
        await User.create(demo);
      }
    }
    console.log(`[Auth Seeder] Demo accounts verified in MongoDB.`);
  } catch (err) {
    console.warn(`[Auth Seeder Warning]: ${err.message}`);
  }
};

module.exports = {
  login,
  register,
  seedUsers,
  DEMO_USERS,
};
