const Report = require('../models/Report');

exports.createReport = async (req, res) => {
    try {
        const { reportedUserId, sessionId, reason, details } = req.body;

        const report = new Report({
            reporter: req.user.userId,
            reportedUser: reportedUserId,
            session: sessionId || null,
            reason,
            details
        });

        await report.save();

        res.status(201).json({ message: 'Report submitted successfully', report });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
