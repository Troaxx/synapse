const Report = require("../models/Report");
const Notification = require("../models/Notification");

exports.createReport = async (req, res) => {
  try {
    const { reportedUserId, sessionId, reason, details } = req.body;

    const report = new Report({
      reporter: req.user.userId,
      reportedUser: reportedUserId,
      session: sessionId || null,
      reason,
      details,
    });

    await report.save();

    // Notify Reporter
    await Notification.create({
      user: req.user.userId,
      title: "Report Submitted",
      message: "Your report has been submitted and is under review.",
      type: "info",
    });

    res.status(201).json({ message: "Report submitted successfully", report });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
