const Attendance = require('../models/Attendance');
const User = require('../models/User');

// Teacher: Mark attendance for a student
exports.markAttendance = async (req, res) => {
  const { studentId, date, status } = req.body;
  try {
    // Check if student exists and is a student
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }
    // Prevent duplicate attendance for same student/date
    const existing = await Attendance.findOne({ student: studentId, date: new Date(date) });
    if (existing) {
      return res.status(400).json({ message: 'Attendance already marked for this date' });
    }
    const attendance = new Attendance({
      student: studentId,
      date: new Date(date),
      status,
      markedBy: req.user.userId,
    });
    await attendance.save();
    res.status(201).json({ message: 'Attendance marked' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Student: View own attendance
exports.getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.user.userId })
      .sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 