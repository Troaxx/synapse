const mongoose = require('mongoose');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const setAdmin = async () => {
    const email = process.argv[2];

    if (!email) {
        console.error('Please provide an email address: node setAdmin.js <email>');
        process.exit(1);
    }

    try {
        // Connect to DB (copying connection string from server.js would be best, but utilizing dotenv)
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to Database');

        // Use regex for case-insensitive search to handle legacy data issues
        const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
        if (!user) {
            console.error('User not found with email:', email);
            process.exit(1);
        }

        user.isAdmin = true;
        await user.save({ validateBeforeSave: false });

        console.log(`Success! User ${user.name} (${user.email}) is now an Admin.`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

setAdmin();
