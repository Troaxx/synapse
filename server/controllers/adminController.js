const User = require("../models/User");
const Report = require("../models/Report");
const Notification = require("../models/Notification");

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("reporter", "name email admissionNumber")
      .populate("reportedUser", "name email admissionNumber profilePhoto")
      .populate("session", "subject date")
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, bio, profilePhoto, reason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields
    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (profilePhoto !== undefined) user.profilePhoto = profilePhoto;

    await user.save();

    // Create notification
    await Notification.create({
      user: userId,
      title: "Profile Updated by Admin",
      message: `Your profile details were updated by an administrator. Reason: ${reason || "Policy violation/maintenance"}.`,
      type: "warning",
    });

    res.json({ message: "User profile updated and notification sent", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.dismissReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ message: "Report not found" });

    report.status = "Dismissed";
    await report.save();
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.resolveReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { suspensionHours, suspensionReason } = req.body;

    console.log(
      "[Admin] Resolving report:",
      reportId,
      "with suspension:",
      suspensionHours,
      "hours",
    );

    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ message: "Report not found" });

    // Handle Suspension
    if (suspensionHours && suspensionHours > 0) {
      const userToSuspend = await User.findById(report.reportedUser);
      if (userToSuspend) {
        const expires = new Date();
        expires.setHours(expires.getHours() + parseInt(suspensionHours));

        userToSuspend.suspensionExpires = expires;
        userToSuspend.suspensionReason =
          suspensionReason || "Violation of terms";
        await userToSuspend.save();

        console.log(
          "[Admin] User suspended:",
          userToSuspend.email,
          "until:",
          expires,
        );

        // Also create a notification for the user
        await Notification.create({
          user: userToSuspend._id,
          title: "Account Suspended",
          message: `Your account has been suspended for ${suspensionHours} hours. Reason: ${suspensionReason || "Violation of terms"}.`,
          type: "error",
        });
      }
    }

    report.status = "Resolved";
    await report.save();
    res.json(report);
  } catch (error) {
    console.error("Resolve Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Direct suspend user endpoint
exports.suspendUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { suspensionHours, suspensionReason } = req.body;

    console.log(
      "[Admin] Suspending user:",
      userId,
      "for",
      suspensionHours,
      "hours",
    );

    if (!suspensionHours || suspensionHours <= 0) {
      return res
        .status(400)
        .json({ message: "Suspension hours must be greater than 0" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const expires = new Date();
    expires.setHours(expires.getHours() + parseInt(suspensionHours));

    user.suspensionExpires = expires;
    user.suspensionReason = suspensionReason || "Violation of terms";
    await user.save();

    console.log(
      "[Admin] User suspended successfully:",
      user.email,
      "until:",
      expires,
    );

    // Create notification
    await Notification.create({
      user: user._id,
      title: "Account Suspended",
      message: `Your account has been suspended for ${suspensionHours} hours. Reason: ${suspensionReason || "Violation of terms"}.`,
      type: "error",
    });

    res.json({
      message: "User suspended successfully",
      suspensionExpires: expires,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("[Admin] Suspend Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
