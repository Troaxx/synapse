const User = require('../models/User');

const adminAuth = async (req, res, next) => {
    try {
        // req.user is already attached by the auth middleware
        const user = await User.findById(req.user.userId);

        if (!user || (!user.isAdmin)) {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        // Attach full user object if needed, or just proceed
        req.userData = user;
        next();
    } catch (error) {
        console.error('Admin auth error:', error);
        res.status(500).json({ message: 'Server error during admin verification' });
    }
};

module.exports = adminAuth;
