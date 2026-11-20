require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Complaint = require('./models/Complaint');
const User = require('./models/User');
const seedData = require('./data/seedData');
const { DEMO_USERS } = require('./controllers/authController');

const runSeed = async () => {
  console.log('--- Initializing Smart Campus MongoDB Seeder ---');
  const connected = await connectDB();
  if (!connected) {
    console.error('Cannot seed: MongoDB connection failed.');
    process.exit(1);
  }

  try {
    // 1. Seed Demo Users
    await User.deleteMany({});
    const users = await User.insertMany(DEMO_USERS);
    console.log(`Successfully populated ${users.length} authentication accounts.`);
    console.log('\nDemo Logins Available:');
    users.forEach((u) => {
      console.log(`  * [${u.role.toUpperCase()}] Email: ${u.email} | Password: ${u.password} | Name: ${u.name}`);
    });

    // 2. Seed Complaints
    await Complaint.deleteMany({});
    const created = await Complaint.insertMany(seedData);
    console.log(`\nSuccessfully populated ${created.length} complaints with AI triage metrics.`);
    console.log('\nSample Complaint IDs generated:');
    created.forEach((c) => {
      console.log(`  * ${c.complaintId} | ${c.studentName} | ${c.category} | [${c.status}] | AI: ${c.aiPriority}`);
    });

    console.log('\nSeeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

runSeed();
