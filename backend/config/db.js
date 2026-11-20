const mongoose = require('mongoose');

const connectDB = async () => {
  let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_campus_cm';

  const connectOptions = {
    dbName: 'smart_campus_cm', // Always guarantees the database is smart_campus_cm even if URI is just mongodb://localhost:27017/
    serverSelectionTimeoutMS: 4000,
  };

  try {
    // Attempt 1: Try configured URI
    const conn = await mongoose.connect(uri, connectOptions);
    console.log(`[MongoDB Connected]: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);
    console.log(`🧭 [MongoDB Compass Ready]:`);
    console.log(`   Connected to: ${uri}`);
    console.log(`   Database: "${conn.connection.name}" | Collection: "complaints"`);
    return true;
  } catch (error) {
    // Attempt 2: If 'localhost' had an IPv6/IPv4 lookup issue on Windows, retry with 127.0.0.1
    if (uri.includes('localhost')) {
      const fallbackUri = uri.replace('localhost', '127.0.0.1');
      console.log(`[MongoDB Compass Info] Retrying with IPv4 fallback (${fallbackUri})...`);
      try {
        const conn = await mongoose.connect(fallbackUri, connectOptions);
        console.log(`[MongoDB Connected via IPv4]: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);
        return true;
      } catch (fallbackError) {
        console.error(`[MongoDB Connection Error]: ${fallbackError.message}`);
      }
    } else {
      console.error(`[MongoDB Connection Error]: ${error.message}`);
    }

    console.warn(`Tip for MongoDB Compass:`);
    console.warn(`   • Ensure MongoDB Compass is connected to: mongodb://localhost:27017/`);
    console.warn(`   • Make sure the MongoDB Community Server service (mongod) is running on your machine.`);
    return false;
  }
};

module.exports = connectDB;
