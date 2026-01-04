const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function fixAdminEmail() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const User = require('./models/User');

    // Find admin user (by isAdmin flag, not email)
    const admin = await User.findOne({ isAdmin: true });

    if (!admin) {
        console.log('No admin user found!');
        await mongoose.disconnect();
        return;
    }

    console.log('Found admin user:');
    console.log('  Current email:', JSON.stringify(admin.email));
    console.log('  Email char codes:', [...admin.email].map(c => c.charCodeAt(0)).join(', '));

    // Set the correct email and password
    const correctEmail = 'TemasekIIT@tp.edu.sg';
    const correctPassword = 'fweb123';
    const hashedPassword = await bcrypt.hash(correctPassword, 10);

    console.log('\nFixing email and password...');

    await User.updateOne(
        { _id: admin._id },
        {
            $set: {
                email: correctEmail,
                password: hashedPassword
            }
        }
    );

    // Verify
    const updatedAdmin = await User.findOne({ email: correctEmail });
    if (updatedAdmin) {
        const passMatch = await bcrypt.compare(correctPassword, updatedAdmin.password);
        console.log('\n*** SUCCESS! Admin account fixed.');
        console.log('  Email:', updatedAdmin.email);
        console.log('  Password verified:', passMatch ? 'YES' : 'NO');
        console.log('\nYou can now login with:');
        console.log('  Email: TemasekIIT@tp.edu.sg');
        console.log('  Password: fweb123');
    } else {
        console.log('ERROR: Could not find admin after update!');
    }

    await mongoose.disconnect();
    console.log('\nDone.');
}

fixAdminEmail().catch(console.error);
