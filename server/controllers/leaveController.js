const Leave = require('../models/Leave');
const User = require('../models/User');

// Student applies for leave
exports.studentApplyLeave = async (req, res) => {
  const { fromDate, toDate, reason } = req.body;
  try {
    const leave = new Leave({
      student: req.user.userId,
      fromDate,
      toDate,
      reason,
      status: 'Pending',
    });
    await leave.save();
    res.status(201).json({ message: 'Leave applied' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Teacher reviews (accepts/rejects) a leave
exports.teacherReviewLeave = async (req, res) => {
  const { leaveId } = req.params;
  const { status } = req.body; // 'Accepted' or 'Rejected'
  try {
    const leave = await Leave.findById(leaveId);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    if (leave.status !== 'Pending') return res.status(400).json({ message: 'Leave already reviewed' });
    leave.status = status;
    leave.reviewedBy = req.user.userId;
    leave.reviewedAt = new Date();
    await leave.save();
    res.json({ message: 'Leave reviewed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Get all leaves
exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate('student', 'name email').populate('reviewedBy', 'name role').sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Student: Get my leaves
exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ student: req.user.userId }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Teacher: Get all pending leaves
exports.getPendingLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ status: 'Pending' }).populate('student', 'name email').sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 