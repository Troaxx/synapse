const jwt = require("jsonwebtoken");
const User = require("../models/User");


const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "No authentication token, access denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Check suspension
    try {
      const user = await User.findById(decoded.userId);
      if (
        user &&
        user.suspensionExpires &&
        new Date() < new Date(user.suspensionExpires)
      ) {
        return res.status(403).json({
          message: "Account suspended",
          reason: user.suspensionReason,
          expires: user.suspensionExpires,
        });
      }
    } catch (dbError) {
      console.error("Suspension check failed:", dbError);
      // Fail open (allow access) or fail closed (deny) depending on security policy.
      // Here we fail open to prevent DB glitches from locking everyone out,
      // but in high security apps this should likely be fail closed.
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = auth;
