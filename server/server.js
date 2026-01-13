const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

if (!process.env.MONGODB_URI) {
  console.error('Error: MONGODB_URI environment variable is not set.');
  console.error('Please create a .env file in the root directory with MONGODB_URI defined.');
  console.error('You can copy env.example to .env and update the values.');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    const errorMessage = err.message || '';
    const errorString = JSON.stringify(err);

    if (errorMessage.includes('ECONNREFUSED') || errorString.includes('ECONNREFUSED')) {
      console.error('\nMongoDB connection error: Could not connect to MongoDB server.');
      console.error('   The MongoDB server is not running or not accessible.');
      console.error('\n   To fix this:');
      console.error('   1. Make sure MongoDB is installed on your system');
      console.error('   2. Start MongoDB service:');
      console.error('      - Windows: Start MongoDB service from Services or run "mongod"');
      console.error('      - macOS/Linux: Run "mongod" or "brew services start mongodb-community"');
      console.error('   3. Or use MongoDB Atlas (cloud) and update MONGODB_URI in .env');
      console.error(`\n   Current connection string: ${process.env.MONGODB_URI}\n`);
    } else if (errorMessage.includes('whitelist') || errorMessage.includes('IP') || errorString.includes('whitelist') || errorString.includes('Atlas')) {
      console.error('\nMongoDB Atlas connection error: IP address not whitelisted.');
      console.error('   Your current IP address is not on the MongoDB Atlas IP Access List.');
      console.error('\n   To fix this:');
      console.error('   1. Log into MongoDB Atlas: https://cloud.mongodb.com/');
      console.error('   2. Go to your project -> Network Access (or Security -> Network Access)');
      console.error('   3. Click "Add IP Address" or "Add Current IP Address"');
      console.error('   4. Or add 0.0.0.0/0 to allow access from anywhere (less secure, only for development)');
      console.error('   5. Wait a few minutes for the changes to take effect');
      console.error('   6. Restart your server');
      console.error('\n   Documentation: https://www.mongodb.com/docs/atlas/security-whitelist/');
      console.error(`\n   Current connection string: ${process.env.MONGODB_URI}\n`);
    } else {
      console.error('MongoDB connection error:', err.message || err);
    }
  });

const authRoutes = require('./routes/authRoutes');
const tutorRoutes = require('./routes/tutorRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
// const messageRoutes = require('./routes/messageRoutes');
const moduleRoutes = require('./routes/moduleRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const reportRoutes = require('./routes/reportRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/sessions', sessionRoutes);
// app.use('/api/messages', messageRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Synapse API is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;

const initAdmin = require('./scripts/initAdmin');

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await initAdmin();
});

module.exports = app;

