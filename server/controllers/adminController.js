const User = require('../models/User');
const Report = require('../models/Report');
const Notification = require('../models/Notification');

exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.find()
            .populate('reporter', 'name email admissionNumber')
            .populate('reportedUser', 'name email admissionNumber profilePhoto')
            .populate('session', 'subject date')
            .sort({ createdAt: -1 });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, bio, profilePhoto, reason } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields
        if (name !== undefined) user.name = name;
        if (bio !== undefined) user.bio = bio;
        if (profilePhoto !== undefined) user.profilePhoto = profilePhoto;

        await user.save();

        // Create notification
        await Notification.create({
            user: userId,
            title: 'Profile Updated by Admin',
            message: `Your profile details were updated by an administrator. Reason: ${reason || 'Policy violation/maintenance'}.`,
            type: 'warning'
        });

        res.json({ message: 'User profile updated and notification sent', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.dismissReport = async (req, res) => {
    try {
        const { reportId } = req.params;
        const report = await Report.findById(reportId);
        if (!report) return res.status(404).json({ message: 'Report not found' });

        report.status = 'Dismissed';
        await report.save();
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.resolveReport = async (req, res) => {
    try {
        const { reportId } = req.params;
        const { suspensionHours, suspensionReason } = req.body;

        const report = await Report.findById(reportId);
        if (!report) return res.status(404).json({ message: 'Report not found' });

        // Handle Suspension
        if (suspensionHours && suspensionHours > 0) {
            const userToSuspend = await User.findById(report.reportedUser);
            if (userToSuspend) {
                const expires = new Date();
                expires.setHours(expires.getHours() + parseInt(suspensionHours));

                userToSuspend.suspensionExpires = expires;
                userToSuspend.suspensionReason = suspensionReason || 'Violation of terms';
                await userToSuspend.save();

                // Also create a notification for the user
                await Notification.create({
                    user: userToSuspend._id,
                    title: 'Account Suspended',
                    message: `Your account has been suspended for ${suspensionHours} hours. Reason: ${suspensionReason || 'Violation of terms'}.`,
                    type: 'error'
                });
            }
        }

        report.status = 'Resolved';
        await report.save();
        res.json(report);
    } catch (error) {
        console.error('Resolve Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
