const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const initAdmin = async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            console.log('[System] ADMIN_EMAIL or ADMIN_PASSWORD not set in env. Skipping admin check.');
            return;
        }

        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            if (!existingAdmin.isAdmin) {
                console.log(`[System] User ${adminEmail} found but not admin. Promoting...`);
                existingAdmin.isAdmin = true;
                await existingAdmin.save({ validateBeforeSave: false });
                console.log(`[System] User ${adminEmail} promoted to Admin.`);
            } else {
                console.log(`[System] Admin account ${adminEmail} verified.`);
            }
        } else {
            console.log(`[System] Admin account ${adminEmail} not found. Creating...`);

            const hashedPassword = await bcrypt.hash(adminPassword, 10);

            // Generate a dummy admission number that satisfies the regex /^\d{7}[A-Z]$/
            // and a matching user ID
            const dummyAdminNo = '0000000A';

            const newAdmin = new User({
                userId: 'SYS_ADMIN_' + Date.now(),
                email: adminEmail,
                password: hashedPassword,
                name: 'System Administrator',
                admissionNumber: dummyAdminNo, // Mock to pass validation
                year: 'Year 3',
                course: 'System Admin',
                isAdmin: true,
                isTutor: false,
                profilePhoto: '',
                bio: 'System Administrator Account'
            });

            // We use validateBeforeSave: false to bypass strict email/admission number matching logic
            // that might be present in pre-save hooks (though none observed in User.js, better safe)
            // But wait, the validation logic I saw (regex) was in the CONTROLLER, not the MODEL.
            // The model only has unique/required constraints.
            // However, the `admissionNumber` field in model doesn't have a regex validator.
            // It just says type string, unique true.
            await newAdmin.save();
            console.log(`[System] Admin account ${adminEmail} created successfully.`);
        }

    } catch (error) {
        console.error('[System] Failed to initialize admin account:', error.message);
        // Don't crash the server, just log the error
    }
};

module.exports = initAdmin;
